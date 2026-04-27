"use client";

import { createContext, type ReactNode, useCallback, useContext, useEffect, useState } from "react";

import { useParams } from "next/navigation";

import { createWorkspace as apiCreateWorkspace } from "@/lib/api/editor/mutations";
import { fetchWorkspaces } from "@/lib/api/editor/queries";
import { fetchProjectMembers, type ProjectMember } from "@/lib/api/members/queries";
import type { WorkspaceInfo } from "@/types/editor";

export type ViewType = "editor" | "file-viewer";

export interface FileData {
  id: string;
  name: string;
  type: "pdf" | "docx" | "doc";
  content?: string; // HTML for docx extraction
}

interface WorkspaceContextProps {
  // Project identity — available to all workspace children without prop drilling
  projectId: string;

  // Project membership — loaded once at the workspace boundary.
  // This is the authoritative place for the project-scoped collab gate:
  //   isSoloProject === true  → single-user mode, no collab
  //   isSoloProject === false → team project, collab eligible
  projectMembers: ProjectMember[];
  isSoloProject: boolean;

  // View state
  activeView: ViewType;
  setActiveView: (view: ViewType) => void;
  activeFile: FileData | null;
  setActiveFile: (file: FileData | null) => void;
  files: FileData[];
  addFile: (file: FileData) => void;
  isChatOpen: boolean;
  setIsChatOpen: (open: boolean) => void;
  toggleChat: () => void;

  // Real data state
  workspaces: WorkspaceInfo[];
  loading: boolean;
  createWorkspace: (projectId: string, name: string) => Promise<string>;
  refreshWorkspaces: () => Promise<void>;
}

const WorkspaceContext = createContext<WorkspaceContextProps | undefined>(undefined);

export function WorkspaceProvider({ children }: { children: ReactNode }) {
  const { projectId } = useParams() as { projectId: string };

  // View & UI state
  const [activeView, setActiveView] = useState<ViewType>("editor");
  const [activeFile, setActiveFile] = useState<FileData | null>(null);
  const [files, setFiles] = useState<FileData[]>([]);
  const [isChatOpen, setIsChatOpen] = useState(true);

  // Real backend state
  const [workspaces, setWorkspaces] = useState<WorkspaceInfo[]>([]);
  const [projectMembers, setProjectMembers] = useState<ProjectMember[]>([]);
  const [loading, setLoading] = useState(true);

  const refreshWorkspaces = useCallback(async () => {
    if (!projectId) return;
    setLoading(true);
    try {
      // Fetch workspaces and project members in parallel.
      // Members are loaded here — at the project-scoped boundary — so any
      // component in the workspace tree can read isSoloProject without
      // making its own API call.
      const [data, members] = await Promise.all([
        fetchWorkspaces(projectId),
        fetchProjectMembers(projectId).catch(() => [] as ProjectMember[]),
      ]);
      setWorkspaces(data);
      setProjectMembers(members);
    } catch (error) {
      console.error("Failed to fetch workspaces", error);
    } finally {
      setLoading(false);
    }
  }, [projectId]);

  useEffect(() => {
    refreshWorkspaces();
  }, [refreshWorkspaces]);

  const addFile = (file: FileData) => {
    setFiles((prev) => [...prev, file]);
  };

  const toggleChat = () => {
    setIsChatOpen((prev) => !prev);
  };

  const createWorkspace = async (projectId: string, name: string) => {
    const newWs = await apiCreateWorkspace(projectId, { name });
    setWorkspaces((prev) => [...prev, newWs]);
    return newWs.id;
  };

  return (
    <WorkspaceContext.Provider
      value={{
        // Project identity — available to all children
        projectId,
        projectMembers,
        // isSoloProject: the frontend's authoritative gate for collab eligibility.
        // A project with 0 or 1 member does not qualify for collaborative editing.
        // Note: members API may return [] on failure — treated safely as solo mode.
        isSoloProject: projectMembers.length <= 1,

        activeView,
        setActiveView,
        activeFile,
        setActiveFile,
        files,
        addFile,
        isChatOpen,
        setIsChatOpen,
        toggleChat,
        workspaces,
        loading,
        createWorkspace,
        refreshWorkspaces,
      }}
    >
      {children}
    </WorkspaceContext.Provider>
  );
}

export function useWorkspace() {
  const context = useContext(WorkspaceContext);
  if (!context) {
    throw new Error("useWorkspace must be used within a WorkspaceProvider");
  }
  return context;
}
