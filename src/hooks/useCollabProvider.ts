// ============================================================
// useCollabProvider — Realtime collab lifecycle hook
//
// Phase 4 wiring: this hook now manages the full lifecycle from
// "should collab run?" through "Y.js synced and ready to edit."
//
// Key behaviours added in Phase 4:
//   1. Waits for WorkspaceProvider to finish loading before
//      deciding solo vs collab (avoids stale isSoloProject).
//   2. Marks isReady ONLY after the Y.js 'synced' event fires —
//      prevents the editor from showing a blank canvas that fills
//      in afterward.
//   3. Timeout fallback (SYNC_TIMEOUT_MS): if the collab server
//      does not respond, degrades cleanly to solo mode so the
//      editor still works.
//   4. Authorisation rejection: if the backend closes the socket
//      with code 4403, marks status 'unauthorized' and falls back.
//
// isSoloProject is NOT checked here — it is the WorkspaceContext's
// authoritative gate. This hook only acts on its value.
//
// This hook is the ONLY writer to collabStore.
// This hook does NOT touch editorStore.
// ============================================================

"use client";

import { useEffect, useMemo, useRef, useState } from "react";

import type { AnyExtension } from "@tiptap/react";
import type { WebsocketProvider } from "y-websocket";
import type * as Y from "yjs";

import { EDITOR_EXTENSIONS } from "@/app/(main)/dashboard/projects/_components/editor/extensions";
import { useWorkspace } from "@/app/(main)/dashboard/projects/_components/workspace/workspace-context";
import { buildCollabExtensions } from "@/lib/collab/collab-extensions";
import { createCollabProvider } from "@/lib/collab/collab-provider";
import { useAuthStore } from "@/stores/authStore";
import { type CollabPeer, useCollabStore } from "@/stores/collabStore";

// ─── Constants ────────────────────────────────────────────────

/**
 * How long to wait for Y.js initial sync before giving up and
 * falling back to solo mode. 8 seconds is generous for LAN/localhost
 * and acceptable for slow connections.
 */
const SYNC_TIMEOUT_MS = 8_000;

// ─── Color palette ────────────────────────────────────────────

const PEER_COLORS = ["#6366f1", "#8b5cf6", "#ec4899", "#f59e0b", "#10b981", "#06b6d4", "#f43f5e", "#84cc16"];

export function generateUserColor(userId: string): string {
  let hash = 0;
  for (let i = 0; i < userId.length; i++) {
    hash = userId.charCodeAt(i) + ((hash << 5) - hash);
  }
  return PEER_COLORS[Math.abs(hash) % PEER_COLORS.length];
}

// ─── Return type ──────────────────────────────────────────────

export interface CollabProviderResult {
  /**
   * True once the solo/collab decision is made AND (in collab mode)
   * the Y.Doc has completed its initial sync from the server.
   * EditorShell holds <LoadingState> until this is true.
   */
  isReady: boolean;
  /** True when collab mode is active (team project, synced). */
  isActive: boolean;
  /** The Y.Doc instance. Null in solo mode or before sync. */
  ydoc: Y.Doc | null;
  /** Stable extension array — collab or solo. Never changes after isReady. */
  extensions: AnyExtension[];
}

// ─── Hook ─────────────────────────────────────────────────────

export function useCollabProvider(workspaceId: string): CollabProviderResult {
  const user = useAuthStore((s) => s.user);
  const token = useAuthStore((s) => s.access_token);

  // WorkspaceProvider fetches members and workspaces in parallel.
  // 'loading' is true until that fetch completes — isSoloProject is
  // unreliable (stale empty array) while loading is true.
  const { isSoloProject, loading: workspaceLoading } = useWorkspace();

  const { setActive, setStatus, setPeers, reset } = useCollabStore();

  const [isReady, setIsReady] = useState(false);
  const [isActive, setIsActive] = useState(false);

  const ydocRef = useRef<Y.Doc | null>(null);
  const providerRef = useRef<WebsocketProvider | null>(null);

  // ── Helpers ─────────────────────────────────────────────────

  /** Updates the peer list from Y.js awareness state. */
  function syncPeers(awareness: WebsocketProvider["awareness"], selfId: string) {
    const peers: CollabPeer[] = [];
    awareness.getStates().forEach((state: Record<string, unknown>, clientId: number) => {
      if (clientId === awareness.clientID) return;
      const u = state.user as { userId?: string; name?: string; color?: string } | undefined;
      if (!u?.userId || !u?.name) return;
      peers.push({
        userId: u.userId,
        name: u.name,
        color: u.color ?? generateUserColor(u.userId),
      });
    });
    if (selfId) setPeers(peers);
  }

  /** Tears down provider + ydoc. Safe to call multiple times. */
  function destroyProvider() {
    if (providerRef.current) {
      try {
        providerRef.current.awareness.setLocalState(null);
        providerRef.current.disconnect();
        providerRef.current.destroy();
      } catch {
        // ignore errors during cleanup
      }
      providerRef.current = null;
    }
    if (ydocRef.current) {
      try {
        ydocRef.current.destroy();
      } catch {
        // ignore
      }
      ydocRef.current = null;
    }
  }

  // ── Main effect ──────────────────────────────────────────────

  // biome-ignore lint/correctness/useExhaustiveDependencies: deps managed intentionally to avoid infinite loops
  useEffect(() => {
    // Prerequisites: user and token from auth store
    if (!workspaceId || !user || !token) return;

    // Block until WorkspaceProvider has finished loading members.
    // Without this guard, isSoloProject is [] (empty = solo) while
    // the members fetch is still in-flight, causing a false solo decision.
    if (workspaceLoading) return;

    // Snapshot mutable values into the closure so the async code
    // below always uses the values that were current at effect-run time.
    const currentUser = user;
    const currentToken = token;
    let cancelled = false;

    // ── Solo mode: skip collab immediately ──────────────────────
    if (isSoloProject) {
      setStatus("solo");
      setIsActive(false);
      setActive(false);
      setIsReady(true);
      return;
    }

    // ── Collab mode: async setup ─────────────────────────────────
    async function setup() {
      setStatus("connecting");

      // Dynamic import keeps Y.js out of the solo-mode bundle
      const { Doc } = await import("yjs");
      if (cancelled) return;

      const ydoc = new Doc();
      ydocRef.current = ydoc;

      const provider = createCollabProvider({
        workspaceId,
        ydoc,
        token: currentToken,
      });
      providerRef.current = provider;

      // ── Debug Logs ────────────────────────────────────────────
      provider.on("status", (e: { status: string }) => {
        console.log("[collab] status", e.status);
      });

      provider.on("sync", (isSynced: boolean) => {
        console.log("[collab] sync", isSynced);
      });

      provider.on("connection-close", () => {
        console.log("[collab] connection closed");
      });

      ydoc.on("update", (update: Uint8Array, origin: unknown) => {
        console.log("[collab] local ydoc update", update.length, origin);
      });

      provider.awareness.on("change", (changes: unknown, origin: unknown) => {
        console.log("[collab] awareness change", changes, origin);
      });

      // ── Awareness: peer presence ──────────────────────────────
      provider.awareness.on("change", () => {
        syncPeers(provider.awareness, currentUser.id);
      });

      provider.awareness.setLocalStateField("user", {
        userId: currentUser.id,
        name: currentUser.fullName,
        color: generateUserColor(currentUser.id),
      });

      // ── Connection status ─────────────────────────────────────
      provider.on("status", ({ status }: { status: "connecting" | "connected" | "disconnected" | "unauthorized" }) => {
        if (cancelled) return;
        if (status === "unauthorized") {
          setStatus("unauthorized");
          // Don't try to reconnect — destroy and fall back to solo
          destroyProvider();
          setIsActive(false);
          setActive(false);
          if (!cancelled) setIsReady(true);
          return;
        }
        setStatus(status === "connected" ? "connected" : status === "connecting" ? "connecting" : "disconnected");
      });

      // ── Sync gate + timeout fallback ─────────────────────────
      //
      // isReady is set TRUE only after the Y.Doc has completed its
      // initial sync from the server ('synced' event). This prevents
      // the editor mounting with an empty Y.Doc that fills in a moment
      // later — which would look like a content flash to users.
      //
      // If the server does not respond within SYNC_TIMEOUT_MS, we
      // destroy the provider and degrade gracefully to solo mode.
      // The editor will then hydrate from the API-fetched content
      // via the normal solo path in editor.tsx.
      let syncResolved = false;

      const syncTimeout = setTimeout(() => {
        if (syncResolved || cancelled) return;
        syncResolved = true;

        setStatus("disconnected");
        destroyProvider();

        // Degrade to solo mode — editor will use solo hydration
        setIsActive(false);
        setActive(false);
        if (!cancelled) setIsReady(true);
      }, SYNC_TIMEOUT_MS);

      provider.once("sync", (isSynced: boolean) => {
        if (syncResolved || cancelled) return;
        if (!isSynced) return; // provider connected but server sent no state yet

        syncResolved = true;
        clearTimeout(syncTimeout);

        if (!cancelled) {
          setIsActive(true);
          setActive(true);
          setIsReady(true);
        }
      });

      // Start the WebSocket connection after all listeners are bound
      provider.connect();
    }

    setup();

    return () => {
      cancelled = true;
      destroyProvider();
      reset();
      setIsReady(false);
      setIsActive(false);
    };
  }, [workspaceId, user?.id, token, isSoloProject, workspaceLoading]); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Stable extension array ───────────────────────────────────
  //
  // Computed once when isActive stabilises. After that it never
  // changes identity, so TipTap does not recreate the editor.
  const extensions = useMemo<AnyExtension[]>(() => {
    if (isActive && ydocRef.current) {
      return buildCollabExtensions(ydocRef.current) as AnyExtension[];
    }
    return EDITOR_EXTENSIONS as AnyExtension[];
  }, [isActive]);

  return { isReady, isActive, ydoc: ydocRef.current, extensions };
}
