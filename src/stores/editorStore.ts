// ============================================================
// EDITOR ZUSTAND STORE
// Owns all client-side document state.
// The hook (useDocumentEditor) is the only consumer of this store.
// Components read from the hook — never from this store directly.
// ============================================================

import type { JSONContent } from "@tiptap/react";
import { create } from "zustand";
import { devtools } from "zustand/middleware";

import type { DocumentState, DocumentVersionSummary, LoadStatus, SaveStatus } from "@/types/editor";

// ─── Actions Interface ────────────────────────────────────────

interface EditorActions {
  // Initialization flow
  initializeRealEditor: (projectId: string, workspaceId: string) => Promise<void>;

  // Hydrate after fetch
  setDocument: (doc: { workspaceId: string; title: string; content: JSONContent; updatedAt: string }) => void;

  // Live edit updates (from TipTap onUpdate callback)
  setTitle: (title: string) => void;
  setContent: (content: JSONContent) => void;
  setWordCount: (count: number) => void;

  // Status flags
  setLoadStatus: (status: LoadStatus) => void;
  setSaveStatus: (status: SaveStatus) => void;
  markClean: (updatedAt: string, newVersionNumber?: number) => void; // called after successful save

  // Version history
  setVersions: (versions: DocumentVersionSummary[]) => void;
  prependVersion: (version: DocumentVersionSummary) => void;
  toggleVersionPanel: () => void;
  setVersionPanelOpen: (open: boolean) => void;

  // Reset (on route change / unmount)
  reset: () => void;
}

// ─── Initial State ────────────────────────────────────────────

const initialState: DocumentState = {
  workspaceId: null,
  projectId: null, // Stays in state for routing purposes only, though not heavily used
  title: "",
  content: null,
  version: 0,
  wordCount: 0,
  updatedAt: null,
  loadStatus: "idle",
  saveStatus: "idle",
  isDirty: false,
  versions: [],
  isVersionPanelOpen: false,
};

// ─── Store ────────────────────────────────────────────────────

import { fetchProjects, fetchWorkspaceDocument, fetchWorkspaces } from "@/lib/api/editor/queries";

export const useEditorStore = create<DocumentState & EditorActions>()(
  devtools(
    (set) => ({
      ...initialState,

      initializeRealEditor: async (projectId: string, workspaceId: string) => {
        set({ loadStatus: "loading", projectId, workspaceId }, false, "initializeRealEditor:start");
        try {
          // 1. Fetch projects
          const projects = await fetchProjects();
          const proj = projects.find((p) => p.projectId === projectId);
          if (!proj) throw new Error("Project not found");

          // 2. Fetch workspaces
          const workspaces = await fetchWorkspaces(projectId);
          const ws = workspaces.find((w) => w.id === workspaceId);
          if (!ws) throw new Error("Workspace not found");

          // 3. Load Document (content)
          const doc = await fetchWorkspaceDocument(workspaceId);

          set(
            {
              workspaceId: doc.workspaceId,
              content: doc.content,
              updatedAt: doc.updatedAt,
              title: ws.name, // The workspace name serves as the editor's active title
              isDirty: false,
              loadStatus: "loaded",
              saveStatus: "idle",
            },
            false,
            "initializeRealEditor:success",
          );
        } catch (error) {
          console.error("Editor init failed", error);
          set({ loadStatus: "error" }, false, "initializeRealEditor:error");
        }
      },

      setDocument: (doc) =>
        set(
          {
            workspaceId: doc.workspaceId,
            title: doc.title,
            content: doc.content,
            updatedAt: doc.updatedAt,
            isDirty: false,
            loadStatus: "loaded",
            saveStatus: "idle",
          },
          false,
          "setDocument",
        ),

      setTitle: (title) => set({ title, isDirty: true }, false, "setTitle"),

      setContent: (content) => set({ content, isDirty: true }, false, "setContent"),

      setWordCount: (wordCount) => set({ wordCount }, false, "setWordCount"),

      setLoadStatus: (loadStatus) => set({ loadStatus }, false, "setLoadStatus"),

      setSaveStatus: (saveStatus) => set({ saveStatus }, false, "setSaveStatus"),

      markClean: (updatedAt, newVersionNumber) =>
        set(
          (_state) => ({
            isDirty: false,
            saveStatus: "saved",
            updatedAt,
            ...(newVersionNumber ? { version: newVersionNumber } : {}),
          }),
          false,
          "markClean",
        ),

      setVersions: (versions) => set({ versions }, false, "setVersions"),

      prependVersion: (version) =>
        set((state) => ({ versions: [version, ...state.versions] }), false, "prependVersion"),

      toggleVersionPanel: () =>
        set((state) => ({ isVersionPanelOpen: !state.isVersionPanelOpen }), false, "toggleVersionPanel"),

      setVersionPanelOpen: (open) => set({ isVersionPanelOpen: open }, false, "setVersionPanelOpen"),

      reset: () => set(initialState, false, "reset"),
    }),
    { name: "editor-store" },
  ),
);
