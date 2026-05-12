"use client";

import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

import type { ResearcherProject } from "../_hooks/useMyProjects";

interface ProjectSelectorCardProps {
  project: ResearcherProject;
  isSelected: boolean;
  onClick: () => void;
}

const statusColors: Record<string, string> = {
  PENDING: "bg-amber-400",
  RETURNED: "bg-red-500",
  RESUBMITTED: "bg-blue-500",
};

const statusLabels: Record<string, string> = {
  PENDING: "Pending Review",
  RETURNED: "Returned",
  RESUBMITTED: "Resubmitted",
};

function formatETB(amount: number) {
  return `ETB ${amount.toLocaleString("en-ET")}`;
}

export function ProjectSelectorCard({ project, isSelected, onClick }: ProjectSelectorCardProps) {
  const disbursedPct =
    project.totalApprovedBudget > 0 ? Math.min(100, (project.totalDisbursed / project.totalApprovedBudget) * 100) : 0;

  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "group hover:-translate-y-0.5 relative flex w-64 shrink-0 cursor-pointer flex-col gap-3 rounded-xl border-2 bg-card p-4 text-left shadow-sm transition-all duration-200 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        isSelected
          ? "border-primary bg-primary/5 shadow-md dark:bg-primary/10"
          : "border-border hover:border-primary/50",
      )}
    >
      {/* Status dot */}
      {project.activeRequestStatus && (
        <span className="absolute top-3 right-3 flex items-center gap-1.5">
          <span
            className={cn(
              "h-2.5 w-2.5 animate-pulse rounded-full",
              statusColors[project.activeRequestStatus] ?? "bg-gray-400",
            )}
          />
          <span className="font-medium text-muted-foreground text-xs">{statusLabels[project.activeRequestStatus]}</span>
        </span>
      )}

      {/* Title */}
      <div className="pr-24">
        <p className="line-clamp-2 font-semibold text-foreground text-sm leading-tight">{project.title}</p>
      </div>

      {/* Badge */}
      <Badge
        variant="outline"
        className={cn(
          "w-fit font-medium text-xs",
          project.projectType === "PG"
            ? "border-violet-300 bg-violet-50 text-violet-700 dark:border-violet-800 dark:bg-violet-950/40 dark:text-violet-300"
            : "border-sky-300 bg-sky-50 text-sky-700 dark:border-sky-800 dark:bg-sky-950/40 dark:text-sky-300",
        )}
      >
        {project.projectType === "PG" ? "PG Research" : "General Research"}
      </Badge>

      {/* Budget Progress */}
      <div className="space-y-1.5">
        <Progress value={disbursedPct} className="h-1.5" />
        <div className="flex items-center justify-between text-muted-foreground text-xs">
          <span>Disbursed: {formatETB(project.totalDisbursed)}</span>
          <span>{Math.round(disbursedPct)}%</span>
        </div>
        <p className="text-muted-foreground text-xs">of {formatETB(project.totalApprovedBudget)} approved</p>
      </div>
    </button>
  );
}

export function ProjectSelectorSkeleton() {
  return (
    <div className="flex gap-4 overflow-x-auto pb-2">
      {Array.from({ length: 3 }).map((_, i) => (
        // biome-ignore lint/suspicious/noArrayIndexKey: skeleton items
        <div key={i} className="w-64 shrink-0 space-y-3 rounded-xl border-2 border-border bg-card p-4">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-5 w-20 rounded-full" />
          <Skeleton className="h-1.5 w-full rounded-full" />
          <Skeleton className="h-3 w-1/2" />
        </div>
      ))}
    </div>
  );
}
