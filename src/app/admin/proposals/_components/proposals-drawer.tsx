"use client";

import React from "react";
import { useProposals } from "../proposals-context";
import { STATUS_CFG, formatPeopleList } from "./proposals-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { UserCheck, GraduationCap, AlertTriangle, Calendar, Users, FileText, ChevronRight, Sparkles, Check, Clock, Circle, CheckCircle } from "lucide-react";
import { Can } from "@/access-control/permission-gates";
import { getApprovalChain } from "../_data/mock-proposals";

export function ProposalsDrawer() {
  const {
    selected, closeDrawer, drawerTab, setDrawerTab,
    setPickedEvalIds, setShowAssign,
    setPickedAdvisorIds, setShowAssignAdvisor,
    setShowTimelineApprove, setShowTimelineReject,
    filteredEvals, filteredAdvisors
  } = useProposals();

  const approvalChain = selected ? getApprovalChain(selected.id) : [];

  return (
    <Sheet open={!!selected} onOpenChange={(o) => !o && closeDrawer()}>
      <SheetContent className="flex w-full flex-col overflow-hidden border-l border-slate-200/80 bg-white p-0 shadow-2xl dark:border-slate-800 dark:bg-slate-950 sm:max-w-[800px] xl:max-w-[1000px]" side="right">
        {selected && (
          <>
            {/* Drawer Header */}
            <SheetHeader className="shrink-0 space-y-0 border-slate-100 border-b bg-gradient-to-b from-slate-50/90 to-white px-6 pt-6 pb-4 dark:border-slate-800 dark:from-slate-900/80 dark:to-slate-950">
              <div className="flex flex-col gap-2">
                <div className="flex flex-wrap items-center gap-2">
                  <Badge className="border-0 bg-slate-200/80 font-bold text-[10px] text-slate-700 uppercase dark:bg-slate-800 dark:text-slate-300">
                    {selected.id}
                  </Badge>
                  <Badge className={`${STATUS_CFG[selected.status].className} pointer-events-none flex items-center gap-1 border-0 font-bold text-[10px]`}>
                    {STATUS_CFG[selected.status].icon}{selected.status}
                  </Badge>
                  {selected.evaluators.slice(0, 2).map((name) => (
                    <Badge
                      key={name}
                      className="max-w-[140px] truncate border-0 bg-emerald-100 font-bold text-[10px] text-emerald-800 dark:bg-emerald-900/35 dark:text-emerald-300"
                      title={name}
                    >
                      <UserCheck className="h-3 w-3 shrink-0" /> {name}
                    </Badge>
                  ))}
                  {selected.evaluators.length > 2 && (
                    <Badge className="border-0 bg-emerald-50 font-bold text-[10px] text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400">
                      +{selected.evaluators.length - 2} evaluators
                    </Badge>
                  )}
                  {selected.advisors.slice(0, 2).map((name) => (
                    <Badge
                      key={name}
                      className="max-w-[140px] truncate border-0 bg-violet-100 font-bold text-[10px] text-violet-800 dark:bg-violet-900/35 dark:text-violet-300"
                      title={name}
                    >
                      <GraduationCap className="h-3 w-3 shrink-0" /> {name}
                    </Badge>
                  ))}
                  {selected.advisors.length > 2 && (
                    <Badge className="border-0 bg-violet-50 font-bold text-[10px] text-violet-700 dark:bg-violet-900/20 dark:text-violet-400">
                      +{selected.advisors.length - 2} advisors
                    </Badge>
                  )}
                </div>
                <SheetTitle className="pr-2 font-bold text-[16px] text-slate-900 leading-snug tracking-tight dark:text-slate-100">
                  {selected.title}
                </SheetTitle>
                <SheetDescription className="font-medium text-slate-500 text-xs leading-relaxed">
                  {selected.dept} · Submitted {selected.submittedDate} · Budget {selected.budget}
                </SheetDescription>
              </div>

              {/* Drawer Tab Nav */}
              <div className="mt-4 flex flex-wrap gap-1.5 rounded-xl bg-slate-100/80 p-1 dark:bg-slate-900/60">
                {([
                  { id: "details" as const, label: "Details" },
                  { id: "team" as const, label: "Team" },
                  { id: "approve" as const, label: "Approve" },
                ]).map((t) => (
                  <button
                    type="button"
                    key={t.id}
                    onClick={() => setDrawerTab(t.id)}
                    className={`rounded-lg px-4 py-2 font-semibold text-xs transition-all ${drawerTab === t.id
                        ? "bg-white text-blue-700 shadow-sm dark:bg-slate-800 dark:text-blue-400"
                        : "text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200"
                      }`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            </SheetHeader>

            {/* Drawer Body */}
            <div className="flex flex-1 flex-col gap-6 overflow-y-auto px-6 py-6 sm:px-8 sm:py-7">

              {/* ── TAB: DETAILS ── */}
              {drawerTab === "details" && (
                <>
                  {selected.status === "Revision" && (
                    <div className="flex items-start gap-3 rounded-xl border border-rose-200 bg-rose-50 p-4 dark:border-rose-900/30 dark:bg-rose-900/10">
                      <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-rose-600 dark:text-rose-400" />
                      <div>
                        <p className="font-bold text-rose-800 text-sm dark:text-rose-300">Returned for Revision</p>
                        <p className="mt-0.5 text-rose-600 text-xs dark:text-rose-400">{selected.lastAction}</p>
                      </div>
                    </div>
                  )}

                  {/* Key Stats */}
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <div className="rounded-lg border border-slate-100 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-900/50">
                      <p className="mb-1.5 font-bold text-[10px] text-slate-400 uppercase tracking-wider">Principal Investigator</p>
                      <div className="flex items-center gap-2">
                        <Avatar className="h-7 w-7">
                          <AvatarFallback className={`font-bold text-[10px] ${selected.piColor}`}>{selected.piAvatar}</AvatarFallback>
                        </Avatar>
                        <span className="truncate font-semibold text-[13px] text-slate-800 dark:text-slate-200">{selected.pi}</span>
                      </div>
                    </div>
                    <div className="rounded-lg border border-slate-100 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-900/50">
                      <p className="mb-1.5 font-bold text-[10px] text-slate-400 uppercase tracking-wider">Budget Requested</p>
                      <p className="font-extrabold text-blue-600 text-xl dark:text-blue-400">{selected.budget}</p>
                    </div>
                    <div className="rounded-lg border border-slate-100 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-900/50">
                      <p className="mb-1.5 font-bold text-[10px] text-slate-400 uppercase tracking-wider">Date Submitted</p>
                      <p className="flex items-center gap-1.5 font-semibold text-[13px] text-slate-800 dark:text-slate-200">
                        <Calendar className="h-3.5 w-3.5 text-slate-400" />{selected.submittedDate}
                      </p>
                    </div>
                    <div className="rounded-lg border border-slate-100 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-900/50">
                      <p className="mb-1.5 font-bold text-[10px] text-slate-400 uppercase tracking-wider">Team Size</p>
                      <p className="flex items-center gap-1.5 font-semibold text-[13px] text-slate-800 dark:text-slate-200">
                        <Users className="h-3.5 w-3.5 text-slate-400" />{selected.teamCount} members
                      </p>
                    </div>
                  </div>

                  {/* Abstract */}
                  <div>
                    <h4 className="mb-2.5 flex items-center gap-2 font-bold text-[11px] text-slate-500 uppercase tracking-wider">
                      <FileText className="h-3.5 w-3.5" /> Abstract
                    </h4>
                    <p className="rounded-lg border border-slate-100 bg-slate-50 p-4 text-[13px] text-slate-600 leading-relaxed dark:border-slate-800 dark:bg-slate-900/30 dark:text-slate-400">
                      {selected.abstract}
                    </p>
                  </div>

                  {/* Admin Workflow Actions */}
                  <div>
                    <h4 className="mb-3 font-bold text-[11px] text-slate-500 uppercase tracking-wider">Workflow Actions</h4>
                    <div className="grid grid-cols-1 gap-2.5 lg:grid-cols-2">
                      {/* Assign Evaluators */}
                      <Can permission="EVALUATOR_ASSIGN">
                        {(selected.status === "Submitted" || selected.status === "Under Review") && (
                          <button
                            type="button"
                            onClick={() => {
                              const pre = filteredEvals.filter((e) =>
                                selected.evaluators.includes(e.name)
                              ).map((e) => e.id);
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
                                {selected.evaluators.length
                                  ? `${selected.evaluators.length} assigned: ${formatPeopleList(selected.evaluators, 3)}`
                                  : "No evaluators assigned"}
                              </p>
                            </div>
                            <ChevronRight className="ml-auto h-4 w-4 shrink-0 opacity-40 transition-opacity group-hover:opacity-100" />
                          </button>
                        )}
                      </Can>

                      {/* Assign Advisor */}
                      <Can permission="ADVISOR_ASSIGN">
                        {(selected.status === "Submitted" || selected.status === "Under Review") && (
                          <button
                            type="button"
                            onClick={() => {
                              const pre = filteredAdvisors.filter((a) =>
                                selected.advisors.includes(a.name)
                              ).map((a) => a.id);
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
                                {selected.advisors.length
                                  ? `${selected.advisors.length} assigned: ${formatPeopleList(selected.advisors, 3)}`
                                  : "No advisors assigned"}
                              </p>
                            </div>
                            <ChevronRight className="ml-auto h-4 w-4 shrink-0 opacity-40 transition-opacity group-hover:opacity-100" />
                          </button>
                        )}
                      </Can>
                    </div>
                  </div>
                </>
              )}

              {/* ── TAB: TEAM ── */}
              {drawerTab === "team" && (
                <div className="flex flex-col gap-3">
                  <h4 className="flex items-center gap-2 font-bold text-[11px] text-slate-500 uppercase tracking-wider">
                    <Users className="h-3.5 w-3.5" /> Research Team
                  </h4>
                  <div className="flex items-center gap-4 rounded-lg border border-blue-100 bg-blue-50/50 p-3.5 dark:border-blue-900/30 dark:bg-blue-900/10">
                    <Avatar className="h-10 w-10 border-2 border-blue-200 dark:border-blue-800">
                      <AvatarFallback className={`font-bold text-xs ${selected.piColor}`}>{selected.piAvatar}</AvatarFallback>
                    </Avatar>
                    <div className="flex min-w-0 flex-col">
                      <span className="font-bold text-slate-900 text-sm dark:text-slate-100">{selected.pi}</span>
                      <span className="font-semibold text-blue-600 text-xs dark:text-blue-400">Principal Investigator</span>
                    </div>
                    <Badge className="ml-auto shrink-0 border-0 bg-blue-600 text-[10px] text-white">PI</Badge>
                  </div>
                  <p className="rounded-lg border border-slate-200 border-dashed py-6 text-center text-slate-400 text-xs italic dark:border-slate-700">
                    Full team details will appear here once connected to the backend.
                  </p>
                </div>
              )}

              {/* ── TAB: APPROVE (timeline) ── */}
              {drawerTab === "approve" && (
                <div className="flex flex-col gap-6">
                  <div className="flex flex-col gap-1 rounded-2xl border border-slate-200/80 bg-gradient-to-br from-slate-50 to-white p-4 dark:border-slate-800 dark:from-slate-900/50 dark:to-slate-950">
                    <div className="flex items-center gap-2">
                      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-600/10 text-blue-600 dark:bg-blue-500/15 dark:text-blue-400">
                        <Sparkles className="h-4 w-4" />
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-900 text-sm dark:text-slate-100">Approval chain</h4>
                        <p className="font-medium text-[11px] text-slate-500 dark:text-slate-400">
                          Completed steps show prior approvals. Your step is where you approve or reject. Later steps stay inactive.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="relative">
                    <div className="absolute top-3 bottom-3 left-[19px] w-px bg-gradient-to-b from-emerald-200 via-blue-200 to-slate-200 dark:from-emerald-900/40 dark:via-blue-900/40 dark:to-slate-800" aria-hidden />

                    <ul className="relative flex flex-col gap-4">
                      {approvalChain.map((step, idx) => {
                        const isCompleted = step.state === "completed";
                        const isCurrent = step.state === "current";
                        const isUpcoming = step.state === "upcoming";

                        return (
                          <li key={step.id} className="relative flex gap-4 pl-1">
                            <div
                              className={`relative z-[1] mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 shadow-sm transition-colors ${isCompleted
                                  ? "border-emerald-200 bg-emerald-500 text-white dark:border-emerald-800 dark:bg-emerald-600"
                                  : isCurrent
                                    ? "border-blue-300 bg-blue-600 text-white ring-4 ring-blue-500/20 dark:border-blue-500 dark:bg-blue-600 dark:ring-blue-500/25"
                                    : "border-slate-200 bg-slate-100 text-slate-400 dark:border-slate-700 dark:bg-slate-800/80 dark:text-slate-500"
                                }`}
                            >
                              {isCompleted && <Check className="h-4 w-4 stroke-[3]" />}
                              {isCurrent && <Clock className="h-4 w-4" />}
                              {isUpcoming && <Circle className="h-4 w-4" />}
                            </div>

                            <div
                              className={`min-w-0 flex-1 rounded-2xl border p-4 transition-all ${isCompleted
                                  ? "border-emerald-100 bg-emerald-50/40 dark:border-emerald-900/25 dark:bg-emerald-950/20"
                                  : isCurrent
                                    ? "border-blue-200 bg-gradient-to-br from-blue-50/90 to-white shadow-md dark:border-blue-900/40 dark:from-blue-950/30 dark:to-slate-950"
                                    : "border-slate-100 bg-slate-50/40 opacity-60 dark:border-slate-800 dark:bg-slate-900/20"
                                }`}
                            >
                              <div className="flex flex-wrap items-start justify-between gap-2">
                                <div>
                                  <p className="font-bold text-[10px] text-slate-400 uppercase tracking-wider dark:text-slate-500">
                                    Step {idx + 1} · {step.role}
                                  </p>
                                  <p className="mt-0.5 font-semibold text-slate-900 text-sm dark:text-slate-100">
                                    {isCurrent ? "You" : step.approverName}
                                  </p>
                                  {isCompleted && step.approvedAt && (
                                    <p className="mt-1 flex items-center gap-1 font-medium text-[11px] text-emerald-700 dark:text-emerald-400">
                                      <CheckCircle className="h-3 w-3 shrink-0" />
                                      Approved · {step.approvedAt}
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
                                {isCurrent && (
                                  <Badge className="shrink-0 border-0 bg-blue-100 font-bold text-[10px] text-blue-800 dark:bg-blue-900/40 dark:text-blue-300">
                                    Your turn
                                  </Badge>
                                )}
                              </div>

                              {isCurrent && (
                                <Can
                                  permission="PROJECT_APPROVE"
                                  fallback={
                                    <div className="mt-4 flex rounded-xl border border-slate-100 bg-slate-50/50 p-4 dark:border-slate-800/80 dark:bg-slate-900/20">
                                      <p className="font-medium text-xs text-slate-500 italic">
                                        Awaiting authorized personnel. You do not have permission to approve or reject this proposal step.
                                      </p>
                                    </div>
                                  }
                                >
                                  <div className="mt-4 flex flex-wrap gap-2 border-slate-100 border-t pt-4 dark:border-slate-800/80">
                                    <Button
                                      type="button"
                                      size="sm"
                                      className="h-9 flex-1 min-w-[120px] bg-emerald-600 font-semibold text-white shadow-sm hover:bg-emerald-700"
                                      onClick={() => setShowTimelineApprove(true)}
                                    >
                                      <Check className="mr-1.5 h-4 w-4" />
                                      Approve
                                    </Button>
                                    <Button
                                      type="button"
                                      size="sm"
                                      variant="outline"
                                      className="h-9 flex-1 min-w-[120px] border-rose-200 font-semibold text-rose-700 hover:bg-rose-50 dark:border-rose-900/50 dark:text-rose-400 dark:hover:bg-rose-950/40"
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
