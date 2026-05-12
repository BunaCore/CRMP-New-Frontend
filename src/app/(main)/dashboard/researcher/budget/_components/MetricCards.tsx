"use client";

import { DollarSign, TrendingDown, Wallet } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

import type { ProjectBudgetDashboard } from "../_hooks/useProjectBudget";

function formatETB(amount: number) {
  return `ETB ${amount.toLocaleString("en-ET")}`;
}

interface MetricCardsProps {
  dashboard: ProjectBudgetDashboard;
}

export function MetricCards({ dashboard }: MetricCardsProps) {
  const metrics = [
    {
      title: "Total Approved Budget",
      value: formatETB(dashboard.totalApprovedBudget),
      icon: DollarSign,
      iconClass: "text-violet-600 dark:text-violet-400",
      cardClass:
        "border-violet-200 bg-gradient-to-br from-violet-50 to-card dark:border-violet-900 dark:from-violet-950/30",
      valueClass: "text-foreground",
    },
    {
      title: "Total Disbursed",
      value: formatETB(dashboard.totalDisbursed),
      icon: TrendingDown,
      iconClass: "text-emerald-600 dark:text-emerald-400",
      cardClass:
        "border-emerald-200 bg-gradient-to-br from-emerald-50 to-card dark:border-emerald-900 dark:from-emerald-950/30",
      valueClass: "text-emerald-700 dark:text-emerald-400",
    },
    {
      title: "Remaining Balance",
      value: formatETB(dashboard.remainingBalance),
      icon: Wallet,
      iconClass: "text-blue-600 dark:text-blue-400",
      cardClass: "border-blue-200 bg-gradient-to-br from-blue-50 to-card dark:border-blue-900 dark:from-blue-950/30",
      valueClass: "text-blue-700 dark:text-blue-400",
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
      {metrics.map((metric) => {
        const Icon = metric.icon;
        return (
          <Card key={metric.title} className={metric.cardClass}>
            <CardHeader className="flex flex-row items-center justify-between px-5 pt-4 pb-2">
              <CardTitle className="font-medium text-muted-foreground text-sm">{metric.title}</CardTitle>
              <div className="rounded-lg bg-background/60 p-1.5 shadow-sm">
                <Icon className={`h-4 w-4 ${metric.iconClass}`} />
              </div>
            </CardHeader>
            <CardContent className="px-5 pb-4">
              <p className={`font-bold text-2xl tracking-tight ${metric.valueClass}`}>{metric.value}</p>
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
        <Card key={i} className="border-border">
          <CardHeader className="flex flex-row items-center justify-between px-5 pt-4 pb-2">
            <Skeleton className="h-4 w-36" />
            <Skeleton className="h-8 w-8 rounded-lg" />
          </CardHeader>
          <CardContent className="px-5 pb-4">
            <Skeleton className="h-8 w-40" />
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
