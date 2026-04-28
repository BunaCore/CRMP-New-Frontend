"use client";

import { useEffect, useMemo, useState } from "react";

import { useRouter } from "next/navigation";

import { motion } from "framer-motion";
import { ArrowRight, Clock, FolderKanban, FolderOpen, Loader2, Search } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
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
      {/* Hero */}
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        whileHover={{ y: -4 }}
        className="group relative mb-8 flex flex-col gap-6 overflow-hidden rounded-3xl border border-slate-200/50 bg-gray-50 p-5 shadow-sm transition-all hover:shadow-lg sm:flex-row dark:border-slate-800/50 dark:bg-slate-950/50"
      >
        <div className="relative z-10 flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="font-black text-3xl text-slate-900 tracking-tighter sm:text-4xl dark:text-slate-100">
              Projects
            </h1>
            <p className="mt-2 max-w-xl text-muted-foreground text-sm md:text-base">
              Select an approved project to open its workspace and collaborate in real-time.
            </p>
          </div>

          <div className="relative w-full md:w-72">
            <Search className="-translate-y-1/2 absolute top-1/2 left-3 h-4 w-4 text-gray-150" />
            <Input
              placeholder="Search projects..."
              className="bg-background/50 pl-9 backdrop-blur-sm"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </motion.div>

      {/* Loading */}
      {loading ? (
        <div className="flex min-h-[40vh] flex-col items-center justify-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="animate-pulse text-muted-foreground text-sm">Loading workspaces...</p>
        </div>
      ) : projects.length === 0 || filteredProjects.length === 0 ? (
        /* Empty */
        <div className="flex min-h-[40vh] flex-col items-center justify-center rounded-3xl border border-border/60 border-dashed bg-card/30 p-12 text-center">
          <div className="relative mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
            {/* outer wave 1 */}
            <span className="absolute inset-0 animate-ping rounded-full bg-primary/20 opacity-60" />

            {/* outer wave 2 (slower, softer) */}
            <span className="absolute inset-0 animate-pulse rounded-full bg-primary/10 blur-xl" />

            {/* static ring */}
            <span className="absolute inset-0 rounded-full ring-8 ring-primary/10" />

            {/* icon */}
            <FolderOpen className="relative z-10 h-10 w-10 text-primary opacity-90" />
          </div>
          <h3 className="font-bold text-2xl">No projects found</h3>
          <p className="mt-2 mb-6 max-w-sm text-muted-foreground">
            {projects.length === 0 ? "You don't have any projects yet." : "No results match your search."}
          </p>
          {searchQuery && (
            <Button variant="outline" onClick={() => setSearchQuery("")}>
              Clear search
            </Button>
          )}
        </div>
      ) : (
        /* Cards */
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredProjects.map((project, idx) => (
            <button
              type="button"
              key={project.projectId}
              onClick={() => handleProjectClick(project.projectId)}
              className="group text-left"
            >
              <motion.div
                initial={{ y: 40, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                whileHover={{
                  y: -8,
                  scale: 1.03,
                  boxShadow: "0px 20px 40px rgba(0,0,0,0.15)",
                }}
                transition={{
                  duration: 0.4,
                  delay: idx * 0.08,
                }}
                viewport={{ once: true }}
                className="relative flex h-full flex-col overflow-hidden rounded-3xl border border-gray-300 bg-card p-5 shadow-sm dark:border-slate-800/50 dark:bg-slate-950/50"
              >
                {/* Top glow line */}
                <div className="absolute top-0 right-0 left-0 h-1 bg-gradient-to-r from-primary/40 via-primary/20 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />

                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary transition-all group-hover:scale-105 group-hover:bg-primary group-hover:text-white">
                      <FolderKanban className="h-5 w-5" />
                    </div>

                    <Badge className="bg-primary/5 text-primary">Active</Badge>
                  </div>

                  <CardTitle className="mt-4 line-clamp-1 font-bold text-lg transition-colors group-hover:text-primary">
                    {project.projectTitle}
                  </CardTitle>

                  <CardDescription className="mt-1 line-clamp-2 text-sm">
                    Collaborative workspace with real-time editing.
                  </CardDescription>
                </CardHeader>

                <CardContent className="mt-auto pt-2">
                  <div className="mb-4 flex items-center gap-2 text-muted-foreground text-xs">
                    <Clock className="h-3.5 w-3.5" />
                    Updated recently
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="-space-x-2 flex">
                      {[1, 2, 3].map((i) => (
                        <Avatar
                          key={i}
                          className="h-8 w-8 border-2 border-background transition-transform group-hover:translate-x-1"
                        >
                          <AvatarImage
                            src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${project.projectId}-${i}`}
                          />
                          <AvatarFallback>U{i}</AvatarFallback>
                        </Avatar>
                      ))}
                    </div>

                    <div className="flex h-8 w-8 translate-x-2 items-center justify-center rounded-full bg-primary/10 text-primary opacity-0 transition-all group-hover:translate-x-0 group-hover:opacity-100">
                      <ArrowRight className="h-4 w-4" />
                    </div>
                  </div>
                </CardContent>
              </motion.div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
