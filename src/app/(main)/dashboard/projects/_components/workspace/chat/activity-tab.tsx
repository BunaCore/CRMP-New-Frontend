"use client";

import { useEffect, useState } from "react";

import { motion } from "framer-motion";
import { Download, ExternalLink, FileText, Search, Share2, Sparkles } from "lucide-react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

import { useWorkspace } from "../workspace-context";

interface RelatedProject {
  id: string;
  title: string;
  researchArea: string;
  hostDepartment: string;
  abstract: string;
  diagram: string; // URL or placeholder for the diagram
  matchScore: number; // 0 to 100
  downloadUrl: string;
}

const MOCK_RELATED_PROJECTS: RelatedProject[] = [
  {
    id: "rel-1",
    title: "AI-Driven Urban Resilience Mapping",
    researchArea: "Smart Cities & Machine Learning",
    hostDepartment: "Department of Urban Planning",
    abstract:
      "This project explores the integration of real-time sensor data with deep learning models to predict urban infrastructure failures during extreme weather events. The goal is to provide a decision-support system for city planners.",
    diagram: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800&auto=format&fit=crop&q=60",
    matchScore: 94,
    downloadUrl: "#",
  },
  {
    id: "rel-2",
    title: "Sustainable Water Management in Arid Regions",
    researchArea: "Environmental Engineering",
    hostDepartment: "Department of Civil Engineering",
    abstract:
      "A comprehensive study on advanced desalination techniques and wastewater recycling frameworks tailored for high-scarcity environments. Includes a novel filtration system design.",
    diagram: "https://images.unsplash.com/photo-1544333346-64e396efec4e?w=800&auto=format&fit=crop&q=60",
    matchScore: 88,
    downloadUrl: "#",
  },
  {
    id: "rel-3",
    title: "Blockchain for Decentralized Energy Markets",
    researchArea: "FinTech & Renewable Energy",
    hostDepartment: "School of Economics & Computer Science",
    abstract:
      "Implementing a peer-to-peer energy trading platform using Ethereum smart contracts to empower local communities with solar microgrids.",
    diagram: "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=800&auto=format&fit=crop&q=60",
    matchScore: 82,
    downloadUrl: "#",
  },
  {
    id: "rel-4",
    title: "Cognitive Computing in Higher Education",
    researchArea: "Educational Technology",
    hostDepartment: "Faculty of Education",
    abstract:
      "Analyzing the impact of personalized AI tutors on student engagement and retention rates in large-scale undergraduate courses.",
    diagram: "https://images.unsplash.com/photo-1501504905252-473c47e087f8?w=800&auto=format&fit=crop&q=60",
    matchScore: 76,
    downloadUrl: "#",
  },
];

export function ActivityTab() {
  useWorkspace();
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1200);
    return () => clearTimeout(timer);
  }, []);

  const handleDownload = (project: RelatedProject) => {
    toast.success(`Starting download: ${project.title}.pdf`, {
      description: "Preparing your research document for offline viewing.",
      icon: <Download className="h-4 w-4" />,
    });

    // Simulate a file download
    const content = `Mock Project Data for: ${project.title}\n\nArea: ${project.researchArea}\nDepartment: ${project.hostDepartment}\n\nAbstract:\n${project.abstract}`;
    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${project.title.replace(/\s+/g, "_")}_Proposal.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  if (loading) {
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
            <div className="rounded-xl bg-primary/10 p-2 text-primary">
              <Sparkles className="h-5 w-5" />
            </div>
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
        {MOCK_RELATED_PROJECTS.filter(
          (p) =>
            p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            p.researchArea.toLowerCase().includes(searchTerm.toLowerCase()),
        ).map((project, index) => (
          <motion.div
            key={project.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1, duration: 0.4 }}
          >
            <Card className="group overflow-hidden rounded-3xl border-border/40 bg-background/60 transition-all duration-500 hover:bg-background hover:shadow-primary/5 hover:shadow-xl">
              <CardContent className="p-0">
                {/* Image/Diagram Preview */}
                <div className="relative h-32 overflow-hidden bg-muted">
                  {/* biome-ignore lint/performance/noImgElement: mock preview */}
                  <img
                    src={project.diagram}
                    alt="Proposal Diagram"
                    className="h-full w-full object-cover opacity-60 transition-all duration-700 group-hover:scale-105 group-hover:opacity-100"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent" />
                  <div className="absolute top-3 right-3">
                    <Badge className="border-none bg-primary/90 px-2.5 py-1 font-bold text-xs backdrop-blur-md hover:bg-primary">
                      {project.matchScore}% Match
                    </Badge>
                  </div>
                </div>

                <div className="space-y-3 p-5 pt-2">
                  <div>
                    <h4 className="mb-1.5 flex cursor-pointer items-center gap-2 font-bold text-sm leading-tight transition-colors group-hover:text-primary">
                      {project.title}
                      <ExternalLink className="h-3 w-3 opacity-0 transition-opacity group-hover:opacity-40" />
                    </h4>

                    <div className="flex flex-wrap gap-2">
                      <div className="flex items-center gap-1.5 rounded-full border border-border/20 bg-slate-100 px-2 py-0.5 font-semibold text-[10px] text-muted-foreground dark:bg-zinc-800">
                        <FileText className="h-3 w-3" />
                        {project.researchArea}
                      </div>
                      <div className="rounded-full border border-border/20 bg-slate-100 px-2 py-0.5 font-semibold text-[10px] text-muted-foreground dark:bg-zinc-800">
                        {project.hostDepartment}
                      </div>
                    </div>
                  </div>

                  <p className="line-clamp-3 text-[12px] text-muted-foreground italic leading-relaxed">
                    "{project.abstract}"
                  </p>

                  <div className="flex items-center gap-2 pt-1">
                    <Button
                      onClick={() => handleDownload(project)}
                      className="h-9 flex-1 gap-2 rounded-xl bg-primary font-bold text-primary-foreground text-xs shadow-lg shadow-primary/20 hover:bg-primary/90"
                    >
                      <Download className="h-3.5 w-3.5" />
                      Download Proposal
                    </Button>
                    <Button variant="outline" size="icon" className="h-9 w-9 shrink-0 rounded-xl">
                      <Share2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
