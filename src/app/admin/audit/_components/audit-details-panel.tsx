"use client";

import { useState } from "react";

import { ChevronDown, ChevronUp, Copy, ShieldCheck } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useCopyToClipboard } from "@/hooks/use-copy-to-clipboard";
import type { AuditEntry } from "@/lib/api/audit/types";

import { actionStyles } from "../_constants";
import { MetadataViewer } from "./metadata-viewer";

interface AuditDetailsPanelProps {
  selectedEntry: AuditEntry | null;
}

export function AuditDetailsPanel({ selectedEntry }: AuditDetailsPanelProps) {
  const [metadataExpanded, setMetadataExpanded] = useState(false);
  const { copy } = useCopyToClipboard();

  return (
    <Card className="border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900/5">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base">
          <ShieldCheck className="h-4 w-4 text-slate-500" /> Event details
        </CardTitle>
        <CardDescription>Select an entry to inspect the payload and metadata.</CardDescription>
      </CardHeader>
      <CardContent>
        {selectedEntry ? (
          <div className="space-y-5 rounded-2xl border border-slate-200/70 bg-white p-5 shadow-sm dark:border-slate-800/70 dark:bg-slate-950/80">
            <div className="flex flex-wrap items-center gap-2">
              <Badge
                className={`border text-[10px] font-bold uppercase tracking-wider ${actionStyles[selectedEntry.action].badge}`}
              >
                {selectedEntry.action.replace(/_/g, " ")}
              </Badge>
              <Badge className="border-slate-200 bg-slate-100 text-[10px] font-bold uppercase tracking-wider text-slate-700 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300">
                {selectedEntry.entityType}
              </Badge>
            </div>

            <div>
              <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Actor</p>
              <p className="mt-1 font-semibold text-slate-900 dark:text-slate-100">{selectedEntry.actorFullName}</p>
              <p className="text-sm text-slate-500 dark:text-slate-400">{selectedEntry.actorEmail}</p>
            </div>

            <div>
              <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Entity</p>
              <div className="mt-1 flex items-center gap-2">
                <p className="font-semibold text-slate-900 dark:text-slate-100">{selectedEntry.entityType}</p>
                <Button
                  variant="ghost"
                  size="sm"
                  className="rounded-full"
                  onClick={(e) => {
                    e.stopPropagation();
                    copy(selectedEntry.entityId);
                  }}
                  aria-label="Copy entity id"
                >
                  <Copy className="h-4 w-4 text-slate-500" />
                </Button>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Metadata</p>
                <button
                  type="button"
                  aria-label="Toggle metadata"
                  onClick={() => setMetadataExpanded((s) => !s)}
                  className="inline-flex items-center rounded p-1 text-slate-500 hover:text-slate-700"
                >
                  {metadataExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                </button>
              </div>

              {metadataExpanded && (
                <div className="mt-3 overflow-auto rounded-md border border-slate-200 bg-white p-3 text-xs dark:border-slate-800 dark:bg-slate-900/50">
                  <MetadataViewer metadata={selectedEntry.metadata} />
                </div>
              )}
            </div>

            <div className="rounded-2xl bg-slate-50 p-4 dark:bg-slate-900/50">
              <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Created at</p>
              <p className="mt-1 font-semibold text-slate-900 dark:text-slate-100">
                {new Date(selectedEntry.createdAt).toLocaleString()}
              </p>
            </div>
          </div>
        ) : (
          <div className="flex min-h-[320px] flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-white/70 p-6 text-center dark:border-slate-700 dark:bg-slate-950/50">
            <div className="mb-4 rounded-full bg-slate-100 p-4 text-slate-500 dark:bg-slate-800 dark:text-slate-300">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <h3 className="font-bold text-base text-slate-900 dark:text-slate-100">No event selected</h3>
            <p className="mt-2 max-w-xs text-sm text-slate-500 dark:text-slate-400">
              Choose an entry to inspect its payload and metadata.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
