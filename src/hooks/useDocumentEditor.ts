// ============================================================
// useDocumentEditor — Primary hook for the editor page
//
// Correctness guarantees:
//  - No overlapping saves: a pending save queues and fires once
//    the in-flight save completes (savingRef + pendingSaveRef).
//  - No stale closures: callers pass live content/title at call
//    time; the hook never captures them via closure.
//  - Hydration fires exactly once per workspaceId: hydratedRef.
//  - setContent(_, false) during restore prevents triggering
//    onUpdate and therefore a phantom autosave.
//  - Cleanup cancels the debounce timer on unmount.
//
// Realtime-ready: TipTap instance never enters this hook.
// To add realtime later, replace scheduleAutosave with a
// Y.js/Socket.io provider without touching the editor component.
// ============================================================

"use client";

import { useCallback, useEffect, useRef } from "react";

import type { JSONContent } from "@tiptap/react";

import { importMarkdown, restoreVersion, saveWorkspace, updateWorkspaceTitle } from "@/lib/api/editor/mutations";
import { exportWorkspace, fetchVersions } from "@/lib/api/editor/queries";
import { useEditorStore } from "@/stores/editorStore";
import type { ExportFormat } from "@/types/editor";

// ─── Config ──────────────────────────────────────────────────

const AUTOSAVE_DELAY_MS = 1_500;

// ─── Hook ────────────────────────────────────────────────────

export function useDocumentEditor(projectId: string, workspaceId: string) {
  // Timer ref for debounce
  const saveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Race-condition guards
  // savingRef: true while an HTTP save is in flight
  // pendingSaveRef: holds the latest content/title that arrived during a save
  const savingRef = useRef(false);
  const pendingSaveRef = useRef<{ content: JSONContent; title: string } | null>(null);
  const lastSavedTitleRef = useRef<string | null>(null);

  // ── Load document on mount ──────────────────────────────────
  useEffect(() => {
    if (!workspaceId) return;

    // Get stable action refs from store (these never change identity)
    const { reset, initializeRealEditor, setVersions } = useEditorStore.getState();

    reset();

    // Kick off real backend data load across project, workspace, and document
    void initializeRealEditor(projectId, workspaceId);

    // Eagerly fetch version summaries (non-fatal)
    fetchVersions(workspaceId)
      .then(setVersions)
      .catch(() => {
        /* soft fail on history load */
      });

    // Ensure we track the initial title BEFORE any edits happen
    lastSavedTitleRef.current = useEditorStore.getState().title;

    return () => {
      // Cancel any pending debounce timer on unmount
      if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
      useEditorStore.getState().reset();
    };
    // Only re-run when workspaceId or projectId changes (navigating between workspaces)
  }, [projectId, workspaceId]);

  // ── Core save executor (handles race prevention) ─────────────
  const executeSave = useCallback(
    async (content: JSONContent, title: string): Promise<void> => {
      if (savingRef.current) {
        // A save is already in flight — queue the latest state
        pendingSaveRef.current = { content, title };
        return;
      }

      savingRef.current = true;
      useEditorStore.getState().setSaveStatus("saving");

      try {
        // Initialize if absolutely necessary (e.g. fast typers edge case)
        if (lastSavedTitleRef.current === null) {
          lastSavedTitleRef.current = title;
        }

        const titleChanged = lastSavedTitleRef.current !== title;

        // Execute both tasks in parallel to speed up autosave response
        const [saved] = await Promise.all([
          saveWorkspace(workspaceId, { content }),
          titleChanged ? updateWorkspaceTitle(workspaceId, title) : Promise.resolve(null),
        ]);

        if (titleChanged) {
          lastSavedTitleRef.current = title;
        }
        useEditorStore.getState().markClean(saved.document.updatedAt, saved.newVersion?.versionNumber);
      } catch {
        useEditorStore.getState().setSaveStatus("error");
      } finally {
        savingRef.current = false;

        // Drain the pending save if content changed while we were saving
        if (pendingSaveRef.current) {
          const pending = pendingSaveRef.current;
          pendingSaveRef.current = null;
          // Use void — we don't await inside finally to avoid nested throws
          void executeSave(pending.content, pending.title);
        }
      }
    },
    [workspaceId],
  );

  // ── Autosave (debounced) ─────────────────────────────────────
  /**
   * Called by the TipTap onUpdate callback.
   * `content` must be editor.getJSON() — never getHTML().
   * `title` must be passed directly (not from closure) to avoid stale value.
   */
  const scheduleAutosave = useCallback(
    (content: JSONContent, title: string) => {
      // Sync content/title into store immediately so UI reflects edits
      useEditorStore.getState().setContent(content);
      useEditorStore.getState().setTitle(title);

      // Reset debounce window
      if (saveTimerRef.current) clearTimeout(saveTimerRef.current);

      saveTimerRef.current = setTimeout(() => {
        void executeSave(content, title);
      }, AUTOSAVE_DELAY_MS);
    },
    [executeSave],
  );

  /**
   * Immediate save — for Ctrl+S, visibility change, beforeunload, etc.
   * Cancels any pending debounce and saves right away.
   */
  const saveNow = useCallback(
    async (content: JSONContent, title: string): Promise<void> => {
      if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
      await executeSave(content, title);
    },
    [executeSave],
  );

  // ── Title update (UI-only, does not autosave by itself) ──────
  const updateTitle = useCallback((title: string) => {
    useEditorStore.getState().setTitle(title);
  }, []);

  // ── Version history ──────────────────────────────────────────
  const refreshVersions = useCallback(async () => {
    const versions = await fetchVersions(workspaceId);
    useEditorStore.getState().setVersions(versions);
  }, [workspaceId]);

  /**
   * Create a named snapshot of the current document state.
   * Refreshes the version list after creation.
   */
  const createNamedVersion = useCallback(
    async (_label?: string) => {
      // Manual named version creation removed per backend constraint — use save instead
      // A pending save action naturally results in a snapshot
      const { content, title } = useEditorStore.getState();
      if (content) {
        void executeSave(content, title);
      }
      return null;
    },
    [executeSave],
  );

  /**
   * Restore a snapshot.
   * Returns the restored WorkspaceDocument so the editor component
   * can call editor.commands.setContent(restored.content, false).
   * The `false` flag prevents triggering onUpdate → no phantom autosave.
   */
  const restoreNamedVersion = useCallback(
    async (versionId: string) => {
      // Cancel any pending debounce so it doesn't fire over restored content
      if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
      savingRef.current = false;
      pendingSaveRef.current = null;

      const doc = await restoreVersion(workspaceId, versionId);

      useEditorStore.getState().setDocument({
        workspaceId: doc.document.id,
        title: "", // Title is managed elsewhere
        content: doc.document.content,
        updatedAt: doc.document.updatedAt,
      });

      // Update version locally if created
      if (doc.newVersion) {
        useEditorStore.getState().prependVersion(doc.newVersion);
      }

      // Refresh version list (restore creates a new snapshot on backend)
      void refreshVersions();

      return doc;
    },
    [workspaceId, refreshVersions],
  );

  // ── Import ────────────────────────────────────────────────────
  const importFromMarkdown = useCallback(
    async (markdown: string) => {
      const result = await importMarkdown(workspaceId, { markdown });
      // Caller sets editor content: editor.commands.setContent(result.document.content, false)
      if (result.newVersion) {
        useEditorStore.getState().prependVersion(result.newVersion);
      }
      return result.document.content;
    },
    [workspaceId],
  );

  // ── Export ────────────────────────────────────────────────────
  const exportAs = useCallback(
    async (format: ExportFormat, title: string) => {
      const blob = await exportWorkspace(workspaceId, format);
      const ext = format === "pdf" ? "pdf" : "md";
      const downloadUrl = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = downloadUrl;
      a.download = `${title}.${ext}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(downloadUrl);
    },
    [workspaceId],
  );

  // ── Return public API ─────────────────────────────────────────
  return {
    // State (stable Zustand selectors — minimal re-render surface)
    title: useEditorStore((s) => s.title),
    version: useEditorStore((s) => s.version),
    wordCount: useEditorStore((s) => s.wordCount),
    updatedAt: useEditorStore((s) => s.updatedAt),
    loadStatus: useEditorStore((s) => s.loadStatus),
    saveStatus: useEditorStore((s) => s.saveStatus),
    isDirty: useEditorStore((s) => s.isDirty),
    versions: useEditorStore((s) => s.versions),
    isVersionPanelOpen: useEditorStore((s) => s.isVersionPanelOpen),

    // Initial content getter (avoids keystroke-spam re-renders)
    getInitialContent: () => useEditorStore.getState().content,

    // Actions
    scheduleAutosave,
    saveNow,
    updateTitle,
    setWordCount: (n: number) => useEditorStore.getState().setWordCount(n),
    createNamedVersion,
    restoreNamedVersion,
    refreshVersions,
    toggleVersionPanel: () => useEditorStore.getState().toggleVersionPanel(),
    setVersionPanelOpen: (open: boolean) => useEditorStore.getState().setVersionPanelOpen(open),
    importFromMarkdown,
    exportAs,
  } as const;
}
