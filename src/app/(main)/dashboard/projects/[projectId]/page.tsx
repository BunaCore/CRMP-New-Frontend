"use client";

import { useParams, useRouter } from "next/navigation";

import { format } from "date-fns";
import { ArrowLeft, ChevronRight, FileText, Layout, Plus, User } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { mockProjects } from "@/data/projects";

import { useWorkspace, WorkspaceProvider } from "../_components/workspace/workspace-context";

function ProjectWorkspacesContent() {
  const params = useParams();
  const router = useRouter();
  const projectId = params.projectId as string;
  const { allWorkspaces, createWorkspace } = useWorkspace();

  const project = mockProjects.find((p) => p.id === projectId);

  // Filtering workspaces for this project from the persisted state
  const workspaces = allWorkspaces.filter((ws) => ws.projectId === projectId);

  if (!project) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-muted-foreground">Project not found.</p>
      </div>
    );
  }

  const handleCreateWorkspace = () => {
    const newTitle = `Workspace ${workspaces.length + 1}`;
    const newId = createWorkspace(projectId, newTitle);
    router.push(`/dashboard/projects/${projectId}/${newId}`);
  };

  return (
    <div className="anim-in fade-in slide-in-from-bottom-5 mx-auto flex w-full max-w-7xl flex-1 flex-col gap-8 p-4 pt-0 duration-700 md:p-8">
      {/* Header */}
      <div className="flex flex-col gap-6">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            className="h-10 w-10 rounded-full hover:bg-primary/5"
            onClick={() => router.push("/dashboard/projects")}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="h-8 w-px bg-border/60" />
          <div className="flex flex-col">
            <h1 className="font-extrabold text-3xl tracking-tight">{project.name}</h1>
            <p className="mt-1 flex items-center gap-2 font-medium text-muted-foreground text-sm uppercase tracking-wider">
              <span className="h-2 w-2 animate-pulse rounded-full bg-primary" />
              Workspaces Management
            </p>
          </div>
        </div>

        <div className="flex items-center justify-between rounded-2xl border bg-card p-6 shadow-sm">
          <div className="space-y-1">
            <h2 className="flex items-center gap-2 font-bold text-lg">
              <Layout className="h-5 w-5 text-primary" />
              Overview
            </h2>
            <p className="text-muted-foreground text-sm italic">
              Manage all research workspaces and tasks for this specific project.
            </p>
          </div>
          <Button className="gap-2 shadow-lg shadow-primary/20" onClick={handleCreateWorkspace}>
            <Plus className="h-4 w-4" />
            Create Workspace
          </Button>
        </div>
      </div>

      {/* Workspaces Table */}
      <Card className="overflow-hidden border-muted-foreground/10 shadow-xl">
        <Table>
          <TableHeader className="bg-muted/50">
            <TableRow>
              <TableHead className="w-100 py-4 font-bold">Workspace Title</TableHead>
              <TableHead className="font-bold">Task Manager</TableHead>
              <TableHead className="font-bold">Assigned Tasks</TableHead>
              <TableHead className="font-bold">Last Updated</TableHead>
              <TableHead className="pr-8 text-right font-bold">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {workspaces.length > 0 ? (
              workspaces.map((ws) => (
                <TableRow
                  key={ws.id}
                  className="group cursor-pointer transition-colors hover:bg-muted/30"
                  onClick={() => router.push(`/dashboard/projects/${projectId}/${ws.id}`)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      router.push(`/dashboard/projects/${projectId}/${ws.id}`);
                    }
                  }}
                  tabIndex={0}
                  role="button"
                >
                  <TableCell className="py-5">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/5 text-primary transition-all duration-300 group-hover:bg-primary group-hover:text-white">
                        <FileText className="h-5 w-5" />
                      </div>
                      <span className="inline-block font-semibold text-base transition-transform group-hover:translate-x-1">
                        {ws.title}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className="flex h-7 w-7 items-center justify-center rounded-full border border-border bg-secondary">
                        <User className="h-4 w-4 text-muted-foreground" />
                      </div>
                      <span className="font-medium text-sm">{ws.manager}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {ws.tasks?.map((task, i) => (
                        <Badge
                          key={`${ws.id}-task-${i}`}
                          variant="outline"
                          className="bg-background/50 font-bold text-[10px] uppercase tracking-tighter"
                        >
                          {task}
                        </Badge>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell className="font-medium text-muted-foreground text-sm">
                    {format(new Date(ws.updatedAt), "MMM d, yyyy")}
                  </TableCell>
                  <TableCell className="pr-8 text-right">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 rounded-full transition-colors group-hover:bg-primary group-hover:text-white"
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="h-64 text-center">
                  <div className="flex flex-col items-center justify-center gap-2 opacity-40">
                    <Layout className="mb-2 h-10 w-10" />
                    <p className="font-bold text-lg">No workspaces found</p>
                    <p className="text-sm italic">Get started by creating your first research environment.</p>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Card>
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
