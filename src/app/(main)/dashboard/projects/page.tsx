"use client";

import { useEffect, useMemo, useState } from "react";

import { useRouter } from "next/navigation";

import { ArrowRight, Clock, FolderKanban, FolderOpen, Loader2, Search } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { fetchProjects } from "@/lib/api/editor/queries";
import type { ProjectIdentity } from "@/types/editor";

export default function ProjectsPage() {
  const router = useRouter();

  const [projects, setProjects] = useState<ProjectIdentity[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchProjects()
      .then(setProjects)
      .finally(() => setLoading(false));
  }, []);

  const handleProjectClick = (projectId: string) => {
    router.push(`/dashboard/projects/${projectId}`);
  };

  const filteredProjects = useMemo(() => {
    if (!searchQuery.trim()) return projects;
    return projects.filter((p) => p.projectTitle.toLowerCase().includes(searchQuery.toLowerCase()));
  }, [projects, searchQuery]);

  return (
    <div className="mx-auto flex w-full max-w-7xl flex-1 flex-col p-4 pt-0 md:p-8">
      {/* Modern Hero Section */}
      <div className="relative mb-8 flex flex-col gap-6 overflow-hidden rounded-3xl border border-border/50 bg-gradient-to-br from-primary/10 via-background to-background p-8 shadow-sm">
        <div className="relative z-10 flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-col gap-2">
            <h1 className="font-extrabold text-4xl tracking-tight lg:text-5xl">Projects</h1>
            <p className="max-w-xl text-lg text-muted-foreground">
              Select an approved project to open its unified workspace. Collaborate with your team in real-time.
            </p>
          </div>

          <div className="flex w-full items-center gap-3 md:w-auto">
            <div className="relative w-full transition-all duration-300 focus-within:w-full md:w-72 md:focus-within:w-80">
              <Search className="-translate-y-1/2 absolute top-1/2 left-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search projects..."
                className="w-full border-border/50 bg-background/50 pl-9 backdrop-blur-sm transition-all focus:bg-background"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Decorative background elements */}
        <div className="-right-20 -top-20 pointer-events-none absolute h-64 w-64 rounded-full bg-primary/10 blur-3xl" />
        <div className="-bottom-20 -left-20 pointer-events-none absolute h-40 w-40 rounded-full bg-primary/5 blur-2xl" />
      </div>

      {loading ? (
        <div className="flex min-h-[40vh] flex-1 flex-col items-center justify-center gap-4">
          <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
          <p className="animate-pulse font-medium text-muted-foreground text-sm">Loading workspaces...</p>
        </div>
      ) : projects.length === 0 || filteredProjects.length === 0 ? (
        <div className="flex min-h-[40vh] flex-1 flex-col items-center justify-center rounded-3xl border border-border/60 border-dashed bg-card/30 p-12 text-center backdrop-blur-sm">
          <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-primary/10 ring-8 ring-primary/5">
            <FolderOpen className="h-10 w-10 text-primary opacity-80" />
          </div>
          <h3 className="mb-2 font-bold text-2xl tracking-tight">No projects found</h3>
          <p className="mb-6 max-w-sm text-muted-foreground">
            {projects.length === 0
              ? "You don't have any projects assigned yet."
              : "We couldn't find any projects matching your search."}
          </p>
          {searchQuery && (
            <Button variant="outline" onClick={() => setSearchQuery("")}>
              Clear search filters
            </Button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredProjects.map((project) => (
            <button
              key={project.projectId}
              onClick={() => handleProjectClick(project.projectId)}
              className="group focus-none block h-full cursor-pointer text-left"
              type="button"
            >
              <Card className="group hover:-translate-y-1.5 relative flex h-full flex-col overflow-hidden border border-border/50 bg-card/50 backdrop-blur-sm transition-all duration-300 hover:border-primary/30 hover:bg-card hover:shadow-xl">
                {/* Top gradient highlight */}
                <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-primary/40 via-primary/20 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

                <CardHeader className="pb-4">
                  <div className="flex items-start justify-between">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors duration-300 group-hover:bg-primary group-hover:text-primary-foreground">
                      <FolderKanban className="h-5 w-5" />
                    </div>
                    <Badge variant="secondary" className="bg-primary/5 font-medium text-primary hover:bg-primary/10">
                      Active
                    </Badge>
                  </div>
                  <CardTitle className="mt-5 line-clamp-1 font-bold text-xl transition-colors group-hover:text-primary">
                    {project.projectTitle}
                  </CardTitle>
                  <CardDescription className="mt-2 line-clamp-2 leading-relaxed">
                    Unified collaborative research workspace with real-time text editing and team proposals.
                  </CardDescription>
                </CardHeader>

                <CardContent className="mt-auto pb-5">
                  <div className="mb-5 flex items-center gap-2 font-medium text-muted-foreground text-xs">
                    <Clock className="h-3.5 w-3.5" />
                    <span>Updated recently</span>
                  </div>

                  <div className="flex items-center justify-between">
                    {/* Mock Team Avatars */}
                    <div className="-space-x-2 flex">
                      {[1, 2, 3].map((i) => (
                        <Avatar
                          key={i}
                          className="h-8 w-8 border-2 border-background shadow-sm transition-transform duration-300 group-hover:translate-x-1"
                        >
                          <AvatarImage
                            src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${project.projectId}-${i}&backgroundColor=transparent`}
                          />
                          <AvatarFallback className="bg-primary/10 font-medium text-primary text-xs">
                            U{i}
                          </AvatarFallback>
                        </Avatar>
                      ))}
                    </div>

                    <div className="-translate-x-2 flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100">
                      <ArrowRight className="h-4 w-4" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
