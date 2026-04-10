"use client";

import type React from "react";

import { CheckCircle, ChevronRight, Clock, FileText, RotateCcw, Search } from "lucide-react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { PendingApproval } from "@/lib/api/proposals/types";

import { useProposals } from "../proposals-context";

export const STATUS_CFG: Record<string, { className: string; icon: React.ReactNode }> = {
  Draft: {
    className: "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400",
    icon: <FileText className="h-3 w-3" />,
  },
  Submitted: {
    className: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
    icon: <CheckCircle className="h-3 w-3" />,
  },
  Under_Review: {
    className: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
    icon: <Clock className="h-3 w-3" />,
  },
  Revision: {
    className: "bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400",
    icon: <RotateCcw className="h-3 w-3" />,
  },
};

export const TAB_COUNTS = (proposals: PendingApproval[]) => ({
  all: proposals.length,
  Draft: proposals.filter((p) => p.currentStatus === "Draft").length,
  Submitted: proposals.filter((p) => p.currentStatus === "Submitted").length,
  Under_Review: proposals.filter((p) => p.currentStatus === "Under_Review").length,
  Revision: proposals.filter((p) => p.currentStatus === "Revision").length,
});

export function formatPeopleList(names: string[], max = 2): string {
  if (names.length === 0) return "None yet";
  if (names.length <= max) return names.join(", ");
  return `${names.slice(0, max).join(", ")} +${names.length - max} more`;
}

export function ProposalsTable() {
  const { proposals, isLoadingData, tab, setTab, search, setSearch, filtered, openDrawer } = useProposals();
  const counts = TAB_COUNTS(proposals);

  return (
    <div className="flex flex-col gap-3">
      {/* ── Summary Stats Row ── */}
      <div className="mb-2 grid grid-cols-2 gap-3 md:grid-cols-4">
        {(
          [
            {
              label: "Total",
              count: counts.all,
              color: "text-slate-700 dark:text-slate-300",
              bg: "bg-slate-50 dark:bg-slate-900/40",
              border: "border-slate-200 dark:border-slate-800",
            },
            {
              label: "Submitted",
              count: counts.Submitted,
              color: "text-blue-700 dark:text-blue-400",
              bg: "bg-blue-50 dark:bg-blue-900/20",
              border: "border-blue-100 dark:border-blue-900/30",
            },
            {
              label: "Under Review",
              count: counts.Under_Review,
              color: "text-amber-700 dark:text-amber-400",
              bg: "bg-amber-50 dark:bg-amber-900/20",
              border: "border-amber-100 dark:border-amber-900/30",
            },
            {
              label: "Revision",
              count: counts.Revision,
              color: "text-rose-700 dark:text-rose-400",
              bg: "bg-rose-50 dark:bg-rose-900/20",
              border: "border-rose-100 dark:border-rose-900/30",
            },
          ] as const
        ).map((s) => (
          <div
            key={s.label}
            className={`rounded-xl border ${s.border} ${s.bg} flex items-center justify-between px-4 py-3 shadow-sm`}
          >
            <span className="text-xs font-bold tracking-wider text-slate-500 uppercase">{s.label}</span>
            <span className={`text-2xl font-extrabold ${s.color}`}>{s.count}</span>
          </div>
        ))}
      </div>

      <Tabs value={tab} onValueChange={setTab}>
        <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
          <TabsList className="h-9 shrink-0 rounded-lg bg-slate-100 p-0.5 dark:bg-slate-900">
            {[
              { value: "all", label: "All", count: counts.all },
              { value: "Draft", label: "Draft", count: counts.Draft },
              { value: "Submitted", label: "Submitted", count: counts.Submitted },
              { value: "Under_Review", label: "Under Review", count: counts.Under_Review },
              { value: "Revision", label: "Revision", count: counts.Revision },
            ].map((t) => (
              <TabsTrigger
                key={t.value}
                value={t.value}
                className="h-8 rounded-md px-3 text-xs font-semibold data-[state=active]:bg-white data-[state=active]:shadow-sm dark:data-[state=active]:bg-slate-950"
              >
                {t.label}
                <span
                  className={`ml-1.5 rounded-full px-1.5 py-0.5 text-[10px] font-bold ${
                    tab === t.value
                      ? "bg-blue-600 text-white"
                      : "bg-slate-200 text-slate-600 dark:bg-slate-700 dark:text-slate-400"
                  }`}
                >
                  {t.count}
                </span>
              </TabsTrigger>
            ))}
          </TabsList>

          <div className="relative w-full sm:w-[280px]">
            <Search className="absolute top-1/2 left-3 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
            <Input
              placeholder="Search by title, PI or ID..."
              className="h-9 rounded-lg border-slate-200 bg-white pl-8 text-sm dark:border-slate-800 dark:bg-slate-950"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        <TabsContent value={tab} className="mt-4">
          <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-950">
            <Table>
              <TableHeader className="bg-slate-50 dark:bg-slate-900/50">
                <TableRow className="border-slate-200 dark:border-slate-800">
                  <TableHead className="h-10 w-[38%] pl-5 text-xs font-semibold tracking-wider text-slate-500 uppercase">
                    Proposal
                  </TableHead>
                  <TableHead className="h-10 text-xs font-semibold tracking-wider text-slate-500 uppercase">
                    PI
                  </TableHead>
                  <TableHead className="h-10 text-xs font-semibold tracking-wider text-slate-500 uppercase">
                    Status
                  </TableHead>
                  <TableHead className="h-10 text-xs font-semibold tracking-wider text-slate-500 uppercase">
                    Assignments
                  </TableHead>
                  <TableHead className="h-10 text-xs font-semibold tracking-wider text-slate-500 uppercase">
                    Program
                  </TableHead>
                  <TableHead className="h-10 w-[80px]" />
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoadingData ? (
                  <TableRow>
                    <TableCell colSpan={6} className="py-16 text-center text-sm font-medium text-slate-400">
                      Loading pending approvals from server...
                    </TableCell>
                  </TableRow>
                ) : filtered.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="py-16 text-center text-sm text-slate-400 italic">
                      No proposals match your current filters.
                    </TableCell>
                  </TableRow>
                ) : (
                  filtered.map((p) => {
                    const cfg = STATUS_CFG[p.currentStatus] || STATUS_CFG.Submitted;
                    const initials = p.createdByName.slice(0, 2).toUpperCase();
                    return (
                      <TableRow
                        key={p.id}
                        className="group cursor-pointer border-slate-100 transition-colors hover:bg-slate-50/70 dark:border-slate-800 dark:hover:bg-slate-900/40"
                        onClick={() => openDrawer(p)}
                      >
                        <TableCell className="py-4 pl-5">
                          <div className="flex flex-col gap-0.5">
                            <span className="line-clamp-1 text-[13px] leading-tight font-semibold text-slate-900 dark:text-slate-100">
                              {p.title}
                            </span>
                            <span className="text-[11px] font-bold tracking-wider text-slate-400 uppercase">
                              {p.id.split("-")[0].toUpperCase()} · Step {p.currentStepOrder}: {p.currentApproverRole}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="py-4">
                          <div className="flex items-center gap-2.5">
                            <Avatar className="h-7 w-7 shrink-0">
                              <AvatarFallback className="bg-blue-100 text-[10px] font-bold text-blue-700">
                                {initials}
                              </AvatarFallback>
                            </Avatar>
                            <span className="truncate text-[13px] font-medium text-slate-700 dark:text-slate-300">
                              {p.createdByName}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="py-4">
                          <Badge
                            className={`${cfg.className} pointer-events-none flex w-fit items-center gap-1 border-0 px-2 py-0.5 text-[11px] font-bold shadow-none`}
                          >
                            {cfg.icon}
                            {p.currentStatus.replace("_", " ")}
                          </Badge>
                        </TableCell>
                        <TableCell className="py-4">
                          <div className="flex flex-col gap-1.5">
                            <Badge
                              variant="outline"
                              className={`w-fit text-[9px] font-semibold tracking-wider uppercase ${p.evaluatorAssigned ? "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950 dark:text-emerald-400" : "border-slate-200 text-slate-500"}`}
                            >
                              Eval: {p.evaluatorAssigned ? "Assigned" : "Pending"}
                            </Badge>
                            <Badge
                              variant="outline"
                              className={`w-fit text-[9px] font-semibold tracking-wider uppercase ${p.advisorAssigned ? "border-violet-200 bg-violet-50 text-violet-700 dark:border-violet-900 dark:bg-violet-950 dark:text-violet-400" : "border-slate-200 text-slate-500"}`}
                            >
                              Adv: {p.advisorAssigned ? "Assigned" : "Pending"}
                            </Badge>
                          </div>
                        </TableCell>
                        <TableCell className="py-4">
                          <div className="flex flex-col gap-1.5">
                            <span className="text-[12px] font-bold text-slate-700 uppercase">{p.proposalProgram}</span>
                            <Badge
                              className={`w-fit text-[9px] font-bold shadow-none ${p.isFunded ? "bg-amber-100 text-amber-800 hover:bg-amber-100" : "bg-slate-100 text-slate-600 hover:bg-slate-100"}`}
                            >
                              {p.isFunded ? "FUNDED" : "UNFUNDED"}
                            </Badge>
                          </div>
                        </TableCell>
                        <TableCell className="py-4 pr-4 text-right">
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-8 rounded-lg px-3 text-xs font-semibold text-blue-600 opacity-0 transition-opacity group-hover:opacity-100 hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-blue-900/20"
                            onClick={(e) => {
                              e.stopPropagation();
                              openDrawer(p);
                            }}
                          >
                            Open <ChevronRight className="ml-1 h-3.5 w-3.5" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>

            <div className="flex items-center justify-between border-t border-slate-100 px-5 py-3 dark:border-slate-800">
              <p className="text-xs font-medium text-slate-400">
                Showing {filtered.length} of {proposals.length} proposals
              </p>
              {tab !== "all" && (
                <button
                  type="button"
                  onClick={() => setTab("all")}
                  className="text-xs font-semibold text-blue-600 hover:underline dark:text-blue-400"
                >
                  View all
                </button>
              )}
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
