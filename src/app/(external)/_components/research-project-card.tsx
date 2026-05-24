"use client";

import Image from "next/image";
import Link from "next/link";

import { format } from "date-fns";
import { Download, FileText } from "lucide-react";

import { Avatar, AvatarFallback, AvatarGroup, AvatarGroupCount, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { PublicProjectListItem } from "@/lib/api/projects/types";

interface ResearchProjectCardProps {
  project: PublicProjectListItem;
}

function initials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

export function ResearchProjectCard({ project }: ResearchProjectCardProps) {
  const publishedDate = project.publishedAt ? new Date(project.publishedAt) : null;
  const pi = project.members.find((member) => member.role === "PI") ?? project.members[0] ?? null;
  const visibleMembers = project.members.slice(0, 4);
  const hiddenMembersCount = Math.max(0, project.members.length - visibleMembers.length);
  const advisorCount = project.members.filter((member) => member.role === "ADVISOR").length;
  const memberCount = project.members.filter((member) => member.role === "MEMBER").length;

  return (
    <article className="group flex flex-col gap-4 border-border/50 border-b px-6 py-5 transition-all duration-150 hover:bg-muted/30 md:flex-row md:items-start md:gap-6">
      <div className="min-w-0 flex-1">
        <div className="mb-2 flex flex-wrap items-center gap-2">
          <Badge variant="secondary" className="text-xs">
            {publishedDate ? format(publishedDate, "MMM d, yyyy") : "Recently published"}
          </Badge>
        </div>

        <h3 className="mb-2 line-clamp-2 font-bold text-lg leading-tight text-foreground">{project.projectTitle}</h3>
        <p className="mb-4 line-clamp-3 text-sm leading-6 text-muted-foreground">{project.projectDescription}</p>

        <div className="space-y-2 text-sm text-muted-foreground">
          {pi && (
            <div className="flex flex-wrap items-center gap-2">
              <Badge className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] text-primary hover:bg-primary/10">
                PI
              </Badge>
              <span className="font-medium text-foreground">{pi.fullName}</span>
              {pi.email && <span className="text-xs">{pi.email}</span>}
            </div>
          )}

          <div className="flex flex-wrap items-center gap-2">
            <AvatarGroup>
              {visibleMembers.map((member) => (
                <Avatar key={member.userId} size="sm" title={`${member.fullName} (${member.role})`}>
                  {member.avatarUrl ? <AvatarImage src={member.avatarUrl} alt={member.fullName} /> : null}
                  <AvatarFallback>{initials(member.fullName)}</AvatarFallback>
                </Avatar>
              ))}
              {hiddenMembersCount > 0 ? <AvatarGroupCount>+{hiddenMembersCount}</AvatarGroupCount> : null}
            </AvatarGroup>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          {project.publicFileUrl && (
            <Button asChild size="sm" variant="outline" className="h-8 rounded-full px-3 text-xs">
              <Link href={project.publicFileUrl} target="_blank" rel="noopener noreferrer">
                <Download className="mr-1.5 h-3.5 w-3.5" />
                Public file
              </Link>
            </Button>
          )}
          {project.bannerUrl && (
            <Button asChild size="sm" variant="ghost" className="h-8 rounded-full px-3 text-xs">
              <Link href={project.bannerUrl} target="_blank" rel="noopener noreferrer">
                <FileText className="mr-1.5 h-3.5 w-3.5" />
                Banner
              </Link>
            </Button>
          )}
        </div>
      </div>

      <div className="relative h-28 w-full shrink-0 overflow-hidden rounded-lg bg-muted md:w-20">
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
      </div>
    </article>
  );
}
