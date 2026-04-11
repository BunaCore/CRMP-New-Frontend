"use client";

import { useState } from "react";

import { useRouter } from "next/navigation";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { mockProjects, type Project } from "@/data/projects";

export default function ProjectsPage() {
  const router = useRouter();
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  // Only display Approved projects for this workflow
  const approvedProjects = mockProjects.filter((p) => p.status === "Approved");

  const handleProjectClick = (project: Project) => {
    setSelectedProject(project);
  };

  const closeDialog = () => setSelectedProject(null);

  return (
    <div className="mx-auto flex w-full max-w-7xl flex-1 flex-col gap-8 p-4 pt-0 md:p-8">
      <div className="flex flex-col gap-2">
        <h1 className="font-extrabold text-4xl tracking-tight lg:text-5xl">Projects</h1>
        <p className="text-lg text-muted-foreground">Select an approved project to open its unified workspace.</p>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {approvedProjects.map((project) => (
          <button
            key={project.id}
            onClick={() => handleProjectClick(project)}
            className="group focus-none block h-full cursor-pointer"
            type="button"
          >
            <Card className="group relative h-full overflow-hidden border-muted-foreground/10 bg-card transition-all duration-300 hover:scale-[1.02] hover:bg-accent/5 hover:shadow-xl active:scale-[0.98]">
              <div className="absolute top-0 left-0 h-1 w-full bg-primary opacity-0 transition-opacity group-hover:opacity-100" />
              <CardHeader className="pb-3">
                <CardTitle>{project.name}</CardTitle>
                <CardDescription>{project.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <p>{project.description}</p>
              </CardContent>
            </Card>
          </button>
        ))}
      </div>
    </div>
  );
}
