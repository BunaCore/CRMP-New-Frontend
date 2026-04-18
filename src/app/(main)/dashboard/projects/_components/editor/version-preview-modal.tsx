"use client";

// ============================================================
// VersionPreviewModal
//
// Full-screen overlay that shows a read-only TipTap view of
// a specific version snapshot. Provides a safe two-step
// restore flow: [Preview] → [Restore] → [Confirm] → apply.
//
// Design decisions:
//   - Read-only TipTap instance (editable: false) so users
//     cannot accidentally edit the preview.
//   - Visually distinct from the live editor: muted banner,
//     no toolbar, pointer-events off for TipTap controls.
//   - Two-step confirm prevents accidental rollback.
//   - The modal fetches full version content on open; the
//     panel only holds lightweight summaries.
//   - Uses same EDITOR_EXTENSIONS for schema consistency.
// ============================================================

import { useEffect, useState } from "react";

import { EditorContent, useEditor } from "@tiptap/react";
import { format, formatDistanceToNow } from "date-fns";
import {
  AlertCircle,
  ArrowLeft,
  Calendar,
  CheckCheck,
  Clock,
  Eye,
  GitBranch,
  Loader2,
  RotateCcw,
  X,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { fetchVersion } from "@/lib/api/editor/queries";
import { cn } from "@/lib/utils";
import type { DocumentVersion, DocumentVersionSummary } from "@/types/editor";

import { EDITOR_EXTENSIONS } from "./extensions";

// ─── Types ────────────────────────────────────────────────────

interface VersionPreviewModalProps {
  /** The lightweight summary used to show metadata before content loads */
  version: DocumentVersionSummary | null;
  workspaceId: string;
  currentDocVersion: number;
  onClose: () => void;
  onRestore: (versionId: string) => Promise<void>;
}

// ─── Restore confirmation states ─────────────────────────────

type ConfirmState = "idle" | "confirming" | "restoring" | "done" | "error";

function RestoreFooter({
  version,
  isCurrent,
  onRestore,
  onClose,
}: {
  version: DocumentVersion;
  isCurrent: boolean;
  onRestore: (id: string) => Promise<void>;
  onClose: () => void;
}) {
  const [state, setState] = useState<ConfirmState>("idle");

  if (isCurrent) {
    return (
      <div className="flex items-center justify-center gap-2 border-t bg-muted/10 px-6 py-4">
        <CheckCheck className="h-4 w-4 text-primary" />
        <span className="text-muted-foreground text-sm">This is the current version</span>
      </div>
    );
  }

  const handleRestore = async () => {
    setState("restoring");
    try {
      await onRestore(version.id);
      setState("done");
      // Close modal after brief success indication
      setTimeout(onClose, 1_200);
    } catch {
      setState("error");
      setTimeout(() => setState("idle"), 3_000);
    }
  };

  return (
    <div className="flex items-center justify-between gap-4 border-t bg-card px-6 py-4">
      {/* Left: safe-to-undo notice */}
      <p className="text-muted-foreground/60 text-xs">
        Restoring creates a new snapshot of the current document first.
      </p>

      {/* Right: action buttons */}
      <div className="flex shrink-0 items-center gap-2">
        {state === "idle" && (
          <Button variant="outline" size="sm" className="gap-2" onClick={() => setState("confirming")}>
            <RotateCcw className="h-3.5 w-3.5" />
            Restore this version
          </Button>
        )}

        {state === "confirming" && (
          <>
            <span className="text-muted-foreground text-xs">Replace current document?</span>
            <Button variant="ghost" size="sm" onClick={() => setState("idle")}>
              Cancel
            </Button>
            <Button variant="destructive" size="sm" className="gap-2" onClick={handleRestore}>
              <RotateCcw className="h-3.5 w-3.5" />
              Yes, restore
            </Button>
          </>
        )}

        {state === "restoring" && (
          <Button variant="outline" size="sm" disabled className="gap-2">
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
            Restoring…
          </Button>
        )}

        {state === "done" && (
          <Button variant="ghost" size="sm" className="gap-2 text-emerald-600" disabled>
            <CheckCheck className="h-3.5 w-3.5" />
            Restored
          </Button>
        )}

        {state === "error" && (
          <Button variant="ghost" size="sm" className="gap-2 text-destructive" disabled>
            <AlertCircle className="h-3.5 w-3.5" />
            Restore failed
          </Button>
        )}
      </div>
    </div>
  );
}

// ─── Read-only TipTap preview ─────────────────────────────────

function ReadOnlyPreview({ version }: { version: DocumentVersion }) {
  const editor = useEditor({
    extensions: EDITOR_EXTENSIONS,
    content: version.content,
    editable: false,
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class: cn(
          "prose prose-lg dark:prose-invert",
          "max-w-[800px] mx-auto",
          "p-4 sm:p-12 lg:p-16",
          "min-h-[60vh]",
          "select-text", // allow copying text from the preview
          "focus:outline-none",
        ),
      },
    },
  });

  return <EditorContent editor={editor} className="w-full" />;
}

// ─── Modal ────────────────────────────────────────────────────

export function VersionPreviewModal({
  version: summary,
  workspaceId,
  currentDocVersion,
  onClose,
  onRestore,
}: VersionPreviewModalProps) {
  const [fullVersion, setFullVersion] = useState<DocumentVersion | null>(null);
  const [loadError, setLoadError] = useState(false);

  // Fetch full content when modal opens (panel only holds summaries)
  useEffect(() => {
    if (!summary) return;
    setFullVersion(null);
    setLoadError(false);

    fetchVersion(workspaceId, summary.id)
      .then(setFullVersion)
      .catch(() => setLoadError(true));
  }, [summary, workspaceId]);

  // Trap focus escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  const isOpen = Boolean(summary);
  const isCurrent = summary ? summary.versionNumber === currentDocVersion : false;

  return (
    <>
      {/* Backdrop */}
      {/* biome-ignore lint/a11y/useKeyWithClickEvents: Backdrop convenience */}
      {/* biome-ignore lint/a11y/noStaticElementInteractions: Backdrop */}
      <div
        className={cn(
          "fixed inset-0 z-40 bg-background/80 backdrop-blur-sm",
          "transition-opacity duration-300",
          isOpen ? "opacity-100" : "pointer-events-none opacity-0",
        )}
        onClick={onClose}
      />

      {/* Modal panel */}
      <div
        className={cn(
          "fixed inset-4 z-50 flex flex-col overflow-hidden rounded-2xl border bg-card shadow-2xl",
          "transition-all duration-300 ease-out",
          isOpen ? "scale-100 opacity-100" : "pointer-events-none scale-95 opacity-0",
        )}
      >
        {/* ── Header ─────────────────────────────────────────── */}
        <div className="flex items-center justify-between border-b bg-muted/10 px-6 py-4">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 rounded-full"
              onClick={onClose}
              title="Back to version list"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>

            <div className="flex flex-col gap-0.5">
              <div className="flex items-center gap-2">
                <GitBranch className="h-3.5 w-3.5 text-muted-foreground" />
                <span className="font-semibold text-sm">{summary ? `Snapshot v${summary.versionNumber}` : "…"}</span>
                {isCurrent && (
                  <span className="rounded-full bg-primary/10 px-2 py-0.5 font-bold text-[9px] text-primary uppercase tracking-wider">
                    current
                  </span>
                )}
              </div>

              {summary && (
                <div className="flex items-center gap-3 text-[11px] text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {formatDistanceToNow(new Date(summary.createdAt), { addSuffix: true })}
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {format(new Date(summary.createdAt), "MMM d, yyyy · HH:mm")}
                  </span>
                  <span className="max-w-xs truncate text-primary/70 uppercase tracking-widest opacity-60">
                    {summary.sourceAction} • by {summary.createdBy.split("-")[0]}
                  </span>
                </div>
              )}
            </div>
          </div>

          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* ── Read-only banner ────────────────────────────────── */}
        <div className="flex items-center justify-center gap-2 border-b bg-amber-500/5 px-6 py-2">
          <Eye className="h-3.5 w-3.5 text-amber-600 dark:text-amber-400" />
          <span className="font-medium text-[11px] text-amber-700 uppercase tracking-widest dark:text-amber-400">
            Preview Mode — Read Only
          </span>
        </div>

        {/* ── Content area ───────────────────────────────────── */}
        <div className="flex-1 overflow-y-auto bg-background">
          {!fullVersion && !loadError && (
            <div className="flex h-full items-center justify-center">
              <div className="flex flex-col items-center gap-4">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground/40" />
                <p className="text-muted-foreground text-sm">Loading snapshot…</p>
              </div>
            </div>
          )}

          {loadError && (
            <div className="flex h-full items-center justify-center">
              <div className="flex flex-col items-center gap-4 text-center">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-destructive/10">
                  <AlertCircle className="h-7 w-7 text-destructive" />
                </div>
                <div>
                  <p className="font-semibold">Failed to load snapshot</p>
                  <p className="mt-1 text-muted-foreground text-sm">Could not fetch version content. Try again.</p>
                </div>
              </div>
            </div>
          )}

          {fullVersion && <ReadOnlyPreview version={fullVersion} />}
        </div>

        <Separator />

        {/* ── Footer: restore actions ─────────────────────────── */}
        {fullVersion && summary && (
          <RestoreFooter version={fullVersion} isCurrent={isCurrent} onRestore={onRestore} onClose={onClose} />
        )}
      </div>
    </>
  );
}
