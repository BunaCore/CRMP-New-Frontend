"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { useEditor } from "@tiptap/react";
import { toast } from "sonner";

import { useCollabProvider } from "@/hooks/useCollabProvider";
import { useDocumentEditor } from "@/hooks/useDocumentEditor";
import { cn } from "@/lib/utils";

import { CollabAwarenessBar } from "./editor/collab-awareness-bar";
import { EditorBubbleMenu } from "./editor/editor-bubble-menu";
import { EditorFloatingMenu } from "./editor/editor-floating-menu";
import { EditorShell } from "./editor/editor-shell";
import { EditorToolbar } from "./editor/editor-toolbar";
import { ImportMarkdownModal } from "./editor/import-markdown-modal";
import { PagedEditorCanvas } from "./editor/paged-editor-canvas";
import "./editor.css";

// ─── Props ────────────────────────────────────────────────────

interface DocumentEditorProps {
  workspaceId: string;
  projectId: string;
}

// ─── Component ────────────────────────────────────────────────

export default function DocumentEditor({ workspaceId, projectId }: DocumentEditorProps) {
  // ── 1. Server state hook (save / load / version / import / export) ──
  // Unchanged from solo mode — runs in all cases.
  const doc = useDocumentEditor(projectId, workspaceId);
  const [isImportOpen, setIsImportOpen] = useState(false);

  // ── 2. Collab provider hook ──────────────────────────────────
  // Reads isSoloProject from WorkspaceContext (loaded once there).
  // Returns the correct extension array (collab or base) and isReady gate.
  const collab = useCollabProvider(workspaceId);

  // ── 3. Refs ──────────────────────────────────────────────────
  //
  // titleRef: always holds the current title, read inside onUpdate
  //   closure without causing the closure to go stale.
  const titleRef = useRef(doc.title);
  useEffect(() => {
    titleRef.current = doc.title;
  }, [doc.title]);

  // hydratedRef: gate that ensures setContent fires exactly once
  //   per workspaceId in solo mode. Collab mode bypasses this
  //   (Y.js owns the content — setContent must NOT be called).
  const hydratedRef = useRef(false);
  // biome-ignore lint/correctness/useExhaustiveDependencies: Must reset when workspace changes on soft-navigation
  useEffect(() => {
    hydratedRef.current = false;
  }, [workspaceId]);

  // ── 4. TipTap editor instance ────────────────────────────────
  //
  // `collab.extensions` is stable once `collab.isReady` is true.
  // EditorShell holds the loading gate until both doc AND collab
  // are ready, so by the time the editor is visible the extensions
  // are already final — no recreation occurs after first render.
  const editor = useEditor(
    {
      extensions: collab.extensions,
      content: null, // Hydrated below (solo) or via Y.js (collab)
      immediatelyRender: false,
      editorProps: {
        attributes: {
          class: cn(
            "prose prose-lg dark:prose-invert",
            "focus:outline-none",
            "max-w-none w-full",
            "min-h-0",
            "selection:bg-primary/20",
            "editor-page-content",
          ),
          spellcheck: "true",
        },
      },
      onUpdate: ({ editor, transaction }) => {
        // Always update word count regardless of who made the change.
        const words = (editor.storage.characterCount as { words: () => number }).words();
        doc.setWordCount(words);

        // In collab mode, Y.js tags inbound peer transactions with 'y-sync$'.
        // Skip autosave for those — only the user who typed locally should
        // trigger the debounced server save. This prevents N peers all
        // writing to the server simultaneously on every remote change.
        if (collab.isActive && transaction.getMeta("y-sync$")) return;

        const json = editor.getJSON();
        doc.scheduleAutosave(json, titleRef.current);
      },
    },
    [collab.isActive],
  );

  // ── 5. Hydrate editor after load (solo mode only) ────────────
  //
  // In collab mode: Y.js owns the content — setContent MUST NOT
  // be called. The Y.Doc syncs the document automatically from the
  // WebSocket provider without any manual hydration step.
  //
  // In solo mode: hydrate exactly once via setContent, same as before.
  useEffect(() => {
    if (!editor || editor.isDestroyed || hydratedRef.current) return;
    if (doc.loadStatus !== "loaded") return;
    if (!collab.isReady) return; // wait for collab resolution

    if (collab.isActive) {
      // Collab mode: Y.js handles content — just focus and mark ready
      hydratedRef.current = true;
      editor.commands.focus("end");
      return;
    }

    // Solo mode: manual one-time hydration
    const initialContent = doc.getInitialContent();
    if (!initialContent) return;

    hydratedRef.current = true;
    editor.commands.setContent(initialContent, { emitUpdate: false });
    editor.commands.focus("end");
  }, [doc.loadStatus, collab.isReady, collab.isActive, editor, doc]);

  // ── 6. Keyboard shortcuts ────────────────────────────────────

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "s") {
        e.preventDefault();
        if (editor) void doc.saveNow(editor.getJSON(), titleRef.current);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [editor, doc]);

  useEffect(() => {
    const handleVisibility = () => {
      // In collab mode each peer independently autosaves their own changes.
      // Skipping the visibility-save avoids duplicate writes when all peers
      // switch tabs simultaneously (e.g., alt-tab during a meeting).
      if (collab.isActive) return;
      if (editor && doc.isDirty) {
        void doc.saveNow(editor.getJSON(), titleRef.current);
      }
    };

    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (doc.isDirty) {
        e.preventDefault();
        e.returnValue = "";
      }
    };

    window.addEventListener("visibilitychange", handleVisibility);
    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("visibilitychange", handleVisibility);
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [editor, doc, collab.isActive]);

  // ── 7. Insert helpers ────────────────────────────────────────

  const handleAddImage = useCallback(() => {
    if (!editor) return;
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.onchange = () => {
      const file = input.files?.[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = (e) => {
        const base64Str = e.target?.result as string;
        editor.chain().focus().setImage({ src: base64Str }).run();
      };
      reader.readAsDataURL(file);
    };
    input.click();
  }, [editor]);

  const handleSetLink = useCallback(() => {
    if (!editor) return;
    const previous = editor.getAttributes("link").href as string | undefined;
    const url = window.prompt("Link URL", previous ?? "");
    if (url === null) return;
    if (url === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }
    editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
  }, [editor]);

  // ── 8. Title change handler ──────────────────────────────────

  const handleTitleChange = useCallback(
    (newTitle: string) => {
      titleRef.current = newTitle;
      doc.updateTitle(newTitle);
      if (!editor) return;
      doc.scheduleAutosave(editor.getJSON(), newTitle);
    },
    [editor, doc],
  );

  // ── 9. Restore handler ───────────────────────────────────────

  const handleRestoreVersion = useCallback(
    async (versionId: string) => {
      const restored = await doc.restoreNamedVersion(versionId);
      if (editor && restored) {
        // In collab mode: TipTap v3's Collaboration extension routes setContent
        // through the Y.Doc, so this change propagates to all peers automatically.
        // emitUpdate: false prevents a local autosave loop on the restoring peer.
        editor.commands.setContent(restored.document.content, { emitUpdate: false });
        editor.commands.focus("end");
      }
    },
    [editor, doc],
  );

  // ── 10. Import / Export handlers ─────────────────────────────

  const handleImportText = useCallback(
    async (text: string) => {
      if (!editor) return;
      await doc.createNamedVersion("Pre-import snapshot");
      const result = await doc.importFromMarkdown(text);
      // In collab mode: setContent routes through Y.Doc, peers see the import.
      // emitUpdate: false prevents duplicate autosave on the importing peer.
      editor.commands.setContent(result, { emitUpdate: false });
      doc.saveNow(result, titleRef.current);
    },
    [editor, doc],
  );

  const handleExport = useCallback(
    (format: "pdf" | "markdown") => {
      const promise = doc.exportAs(format, titleRef.current);
      toast.promise(promise, {
        loading: `Preparing ${format.toUpperCase()} export...`,
        success: `Downloaded ${titleRef.current}.${format === "pdf" ? "pdf" : "md"}`,
        error: `Failed to export as ${format.toUpperCase()}`,
      });
    },
    [doc],
  );

  // ── 11. Render ────────────────────────────────────────────────

  return (
    <EditorShell
      workspaceId={workspaceId}
      loadStatus={doc.loadStatus}
      collabIsReady={collab.isReady}
      isVersionPanelOpen={doc.isVersionPanelOpen}
      versions={doc.versions}
      onRetry={() => window.location.reload()}
      onCloseVersionPanel={() => doc.setVersionPanelOpen(false)}
      onRestoreVersion={handleRestoreVersion}
      onCreateSnapshot={async () => {
        await doc.createNamedVersion();
      }}
    >
      {/* Toolbar — memoized, only re-renders on editor transaction */}
      <EditorToolbar
        editor={editor}
        projectId={projectId}
        title={doc.title}
        onTitleChange={handleTitleChange}
        onAddImage={handleAddImage}
        onSetLink={handleSetLink}
        onToggleVersionPanel={doc.toggleVersionPanel}
        onImportMarkdownClick={() => setIsImportOpen(true)}
        onExportPdf={() => handleExport("pdf")}
        onExportMarkdown={() => handleExport("markdown")}
        rightSlot={<CollabAwarenessBar projectId={projectId} />}
      />

      {/* Scrollable editor canvas */}
      <div className="relative flex-1 overflow-hidden">
        <div className="custom-scrollbar absolute inset-0 w-full overflow-y-auto scroll-smooth">
          <PagedEditorCanvas editor={editor} />
        </div>
      </div>

      {/* Context menus (only rendered when editor is ready) */}
      {editor && (
        <>
          <EditorBubbleMenu editor={editor} onSetLink={handleSetLink} />
          <EditorFloatingMenu editor={editor} onAddImage={handleAddImage} />
        </>
      )}

      {/* Modals */}
      <ImportMarkdownModal isOpen={isImportOpen} onClose={() => setIsImportOpen(false)} onImport={handleImportText} />
    </EditorShell>
  );
}
