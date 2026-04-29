"use client";

import * as React from "react";

import Link from "next/link";
import { useParams } from "next/navigation";

import {
  AlertCircle,
  ArrowLeft,
  Award,
  Calendar,
  CheckCircle2,
  ChevronRight,
  Circle,
  Clock,
  Download,
  Edit,
  File as FileIcon,
  FileText,
  Loader2,
  MapPin,
  MessageSquare,
  RefreshCw,
  Shield,
  User,
  Users,
  XCircle,
} from "lucide-react";
import { toast } from "sonner";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { downloadFile } from "@/lib/api/files/queries";
import { useGetProposalById } from "@/lib/api/proposals/queries";
import type { DefenceSchedule, ProposalComment, WorkflowStep, WorkflowStepStatus } from "@/lib/api/proposals/types";
import {
  formatProposalDate,
  formatRelativeDate,
  getNameInitials,
  getStatusBadgeClass,
  getStatusLabel,
  shortProposalId,
} from "@/lib/api/proposals/utils";

// ─── Workflow step helpers ─────────────────────────────────────────────────────

function getStepStatusIcon(status: WorkflowStepStatus, isActive: boolean) {
  if (isActive) {
    return (
      <span className="relative flex h-3 w-3">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-blue-400 opacity-75" />
        <span className="relative inline-flex h-3 w-3 rounded-full bg-blue-500" />
      </span>
    );
  }
  switch (status) {
    case "Accepted":
      return <CheckCircle2 className="h-3 w-3 shrink-0 text-emerald-500" />;
    case "Rejected":
      return <XCircle className="h-3 w-3 shrink-0 text-red-500" />;
    case "Revision":
      return <Circle className="h-3 w-3 shrink-0 fill-amber-400 text-amber-400" />;
    default:
      return <Circle className="h-3 w-3 shrink-0 text-slate-300 dark:text-slate-600" />;
  }
}

function getStepStatusBadge(status: WorkflowStepStatus) {
  switch (status) {
    case "Accepted":
      return "bg-emerald-50 text-emerald-700 border-emerald-200/50 dark:bg-emerald-900/30 dark:text-emerald-400";
    case "Rejected":
      return "bg-red-50 text-red-700 border-red-200/50 dark:bg-red-900/30 dark:text-red-400";
    case "Revision":
      return "bg-amber-50 text-amber-700 border-amber-200/50 dark:bg-amber-900/30 dark:text-amber-400";
    default:
      return "bg-slate-100 text-slate-500 border-slate-200/50 dark:bg-slate-800 dark:text-slate-400";
  }
}

// ─── Loading skeleton ──────────────────────────────────────────────────────────

function PageSkeleton() {
  return (
    <div className="mx-auto flex w-full max-w-7xl flex-1 flex-col gap-6 p-6 lg:p-10">
      <Skeleton className="h-8 w-32 rounded-full" />
      <div className="flex flex-col gap-4 rounded-2xl border border-slate-200/50 p-6 dark:border-slate-800/50">
        <div className="flex gap-3">
          <Skeleton className="h-5 w-24 rounded" />
          <Skeleton className="h-5 w-28 rounded" />
        </div>
        <Skeleton className="h-9 w-3/4" />
        <div className="flex gap-6">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-4 w-40" />
        </div>
      </div>
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="flex flex-col gap-4 lg:col-span-2">
          <Skeleton className="h-48 rounded-xl" />
          <Skeleton className="h-40 rounded-xl" />
        </div>
        <div className="flex flex-col gap-4">
          <Skeleton className="h-56 rounded-xl" />
          <Skeleton className="h-32 rounded-xl" />
        </div>
      </div>
    </div>
  );
}

// ─── Workflow Step Row ─────────────────────────────────────────────────────────

function WorkflowStepItem({ step, isLast }: { step: WorkflowStep; isLast: boolean }) {
  return (
    <div className="relative flex gap-5">
      {/* Connector line */}
      {!isLast && <div className="absolute top-6 bottom-[-2rem] left-[5px] w-px bg-slate-200 dark:bg-slate-800" />}

      {/* Status icon */}
      <div className="relative z-10 mt-1 flex h-3 w-3 shrink-0 items-center justify-center">
        {getStepStatusIcon(step.status, step.isActive)}
      </div>

      {/* Content */}
      <div
        className={`mb-8 flex flex-1 flex-col gap-2 rounded-xl border p-4 ${
          step.isActive
            ? "border-blue-200 bg-blue-50/50 dark:border-blue-900/50 dark:bg-blue-950/20"
            : "border-slate-100 bg-white dark:border-slate-800 dark:bg-slate-950/30"
        }`}
      >
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-800 text-sm dark:text-slate-200">{step.label}</span>
            <span className="rounded bg-slate-100 px-1.5 py-0.5 font-medium text-[10px] text-slate-500 uppercase tracking-wide dark:bg-slate-800 dark:text-slate-400">
              {step.role.replace(/_/g, " ")}
            </span>
            {step.isActive && (
              <span className="rounded-full bg-blue-100 px-2 py-0.5 font-semibold text-[10px] text-blue-700 dark:bg-blue-900/40 dark:text-blue-400">
                Current
              </span>
            )}
          </div>
          <Badge variant="outline" className={`rounded px-2 text-xs ${getStepStatusBadge(step.status)}`}>
            {step.status}
          </Badge>
        </div>

        {step.comment && (
          <p className="border-slate-100 border-t pt-2 text-slate-600 text-sm leading-relaxed dark:border-slate-800 dark:text-slate-400">
            &ldquo;{step.comment}&rdquo;
          </p>
        )}
      </div>
    </div>
  );
}

// ─── Comment Item ──────────────────────────────────────────────────────────────

function CommentItem({ comment }: { comment: ProposalComment }) {
  const initials = comment.authorId.slice(0, 2).toUpperCase();

  return (
    <div className="flex items-start gap-4">
      <Avatar
        className={`h-10 w-10 border ${
          comment.isResolved ? "border-slate-200" : "border-amber-200 dark:border-amber-800/50"
        }`}
      >
        <AvatarFallback
          className={`font-semibold text-sm ${
            comment.isResolved
              ? "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300"
              : "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400"
          }`}
        >
          {initials}
        </AvatarFallback>
      </Avatar>

      <div className="flex flex-1 flex-col gap-1.5">
        <div className="flex items-baseline justify-between gap-2">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-mono font-semibold text-slate-900 text-xs dark:text-slate-100">
              {shortProposalId(comment.authorId)}
            </span>
            {comment.isResolved ? (
              <Badge className="rounded-sm border-0 bg-emerald-100 px-2 py-0 text-[10px] text-emerald-700 hover:bg-emerald-100 dark:bg-emerald-900/30 dark:text-emerald-400">
                Resolved
              </Badge>
            ) : (
              <Badge className="rounded-sm border-0 bg-amber-100 px-2 py-0 text-[10px] text-amber-700 hover:bg-amber-100 dark:bg-amber-900/30 dark:text-amber-400">
                Pending Response
              </Badge>
            )}
          </div>
          <span className="shrink-0 font-medium text-[11px] text-slate-400">
            {formatRelativeDate(comment.createdAt)}
          </span>
        </div>

        <div
          className={`rounded-xl border p-4 text-sm leading-relaxed ${
            comment.isResolved
              ? "border-slate-200 bg-white text-slate-700 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-300"
              : "border-amber-100 bg-amber-50/50 text-amber-900 dark:border-amber-800/50 dark:bg-amber-900/10 dark:text-amber-200"
          }`}
        >
          {comment.commentText}
        </div>
        <span className="text-[11px] text-slate-400">{formatProposalDate(comment.createdAt)}</span>
      </div>
    </div>
  );
}

// ─── Defence Schedule Card ─────────────────────────────────────────────────────

function DefenceCard({ schedule }: { schedule: DefenceSchedule }) {
  const defenceDate = new Date(schedule.defenceDate);
  const dateStr = new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(defenceDate);
  const timeStr = new Intl.DateTimeFormat("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    timeZoneName: "short",
  }).format(defenceDate);

  return (
    <Card className="rounded-xl border-amber-200/50 bg-gradient-to-b from-amber-50 to-white shadow-md dark:border-amber-900/50 dark:from-amber-950/40 dark:to-slate-950">
      <CardHeader className="border-amber-100/50 border-b bg-amber-500/10 pb-4 dark:border-amber-900/20 dark:bg-amber-500/5">
        <CardTitle className="flex items-center gap-2 text-amber-900 text-lg dark:text-amber-400">
          <Calendar className="h-5 w-5" />
          Defence Scheduled
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="flex flex-col gap-4">
          {/* Date & Time */}
          <div>
            <p className="font-bold text-[10px] text-slate-400 uppercase tracking-widest">Date & Time</p>
            <p className="mt-0.5 font-bold text-lg text-slate-800 dark:text-slate-200">{dateStr}</p>
            <span className="flex items-center gap-1.5 font-medium text-slate-500 text-sm">
              <Clock className="h-3.5 w-3.5" />
              {timeStr}
            </span>
          </div>

          <Separator className="dark:bg-slate-800" />

          {/* Location */}
          <div>
            <p className="font-bold text-[10px] text-slate-400 uppercase tracking-widest">Location</p>
            <span className="mt-1 flex items-start gap-1.5 font-semibold text-slate-700 text-sm dark:text-slate-300">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" />
              {schedule.location}
            </span>
          </div>

          {/* Note from coordinator */}
          {schedule.note && (
            <div className="rounded-xl border border-amber-100 bg-amber-50/50 p-4 dark:border-amber-900/30 dark:bg-amber-900/10">
              <p className="font-bold text-[10px] text-amber-700 uppercase tracking-widest dark:text-amber-400">
                Coordinator Note
              </p>
              <p className="mt-1 text-amber-900 text-sm leading-relaxed dark:text-amber-200">{schedule.note}</p>
            </div>
          )}

          {/* Scheduled on */}
          <p className="text-[11px] text-slate-400">Scheduled on {formatProposalDate(schedule.createdAt)}</p>
        </div>
      </CardContent>
    </Card>
  );
}

// ─── Page Component ────────────────────────────────────────────────────────────

export default function ProposalDetailsPage() {
  const params = useParams();
  const proposalId = params?.id as string;

  const { data: proposal, isLoading, error, refetch } = useGetProposalById(proposalId);
  const [isDownloading, setIsDownloading] = React.useState(false);

  const handleDownload = async () => {
    if (!proposal?.file?.id) return;

    setIsDownloading(true);
    try {
      await downloadFile(proposal.file.id, proposal.file.name);
      toast.success("Download started...");
    } catch (_err) {
      toast.error("Failed to download file. Please try again.");
    } finally {
      setIsDownloading(false);
    }
  };

  // ─── Loading ────────────────────────────────────────────────────────────────

  if (isLoading) return <PageSkeleton />;

  // ─── Error / Not found ──────────────────────────────────────────────────────

  if (error || !proposal) {
    return (
      <div className="mx-auto flex w-full max-w-7xl flex-1 flex-col gap-6 p-6 lg:p-10">
        <Link href="/dashboard/proposals">
          <Button
            variant="ghost"
            size="sm"
            className="h-8 rounded-full text-slate-500 shadow-none hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Proposals
          </Button>
        </Link>
        <div className="flex flex-col items-center justify-center gap-4 rounded-2xl border border-red-200 bg-red-50 p-12 text-center dark:border-red-900/50 dark:bg-red-950/20">
          <AlertCircle className="h-10 w-10 text-red-400" />
          <div>
            <p className="font-semibold text-red-800 dark:text-red-300">
              {error instanceof Error ? error.message : "Proposal not found"}
            </p>
            <p className="mt-1 text-red-600 text-sm dark:text-red-400">
              The proposal may have been removed or you may not have permission to view it.
            </p>
          </div>
          <Button
            size="sm"
            onClick={() => refetch()}
            className="rounded-full border-0 bg-red-600 px-5 text-white hover:bg-red-700"
          >
            <RefreshCw className="mr-2 h-3.5 w-3.5" /> Retry
          </Button>
        </div>
      </div>
    );
  }

  // ─── Derived values ─────────────────────────────────────────────────────────

  const comments = proposal.comments ?? [];
  const defenceSchedules = proposal.defenceSchedules ?? [];
  const workflowSteps = proposal.workflow?.steps ?? [];
  const currentStepOrder = proposal.workflow?.currentStepOrder ?? 0;

  const unresolvedCount = comments.filter((c) => !c.isResolved).length;
  const hasDefence = defenceSchedules.length > 0;
  const latestDefence = hasDefence ? defenceSchedules[0] : null;
  const currentStep = workflowSteps.find((s) => s.isActive);
  const progressPercent = workflowSteps.length > 0 ? Math.round((currentStepOrder / workflowSteps.length) * 100) : 0;

  // ─── Render ─────────────────────────────────────────────────────────────────

  return (
    <div className="mx-auto flex w-full max-w-7xl flex-1 flex-col gap-6 p-6 lg:p-10">
      {/* Back navigation */}
      <div className="mb-2 flex items-center gap-2">
        <Link href="/dashboard/proposals">
          <Button
            variant="ghost"
            size="sm"
            className="h-8 rounded-full text-slate-500 shadow-none hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Proposals
          </Button>
        </Link>
      </div>

      {/* ── Header card ───────────────────────────────────────────────────────── */}
      <div className="flex flex-col items-start justify-between gap-6 rounded-2xl border border-slate-200/50 bg-white p-6 shadow-sm md:flex-row md:items-end dark:border-slate-800/50 dark:bg-slate-950/50">
        <div className="flex flex-1 flex-col gap-3">
          {/* Badges row */}
          <div className="flex flex-wrap items-center gap-2">
            <Badge
              variant="outline"
              className="border-slate-200 px-2 py-0.5 font-mono font-semibold text-slate-500 text-xs dark:border-slate-700 dark:text-slate-400"
            >
              {shortProposalId(proposal.id)}
            </Badge>
            <Badge
              variant="outline"
              className="border-slate-200 px-2 py-0.5 font-semibold text-slate-500 text-xs dark:border-slate-700 dark:text-slate-400"
            >
              {proposal.type}
            </Badge>
            <Badge
              variant="outline"
              className={`${getStatusBadgeClass(proposal.status)} inline-flex items-center rounded px-2.5 py-0.5 font-medium shadow-none`}
            >
              {getStatusLabel(proposal.status)}
            </Badge>
          </div>

          {/* Title */}
          <h1 className="font-bold text-2xl text-slate-900 tracking-tight md:text-3xl dark:text-slate-100">
            {proposal.title}
          </h1>

          {/* Meta info */}
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 font-medium text-slate-500 text-sm">
            <div className="flex items-center gap-1.5">
              <User className="h-4 w-4" />
              {proposal.pi?.name ?? "Unknown"}
            </div>
            <div className="flex items-center gap-1.5">
              <Shield className="h-4 w-4" />
              {proposal.department?.name ?? "—"}
            </div>
            <div className="flex items-center gap-1.5">
              <Calendar className="h-4 w-4" />
              Submitted: {formatProposalDate(proposal.createdAt)}
            </div>
          </div>

          {/* Workflow progress bar */}
          {workflowSteps.length > 0 && (
            <div className="mt-1 flex flex-col gap-1.5">
              <div className="flex items-center justify-between text-slate-500 text-xs">
                <span className="flex items-center gap-1">
                  <ChevronRight className="h-3.5 w-3.5 text-blue-500" />
                  Step {proposal.workflow.currentStepOrder} of {proposal.workflow.steps.length}
                  {currentStep ? ` — ${currentStep.label}` : ""}
                </span>
                <span className="font-semibold text-blue-600 dark:text-blue-400">{progressPercent}%</span>
              </div>
              <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 transition-all duration-500"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Action buttons */}
        <div className="flex w-full items-center gap-3 md:w-auto">
          {proposal.file && (
            <Button
              variant="outline"
              className="flex-1 rounded-full font-medium md:flex-auto"
              onClick={handleDownload}
              disabled={isDownloading}
            >
              {isDownloading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Download className="mr-2 h-4 w-4" />
              )}
              Download Attachment
            </Button>
          )}
          {(proposal.status === "Draft" || proposal.status === "Revision") && (
            <Link href={`/dashboard/proposals/${proposal.id}/edit`}>
              <Button className="flex-1 rounded-full border-0 bg-blue-600 font-medium text-white shadow-sm hover:bg-blue-700 md:flex-auto">
                <Edit className="mr-2 h-4 w-4" /> Edit Proposal
              </Button>
            </Link>
          )}
        </div>
      </div>

      {/* ── Tabs ──────────────────────────────────────────────────────────────── */}
      <Tabs defaultValue="overview" className="mt-2 w-full">
        <TabsList className="scrollbar-hide h-12 w-full flex-nowrap justify-start overflow-x-auto rounded-none border-slate-200 border-b bg-transparent p-0 dark:border-slate-800">
          <TabsTrigger
            value="overview"
            className="rounded-none border-transparent border-b-2 px-6 py-3 font-medium text-slate-500 data-[state=active]:border-blue-600 data-[state=active]:bg-transparent data-[state=active]:text-blue-700 data-[state=active]:shadow-none dark:data-[state=active]:text-blue-400"
          >
            <FileText className="mr-2 h-4 w-4" /> Overview
          </TabsTrigger>

          <TabsTrigger
            value="feedback"
            className="rounded-none border-transparent border-b-2 px-6 py-3 font-medium text-slate-500 data-[state=active]:border-blue-600 data-[state=active]:bg-transparent data-[state=active]:text-blue-700 data-[state=active]:shadow-none dark:data-[state=active]:text-blue-400"
          >
            <MessageSquare className="mr-2 h-4 w-4" /> Comments
            {unresolvedCount > 0 && (
              <Badge className="ml-2 h-4 rounded-full border-0 bg-amber-100 px-1.5 py-0 text-amber-700 hover:bg-amber-100 dark:bg-amber-900/30 dark:text-amber-400">
                {unresolvedCount}
              </Badge>
            )}
          </TabsTrigger>

          <TabsTrigger
            value="workflow"
            className="rounded-none border-transparent border-b-2 px-6 py-3 font-medium text-slate-500 data-[state=active]:border-blue-600 data-[state=active]:bg-transparent data-[state=active]:text-blue-700 data-[state=active]:shadow-none dark:data-[state=active]:text-blue-400"
          >
            <Loader2 className="mr-2 h-4 w-4" /> Workflow
          </TabsTrigger>

          {hasDefence && (
            <TabsTrigger
              value="defence"
              className="rounded-none border-transparent border-b-2 px-6 py-3 font-medium text-slate-500 data-[state=active]:border-amber-600 data-[state=active]:bg-transparent data-[state=active]:text-amber-700 data-[state=active]:shadow-none dark:data-[state=active]:text-amber-400"
            >
              <Award className="mr-2 h-4 w-4" /> Defence
              <Badge className="ml-2 h-4 rounded-full border-0 bg-amber-100 px-1.5 py-0 text-amber-700 hover:bg-amber-100 dark:bg-amber-900/30 dark:text-amber-400">
                Scheduled
              </Badge>
            </TabsTrigger>
          )}
        </TabsList>

        <div className="py-6">
          <TabsContent value="overview" className="mt-0 focus-visible:outline-none">
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
              <div className="flex flex-col gap-6 lg:col-span-2">
                <Card className="overflow-hidden rounded-xl border-slate-200/50 shadow-none dark:border-slate-800/50">
                  <CardHeader className="border-slate-100 border-b bg-slate-50/50 pb-4 dark:border-slate-800 dark:bg-slate-900/10">
                    <CardTitle className="text-lg text-slate-800 dark:text-slate-200">Proposal Information</CardTitle>
                  </CardHeader>
                  <CardContent className="grid grid-cols-2 gap-x-6 gap-y-4 p-6 text-sm sm:grid-cols-3">
                    {[
                      { label: "Type", value: proposal.type },
                      { label: "Department", value: proposal.department?.name ?? "—" },
                      { label: "Dept. Code", value: proposal.department?.code ?? "—" },
                      { label: "Current Status", value: getStatusLabel(proposal.status) },
                      {
                        label: "Submitted",
                        value: formatProposalDate(proposal.createdAt),
                      },
                      {
                        label: "Workflow Step",
                        value: `${currentStepOrder} / ${workflowSteps.length}`,
                      },
                    ].map(({ label, value }) => (
                      <div key={label} className="flex flex-col gap-1">
                        <span className="font-medium text-slate-500 text-xs uppercase tracking-wider">{label}</span>
                        <span className="font-semibold text-slate-800 dark:text-slate-200">{value}</span>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                {/* Attached File Card */}
                {proposal.file && (
                  <Card className="overflow-hidden rounded-xl border-slate-200/50 shadow-none dark:border-slate-800/50">
                    <CardHeader className="border-slate-100 border-b bg-slate-50/50 pb-4 dark:border-slate-800 dark:bg-slate-900/10">
                      <CardTitle className="text-lg text-slate-800 dark:text-slate-200">Attached Documents</CardTitle>
                    </CardHeader>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between rounded-lg border border-slate-200 p-4 dark:border-slate-800">
                        <div className="flex items-center gap-4">
                          <div className="flex h-10 w-10 items-center justify-center rounded bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">
                            <FileIcon className="h-6 w-6" />
                          </div>
                          <div>
                            <p className="font-semibold text-slate-800 text-sm dark:text-slate-200">
                              {proposal.file.name}
                            </p>
                            <p className="text-slate-500 text-xs">
                              {(proposal.file.size / 1024).toFixed(1)} KB • {proposal.file.mimeType}
                            </p>
                          </div>
                        </div>
                        <Button variant="ghost" size="sm" onClick={handleDownload} disabled={isDownloading}>
                          {isDownloading ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <Download className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {proposal.status === "Revision" && (
                  <div className="flex items-start gap-4 rounded-xl border border-amber-200 bg-amber-50/70 p-5 dark:border-amber-900/50 dark:bg-amber-950/30">
                    <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-amber-600 dark:text-amber-400" />
                    <div className="flex-1">
                      <p className="font-semibold text-amber-900 text-sm dark:text-amber-300">Revisions Required</p>
                      <p className="mt-1 text-amber-800 text-sm leading-relaxed dark:text-amber-400">
                        Your proposal requires revisions based on evaluator feedback. Please review the comments tab and
                        update your submission.
                      </p>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex flex-col gap-6">
                <Card className="rounded-xl border-slate-200/50 shadow-none dark:border-slate-800/50">
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center gap-2 text-base text-slate-800 dark:text-slate-200">
                      <User className="h-4 w-4 text-blue-500" /> Principal Investigator
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10 border border-blue-100 dark:border-blue-900/50">
                        {proposal.pi?.avatarUrl && (
                          <AvatarImage src={proposal.pi.avatarUrl} alt={proposal.pi?.name ?? ""} />
                        )}
                        <AvatarFallback className="bg-blue-50 font-semibold text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
                          {getNameInitials(proposal.pi?.name ?? "")}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-semibold text-slate-800 text-sm dark:text-slate-200">
                          {proposal.pi?.name ?? "Unknown"}
                        </p>
                        <p className="text-slate-500 text-xs">Principal Investigator</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {((proposal.advisors ?? []).length > 0 ||
                  (proposal.team ?? []).length > 0 ||
                  (proposal.evaluators ?? []).length > 0) && (
                  <Card className="rounded-xl border-slate-200/50 shadow-none dark:border-slate-800/50">
                    <CardHeader className="pb-3">
                      <CardTitle className="flex items-center gap-2 text-base text-slate-800 dark:text-slate-200">
                        <Users className="h-4 w-4 text-indigo-500" /> Project Members
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="flex flex-col gap-4">
                      {(proposal.advisors ?? []).length > 0 && (
                        <div>
                          <p className="mb-2 font-bold text-[10px] text-slate-400 uppercase tracking-widest">
                            Advisors
                          </p>
                          <div className="flex flex-col gap-2">
                            {(proposal.advisors ?? []).map((a) => (
                              <div key={a.id} className="flex items-center gap-2.5">
                                <Avatar className="h-7 w-7 border border-slate-200 dark:border-slate-700">
                                  <AvatarFallback className="bg-slate-100 font-semibold text-[10px] text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                                    {getNameInitials(a.name)}
                                  </AvatarFallback>
                                </Avatar>
                                <span className="text-slate-700 text-sm dark:text-slate-300">{a.name}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {(proposal.team ?? []).length > 0 && (
                        <div>
                          <p className="mb-2 font-bold text-[10px] text-slate-400 uppercase tracking-widest">
                            Team Members
                          </p>
                          <div className="flex flex-col gap-2">
                            {(proposal.team ?? []).map((m) => (
                              <div key={m.id} className="flex items-center gap-2.5">
                                <Avatar className="h-7 w-7 border border-slate-200 dark:border-slate-700">
                                  <AvatarFallback className="bg-slate-100 font-semibold text-[10px] text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                                    {getNameInitials(m.name)}
                                  </AvatarFallback>
                                </Avatar>
                                <span className="text-slate-700 text-sm dark:text-slate-300">{m.name}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {(proposal.evaluators ?? []).length > 0 && (
                        <div>
                          <p className="mb-2 font-bold text-[10px] text-slate-400 uppercase tracking-widest">
                            Evaluators
                          </p>
                          <div className="flex flex-col gap-2">
                            {(proposal.evaluators ?? []).map((e) => (
                              <div key={e.id} className="flex items-center gap-2.5">
                                <Avatar className="h-7 w-7 border border-slate-200 dark:border-slate-700">
                                  <AvatarFallback className="bg-slate-100 font-semibold text-[10px] text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                                    {getNameInitials(e.name)}
                                  </AvatarFallback>
                                </Avatar>
                                <span className="text-slate-700 text-sm dark:text-slate-300">{e.name}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="feedback" className="mt-0 focus-visible:outline-none">
            <Card className="overflow-hidden rounded-xl border-slate-200/50 shadow-none dark:border-slate-800/50">
              <CardHeader className="border-slate-100 border-b bg-slate-50/30 pb-4 dark:border-slate-800 dark:bg-slate-900/10">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg text-slate-800 dark:text-slate-200">Reviewer Comments</CardTitle>
                  <div className="flex items-center gap-2 text-slate-500 text-xs">
                    <span>
                      {proposal.comments.length} comment
                      {proposal.comments.length !== 1 ? "s" : ""}
                    </span>
                    {unresolvedCount > 0 && (
                      <Badge className="rounded-sm border-0 bg-amber-100 px-2 text-amber-700 hover:bg-amber-100 dark:bg-amber-900/30 dark:text-amber-400">
                        {unresolvedCount} pending
                      </Badge>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-6">
                {comments.length === 0 ? (
                  <div className="flex flex-col items-center justify-center gap-3 py-16 text-center">
                    <div className="flex h-14 w-14 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800">
                      <MessageSquare className="h-6 w-6 text-slate-400 dark:text-slate-500" />
                    </div>
                    <p className="font-medium text-slate-700 text-sm dark:text-slate-300">No comments yet</p>
                    <p className="max-w-xs text-slate-400 text-xs">
                      Comments from reviewers and evaluators will appear here.
                    </p>
                  </div>
                ) : (
                  <div className="flex flex-col gap-6">
                    {proposal.comments.map((comment) => (
                      <CommentItem key={comment.id} comment={comment} />
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="workflow" className="mt-0 focus-visible:outline-none">
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
              <div className="lg:col-span-2">
                <Card className="overflow-hidden rounded-xl border-slate-200/50 shadow-none dark:border-slate-800/50">
                  <CardHeader className="border-slate-100 border-b bg-slate-50/30 pb-4 dark:border-slate-800 dark:bg-slate-900/10">
                    <CardTitle className="text-lg text-slate-800 dark:text-slate-200">Approval Workflow</CardTitle>
                    <CardDescription>Real-time status of every review step for this proposal.</CardDescription>
                  </CardHeader>
                  <CardContent className="pt-6">
                    {workflowSteps.length === 0 ? (
                      <p className="py-8 text-center text-slate-400 text-sm">No workflow steps configured.</p>
                    ) : (
                      <div>
                        {workflowSteps.map((step, i) => (
                          <WorkflowStepItem key={step.stepOrder} step={step} isLast={i === workflowSteps.length - 1} />
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>

              <div className="flex flex-col gap-4">
                <Card className="rounded-xl border-slate-200/50 shadow-none dark:border-slate-800/50">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base text-slate-800 dark:text-slate-200">Progress Summary</CardTitle>
                  </CardHeader>
                  <CardContent className="flex flex-col gap-4">
                    <div>
                      <div className="mb-1.5 flex justify-between text-slate-500 text-xs">
                        <span>
                          Step {proposal.workflow.currentStepOrder} of {proposal.workflow.steps.length}
                        </span>
                        <span className="font-semibold text-blue-600 dark:text-blue-400">{progressPercent}%</span>
                      </div>
                      <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-blue-500 to-indigo-500"
                          style={{ width: `${progressPercent}%` }}
                        />
                      </div>
                    </div>
                    <Separator className="dark:bg-slate-800" />
                    <div className="flex flex-col gap-2 text-sm">
                      {[
                        {
                          label: "Completed",
                          count: workflowSteps.filter((s) => s.status === "Accepted").length,
                          color: "text-emerald-600 dark:text-emerald-400",
                        },
                        {
                          label: "Pending",
                          count: workflowSteps.filter((s) => s.status === "Pending").length,
                          color: "text-slate-500",
                        },
                        {
                          label: "Requires Revision",
                          count: workflowSteps.filter((s) => s.status === "Revision").length,
                          color: "text-amber-600 dark:text-amber-400",
                        },
                        {
                          label: "Rejected",
                          count: workflowSteps.filter((s) => s.status === "Rejected").length,
                          color: "text-red-600 dark:text-red-400",
                        },
                      ].map(({ label, count, color }) => (
                        <div key={label} className="flex items-center justify-between">
                          <span className="text-slate-500 text-xs">{label}</span>
                          <span className={`font-bold text-sm ${color}`}>{count}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {hasDefence && latestDefence && (
            <TabsContent value="defence" className="mt-0 focus-visible:outline-none">
              <div className="mx-auto max-w-2xl">
                <DefenceCard schedule={latestDefence} />
              </div>
            </TabsContent>
          )}
        </div>
      </Tabs>
    </div>
  );
}
