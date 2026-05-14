"use client";

import type { ProjectBudgetSummary } from "../types";

function formatETB(n: number) {
  return `ETB ${n.toLocaleString("en-ET")}`;
}

interface ProgressBarProps {
  summary: ProjectBudgetSummary;
}

export function SegmentedProgressBar({ summary }: ProgressBarProps) {
  const { totalApprovedBudget, totalPaid, totalPending, totalRemaining } = summary;
  const total = totalApprovedBudget || 1;

  const paidPct = Math.max(0, Math.min(100, (totalPaid / total) * 100));
  const pendingPct = Math.max(0, Math.min(100 - paidPct, (totalPending / total) * 100));
  const remainingPct = Math.max(0, 100 - paidPct - pendingPct);

  const segments = [
    {
      pct: paidPct,
      colorClass: "bg-emerald-500",
      label: "Paid",
      amount: totalPaid,
      labelClass: "text-emerald-700 dark:text-emerald-400",
    },
    {
      pct: pendingPct,
      colorClass: "bg-amber-400",
      label: "This Request",
      amount: totalPending,
      labelClass: "text-amber-700 dark:text-amber-400",
    },
    {
      pct: remainingPct,
      colorClass: "bg-muted-foreground/20",
      label: "Remaining",
      amount: totalRemaining,
      labelClass: "text-muted-foreground",
    },
  ];

  return (
    <div className="space-y-2">
      {/* Bar */}
      <div className="flex h-3 w-full overflow-hidden rounded-full bg-muted">
        {segments.map((seg) =>
          seg.pct > 0 ? (
            <div
              key={seg.label}
              className={`${seg.colorClass} h-full transition-all duration-500`}
              style={{ width: `${seg.pct}%` }}
              title={`${seg.label}: ${formatETB(seg.amount)} (${Math.round(seg.pct)}%)`}
            />
          ) : null,
        )}
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-x-4 gap-y-1">
        {segments.map((seg) => (
          <div key={seg.label} className="flex items-center gap-1.5">
            <span className={`inline-block h-2.5 w-2.5 rounded-full ${seg.colorClass}`} />
            <span className={`font-medium text-xs ${seg.labelClass}`}>
              {seg.label}: <span className="font-mono">{formatETB(seg.amount)}</span>
            </span>
          </div>
        ))}
      </div>

      {/* Total */}
      <p className="text-muted-foreground text-xs">
        Total Approved Budget:{" "}
        <span className="font-mono font-semibold text-foreground">{formatETB(totalApprovedBudget)}</span>
      </p>
    </div>
  );
}
