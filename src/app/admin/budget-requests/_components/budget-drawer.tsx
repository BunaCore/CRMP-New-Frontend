"use client";

import {
  AlertTriangle,
  Banknote,
  Building2,
  Check,
  CheckCircle2,
  Circle,
  Clock,
  FileCheck,
  FileText,
  Info,
  Lock,
  RefreshCw,
  Stamp,
  XCircle,
} from "lucide-react";

import { Can } from "@/access-control/permission-gates";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

import { useBudgetRequests } from "../budget-context";
import type { BudgetPhase } from "../types";
import { STATUS_CFG } from "./budget-table";

function PhaseStatusIcon({ status }: { status: BudgetPhase["status"] | "locked" }) {
  if (status === "Paid") return <Check className="h-4 w-4 stroke-[3]" />;
  if (status === "Pending" || status === "Resubmitted") return <Clock className="h-4 w-4" />;
  if (status === "Returned") return <AlertTriangle className="h-4 w-4" />;
  return <Lock className="h-4 w-4" />;
}

export function BudgetRequestDrawer() {
  const { selected, closeDrawer, setShowPaidDialog, setShowReturnDialog } = useBudgetRequests();

  if (!selected) return null;

  const totalPaid = selected.phases
    .filter((p) => p.status === "Paid")
    .reduce((acc, p) => acc + (p.approvedAmount ?? p.amount), 0);

  const totalPending = selected.phases
    .filter((p) => p.status === "Pending" || p.status === "Resubmitted")
    .reduce((acc, p) => acc + p.amount, 0);

  const remaining = selected.totalBudget - totalPaid - totalPending;
  const paidPct = (totalPaid / selected.totalBudget) * 100;
  const pendingPct = (totalPending / selected.totalBudget) * 100;

  const fmt = (n: number) => `Br ${new Intl.NumberFormat("en-US").format(n)}`;

  const activePhase = selected.phases[selected.activePhasIndex];
  const isActionable =
    activePhase?.status === "Pending" || activePhase?.status === "Resubmitted";

  return (
    <Sheet open={!!selected} onOpenChange={(o) => !o && closeDrawer()}>
      <SheetContent
        side="right"
        className="flex w-full flex-col overflow-hidden border-slate-200/80 border-l bg-white p-0 shadow-2xl sm:max-w-[800px] xl:max-w-[960px] dark:border-slate-800 dark:bg-slate-950"
      >
        {/* ── HEADER ── */}
        <SheetHeader className="shrink-0 space-y-0 border-slate-100 border-b bg-gradient-to-b from-emerald-50/70 via-white to-white px-6 pt-6 pb-4 dark:border-slate-800 dark:from-emerald-950/20 dark:via-slate-950 dark:to-slate-950">
          <div className="flex flex-col gap-2">
            <div className="flex flex-wrap items-center gap-2">
              <Badge className="border-0 bg-slate-200/80 font-bold text-[10px] text-slate-700 uppercase dark:bg-slate-800 dark:text-slate-300">
                {selected.projectId}
              </Badge>
              <Badge
                className={cn(
                  "flex items-center gap-1 border-0 font-bold text-[10px]",
                  selected.mode === "All-at-once"
                    ? "bg-violet-100 text-violet-800 dark:bg-violet-900/30 dark:text-violet-300"
                    : "bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300",
                )}
              >
                <Banknote className="h-3 w-3" />
                {selected.mode}
              </Badge>
              {activePhase?.status && (
                <Badge
                  className={cn(
                    "flex items-center gap-1 border-0 font-bold text-[10px]",
                    STATUS_CFG[activePhase.status].className,
                  )}
                >
                  {STATUS_CFG[activePhase.status].icon}
                  {STATUS_CFG[activePhase.status].label}
                </Badge>
              )}
            </div>
            <SheetTitle className="pr-2 font-bold text-[16px] text-slate-900 leading-snug tracking-tight dark:text-slate-100">
              {selected.projectTitle}
            </SheetTitle>
            <SheetDescription className="font-medium text-slate-500 text-xs leading-relaxed">
              {selected.dept} · {selected.pi} · Total Budget: {fmt(selected.totalBudget)}
            </SheetDescription>
          </div>
        </SheetHeader>

        {/* ── BODY ── */}
        <div className="flex flex-1 flex-col gap-6 overflow-y-auto px-6 py-6 sm:px-8 sm:py-7">

          {/* ── ZONE A: DRAWDOWN PROGRESS ── */}
          <div className="flex flex-col gap-4 rounded-2xl border border-slate-200/80 bg-gradient-to-br from-slate-50 to-white p-5 shadow-sm dark:border-slate-800 dark:from-slate-900/40 dark:to-slate-950">
            <div className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-600/10 text-emerald-600 dark:bg-emerald-500/15 dark:text-emerald-400">
                <Banknote className="h-4 w-4" />
              </div>
              <div>
                <h4 className="font-bold text-slate-900 text-sm dark:text-slate-100">Budget Drawdown Overview</h4>
                <p className="font-medium text-[11px] text-slate-500 dark:text-slate-400">
                  All phases shown — paid, pending, and locked.
                </p>
              </div>
            </div>

            {/* Multi-segment progress bar */}
            <div className="relative h-3 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
              <div
                className="absolute top-0 left-0 h-full rounded-l-full bg-emerald-500 transition-all"
                style={{ width: `${Math.min(paidPct, 100)}%` }}
              />
              <div
                className="absolute top-0 h-full bg-amber-400 transition-all"
                style={{ left: `${Math.min(paidPct, 100)}%`, width: `${Math.min(pendingPct, 100 - paidPct)}%` }}
              />
            </div>

            {/* Legend */}
            <div className="flex flex-wrap gap-4">
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-emerald-500" />
                <p className="font-medium text-[11px] text-slate-600 dark:text-slate-400">
                  Paid: <span className="font-bold text-emerald-700 dark:text-emerald-400">{fmt(totalPaid)}</span>
                </p>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-amber-400" />
                <p className="font-medium text-[11px] text-slate-600 dark:text-slate-400">
                  Pending: <span className="font-bold text-amber-700 dark:text-amber-400">{fmt(totalPending)}</span>
                </p>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-slate-200 dark:bg-slate-700" />
                <p className="font-medium text-[11px] text-slate-600 dark:text-slate-400">
                  Remaining: <span className="font-bold text-slate-700 dark:text-slate-300">{fmt(Math.max(remaining, 0))}</span>
                </p>
              </div>
            </div>

            {/* Phase Timeline */}
            <div className="relative mt-2">
              <div
                className="absolute top-5 bottom-5 left-[19px] w-px bg-gradient-to-b from-emerald-200 via-amber-200 to-slate-200 dark:from-emerald-900/40 dark:via-amber-900/30 dark:to-slate-800"
                aria-hidden
              />
              <ul className="relative flex flex-col gap-3">
                {selected.phases.map((phase, idx) => {
                  const isActive = idx === selected.activePhasIndex;
                  const isPaid = phase.status === "Paid";
                  const isReturned = phase.status === "Returned";
                  const isLocked = !phase.submittedAt && phase.status === "Pending" && idx > selected.activePhasIndex;

                  return (
                    <li key={phase.phase} className="relative flex items-start gap-4 pl-1">
                      {/* Step circle */}
                      <div
                        className={cn(
                          "relative z-[1] mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 shadow-sm",
                          isPaid
                            ? "border-emerald-200 bg-emerald-500 text-white dark:border-emerald-800 dark:bg-emerald-600"
                            : isReturned
                              ? "border-rose-200 bg-rose-500 text-white dark:border-rose-800 dark:bg-rose-600"
                              : isActive
                                ? "border-amber-300 bg-amber-500 text-white ring-4 ring-amber-400/20 dark:border-amber-600 dark:bg-amber-600"
                                : "border-slate-200 bg-slate-100 text-slate-400 dark:border-slate-700 dark:bg-slate-800",
                        )}
                      >
                        <PhaseStatusIcon status={isLocked ? "locked" : phase.status} />
                      </div>

                      {/* Phase card */}
                      <div
                        className={cn(
                          "min-w-0 flex-1 rounded-xl border p-3.5 transition-all",
                          isPaid
                            ? "border-emerald-100 bg-emerald-50/40 dark:border-emerald-900/25 dark:bg-emerald-950/20"
                            : isReturned
                              ? "border-rose-100 bg-rose-50/40 dark:border-rose-900/25 dark:bg-rose-950/20"
                              : isActive
                                ? "border-amber-200 bg-gradient-to-br from-amber-50/90 to-white shadow-sm dark:border-amber-900/40 dark:from-amber-950/30 dark:to-slate-950"
                                : "border-slate-100 bg-slate-50/40 opacity-60 dark:border-slate-800 dark:bg-slate-900/20",
                        )}
                      >
                        <div className="flex flex-wrap items-start justify-between gap-2">
                          <div>
                            <p className="font-bold text-[10px] text-slate-400 uppercase tracking-wider dark:text-slate-500">
                              Phase {phase.phase}
                            </p>
                            <p className="mt-0.5 font-semibold text-slate-900 text-sm dark:text-slate-100">
                              {phase.label}
                            </p>
                            <p className="font-bold text-[13px] text-slate-700 dark:text-slate-300">
                              {fmt(phase.amount)}
                              {phase.approvedAmount && phase.approvedAmount !== phase.amount && (
                                <span className="ml-1.5 font-medium text-[11px] text-emerald-600">
                                  (approved: {fmt(phase.approvedAmount)})
                                </span>
                              )}
                            </p>
                            {isPaid && phase.actedAt && (
                              <p className="mt-1 flex items-center gap-1 font-medium text-[11px] text-emerald-700 dark:text-emerald-400">
                                <CheckCircle2 className="h-3 w-3" />
                                Paid on {phase.actedAt}
                                {phase.transactionId && (
                                  <span className="ml-1 rounded bg-emerald-100 px-1.5 py-0.5 font-mono text-[10px] text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300">
                                    {phase.transactionId}
                                  </span>
                                )}
                              </p>
                            )}
                            {isReturned && phase.financeComment && (
                              <p className="mt-1 flex items-start gap-1 font-medium text-[11px] text-rose-700 dark:text-rose-400">
                                <XCircle className="mt-0.5 h-3 w-3 shrink-0" />
                                {phase.financeComment}
                              </p>
                            )}
                            {isLocked && (
                              <p className="mt-1 font-medium text-[11px] text-slate-400 italic dark:text-slate-500">
                                Locked — awaiting prior phase clearance
                              </p>
                            )}
                          </div>
                          <div className="flex flex-wrap gap-1.5">
                            {isPaid && (
                              <Badge className="border-0 bg-emerald-100 font-bold text-[10px] text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300">
                                <Check className="mr-1 h-3 w-3 stroke-[3]" /> Paid
                              </Badge>
                            )}
                            {isReturned && (
                              <Badge className="border-0 bg-rose-100 font-bold text-[10px] text-rose-800 dark:bg-rose-900/40 dark:text-rose-300">
                                Returned
                              </Badge>
                            )}
                            {isActive && !isPaid && !isReturned && (
                              <Badge className="border-0 bg-amber-100 font-bold text-[10px] text-amber-800 dark:bg-amber-900/40 dark:text-amber-300">
                                Active Request
                              </Badge>
                            )}
                            {phase.clearanceFileName && (
                              <Badge className="flex cursor-pointer items-center gap-1 border-0 bg-blue-100 font-bold text-[10px] text-blue-800 hover:bg-blue-200 dark:bg-blue-900/30 dark:text-blue-300">
                                <FileCheck className="h-3 w-3" />
                                {phase.clearanceFileName}
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>

          {/* ── ZONE B: BUDGET ITEMS ── */}
          <div className="flex flex-col gap-3 rounded-xl border border-slate-200/80 bg-slate-50 p-5 dark:border-slate-800 dark:bg-slate-900/30">
            <div className="flex items-center gap-2">
              <Banknote className="h-4 w-4 text-slate-500" />
              <h4 className="font-bold text-[11px] text-slate-500 uppercase tracking-wider">Phase {activePhase?.phase} Budget Items</h4>
            </div>
            <ul className="flex flex-col gap-2">
              {activePhase?.budgetItems?.map((item, i) => (
                <li key={`${item.description}-${i}`} className="flex items-center justify-between text-[13px]">
                  <span className="font-medium text-slate-700 dark:text-slate-300">{item.description}</span>
                  <span className="font-bold text-slate-900 dark:text-slate-100">{fmt(item.amount)}</span>
                </li>
              )) ?? (
                  <>
                    <li className="flex items-center justify-between text-[13px]">
                      <span className="font-medium text-slate-700 dark:text-slate-300">Equipment & Lab Supplies</span>
                      <span className="font-bold text-slate-900 dark:text-slate-100">{fmt((activePhase?.amount ?? 0) * 0.6)}</span>
                    </li>
                    <li className="flex items-center justify-between text-[13px]">
                      <span className="font-medium text-slate-700 dark:text-slate-300">Field Data Collection</span>
                      <span className="font-bold text-slate-900 dark:text-slate-100">{fmt((activePhase?.amount ?? 0) * 0.4)}</span>
                    </li>
                  </>
                )}
            </ul>
            {selected.pgOfficerNote && (
              <div className="mt-2 flex items-start gap-2 rounded border border-indigo-100 bg-indigo-50/50 p-3 dark:border-indigo-900/40 dark:bg-indigo-950/20">
                <Info className="mt-0.5 h-3.5 w-3.5 shrink-0 text-indigo-500" />
                <p className="text-[12px] text-indigo-700 leading-relaxed dark:text-indigo-300">
                  <span className="mb-0.5 block font-semibold text-[10px] uppercase">PG Officer Note</span>
                  {selected.pgOfficerNote}
                </p>
              </div>
            )}
          </div>

          {/* ── ZONE C: BANK ROUTING ── */}
          <div className="flex items-start gap-3 rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-900/40">
            <Building2 className="mt-0.5 h-4 w-4 shrink-0 text-slate-500 dark:text-slate-400" />
            <div>
              <p className="font-bold text-[11px] text-slate-500 uppercase tracking-wider">Bank / Payment Routing</p>
              <p className="mt-0.5 font-semibold text-[13px] text-slate-800 dark:text-slate-200">
                {selected.bankRoutingInfo}
              </p>
            </div>
          </div>

          {/* ── ZONE D: CURRENT CLEARANCE DOCUMENT ── */}
          {activePhase?.clearanceFileName && (
            <div className="flex flex-col gap-3">
              <h4 className="font-bold text-[11px] text-slate-500 uppercase tracking-wider">
                Attached Clearance Document
              </h4>
              <div className="flex items-center gap-3 rounded-xl border-2 border-blue-200 bg-blue-50/60 p-4 dark:border-blue-900/40 dark:bg-blue-950/20">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300">
                  <FileText className="h-6 w-6" />
                </div>
                <div className="flex-1">
                  <p className="font-bold text-[13px] text-blue-900 dark:text-blue-200">
                    {activePhase.clearanceFileName}
                  </p>
                  <p className="mt-0.5 text-[11px] text-blue-700/80 dark:text-blue-400/80">
                    Utilization clearance — submitted {activePhase.submittedAt}
                  </p>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  className="h-9 shrink-0 border-blue-300 font-semibold text-blue-700 hover:bg-blue-100 dark:border-blue-800 dark:text-blue-300"
                >
                  <FileCheck className="mr-1.5 h-3.5 w-3.5" /> View Document
                </Button>
              </div>
            </div>
          )}

          {/* No clearance required (Phase 1) notice */}
          {!activePhase?.clearanceFileName && activePhase?.phase === 1 && isActionable && (
            <div className="flex items-start gap-3 rounded-xl border border-emerald-100 bg-emerald-50/50 p-4 dark:border-emerald-900/30 dark:bg-emerald-950/20">
              <Circle className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
              <p className="text-[13px] text-emerald-800 dark:text-emerald-300">
                <strong>No clearance required.</strong> This is the initial Phase 1 disbursement — funds can be
                released directly per PG Office approval.
              </p>
            </div>
          )}

          {/* ── ZONE E: FINANCE ACTIONS ── */}
          {isActionable && (
            <Can
              permission="BUDGET_APPROVE"
              fallback={
                <div className="flex items-start gap-3 rounded-xl border border-slate-100 bg-slate-50/50 p-4 dark:border-slate-800/80 dark:bg-slate-900/20">
                  <p className="font-medium text-slate-500 text-xs italic">
                    You do not have permission to approve or return disbursement requests.
                  </p>
                </div>
              }
            >
              <div className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-950">
                <div className="flex items-center gap-2">
                  <Stamp className="h-4 w-4 text-slate-500" />
                  <h4 className="font-bold text-slate-900 text-sm dark:text-slate-100">Finance Action</h4>
                </div>
                <p className="text-[12px] text-slate-500 dark:text-slate-400">
                  Releasing{" "}
                  <strong className="text-slate-800 dark:text-slate-200">
                    {fmt(activePhase?.amount ?? 0)} — Phase {activePhase?.phase}
                  </strong>
                  . Verify routing information and clearance document before proceeding.
                </p>
                <div className="flex flex-wrap gap-2 border-slate-100 border-t pt-4 dark:border-slate-800">
                  <Button
                    type="button"
                    className="h-10 min-w-[160px] flex-1 bg-emerald-600 font-semibold text-white shadow-sm hover:bg-emerald-700"
                    onClick={() => setShowPaidDialog(true)}
                  >
                    <Stamp className="mr-1.5 h-4 w-4" />
                    Stamp as Paid / Transfer
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    className="h-10 min-w-[160px] flex-1 border-rose-200 font-semibold text-rose-700 hover:bg-rose-50 dark:border-rose-900/50 dark:text-rose-400 dark:hover:bg-rose-950/40"
                    onClick={() => setShowReturnDialog(true)}
                  >
                    <RefreshCw className="mr-1.5 h-4 w-4" />
                    Return for Correction
                  </Button>
                </div>
              </div>
            </Can>
          )}

          {/* All phases complete notice */}
          {!isActionable && selected.phases.every((p) => p.status === "Paid") && (
            <div className="flex items-center gap-3 rounded-xl border border-emerald-200 bg-emerald-50 p-4 dark:border-emerald-900/30 dark:bg-emerald-950/20">
              <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-600 dark:text-emerald-400" />
              <div>
                <p className="font-bold text-emerald-900 text-sm dark:text-emerald-200">
                  All phases fully disbursed
                </p>
                <p className="mt-0.5 text-[11px] text-emerald-700/80 dark:text-emerald-400/80">
                  Total of {fmt(selected.totalBudget)} has been released for this project.
                </p>
              </div>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
