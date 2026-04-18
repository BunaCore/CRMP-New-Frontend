import type React from "react";
import { useEffect, useState } from "react";

import { AlertTriangle, Check, CheckCircle, Circle, Clock, FileText, Sparkles } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { uploadFile } from "@/lib/api/files/mutations";
import { downloadFile } from "@/lib/api/files/queries";
import { submitStepAction } from "@/lib/api/proposals/mutations";
import { getApprovalTimeline } from "@/lib/api/proposals/queries";
import type { ApprovalTimelineResponse, ApprovalTimelineStep } from "@/lib/api/proposals/types";

interface TimelineTabProps {
  proposalId: string;
}

export function TimelineTab({ proposalId }: TimelineTabProps) {
  const [timelineInfo, setTimelineInfo] = useState<ApprovalTimelineResponse | null>(null);
  const [isLoadingTimeline, setIsLoadingTimeline] = useState(false);
  const [showTimelineApprove, setShowTimelineApprove] = useState(false);
  const [showTimelineReject, setShowTimelineReject] = useState(false);
  const [timelineComment, setTimelineComment] = useState("");

  const [formFiles, setFormFiles] = useState<Record<string, { file: File; name: string; id?: string }>>({});
  const [isSubmittingForm, setIsSubmittingForm] = useState(false);

  useEffect(() => {
    if (proposalId) {
      setIsLoadingTimeline(true);
      getApprovalTimeline(proposalId)
        .then((data) => setTimelineInfo(data))
        .catch(console.error)
        .finally(() => setIsLoadingTimeline(false));
    }
  }, [proposalId]);

  const submitVote = async (decision: "Accepted" | "Rejected") => {
    try {
      if (decision === "Accepted") setShowTimelineApprove(false);
      else setShowTimelineReject(false);

      await submitStepAction(proposalId, { decision, comment: timelineComment });
      setTimelineComment("");
      setTimelineInfo(await getApprovalTimeline(proposalId));
    } catch (e) {
      console.error(e);
    }
  };

  const handleFormUpload = async (e: React.ChangeEvent<HTMLInputElement>, fieldName: string) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormFiles((prev) => ({ ...prev, [fieldName]: { file, name: file.name } }));
    }
  };

  const submitFormStep = async (stepId: string) => {
    setIsSubmittingForm(true);
    try {
      const input: Record<string, any> = {};

      for (const field in formFiles) {
        const fileObj = formFiles[field];
        if (!fileObj.id) {
          const res = await uploadFile(fileObj.file);
          input[field] = res.fileId;
        } else {
          input[field] = fileObj.id;
        }
      }

      await submitStepAction(proposalId, { input });
      setTimelineInfo(await getApprovalTimeline(proposalId));
      setFormFiles({});
    } catch (e) {
      console.error(e);
    } finally {
      setIsSubmittingForm(false);
    }
  };

  return (
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
        <div
          className="absolute top-3 bottom-3 left-[19px] w-px bg-gradient-to-b from-emerald-200 via-blue-200 to-slate-200 dark:from-emerald-900/40 dark:via-blue-900/40 dark:to-slate-800"
          aria-hidden
        />

        <ul className="relative flex flex-col gap-4">
          {isLoadingTimeline && <li className="pl-4 text-xs text-slate-500">Loading timeline...</li>}
          {!isLoadingTimeline &&
            timelineInfo?.steps?.map((step: ApprovalTimelineStep) => {
              const isCompleted = step.status === "COMPLETED" || step.status === "Accepted";
              const isCurrent = step.isActive;
              const isUpcoming = step.status === "PENDING" && !step.isActive;

              return (
                <li key={step.id} className="relative flex gap-4 pl-1">
                  <div
                    className={`relative z-[1] mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 shadow-sm transition-colors ${
                      isCompleted
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
                    className={`min-w-0 flex-1 rounded-2xl border p-4 transition-all ${
                      isCompleted
                        ? "border-emerald-100 bg-emerald-50/40 dark:border-emerald-900/25 dark:bg-emerald-950/20"
                        : isCurrent
                          ? "border-blue-200 bg-gradient-to-br from-blue-50/90 to-white shadow-md dark:border-blue-900/40 dark:from-blue-950/30 dark:to-slate-950"
                          : "border-slate-100 bg-slate-50/40 opacity-60 dark:border-slate-800 dark:bg-slate-900/20"
                    }`}
                  >
                    <div className="flex flex-wrap items-start justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-1.5 font-bold text-[10px] text-slate-400 uppercase tracking-wider dark:text-slate-500">
                          Step {step.stepOrder} · {step.approverRole || "Role"}
                          <Badge className="border-0 bg-slate-100 text-[9px] text-slate-500 dark:bg-slate-800/80 dark:text-slate-400">
                            {step.stepType}
                          </Badge>
                        </div>
                        <p className="mt-0.5 font-semibold text-slate-900 text-sm dark:text-slate-100">
                          {step.stepLabel}
                        </p>
                        {isCompleted && (
                          <div className="mt-2 flex flex-col gap-1">
                            <p className="flex items-center gap-1 font-medium text-[11px] text-emerald-700 dark:text-emerald-400">
                              <CheckCircle className="h-3 w-3 shrink-0" />
                              Completed {step.userAction ? `· ${step.userAction}` : ""}
                            </p>
                            {step.decision && step.decision.comment && (
                              <div className="mt-1 rounded border border-slate-100 bg-white p-2 text-xs text-slate-600 shadow-sm dark:border-slate-800 dark:bg-slate-950 dark:text-slate-400">
                                <span className="font-semibold text-slate-700 dark:text-slate-300">Comment: </span>
                                {step.decision.comment}
                              </div>
                            )}
                            {step.decision && step.decision.at && (
                              <p className="text-[10px] text-slate-400">
                                Resolved at: {new Date(step.decision.at).toLocaleString()}
                              </p>
                            )}
                          </div>
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

                    {/* VOTE Statistics */}
                    {step.stepType === "VOTE" && step.vote && (
                      <div className="mt-4 rounded-xl bg-white p-3 border border-slate-100 shadow-sm flex gap-4 text-xs font-medium dark:bg-slate-900/50 dark:border-slate-800/80">
                        <div className="text-emerald-600 dark:text-emerald-400">
                          Approved: {step.vote.counts.approved}
                        </div>
                        <div className="text-rose-600 dark:text-rose-400">Rejected: {step.vote.counts.rejected}</div>
                        <div className="text-slate-500">
                          Total: {step.vote.counts.total} / {step.vote.threshold} required
                        </div>
                      </div>
                    )}

                    {/* FORM Display (Both Pending and Completed) */}
                    {step.stepType === "FORM" && step.form?.schema?.fields && (
                      <div className="mt-4 border-slate-100 border-t pt-4 dark:border-slate-800/80">
                        <div className="mt-2 flex flex-col gap-4">
                          {step.form.schema.fields.map((field) => (
                            <div key={field.name} className="flex flex-col gap-1.5">
                              <Label className="font-semibold text-[12px] text-slate-700 dark:text-slate-300">
                                {field.name.replace(/([A-Z])/g, " $1").replace(/^./, (str) => str.toUpperCase())}
                                {field.required && <span className="text-rose-500 ml-1">*</span>}
                              </Label>

                              {isCompleted && step.form?.submission ? (
                                <div className="rounded-lg border border-slate-100 bg-white p-3 font-medium text-[13px] text-slate-700 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-300">
                                  {field.type === "file" ? (
                                    <div className="flex items-center gap-2">
                                      <FileText className="h-4 w-4 text-slate-400" />
                                      <button
                                        type="button"
                                        onClick={() =>
                                          downloadFile(
                                            step.form!.submission!.values[field.name],
                                            `${field.name}-Attachment`,
                                          )
                                        }
                                        className="font-semibold text-blue-600 hover:underline dark:text-blue-400"
                                      >
                                        Download Attachment
                                      </button>
                                    </div>
                                  ) : (
                                    step.form.submission.values[field.name] || (
                                      <span className="text-slate-400 italic">No value</span>
                                    )
                                  )}
                                </div>
                              ) : isCurrent && step.canAct ? (
                                field.type === "file" ? (
                                  <div className="relative">
                                    <input
                                      type="file"
                                      id={`file-${field.name}`}
                                      className="hidden"
                                      onChange={(e) => handleFormUpload(e, field.name)}
                                    />
                                    <Label
                                      htmlFor={`file-${field.name}`}
                                      className="flex cursor-pointer items-center justify-center gap-2 rounded-lg border border-dashed border-slate-300 bg-white p-4 font-medium text-[13px] text-slate-600 transition-colors hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-950 dark:hover:bg-slate-900/50"
                                    >
                                      <FileText className="h-4 w-4" />
                                      {formFiles[field.name]?.name || "Click to upload attachment"}
                                    </Label>
                                  </div>
                                ) : (
                                  <div className="text-xs text-slate-400 italic">
                                    Unsupported field type: {field.type}
                                  </div>
                                )
                              ) : null}
                            </div>
                          ))}

                          {!isCompleted && isCurrent && step.canAct && (
                            <Button
                              type="button"
                              size="sm"
                              className="mt-2 h-9 self-start bg-blue-600 font-semibold text-white shadow-sm hover:bg-blue-700"
                              disabled={
                                isSubmittingForm ||
                                step.form.schema.fields.some(
                                  (f) => f.required && f.type === "file" && !formFiles[f.name],
                                )
                              }
                              onClick={() => submitFormStep(step.id)}
                            >
                              <Check className="mr-1.5 h-4 w-4" />
                              {isSubmittingForm ? "Submitting..." : "Submit Details"}
                            </Button>
                          )}
                        </div>
                      </div>
                    )}

                    {isCurrent && step.canAct && (
                      <div className="mt-4 border-slate-100 border-t pt-4 dark:border-slate-800/80">
                        {/* Type: APPROVAL */}
                        {step.stepType === "APPROVAL" && (
                          <div className="flex flex-wrap gap-2">
                            <Button
                              type="button"
                              size="sm"
                              className="h-9 min-w-[120px] flex-1 bg-emerald-600 font-semibold text-white shadow-sm hover:bg-emerald-700"
                              onClick={() => setShowTimelineApprove(true)}
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
                        )}

                        {/* Type: VOTE */}
                        {step.stepType === "VOTE" && (
                          <div className="flex flex-col gap-2">
                            <p className="text-[11px] text-slate-500 mb-1">
                              Cast your vote for this proposal. It requires {step.vote?.threshold} votes total.
                            </p>
                            <div className="flex flex-wrap gap-2">
                              <Button
                                type="button"
                                size="sm"
                                className="h-9 min-w-[120px] bg-emerald-600 font-semibold text-white shadow-sm hover:bg-emerald-700"
                                onClick={() => submitVote("Accepted")}
                              >
                                Vote Approve
                              </Button>
                              <Button
                                type="button"
                                size="sm"
                                variant="outline"
                                className="h-9 min-w-[120px] border-rose-200 font-semibold text-rose-700 hover:bg-rose-50 dark:border-rose-900/50 dark:text-rose-400 dark:hover:bg-rose-950/40"
                                onClick={() => submitVote("Rejected")}
                              >
                                Vote Reject
                              </Button>
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    {/* APPROVAL Confirmations */}
                    {showTimelineApprove && step.isActive && (
                      <div className="mt-4 flex flex-col gap-3 rounded-xl border border-emerald-100 bg-emerald-50/50 p-3 dark:border-emerald-900/30 dark:bg-emerald-950/20">
                        <Label className="text-xs text-emerald-800 dark:text-emerald-300">Comment (Optional)</Label>
                        <Textarea
                          value={timelineComment}
                          onChange={(e) => setTimelineComment(e.target.value)}
                          placeholder="Add a comment for the approval..."
                          className="min-h-[80px] border-emerald-200 bg-white text-xs dark:border-emerald-900/50 dark:bg-slate-950"
                        />
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            className="h-8 flex-1 bg-emerald-600 text-xs shadow-sm hover:bg-emerald-700"
                            onClick={() => submitVote("Accepted")}
                          >
                            Confirm Approval
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-8 text-xs text-slate-600 hover:bg-emerald-100/50 dark:text-slate-400 dark:hover:bg-emerald-900/30"
                            onClick={() => setShowTimelineApprove(false)}
                          >
                            Cancel
                          </Button>
                        </div>
                      </div>
                    )}

                    {showTimelineReject && step.isActive && (
                      <div className="mt-4 flex flex-col gap-3 rounded-xl border border-rose-100 bg-rose-50/50 p-3 dark:border-rose-900/30 dark:bg-rose-950/20">
                        <Label className="text-xs text-rose-800 dark:text-rose-300">
                          Reason for Rejection <span className="text-rose-500">*</span>
                        </Label>
                        <Textarea
                          value={timelineComment}
                          onChange={(e) => setTimelineComment(e.target.value)}
                          placeholder="Please provide a detailed reason..."
                          className="min-h-[80px] border-rose-200 bg-white text-xs dark:border-rose-900/50 dark:bg-slate-950"
                        />
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            className="h-8 flex-1 bg-rose-600 text-xs shadow-sm hover:bg-rose-700"
                            disabled={!timelineComment.trim()}
                            onClick={() => submitVote("Rejected")}
                          >
                            Confirm Rejection
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-8 text-xs text-slate-600 hover:bg-rose-100/50 dark:text-slate-400 dark:hover:bg-rose-900/30"
                            onClick={() => setShowTimelineReject(false)}
                          >
                            Cancel
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                </li>
              );
            })}
        </ul>
      </div>
    </div>
  );
}
