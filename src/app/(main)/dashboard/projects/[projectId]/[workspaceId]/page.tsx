"use client";

import { useEffect } from "react";

import { notFound, useParams } from "next/navigation";

// Mock import removed

import { ChatPanel } from "../../_components/workspace/chat-panel";
import { MainView } from "../../_components/workspace/main-view";
import { WorkspaceProvider } from "../../_components/workspace/workspace-context";

function WorkspaceContent({ projectId, workspaceId }: { projectId: string; workspaceId: string }) {
  // Hide the global dashboard header for the workspace editor
  useEffect(() => {
    // The layout header is typically the first header inside the sidebar inset
    const header = document.querySelector("header.shrink-0") as HTMLElement | null;
    if (header) {
      header.style.display = "none";
    }
    return () => {
      if (header) {
        header.style.display = "";
      }
    };
  }, []);

  return (
    <div className="group relative flex h-screen min-h-0 w-full min-w-0 flex-1 overflow-hidden rounded-2xl border bg-background shadow-inner">
      {/* Main Content - Takes full width or shifts for sidebar */}
      <main className="relative flex min-w-0 flex-1 flex-col transition-all duration-500 ease-in-out">
        <MainView workspaceId={workspaceId} projectId={projectId} />
      </main>

      {/* Right Side Panel - Smoothly opens */}
      <ChatPanel />
    </div>
  );
}

export default function WorkspaceEditorPage() {
  const params = useParams();
  const projectId = params.projectId as string;
  const workspaceId = params.workspaceId as string;

  if (!projectId || !workspaceId) return notFound();

  return (
    <WorkspaceProvider>
      <WorkspaceContent projectId={projectId} workspaceId={workspaceId} />
    </WorkspaceProvider>
  );
}
