"use client";

import { useCallback, useEffect, useState } from "react";

import { motion } from "framer-motion";
import { Download, ExternalLink, FileText, Search, Share2, Sparkles, User, Users } from "lucide-react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { apiClient } from "@/lib/api/client";

import { useWorkspace } from "../workspace-context";

interface RelatedProject {
  id: string;
  title: string;
  researchArea: string;
  department: string;
  abstract: string;
  matchScore: number;
  advisor: string | null;
  members: string[];
  status: string;
}

const DIAGRAM_URLS = [
  "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800&auto=format&fit=crop&q=60",
  "https://images.unsplash.com/photo-1544333346-64e396efec4e?w=800&auto=format&fit=crop&q=60",
  "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=800&auto=format&fit=crop&q=60",
  "https://images.unsplash.com/photo-1501504905252-473c47e087f8?w=800&auto=format&fit=crop&q=60",
];

const getDiagramUrl = (id: string) => {
  let sum = 0;
  for (let i = 0; i < id.length; i++) sum += id.charCodeAt(i);
  return DIAGRAM_URLS[sum % DIAGRAM_URLS.length];
};

export function ActivityTab() {
  const { projectId } = useWorkspace();
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [projects, setProjects] = useState<RelatedProject[]>([]);
  const [downloadingId, setDownloadingId] = useState<string | null>(null);

  const filteredProjects = projects.filter((project) => {
    const term = searchTerm.toLowerCase().trim();
    if (!term) return true;
    return (
      project.title.toLowerCase().includes(term) ||
      project.abstract.toLowerCase().includes(term) ||
      (project.researchArea && project.researchArea.toLowerCase().includes(term)) ||
      (project.department && project.department.toLowerCase().includes(term)) ||
      (project.advisor && project.advisor.toLowerCase().includes(term)) ||
      (project.members && project.members.some((m) => m.toLowerCase().includes(term)))
    );
  });

  const fetchRelated = useCallback(
    async (q?: string) => {
      if (!projectId) return;
      try {
        setLoading(true);
        const url =
          q && q.trim().length > 0
            ? `/projects/${projectId}/related?q=${encodeURIComponent(q)}`
            : `/projects/${projectId}/related`;
        const response = await apiClient.get(url);
        setProjects(response.data);
      } catch (e: any) {
        toast.error("Failed to load similar projects", {
          description: e.message || "Failed to contact the backend microservice.",
        });
      } finally {
        setLoading(false);
      }
    },
    [projectId],
  );

  // Handle Search Input Debounce
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchRelated(searchTerm);
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm, fetchRelated]);

  const handleDownload = async (project: RelatedProject) => {
    setDownloadingId(project.id);
    toast.success(`Starting download: ${project.title}.pdf`, {
      description: "Preparing your research document for offline viewing.",
      icon: <Download className="h-4 w-4" />,
    });

    try {
      const response = await apiClient.get(`/projects/${project.id}/download-pdf`, {
        responseType: "blob",
      });

      const blob = new Blob([response.data], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;

      // Clean up title for filename
      const safeTitle =
        project.title
          .replace(/[^a-zA-Z0-9_\- ]/g, "")
          .trim()
          .replace(/\s+/g, "_") || "Project";
      a.download = `${safeTitle}_Proposal.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (e: any) {
      toast.error("Download failed", {
        description: e.message || "Failed to download the generated PDF.",
      });
    } finally {
      setDownloadingId(null);
    }
  };

  if (loading && projects.length === 0) {
    return (
      <div className="space-y-4 p-5">
        <div className="flex items-center justify-between">
          <Skeleton className="h-6 w-32" />
          <Skeleton className="h-8 w-8 rounded-full" />
        </div>
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-48 w-full rounded-2xl" />
        ))}
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col bg-slate-50/50 dark:bg-zinc-950/50">
      {/* Header & Search */}
      <div className="shrink-0 space-y-4 p-6 pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="rounded-xl bg-primary/10 p-2 text-primary"></div>
            <div>
              <h3 className="font-bold text-base tracking-tight">Related Research</h3>
              <p className="font-medium text-[11px] text-muted-foreground uppercase tracking-widest">
                Powered by AI Analysis
              </p>
            </div>
          </div>
          <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full">
            <Share2 className="h-4 w-4" />
          </Button>
        </div>

        <div className="relative">
          <Search className="-translate-y-1/2 absolute top-1/2 left-3 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search related proposals..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-2xl border border-border/50 bg-background py-2.5 pr-4 pl-10 text-sm transition-all focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
        </div>
      </div>

      {/* Projects List */}
      <div className="custom-scrollbar flex-1 space-y-5 overflow-y-auto px-6 pb-6">
        {filteredProjects.length === 0 ? (
          <div className="flex h-40 flex-col items-center justify-center text-center text-muted-foreground">
            <Sparkles className="mb-2 h-8 w-8 opacity-40 text-primary" />
            <p className="font-medium text-sm">No related proposals found</p>
            <p className="text-xs text-muted-foreground/80 mt-1">
              Try tweaking your search query or index more proposals
            </p>
          </div>
        ) : (
          filteredProjects.map((project, index) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05, duration: 0.3 }}
            >
              <Card className="group overflow-hidden rounded-3xl border-border/40 bg-background/60 transition-all duration-500 hover:bg-background hover:shadow-primary/5 hover:shadow-xl">
                <CardContent className="p-0">
                  {/* Image/Diagram Preview */}
                  <div className="relative h-32 overflow-hidden bg-muted">
                    {/* biome-ignore lint/performance/noImgElement: mock preview */}
                    <img
                      src={getDiagramUrl(project.id)}
                      alt="Proposal Diagram"
                      className="h-full w-full object-cover opacity-60 transition-all duration-700 group-hover:scale-105 group-hover:opacity-100"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent" />
                  </div>

                  <div className="space-y-3 p-5 pt-2">
                    <div>
                      <h4 className="mb-1.5 flex cursor-pointer items-center gap-2 font-bold text-sm leading-tight transition-colors group-hover:text-primary">
                        {project.title}
                        <ExternalLink className="h-3 w-3 opacity-0 transition-opacity group-hover:opacity-40" />
                      </h4>

                      <div className="flex flex-wrap gap-2">
                        <div className="flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/5 px-2.5 py-0.5 font-bold text-[10px] text-primary">
                          {project.matchScore}% Match
                        </div>
                        <div className="flex items-center gap-1.5 rounded-full border border-border/20 bg-slate-100 px-2 py-0.5 font-semibold text-[10px] text-muted-foreground dark:bg-zinc-800">
                          <FileText className="h-3 w-3" />
                          {project.researchArea || "General"}
                        </div>
                        {project.department && (
                          <div className="rounded-full border border-border/20 bg-slate-100 px-2 py-0.5 font-semibold text-[10px] text-muted-foreground dark:bg-zinc-800">
                            {project.department}
                          </div>
                        )}
                        {project.status && (
                          <div className="rounded-full border border-border/20 bg-slate-100 px-2 py-0.5 font-semibold text-[10px] text-muted-foreground dark:bg-zinc-800">
                            {project.status}
                          </div>
                        )}
                      </div>
                    </div>

                    <p className="line-clamp-3 text-[12px] text-muted-foreground italic leading-relaxed">
                      "{project.abstract}"
                    </p>

                    {/* Team Members & Advisor info */}
                    <div className="space-y-1 border-t border-border/10 pt-2 text-[11px] text-muted-foreground/80">
                      {project.advisor && (
                        <div className="flex items-center gap-1">
                          <User className="h-3 w-3 text-primary/60" />
                          <span>
                            <span className="font-semibold text-muted-foreground">Advisor:</span> {project.advisor}
                          </span>
                        </div>
                      )}
                      {project.members && project.members.length > 0 && (
                        <div className="flex items-center gap-1">
                          <Users className="h-3 w-3 text-primary/60" />
                          <span>
                            <span className="font-semibold text-muted-foreground">Members:</span>{" "}
                            {project.members.join(", ")}
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-2 pt-1">
                      <Button
                        onClick={() => handleDownload(project)}
                        disabled={downloadingId === project.id}
                        className="h-9 flex-1 gap-2 rounded-xl bg-primary font-bold text-primary-foreground text-xs shadow-lg shadow-primary/20 hover:bg-primary/90"
                      >
                        <Download className="h-3.5 w-3.5" />
                        {downloadingId === project.id ? "Preparing PDF..." : "Download Proposal"}
                      </Button>
                      <Button variant="outline" size="icon" className="h-9 w-9 shrink-0 rounded-xl">
                        <Share2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}
