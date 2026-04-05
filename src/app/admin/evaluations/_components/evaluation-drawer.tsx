"use client";

import { format } from "date-fns";
import {
  AlertTriangle,
  Award,
  Banknote,
  CalendarDays,
  Check,
  CheckCircle,
  CheckCircle2,
  ChevronRight,
  Circle,
  Clock,
  FileText,
  GraduationCap,
  Send,
  ShieldCheck,
  Sparkles,
  UserCheck,
  Users,
} from "lucide-react";

import { Can, hasPermission } from "@/access-control/permission-gates";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Progress } from "@/components/ui/progress";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/stores/authStore";

import { formatPeopleList } from "../../proposals/_components/proposals-table";
import { getApprovalChain } from "../../proposals/_data/mock-proposals";
import { useEvaluations } from "../evaluations-context";
import { STATUS_STYLES } from "./evaluations-tabs";

export function EvaluationDrawer() {
  const {
    drawerOpen,
    drawerKind,
    drawerTab,
    setDrawerTab,
    activeProposal,
    activeProject,
    rubric,
    setRubric,
    totals,
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
    isEvalApproved,
    closeDrawer,
    setShowApproveDialog,
    isEvalRejected,
    filteredEvals,
    setPickedEvalIds,
    setShowAssign,
    filteredAdvisors,
    setPickedAdvisorIds,
    setShowAssignAdvisor,
    setShowTimelineReject,
  } = useEvaluations();

  const { user } = useAuthStore();
  const userPerms = user?.permissions ?? [];
  const canScheduleDefence = hasPermission(userPerms, "DEFENCE_SCHEDULE");
  const canViewBudget = hasPermission(userPerms, "BUDGET_VIEW");

  const drawerTitle = drawerKind === "proposal" ? activeProposal?.title : activeProject?.title;
  const drawerSubtitle =
    drawerKind === "proposal"
      ? activeProposal
        ? `${activeProposal.id} · ${activeProposal.dept} · ${activeProposal.pi}`
        : ""
      : activeProject
        ? `${activeProject.id} · ${activeProject.dept} · ${activeProject.lead}`
        : "";

  const approvalId = drawerKind === "proposal" ? activeProposal?.id : activeProject?.id;
  const approvalChain = approvalId ? getApprovalChain(approvalId) : [];

  return (
    <Sheet open={drawerOpen} onOpenChange={(o) => !o && closeDrawer()}>
      <SheetContent
        side="right"
        className="flex w-full flex-col overflow-hidden border-slate-200/80 border-l p-0 shadow-2xl sm:max-w-[920px] xl:max-w-[1100px] dark:border-slate-800"
      >
        {drawerTitle && (
          <>
            <SheetHeader className="shrink-0 space-y-0 border-slate-100 border-b bg-gradient-to-br from-indigo-50/90 via-white to-white px-6 pt-6 pb-4 dark:border-slate-800 dark:from-indigo-950/40 dark:via-slate-950 dark:to-slate-950">
              <div className="flex flex-wrap items-center gap-2">
                <Badge className="border-0 bg-white/80 font-bold text-[10px] text-slate-700 shadow-sm dark:bg-slate-800 dark:text-slate-200">
                  {drawerKind === "proposal" ? "Proposal evaluation" : "Project evaluation"}
                </Badge>
                {drawerKind === "project" && activeProject && (
                  <Badge
                    className={cn("border-0 font-bold text-[10px]", STATUS_STYLES[activeProject.evalStatus].className)}
                  >
                    {activeProject.evalStatus}
                  </Badge>
                )}
                {isEvalApproved && (
                  <Badge className="border-0 bg-emerald-600 font-bold text-[10px] text-white">
                    <CheckCircle2 className="mr-1 h-3 w-3" />
                    Evaluation approved
                  </Badge>
                )}
              </div>
              <SheetTitle className="mt-2 pr-2 text-left font-bold text-[17px] text-slate-900 leading-snug dark:text-slate-100">
                {drawerTitle}
              </SheetTitle>
              <SheetDescription className="text-left text-xs leading-relaxed">{drawerSubtitle}</SheetDescription>

              <div className="no-scrollbar mt-4 flex flex-nowrap items-center gap-1.5 overflow-x-auto rounded-xl bg-slate-100/80 p-1 dark:bg-slate-900/60">
                {[
                  { id: "overview" as const, label: "Overview", icon: FileText },
                  { id: "team" as const, label: "Team", icon: Users },
                  ...(canViewBudget ? [{ id: "budget" as const, label: "Budget", icon: Banknote }] : []),
                  { id: "scores" as const, label: "Scores", icon: Award },
                  ...(canScheduleDefence ? [{ id: "defence" as const, label: "Defence", icon: CalendarDays }] : []),
                  { id: "review" as const, label: "Approve", icon: ShieldCheck },
                ].map((t) => (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => setDrawerTab(t.id)}
                    className={cn(
                      "flex shrink-0 items-center justify-center gap-2 rounded-lg px-3 py-2 font-semibold text-xs transition-all",
                      drawerTab === t.id
                        ? "bg-white text-indigo-700 shadow-sm dark:bg-slate-800 dark:text-indigo-400"
                        : "text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200",
                    )}
                  >
                    <t.icon className="h-3.5 w-3.5 shrink-0" />
                    {t.label}
                  </button>
                ))}
              </div>
            </SheetHeader>

            <div className="flex flex-1 flex-col gap-6 overflow-y-auto px-6 py-6 sm:px-8 sm:py-8">
              {/* ── TAB: OVERVIEW ── */}
              {drawerTab === "overview" && (
                <div className="flex flex-col gap-6">
                  {/* Key Stats */}
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <div className="rounded-lg border border-slate-100 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-900/50">
                      <p className="mb-1.5 font-bold text-[10px] text-slate-400 uppercase tracking-wider">
                        Principal Investigator
                      </p>
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
                      <p className="mb-1.5 font-bold text-[10px] text-slate-400 uppercase tracking-wider">
                        Budget Requested
                      </p>
                      <p className="font-extrabold text-indigo-600 text-xl dark:text-indigo-400">
                        {drawerKind === "proposal" ? activeProposal?.budget : activeProject?.budget}
                      </p>
                    </div>
                    <div className="rounded-lg border border-slate-100 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-900/50">
                      <p className="mb-1.5 font-bold text-[10px] text-slate-400 uppercase tracking-wider">
                        Date Submitted
                      </p>
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

                  {/* Abstract */}
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

                  {/* Admin Workflow Actions */}
                  <div>
                    <h4 className="mb-3 font-bold text-[11px] text-slate-500 uppercase tracking-wider">
                      Workflow Actions
                    </h4>
                    <div className="grid grid-cols-1 gap-2.5 lg:grid-cols-2">
                      {/* Assign Evaluators */}
                      <Can permission="EVALUATOR_ASSIGN">
                        <button
                          type="button"
                          onClick={() => {
                            const pre = filteredEvals
                              // biome-ignore lint/suspicious/noExplicitAny: dynamic access allowed for mockup
                              .filter((e) => ((activeProposal as any)?.evaluators || []).includes(e.name))
                              .map((e) => e.id);
                            setPickedEvalIds(pre);
                            setShowAssign(true);
                          }}
                          className="group flex w-full items-center gap-3 rounded-xl border border-blue-200/90 bg-gradient-to-br from-blue-50/90 to-white p-4 text-left text-blue-800 shadow-sm transition-all hover:border-blue-300 hover:shadow-md dark:border-blue-900/45 dark:from-blue-950/40 dark:to-slate-950 dark:text-blue-300 dark:hover:border-blue-800"
                        >
                          <div className="shrink-0 rounded-xl bg-blue-100 p-2.5 dark:bg-blue-900/50">
                            <UserCheck className="h-4 w-4" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="font-bold text-[13px] leading-tight">Assign Evaluators</p>
                            <p className="mt-0.5 line-clamp-2 font-medium text-[11px] text-blue-700/80 dark:text-blue-400/80">
                              {(activeProposal as { evaluators?: string[] })?.evaluators?.length
                                ? `${(activeProposal as { evaluators?: string[] })?.evaluators?.length} assigned: ${formatPeopleList(((activeProposal as { evaluators?: string[] })?.evaluators) || [], 3)}`
                                : "No evaluators assigned"}
                            </p>
                          </div>
                          <ChevronRight className="ml-auto h-4 w-4 shrink-0 opacity-40 transition-opacity group-hover:opacity-100" />
                        </button>
                      </Can>

                      {/* Assign Advisor */}
                      <Can permission="ADVISOR_ASSIGN">
                        <button
                          type="button"
                          onClick={() => {
                            const pre = filteredAdvisors
                              // biome-ignore lint/suspicious/noExplicitAny: dynamic access allowed for mockup
                              .filter((a) => ((activeProposal as any)?.advisors || []).includes(a.name))
                              .map((a) => a.id);
                            setPickedAdvisorIds(pre);
                            setShowAssignAdvisor(true);
                          }}
                          className="group flex w-full items-center gap-3 rounded-xl border border-violet-200/90 bg-gradient-to-br from-violet-50/90 to-white p-4 text-left text-violet-800 shadow-sm transition-all hover:border-violet-300 hover:shadow-md dark:border-violet-900/45 dark:from-violet-950/35 dark:to-slate-950 dark:text-violet-300 dark:hover:border-violet-800"
                        >
                          <div className="shrink-0 rounded-xl bg-violet-100 p-2.5 dark:bg-violet-900/50">
                            <GraduationCap className="h-4 w-4" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="font-bold text-[13px] leading-tight">Assign Advisor</p>
                            <p className="mt-0.5 line-clamp-2 font-medium text-[11px] text-violet-700/80 dark:text-violet-400/80">
                              {(activeProposal as { advisors?: string[] })?.advisors?.length
                                ? `${(activeProposal as { advisors?: string[] })?.advisors?.length} assigned: ${formatPeopleList(((activeProposal as { advisors?: string[] })?.advisors) || [], 3)}`
                                : "No advisors assigned"}
                            </p>
                          </div>
                          <ChevronRight className="ml-auto h-4 w-4 shrink-0 opacity-40 transition-opacity group-hover:opacity-100" />
                        </button>
                      </Can>
                    </div>
                  </div>
                </div>
              )}

              {/* ── TAB: TEAM ── */}
              {drawerTab === "team" && (
                <div className="flex flex-col gap-3">
                  <h4 className="flex items-center gap-2 font-bold text-[11px] text-slate-500 uppercase tracking-wider">
                    <Users className="h-3.5 w-3.5" /> Research Team
                  </h4>
                  <div className="flex items-center gap-4 rounded-lg border border-indigo-100 bg-indigo-50/50 p-3.5 dark:border-indigo-900/30 dark:bg-indigo-900/10">
                    <Avatar className="h-10 w-10 border-2 border-indigo-200 dark:border-indigo-800">
                      <AvatarFallback
                        className={`font-bold text-xs ${drawerKind === "proposal" ? activeProposal?.piColor : activeProject?.leadColor}`}
                      >
                        {drawerKind === "proposal" ? activeProposal?.piAvatar : activeProject?.leadAvatar}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex min-w-0 flex-col">
                      <span className="font-bold text-slate-900 text-sm dark:text-slate-100">
                        {drawerKind === "proposal" ? activeProposal?.pi : activeProject?.lead}
                      </span>
                      <span className="font-semibold text-indigo-600 text-xs dark:text-indigo-400">
                        Principal Investigator
                      </span>
                    </div>
                    <Badge className="ml-auto shrink-0 border-0 bg-indigo-600 text-[10px] text-white">PI</Badge>
                  </div>
                  <p className="rounded-lg border border-slate-200 border-dashed py-6 text-center text-slate-400 text-xs italic dark:border-slate-700">
                    Full team details will appear here once connected to the backend.
                  </p>
                </div>
              )}

              {/* ── TAB: BUDGET ── */}
              {drawerTab === "budget" && canViewBudget && (
                <div className="flex flex-col gap-6">
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <div className="flex flex-col justify-center rounded-xl border border-slate-200/80 bg-gradient-to-br from-indigo-50 to-white p-4 shadow-sm dark:border-slate-800 dark:from-indigo-950/50 dark:to-slate-950">
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
                    <h4 className="mb-3 font-bold text-[11px] text-slate-500 uppercase tracking-wider">
                      Budget Breakdown
                    </h4>
                    <div className="overflow-hidden rounded-xl border border-slate-200 shadow-sm dark:border-slate-800">
                      <table className="w-full text-left text-sm">
                        <thead className="bg-slate-50/80 dark:bg-slate-900/50">
                          <tr>
                            <th className="px-4 py-3 font-semibold text-slate-600 text-xs dark:text-slate-400">
                              Description
                            </th>
                            <th className="px-4 py-3 text-right font-semibold text-slate-600 text-xs dark:text-slate-400">
                              Amount
                            </th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 text-[13px] dark:divide-slate-800/80">
                          {(drawerKind === "proposal" ? activeProposal?.budgetItems : activeProject?.budgetItems)?.map((item, i) => (
                            <tr key={`${item.description}-${i}`} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/20">
                              <td className="px-4 py-3 text-slate-700 dark:text-slate-300">
                                {item.description}
                              </td>
                              <td className="px-4 py-3 text-right font-medium text-slate-800 dark:text-slate-200">
                                {new Intl.NumberFormat("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(item.amount)}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                        <tfoot className="bg-slate-50 dark:bg-slate-900/50">
                          <tr>
                            <td className="px-4 py-3 font-bold text-slate-900 dark:text-slate-100">
                              Total
                            </td>
                            <td className="px-4 py-3 text-right font-bold text-indigo-600 dark:text-indigo-400">
                              {(drawerKind === "proposal" ? activeProposal : activeProject)?.budgetItems?.reduce((acc, curr) => acc + curr.amount, 0)
                                ? new Intl.NumberFormat("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(
                                  (drawerKind === "proposal" ? activeProposal : activeProject)?.budgetItems?.reduce((acc, curr) => acc + curr.amount, 0) ?? 0,
                                )
                                : (drawerKind === "proposal" ? activeProposal?.budget : activeProject?.budget)?.replace(/[^0-9.]/g, "")}
                            </td>
                          </tr>
                        </tfoot>
                      </table>
                    </div>
                  </div>
                </div>
              )}

              {/* ── TAB: SCORES ── */}
              {drawerTab === "scores" && (
                <div className="flex flex-col gap-4">
                  <div className="flex flex-wrap items-end justify-between gap-3">
                    <div>
                      <h3 className="font-bold text-slate-900 text-sm dark:text-slate-100">Evaluation rubric</h3>
                      <p className="mt-0.5 text-slate-500 text-xs">
                        Each row shows component type, cap, and awarded points. Adjust demo scores to preview totals.
                      </p>
                    </div>
                    <div className="rounded-xl border border-indigo-200 bg-indigo-50 px-4 py-2 dark:border-indigo-900/50 dark:bg-indigo-950/40">
                      <p className="font-bold text-[10px] text-indigo-800 uppercase tracking-wider dark:text-indigo-300">
                        Aggregate
                      </p>
                      <p className="font-black text-indigo-900 text-lg tabular-nums dark:text-indigo-100">
                        {totals.earned.toFixed(2)}{" "}
                        <span className="font-semibold text-slate-500 text-sm">/ {totals.max}</span>
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-col gap-3">
                    {rubric.map((row, i) => {
                      const pct = row.max > 0 ? (row.score / row.max) * 100 : 0;
                      return (
                        <div
                          key={row.order}
                          className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition-shadow hover:shadow-md dark:border-slate-800 dark:bg-slate-950"
                        >
                          <div className="absolute inset-y-0 left-0 w-1 bg-gradient-to-b from-indigo-500 to-violet-500 opacity-80" />
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
                              className="h-8 max-w-[120px] font-mono text-sm"
                              value={row.score}
                              onChange={(e) => {
                                const v = Number.parseFloat(e.target.value);
                                if (Number.isNaN(v)) return;
                                setRubric((prev) =>
                                  prev.map((r, idx) =>
                                    idx === i ? { ...r, score: Math.min(r.max, Math.max(0, v)) } : r,
                                  ),
                                );
                              }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
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
                      >
                        <Send className="mr-1.5 h-4 w-4" />
                        Submit Evaluation Scores
                      </Button>
                    </Can>
                  </div>
                </div>
              )}

              {/* ── TAB: DEFENCE ── */}
              {drawerTab === "defence" && (
                <div className="flex flex-col gap-6">
                  <div className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-gradient-to-br from-slate-50 to-white p-5 shadow-sm sm:flex-row sm:items-center dark:border-slate-800 dark:from-slate-900/40 dark:to-slate-950">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-indigo-100 text-indigo-600 dark:bg-indigo-500/20 dark:text-indigo-300">
                      <CalendarDays className="h-6 w-6" />
                    </div>
                    <div>
                      <h3 className="font-bold text-base text-slate-900 tracking-tight dark:text-slate-100">
                        Defence Appointment
                      </h3>
                      <p className="mt-1 text-[13px] text-slate-500 leading-relaxed dark:text-slate-400">
                        Schedule the evaluation defence. A calendar invitation will be automatically drafted for the PI
                        upon confirmation.
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
                        className="min-h-[120px] resize-none bg-slate-50/50 text-[13px] leading-relaxed dark:bg-slate-900/50"
                        value={defenceMessage}
                        onChange={(e) => setDefenceMessage(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="mt-2 flex flex-col items-center gap-4 sm:flex-row">
                    <Button
                      type="button"
                      className="h-11 w-full bg-indigo-600 font-bold text-white shadow-md transition-all hover:bg-indigo-700 hover:shadow-lg sm:flex-1"
                      disabled={!defenceDate}
                      onClick={handleSendDefenceInvite}
                    >
                      <Send className="mr-2 h-4 w-4" /> Send Invite to PI
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
              )}

              {/* ── TAB: REVIEW ── */}
              {drawerTab === "review" && (
                <div className="flex flex-col gap-6">
                  <div className="flex flex-col gap-1 rounded-2xl border border-slate-200/80 bg-gradient-to-br from-slate-50 to-white p-4 dark:border-slate-800 dark:from-slate-900/50 dark:to-slate-950">
                    <div className="flex items-center gap-2">
                      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-600/10 text-indigo-600 dark:bg-indigo-500/15 dark:text-indigo-400">
                        <Sparkles className="h-4 w-4" />
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-900 text-sm dark:text-slate-100">Approval chain</h4>
                        <p className="font-medium text-[11px] text-slate-500 dark:text-slate-400">
                          Completed steps show prior approvals. Your step is where you approve or reject. Later steps
                          stay inactive.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="relative">
                    <div
                      className="absolute top-3 bottom-3 left-[19px] w-px bg-gradient-to-b from-emerald-200 via-indigo-200 to-slate-200 dark:from-emerald-900/40 dark:via-indigo-900/40 dark:to-slate-800"
                      aria-hidden
                    />

                    <ul className="relative flex flex-col gap-4">
                      {approvalChain.map((step, idx) => {
                        const isCompleted = step.state === "completed" || (step.state === "current" && isEvalApproved);
                        const isCurrent = step.state === "current" && !isEvalApproved && !isEvalRejected;
                        const isUpcoming = step.state === "upcoming";
                        const isRejectedHere = step.state === "current" && isEvalRejected;

                        return (
                          <li key={step.id} className="relative flex gap-4 pl-1">
                            <div
                              className={`relative z-[1] mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 shadow-sm transition-colors ${isCompleted
                                ? "border-emerald-200 bg-emerald-500 text-white dark:border-emerald-800 dark:bg-emerald-600"
                                : isRejectedHere
                                  ? "border-rose-200 bg-rose-500 text-white dark:border-rose-800 dark:bg-rose-600"
                                  : isCurrent
                                    ? "border-indigo-300 bg-indigo-600 text-white ring-4 ring-indigo-500/20 dark:border-indigo-500 dark:bg-indigo-600 dark:ring-indigo-500/25"
                                    : "border-slate-200 bg-slate-100 text-slate-400 dark:border-slate-700 dark:bg-slate-800/80 dark:text-slate-500"
                                }`}
                            >
                              {isCompleted && <Check className="h-4 w-4 stroke-[3]" />}
                              {isRejectedHere && <AlertTriangle className="h-4 w-4 stroke-[3]" />}
                              {isCurrent && <Clock className="h-4 w-4" />}
                              {isUpcoming && <Circle className="h-4 w-4" />}
                            </div>

                            <div
                              className={`min-w-0 flex-1 rounded-2xl border p-4 transition-all ${isCompleted
                                ? "border-emerald-100 bg-emerald-50/40 dark:border-emerald-900/25 dark:bg-emerald-950/20"
                                : isRejectedHere
                                  ? "border-rose-100 bg-rose-50/40 dark:border-rose-900/25 dark:bg-rose-950/20"
                                  : isCurrent
                                    ? "border-indigo-200 bg-gradient-to-br from-indigo-50/90 to-white shadow-md dark:border-indigo-900/40 dark:from-indigo-950/30 dark:to-slate-950"
                                    : "border-slate-100 bg-slate-50/40 opacity-60 dark:border-slate-800 dark:bg-slate-900/20"
                                }`}
                            >
                              <div className="flex flex-wrap items-start justify-between gap-2">
                                <div>
                                  <p className="font-bold text-[10px] text-slate-400 uppercase tracking-wider dark:text-slate-500">
                                    Step {idx + 1} · {step.role}
                                  </p>
                                  <p className="mt-0.5 font-semibold text-slate-900 text-sm dark:text-slate-100">
                                    {step.state === "current" ? "You" : step.approverName}
                                  </p>
                                  {isCompleted && (step.approvedAt || isEvalApproved) && (
                                    <p className="mt-1 flex items-center gap-1 font-medium text-[11px] text-emerald-700 dark:text-emerald-400">
                                      <CheckCircle className="h-3 w-3 shrink-0" />
                                      Approved · {step.approvedAt || "Just now"}
                                    </p>
                                  )}
                                  {isRejectedHere && (
                                    <p className="mt-1 flex items-center gap-1 font-medium text-[11px] text-rose-700 dark:text-rose-400">
                                      <AlertTriangle className="h-3 w-3 shrink-0" />
                                      Rejected · Just now
                                    </p>
                                  )}
                                  {isUpcoming && (
                                    <p className="mt-1 font-medium text-[11px] text-slate-400 italic dark:text-slate-500">
                                      Awaiting earlier approvals
                                    </p>
                                  )}
                                </div>
                                {isCompleted && (
                                  <Badge className="shrink-0 border-0 bg-emerald-100 font-bold text-[10px] text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300">
                                    Done
                                  </Badge>
                                )}
                                {isRejectedHere && (
                                  <Badge className="shrink-0 border-0 bg-rose-100 font-bold text-[10px] text-rose-800 dark:bg-rose-900/40 dark:text-rose-300">
                                    Rejected
                                  </Badge>
                                )}
                                {isCurrent && (
                                  <Badge className="shrink-0 border-0 bg-indigo-100 font-bold text-[10px] text-indigo-800 dark:bg-indigo-900/40 dark:text-indigo-300">
                                    Your turn
                                  </Badge>
                                )}
                              </div>

                              {isCurrent && (
                                <Can
                                  permission="PROJECT_APPROVE"
                                  fallback={
                                    <div className="mt-4 flex rounded-xl border border-slate-100 bg-slate-50/50 p-4 dark:border-slate-800/80 dark:bg-slate-900/20">
                                      <p className="font-medium text-slate-500 text-xs italic">
                                        Awaiting authorized personnel. You do not have permission to approve or reject
                                        this evaluation step.
                                      </p>
                                    </div>
                                  }
                                >
                                  <div className="mt-4 flex flex-wrap gap-2 border-slate-100 border-t pt-4 dark:border-slate-800/80">
                                    <Button
                                      type="button"
                                      size="sm"
                                      className="h-9 min-w-[120px] flex-1 bg-emerald-600 font-semibold text-white shadow-sm hover:bg-emerald-700"
                                      onClick={() => setShowApproveDialog(true)}
                                    >
                                      <Check className="mr-1.5 h-4 w-4" />
                                      Approve
                                    </Button>
                                    <Button
                                      type="button"
                                      size="sm"
                                      variant="outline"
                                      className="h-9 min-w-[120px] flex-1 border-rose-200 font-semibold text-rose-700 hover:bg-rose-50 dark:border-rose-900/50 dark:text-rose-400 dark:hover:bg-rose-950/40"
                                      onClick={() => setShowTimelineReject(true)}
                                    >
                                      <AlertTriangle className="mr-1.5 h-4 w-4" />
                                      Reject
                                    </Button>
                                  </div>
                                </Can>
                              )}
                            </div>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                </div>
              )}
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
