"use client";

import React from "react";
import { useProposals } from "../proposals-context";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { UserCheck, GraduationCap, Check, XCircle, Search } from "lucide-react";

export function ActionsAndModals() {
  const {
    selected,
    showAssign, setShowAssign, evalSearch, setEvalSearch, filteredEvals, pickedEvalIds, toggleEvalPick, handleAssignConfirm,
    showAssignAdvisor, setShowAssignAdvisor, advisorSearch, setAdvisorSearch, filteredAdvisors, pickedAdvisorIds, toggleAdvisorPick, handleAssignAdvisorConfirm,
    showTimelineApprove, setShowTimelineApprove, timelineApproveNote, setTimelineApproveNote, handleTimelineApproveSubmit,
    showTimelineReject, setShowTimelineReject, timelineRejectComment, setTimelineRejectComment, handleTimelineRejectSubmit
  } = useProposals();

  return (
    <>
      {/* ═══════════════════════════════════════════════
           ASSIGN EVALUATOR DIALOG
         ═══════════════════════════════════════════════ */}
      <Dialog open={showAssign} onOpenChange={setShowAssign}>
        <DialogContent className="gap-0 overflow-hidden p-0 sm:max-w-[480px]">
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

          <div className="flex max-h-[320px] flex-col gap-1.5 overflow-y-auto px-4 py-4">
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
                  <Checkbox checked={on} className="pointer-events-none shrink-0" aria-hidden />
                  <Avatar className="h-9 w-9 shrink-0">
                    <AvatarFallback className={`font-bold text-[11px] ${ev.color}`}>{ev.avatar}</AvatarFallback>
                  </Avatar>
                  <div className="flex min-w-0 flex-1 flex-col">
                    <span className="truncate font-semibold text-[13px] text-slate-900 dark:text-slate-100">{ev.name}</span>
                    <span className="truncate font-medium text-[11px] text-slate-500">{ev.specialty}</span>
                  </div>
                  <span className="shrink-0 font-bold text-[10px] text-slate-400">{ev.assigned} pool</span>
                </button>
              );
            })}
          </div>

          <DialogFooter className="flex flex-col gap-2 border-slate-100 border-t px-6 py-4 sm:flex-row sm:items-center dark:border-slate-800">
            <p className="mr-auto font-medium text-slate-500 text-xs">
              {pickedEvalIds.length} selected
            </p>
            <Button variant="outline" size="sm" className="h-9" onClick={() => setShowAssign(false)}>Cancel</Button>
            <Button
              size="sm"
              className="h-9 flex-1 bg-blue-600 font-semibold text-white hover:bg-blue-700"
              disabled={pickedEvalIds.length === 0}
              onClick={handleAssignConfirm}
            >
              <UserCheck className="mr-1.5 h-4 w-4" />
              Save evaluators
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ═══════════════════════════════════════════════
           ASSIGN ADVISOR DIALOG
         ═══════════════════════════════════════════════ */}
      <Dialog open={showAssignAdvisor} onOpenChange={setShowAssignAdvisor}>
        <DialogContent className="gap-0 overflow-hidden p-0 sm:max-w-[480px]">
          <DialogHeader className="border-slate-100 border-b px-6 pt-6 pb-4 dark:border-slate-800">
            <div className="mb-1 flex items-center gap-3">
              <div className="rounded-lg bg-violet-100 p-2 text-violet-600 dark:bg-violet-900/40 dark:text-violet-400">
                <GraduationCap className="h-5 w-5" />
              </div>
              <DialogTitle className="font-bold text-base">Assign Advisor</DialogTitle>
            </div>
            <DialogDescription className="ml-11 text-slate-500 text-xs">
              Select one or more research advisors. All selected advisors will be linked to this proposal.
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

          <div className="flex max-h-[320px] flex-col gap-1.5 overflow-y-auto px-4 py-4">
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
                  <Checkbox checked={on} className="pointer-events-none shrink-0" aria-hidden />
                  <Avatar className="h-9 w-9 shrink-0">
                    <AvatarFallback className={`font-bold text-[11px] ${ad.color}`}>{ad.avatar}</AvatarFallback>
                  </Avatar>
                  <div className="flex min-w-0 flex-1 flex-col">
                    <span className="truncate font-semibold text-[13px] text-slate-900 dark:text-slate-100">{ad.name}</span>
                    <span className="truncate font-medium text-[11px] text-slate-500">{ad.specialty}</span>
                  </div>
                  <span className="shrink-0 font-bold text-[10px] text-slate-400">{ad.assigned} active</span>
                </button>
              );
            })}
          </div>

          <DialogFooter className="flex flex-col gap-2 border-slate-100 border-t px-6 py-4 sm:flex-row sm:items-center dark:border-slate-800">
            <p className="mr-auto font-medium text-slate-500 text-xs">
              {pickedAdvisorIds.length} selected
            </p>
            <Button variant="outline" size="sm" className="h-9" onClick={() => setShowAssignAdvisor(false)}>Cancel</Button>
            <Button
              size="sm"
              className="h-9 flex-1 bg-violet-600 font-semibold text-white hover:bg-violet-700"
              disabled={pickedAdvisorIds.length === 0}
              onClick={handleAssignAdvisorConfirm}
            >
              <GraduationCap className="mr-1.5 h-4 w-4" />
              Save advisors
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ═══════════════════════════════════════════════
           APPROVE (timeline) — confirm dialog
         ═══════════════════════════════════════════════ */}
      <Dialog open={showTimelineApprove} onOpenChange={setShowTimelineApprove}>
        <DialogContent className="gap-0 overflow-hidden p-0 sm:max-w-[460px]">
          <DialogHeader className="border-slate-100 border-b px-6 pt-6 pb-4 dark:border-slate-800">
            <div className="mb-1 flex items-center gap-3">
              <div className="rounded-lg bg-emerald-100 p-2 text-emerald-600 dark:bg-emerald-900/40 dark:text-emerald-400">
                <Check className="h-5 w-5" />
              </div>
              <DialogTitle className="font-bold text-base">Confirm approval</DialogTitle>
            </div>
            <DialogDescription className="ml-11 text-slate-500 text-xs">
              Your approval will advance this proposal to the next step in the chain. Add an optional note for the record.
            </DialogDescription>
          </DialogHeader>

          <div className="flex flex-col gap-4 px-6 py-5">
            <div className="rounded-lg border border-slate-100 bg-slate-50 p-3.5 dark:border-slate-800 dark:bg-slate-900/50">
              <p className="font-bold text-[10px] text-slate-400 uppercase tracking-wider">Proposal</p>
              <p className="mt-0.5 line-clamp-2 font-semibold text-[13px] text-slate-800 dark:text-slate-200">{selected?.title}</p>
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="timeline-approve-note" className="font-semibold text-[12px] text-slate-700 dark:text-slate-300">
                Optional note
              </Label>
              <Textarea
                id="timeline-approve-note"
                placeholder="e.g. Budget and methodology are satisfactory at this stage."
                className="min-h-[100px] resize-none rounded-lg bg-white text-sm focus-visible:ring-emerald-400 dark:bg-slate-950"
                value={timelineApproveNote}
                onChange={(e) => setTimelineApproveNote(e.target.value)}
              />
            </div>
          </div>

          <DialogFooter className="flex gap-2 border-slate-100 border-t px-6 py-4 dark:border-slate-800">
            <Button variant="outline" size="sm" className="h-9" onClick={() => setShowTimelineApprove(false)}>Cancel</Button>
            <Button
              size="sm"
              className="h-9 flex-1 bg-emerald-600 font-semibold text-white hover:bg-emerald-700"
              onClick={handleTimelineApproveSubmit}
            >
              <Check className="mr-1.5 h-4 w-4" />
              Confirm approval
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ═══════════════════════════════════════════════
           REJECT (timeline) — same pattern as Return for Revision
         ═══════════════════════════════════════════════ */}
      <Dialog open={showTimelineReject} onOpenChange={setShowTimelineReject}>
        <DialogContent className="gap-0 overflow-hidden p-0 sm:max-w-[460px]">
          <DialogHeader className="border-slate-100 border-b px-6 pt-6 pb-4 dark:border-slate-800">
            <div className="mb-1 flex items-center gap-3">
              <div className="rounded-lg bg-rose-100 p-2 text-rose-600 dark:bg-rose-900/40 dark:text-rose-400">
                <XCircle className="h-5 w-5" />
              </div>
              <DialogTitle className="font-bold text-base">Reject at this step</DialogTitle>
            </div>
            <DialogDescription className="ml-11 text-slate-500 text-xs">
              Explain why the proposal cannot proceed. The PI and prior reviewers will need this context.
            </DialogDescription>
          </DialogHeader>

          <div className="flex flex-col gap-4 px-6 py-5">
            <div className="rounded-lg border border-slate-100 bg-slate-50 p-3.5 dark:border-slate-800 dark:bg-slate-900/50">
              <p className="font-bold text-[10px] text-slate-400 uppercase tracking-wider">Proposal</p>
              <p className="mt-0.5 line-clamp-2 font-semibold text-[13px] text-slate-800 dark:text-slate-200">{selected?.title}</p>
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="timeline-reject-comment" className="font-semibold text-[12px] text-slate-700 dark:text-slate-300">
                Reason for rejection <span className="text-rose-500">*</span>
              </Label>
              <Textarea
                id="timeline-reject-comment"
                placeholder="Be specific: which criteria failed, what evidence is missing, and what would be required to reconsider."
                className="min-h-[140px] resize-none rounded-lg bg-white text-sm focus-visible:ring-rose-400 dark:bg-slate-950"
                value={timelineRejectComment}
                onChange={(e) => setTimelineRejectComment(e.target.value)}
              />
              <p className="font-medium text-[10px] text-slate-400">{timelineRejectComment.length} / 1000 characters</p>
            </div>
          </div>

          <DialogFooter className="flex gap-2 border-slate-100 border-t px-6 py-4 dark:border-slate-800">
            <Button variant="outline" size="sm" className="h-9" onClick={() => setShowTimelineReject(false)}>Cancel</Button>
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
