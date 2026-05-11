"use client";

import Image from "next/image";

import { format } from "date-fns";
import { Download, FileText, User } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { PublicProjectListItem } from "@/lib/api/projects/types";

interface ResearchProjectCardProps {
  project: PublicProjectListItem;
}

export function ResearchProjectCard({ project }: ResearchProjectCardProps) {
  const publishedDate = new Date(project.publishedAt);

  return (
    <div className="group flex items-center gap-6 border-border/50 border-b px-6 py-5 transition-all duration-150 hover:bg-muted/30">
      {/* Left: Content Area */}
      <div className="min-w-0 flex-1">
        <h3 className="mb-2 line-clamp-2 font-bold text-foreground text-lg leading-tight">{project.projectTitle}</h3>

        {/* Metadata Badge Row */}
        <div className="mb-3 flex flex-wrap items-center gap-2">
          <Badge variant="secondary" className="text-xs">
            {format(publishedDate, "MMM d, yyyy")}
          </Badge>

          <Badge variant="secondary" className="text-xs">
            {project.department}
          </Badge>

          {project.projectProgram && (
            <Badge variant="outline" className="text-xs">
              {project.projectProgram}
            </Badge>
          )}
        </div>
      </div>

      {/* Right: Thumbnail */}
      <div className="flex flex-shrink-0 items-center">
        {/* Document Preview Thumbnail (click image to open); download icon overlay bottom-left */}
        <div className="relative h-28 w-20 overflow-hidden rounded-sm bg-muted">
          {project.publicFileUrl ? (
            <a href={project.publicFileUrl} target="_blank" rel="noopener noreferrer" className="block h-full w-full">
              {project.bannerUrl ? (
                <Image
                  src={project.bannerUrl}
                  alt={project.projectTitle}
                  fill
                  unoptimized
                  className="object-cover"
                  sizes="80px"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-muted/60">
                  <FileText className="h-6 w-6 text-muted-foreground/70" />
                </div>
              )}
            </a>
          ) : project.bannerUrl ? (
            <Image
              src={project.bannerUrl}
              alt={project.projectTitle}
              fill
              unoptimized
              className="object-cover"
              sizes="80px"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-muted/60">
              <FileText className="h-6 w-6 text-muted-foreground/70" />
            </div>
          )}

          {project.publicFileUrl && (
            <Button
              asChild
              size="icon"
              variant="ghost"
              title="Download PDF"
              aria-label="Download PDF"
              className="absolute left-2 bottom-2 z-10 h-8 w-8"
            >
              <a href={project.publicFileUrl} target="_blank" rel="noopener noreferrer" download>
                <Download className="h-4 w-4" />
              </a>
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
