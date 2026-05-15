"use client";

import { useState } from "react";

import { motion } from "framer-motion";
import {
  AlertTriangle,
  ArrowRight,
  BookOpen,
  CheckCircle2,
  Circle,
  Clock,
  FileText,
  MessageSquare,
  Wallet,
} from "lucide-react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";

// ─────────────────────────────────────────────────────────
// Mock Data — will be replaced with real API calls
// ─────────────────────────────────────────────────────────

interface ProposalStep {
  label: string;
  status: "completed" | "current" | "pending";
  date?: string;
  holder?: string;
  daysWaiting?: number;
}

interface Proposal {
  id: string;
  title: string;
  type: string;
  currentStep: number;
  totalSteps: number;
  currentStepLabel: string;
  holder: string;
  daysWaiting: number;
  steps: ProposalStep[];
}

const MY_PROPOSALS: Proposal[] = [
  {
    id: "PRO-2024-001",
    title: "AI-Based Crop Disease Detection",
    type: "PG",
    currentStep: 3,
    totalSteps: 6,
    currentStepLabel: "DGC Review",
    holder: "DGC Committee",
    daysWaiting: 3,
    steps: [
      { label: "Submitted", status: "completed", date: "Nov 2" },
      { label: "Coordinator", status: "completed", date: "Nov 5" },
      { label: "DGC Review", status: "current", holder: "DGC Committee", daysWaiting: 3 },
      { label: "ADRPM", status: "pending" },
      { label: "Budget Approval", status: "pending" },
      { label: "Project Created", status: "pending" },
    ],
  },
  {
    id: "PRO-2024-003",
    title: "Carbon Footprint Analytics Platform",
    type: "UG",
    currentStep: 1,
    totalSteps: 5,
    currentStepLabel: "Coordinator Assign",
    holder: "Dept. Coordinator",
    daysWaiting: 1,
    steps: [
      { label: "Submitted", status: "completed", date: "Dec 1" },
      { label: "Coordinator", status: "current", holder: "Dept. Coordinator", daysWaiting: 1 },
      { label: "DGC Review", status: "pending" },
      { label: "Advisor Assign", status: "pending" },
      { label: "Project Created", status: "pending" },
    ],
  },
  {
    id: "PRO-2024-005",
    title: "Rural Water Quality Monitoring System",
    type: "PG",
    currentStep: 5,
    totalSteps: 6,
    currentStepLabel: "Budget Approval",
    holder: "Finance Office",
    daysWaiting: 5,
    steps: [
      { label: "Submitted", status: "completed", date: "Oct 10" },
      { label: "Coordinator", status: "completed", date: "Oct 12" },
      { label: "DGC Review", status: "completed", date: "Oct 20" },
      { label: "ADRPM", status: "completed", date: "Nov 1" },
      { label: "Budget Approval", status: "current", holder: "Finance Office", daysWaiting: 5 },
      { label: "Project Created", status: "pending" },
    ],
  },
];

const MY_PROJECTS = [
  {
    id: "PRJ-001",
    title: "AI-Based Crop Disease Detection",
    approved: 48000,
    spent: 18200,
    remaining: 29800,
  },
  {
    id: "PRJ-003",
    title: "Rural Water Quality Monitoring System",
    approved: 22000,
    spent: 17500,
    remaining: 4500,
  },
];

const BUDGET_AGGREGATE = {
  totalApproved: 70000,
  totalSpent: 35700,
  totalRemaining: 34300,
  latestRequest: {
    project: "AI-Based Crop Disease Detection",
    item: "Lab Equipment (Spectrophotometer)",
    amount: 5000,
    status: "Pending Finance Approval",
  },
};

const ADVISOR_FEEDBACK = [
  {
    id: 1,
    name: "Dr. Kebede Tadesse",
    role: "Advisor",
    initials: "KT",
    comment: "Please revise Section 3.2 — methodology needs more detail on sample size justification.",
    document: "Chapter 3 - Methodology",
    project: "AI-Based Crop Disease Detection",
    time: "2h ago",
  },
  {
    id: 2,
    name: "Prof. Abebe Worku",
    role: "Evaluator",
    initials: "AW",
    comment: "Good progress on literature review. Consider adding recent 2024 papers on transfer learning.",
    document: "Chapter 2 - Literature Review",
    project: "AI-Based Crop Disease Detection",
    time: "1d ago",
  },
  {
    id: 3,
    name: "Dr. Sara Alemu",
    role: "Advisor",
    initials: "SA",
    comment: "Data collection phase looks solid. Proceed with field testing next week.",
    document: "Progress Report #2",
    project: "Rural Water Quality Monitoring",
    time: "2d ago",
  },
];

const MY_TASKS = [
  {
    id: 1,
    title: "Upload ethics clearance form",
    due: "2 days ago",
    overdue: true,
    priority: "high" as const,
    project: "AI-Based Crop Disease",
  },
  {
    id: 2,
    title: "Submit revised methodology chapter",
    due: "Tomorrow",
    overdue: false,
    priority: "high" as const,
    project: "AI-Based Crop Disease",
  },
  {
    id: 3,
    title: "Prepare defence presentation slides",
    due: "In 5 days",
    overdue: false,
    priority: "medium" as const,
    project: "AI-Based Crop Disease",
  },
  {
    id: 4,
    title: "Submit water sample test results",
    due: "In 3 days",
    overdue: false,
    priority: "medium" as const,
    project: "Rural Water Quality",
  },
  {
    id: 5,
    title: "Review co-researcher's data analysis",
    due: "In 1 week",
    overdue: false,
    priority: "low" as const,
    project: "Rural Water Quality",
  },
];

const MY_PUBLICATIONS = [
  {
    id: 1,
    title: "Machine Learning Approaches for Early Crop Disease Detection",
    journal: "Ethiopian Journal of Agricultural Sciences",
    status: "Under Review",
    stage: 2,
    project: "AI-Based Crop Disease Detection",
  },
  {
    id: 2,
    title: "IoT-Enabled Water Quality Sensors for Rural Communities",
    journal: "Journal of Environmental Engineering",
    status: "Draft",
    stage: 0,
    project: "Rural Water Quality Monitoring",
  },
];

const PUB_STAGES = ["Draft", "Submitted", "Under Review", "Accepted", "Published"];

// ─────────────────────────────────────────────────────────
// Component
// ─────────────────────────────────────────────────────────

export function ResearcherView() {
  const [selectedProposal, setSelectedProposal] = useState<Proposal | null>(null);
  const budgetPercent = Math.round((BUDGET_AGGREGATE.totalSpent / BUDGET_AGGREGATE.totalApproved) * 100);

  return (
    <div className="space-y-6">
      {/* ═══════════ PROPOSAL STAT CARDS (Clickable → Modal) ═══════════ */}
      <div>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-semibold text-muted-foreground text-sm uppercase tracking-widest">My Proposals</h2>
          <Badge variant="secondary" className="font-mono text-[10px]">
            {MY_PROPOSALS.length} active
          </Badge>
        </div>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {MY_PROPOSALS.map((p, idx) => {
            const progressPct = Math.round((p.currentStep / p.totalSteps) * 100);
            const isStuck = p.daysWaiting >= 5;
            return (
              <button type="button" key={p.id} onClick={() => setSelectedProposal(p)} className="group text-left">
                <motion.div
                  initial={{ y: 40, opacity: 0 }}
                  whileInView={{ y: 0, opacity: 1 }}
                  whileHover={{
                    y: -8,
                    scale: 1.03,
                    boxShadow: "0px 20px 40px rgba(0,0,0,0.15)",
                  }}
                  transition={{ duration: 0.4, delay: idx * 0.08 }}
                  viewport={{ once: true }}
                  className={`relative flex h-full flex-col overflow-hidden rounded-3xl border p-5 shadow-sm ${
                    isStuck
                      ? "border-amber-300 bg-amber-50/50 dark:border-amber-800/50 dark:bg-amber-950/30"
                      : "border-gray-300 bg-card dark:border-slate-800/50 dark:bg-slate-950/50"
                  }`}
                >
                  {/* Gradient top bar */}
                  <div
                    className={`absolute top-0 right-0 left-0 h-1 bg-gradient-to-r opacity-0 transition-opacity group-hover:opacity-100 ${
                      isStuck
                        ? "from-amber-400/60 via-amber-300/30 to-transparent"
                        : "from-primary/40 via-primary/20 to-transparent"
                    }`}
                  />

                  {/* Icon + Badge row */}
                  <div className="flex items-start justify-between">
                    <div
                      className={`flex h-10 w-10 items-center justify-center rounded-xl transition-all group-hover:scale-105 ${
                        isStuck
                          ? "bg-amber-100 text-amber-600 group-hover:bg-amber-500 group-hover:text-white dark:bg-amber-900/40"
                          : "bg-primary/10 text-primary group-hover:bg-primary group-hover:text-white"
                      }`}
                    >
                      <FileText className="h-5 w-5" />
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Badge variant="outline" className="font-mono text-[10px]">
                        {p.type}
                      </Badge>
                      {isStuck && <span className="text-amber-500 text-sm">⚠</span>}
                    </div>
                  </div>

                  {/* Title */}
                  <p className="mt-4 line-clamp-1 font-bold text-lg transition-colors group-hover:text-primary">
                    {p.title}
                  </p>
                  <p className="mt-1 font-mono text-muted-foreground text-xs">{p.id}</p>

                  {/* Progress bar */}
                  <div className="mt-4 flex items-center gap-2">
                    <Progress value={progressPct} className="h-1.5 flex-1" />
                    <span className="font-mono text-[11px] font-semibold text-foreground">
                      {p.currentStep}/{p.totalSteps}
                    </span>
                  </div>

                  {/* Footer: Step pill + Arrow */}
                  <div className="mt-3 flex items-center justify-between">
                    <span
                      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[10px] font-medium ${
                        isStuck
                          ? "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300"
                          : "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300"
                      }`}
                    >
                      <Clock className="h-2.5 w-2.5" />
                      {p.daysWaiting}d — {p.currentStepLabel}
                    </span>
                    <div className="flex h-8 w-8 translate-x-2 items-center justify-center rounded-full bg-primary/10 text-primary opacity-0 transition-all group-hover:translate-x-0 group-hover:opacity-100">
                      <ArrowRight className="h-4 w-4" />
                    </div>
                  </div>
                </motion.div>
              </button>
            );
          })}
        </div>
      </div>

      {/* ═══════════ PROPOSAL STEPPER MODAL ═══════════ */}
      <Dialog open={!!selectedProposal} onOpenChange={() => setSelectedProposal(null)}>
        <DialogContent className="sm:max-w-[550px]">
          <DialogHeader>
            <DialogTitle className="text-lg">{selectedProposal?.title}</DialogTitle>
            <DialogDescription className="flex items-center gap-2">
              <span className="font-mono text-xs">{selectedProposal?.id}</span>
              <Badge variant="outline" className="font-mono text-[10px]">
                {selectedProposal?.type}
              </Badge>
            </DialogDescription>
          </DialogHeader>

          {/* Visual Stepper */}
          <div className="mt-2 space-y-0">
            {selectedProposal?.steps.map((step, i) => (
              <div key={step.label} className="flex gap-3">
                {/* Connector + Node */}
                <div className="flex flex-col items-center">
                  <div
                    className={`flex h-8 w-8 items-center justify-center rounded-full border-2 ${
                      step.status === "completed"
                        ? "border-emerald-500 bg-emerald-500 text-white"
                        : step.status === "current"
                          ? "animate-pulse border-blue-500 bg-blue-50 text-blue-600 dark:bg-blue-950"
                          : "border-border bg-muted text-muted-foreground"
                    }`}
                  >
                    {step.status === "completed" ? (
                      <CheckCircle2 className="h-4 w-4" />
                    ) : step.status === "current" ? (
                      <Clock className="h-4 w-4" />
                    ) : (
                      <Circle className="h-3 w-3" />
                    )}
                  </div>
                  {i < (selectedProposal?.steps.length ?? 0) - 1 && (
                    <div
                      className={`w-0.5 flex-1 min-h-[24px] ${
                        step.status === "completed" ? "bg-emerald-400" : "bg-border"
                      }`}
                    />
                  )}
                </div>

                {/* Step Label */}
                <div className="pb-4 pt-1">
                  <p
                    className={`font-medium text-sm ${
                      step.status === "current"
                        ? "font-bold text-blue-600 dark:text-blue-400"
                        : step.status === "completed"
                          ? "text-emerald-600 dark:text-emerald-400"
                          : "text-muted-foreground"
                    }`}
                  >
                    {step.label}
                  </p>
                  {step.status === "completed" && step.date && (
                    <p className="mt-0.5 font-mono text-[10px] text-muted-foreground">Completed {step.date}</p>
                  )}
                  {step.status === "current" && step.holder && (
                    <p className="mt-0.5 rounded-full bg-blue-100 px-2 py-0.5 text-[10px] font-medium text-blue-700 inline-block dark:bg-blue-900/50 dark:text-blue-300">
                      {step.daysWaiting}d with {step.holder}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>

      {/* ═══════════ BUDGET SUMMARY + MY TASKS ═══════════ */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {/* Budget Overview (Multi-Project) */}
        <Card className="border-border/50 bg-card/50">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 font-semibold text-muted-foreground text-sm uppercase tracking-widest">
              <Wallet className="h-4 w-4 text-blue-400" />
              Budget Overview
            </CardTitle>
            <CardDescription className="text-xs">Across {MY_PROJECTS.length} active projects</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Aggregate Budget Bar */}
            <div>
              <div className="mb-2 flex justify-between text-xs">
                <span className="text-muted-foreground">
                  ETB {BUDGET_AGGREGATE.totalSpent.toLocaleString()} spent of ETB{" "}
                  {BUDGET_AGGREGATE.totalApproved.toLocaleString()}
                </span>
                <span className="font-mono font-semibold text-foreground">{budgetPercent}%</span>
              </div>
              <Progress value={budgetPercent} className="h-2.5" />
              <p className="mt-1.5 text-[10px] text-emerald-500">
                Remaining: ETB {BUDGET_AGGREGATE.totalRemaining.toLocaleString()}
              </p>
            </div>

            {/* Per-Project Breakdown */}
            <div className="space-y-2">
              {MY_PROJECTS.map((proj) => {
                const pct = Math.round((proj.spent / proj.approved) * 100);
                const isLow = proj.remaining < proj.approved * 0.15;
                return (
                  <div key={proj.id} className="rounded-md border border-border/40 p-2">
                    <div className="flex items-center justify-between">
                      <span className="max-w-[180px] truncate text-[11px] font-medium text-foreground">
                        {proj.title}
                      </span>
                      <span
                        className={`font-mono text-[10px] ${isLow ? "font-bold text-red-500" : "text-muted-foreground"}`}
                      >
                        {pct}%{isLow && " ⚠"}
                      </span>
                    </div>
                    <Progress value={pct} className="mt-1 h-1" />
                    <div className="mt-1 flex justify-between text-[9px] text-muted-foreground">
                      <span>
                        ETB {proj.spent.toLocaleString()} / {proj.approved.toLocaleString()}
                      </span>
                      <span className={isLow ? "font-semibold text-red-500" : ""}>
                        Left: ETB {proj.remaining.toLocaleString()}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Latest Budget Request */}
            <div className="rounded-lg border border-amber-200 bg-amber-50/50 p-3 dark:border-amber-900/50 dark:bg-amber-950/20">
              <p className="flex items-center gap-1.5 font-bold text-[10px] text-amber-700 uppercase tracking-wider dark:text-amber-400">
                <Clock className="h-3 w-3" />
                Latest Request
              </p>
              <p className="mt-1 font-medium text-sm text-foreground">{BUDGET_AGGREGATE.latestRequest.item}</p>
              <p className="mt-0.5 text-[10px] text-muted-foreground">{BUDGET_AGGREGATE.latestRequest.project}</p>
              <div className="mt-1.5 flex items-center justify-between">
                <span className="font-mono font-semibold text-sm text-amber-700 dark:text-amber-300">
                  ETB {BUDGET_AGGREGATE.latestRequest.amount.toLocaleString()}
                </span>
                <Badge variant="outline" className="border-amber-300 text-[10px] text-amber-700 dark:text-amber-400">
                  {BUDGET_AGGREGATE.latestRequest.status}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* My Tasks (Multi-Project) */}
        <Card className="border-border/50 bg-card/50">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2 font-semibold text-muted-foreground text-sm uppercase tracking-widest">
                <FileText className="h-4 w-4 text-violet-400" />
                My Tasks
              </CardTitle>
              <Badge variant={MY_TASKS.some((t) => t.overdue) ? "destructive" : "secondary"} className="text-[10px]">
                {MY_TASKS.filter((t) => t.overdue).length} overdue
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-2">
            {MY_TASKS.map((task) => (
              <div
                key={task.id}
                className={`flex items-center gap-3 rounded-lg border p-2.5 transition-colors ${
                  task.overdue
                    ? "border-red-200 bg-red-50/50 dark:border-red-900/50 dark:bg-red-950/20"
                    : "border-border/50 hover:bg-muted/30"
                }`}
              >
                {/* Priority Indicator */}
                <div
                  className={`h-2 w-2 flex-shrink-0 rounded-full ${
                    task.priority === "high"
                      ? "bg-red-500"
                      : task.priority === "medium"
                        ? "bg-amber-500"
                        : "bg-blue-400"
                  }`}
                />
                {/* Task Content */}
                <div className="min-w-0 flex-1">
                  <p
                    className={`text-sm ${task.overdue ? "font-semibold text-red-700 dark:text-red-300" : "text-foreground"}`}
                  >
                    {task.title}
                  </p>
                  <p className="text-[10px] text-muted-foreground">{task.project}</p>
                </div>
                {/* Due Date */}
                <span
                  className={`flex-shrink-0 text-[11px] ${
                    task.overdue
                      ? "flex items-center gap-1 font-bold text-red-600 dark:text-red-400"
                      : "text-muted-foreground"
                  }`}
                >
                  {task.overdue && <AlertTriangle className="h-3 w-3" />}
                  {task.due}
                </span>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* ═══════════ ADVISOR FEEDBACK + PUBLICATIONS ═══════════ */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {/* Advisor Feedback (Multi-Project) */}
        <Card className="border-border/50 bg-card/50">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 font-semibold text-muted-foreground text-sm uppercase tracking-widest">
              <MessageSquare className="h-4 w-4 text-emerald-400" />
              Advisor &amp; Evaluator Feedback
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {ADVISOR_FEEDBACK.map((fb) => (
              <div
                key={fb.id}
                className="flex gap-3 rounded-lg border border-border/50 p-3 transition-colors hover:bg-muted/20"
              >
                <Avatar className="h-8 w-8 flex-shrink-0">
                  <AvatarFallback className="bg-emerald-100 text-[10px] text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300">
                    {fb.initials}
                  </AvatarFallback>
                </Avatar>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <span className="truncate font-semibold text-xs text-foreground">{fb.name}</span>
                    <span className="flex-shrink-0 text-[10px] text-muted-foreground">{fb.time}</span>
                  </div>
                  <p className="mt-0.5 text-muted-foreground text-xs leading-relaxed">{fb.comment}</p>
                  <div className="mt-1.5 flex items-center justify-between">
                    <button
                      type="button"
                      className="flex items-center gap-1 text-[10px] text-blue-600 transition-colors hover:text-blue-800 dark:text-blue-400"
                    >
                      <ArrowRight className="h-2.5 w-2.5" />
                      {fb.document}
                    </button>
                    <span className="max-w-[100px] truncate text-[9px] text-muted-foreground">{fb.project}</span>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Publication Progress (Multi-Publication) */}
        <Card className="border-border/50 bg-card/50">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 font-semibold text-muted-foreground text-sm uppercase tracking-widest">
              <BookOpen className="h-4 w-4 text-amber-400" />
              Publication Progress
            </CardTitle>
            <CardDescription className="text-xs">{MY_PUBLICATIONS.length} papers across your projects</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {MY_PUBLICATIONS.map((pub) => {
              return (
                <div key={pub.id} className="rounded-lg border border-border/50 p-3">
                  {/* Paper Info */}
                  <p className="font-semibold text-sm text-foreground leading-snug">{pub.title}</p>
                  <p className="mt-0.5 text-[10px] text-muted-foreground">{pub.journal}</p>
                  <p className="mt-0.5 text-[9px] text-muted-foreground/70">{pub.project}</p>

                  {/* Mini Pipeline */}
                  <div className="mt-3 flex items-center gap-1.5">
                    {PUB_STAGES.map((stage, i) => (
                      <div key={stage} className="flex flex-1 items-center">
                        <div
                          className={`flex h-5 w-5 items-center justify-center rounded-full ${
                            i < pub.stage
                              ? "bg-emerald-500 text-white"
                              : i === pub.stage
                                ? "border-2 border-amber-500 bg-amber-50 text-amber-600 dark:bg-amber-950"
                                : "border border-border bg-muted"
                          }`}
                        >
                          {i < pub.stage ? (
                            <CheckCircle2 className="h-3 w-3" />
                          ) : i === pub.stage ? (
                            <Clock className="h-2.5 w-2.5" />
                          ) : (
                            <Circle className="h-2 w-2 text-muted-foreground" />
                          )}
                        </div>
                        {i < PUB_STAGES.length - 1 && (
                          <div className={`mx-0.5 h-px flex-1 ${i < pub.stage ? "bg-emerald-400" : "bg-border"}`} />
                        )}
                      </div>
                    ))}
                  </div>
                  {/* Stage Labels */}
                  <div className="mt-1 flex justify-between">
                    {PUB_STAGES.map((stage, i) => (
                      <span
                        key={stage}
                        className={`flex-1 text-center text-[8px] ${
                          i === pub.stage
                            ? "font-bold text-amber-600 dark:text-amber-400"
                            : i < pub.stage
                              ? "text-emerald-600 dark:text-emerald-400"
                              : "text-muted-foreground"
                        }`}
                      >
                        {stage}
                      </span>
                    ))}
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
