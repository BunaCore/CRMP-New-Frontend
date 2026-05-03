// ============================================================
// COLLAB ZUSTAND STORE
//
// Tracks realtime collaboration state independently of editorStore.
// editorStore owns: document content, save state, version history.
// collabStore owns: connection state, peer presence.
//
// Components read from this store directly (fine for collab UI).
// The useCollabProvider hook is the only writer.
// ============================================================

import { create } from "zustand";
import { devtools } from "zustand/middleware";

// ─── Peer shape ───────────────────────────────────────────────

export interface CollabPeer {
  /** Backend user ID */
  userId: string;
  /** Display name from UserProfile.fullName */
  name: string;
  /** Deterministic color generated from userId */
  color: string;
}

// ─── Connection status ────────────────────────────────────────

export type CollabConnectionStatus =
  | "idle" // hook not yet started
  | "connecting" // WebSocket handshake in progress
  | "connected" // Y.js synced, room is live
  | "disconnected" // WS closed — y-websocket will auto-reconnect
  | "unauthorized" // server rejected token or project membership
  | "solo"; // project has 1 member — collab not needed

// ─── State + Actions ─────────────────────────────────────────

interface CollabState {
  /** Whether the collab session is active (editor uses Y.js extensions) */
  isActive: boolean;
  status: CollabConnectionStatus;
  /** All peers currently in the room, excluding the local user */
  peers: CollabPeer[];

  // Actions — only called from useCollabProvider
  setActive: (active: boolean) => void;
  setStatus: (status: CollabConnectionStatus) => void;
  setPeers: (peers: CollabPeer[]) => void;
  reset: () => void;
}

const initialState = {
  isActive: false,
  status: "idle" as CollabConnectionStatus,
  peers: [],
};

export const useCollabStore = create<CollabState>()(
  devtools(
    (set) => ({
      ...initialState,

      setActive: (isActive) => set({ isActive }, false, "collab/setActive"),
      setStatus: (status) => set({ status }, false, "collab/setStatus"),
      setPeers: (peers) => set({ peers }, false, "collab/setPeers"),
      reset: () => set(initialState, false, "collab/reset"),
    }),
    { name: "collab-store" },
  ),
);
