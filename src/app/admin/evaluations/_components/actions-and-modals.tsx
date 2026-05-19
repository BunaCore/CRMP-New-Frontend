"use client";

import { GraduationCap, Search, ShieldCheck, UserCheck, XCircle } from "lucide-react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

import { useEvaluations } from "../evaluations-context";

export function ActionsAndModals() {
  const {
    showApproveDialog,
    setShowApproveDialog,
    totals,
    approveNote,
    setApproveNote,
    handleConfirmApproveEvaluation,
    activeProposal,
    activeProject,
    showAssign,
    setShowAssign,
    evalSearch,
    setEvalSearch,
    filteredEvals,
    pickedEvalIds,
    toggleEvalPick,
    handleAssignConfirm,
    isAssigningEvaluators,
    showAssignAdvisor,
    setShowAssignAdvisor,
    advisorSearch,
    setAdvisorSearch,
    filteredAdvisors,
    pickedAdvisorIds,
    toggleAdvisorPick,
    handleAssignAdvisorConfirm,
    showTimelineReject,
    setShowTimelineReject,
    timelineRejectComment,
    setTimelineRejectComment,
    handleTimelineRejectSubmit,
  } = useEvaluations();

  const title = activeProposal?.title || activeProject?.projectTitle;

  return (
    <>
      <Dialog open={showApproveDialog} onOpenChange={setShowApproveDialog}>
        <DialogContent className="gap-0 overflow-hidden p-0 sm:max-w-110">
          <DialogHeader className="border-slate-100 border-b px-6 pt-6 pb-4 dark:border-slate-800">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-emerald-100 p-2 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <DialogTitle className="font-bold text-base">Approve evaluation</DialogTitle>
            </div>
            <DialogDescription className="text-left text-slate-500 text-xs dark:text-slate-400">
              Confirm that scores and defence arrangements are correct. Optional note is stored with the approval.
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-3 px-6 py-4">
            <div className="rounded-lg border bg-slate-50 p-3 dark:border-slate-800 dark:bg-slate-900/50">
              <p className="font-bold text-[10px] text-slate-400 uppercase">Total</p>
              <p className="font-black text-indigo-700 text-xl tabular-nums dark:text-indigo-300">
                {totals.earned.toFixed(2)} / {totals.max}
              </p>
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="ap-note" className="font-semibold text-xs dark:text-slate-200">
                Optional note
              </Label>
              <Textarea
                id="ap-note"
                className="min-h-22 resize-none text-sm dark:border-slate-700 dark:bg-slate-950"
                placeholder="e.g. Approved after dean’s addendum received."
                value={approveNote}
                onChange={(e) => setApproveNote(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter className="border-slate-100 border-t px-6 py-4 dark:border-slate-800">
            <Button variant="outline" size="sm" onClick={() => setShowApproveDialog(false)}>
              Cancel
            </Button>
            <Button
              size="sm"
              className="bg-emerald-600 font-semibold text-white hover:bg-emerald-700"
              onClick={handleConfirmApproveEvaluation}
            >
              Confirm approval
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ASSIGN EVALUATOR DIALOG */}
      <Dialog open={showAssign} onOpenChange={setShowAssign}>
        <DialogContent className="gap-0 overflow-hidden p-0 sm:max-w-120">
          <DialogHeader className="border-slate-100 border-b px-6 pt-6 pb-4 dark:border-slate-800">
            <div className="mb-1 flex items-center gap-3">
              <div className="rounded-lg bg-blue-100 p-2 text-blue-600 dark:bg-blue-900/40 dark:text-blue-400">
                <UserCheck className="h-5 w-5" />
              </div>
              <DialogTitle className="font-bold text-base">Assign Evaluator</DialogTitle>
            </div>
            <DialogDescription className="ml-11 text-slate-500 text-xs">
              Select one or more evaluators from the faculty pool. All selected members will be notified.
            </DialogDescription>
            <div className="relative mt-3">
              <Search className="-translate-y-1/2 absolute top-1/2 left-3 h-4 w-4 text-slate-400" />
              <Input
                placeholder="Search evaluators by name or specialty..."
                className="h-9 border-slate-200 bg-slate-50 pl-9 text-sm dark:border-slate-800 dark:bg-slate-900"
                value={evalSearch}
                onChange={(e) => setEvalSearch(e.target.value)}
              />
            </div>
          </DialogHeader>

          <div className="flex max-h-80 flex-col gap-1.5 overflow-y-auto px-4 py-4">
            {filteredEvals.length === 0 && (
              <p className="rounded-lg border border-slate-200 border-dashed py-6 text-center text-slate-500 text-xs dark:border-slate-700 dark:text-slate-400">
                No users found. Try a different search term.
              </p>
            )}
            {filteredEvals.map((ev) => {
              const on = pickedEvalIds.includes(ev.id);
              return (
                <button
                  type="button"
                  key={ev.id}
                  onClick={() => toggleEvalPick(ev.id)}
                  className={`flex cursor-pointer items-center gap-3 rounded-xl border-2 p-3.5 text-left transition-colors ${
                    on
                      ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                      : "border-slate-100 bg-white hover:border-slate-300 dark:border-slate-800 dark:bg-slate-950 dark:hover:border-slate-700"
                  }`}
                >
                  {/* Visual-only checkbox indicator — not an interactive element */}
                  <div
                    aria-hidden
                    className={`flex h-4 w-4 shrink-0 items-center justify-center rounded border-2 transition-colors ${
                      on
                        ? "border-blue-500 bg-blue-500"
                        : "border-slate-300 bg-white dark:border-slate-600 dark:bg-slate-900"
                    }`}
                  >
                    {on && (
                      <svg className="h-2.5 w-2.5 text-white" viewBox="0 0 10 10" fill="none" aria-hidden="true">
                        <title>Selected</title>
                        <path
                          d="M1.5 5l2.5 2.5 4.5-4.5"
                          stroke="currentColor"
                          strokeWidth="1.8"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    )}
                  </div>
                  <Avatar className="h-9 w-9 shrink-0">
                    <AvatarFallback className={`font-bold text-[11px] ${ev.color}`}>{ev.avatar}</AvatarFallback>
                  </Avatar>
                  <div className="flex min-w-0 flex-1 flex-col">
                    <span className="truncate font-semibold text-[13px] text-slate-900 dark:text-slate-100">
                      {ev.name}
                    </span>
                    <span className="truncate font-medium text-[11px] text-slate-500">{ev.specialty}</span>
                  </div>
                  <span className="shrink-0 font-bold text-[10px] text-slate-400">ID linked</span>
                </button>
              );
            })}
          </div>

          <DialogFooter className="flex flex-col gap-2 border-slate-100 border-t px-6 py-4 sm:flex-row sm:items-center dark:border-slate-800">
            <p className="mr-auto font-medium text-slate-500 text-xs">{pickedEvalIds.length} selected</p>
            <Button variant="outline" size="sm" className="h-9" onClick={() => setShowAssign(false)}>
              Cancel
            </Button>
            <Button
              size="sm"
              className="h-9 flex-1 bg-blue-600 font-semibold text-white hover:bg-blue-700"
              disabled={pickedEvalIds.length === 0 || isAssigningEvaluators}
              onClick={handleAssignConfirm}
            >
              <UserCheck className="mr-1.5 h-4 w-4" />
              {isAssigningEvaluators ? "Saving..." : "Save evaluators"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ASSIGN ADVISOR DIALOG */}
      <Dialog open={showAssignAdvisor} onOpenChange={setShowAssignAdvisor}>
        <DialogContent className="gap-0 overflow-hidden p-0 sm:max-w-120">
          <DialogHeader className="border-slate-100 border-b px-6 pt-6 pb-4 dark:border-slate-800">
            <div className="mb-1 flex items-center gap-3">
              <div className="rounded-lg bg-violet-100 p-2 text-violet-600 dark:bg-violet-900/40 dark:text-violet-400">
                <GraduationCap className="h-5 w-5" />
              </div>
              <DialogTitle className="font-bold text-base">Assign Advisor</DialogTitle>
            </div>
            <DialogDescription className="ml-11 text-slate-500 text-xs">
              Select one research advisor to link into the system.
            </DialogDescription>
            <div className="relative mt-3">
              <Search className="-translate-y-1/2 absolute top-1/2 left-3 h-4 w-4 text-slate-400" />
              <Input
                placeholder="Search advisors by name or focus area..."
                className="h-9 border-slate-200 bg-slate-50 pl-9 text-sm dark:border-slate-800 dark:bg-slate-900"
                value={advisorSearch}
                onChange={(e) => setAdvisorSearch(e.target.value)}
              />
            </div>
          </DialogHeader>

          <div className="flex max-h-80 flex-col gap-1.5 overflow-y-auto px-4 py-4">
            {filteredAdvisors.map((ad) => {
              const on = pickedAdvisorIds.includes(ad.id);
              return (
                <button
                  type="button"
                  key={ad.id}
                  onClick={() => toggleAdvisorPick(ad.id)}
                  className={`flex cursor-pointer items-center gap-3 rounded-xl border-2 p-3.5 text-left transition-colors ${
                    on
                      ? "border-violet-500 bg-violet-50 dark:bg-violet-900/20"
                      : "border-slate-100 bg-white hover:border-slate-300 dark:border-slate-800 dark:bg-slate-950 dark:hover:border-slate-700"
                  }`}
                >
                  {/* Visual-only checkbox indicator — not an interactive element */}
                  <div
                    aria-hidden
                    className={`flex h-4 w-4 shrink-0 items-center justify-center rounded border-2 transition-colors ${
                      on
                        ? "border-violet-500 bg-violet-500"
                        : "border-slate-300 bg-white dark:border-slate-600 dark:bg-slate-900"
                    }`}
                  >
                    {on && (
                      <svg className="h-2.5 w-2.5 text-white" viewBox="0 0 10 10" fill="none" aria-hidden="true">
                        <title>Selected</title>
                        <path
                          d="M1.5 5l2.5 2.5 4.5-4.5"
                          stroke="currentColor"
                          strokeWidth="1.8"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    )}
                  </div>
                  <Avatar className="h-9 w-9 shrink-0">
                    <AvatarFallback className={`font-bold text-[11px] ${ad.color}`}>{ad.avatar}</AvatarFallback>
                  </Avatar>
                  <div className="flex min-w-0 flex-1 flex-col">
                    <span className="truncate font-semibold text-[13px] text-slate-900 dark:text-slate-100">
                      {ad.name}
                    </span>
                    <span className="truncate font-medium text-[11px] text-slate-500">{ad.specialty}</span>
                  </div>
                  <span className="shrink-0 font-bold text-[10px] text-slate-400">{ad.assigned} active</span>
                </button>
              );
            })}
          </div>

          <DialogFooter className="flex flex-col gap-2 border-slate-100 border-t px-6 py-4 sm:flex-row sm:items-center dark:border-slate-800">
            <p className="mr-auto font-medium text-slate-500 text-xs">{pickedAdvisorIds.length} selected</p>
            <Button variant="outline" size="sm" className="h-9" onClick={() => setShowAssignAdvisor(false)}>
              Cancel
            </Button>
            <Button
              size="sm"
              className="h-9 flex-1 bg-violet-600 font-semibold text-white hover:bg-violet-700"
              disabled={pickedAdvisorIds.length === 0}
              onClick={handleAssignAdvisorConfirm}
            >
              <GraduationCap className="mr-1.5 h-4 w-4" />
              Save advisor
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* REJECT DIALOG */}
      <Dialog open={showTimelineReject} onOpenChange={setShowTimelineReject}>
        <DialogContent className="gap-0 overflow-hidden p-0 sm:max-w-115">
          <DialogHeader className="border-slate-100 border-b px-6 pt-6 pb-4 dark:border-slate-800">
            <div className="mb-1 flex items-center gap-3">
              <div className="rounded-lg bg-rose-100 p-2 text-rose-600 dark:bg-rose-900/40 dark:text-rose-400">
                <XCircle className="h-5 w-5" />
              </div>
              <DialogTitle className="font-bold text-base">Reject at this step</DialogTitle>
            </div>
            <DialogDescription className="ml-11 text-slate-500 text-xs">
              Explain why the evaluation/proposal cannot proceed. The PI and prior reviewers will need this context.
            </DialogDescription>
          </DialogHeader>

          <div className="flex flex-col gap-4 px-6 py-5">
            <div className="rounded-lg border border-slate-100 bg-slate-50 p-3.5 dark:border-slate-800 dark:bg-slate-900/50">
              <p className="font-bold text-[10px] text-slate-400 uppercase tracking-wider">Title</p>
              <p className="mt-0.5 line-clamp-2 font-semibold text-[13px] text-slate-800 dark:text-slate-200">
                {title}
              </p>
            </div>
            <div className="flex flex-col gap-1.5">
              <Label
                htmlFor="timeline-reject-comment"
                className="font-semibold text-[12px] text-slate-700 dark:text-slate-300"
              >
                Reason for rejection <span className="text-rose-500">*</span>
              </Label>
              <Textarea
                id="timeline-reject-comment"
                placeholder="Be specific: which criteria failed, what evidence is missing, and what would be required to reconsider."
                className="min-h-35 resize-none rounded-lg bg-white text-sm focus-visible:ring-rose-400 dark:bg-slate-950"
                value={timelineRejectComment}
                onChange={(e) => setTimelineRejectComment(e.target.value)}
              />
              <p className="font-medium text-[10px] text-slate-400">{timelineRejectComment.length} / 1000 characters</p>
            </div>
          </div>

          <DialogFooter className="flex gap-2 border-slate-100 border-t px-6 py-4 dark:border-slate-800">
            <Button variant="outline" size="sm" className="h-9" onClick={() => setShowTimelineReject(false)}>
              Cancel
            </Button>
            <Button
              size="sm"
              className="h-9 flex-1 bg-rose-600 font-semibold text-white hover:bg-rose-700"
              disabled={timelineRejectComment.trim().length < 10}
              onClick={handleTimelineRejectSubmit}
            >
              <XCircle className="mr-1.5 h-4 w-4" />
              Confirm rejection
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
