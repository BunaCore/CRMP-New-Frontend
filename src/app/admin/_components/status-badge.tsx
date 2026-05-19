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
  };

  return (
    <Badge variant={map[status] || "outline"} className="font-semibold text-xs tracking-wide">
      {status}
    </Badge>
  );
}
