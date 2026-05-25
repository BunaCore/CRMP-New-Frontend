"use client";

import { useEffect } from "react";

import { notFound, useParams } from "next/navigation";

// Mock import removed

import { ChatPanel } from "../../_components/workspace/chat-panel";
import { MainView } from "../../_components/workspace/main-view";
import { WorkspaceProvider } from "../../_components/workspace/workspace-context";

function WorkspaceContent({ projectId, workspaceId }: { projectId: string; workspaceId: string }) {
  // Hide the global dashboard header for the workspace editor & lock parent container heights
  useEffect(() => {
    // The layout header is typically the first header inside the sidebar inset
    const header = document.querySelector("header.shrink-0") as HTMLElement | null;
    if (header) {
      header.style.display = "none";
    }

    // Dynamic lock of outer containers to keep the view strictly centered/no-scroll
    const sidebarInset = document.querySelector("main[data-slot='sidebar-inset']") as HTMLElement | null;
    const parentContainer = sidebarInset?.querySelector("div.p-4, div.p-6") as HTMLElement | null;

    if (sidebarInset) {
      sidebarInset.style.height = "100vh";
      sidebarInset.style.maxHeight = "100vh";
      sidebarInset.style.overflow = "hidden";
    }
    if (parentContainer) {
      parentContainer.style.height = "100%";
      parentContainer.style.maxHeight = "100%";
      parentContainer.style.overflow = "hidden";
    }

    return () => {
      if (header) {
        header.style.display = "";
      }
      if (sidebarInset) {
        sidebarInset.style.height = "";
        sidebarInset.style.maxHeight = "";
        sidebarInset.style.overflow = "";
      }
      if (parentContainer) {
        parentContainer.style.height = "";
        parentContainer.style.maxHeight = "";
        parentContainer.style.overflow = "";
      }
    };
  }, []);

  return (
    <div className="group relative flex h-full max-h-full w-full min-w-0 overflow-hidden rounded-2xl border bg-background shadow-inner">
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
