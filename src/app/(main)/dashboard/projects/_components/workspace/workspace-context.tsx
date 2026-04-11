"use client";

import { createContext, type ReactNode, useContext, useEffect, useState } from "react";

import { mockWorkspaces, type Workspace } from "@/data/workspaces";

export type ViewType = "editor" | "file-viewer";

export interface FileData {
  id: string;
  name: string;
  type: "pdf" | "docx" | "doc";
  content?: string; // HTML for docx extraction
}

interface WorkspaceContextProps {
  activeView: ViewType;
  setActiveView: (view: ViewType) => void;
  activeFile: FileData | null;
  setActiveFile: (file: FileData | null) => void;
  files: FileData[];
  addFile: (file: FileData) => void;
  isChatOpen: boolean;
  setIsChatOpen: (open: boolean) => void;
  toggleChat: () => void;
  workspaceTitle: string;
  setWorkspaceTitle: (title: string) => void;
  workspaceContent: string;
  setWorkspaceContent: (content: string) => void;
  saveWorkspace: (id: string, title: string, content: string) => void;
  loadWorkspace: (id: string) => void;
  createWorkspace: (projectId: string, title: string) => string;
  allWorkspaces: Workspace[];
}

const WorkspaceContext = createContext<WorkspaceContextProps | undefined>(undefined);

export function WorkspaceProvider({ children }: { children: ReactNode }) {
  const [activeView, setActiveView] = useState<ViewType>("editor");
  const [activeFile, setActiveFile] = useState<FileData | null>(null);
  const [files, setFiles] = useState<FileData[]>([]);
  const [isChatOpen, setIsChatOpen] = useState(true);
  const [workspaceTitle, setWorkspaceTitle] = useState("");
  const [workspaceContent, setWorkspaceContent] = useState("");
  const [allWorkspaces, setAllWorkspaces] = useState<Workspace[]>([]);

  // Initialize with mock data or localStorage
  useEffect(() => {
    const saved = localStorage.getItem("crmp_workspaces");
    if (saved) {
      setAllWorkspaces(JSON.parse(saved));
    } else {
      setAllWorkspaces(mockWorkspaces);
      localStorage.setItem("crmp_workspaces", JSON.stringify(mockWorkspaces));
    }
  }, []);

  const addFile = (file: FileData) => {
    setFiles((prev) => [...prev, file]);
  };

  const toggleChat = () => {
    setIsChatOpen((prev) => !prev);
  };

  const saveWorkspace = (id: string, title: string, content: string) => {
    setAllWorkspaces((prev) => {
      // If workspace doesn't exist in the list (e.g. newly created on the fly), add it
      const exists = prev.some((ws) => ws.id === id);
      let updated: Workspace[];

      if (exists) {
        updated = prev.map((ws) =>
          ws.id === id ? { ...ws, title, content, updatedAt: new Date().toISOString() } : ws,
        );
      } else {
        // Find project from current projectId (might need to pass it or infer)
        // For simplicity, we assume we only save existing ones or we've pre-created them
        updated = prev;
      }

      localStorage.setItem("crmp_workspaces", JSON.stringify(updated));
      return updated;
    });
  };

  const createWorkspace = (projectId: string, title: string) => {
    const newWs: Workspace = {
      id: `ws-${Date.now()}`,
      projectId,
      title,
      manager: "Current User", // Mock user
      content: "",
      tasks: [],
      updatedAt: new Date().toISOString(),
    };

    setAllWorkspaces((prev) => {
      const updated = [...prev, newWs];
      localStorage.setItem("crmp_workspaces", JSON.stringify(updated));
      return updated;
    });

    return newWs.id;
  };

  const loadWorkspace = (id: string) => {
    const ws = allWorkspaces.find((w) => w.id === id);
    if (ws) {
      setWorkspaceTitle(ws.title);
      setWorkspaceContent(ws.content);
    }
  };

  return (
    <WorkspaceContext.Provider
      value={{
        activeView,
        setActiveView,
        activeFile,
        setActiveFile,
        files,
        addFile,
        isChatOpen,
        setIsChatOpen,
        toggleChat,
        workspaceTitle,
        setWorkspaceTitle,
        workspaceContent,
        setWorkspaceContent,
        saveWorkspace,
        loadWorkspace,
        createWorkspace,
        allWorkspaces,
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
