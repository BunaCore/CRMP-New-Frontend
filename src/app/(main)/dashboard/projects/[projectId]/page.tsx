"use client";

import { useEffect, useState } from "react";

import { useParams, useRouter } from "next/navigation";

import { Loader2 } from "lucide-react";

import { fetchProjects } from "@/lib/api/editor/queries";
import type { ProjectIdentity } from "@/types/editor";

import { useWorkspace, WorkspaceProvider } from "../_components/workspace/workspace-context";

function ProjectWorkspacesContent() {
  const params = useParams();
  const router = useRouter();
  const projectId = params.projectId as string;
  const [project, setProject] = useState<ProjectIdentity | null>(null);
  const { workspaces, loading } = useWorkspace();

  useEffect(() => {
    fetchProjects().then((projects) => {
      const found = projects.find((p) => p.projectId === projectId);
      setProject(found || null);
    });
  }, [projectId]);

  useEffect(() => {
    if (!loading && workspaces.length > 0) {
      // Seamlessly redirect to the first (and only) workspace
      router.replace(`/dashboard/projects/${projectId}/${workspaces[0].id}`);
    }
  }, [loading, workspaces, projectId, router]);

  // We only show the loader while fetching or while redirecting (when workspaces.length > 0)
  // If there are truly 0 workspaces (e.g. backend issue), we show an error.
  if (loading || !project || workspaces.length > 0) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-10 w-10 animate-spin text-primary/50" />
          <p className="animate-pulse text-muted-foreground text-sm">Preparing your workspace...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4 text-center">
      <h2 className="mb-2 font-bold text-2xl text-destructive">Workspace Issue</h2>
      <p className="text-muted-foreground">
        No default workspace was found for this project. Please contact backend support.
      </p>
    </div>
  );
}

export default function ProjectWorkspacesPage() {
  return (
    <WorkspaceProvider>
      <ProjectWorkspacesContent />
    </WorkspaceProvider>
  );
}
