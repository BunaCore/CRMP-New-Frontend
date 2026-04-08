"use client";

import { notFound, useParams } from "next/navigation";

import { mockProjects } from "@/data/projects";
import { cn } from "@/lib/utils";

import { ChatPanel } from "../../_components/workspace/chat-panel";
import { MainView } from "../../_components/workspace/main-view";
import { useWorkspace, WorkspaceProvider } from "../../_components/workspace/workspace-context";

function WorkspaceContent({ project, workspaceId }: { project: { id: string }; workspaceId: string }) {
  const { isChatOpen } = useWorkspace();

  return (
    <div className="group relative mx-2 mb-2 flex h-[calc(100vh-(--spacing(12)))] overflow-hidden rounded-2xl border bg-background shadow-inner">
      {/* Main Content - Takes full width or shifts for sidebar */}
      <main
        className={cn(
          "flex h-full flex-1 flex-col transition-all duration-500 ease-in-out",
          isChatOpen ? "mr-0" : "mr-0",
        )}
      >
        <MainView workspaceId={workspaceId} projectId={project.id} />
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

  const project = mockProjects.find((p) => p.id === projectId);

  if (!project) {
    return notFound();
  }

  return (
    <WorkspaceProvider>
      <WorkspaceContent project={project} workspaceId={workspaceId} />
    </WorkspaceProvider>
  );
}
