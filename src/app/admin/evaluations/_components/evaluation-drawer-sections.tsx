"use client";

import { useState } from "react";

import { format } from "date-fns";
import {
  Banknote,
  CalendarDays,
  CheckCircle2,
  ChevronRight,
  Clock,
  Download,
  FileText,
  GraduationCap,
  Loader2,
  Send,
  UserCheck,
  Users,
} from "lucide-react";

import { Can } from "@/access-control/permission-gates";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import { exportWorkspace, fetchWorkspaces, triggerDownload } from "@/lib/api/editor/workspace.api";
import { useGetProposalMembers } from "@/lib/api/proposals/queries";
import type { EvaluationRubric, ProposalMemberWithUser } from "@/lib/api/proposals/types";

import { TimelineTab } from "../../proposals/_components/timeline-tab";
import type { EvalProjectRow, EvalProposalRow, RubricItem } from "../types";

export interface DraftScore {
  score: number;
  feedback: string;
}

interface EvaluationOverviewTabProps {
  drawerKind: "proposal" | "project";
  activeProposal: EvalProposalRow | null;
  activeProject: EvalProjectRow | null;
  canAssignEvaluators: boolean;
  canAssignAdvisors: boolean;
  evaluatorSummary: string;
  advisorSummary: string;
  onAssignEvaluators: () => void;
  onAssignAdvisor: () => void;
}

export function EvaluationOverviewTab({
  drawerKind,
  activeProposal,
  activeProject,
  canAssignEvaluators,
  canAssignAdvisors,
  evaluatorSummary,
  advisorSummary,
  onAssignEvaluators,
  onAssignAdvisor,
}: EvaluationOverviewTabProps) {
  const [isExporting, setIsExporting] = useState(false);

  const handleExportPdf = async () => {
    if (drawerKind !== "project" || !activeProject?.id) return;
    setIsExporting(true);
    try {
      const workspaces = await fetchWorkspaces(activeProject.id);
      if (workspaces && workspaces.length > 0) {
        const workspaceId = workspaces[0].id;
        const blob = await exportWorkspace(workspaceId, "pdf");
        triggerDownload(blob, `${activeProject.title || "Project"}.pdf`);
      } else {
        alert("No workspace found for this project.");
      }
    } catch (err) {
      console.error(err);
      alert("Failed to export project PDF.");
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div className="rounded-lg border border-slate-100 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-900/50">
          <p className="mb-1.5 font-bold text-[10px] text-slate-400 uppercase tracking-wider">Principal Investigator</p>
          <div className="flex items-center gap-2">
            <Avatar className="h-7 w-7">
              <AvatarFallback
                className={`font-bold text-[10px] ${drawerKind === "proposal" ? activeProposal?.piColor : activeProject?.leadColor}`}
              >
                {drawerKind === "proposal" ? activeProposal?.piAvatar : activeProject?.leadAvatar}
              </AvatarFallback>
            </Avatar>
            <span className="truncate font-semibold text-[13px] text-slate-800 dark:text-slate-200">
              {drawerKind === "proposal" ? activeProposal?.pi : activeProject?.lead}
            </span>
          </div>
        </div>
        <div className="rounded-lg border border-slate-100 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-900/50">
          <p className="mb-1.5 font-bold text-[10px] text-slate-400 uppercase tracking-wider">Budget Requested</p>
          <p className="font-extrabold text-indigo-600 text-xl dark:text-indigo-400">
            {drawerKind === "proposal" ? activeProposal?.budget : activeProject?.budget}
          </p>
        </div>
        <div className="rounded-lg border border-slate-100 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-900/50">
          <p className="mb-1.5 font-bold text-[10px] text-slate-400 uppercase tracking-wider">Date Submitted</p>
          <p className="flex items-center gap-1.5 font-semibold text-[13px] text-slate-800 dark:text-slate-200">
            <CalendarDays className="h-3.5 w-3.5 text-slate-400" />
            {/* biome-ignore lint/suspicious/noExplicitAny: dynamic access allowed for mockup */}
            {(activeProposal as any)?.submittedDate || "Mar 12, 2025"}
          </p>
        </div>
        <div className="rounded-lg border border-slate-100 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-900/50">
          <p className="mb-1.5 font-bold text-[10px] text-slate-400 uppercase tracking-wider">Team Size</p>
          <p className="flex items-center gap-1.5 font-semibold text-[13px] text-slate-800 dark:text-slate-200">
            <Users className="h-3.5 w-3.5 text-slate-400" />
            {/* biome-ignore lint/suspicious/noExplicitAny: dynamic access allowed for mockup */}
            {(activeProposal as any)?.teamCount || 3} members
          </p>
        </div>
      </div>

      <div>
        <h4 className="mb-2.5 flex items-center gap-2 font-bold text-[11px] text-slate-500 uppercase tracking-wider">
          <FileText className="h-3.5 w-3.5" /> Abstract
        </h4>
        <p className="rounded-lg border border-slate-100 bg-slate-50 p-4 text-[13px] text-slate-600 leading-relaxed dark:border-slate-800 dark:bg-slate-900/30 dark:text-slate-400">
          {/* biome-ignore lint/suspicious/noExplicitAny: dynamic access allowed for mockup */}
          {(activeProposal as any)?.abstract ||
            "Abstract details are under evaluation. Provide comprehensive details regarding the evaluated item."}
        </p>
      </div>

      <div>
        <h4 className="mb-3 font-bold text-[11px] text-slate-500 uppercase tracking-wider">Workflow Actions</h4>
        <div className="grid grid-cols-1 gap-2.5 lg:grid-cols-2">
          {canAssignEvaluators && drawerKind !== "project" && (
            <button
              type="button"
              onClick={onAssignEvaluators}
              className="group flex w-full items-center gap-3 rounded-xl border border-blue-200/90 bg-linear-to-br from-blue-50/90 to-white p-4 text-left text-blue-800 shadow-sm transition-all hover:border-blue-300 hover:shadow-md dark:border-blue-900/45 dark:from-blue-950/40 dark:to-slate-950 dark:text-blue-300 dark:hover:border-blue-800"
            >
              <div className="shrink-0 rounded-xl bg-blue-100 p-2.5 dark:bg-blue-900/50">
                <UserCheck className="h-4 w-4" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-bold text-[13px] leading-tight">Assign Evaluators</p>
                <p className="mt-0.5 line-clamp-2 font-medium text-[11px] text-blue-700/80 dark:text-blue-400/80">
                  {evaluatorSummary}
                </p>
              </div>
              <ChevronRight className="ml-auto h-4 w-4 shrink-0 opacity-40 transition-opacity group-hover:opacity-100" />
            </button>
          )}

          {drawerKind === "project" && (
            <button
              type="button"
              onClick={handleExportPdf}
              disabled={isExporting}
              className="group flex w-full items-center gap-3 rounded-xl border border-teal-200/90 bg-linear-to-br from-teal-50/90 to-white p-4 text-left text-teal-800 shadow-sm transition-all hover:border-teal-300 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-70 dark:border-teal-900/45 dark:from-teal-950/40 dark:to-slate-950 dark:text-teal-300 dark:hover:border-teal-800"
            >
              <div className="shrink-0 rounded-xl bg-teal-100 p-2.5 dark:bg-teal-900/50">
                {isExporting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-bold text-[13px] leading-tight">Download Project</p>
                <p className="mt-0.5 line-clamp-2 font-medium text-[11px] text-teal-700/80 dark:text-teal-400/80">
                  Export workspace as PDF
                </p>
              </div>
              <ChevronRight className="ml-auto h-4 w-4 shrink-0 opacity-40 transition-opacity group-hover:opacity-100" />
            </button>
          )}

          {canAssignAdvisors && (
            <button
              type="button"
              onClick={onAssignAdvisor}
              className="group flex w-full items-center gap-3 rounded-xl border border-violet-200/90 bg-linear-to-br from-violet-50/90 to-white p-4 text-left text-violet-800 shadow-sm transition-all hover:border-violet-300 hover:shadow-md dark:border-violet-900/45 dark:from-violet-950/35 dark:to-slate-950 dark:text-violet-300 dark:hover:border-violet-800"
            >
              <div className="shrink-0 rounded-xl bg-violet-100 p-2.5 dark:bg-violet-900/50">
                <GraduationCap className="h-4 w-4" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-bold text-[13px] leading-tight">Assign Advisor</p>
                <p className="mt-0.5 line-clamp-2 font-medium text-[11px] text-violet-700/80 dark:text-violet-400/80">
                  {advisorSummary}
                </p>
              </div>
              <ChevronRight className="ml-auto h-4 w-4 shrink-0 opacity-40 transition-opacity group-hover:opacity-100" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

interface EvaluationBudgetTabProps {
  drawerKind: "proposal" | "project";
  activeProposal: EvalProposalRow | null;
  activeProject: EvalProjectRow | null;
}

export function EvaluationBudgetTab({ drawerKind, activeProposal, activeProject }: EvaluationBudgetTabProps) {
  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div className="flex flex-col justify-center rounded-xl border border-slate-200/80 bg-linear-to-br from-indigo-50 to-white p-4 shadow-sm dark:border-slate-800 dark:from-indigo-950/50 dark:to-slate-950">
          <p className="mb-1 flex items-center gap-1.5 font-bold text-[10px] text-slate-500 uppercase tracking-wider">
            <Banknote className="h-3.5 w-3.5" /> Total Requested
          </p>
          <p className="font-extrabold text-2xl text-indigo-600 dark:text-indigo-400">
            {drawerKind === "proposal" ? activeProposal?.budget : activeProject?.budget}
          </p>
        </div>
        <div className="flex flex-col justify-center rounded-xl border border-slate-200/80 bg-slate-50/50 p-4 dark:border-slate-800 dark:bg-slate-900/30">
          <p className="mb-1 font-bold text-[10px] text-slate-500 uppercase tracking-wider">Status</p>
          <p className="font-semibold text-[15px] text-slate-800 dark:text-slate-200">
            {drawerKind === "project" && activeProject ? activeProject.evalStatus : "Under Evaluation"}
          </p>
        </div>
      </div>

      <div>
        <h4 className="mb-3 font-bold text-[11px] text-slate-500 uppercase tracking-wider">Budget Breakdown</h4>
        <div className="overflow-hidden rounded-xl border border-slate-200 shadow-sm dark:border-slate-800">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50/80 dark:bg-slate-900/50">
              <tr>
                <th className="px-4 py-3 font-semibold text-slate-600 text-xs dark:text-slate-400">Description</th>
                <th className="px-4 py-3 text-right font-semibold text-slate-600 text-xs dark:text-slate-400">
                  Amount
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-[13px] dark:divide-slate-800/80">
              {(drawerKind === "proposal" ? activeProposal?.budgetItems : activeProject?.budgetItems)?.map(
                (item, i) => (
                  <tr key={`${item.description}-${i}`} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/20">
                    <td className="px-4 py-3 text-slate-700 dark:text-slate-300">{item.description}</td>
                    <td className="px-4 py-3 text-right font-medium text-slate-800 dark:text-slate-200">
                      {new Intl.NumberFormat("en-US", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      }).format(item.amount)}
                    </td>
                  </tr>
                ),
              )}
            </tbody>
            <tfoot className="bg-slate-50 dark:bg-slate-900/50">
              <tr>
                <td className="px-4 py-3 font-bold text-slate-900 dark:text-slate-100">Total</td>
                <td className="px-4 py-3 text-right font-bold text-indigo-600 dark:text-indigo-400">
                  {(drawerKind === "proposal" ? activeProposal : activeProject)?.budgetItems?.reduce(
                    (acc, curr) => acc + curr.amount,
                    0,
                  )
                    ? new Intl.NumberFormat("en-US", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      }).format(
                        (drawerKind === "proposal" ? activeProposal : activeProject)?.budgetItems?.reduce(
                          (acc, curr) => acc + curr.amount,
                          0,
                        ) ?? 0,
                      )
                    : (drawerKind === "proposal" ? activeProposal?.budget : activeProject?.budget)?.replace(
                        /[^0-9.]/g,
                        "",
                      )}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </div>
  );
}

interface EvaluationScoresTabProps {
  drawerKind: "proposal" | "project";
  _activeProposal: EvalProposalRow | null;
  members: ProposalMemberWithUser[];
  rubric: RubricItem[];
  setRubric: React.Dispatch<React.SetStateAction<RubricItem[]>>;
  apiRubrics: EvaluationRubric[];
  filteredApiRubrics: EvaluationRubric[];
  draftScores: Record<string, Record<string, DraftScore>>;
  setDraftScores: React.Dispatch<React.SetStateAction<Record<string, Record<string, DraftScore>>>>;
  scoresLoading: boolean;
  membersLoading: boolean;
  isSubmitting: boolean;
  totals: { earned: number; max: number; pct: number };
  _apiAggregate: { earned: number; max: number };
  handleSubmitScores: () => void;
}

export function EvaluationScoresTab({
  drawerKind,
  _activeProposal,
  members,
  rubric,
  setRubric,
  // biome-ignore lint/correctness/noUnusedFunctionParameters: reserved for other tabs
  apiRubrics,
  filteredApiRubrics,
  draftScores,
  setDraftScores,
  scoresLoading,
  membersLoading,
  isSubmitting,
  totals,
  _apiAggregate,
  handleSubmitScores,
}: EvaluationScoresTabProps) {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h3 className="font-bold text-slate-900 text-sm dark:text-slate-100">Evaluation rubric</h3>
          <p className="mt-0.5 text-slate-500 text-xs">
            {drawerKind === "proposal" ? "Proposal phase" : "Project phase"} rubrics · adjust scores and submit.
          </p>
        </div>
        {!scoresLoading && filteredApiRubrics.length > 0 && members.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {/* biome-ignore lint/suspicious/noExplicitAny: student object */}
            {members.map((m: any) => {
              const sId = m.studentId || m.userId || m.user?.id || m.id;
              const agg = filteredApiRubrics.reduce(
                (acc, row) => {
                  const isIndividual = row.name.toLowerCase().includes("individual");
                  const groupDraft = draftScores[row.id]?.GROUP ?? { score: 0 };
                  const displayDraft = isIndividual ? (draftScores[row.id]?.[sId] ?? { score: 0 }) : groupDraft;
                  acc.earned += displayDraft.score;
                  acc.max += row.maxPoints;
                  return acc;
                },
                { earned: 0, max: 0 },
              );
              const initials = (m.user?.fullName || "ST").slice(0, 2).toUpperCase();
              return (
                <div
                  key={sId}
                  className="flex items-center gap-3 rounded-xl border border-indigo-200 bg-indigo-50 px-3 py-2 shadow-xs dark:border-indigo-900/50 dark:bg-indigo-950/40"
                >
                  <Avatar className="h-7 w-7 border border-indigo-100 dark:border-indigo-800">
                    <AvatarFallback className="bg-white font-bold text-[10px] text-indigo-700 dark:bg-indigo-900 dark:text-indigo-300">
                      {initials}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col">
                    <p className="max-w-[100px] truncate font-bold text-[10px] text-indigo-800 uppercase tracking-wider dark:text-indigo-300">
                      {m.user?.fullName || "Student"}
                    </p>
                    <p className="mt-0.5 font-black text-indigo-900 text-sm tabular-nums leading-none dark:text-indigo-100">
                      {agg.earned.toFixed(2)}{" "}
                      <span className="font-semibold text-[10px] text-slate-500">/ {agg.max}</span>
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
        {!scoresLoading && filteredApiRubrics.length === 0 && (
          <div className="rounded-xl border border-indigo-200 bg-indigo-50 px-4 py-2 dark:border-indigo-900/50 dark:bg-indigo-950/40">
            <p className="font-bold text-[10px] text-indigo-800 uppercase tracking-wider dark:text-indigo-300">
              Aggregate
            </p>
            <p className="font-black text-indigo-900 text-lg tabular-nums dark:text-indigo-100">
              {totals.earned.toFixed(2)} <span className="font-semibold text-slate-500 text-sm">/ {totals.max}</span>
            </p>
          </div>
        )}
      </div>

      {(scoresLoading || membersLoading) && (
        <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-slate-100 bg-slate-50 py-12 dark:border-slate-800 dark:bg-slate-900/30">
          <Loader2 className="h-6 w-6 animate-spin text-indigo-500" />
          <p className="text-slate-500 text-xs">Loading rubrics and members from server…</p>
        </div>
      )}

      {!(scoresLoading || membersLoading) && filteredApiRubrics.length > 0 && (
        <div className="flex flex-col gap-3">
          {filteredApiRubrics.map((row, i) => {
            const isIndividual = row.name.toLowerCase().includes("individual");
            const groupDraft = draftScores[row.id]?.GROUP ?? { score: 0, feedback: "" };

            // To calculate progress for the whole rubric we'll just take the first student or group
            const displayDraft = isIndividual
              ? (draftScores[row.id]?.[members[0]?.userId] ?? { score: 0, feedback: "" })
              : groupDraft;

            const pct = row.maxPoints > 0 ? (displayDraft.score / row.maxPoints) * 100 : 0;
            return (
              <div
                key={row.id}
                className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition-shadow hover:shadow-md dark:border-slate-800 dark:bg-slate-950"
              >
                <div className="absolute inset-y-0 left-0 w-1 bg-linear-to-b from-indigo-500 to-violet-500 opacity-80" />
                <div className="flex flex-col gap-3 pl-2 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex min-w-0 items-start gap-3">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-slate-100 font-black text-indigo-600 text-sm dark:bg-slate-800 dark:text-indigo-400">
                      {i + 1}
                    </span>
                    <div className="min-w-0">
                      <p className="font-bold text-slate-900 text-sm dark:text-slate-100">
                        {row.name}{" "}
                        {isIndividual && (
                          <span className="ml-1 font-semibold text-indigo-500 text-xs">(Individual)</span>
                        )}
                      </p>
                      <div className="mt-1 flex flex-wrap items-center gap-2">
                        <Badge
                          variant="outline"
                          className="border-slate-200 font-semibold text-[10px] uppercase dark:border-slate-700"
                        >
                          {row.type}
                        </Badge>
                        <span className="font-medium text-[11px] text-slate-500">Max {row.maxPoints} pts</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex w-full flex-col gap-2 sm:w-52">
                    <div className="flex items-baseline justify-between gap-2">
                      <span className="font-bold text-slate-500 text-xs">Result</span>
                      <span className="font-black text-indigo-700 text-lg tabular-nums dark:text-indigo-300">
                        {displayDraft.score.toFixed(2)}
                        <span className="font-semibold text-slate-400 text-sm"> / {row.maxPoints}</span>
                      </span>
                    </div>
                    <Progress value={pct} className="h-2 bg-slate-100 dark:bg-slate-800" />
                  </div>
                </div>

                <div className="mt-4 flex flex-col gap-4 pl-2 sm:pl-12">
                  {isIndividual ? (
                    <div className="grid gap-3 rounded-xl border border-slate-100 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-900/30">
                      {/* biome-ignore lint/suspicious/noExplicitAny: student object */}
                      {members.map((student: any) => {
                        const sId = student.studentId || student.userId || student.user?.id || student.id;
                        const studentDraft = draftScores[row.id]?.[sId] ?? { score: 0, feedback: "" };
                        return (
                          <div
                            key={sId}
                            className="flex flex-col gap-3 rounded-lg border border-slate-200 bg-white p-3 shadow-sm dark:border-slate-700 dark:bg-slate-950"
                          >
                            <div className="font-semibold text-slate-900 text-sm dark:text-slate-100">
                              {student.user?.fullName || "Student"}{" "}
                              <span className="font-normal text-slate-400 text-xs">({student.role})</span>
                            </div>
                            <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:gap-4">
                              <div className="flex items-center gap-2">
                                <Label className="w-10 shrink-0 font-semibold text-[11px] text-slate-500">Score</Label>
                                <Input
                                  type="number"
                                  step="0.01"
                                  min={0}
                                  max={row.maxPoints}
                                  className="h-8 w-24 font-mono text-sm"
                                  value={studentDraft.score}
                                  onChange={(e) => {
                                    const v = Number.parseFloat(e.target.value);
                                    if (Number.isNaN(v)) return;
                                    setDraftScores((prev) => ({
                                      ...prev,
                                      [row.id]: {
                                        ...prev[row.id],
                                        [sId]: {
                                          ...studentDraft,
                                          score: Math.min(row.maxPoints, Math.max(0, v)),
                                        },
                                      },
                                    }));
                                  }}
                                />
                              </div>
                              <div className="flex flex-1 items-start gap-2">
                                <Label className="mt-1.5 w-10 shrink-0 font-semibold text-[11px] text-slate-500">
                                  Note
                                </Label>
                                <Textarea
                                  className="min-h-12 resize-none rounded-lg text-[12px] dark:bg-slate-900"
                                  placeholder="Feedback for this student…"
                                  value={studentDraft.feedback}
                                  onChange={(e) =>
                                    setDraftScores((prev) => ({
                                      ...prev,
                                      [row.id]: {
                                        ...prev[row.id],
                                        [sId]: {
                                          ...studentDraft,
                                          feedback: e.target.value,
                                        },
                                      },
                                    }))
                                  }
                                />
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="flex flex-col gap-3 rounded-lg border border-slate-100 bg-slate-50 p-3 shadow-sm dark:border-slate-800 dark:bg-slate-900/30">
                      <p className="font-semibold text-slate-700 text-xs dark:text-slate-300">
                        Group Score (Applies to entire team)
                      </p>
                      <div className="flex flex-col gap-3 sm:flex-row sm:items-start">
                        <div className="flex items-center gap-2">
                          <Label className="w-10 shrink-0 font-semibold text-[11px] text-slate-500">Score</Label>
                          <Input
                            type="number"
                            step="0.01"
                            min={0}
                            max={row.maxPoints}
                            className="h-8 w-24 font-mono text-sm"
                            value={groupDraft.score}
                            onChange={(e) => {
                              const v = Number.parseFloat(e.target.value);
                              if (Number.isNaN(v)) return;
                              setDraftScores((prev) => ({
                                ...prev,
                                [row.id]: {
                                  ...prev[row.id],
                                  GROUP: {
                                    ...groupDraft,
                                    score: Math.min(row.maxPoints, Math.max(0, v)),
                                  },
                                },
                              }));
                            }}
                          />
                        </div>
                        <div className="flex flex-1 items-start gap-2">
                          <Label className="mt-1.5 w-10 shrink-0 font-semibold text-[11px] text-slate-500">Note</Label>
                          <Textarea
                            className="min-h-12 resize-none rounded-lg text-[12px] dark:bg-slate-900"
                            placeholder="Optional group feedback…"
                            value={groupDraft.feedback}
                            onChange={(e) =>
                              setDraftScores((prev) => ({
                                ...prev,
                                [row.id]: {
                                  ...prev[row.id],
                                  GROUP: {
                                    ...groupDraft,
                                    feedback: e.target.value,
                                  },
                                },
                              }))
                            }
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {!(scoresLoading || membersLoading) && filteredApiRubrics.length === 0 && (
        <div className="flex flex-col gap-3">
          {rubric.map((row, i) => {
            const pct = row.max > 0 ? (row.score / row.max) * 100 : 0;
            return (
              <div
                key={row.order}
                className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition-shadow hover:shadow-md dark:border-slate-800 dark:bg-slate-950"
              >
                <div className="absolute inset-y-0 left-0 w-1 bg-linear-to-b from-indigo-500 to-violet-500 opacity-80" />
                <div className="flex flex-col gap-3 pl-2 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex min-w-0 items-start gap-3">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-slate-100 font-black text-indigo-600 text-sm dark:bg-slate-800 dark:text-indigo-400">
                      {row.order}
                    </span>
                    <div className="min-w-0">
                      <p className="font-bold text-slate-900 text-sm dark:text-slate-100">{row.name}</p>
                      <div className="mt-1 flex flex-wrap items-center gap-2">
                        <Badge
                          variant="outline"
                          className="border-slate-200 font-semibold text-[10px] uppercase dark:border-slate-700"
                        >
                          {row.kind}
                        </Badge>
                        <span className="font-medium text-[11px] text-slate-500">Max {row.max} pts</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex w-full flex-col gap-2 sm:w-52">
                    <div className="flex items-baseline justify-between gap-2">
                      <span className="font-bold text-slate-500 text-xs">Result</span>
                      <span className="font-black text-indigo-700 text-lg tabular-nums dark:text-indigo-300">
                        {row.score}
                        <span className="font-semibold text-slate-400 text-sm"> / {row.max}</span>
                      </span>
                    </div>
                    <Progress value={pct} className="h-2 bg-slate-100 dark:bg-slate-800" />
                  </div>
                </div>
                <div className="mt-3 flex items-center gap-2 pl-2 sm:pl-12">
                  <Label className="w-14 shrink-0 font-semibold text-[11px] text-slate-500">Edit</Label>
                  <Input
                    type="number"
                    step="0.01"
                    min={0}
                    max={row.max}
                    className="h-8 max-w-30 font-mono text-sm"
                    value={row.score}
                    onChange={(e) => {
                      const v = Number.parseFloat(e.target.value);
                      if (Number.isNaN(v)) return;
                      setRubric((prev) =>
                        prev.map((r, idx) =>
                          idx === i
                            ? {
                                ...r,
                                score: Math.min(r.max, Math.max(0, v)),
                              }
                            : r,
                        ),
                      );
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      )}

      <div className="mt-4 flex items-center justify-end">
        <Can
          permission="EVALUATION_SCORE_SUBMIT"
          fallback={
            <p className="font-medium text-[11px] text-slate-500 italic">
              You do not have permission to submit these evaluations.
            </p>
          }
        >
          <Button
            type="button"
            className="h-10 bg-indigo-600 font-semibold text-white shadow hover:bg-indigo-700"
            disabled={
              isSubmitting ||
              scoresLoading ||
              membersLoading ||
              (filteredApiRubrics.length === 0 && rubric.length === 0)
            }
            onClick={handleSubmitScores}
          >
            {isSubmitting ? <Loader2 className="mr-1.5 h-4 w-4 animate-spin" /> : <Send className="mr-1.5 h-4 w-4" />}
            {isSubmitting ? "Submitting…" : "Submit Evaluation Scores"}
          </Button>
        </Can>
      </div>
    </div>
  );
}

interface EvaluationDefenceTabProps {
  defenceDate: Date | undefined;
  setDefenceDate: React.Dispatch<React.SetStateAction<Date | undefined>>;
  defenceTime: string;
  setDefenceTime: React.Dispatch<React.SetStateAction<string>>;
  defenceVenue: string;
  setDefenceVenue: React.Dispatch<React.SetStateAction<string>>;
  defenceMessage: string;
  setDefenceMessage: React.Dispatch<React.SetStateAction<string>>;
  defenceDraftSent: boolean;
  handleSendDefenceInvite: () => void;
  isSchedulingDefence?: boolean;
}

export function EvaluationDefenceTab({
  defenceDate,
  setDefenceDate,
  defenceTime,
  setDefenceTime,
  defenceVenue,
  setDefenceVenue,
  defenceMessage,
  setDefenceMessage,
  defenceDraftSent,
  handleSendDefenceInvite,
  isSchedulingDefence,
}: EvaluationDefenceTabProps) {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-linear-to-br from-slate-50 to-white p-5 shadow-sm sm:flex-row sm:items-center dark:border-slate-800 dark:from-slate-900/40 dark:to-slate-950">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-indigo-100 text-indigo-600 dark:bg-indigo-500/20 dark:text-indigo-300">
          <CalendarDays className="h-6 w-6" />
        </div>
        <div>
          <h3 className="font-bold text-base text-slate-900 tracking-tight dark:text-slate-100">Defence Appointment</h3>
          <p className="mt-1 text-[13px] text-slate-500 leading-relaxed dark:text-slate-400">
            Schedule the evaluation defence. A calendar invitation will be automatically drafted for the PI upon
            confirmation.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5 rounded-2xl border border-slate-100 bg-white p-5 shadow-sm md:grid-cols-2 dark:border-slate-800/60 dark:bg-slate-950">
        <div className="flex flex-col gap-2.5">
          <Label className="font-bold text-[12px] text-slate-700 uppercase tracking-widest dark:text-slate-300">
            Date
          </Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="h-11 w-full justify-start bg-slate-50/50 font-medium text-slate-700 hover:bg-slate-100 dark:bg-slate-900/50 dark:text-slate-300 dark:hover:bg-slate-800"
              >
                <CalendarDays className="mr-2.5 h-4 w-4 text-indigo-500" />
                {defenceDate ? format(defenceDate, "EEEE, d MMM yyyy") : "Select a date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto overflow-hidden p-0" align="start">
              <Calendar
                mode="single"
                selected={defenceDate}
                onSelect={setDefenceDate}
                disabled={(d) => d < new Date(new Date().setHours(0, 0, 0, 0))}
              />
            </PopoverContent>
          </Popover>
        </div>

        <div className="flex flex-col gap-2.5">
          <Label
            htmlFor="def-time"
            className="font-bold text-[12px] text-slate-700 uppercase tracking-widest dark:text-slate-300"
          >
            Time (EAT)
          </Label>
          <div className="relative">
            <Clock className="-translate-y-1/2 pointer-events-none absolute top-1/2 left-3 h-4 w-4 text-indigo-500" />
            <Input
              id="def-time"
              type="time"
              className="h-11 bg-slate-50/50 pl-10 font-medium text-slate-700 dark:bg-slate-900/50 dark:text-slate-300"
              value={defenceTime}
              onChange={(e) => setDefenceTime(e.target.value)}
            />
          </div>
        </div>

        <div className="flex flex-col gap-2.5 md:col-span-2">
          <Label
            htmlFor="def-venue"
            className="font-bold text-[12px] text-slate-700 uppercase tracking-widest dark:text-slate-300"
          >
            Location / Link
          </Label>
          <Input
            id="def-venue"
            placeholder="Room number, building, or Teams/Zoom URL"
            className="h-11 bg-slate-50/50 dark:bg-slate-900/50"
            value={defenceVenue}
            onChange={(e) => setDefenceVenue(e.target.value)}
          />
        </div>

        <div className="flex flex-col gap-2.5 md:col-span-2">
          <Label
            htmlFor="def-msg"
            className="font-bold text-[12px] text-slate-700 uppercase tracking-widest dark:text-slate-300"
          >
            Direct Message to PI
          </Label>
          <Textarea
            id="def-msg"
            className="min-h-30 resize-none bg-slate-50/50 text-[13px] leading-relaxed dark:bg-slate-900/50"
            value={defenceMessage}
            onChange={(e) => setDefenceMessage(e.target.value)}
          />
        </div>
      </div>

      <div className="mt-2 flex flex-col items-center gap-4 sm:flex-row">
        <Button
          type="button"
          className="h-11 w-full bg-indigo-600 font-bold text-white shadow-md transition-all hover:bg-indigo-700 hover:shadow-lg sm:flex-1"
          disabled={!defenceDate || isSchedulingDefence}
          onClick={handleSendDefenceInvite}
        >
          {isSchedulingDefence ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Send className="mr-2 h-4 w-4" />}
          {isSchedulingDefence ? "Scheduling..." : "Send Invite to PI"}
        </Button>

        {defenceDraftSent && defenceDate && (
          <div className="flex items-center gap-2.5 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-2 sm:flex-1 dark:border-emerald-900/60 dark:bg-emerald-950/40">
            <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-600 dark:text-emerald-400" />
            <div className="min-w-0">
              <p className="font-bold text-[12px] text-emerald-900 dark:text-emerald-200">
                Invitation successfully queued
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

interface EvaluationReviewTabProps {
  drawerKind: "proposal" | "project";
  activeProposal: EvalProposalRow | null;
}

export function EvaluationReviewTab({ drawerKind, activeProposal }: EvaluationReviewTabProps) {
  return (
    <div className="flex flex-col gap-6">
      {drawerKind === "proposal" && activeProposal ? (
        <TimelineTab proposalId={activeProposal.id} />
      ) : (
        <div className="flex flex-col gap-1 rounded-2xl border border-slate-200/80 bg-yellow-50/50 p-4 dark:border-slate-800 dark:from-yellow-950/30 dark:to-slate-950">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-yellow-600/10 text-yellow-600 dark:bg-yellow-500/15 dark:text-yellow-400">
              <Clock className="h-4 w-4" />
            </div>
            <div>
              <h4 className="font-bold text-slate-900 text-sm dark:text-slate-100">Timeline</h4>
              <p className="font-medium text-[11px] text-slate-500 dark:text-slate-400">
                Project timeline integration coming soon.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

interface TeamTabContentProps {
  proposalId?: string;
}

export function TeamTabContent({ proposalId }: TeamTabContentProps) {
  const { data: members = [], isLoading } = useGetProposalMembers(proposalId ?? null);

  if (!proposalId) {
    return (
      <div className="rounded-lg border border-slate-200 border-dashed py-8 text-center text-slate-500 text-xs italic dark:border-slate-700 dark:text-slate-400">
        No proposal selected.
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="h-5 w-5 animate-spin text-slate-400" />
      </div>
    );
  }

  if (members.length === 0) {
    return (
      <div className="rounded-lg border border-slate-200 border-dashed py-8 text-center text-slate-500 text-xs italic dark:border-slate-700 dark:text-slate-400">
        No team members found.
      </div>
    );
  }

  const roleOrder = ["PI", "MEMBER", "ADVISOR", "EVALUATOR", "COORDINATOR", "DGC", "PG_OFFICE"];

  const roleLabels: Record<string, string> = {
    PI: "PI",
    ADVISOR: "Advisor",
    EVALUATOR: "Evaluator",
    COORDINATOR: "Coordinator",
    DGC: "DGC",
    PG_OFFICE: "PG Office",
  };

  const groupedMembers = members.reduce<Record<string, ProposalMemberWithUser[]>>(
    (acc, member) => {
      const role = member.role || "Other";
      if (!acc[role]) {
        acc[role] = [];
      }
      acc[role].push(member);
      return acc;
    },
    {} as Record<string, ProposalMemberWithUser[]>,
  );

  const memberGroups = [
    ...roleOrder
      .map((role) => ({ role, members: groupedMembers[role] || [] }))
      .filter((group) => group.members.length > 0),
    ...Object.keys(groupedMembers)
      .filter((role) => !roleOrder.includes(role))
      .sort()
      .map((role) => ({ role, members: groupedMembers[role] })),
  ];

  return (
    <div className="flex flex-col gap-4">
      <h4 className="flex items-center gap-2 font-bold text-[11px] text-slate-500 uppercase tracking-wider">
        <Users className="h-3.5 w-3.5" /> ({members.length}) Team Members
      </h4>
      <div className="flex flex-col gap-4">
        {memberGroups.map((group) => (
          <div
            key={group.role}
            className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-slate-200/50 shadow-sm dark:border-slate-800 dark:bg-slate-950 dark:shadow-none"
          >
            <div className="border-slate-100 border-b px-4 py-3 dark:border-slate-800">
              <p className="font-semibold text-slate-900 text-sm dark:text-slate-100">
                {roleLabels[group.role] || group.role.replace(/_/g, " ")}
              </p>
              <p className="mt-0.5 text-slate-500 text-xs dark:text-slate-400">
                {group.members.length} member
                {group.members.length === 1 ? "" : "s"}
              </p>
            </div>

            <div className="divide-y divide-slate-100 dark:divide-slate-800">
              {group.members.map((member) => {
                const initials = member.user.fullName
                  .split(" ")
                  .slice(0, 2)
                  .map((name) => name[0]?.toUpperCase() || "")
                  .join("");

                return (
                  <div key={member.id} className="flex items-center gap-3 px-4 py-3">
                    <Avatar className="h-9 w-9 shrink-0 border border-slate-200 dark:border-slate-700">
                      <AvatarFallback className="bg-slate-100 font-semibold text-[11px] text-slate-700 dark:bg-slate-800 dark:text-slate-200">
                        {initials}
                      </AvatarFallback>
                    </Avatar>
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-medium text-slate-900 text-sm dark:text-slate-100">
                        {member.user.fullName}
                      </p>
                      <p className="truncate text-slate-500 text-xs dark:text-slate-400">{member.user.email}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
