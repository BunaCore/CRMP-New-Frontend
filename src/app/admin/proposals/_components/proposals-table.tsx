"use client";

import React from "react";
import { useProposals } from "../proposals-context";
import { Proposal } from "../types";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Search, ChevronRight, UserCheck, CheckCircle, Clock, RotateCcw, FileText } from "lucide-react";

export const STATUS_CFG: Record<Proposal["status"], { className: string; icon: React.ReactNode }> = {
  Draft:          { className: "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400",              icon: <FileText className="h-3 w-3" /> },
  Submitted:      { className: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",               icon: <CheckCircle className="h-3 w-3" /> },
  "Under Review": { className: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",           icon: <Clock className="h-3 w-3" /> },
  Revision:       { className: "bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400",               icon: <RotateCcw className="h-3 w-3" /> },
};

export const TAB_COUNTS = (proposals: Proposal[]) => ({
  all:           proposals.length,
  Draft:         proposals.filter(p => p.status === "Draft").length,
  Submitted:     proposals.filter(p => p.status === "Submitted").length,
  "Under Review":proposals.filter(p => p.status === "Under Review").length,
  Revision:      proposals.filter(p => p.status === "Revision").length,
});

export function formatPeopleList(names: string[], max = 2): string {
  if (names.length === 0) return "None yet";
  if (names.length <= max) return names.join(", ");
  return `${names.slice(0, max).join(", ")} +${names.length - max} more`;
}

export function ProposalsTable() {
  const { proposals, tab, setTab, search, setSearch, filtered, openDrawer } = useProposals();
  const counts = TAB_COUNTS(proposals);

  return (
    <div className="flex flex-col gap-3">
      {/* ── Summary Stats Row ── */}
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4 mb-2">
        {([
          { label: "Total",        count: counts.all,            color: "text-slate-700 dark:text-slate-300",  bg: "bg-slate-50 dark:bg-slate-900/40",   border: "border-slate-200 dark:border-slate-800" },
          { label: "Submitted",    count: counts.Submitted,      color: "text-blue-700 dark:text-blue-400",    bg: "bg-blue-50 dark:bg-blue-900/20",      border: "border-blue-100 dark:border-blue-900/30" },
          { label: "Under Review", count: counts["Under Review"], color: "text-amber-700 dark:text-amber-400",  bg: "bg-amber-50 dark:bg-amber-900/20",    border: "border-amber-100 dark:border-amber-900/30" },
          { label: "Revision",     count: counts.Revision,       color: "text-rose-700 dark:text-rose-400",    bg: "bg-rose-50 dark:bg-rose-900/20",      border: "border-rose-100 dark:border-rose-900/30" },
        ] as const).map(s => (
          <div key={s.label} className={`rounded-xl border ${s.border} ${s.bg} flex items-center justify-between px-4 py-3 shadow-sm`}>
            <span className="font-bold text-slate-500 text-xs uppercase tracking-wider">{s.label}</span>
            <span className={`font-extrabold text-2xl ${s.color}`}>{s.count}</span>
          </div>
        ))}
      </div>

      <Tabs value={tab} onValueChange={setTab}>
        <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
          <TabsList className="h-9 shrink-0 rounded-lg bg-slate-100 p-0.5 dark:bg-slate-900">
            {([
              { value: "all",           label: "All",          count: counts.all },
              { value: "Draft",         label: "Draft",        count: counts.Draft },
              { value: "Submitted",     label: "Submitted",    count: counts.Submitted },
              { value: "Under Review",  label: "Under Review", count: counts["Under Review"] },
              { value: "Revision",      label: "Revision",     count: counts.Revision },
            ]).map(t => (
              <TabsTrigger
                key={t.value}
                value={t.value}
                className="h-8 rounded-md px-3 font-semibold text-xs data-[state=active]:bg-white data-[state=active]:shadow-sm dark:data-[state=active]:bg-slate-950"
              >
                {t.label}
                <span className={`ml-1.5 rounded-full px-1.5 py-0.5 font-bold text-[10px] ${
                  tab === t.value
                    ? "bg-blue-600 text-white"
                    : "bg-slate-200 text-slate-600 dark:bg-slate-700 dark:text-slate-400"
                }`}>
                  {t.count}
                </span>
              </TabsTrigger>
            ))}
          </TabsList>

          <div className="relative w-full sm:w-[280px]">
            <Search className="-translate-y-1/2 absolute top-1/2 left-3 h-3.5 w-3.5 text-slate-400" />
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
                  <TableHead className="h-10 w-[38%] pl-5 font-semibold text-slate-500 text-xs uppercase tracking-wider">Proposal</TableHead>
                  <TableHead className="h-10 font-semibold text-slate-500 text-xs uppercase tracking-wider">PI</TableHead>
                  <TableHead className="h-10 font-semibold text-slate-500 text-xs uppercase tracking-wider">Status</TableHead>
                  <TableHead className="h-10 font-semibold text-slate-500 text-xs uppercase tracking-wider">Evaluator</TableHead>
                  <TableHead className="h-10 font-semibold text-slate-500 text-xs uppercase tracking-wider">Budget</TableHead>
                  <TableHead className="h-10 w-[80px]" />
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="py-16 text-center text-slate-400 text-sm italic">
                      No proposals match your current filters.
                    </TableCell>
                  </TableRow>
                ) : filtered.map((p) => {
                  const cfg = STATUS_CFG[p.status];
                  return (
                    <TableRow
                      key={p.id}
                      className="group cursor-pointer border-slate-100 transition-colors hover:bg-slate-50/70 dark:border-slate-800 dark:hover:bg-slate-900/40"
                      onClick={() => openDrawer(p)}
                    >
                      <TableCell className="py-4 pl-5">
                        <div className="flex flex-col gap-0.5">
                          <span className="line-clamp-1 font-semibold text-[13px] text-slate-900 leading-tight dark:text-slate-100">{p.title}</span>
                          <span className="font-bold text-[11px] text-slate-400 uppercase tracking-wider">{p.id} · {p.dept}</span>
                        </div>
                      </TableCell>
                      <TableCell className="py-4">
                        <div className="flex items-center gap-2.5">
                          <Avatar className="h-7 w-7 shrink-0">
                            <AvatarFallback className={`font-bold text-[10px] ${p.piColor}`}>{p.piAvatar}</AvatarFallback>
                          </Avatar>
                          <span className="truncate font-medium text-[13px] text-slate-700 dark:text-slate-300">{p.pi}</span>
                        </div>
                      </TableCell>
                      <TableCell className="py-4">
                        <Badge className={`${cfg.className} pointer-events-none flex w-fit items-center gap-1 border-0 px-2 py-0.5 font-bold text-[11px] shadow-none`}>
                          {cfg.icon}{p.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="py-4">
                        {p.evaluators.length > 0 ? (
                          <div className="flex max-w-[200px] flex-col gap-0.5">
                            <div className="flex items-center gap-1.5 font-medium text-[12px] text-slate-600 dark:text-slate-400">
                              <UserCheck className="h-3.5 w-3.5 shrink-0 text-emerald-500" />
                              <span className="line-clamp-2">{formatPeopleList(p.evaluators, 2)}</span>
                            </div>
                            {p.evaluators.length > 2 && (
                              <span className="pl-5 font-bold text-[10px] text-slate-400">{p.evaluators.length} total</span>
                            )}
                          </div>
                        ) : (
                          <span className="font-medium text-[12px] text-slate-400 italic">Unassigned</span>
                        )}
                      </TableCell>
                      <TableCell className="py-4">
                        <span className="font-semibold text-[13px] text-slate-700 dark:text-slate-300">{p.budget}</span>
                      </TableCell>
                      <TableCell className="py-4 pr-4 text-right">
                        <Button
                          size="sm" variant="ghost"
                          className="h-8 rounded-lg px-3 font-semibold text-blue-600 text-xs opacity-0 transition-opacity hover:bg-blue-50 group-hover:opacity-100 dark:text-blue-400 dark:hover:bg-blue-900/20"
                          onClick={(e) => { e.stopPropagation(); openDrawer(p); }}
                        >
                          Open <ChevronRight className="ml-1 h-3.5 w-3.5" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>

            <div className="flex items-center justify-between border-slate-100 border-t px-5 py-3 dark:border-slate-800">
              <p className="font-medium text-slate-400 text-xs">Showing {filtered.length} of {proposals.length} proposals</p>
              {tab !== "all" && (
                <button type="button" onClick={() => setTab("all")} className="font-semibold text-blue-600 text-xs hover:underline dark:text-blue-400">
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
