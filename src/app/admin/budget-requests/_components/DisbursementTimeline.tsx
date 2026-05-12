"use client";

import { format } from "date-fns";

import { cn } from "@/lib/utils";

import type { TimelineEntry } from "../types";

function formatETB(n: number) {
  return `ETB ${n.toLocaleString("en-ET")}`;
}

function formatDate(iso: string) {
  try {
    return format(new Date(iso), "MMM d, yyyy");
  } catch {
    return iso;
  }
}

interface DisbursementTimelineProps {
  timeline: TimelineEntry[];
  currentSequence: number;
}

export function DisbursementTimeline({ timeline }: DisbursementTimelineProps) {
  return (
    <div className="relative space-y-0">
      {timeline.map((entry, idx) => {
        const isPaid = entry.status === "PAID";
        const isCurrent = entry.status === "PENDING" || entry.status === "RESUBMITTED";
        const isLocked = entry.status === "LOCKED";

        return (
          <div key={entry.sequence} className="flex gap-3">
            {/* Dot + line */}
            <div className="flex flex-col items-center">
              <div
                className={cn(
                  "relative z-10 mt-0.5 h-3 w-3 shrink-0 rounded-full border-2",
                  isPaid
                    ? "border-emerald-500 bg-emerald-500"
                    : isCurrent
                      ? "animate-pulse border-amber-400 bg-amber-400"
                      : "border-muted-foreground/30 bg-background",
                )}
              />
              {idx < timeline.length - 1 && <div className="mt-1 mb-1 min-h-[20px] w-px flex-1 bg-border" />}
            </div>

            {/* Content */}
            <div className="min-w-0 flex-1 pb-4">
              <p
                className={cn(
                  "font-medium text-sm leading-tight",
                  isLocked ? "text-muted-foreground/60" : "text-foreground",
                )}
              >
                Disbursement #{entry.sequence} — <span className="font-mono">{formatETB(entry.amount)}</span>
              </p>

              {isPaid && entry.paidAt && (
                <p className="mt-0.5 text-emerald-600 text-xs dark:text-emerald-400">
                  ✓ PAID on {formatDate(entry.paidAt)}
                  {entry.bankTransactionId && (
                    <span className="ml-1 text-muted-foreground">· {entry.bankTransactionId}</span>
                  )}
                </p>
              )}

              {isCurrent && (
                <p className="mt-0.5 font-semibold text-amber-600 text-xs dark:text-amber-400">
                  ⏳ Awaiting Finance Review
                  {entry.submittedAt && (
                    <span className="ml-1 font-normal text-muted-foreground">
                      · Submitted {formatDate(entry.submittedAt)}
                    </span>
                  )}
                </p>
              )}

              {isLocked && <p className="mt-0.5 text-muted-foreground/50 text-xs">🔒 Locked — not yet requested</p>}
            </div>
          </div>
        );
      })}
    </div>
  );
}
