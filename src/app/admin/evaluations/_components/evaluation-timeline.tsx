"use client";

import { TimelineTab } from "../../proposals/_components/timeline-tab";

interface EvaluationTimelineProps {
  proposalId?: string;
  projectId?: string;
}

export function EvaluationTimeline({ proposalId, projectId }: EvaluationTimelineProps) {
  if (proposalId) {
    return <TimelineTab proposalId={proposalId} />;
  }

  return (
    <div className="rounded-2xl border border-slate-200/80 bg-slate-50/70 p-5 text-sm text-slate-500 dark:border-slate-800 dark:bg-slate-950/40 dark:text-slate-400">
      Timeline view is available for proposal evaluations.
      {projectId ? " Project approval timeline will be connected when the project timeline endpoint is available." : ""}
    </div>
  );
}
