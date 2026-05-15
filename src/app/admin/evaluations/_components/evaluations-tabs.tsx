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

import { ProposalViewToggle } from "../../_components/proposal-view-toggle";
import { useEvaluations } from "../evaluations-context";

export function getProjectStatusBadge(stage: string | undefined) {
  const normalized = (stage ?? "").toLowerCase();

  if (normalized.includes("finish")) {
    return {
      className: "bg-emerald-100 text-emerald-900 dark:bg-emerald-950/50 dark:text-emerald-200",
      description: "Project marked as finished.",
    };
  }

  if (normalized.includes("schedule")) {
    return {
      className: "bg-sky-100 text-sky-900 dark:bg-sky-950/50 dark:text-sky-200",
      description: "Project has a scheduled milestone.",
    };
  }

  if (normalized.includes("review") || normalized.includes("evaluat")) {
    return {
      className: "bg-amber-100 text-amber-900 dark:bg-amber-950/50 dark:text-amber-200",
      description: "Project is currently under review.",
    };
  }

  return {
    className: "bg-violet-100 text-violet-900 dark:bg-violet-950/50 dark:text-violet-200",
    description: "Awaiting approval or classification.",
  };
}

export function EvaluationsTabs() {
  const {
    mainTab,
    setMainTab,
    proposalScope,
    setProposalScope,
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
              <Badge className="ml-2 border-0 bg-slate-200 font-bold text-[10px] text-slate-700 dark:bg-slate-700 dark:text-slate-200">
                {isLoadingProposals ? "…" : filteredProposals.length}
              </Badge>
            </TabsTrigger>
            <TabsTrigger
              value="projects"
              className="rounded-lg px-5 font-semibold data-[state=active]:bg-white data-[state=active]:shadow-sm dark:data-[state=active]:bg-slate-800"
            >
              <Layers className="mr-2 h-4 w-4" />
              Projects
              <Badge className="ml-2 border-0 bg-slate-200 font-bold text-[10px] text-slate-700 dark:bg-slate-700 dark:text-slate-200">
                {filteredProjects.length}
              </Badge>
            </TabsTrigger>
          </TabsList>

          <div className="relative w-full sm:w-72">
            <Search className="-translate-y-1/2 absolute top-1/2 left-3 h-3.5 w-3.5 text-slate-400" />
            <Input
              placeholder="Search title, ID, person, dept…"
              className="h-9 rounded-lg pl-9 dark:bg-slate-950"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        <TabsContent value="proposals" className="mt-4">
          <Tabs value={proposalScope} onValueChange={(v: string) => setProposalScope(v as "assigned" | "all")}>
            <ProposalViewToggle
              leftValue="assigned"
              leftLabel="Assigned for Evaluation"
              leftIcon={<FileText className="mr-2 h-4 w-4" />}
              rightValue="all"
              rightLabel="All Proposals"
              rightIcon={<FileText className="mr-2 h-4 w-4" />}
            />

            <div className="mt-4 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-950">
              {isLoadingProposals ? (
                <div className="flex items-center justify-center gap-3 py-16 text-slate-400">
                  <Loader2 className="h-5 w-5 animate-spin text-indigo-500" />
                  <span className="text-sm">Loading proposals…</span>
                </div>
              ) : filteredProposals.length === 0 ? (
                <div className="py-16 text-center text-slate-400 text-sm">
                  No proposals currently assigned for evaluation.
                </div>
              ) : (
                <Table>
                  <TableHeader className="bg-slate-50 dark:bg-slate-900/50">
                    <TableRow>
                      <TableHead className="pl-5 font-semibold text-xs uppercase">Proposal</TableHead>
                      <TableHead className="font-semibold text-xs uppercase">PI</TableHead>
                      <TableHead className="font-semibold text-xs uppercase">Status</TableHead>
                      <TableHead className="font-semibold text-xs uppercase">Program</TableHead>
                      <TableHead className="font-semibold text-xs uppercase">Team</TableHead>
                      <Can permission="BUDGET_VIEW">
                        <TableHead className="font-semibold text-xs uppercase">Budget</TableHead>
                      </Can>
                      <TableHead className="w-30 pr-5 text-right font-semibold text-xs uppercase" />
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredProposals.map((p) => (
                      <TableRow key={p.id} className="border-slate-100 dark:border-slate-800">
                        <TableCell className="py-4 pl-5">
                          <div className="flex flex-col gap-0.5">
                            <span className="line-clamp-1 font-semibold text-[13px] text-slate-900 dark:text-slate-100">
                              {p.title}
                            </span>
                            <span className="font-bold text-[10px] text-slate-400 uppercase tracking-wider">
                              {p.dept}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="py-4">
                          <div className="flex items-center gap-2">
                            <Avatar className="h-7 w-7">
                              <AvatarFallback className={cn("font-bold text-[10px]", p.piColor)}>
                                {p.piAvatar}
                              </AvatarFallback>
                            </Avatar>
                            <span className="font-medium text-[13px] text-slate-700 dark:text-slate-300">{p.pi}</span>
                          </div>
                        </TableCell>
                        <TableCell className="py-4">
                          <Badge variant="secondary" className="font-semibold text-[11px]">
                            {p.stage}
                          </Badge>
                        </TableCell>
                        <TableCell className="py-4">
                          <span className="font-semibold text-[12px] text-slate-700 dark:text-slate-300">
                            {p.program}
                          </span>
                        </TableCell>
                        <TableCell className="py-4">
                          <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-slate-100 font-semibold text-[11px] text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                            {p.teamCount}
                          </span>
                        </TableCell>
                        <Can permission="BUDGET_VIEW">
                          <TableCell className="py-4 font-semibold text-[13px] text-slate-700 dark:text-slate-300">
                            {p.budget}
                          </TableCell>
                        </Can>
                        <TableCell className="py-4 pr-5 text-right">
                          <Button
                            size="sm"
                            className="h-8 rounded-lg bg-indigo-600 font-semibold text-xs hover:bg-indigo-700"
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
          </Tabs>
        </TabsContent>

        <TabsContent value="projects" className="mt-4">
          <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-950">
            <Table>
              <TableHeader className="bg-slate-50 dark:bg-slate-900/50">
                <TableRow>
                  <TableHead className="pl-5 font-semibold text-xs uppercase">Project</TableHead>
                  <TableHead className="font-semibold text-xs uppercase">Lead</TableHead>
                  <TableHead className="font-semibold text-xs uppercase">Status</TableHead>
                  <TableHead className="font-semibold text-xs uppercase">Score</TableHead>
                  <Can permission="BUDGET_VIEW">
                    <TableHead className="font-semibold text-xs uppercase">Budget</TableHead>
                  </Can>
                  <TableHead className="w-30 pr-5 text-right font-semibold text-xs uppercase" />
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProjects.map((p) => {
                  const st = getProjectStatusBadge(p.projectStage);
                  return (
                    <TableRow key={p.projectId} className="border-slate-100 dark:border-slate-800">
                      <TableCell className="py-4 pl-5">
                        <div className="flex flex-col gap-0.5">
                          <span className="line-clamp-1 font-semibold text-[13px] text-slate-900 dark:text-slate-100">
                            {p.projectTitle}
                          </span>
                          <span className="font-bold text-[10px] text-slate-400 uppercase tracking-wider">
                            {p.projectId} · {p.projectProgram}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="py-4">
                        <div className="flex items-center gap-2">
                          <Avatar className="h-7 w-7">
                            <AvatarFallback className="font-bold text-[10px] bg-slate-200 text-slate-700">
                              {p.pi?.fullName
                                ?.split(" ")
                                .map((part) => part[0])
                                .slice(0, 2)
                                .join("")
                                .toUpperCase() || "—"}
                            </AvatarFallback>
                          </Avatar>
                          <span className="font-medium text-[13px] text-slate-700 dark:text-slate-300">
                            {p.pi?.fullName || "No PI"}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="py-4">
                        <div className="flex flex-col gap-1">
                          <Badge className={cn("w-fit border-0 font-bold text-[10px]", st.className)}>
                            {p.projectStage}
                          </Badge>
                          <span className="max-w-50 text-[10px] text-slate-500 leading-snug dark:text-slate-400">
                            {st.description}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="py-4">
                        <span className="font-semibold text-[12px] text-slate-700 dark:text-slate-300">
                          {p.researchArea || "—"}
                        </span>
                      </TableCell>
                      <Can permission="BUDGET_VIEW">
                        <TableCell className="py-4 font-semibold text-[13px] text-slate-700 dark:text-slate-300">
                          {p.isFunded ? "Funded" : "Not funded"}
                        </TableCell>
                      </Can>
                      <TableCell className="py-4 pr-5 text-right">
                        <Button
                          size="sm"
                          className="h-8 rounded-lg bg-indigo-600 font-semibold text-xs hover:bg-indigo-700"
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
