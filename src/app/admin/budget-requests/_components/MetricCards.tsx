"use client";

import { AlertTriangle, Banknote, Clock } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

import type { BudgetMetrics } from "../types";

function formatETB(n: number) {
  return `ETB ${n.toLocaleString("en-ET")}`;
}

const metrics = [
  {
    key: "pending" as const,
    title: "Total Pending Disbursements",
    icon: Clock,
    iconClass: "text-amber-600 dark:text-amber-400",
    cardClass: "border-amber-200 bg-gradient-to-br from-amber-50 to-card dark:border-amber-900 dark:from-amber-950/30",
    valueClass: "text-amber-700 dark:text-amber-400",
  },
  {
    key: "disbursed" as const,
    title: "Disbursed All Time",
    icon: Banknote,
    iconClass: "text-emerald-600 dark:text-emerald-400",
    cardClass:
      "border-emerald-200 bg-gradient-to-br from-emerald-50 to-card dark:border-emerald-900 dark:from-emerald-950/30",
    valueClass: "text-emerald-700 dark:text-emerald-400",
  },
  {
    key: "correction" as const,
    title: "Awaiting PI Correction",
    icon: AlertTriangle,
    iconClass: "text-red-600 dark:text-red-400",
    cardClass: "border-red-200 bg-gradient-to-br from-red-50 to-card dark:border-red-900 dark:from-red-950/30",
    valueClass: "text-red-700 dark:text-red-400",
  },
];

interface MetricCardsProps {
  data: BudgetMetrics;
}

function getValue(key: string, data: BudgetMetrics): string {
  if (key === "pending") return formatETB(data.totalPendingAmount);
  if (key === "disbursed") return formatETB(data.totalDisbursedAllTime);
  if (key === "correction") return String(data.awaitingCorrectionCount);
  return "";
}

function getSubValue(key: string, data: BudgetMetrics): string {
  if (key === "pending") return `${data.pendingCount} request${data.pendingCount !== 1 ? "s" : ""} pending`;
  if (key === "disbursed") return "Total funds released to date";
  if (key === "correction") return `request${data.awaitingCorrectionCount !== 1 ? "s" : ""} returned to PI`;
  return "";
}

export function MetricCards({ data }: MetricCardsProps) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
      {metrics.map((m) => {
        const Icon = m.icon;
        return (
          <Card key={m.key} className={m.cardClass}>
            <CardHeader className="flex flex-row items-center justify-between px-5 pt-4 pb-2">
              <CardTitle className="font-medium text-muted-foreground text-sm">{m.title}</CardTitle>
              <div className="rounded-lg bg-background/60 p-1.5 shadow-sm">
                <Icon className={`h-4 w-4 ${m.iconClass}`} />
              </div>
            </CardHeader>
            <CardContent className="px-5 pb-4">
              <p className={`font-bold text-2xl tracking-tight ${m.valueClass}`}>{getValue(m.key, data)}</p>
              <p className="mt-0.5 text-muted-foreground text-xs">{getSubValue(m.key, data)}</p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}

export function MetricCardsSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
      {Array.from({ length: 3 }).map((_, i) => (
        // biome-ignore lint/suspicious/noArrayIndexKey: skeleton items
        <Card key={i}>
          <CardHeader className="flex flex-row items-center justify-between px-5 pt-4 pb-2">
            <Skeleton className="h-4 w-40" />
            <Skeleton className="h-8 w-8 rounded-lg" />
          </CardHeader>
          <CardContent className="space-y-1.5 px-5 pb-4">
            <Skeleton className="h-8 w-36" />
            <Skeleton className="h-3 w-24" />
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
