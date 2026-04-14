"use client";

// ============================================================
// VersionHistoryPanel + VersionPreviewModal wired together.
//
// UX flow:
//   1. Panel opens (slide-over) → shows version timeline list
//   2. User clicks a version row → PreviewModal opens
//   3. Modal shows read-only TipTap + metadata
//   4. User clicks "Restore this version" → confirmation step
//   5. User confirms → restore API called → modal + panel close
//
// This file owns the "which version is previewed" local state
// and composes both the panel and modal together.
// ============================================================

import { useState } from "react";

import { formatDistanceToNow } from "date-fns";
import { CheckCheck, Clock, GitBranch, History, Loader2, Plus, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { useEditorStore } from "@/stores/editorStore";
import type { DocumentVersionSummary } from "@/types/editor";

import { VersionPreviewModal } from "./version-preview-modal";

// ─── Props ────────────────────────────────────────────────────

interface VersionHistoryPanelProps {
  isOpen: boolean;
  versions: DocumentVersionSummary[];
  workspaceId: string;
  onClose: () => void;
  onRestore: (versionId: string) => Promise<void>;
  onCreateSnapshot: () => Promise<void>;
}

// ─── Create snapshot button ───────────────────────────────────

function CreateSnapshotButton({ onCreateSnapshot }: { onCreateSnapshot: () => Promise<void> }) {
  const [creating, setCreating] = useState(false);
  const [done, setDone] = useState(false);

  const handle = async () => {
    if (creating) return;
    setCreating(true);
    setDone(false);
    try {
      await onCreateSnapshot();
      setDone(true);
      setTimeout(() => setDone(false), 2_000);
    } finally {
      setCreating(false);
    }
  };

  return (
    <Button
      variant="outline"
      size="sm"
      disabled={creating}
      className={cn("w-full gap-2 text-xs", done && "border-emerald-500/30 text-emerald-600")}
      onClick={handle}
    >
      {creating ? (
        <Loader2 className="h-3.5 w-3.5 animate-spin" />
      ) : done ? (
        <CheckCheck className="h-3.5 w-3.5" />
      ) : (
        <Plus className="h-3.5 w-3.5" />
      )}
      {creating ? "Saving…" : done ? "Snapshot saved" : "Save Snapshot Now"}
    </Button>
  );
}

// ─── Single version row ───────────────────────────────────────

function VersionRow({
  version,
  isCurrent,
  onPreview,
}: {
  version: DocumentVersionSummary;
  isCurrent: boolean;
  onPreview: () => void;
}) {
  const ago = formatDistanceToNow(new Date(version.createdAt), { addSuffix: true });

  return (
    <button
      type="button"
      onClick={onPreview}
      className={cn(
        "group w-full rounded-lg px-3 py-2.5 text-left transition-colors",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50",
        isCurrent ? "bg-primary/8 ring-1 ring-primary/20" : "hover:bg-muted/50 active:bg-muted/80",
      )}
    >
      <div className="flex items-center gap-2">
        <GitBranch className="h-3 w-3 shrink-0 text-muted-foreground" />
        <span className="min-w-0 flex-1 truncate font-medium text-sm">Snapshot v{version.versionNumber}</span>
        {isCurrent && (
          <span className="shrink-0 rounded-full bg-primary/10 px-1.5 py-0.5 font-bold text-[9px] text-primary uppercase tracking-wider">
            current
          </span>
        )}
      </div>

      <div className="mt-0.5 flex items-center gap-1 pl-5">
        <Clock className="h-2.5 w-2.5 text-muted-foreground/50" />
        <span className="text-muted-foreground/60 text-xs">{ago}</span>
      </div>

      <p className="mt-0.5 truncate pl-5 text-[10px] text-muted-foreground/40 uppercase tracking-widest">
        {version.sourceAction} • by {version.createdBy.split("-")[0]}
      </p>

      {/* "Click to preview" hint — revealed on hover */}
      {!isCurrent && (
        <p className="mt-1 pl-5 font-medium text-[10px] text-primary/60 opacity-0 transition-opacity group-hover:opacity-100">
          Click to preview ↗
        </p>
      )}
    </button>
  );
}

// ─── Panel + Modal composed ───────────────────────────────────

export function VersionHistoryPanel({
  isOpen,
  versions,
  workspaceId,
  onClose,
  onRestore,
  onCreateSnapshot,
}: VersionHistoryPanelProps) {
  // Which version is being previewed
  const [previewVersion, setPreviewVersion] = useState<DocumentVersionSummary | null>(null);

  const currentVersion = useEditorStore((s) => s.version);

  const handleRestoreAndClose = async (versionId: string) => {
    await onRestore(versionId);
    // Close both modal and panel after restore
    setPreviewVersion(null);
    onClose();
  };

  return (
    <>
      {/* ── Slide-over panel ───────────────────────────────── */}
      <div
        className={cn(
          "absolute inset-y-0 right-0 z-30 flex w-72 flex-col border-l bg-card shadow-2xl",
          "transition-transform duration-300 ease-in-out",
          isOpen ? "translate-x-0" : "translate-x-full",
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b px-4 py-3">
          <div className="flex items-center gap-2">
            <History className="h-4 w-4 text-muted-foreground" />
            <h3 className="font-semibold text-sm">Version History</h3>
            {versions.length > 0 && (
              <span className="rounded-full bg-muted px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground">
                {versions.length}
              </span>
            )}
          </div>
          <Button variant="ghost" size="icon" className="h-7 w-7" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Create snapshot */}
        <div className="border-b px-4 py-3">
          <CreateSnapshotButton onCreateSnapshot={onCreateSnapshot} />
          <p className="mt-2 text-[10px] text-muted-foreground/40">Auto-snapshots are created on each save.</p>
        </div>

        {/* Version list */}
        <div className="flex-1 overflow-y-auto p-2">
          {versions.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-3 py-12 text-center">
              <History className="h-10 w-10 text-muted-foreground/20" />
              <div>
                <p className="font-medium text-muted-foreground text-sm">No snapshots yet</p>
                <p className="mt-1 text-muted-foreground/50 text-xs leading-relaxed">
                  Snapshots appear here after your first save. Use the button above to create one now.
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-0.5">
              {versions.map((v) => (
                <VersionRow
                  key={v.id}
                  version={v}
                  isCurrent={v.versionNumber === currentVersion}
                  onPreview={() => setPreviewVersion(v)}
                />
              ))}
            </div>
          )}
        </div>

        <Separator />
        <p className="px-4 py-2 text-center text-[10px] text-muted-foreground/30">Click any version to preview it</p>
      </div>

      {/* ── Preview modal (portal-like, fixed, z-50) ────────── */}
      <VersionPreviewModal
        version={previewVersion}
        workspaceId={workspaceId}
        currentDocVersion={currentVersion}
        onClose={() => setPreviewVersion(null)}
        onRestore={handleRestoreAndClose}
      />
    </>
  );
}
