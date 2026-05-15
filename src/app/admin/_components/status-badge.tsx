"use client";

import { Badge } from "@/components/ui/badge";

export function StatusBadge({ status }: { status: string }) {
  const map: Record<string, "default" | "secondary" | "outline" | "destructive"> = {
    Active: "default",
    "In Review": "secondary",
    Draft: "outline",
    "Revision Needed": "destructive",
    Ready: "default",
    Pending: "secondary",
    Completed: "secondary",
    "In Progress": "outline",
  };

  const isActive = ["Active", "In Review", "Ready", "Pending", "In Progress"].includes(status);

  return (
    <Badge variant={map[status] || "outline"} className="gap-1.5 font-semibold text-xs tracking-wide">
      {isActive && (
        <span className="relative flex h-2 w-2">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-current opacity-75" />
          <span className="relative inline-flex h-2 w-2 rounded-full bg-current" />
        </span>
      )}
      {status}
    </Badge>
  );
}
