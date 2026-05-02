"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Sparkles, Download, FileText, Share2, Search, ExternalLink } from "lucide-react";
import { useWorkspace } from "../workspace-context";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";

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
    abstract: "This project explores the integration of real-time sensor data with deep learning models to predict urban infrastructure failures during extreme weather events. The goal is to provide a decision-support system for city planners.",
    diagram: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800&auto=format&fit=crop&q=60",
    matchScore: 94,
    downloadUrl: "#",
  },
  {
    id: "rel-2",
    title: "Sustainable Water Management in Arid Regions",
    researchArea: "Environmental Engineering",
    hostDepartment: "Department of Civil Engineering",
    abstract: "A comprehensive study on advanced desalination techniques and wastewater recycling frameworks tailored for high-scarcity environments. Includes a novel filtration system design.",
    diagram: "https://images.unsplash.com/photo-1544333346-64e396efec4e?w=800&auto=format&fit=crop&q=60",
    matchScore: 88,
    downloadUrl: "#",
  },
  {
    id: "rel-3",
    title: "Blockchain for Decentralized Energy Markets",
    researchArea: "FinTech & Renewable Energy",
    hostDepartment: "School of Economics & Computer Science",
    abstract: "Implementing a peer-to-peer energy trading platform using Ethereum smart contracts to empower local communities with solar microgrids.",
    diagram: "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=800&auto=format&fit=crop&q=60",
    matchScore: 82,
    downloadUrl: "#",
  },
  {
    id: "rel-4",
    title: "Cognitive Computing in Higher Education",
    researchArea: "Educational Technology",
    hostDepartment: "Faculty of Education",
    abstract: "Analyzing the impact of personalized AI tutors on student engagement and retention rates in large-scale undergraduate courses.",
    diagram: "https://images.unsplash.com/photo-1501504905252-473c47e087f8?w=800&auto=format&fit=crop&q=60",
    matchScore: 76,
    downloadUrl: "#",
  }
];

export function ActivityTab() {
  const { projectId } = useWorkspace();
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1200);
    return () => clearTimeout(timer);
  }, [projectId]);

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
    <div className="flex flex-col h-full bg-slate-50/50 dark:bg-zinc-950/50">
      {/* Header & Search */}
      <div className="p-6 pb-4 space-y-4 shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-primary/10 text-primary">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-bold text-base tracking-tight">Related Research</h3>
              <p className="text-[11px] text-muted-foreground font-medium uppercase tracking-widest">Powered by AI Analysis</p>
            </div>
          </div>
          <Button variant="ghost" size="icon" className="rounded-full h-9 w-9">
            <Share2 className="h-4 w-4" />
          </Button>
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search related proposals..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-background border border-border/50 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
          />
        </div>
      </div>

      {/* Projects List */}
      <div className="flex-1 overflow-y-auto px-6 pb-6 space-y-5 custom-scrollbar">
        {MOCK_RELATED_PROJECTS.filter(p => 
          p.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
          p.researchArea.toLowerCase().includes(searchTerm.toLowerCase())
        ).map((project, index) => (
          <motion.div
            key={project.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1, duration: 0.4 }}
          >
            <Card className="group border-border/40 bg-background/60 hover:bg-background hover:shadow-xl hover:shadow-primary/5 transition-all duration-500 overflow-hidden rounded-3xl">
              <CardContent className="p-0">
                {/* Image/Diagram Preview */}
                <div className="relative h-32 overflow-hidden bg-muted">
                  <img 
                    src={project.diagram} 
                    alt="Proposal Diagram" 
                    className="w-full h-full object-cover opacity-60 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent" />
                  <div className="absolute top-3 right-3">
                    <Badge className="bg-primary/90 hover:bg-primary backdrop-blur-md border-none px-2.5 py-1 text-xs font-bold">
                      {project.matchScore}% Match
                    </Badge>
                  </div>
                </div>

                <div className="p-5 pt-2 space-y-3">
                  <div>
                    <h4 className="font-bold text-sm leading-tight group-hover:text-primary transition-colors cursor-pointer mb-1.5 flex items-center gap-2">
                      {project.title}
                      <ExternalLink className="h-3 w-3 opacity-0 group-hover:opacity-40 transition-opacity" />
                    </h4>
                    
                    <div className="flex flex-wrap gap-2">
                      <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-slate-100 dark:bg-zinc-800 text-[10px] font-semibold text-muted-foreground border border-border/20">
                        <FileText className="h-3 w-3" />
                        {project.researchArea}
                      </div>
                      <div className="px-2 py-0.5 rounded-full bg-slate-100 dark:bg-zinc-800 text-[10px] font-semibold text-muted-foreground border border-border/20">
                        {project.hostDepartment}
                      </div>
                    </div>
                  </div>

                  <p className="text-[12px] text-muted-foreground line-clamp-3 leading-relaxed italic">
                    "{project.abstract}"
                  </p>

                  <div className="flex items-center gap-2 pt-1">
                    <Button 
                      onClick={() => handleDownload(project)}
                      className="flex-1 h-9 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground gap-2 text-xs font-bold shadow-lg shadow-primary/20"
                    >
                      <Download className="h-3.5 w-3.5" />
                      Download Proposal
                    </Button>
                    <Button variant="outline" size="icon" className="h-9 w-9 rounded-xl shrink-0">
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
