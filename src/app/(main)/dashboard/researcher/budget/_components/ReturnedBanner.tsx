"use client";

import { useState } from "react";

import { AlertTriangle, X } from "lucide-react";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";

import type { ResearcherProject } from "../_hooks/useMyProjects";

interface ReturnedBannerProps {
  projects: ResearcherProject[];
  onSelectProject: (projectId: string) => void;
}

export function ReturnedBanner({ projects, onSelectProject }: ReturnedBannerProps) {
  const [dismissed, setDismissed] = useState(false);

  const returnedProjects = projects.filter((p) => p.activeRequestStatus === "RETURNED");
  if (dismissed || returnedProjects.length === 0) return null;

  return (
    <Alert className="relative border-red-200 bg-red-50 text-red-800 dark:border-red-900 dark:bg-red-950/40 dark:text-red-300">
      <AlertTriangle className="h-4 w-4 text-red-600 dark:text-red-400" />
      <AlertDescription className="flex items-center justify-between gap-4 pr-8">
        <button
          type="button"
          className="cursor-pointer text-left hover:underline"
          onClick={() => {
            if (returnedProjects[0]) onSelectProject(returnedProjects[0].projectId);
          }}
        >
          ⚠️{" "}
          {returnedProjects.length > 1
            ? `${returnedProjects.length} of your projects have`
            : "One of your projects has"}{" "}
          a returned budget request. Please review and fix {returnedProjects.length > 1 ? "them" : "it"}.{" "}
          <span className="font-semibold underline">Click to navigate.</span>
        </button>
      </AlertDescription>
      <Button
        variant="ghost"
        size="icon"
        className="absolute top-2 right-2 h-6 w-6 text-red-600 hover:bg-red-100 dark:text-red-400 dark:hover:bg-red-900/40"
        onClick={() => setDismissed(true)}
      >
        <X className="h-3.5 w-3.5" />
      </Button>
    </Alert>
  );
}
