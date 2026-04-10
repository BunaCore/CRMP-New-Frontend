"use client";

import { AlertTriangle, Banknote, CheckCircle2, ChevronRight, Clock, Download, RefreshCw, Search } from "lucide-react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

import { MOCK_BUDGET_REQUESTS } from "../_data/mock-budget-requests";
import { useBudgetRequests } from "../budget-context";
import type { BudgetRequestStatus } from "../types";

export const STATUS_CFG: Record<BudgetRequestStatus, { label: string; className: string; icon: React.ReactNode }> = {
  Pending: {
    label: "Pending Review",
    className: "bg-amber-100 text-amber-900 dark:bg-amber-950/50 dark:text-amber-200",
    icon: <Clock className="h-3 w-3" />,
  },
  Paid: {
    label: "Paid",
    className: "bg-emerald-100 text-emerald-900 dark:bg-emerald-950/50 dark:text-emerald-200",
    icon: <CheckCircle2 className="h-3 w-3" />,
  },
  Returned: {
    label: "Returned",
    className: "bg-rose-100 text-rose-900 dark:bg-rose-950/50 dark:text-rose-200",
    icon: <AlertTriangle className="h-3 w-3" />,
  },
  Resubmitted: {
    label: "Resubmitted",
    className: "bg-sky-100 text-sky-900 dark:bg-sky-950/50 dark:text-sky-200",
    icon: <RefreshCw className="h-3 w-3" />,
  },
};

export function BudgetRequestsTable() {
  const { search, setSearch, statusFilter, setStatusFilter, filtered, openDrawer } = useBudgetRequests();

  // Metric computations
  const totalPending = MOCK_BUDGET_REQUESTS.reduce((acc, d) => {
    const activePhase = d.phases[d.activePhasIndex];
    if (activePhase?.status === "Pending" || activePhase?.status === "Resubmitted") {
      return acc + activePhase.amount;
    }
    return acc;
  }, 0);

  const disbursedThisMonth = MOCK_BUDGET_REQUESTS.reduce((acc, d) => {
    return acc + d.phases.filter((p) => p.status === "Paid").reduce((s, p) => s + (p.approvedAmount ?? 0), 0);
  }, 0);

  const awaitingRevision = MOCK_BUDGET_REQUESTS.filter(
    (d) => d.phases[d.activePhasIndex]?.status === "Returned",
  ).length;

  const fmt = (n: number) =>
    new Intl.NumberFormat("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(n);

  return (
    <div className="flex flex-col gap-6">
      {/* ── METRIC CARDS ── */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="flex flex-col gap-1 rounded-2xl border border-amber-200/60 bg-gradient-to-br from-amber-50 to-white p-5 shadow-sm dark:border-amber-900/30 dark:from-amber-950/30 dark:to-slate-950">
          <p className="flex items-center gap-1.5 text-[10px] font-bold tracking-wider text-amber-700 uppercase dark:text-amber-400">
            <Clock className="h-3.5 w-3.5" /> Total Pending Disbursements
          </p>
          <p className="text-2xl font-black text-amber-700 dark:text-amber-300">Br {fmt(totalPending)}</p>
          <p className="text-[11px] text-amber-600/80 dark:text-amber-500">Awaiting Finance action</p>
        </div>

        <div className="flex flex-col gap-1 rounded-2xl border border-emerald-200/60 bg-gradient-to-br from-emerald-50 to-white p-5 shadow-sm dark:border-emerald-900/30 dark:from-emerald-950/30 dark:to-slate-950">
          <p className="flex items-center gap-1.5 text-[10px] font-bold tracking-wider text-emerald-700 uppercase dark:text-emerald-400">
            <CheckCircle2 className="h-3.5 w-3.5" /> Disbursed (All Time)
          </p>
          <p className="text-2xl font-black text-emerald-700 dark:text-emerald-300">Br {fmt(disbursedThisMonth)}</p>
          <p className="text-[11px] text-emerald-600/80 dark:text-emerald-500">Cleared &amp; stamped as paid</p>
        </div>

        <div className="flex flex-col gap-1 rounded-2xl border border-rose-200/60 bg-gradient-to-br from-rose-50 to-white p-5 shadow-sm dark:border-rose-900/30 dark:from-rose-950/30 dark:to-slate-950">
          <p className="flex items-center gap-1.5 text-[10px] font-bold tracking-wider text-rose-700 uppercase dark:text-rose-400">
            <AlertTriangle className="h-3.5 w-3.5" /> Awaiting PI Correction
          </p>
          <p className="text-2xl font-black text-rose-700 dark:text-rose-300">{awaitingRevision}</p>
          <p className="text-[11px] text-rose-600/80 dark:text-rose-500">Returned for clearance fix</p>
        </div>
      </div>

      {/* ── CONTROLS ROW ── */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <Tabs value={statusFilter} onValueChange={setStatusFilter}>
          <TabsList className="h-10 justify-start rounded-xl bg-slate-100 p-1 dark:bg-slate-900">
            {["all", "Pending", "Resubmitted", "Paid", "Returned"].map((s) => (
              <TabsTrigger
                key={s}
                value={s}
                className="rounded-lg px-4 font-semibold capitalize data-[state=active]:bg-white data-[state=active]:shadow-sm dark:data-[state=active]:bg-slate-800"
              >
                {s === "all" ? "All" : STATUS_CFG[s as BudgetRequestStatus].label}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>

        <div className="flex flex-wrap items-center gap-2">
          <div className="relative w-full sm:w-72">
            <Search className="absolute top-1/2 left-3 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
            <Input
              placeholder="Search project, PI, ID…"
              className="h-9 rounded-lg pl-9 dark:bg-slate-950"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <Button
            variant="outline"
            size="sm"
            className="h-9 shrink-0 gap-1.5 font-semibold text-slate-600 dark:text-slate-300"
          >
            <Download className="h-3.5 w-3.5" />
            Export Ledger
          </Button>
        </div>
      </div>

      {/* ── TABLE ── */}
      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-950">
        <Table>
          <TableHeader className="bg-slate-50 dark:bg-slate-900/50">
            <TableRow>
              <TableHead className="pl-5 text-xs font-semibold uppercase">Project</TableHead>
              <TableHead className="text-xs font-semibold uppercase">PI</TableHead>
              <TableHead className="text-xs font-semibold uppercase">Mode</TableHead>
              <TableHead className="text-xs font-semibold uppercase">Phase</TableHead>
              <TableHead className="text-xs font-semibold uppercase">Amount</TableHead>
              <TableHead className="text-xs font-semibold uppercase">Status</TableHead>
              <TableHead className="text-xs font-semibold uppercase">Days Waiting</TableHead>
              <TableHead className="w-[120px] pr-5 text-right text-xs font-semibold uppercase" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.length === 0 && (
              <TableRow>
                <TableCell colSpan={8} className="py-12 text-center text-sm text-slate-400 italic">
                  No budget requests match your current filters.
                </TableCell>
              </TableRow>
            )}
            {filtered.map((d) => {
              const activePhase = d.phases[d.activePhasIndex];
              const cfg = STATUS_CFG[activePhase?.status ?? "Pending"];
              const isResubmitted = activePhase?.status === "Resubmitted";

              // Days waiting
              const submittedDate = activePhase?.submittedAt ? new Date(activePhase.submittedAt) : null;
              const daysWaiting = submittedDate
                ? Math.floor((Date.now() - submittedDate.getTime()) / 86_400_000)
                : null;

              return (
                <TableRow
                  key={d.id}
                  className={cn(
                    "border-slate-100 dark:border-slate-800",
                    isResubmitted && "bg-amber-50/40 dark:bg-amber-950/10",
                  )}
                >
                  <TableCell className="py-4 pl-5">
                    <div className="flex flex-col gap-0.5">
                      <span className="line-clamp-1 text-[13px] font-semibold text-slate-900 dark:text-slate-100">
                        {d.projectTitle}
                      </span>
                      <span className="text-[10px] font-bold tracking-wider text-slate-400 uppercase">
                        {d.projectId} · {d.dept}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="py-4">
                    <div className="flex items-center gap-2">
                      <Avatar className="h-7 w-7">
                        <AvatarFallback className={cn("text-[10px] font-bold", d.piColor)}>{d.piAvatar}</AvatarFallback>
                      </Avatar>
                      <span className="text-[13px] font-medium text-slate-700 dark:text-slate-300">{d.pi}</span>
                    </div>
                  </TableCell>
                  <TableCell className="py-4">
                    <Badge
                      className={cn(
                        "border-0 text-[10px] font-semibold",
                        d.mode === "All-at-once"
                          ? "bg-violet-100 text-violet-800 dark:bg-violet-900/30 dark:text-violet-300"
                          : "bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300",
                      )}
                    >
                      <Banknote className="mr-1 h-3 w-3" />
                      {d.mode}
                    </Badge>
                  </TableCell>
                  <TableCell className="py-4">
                    <span className="text-sm font-bold text-slate-800 dark:text-slate-200">
                      {d.activePhasIndex + 1}{" "}
                      <span className="text-xs font-medium text-slate-400">/ {d.phases.length}</span>
                    </span>
                  </TableCell>
                  <TableCell className="py-4 text-[13px] font-semibold text-slate-700 dark:text-slate-300">
                    Br {new Intl.NumberFormat("en-US").format(activePhase?.amount ?? 0)}
                  </TableCell>
                  <TableCell className="py-4">
                    <Badge
                      className={cn("flex w-fit items-center gap-1 border-0 text-[10px] font-bold", cfg.className)}
                    >
                      {cfg.icon}
                      {cfg.label}
                    </Badge>
                  </TableCell>
                  <TableCell className="py-4">
                    {daysWaiting !== null ? (
                      <span
                        className={cn(
                          "text-sm font-semibold",
                          daysWaiting > 7 ? "text-rose-600" : "text-slate-600 dark:text-slate-300",
                        )}
                      >
                        {daysWaiting}d
                      </span>
                    ) : (
                      <span className="text-sm text-slate-300">—</span>
                    )}
                  </TableCell>
                  <TableCell className="py-4 pr-5 text-right">
                    <Button
                      size="sm"
                      className="h-8 rounded-lg bg-emerald-600 text-xs font-semibold hover:bg-emerald-700"
                      onClick={() => openDrawer(d)}
                    >
                      Review
                      <ChevronRight className="ml-1 h-3.5 w-3.5" />
                    </Button>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
