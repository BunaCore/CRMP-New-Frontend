"use client";

import { useEffect, useState } from "react";

import { useRouter } from "next/navigation";

import { Loader2 } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { fetchProjects } from "@/lib/api/editor/queries";
import type { ProjectIdentity } from "@/types/editor";

export default function ProjectsPage() {
  const router = useRouter();

  const [projects, setProjects] = useState<ProjectIdentity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProjects()
      .then(setProjects)
      .finally(() => setLoading(false));
  }, []);

  const handleProjectClick = (projectId: string) => {
    router.push(`/dashboard/projects/${projectId}`);
  };

  return (
    <div className="mx-auto flex w-full max-w-7xl flex-1 flex-col gap-8 p-4 pt-0 md:p-8">
      <div className="flex flex-col gap-2">
        <h1 className="font-extrabold text-4xl tracking-tight lg:text-5xl">Projects</h1>
        <p className="text-lg text-muted-foreground">Select an approved project to open its unified workspace.</p>
      </div>

      {loading ? (
        <div className="flex flex-1 items-center justify-center">
          <Loader2 className="h-10 w-10 animate-spin text-primary/20" />
        </div>
      ) : projects.length === 0 ? (
        <div className="flex flex-1 flex-col items-center justify-center gap-4 text-center opacity-40">
          <p className="font-bold text-xl">No projects found</p>
          <p className="text-sm italic">You don't have any projects assigned yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {projects.map((project) => (
            <button
              key={project.projectId}
              onClick={() => handleProjectClick(project.projectId)}
              className="group focus-none block h-full cursor-pointer"
              type="button"
            >
              <Card className="group relative h-full overflow-hidden border-muted-foreground/10 bg-card transition-all duration-300 hover:scale-[1.02] hover:bg-accent/5 hover:shadow-xl active:scale-[0.98]">
                <div className="absolute top-0 left-0 h-1 w-full bg-primary opacity-0 transition-opacity group-hover:opacity-100" />
                <CardHeader className="pb-3">
                  <CardTitle>{project.projectTitle}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground text-sm">Unified research project workspace.</p>
                </CardContent>
              </Card>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
