"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { useEditor } from "@tiptap/react";
import { toast } from "sonner";

import { useDocumentEditor } from "@/hooks/useDocumentEditor";
import { cn } from "@/lib/utils";

import { EditorBubbleMenu } from "./editor/editor-bubble-menu";
import { EditorFloatingMenu } from "./editor/editor-floating-menu";
import { EditorShell } from "./editor/editor-shell";
import { EditorToolbar } from "./editor/editor-toolbar";
import { EDITOR_EXTENSIONS } from "./editor/extensions";
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
  // ── 1. API/state hook ────────────────────────────────────────
  const doc = useDocumentEditor(projectId, workspaceId);
  const [isImportOpen, setIsImportOpen] = useState(false);

  // ── 2. Refs ──────────────────────────────────────────────────
  //
  // titleRef: always holds the current title, read inside onUpdate
  //   closure without causing the closure to go stale.
  const titleRef = useRef(doc.title);
  useEffect(() => {
    titleRef.current = doc.title;
  }, [doc.title]);

  // hydratedRef: gate that ensures setContent fires exactly once
  //   per workspaceId (not on every render where loadStatus changes).
  const hydratedRef = useRef(false);
  // biome-ignore lint/correctness/useExhaustiveDependencies: Must reset when workspace changes on soft-navigation
  useEffect(() => {
    hydratedRef.current = false;
  }, [workspaceId]);

  // ── 3. TipTap editor instance ────────────────────────────────
  //
  // EXTENSIONS come from module-level constants — never recreated.
  // Recreating extensions would destroy/rebuild the ProseMirror
  // schema, losing selection state and causing visible reflow.
  const editor = useEditor({
    extensions: EDITOR_EXTENSIONS,
    content: null, // Hydrated in useEffect below
    immediatelyRender: false, // Avoids SSR hydration mismatch
    editorProps: {
      attributes: {
        class: cn(
          "prose prose-lg dark:prose-invert",
          "focus:outline-none",
          "max-w-none w-full",
          "min-h-0", // Changed from min-h-screen to allow proper scrolling
          "selection:bg-primary/20",
          "editor-page-content", // Hook for pagination
        ),
        spellcheck: "true",
      },
    },
    onUpdate: ({ editor }) => {
      // JSON is the source of truth — never getHTML()
      // titleRef.current is always fresh (avoids stale closure)
      const json = editor.getJSON();
      const words = (editor.storage.characterCount as { words: () => number }).words();
      doc.setWordCount(words);
      doc.scheduleAutosave(json, titleRef.current);
    },
  });

  // ── 4. Hydrate editor exactly once after API load ────────────
  useEffect(() => {
    if (!editor || hydratedRef.current) return;
    if (doc.loadStatus !== "loaded") return;

    const initialContent = doc.getInitialContent();
    if (!initialContent) return;

    hydratedRef.current = true;
    // { emitUpdate: false } = do NOT emit onUpdate (prevents phantom autosave on load)
    editor.commands.setContent(initialContent, { emitUpdate: false });
    editor.commands.focus("end");
  }, [doc.loadStatus, editor, doc]);

  // ── 5. Keyboard shortcuts ────────────────────────────────────

  // Ctrl+S — immediate save (bypasses debounce)
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

  // Visibility change & BeforeUnload — flush/warn before tab closes
  useEffect(() => {
    const handleVisibility = () => {
      if (editor && doc.isDirty) {
        void doc.saveNow(editor.getJSON(), titleRef.current);
      }
    };

    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (doc.isDirty) {
        e.preventDefault();
        e.returnValue = ""; // Standard way to trigger browser "Leave site?" prompt
      }
    };

    window.addEventListener("visibilitychange", handleVisibility);
    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("visibilitychange", handleVisibility);
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [editor, doc]);

  // ── 6. Insert helpers ────────────────────────────────────────

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
        // @ts-expect-error - tiptap-extension-resize-image adds setImage but may not merge types into ChainedCommands
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

  // ── 7. Title change handler ──────────────────────────────────

  const handleTitleChange = useCallback(
    (newTitle: string) => {
      titleRef.current = newTitle;
      doc.updateTitle(newTitle);
      if (!editor) return;
      doc.scheduleAutosave(editor.getJSON(), newTitle);
    },
    [editor, doc],
  );

  // ── 8. Restore handler ───────────────────────────────────────

  const handleRestoreVersion = useCallback(
    async (versionId: string) => {
      const restored = await doc.restoreNamedVersion(versionId);
      if (editor && restored) {
        // { emitUpdate: false } = suppress onUpdate → no phantom autosave over restored content
        editor.commands.setContent(restored.document.content, { emitUpdate: false });
        editor.commands.focus("end");
      }
    },
    [editor, doc],
  );

  // ── 9. Import / Export Handlers ──────────────────────────────

  const handleImportText = useCallback(
    async (text: string) => {
      if (!editor) return;
      // 1. Create safety snapshot of current document
      await doc.createNamedVersion("Pre-import snapshot");
      // 2. Parse markdown to JSON via backend
      const result = await doc.importFromMarkdown(text);
      // 3. Replace editor content (suppress autosave)
      editor.commands.setContent(result, { emitUpdate: false });
      // 4. Reset dirty state and autosave queue
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

  // ── 10. Render ────────────────────────────────────────────────

  return (
    <EditorShell
      workspaceId={workspaceId}
      loadStatus={doc.loadStatus}
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
      />

      {/* Scrollable editor canvas - takes remaining height */}
      <div className="flex-1 overflow-hidden">
        <div className="custom-scrollbar h-[calc(100vh-80px)] w-full overflow-y-auto scroll-smooth">
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
