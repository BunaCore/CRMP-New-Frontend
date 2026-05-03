"use client";

// ============================================================
// EditorStatusBar
// Shows save state, word count, and version badge.
// Pulls state directly from Zustand to prevent re-rendering the parent shell.
// ============================================================

import { CheckCheck, Clock, Loader2, Users, WifiOff } from "lucide-react";

import { cn } from "@/lib/utils";
import { useCollabStore } from "@/stores/collabStore";
import { useEditorStore } from "@/stores/editorStore";
import type { SaveStatus } from "@/types/editor";

function formatUpdatedAt(iso: string | null): string {
  if (!iso) return "";
  const d = new Date(iso);
  return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

function SaveIndicator({
  status,
  isDirty,
  updatedAt,
}: {
  status: SaveStatus;
  isDirty: boolean;
  updatedAt: string | null;
}) {
  if (status === "saving") {
    return (
      <span className="flex items-center gap-1.5 text-muted-foreground">
        <Loader2 className="h-3 w-3 animate-spin" />
        <span>Saving…</span>
      </span>
    );
  }

  if (status === "error") {
    return (
      <span className="flex items-center gap-1.5 text-destructive">
        <WifiOff className="h-3 w-3" />
        <span>Save failed — will retry</span>
      </span>
    );
  }

  if (isDirty) {
    return (
      <span className="flex items-center gap-1.5 text-amber-500 dark:text-amber-400">
        <span className="inline-block h-1.5 w-1.5 rounded-full bg-amber-500" />
        <span>Unsaved</span>
        <span className="text-muted-foreground/40">· Ctrl+S to save now</span>
      </span>
    );
  }

  if (status === "saved" && updatedAt) {
    return (
      <span className="flex items-center gap-1.5 text-emerald-500 dark:text-emerald-400">
        <CheckCheck className="h-3 w-3" />
        <span>Saved</span>
        <span className="flex items-center gap-1 text-muted-foreground/40">
          <Clock className="h-2.5 w-2.5" />
          {formatUpdatedAt(updatedAt)}
        </span>
      </span>
    );
  }

  return null;
}

export function EditorStatusBar() {
  const saveStatus = useEditorStore((s) => s.saveStatus);
  const isDirty = useEditorStore((s) => s.isDirty);
  const wordCount = useEditorStore((s) => s.wordCount);
  const version = useEditorStore((s) => s.version);
  const updatedAt = useEditorStore((s) => s.updatedAt);

  // Collab state — reads zero cost when collab is inactive
  const collabActive = useCollabStore((s) => s.isActive);
  const collabPeers = useCollabStore((s) => s.peers);
  const collabStatus = useCollabStore((s) => s.status);

  return (
    <div
      className={cn(
        "flex items-center justify-between border-t px-4 py-1",
        "font-mono text-[10px] text-muted-foreground/60 uppercase tracking-widest",
        isDirty && saveStatus !== "saving" && "bg-amber-500/3",
        saveStatus === "error" && "bg-destructive/3",
        (!isDirty || saveStatus === "saving") && "bg-muted/5",
      )}
    >
      {/* Left: save state */}
      <SaveIndicator status={saveStatus} isDirty={isDirty} updatedAt={updatedAt} />

      {/* Right: doc meta + collab peers */}
      <div className="flex items-center gap-4">
        {/* Collab peer count — only when active */}
        {collabActive && collabStatus === "connected" && (
          <span className="flex items-center gap-1 text-emerald-500 dark:text-emerald-400">
            <Users className="h-2.5 w-2.5" />
            {collabPeers.length + 1} live
          </span>
        )}
        {collabActive && collabStatus === "disconnected" && (
          <span className="flex items-center gap-1 text-amber-500">
            <WifiOff className="h-2.5 w-2.5" />
            Reconnecting
          </span>
        )}

        <span>{wordCount.toLocaleString()} words</span>
        {version > 0 && <span className="text-muted-foreground/30">v{version}</span>}
      </div>
    </div>
  );
}
