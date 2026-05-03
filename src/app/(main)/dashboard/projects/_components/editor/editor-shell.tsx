"use client";

// ============================================================
// EditorShell
// Container that renders loading / error / empty / editor states.
// The actual TipTap EditorContent is slotted in via `children`.
// This component owns NO fetch logic — it receives state as props.
//
// Loading gate:
//   Shows <LoadingState> until BOTH conditions are true:
//     1. loadStatus === "loaded"   (document fetched from API)
//     2. collabIsReady === true    (collab provider resolved)
//   This prevents the editor from mounting with the wrong
//   extension set (solo vs collab) and avoids any visible flicker.
// ============================================================

import type { ReactNode } from "react";

import { AlertCircle, FileText, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { DocumentVersionSummary, LoadStatus } from "@/types/editor";

import { EditorStatusBar } from "./editor-status-bar";
import { VersionHistoryPanel } from "./version-history-panel";

interface EditorShellProps {
  // Identity
  workspaceId: string;

  // State
  loadStatus: LoadStatus;
  isVersionPanelOpen: boolean;
  versions: DocumentVersionSummary[];
  /**
   * Set to true once useCollabProvider has resolved (either solo or
   * collab active). The shell holds the loading gate until both
   * document load AND collab setup have completed, so the editor
   * always mounts with the correct final extension set.
   */
  collabIsReady: boolean;

  // Callbacks
  onRetry: () => void;
  onCloseVersionPanel: () => void;
  onRestoreVersion: (versionId: string) => Promise<void>;
  onCreateSnapshot: () => Promise<void>;

  // Slot: actual TipTap editor rendered here
  children: ReactNode;
}

function LoadingState() {
  return (
    <div className="flex flex-1 items-center justify-center">
      <div className="flex flex-col items-center gap-4 text-center">
        <div className="relative">
          <FileText className="h-12 w-12 text-muted-foreground/20" />
          <Loader2 className="-right-1 -bottom-1 absolute h-5 w-5 animate-spin text-primary" />
        </div>
        <div>
          <p className="font-semibold text-sm">Opening document…</p>
          <p className="mt-1 text-muted-foreground text-xs">Fetching latest content from server</p>
        </div>
      </div>
    </div>
  );
}

function ErrorState({ onRetry }: { onRetry: () => void }) {
  return (
    <div className="flex flex-1 items-center justify-center">
      <div className="flex max-w-sm flex-col items-center gap-4 text-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-destructive/10">
          <AlertCircle className="h-7 w-7 text-destructive" />
        </div>
        <div>
          <p className="font-semibold">Failed to load document</p>
          <p className="mt-1 text-muted-foreground text-sm">
            The workspace could not be fetched. Check your connection and try again.
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={onRetry}>
          Try again
        </Button>
      </div>
    </div>
  );
}

export function EditorShell({
  workspaceId,
  loadStatus,
  collabIsReady,
  isVersionPanelOpen,
  versions,
  onRetry,
  onCloseVersionPanel,
  onRestoreVersion,
  onCreateSnapshot,
  children,
}: EditorShellProps) {
  // Hold the loading gate until BOTH the document AND the collab
  // provider hook have resolved. This guarantees the editor always
  // mounts with the correct final extension set (solo or collab).
  const isStillLoading = loadStatus === "loading" || loadStatus === "idle" || !collabIsReady;

  return (
    <div className="relative flex h-full w-full min-w-0 flex-col overflow-hidden bg-background">
      {/* Main content area */}
      <div className="absolute inset-0 overflow-hidden pb-8">
        {/* Editor content slot */}
        <div
          className={cn(
            "flex h-full flex-col overflow-hidden",
            "transition-all duration-300 ease-in-out",
            isVersionPanelOpen && "mr-72", // shift left when version panel open
          )}
        >
          {isStillLoading ? (
            <LoadingState />
          ) : loadStatus === "error" ? (
            <ErrorState onRetry={onRetry} />
          ) : (
            // "loaded" + collabIsReady — render TipTap slot
            children
          )}
        </div>

        {/* Version history slide-over */}
        <div className="absolute top-0 right-0 bottom-0 z-30">
          <VersionHistoryPanel
            isOpen={isVersionPanelOpen}
            versions={versions}
            workspaceId={workspaceId}
            onClose={onCloseVersionPanel}
            onRestore={onRestoreVersion}
            onCreateSnapshot={onCreateSnapshot}
          />
        </div>
      </div>

      {/* Status bar — visible once fully loaded */}
      {!isStillLoading && loadStatus === "loaded" && (
        <div className="absolute right-0 bottom-0 left-0 z-40 h-8">
          <EditorStatusBar />
        </div>
      )}
    </div>
  );
}
