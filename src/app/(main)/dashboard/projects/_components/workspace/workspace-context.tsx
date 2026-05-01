"use client";

import { createContext, type ReactNode, useCallback, useContext, useEffect, useState } from "react";

import { useParams } from "next/navigation";

import { getPersistedAiMode, persistAiMode } from "@/lib/ai/model-config";
import type { AiMode } from "@/lib/ai/types";
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
  /** Name of the currently active workspace — passed as AI request context */
  workspaceName: string;
  loading: boolean;
  createWorkspace: (projectId: string, name: string) => Promise<string>;
  refreshWorkspaces: () => Promise<void>;
  // AI Copilot state
  aiMode: AiMode;
  setAiMode: (mode: AiMode) => void;
  selectedContext: string | null;
  setSelectedContext: (text: string | null) => void;
  prefillPrompt: string | null;
  setPrefillPrompt: (prompt: string | null) => void;
  autoSendTrigger: {
    prompt: string;
    context: string;
    timestamp: number;
    requestType?: import("@/lib/ai/types").AiRequestType;
    from?: number;
    to?: number;
  } | null;
  setAutoSendTrigger: (
    trigger: {
      prompt: string;
      context: string;
      timestamp: number;
      requestType?: import("@/lib/ai/types").AiRequestType;
      from?: number;
      to?: number;
    } | null,
  ) => void;
}

const WorkspaceContext = createContext<WorkspaceContextProps | undefined>(undefined);

export function WorkspaceProvider({ children }: { children: ReactNode }) {
  const { projectId } = useParams() as { projectId: string };

  // View & UI state
  const [activeView, setActiveView] = useState<ViewType>("editor");
  const [activeFile, setActiveFile] = useState<FileData | null>(null);
  const [files, setFiles] = useState<FileData[]>([]);
  const [isChatOpen, setIsChatOpen] = useState(true);

  // AI Copilot state
  const [aiMode, setAiMode] = useState<AiMode>(getPersistedAiMode);
  const [selectedContext, setSelectedContext] = useState<string | null>(null);
  const [prefillPrompt, setPrefillPrompt] = useState<string | null>(null);
  const [autoSendTrigger, setAutoSendTrigger] = useState<{
    prompt: string;
    context: string;
    timestamp: number;
    requestType?: import("@/lib/ai/types").AiRequestType;
    from?: number;
    to?: number;
  } | null>(null);

  // Persist mode changes so they survive navigation
  const handleSetAiMode = useCallback((mode: AiMode) => {
    setAiMode(mode);
    persistAiMode(mode);
  }, []);

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
        workspaceName: workspaces[0]?.name ?? "",
        loading,
        createWorkspace,
        refreshWorkspaces,

        // AI Copilot
        aiMode,
        setAiMode: handleSetAiMode,
        selectedContext,
        setSelectedContext,
        prefillPrompt,
        setPrefillPrompt,
        autoSendTrigger,
        setAutoSendTrigger,
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
