"use client";

import { useEffect, useState } from "react";

import {
  AlertTriangle,
  Banknote,
  Calendar,
  Check,
  FileText,
  GraduationCap,
  UserCheck,
  Users,
  XCircle,
} from "lucide-react";

import { Can } from "@/access-control/permission-gates";
import { EditableProposalView } from "@/app/(main)/proposals/_components/editable-proposal-view";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Textarea } from "@/components/ui/textarea";
import { submitStepAction } from "@/lib/api/proposals/mutations";
import { getAdminProposalDetails } from "@/lib/api/proposals/queries";
import type { AdminProposalDetail, ResearcherProposal } from "@/lib/api/proposals/types";

import { useProposals } from "../proposals-context";
import { STATUS_CFG } from "./proposals-table";
import { TimelineTab } from "./timeline-tab";

export function ProposalsDrawer() {
  const {
    selected,
    closeDrawer,
    drawerTab,
    setDrawerTab,
    showTimelineApprove,
    setShowTimelineApprove,
    timelineApproveNote,
    setTimelineApproveNote,
    handleTimelineApproveSubmit,
    showTimelineReject,
    setShowTimelineReject,
    timelineRejectComment,
    setTimelineRejectComment,
    handleTimelineRejectSubmit,
  } = useProposals();

  const [details, setDetails] = useState<AdminProposalDetail | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (selected) {
      setIsLoading(true);
      getAdminProposalDetails(selected.id)
        .then(setDetails)
        .catch(console.error)
        .finally(() => setIsLoading(false));
    } else {
      setDetails(null);
    }
  }, [selected]);

  const onConfirmApprove = async () => {
    if (!selected) return;
    try {
      await submitStepAction(selected.id, {
        decision: "Accepted",
        comment: timelineApproveNote,
      });
      handleTimelineApproveSubmit();
    } catch (e) {
      console.error(e);
    }
  };

  const onConfirmReject = async () => {
    if (!selected || timelineRejectComment.trim().length < 10) return;
    try {
      await submitStepAction(selected.id, {
        decision: "Rejected",
        comment: timelineRejectComment,
      });
      handleTimelineRejectSubmit();
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <Sheet open={!!selected} onOpenChange={(o) => !o && closeDrawer()}>
      <SheetContent
        className="flex w-full flex-col overflow-hidden border-slate-200/80 border-l bg-white p-0 shadow-2xl sm:max-w-200 xl:max-w-250 dark:border-slate-800 dark:bg-slate-950"
        side="right"
      >
        {selected && isLoading && (
          <div className="flex flex-1 items-center justify-center p-12 text-slate-400">
            Fetching full proposal details...
          </div>
        )}
        {selected && !isLoading && details && (
          <>
            {/* Drawer Header */}
            <SheetHeader className="shrink-0 space-y-0 border-slate-100 border-b bg-linear-to-b from-slate-50/90 to-white px-6 pt-6 pb-4 dark:border-slate-800 dark:from-slate-900/80 dark:to-slate-950">
              <div className="flex flex-col gap-2">
                <div className="flex flex-wrap items-center gap-2">
                  <Badge className="border-0 bg-slate-200/80 font-bold text-[10px] text-slate-700 uppercase dark:bg-slate-800 dark:text-slate-300">
                    {selected.id}
                  </Badge>
                  <Badge
                    className={`${STATUS_CFG[details.status.toString()]?.className || "bg-blue-100 text-blue-700"} pointer-events-none flex items-center gap-1 border-0 font-bold text-[10px]`}
                  >
                    {STATUS_CFG[details.status.toString()]?.icon}
                    {details.status.toString().replace("_", " ")}
                  </Badge>
                  {details.evaluators?.slice(0, 2).map((evaluator) => (
                    <Badge
                      key={evaluator.id}
                      className="max-w-35 truncate border-0 bg-emerald-100 font-bold text-[10px] text-emerald-800 dark:bg-emerald-900/35 dark:text-emerald-300"
                      title={evaluator.name}
                    >
                      <UserCheck className="h-3 w-3 shrink-0" /> {evaluator.name}
                    </Badge>
                  ))}
                  {(details.evaluators?.length ?? 0) > 2 && (
                    <Badge className="border-0 bg-emerald-50 font-bold text-[10px] text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400">
                      +{details.evaluators.length - 2} evaluators
                    </Badge>
                  )}
                  {details.advisors?.slice(0, 2).map((advisor) => (
                    <Badge
                      key={advisor.id}
                      className="max-w-35 truncate border-0 bg-violet-100 font-bold text-[10px] text-violet-800 dark:bg-violet-900/35 dark:text-violet-300"
                      title={advisor.name}
                    >
                      <GraduationCap className="h-3 w-3 shrink-0" /> {advisor.name}
                    </Badge>
                  ))}
                  {(details.advisors?.length ?? 0) > 2 && (
                    <Badge className="border-0 bg-violet-50 font-bold text-[10px] text-violet-700 dark:bg-violet-900/20 dark:text-violet-400">
                      +{details.advisors.length - 2} advisors
                    </Badge>
                  )}
                </div>
                <SheetTitle className="pr-2 font-bold text-[16px] text-slate-900 leading-snug tracking-tight dark:text-slate-100">
                  {details.title}
                </SheetTitle>
                <SheetDescription className="font-medium text-slate-500 text-xs leading-relaxed">
                  {details.department?.name} · Date {details.createdAt.split("T")[0]} · Budget{" "}
                  {new Intl.NumberFormat("en-US", {
                    style: "currency",
                    currency: "USD",
                  }).format(details.budget.total)}
                </SheetDescription>
              </div>

              {/* Drawer Tab Nav */}
              <div className="mt-4 flex flex-wrap gap-1.5 rounded-xl bg-slate-100/80 p-1 dark:bg-slate-900/60">
                {[
                  { id: "details" as const, label: "Details" },
                  { id: "team" as const, label: "Team" },
                  { id: "budget" as const, label: "Budget" },
                  { id: "approve" as const, label: "Approve" },
                ].map((t) => (
                  <button
                    type="button"
                    key={t.id}
                    onClick={() => setDrawerTab(t.id)}
                    className={`rounded-lg px-4 py-2 font-semibold text-xs transition-all ${
                      drawerTab === t.id
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
                  {"currentStatus" in selected && selected.currentStatus === "Revision" && (
                    <div className="flex items-start gap-3 rounded-xl border border-rose-200 bg-rose-50 p-4 dark:border-rose-900/30 dark:bg-rose-900/10">
                      <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-rose-600 dark:text-rose-400" />
                      <div>
                        <p className="font-bold text-rose-800 text-sm dark:text-rose-300">Returned for Revision</p>
                        <p className="mt-0.5 text-rose-600 text-xs dark:text-rose-400">
                          Please review the timeline or comments for revision notes.
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Key Stats */}
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <div className="rounded-lg border border-slate-100 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-900/50">
                      <p className="mb-1.5 font-bold text-[10px] text-slate-400 uppercase tracking-wider">
                        Principal Investigator
                      </p>
                      <div className="flex items-center gap-2">
                        <Avatar className="h-7 w-7">
                          <AvatarFallback className="bg-blue-100 font-bold text-[10px] text-blue-700">
                            {details.pi.name.slice(0, 2).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <span className="truncate font-semibold text-[13px] text-slate-800 dark:text-slate-200">
                          {details.pi.name}
                        </span>
                      </div>
                    </div>
                    <div className="rounded-lg border border-slate-100 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-900/50">
                      <p className="mb-1.5 font-bold text-[10px] text-slate-400 uppercase tracking-wider">
                        Budget Requested
                      </p>
                      <p className="font-extrabold text-blue-600 text-xl dark:text-blue-400">
                        {new Intl.NumberFormat("en-US", {
                          style: "currency",
                          currency: "USD",
                        }).format(details.budget.total)}
                      </p>
                    </div>
                    <div className="rounded-lg border border-slate-100 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-900/50">
                      <p className="mb-1.5 font-bold text-[10px] text-slate-400 uppercase tracking-wider">
                        Date Submitted
                      </p>
                      <p className="flex items-center gap-1.5 font-semibold text-[13px] text-slate-800 dark:text-slate-200">
                        <Calendar className="h-3.5 w-3.5 text-slate-400" />
                        {details.createdAt.split("T")[0]}
                      </p>
                    </div>
                    <div className="rounded-lg border border-slate-100 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-900/50">
                      <p className="mb-1.5 font-bold text-[10px] text-slate-400 uppercase tracking-wider">Team Size</p>
                      <p className="flex items-center gap-1.5 font-semibold text-[13px] text-slate-800 dark:text-slate-200">
                        <Users className="h-3.5 w-3.5 text-slate-400" />
                        {details.team.length + 1} members
                      </p>
                    </div>
                  </div>

                  {/* Only show abstract if exists in backend details, else fallback to pending Approval abstract */}
                  {details.isEditable ? (
                    <EditableProposalView
                      proposal={{
                        id: details.id,
                        title: details.title,
                        abstract: details.abstract ?? selected.abstract,
                        researchArea: details.researchArea,
                        type: details.type,
                        status: details.status as any,
                        isEditable: details.isEditable,
                        department: details.department,
                        pi: details.pi,
                        advisors: details.advisors,
                        evaluators: details.evaluators,
                        team: details.team,
                        workflow: details.workflow,
                        comments: details.comments,
                        defenceSchedules: details.defenceSchedules,
                        file: details.file,
                        createdAt: details.createdAt,
                      }}
                      onUpdate={(up: ResearcherProposal) => setDetails((d) => (d ? { ...d, ...up } : d))}
                    />
                  ) : (
                    selected.abstract && (
                      <div>
                        <h4 className="mb-2.5 flex items-center gap-2 font-bold text-[11px] text-slate-500 uppercase tracking-wider">
                          <FileText className="h-3.5 w-3.5" /> Abstract
                        </h4>
                        <p className="rounded-lg border border-slate-100 bg-slate-50 p-4 text-[13px] text-slate-600 leading-relaxed dark:border-slate-800 dark:bg-slate-900/30 dark:text-slate-400">
                          {selected.abstract}
                        </p>
                      </div>
                    )
                  )}
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
                      <AvatarFallback className="bg-blue-100 font-bold text-blue-700 text-xs">
                        {details.pi.name.slice(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex min-w-0 flex-col">
                      <span className="font-bold text-slate-900 text-sm dark:text-slate-100">{details.pi.name}</span>
                      <span className="font-semibold text-blue-600 text-xs dark:text-blue-400">
                        Principal Investigator
                      </span>
                    </div>
                    <Badge className="ml-auto shrink-0 border-0 bg-blue-600 text-[10px] text-white">PI</Badge>
                  </div>
                  {details.team.map((member) => (
                    <div
                      key={member.id}
                      className="flex items-center gap-4 rounded-lg border border-slate-200 bg-white p-3.5 dark:border-slate-800 dark:bg-slate-950"
                    >
                      <Avatar className="h-10 w-10">
                        <AvatarFallback className="bg-slate-100 font-bold text-slate-600 text-xs">
                          {member.name.slice(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex min-w-0 flex-col">
                        <span className="font-bold text-slate-900 text-sm dark:text-slate-100">{member.name}</span>
                        <span className="font-medium text-slate-500 text-xs">Member</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* ── TAB: BUDGET ── */}
              {drawerTab === "budget" && (
                <Can
                  permission="BUDGET_VIEW"
                  fallback={
                    <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-rose-100 bg-rose-50/50 p-8 text-center dark:border-rose-900/40 dark:bg-rose-950/20">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-rose-100 text-rose-600 dark:bg-rose-900/40 dark:text-rose-400">
                        <AlertTriangle className="h-6 w-6" />
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-900 text-sm dark:text-slate-100">Access Denied</h4>
                        <p className="mt-1 max-w-70 text-slate-500 text-xs dark:text-slate-400">
                          You do not have the required permissions to view the financial breakdown of this proposal.
                        </p>
                      </div>
                    </div>
                  }
                >
                  <div className="flex flex-col gap-6">
                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                      <div className="flex flex-col justify-center rounded-xl border border-slate-200/80 bg-linear-to-br from-slate-50 to-white p-4 shadow-sm dark:border-slate-800 dark:from-slate-900/50 dark:to-slate-950">
                        <p className="mb-1 flex items-center gap-1.5 font-bold text-[10px] text-slate-500 uppercase tracking-wider">
                          <Banknote className="h-3.5 w-3.5" /> Total Requested
                        </p>
                        <p className="font-extrabold text-2xl text-blue-600 dark:text-blue-400">
                          {new Intl.NumberFormat("en-US", {
                            style: "currency",
                            currency: "USD",
                          }).format(details.budget.total)}
                        </p>
                      </div>
                      <div className="flex flex-col justify-center rounded-xl border border-slate-200/80 bg-slate-50/50 p-4 dark:border-slate-800 dark:bg-slate-900/30">
                        <p className="mb-1 font-bold text-[10px] text-slate-500 uppercase tracking-wider">Status</p>
                        <p className="font-semibold text-[15px] text-slate-800 dark:text-slate-200">Pending Approval</p>
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
                            {details.budget?.items?.map((item, i) => (
                              <tr
                                key={`${item.description}-${i}`}
                                className="hover:bg-slate-50/50 dark:hover:bg-slate-900/20"
                              >
                                <td className="px-4 py-3 text-slate-700 dark:text-slate-300">{item.description}</td>
                                <td className="px-4 py-3 text-right font-medium text-slate-800 dark:text-slate-200">
                                  {new Intl.NumberFormat("en-US", {
                                    minimumFractionDigits: 2,
                                    maximumFractionDigits: 2,
                                  }).format(item.amount)}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                          <tfoot className="bg-slate-50 dark:bg-slate-900/50">
                            <tr>
                              <td className="px-4 py-3 font-bold text-slate-900 dark:text-slate-100">Total</td>
                              <td className="px-4 py-3 text-right font-bold text-blue-600 dark:text-blue-400">
                                {new Intl.NumberFormat("en-US", {
                                  minimumFractionDigits: 2,
                                  maximumFractionDigits: 2,
                                }).format(details.budget.total)}
                              </td>
                            </tr>
                          </tfoot>
                        </table>
                      </div>
                    </div>
                  </div>
                </Can>
              )}

              {/* ── TAB: APPROVE (timeline) ── */}
              {drawerTab === "approve" && <TimelineTab proposalId={selected.id} />}
            </div>
          </>
        )}
      </SheetContent>

      <Dialog open={showTimelineApprove} onOpenChange={setShowTimelineApprove}>
        <DialogContent className="gap-0 overflow-hidden p-0 sm:max-w-115">
          <DialogHeader className="border-slate-100 border-b px-6 pt-6 pb-4 dark:border-slate-800">
            <div className="mb-1 flex items-center gap-3">
              <div className="rounded-lg bg-emerald-100 p-2 text-emerald-600 dark:bg-emerald-900/40 dark:text-emerald-400">
                <Check className="h-5 w-5" />
              </div>
              <DialogTitle className="font-bold text-base">Confirm approval</DialogTitle>
            </div>
            <DialogDescription className="ml-11 text-slate-500 text-xs">
              Your approval will advance this proposal to the next step in the chain. Add an optional note for the
              record.
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-4 px-6 py-5">
            <div className="rounded-lg border border-slate-100 bg-slate-50 p-3.5 dark:border-slate-800 dark:bg-slate-900/50">
              <p className="font-bold text-[10px] text-slate-400 uppercase tracking-wider">Proposal</p>
              <p className="mt-0.5 line-clamp-2 font-semibold text-[13px] text-slate-800 dark:text-slate-200">
                {selected?.title}
              </p>
            </div>
            <div className="flex flex-col gap-1.5">
              <Label
                htmlFor="timeline-approve-note"
                className="font-semibold text-[12px] text-slate-700 dark:text-slate-300"
              >
                Optional note
              </Label>
              <Textarea
                id="timeline-approve-note"
                className="min-h-25 resize-none rounded-lg bg-white text-sm dark:bg-slate-950"
                value={timelineApproveNote}
                onChange={(e) => setTimelineApproveNote(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter className="flex gap-2 border-slate-100 border-t px-6 py-4 dark:border-slate-800">
            <Button variant="outline" size="sm" className="h-9" onClick={() => setShowTimelineApprove(false)}>
              Cancel
            </Button>
            <Button
              size="sm"
              className="h-9 flex-1 bg-emerald-600 font-semibold text-white hover:bg-emerald-700"
              onClick={onConfirmApprove}
            >
              <Check className="mr-1.5 h-4 w-4" />
              Confirm approval
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

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
              Explain why the proposal cannot proceed.
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-4 px-6 py-5">
            <div className="rounded-lg border border-slate-100 bg-slate-50 p-3.5 dark:border-slate-800 dark:bg-slate-900/50">
              <p className="font-bold text-[10px] text-slate-400 uppercase tracking-wider">Proposal</p>
              <p className="mt-0.5 line-clamp-2 font-semibold text-[13px] text-slate-800 dark:text-slate-200">
                {selected?.title}
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
                className="min-h-35 resize-none rounded-lg bg-white text-sm dark:bg-slate-950"
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
              onClick={onConfirmReject}
            >
              <XCircle className="mr-1.5 h-4 w-4" /> Confirm rejection
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Sheet>
  );
}
