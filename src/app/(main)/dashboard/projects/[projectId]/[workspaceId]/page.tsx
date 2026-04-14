"use client";

import { notFound, useParams } from "next/navigation";

// Mock import removed

import { ChatPanel } from "../../_components/workspace/chat-panel";
import { MainView } from "../../_components/workspace/main-view";
import { WorkspaceProvider } from "../../_components/workspace/workspace-context";

function WorkspaceContent({ projectId, workspaceId }: { projectId: string; workspaceId: string }) {
  return (
    <div className="group relative flex h-full min-h-0 w-full min-w-0 flex-1 overflow-hidden rounded-2xl border bg-background shadow-inner">
      {/* Main Content - Takes full width or shifts for sidebar */}
      <main className="flex h-full min-w-0 flex-1 flex-col transition-all duration-500 ease-in-out">
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
