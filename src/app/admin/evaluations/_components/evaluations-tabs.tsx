"use client";

import { ChevronRight, FileText, Layers, Loader2, Search } from "lucide-react";

import { Can } from "@/access-control/permission-gates";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

import { useEvaluations } from "../evaluations-context";
import type { ProjectEvalStatus } from "../types";

export const STATUS_STYLES: Record<ProjectEvalStatus, { className: string; description: string }> = {
  "On evaluation": {
    className: "bg-amber-100 text-amber-900 dark:bg-amber-950/50 dark:text-amber-200",
    description: "Scores still being recorded or verified.",
  },
  "Awaiting approval": {
    className: "bg-violet-100 text-violet-900 dark:bg-violet-950/50 dark:text-violet-200",
    description: "Admin must confirm the evaluation packet.",
  },
  Scheduled: {
    className: "bg-sky-100 text-sky-900 dark:bg-sky-950/50 dark:text-sky-200",
    description: "Defence slot shared with the PI.",
  },
  Finished: {
    className: "bg-emerald-100 text-emerald-900 dark:bg-emerald-950/50 dark:text-emerald-200",
    description: "Evaluation approved and archived.",
  },
};

export function EvaluationsTabs() {
  const {
    mainTab,
    setMainTab,
    search,
    setSearch,
    filteredProposals,
    filteredProjects,
    openDrawerProposal,
    openDrawerProject,
    isLoadingProposals,
  } = useEvaluations();

  return (
    <div className="flex flex-col gap-3">
      <Tabs value={mainTab} onValueChange={(v) => setMainTab(v as Parameters<typeof setMainTab>[0])}>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <TabsList className="h-10 w-full justify-start rounded-xl bg-slate-100 p-1 sm:w-auto dark:bg-slate-900">
            <TabsTrigger
              value="proposals"
              className="rounded-lg px-5 font-semibold data-[state=active]:bg-white data-[state=active]:shadow-sm dark:data-[state=active]:bg-slate-800"
            >
              <FileText className="mr-2 h-4 w-4" />
              Proposals
              <Badge className="ml-2 border-0 bg-slate-200 text-[10px] font-bold text-slate-700 dark:bg-slate-700 dark:text-slate-200">
                {isLoadingProposals ? "…" : filteredProposals.length}
              </Badge>
            </TabsTrigger>
            <TabsTrigger
              value="projects"
              className="rounded-lg px-5 font-semibold data-[state=active]:bg-white data-[state=active]:shadow-sm dark:data-[state=active]:bg-slate-800"
            >
              <Layers className="mr-2 h-4 w-4" />
              Projects
              <Badge className="ml-2 border-0 bg-slate-200 text-[10px] font-bold text-slate-700 dark:bg-slate-700 dark:text-slate-200">
                {filteredProjects.length}
              </Badge>
            </TabsTrigger>
          </TabsList>

          <div className="relative w-full sm:w-72">
            <Search className="absolute top-1/2 left-3 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
            <Input
              placeholder="Search title, ID, person, dept…"
              className="h-9 rounded-lg pl-9 dark:bg-slate-950"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        <TabsContent value="proposals" className="mt-4">
          <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-950">
            {isLoadingProposals ? (
              <div className="flex items-center justify-center gap-3 py-16 text-slate-400">
                <Loader2 className="h-5 w-5 animate-spin text-indigo-500" />
                <span className="text-sm">Loading proposals…</span>
              </div>
            ) : filteredProposals.length === 0 ? (
              <div className="py-16 text-center text-sm text-slate-400">
                No proposals currently assigned for evaluation.
              </div>
            ) : (
              <Table>
                <TableHeader className="bg-slate-50 dark:bg-slate-900/50">
                  <TableRow>
                    <TableHead className="pl-5 text-xs font-semibold uppercase">Proposal</TableHead>
                    <TableHead className="text-xs font-semibold uppercase">PI</TableHead>
                    <TableHead className="text-xs font-semibold uppercase">Stage</TableHead>
                    <Can permission="BUDGET_VIEW">
                      <TableHead className="text-xs font-semibold uppercase">Budget</TableHead>
                    </Can>
                    <TableHead className="w-[120px] pr-5 text-right text-xs font-semibold uppercase" />
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredProposals.map((p) => (
                    <TableRow key={p.id} className="border-slate-100 dark:border-slate-800">
                      <TableCell className="py-4 pl-5">
                        <div className="flex flex-col gap-0.5">
                          <span className="line-clamp-1 text-[13px] font-semibold text-slate-900 dark:text-slate-100">
                            {p.title}
                          </span>
                          <span className="text-[10px] font-bold tracking-wider text-slate-400 uppercase">
                            {p.id} · {p.dept}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="py-4">
                        <div className="flex items-center gap-2">
                          <Avatar className="h-7 w-7">
                            <AvatarFallback className={cn("text-[10px] font-bold", p.piColor)}>
                              {p.piAvatar}
                            </AvatarFallback>
                          </Avatar>
                          <span className="text-[13px] font-medium text-slate-700 dark:text-slate-300">{p.pi}</span>
                        </div>
                      </TableCell>
                      <TableCell className="py-4">
                        <Badge variant="secondary" className="text-[11px] font-semibold">
                          {p.stage}
                        </Badge>
                      </TableCell>
                      <Can permission="BUDGET_VIEW">
                        <TableCell className="py-4 text-[13px] font-semibold text-slate-700 dark:text-slate-300">
                          {p.budget}
                        </TableCell>
                      </Can>
                      <TableCell className="py-4 pr-5 text-right">
                        <Button
                          size="sm"
                          className="h-8 rounded-lg bg-indigo-600 text-xs font-semibold hover:bg-indigo-700"
                          onClick={() => openDrawerProposal(p)}
                        >
                          Evaluate
                          <ChevronRight className="ml-1 h-3.5 w-3.5" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </div>
        </TabsContent>

        <TabsContent value="projects" className="mt-4">
          <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-950">
            <Table>
              <TableHeader className="bg-slate-50 dark:bg-slate-900/50">
                <TableRow>
                  <TableHead className="pl-5 text-xs font-semibold uppercase">Project</TableHead>
                  <TableHead className="text-xs font-semibold uppercase">Lead</TableHead>
                  <TableHead className="text-xs font-semibold uppercase">Status</TableHead>
                  <TableHead className="text-xs font-semibold uppercase">Score</TableHead>
                  <Can permission="BUDGET_VIEW">
                    <TableHead className="text-xs font-semibold uppercase">Budget</TableHead>
                  </Can>
                  <TableHead className="w-[120px] pr-5 text-right text-xs font-semibold uppercase" />
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProjects.map((p) => {
                  const st = STATUS_STYLES[p.evalStatus];
                  const scoreLabel = p.maxTotal > 0 ? `${p.totalScore.toFixed(1)} / ${p.maxTotal}` : "—";
                  return (
                    <TableRow key={p.id} className="border-slate-100 dark:border-slate-800">
                      <TableCell className="py-4 pl-5">
                        <div className="flex flex-col gap-0.5">
                          <span className="line-clamp-1 text-[13px] font-semibold text-slate-900 dark:text-slate-100">
                            {p.title}
                          </span>
                          <span className="text-[10px] font-bold tracking-wider text-slate-400 uppercase">
                            {p.id} · {p.dept}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="py-4">
                        <div className="flex items-center gap-2">
                          <Avatar className="h-7 w-7">
                            <AvatarFallback className={cn("text-[10px] font-bold", p.leadColor)}>
                              {p.leadAvatar}
                            </AvatarFallback>
                          </Avatar>
                          <span className="text-[13px] font-medium text-slate-700 dark:text-slate-300">{p.lead}</span>
                        </div>
                      </TableCell>
                      <TableCell className="py-4">
                        <div className="flex flex-col gap-1">
                          <Badge className={cn("w-fit border-0 text-[10px] font-bold", st.className)}>
                            {p.evalStatus}
                          </Badge>
                          <span className="max-w-[200px] text-[10px] leading-snug text-slate-500 dark:text-slate-400">
                            {st.description}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="py-4">
                        <span className="text-sm font-bold text-indigo-700 tabular-nums dark:text-indigo-300">
                          {scoreLabel}
                        </span>
                      </TableCell>
                      <Can permission="BUDGET_VIEW">
                        <TableCell className="py-4 text-[13px] font-semibold text-slate-700 dark:text-slate-300">
                          {p.budget}
                        </TableCell>
                      </Can>
                      <TableCell className="py-4 pr-5 text-right">
                        <Button
                          size="sm"
                          className="h-8 rounded-lg bg-indigo-600 text-xs font-semibold hover:bg-indigo-700"
                          onClick={() => openDrawerProject(p)}
                        >
                          Evaluate
                          <ChevronRight className="ml-1 h-3.5 w-3.5" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
