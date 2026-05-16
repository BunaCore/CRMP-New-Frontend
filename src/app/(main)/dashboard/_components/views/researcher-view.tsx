"use client";

import { useCallback, useMemo, useState } from "react";

import { motion } from "framer-motion";
import {
  AlertTriangle,
  ArrowRight,
  BarChart3,
  BookOpen,
  CheckCircle2,
  Circle,
  Clock,
  FileText,
  MessageSquare,
  Users,
  Wallet,
} from "lucide-react";
import { Label, Pie, PieChart, Sector } from "recharts";
import type { PieSectorShapeProps } from "recharts/types/polar/Pie";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { type ChartConfig, ChartContainer, ChartStyle, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

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

const chartConfig = MY_PROJECTS.reduce(
  (acc, proj, index) => {
    const alphaValues = ["", "CC", "99", "66", "33"];
    acc[proj.id] = {
      label: proj.title,
      color: `#1447E6${alphaValues[index % 5]}`,
    };
    return acc;
  },
  {
    approved: { label: "Approved" },
    spent: { label: "Spent" },
    remaining: { label: "Remaining" },
  } as ChartConfig,
);

function BudgetPieChart() {
  const id = "budget-pie-interactive";
  const [activeProject, setActiveProject] = useState(MY_PROJECTS[0].id);

  const activeIndex = useMemo(() => MY_PROJECTS.findIndex((item) => item.id === activeProject), [activeProject]);
  const projects = useMemo(() => MY_PROJECTS.map((item) => item.id), []);
  const chartData = useMemo(
    () =>
      MY_PROJECTS.map((proj) => ({
        ...proj,
        fill: `var(--color-${proj.id})`,
      })),
    [],
  );

  const renderPieShape = useCallback(
    ({ index, outerRadius = 0, ...props }: PieSectorShapeProps) => {
      if (index === activeIndex) {
        return (
          <g>
            <Sector {...props} outerRadius={outerRadius + 6} />
            <Sector {...props} outerRadius={outerRadius + 14} innerRadius={outerRadius + 8} />
          </g>
        );
      }
      return <Sector {...props} outerRadius={outerRadius} />;
    },
    [activeIndex],
  );

  const activeProjData = chartData[activeIndex];
  const pct = Math.round((activeProjData.spent / activeProjData.approved) * 100);
  const isLow = activeProjData.remaining < activeProjData.approved * 0.15;

  return (
    <Card data-chart={id} className="flex flex-col border-border/50 bg-card/50">
      <ChartStyle id={id} config={chartConfig} />
      <CardHeader className="pb-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Wallet className="h-4 w-4 text-blue-400" />
            <CardTitle className="font-semibold text-muted-foreground text-sm uppercase tracking-widest">
              Budget Overview
            </CardTitle>
          </div>
          <Select value={activeProject} onValueChange={setActiveProject}>
            <SelectTrigger
              className="h-6 w-fit min-w-[130px] max-w-[180px] rounded-full border-none bg-muted/50 px-3 text-[10px] shadow-none transition-colors hover:bg-muted/80 focus:ring-0 focus:ring-offset-0"
              aria-label="Select a project"
            >
              <SelectValue placeholder="Select project" />
            </SelectTrigger>
            <SelectContent align="end" className="rounded-2xl border-border/50 bg-card/95 backdrop-blur-md">
              {projects.map((key) => {
                const config = chartConfig[key as keyof typeof chartConfig];
                if (!config) return null;

                const pData = chartData.find((p) => p.id === key);
                const pLow = pData && pData.remaining < pData.approved * 0.15;

                return (
                  <SelectItem key={key} value={key} className="rounded-xl focus:bg-muted/80">
                    <div className="flex items-center gap-2 text-[10px]">
                      <span
                        className="flex h-2 w-2 shrink-0 rounded-full"
                        style={{ backgroundColor: `var(--color-${key})` }}
                      />
                      <span className="max-w-[120px] truncate font-medium">{config?.label}</span>
                      {pLow && <AlertTriangle className="h-2.5 w-2.5 text-red-500" />}
                    </div>
                  </SelectItem>
                );
              })}
            </SelectContent>
          </Select>
        </div>
        <CardDescription className="mt-1 text-xs">
          Total Approved: ETB {BUDGET_AGGREGATE.totalApproved.toLocaleString()}
        </CardDescription>
      </CardHeader>

      <CardContent className="flex flex-1 flex-col justify-center pt-2 pb-2">
        <ChartContainer id={id} config={chartConfig} className="mx-auto aspect-square w-full max-w-[180px]">
          <PieChart>
            <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
            <Pie
              data={chartData}
              dataKey="approved"
              nameKey="title"
              innerRadius={45}
              strokeWidth={5}
              shape={renderPieShape}
            >
              <Label
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    return (
                      <text x={viewBox.cx} y={viewBox.cy} textAnchor="middle" dominantBaseline="middle">
                        <tspan x={viewBox.cx} y={viewBox.cy} className="fill-foreground font-bold text-2xl">
                          {pct}%
                        </tspan>
                        <tspan x={viewBox.cx} y={(viewBox.cy || 0) + 20} className="fill-muted-foreground text-[10px]">
                          Spent
                        </tspan>
                      </text>
                    );
                  }
                }}
              />
            </Pie>
          </PieChart>
        </ChartContainer>

        <div className="mt-4 flex flex-col items-center justify-center space-y-1 text-sm">
          <div className="w-full truncate px-4 text-center font-medium text-foreground">{activeProjData.title}</div>
          <div className="mt-2 flex gap-4 text-muted-foreground text-xs">
            <span className="flex items-center gap-1">
              <div className="h-2 w-2 rounded-full bg-emerald-500" />
              Spent: {activeProjData.spent.toLocaleString()}
            </span>
            <span className={`flex items-center gap-1 ${isLow ? "font-bold text-red-500" : ""}`}>
              <div className={`h-2 w-2 rounded-full ${isLow ? "bg-red-500" : "bg-amber-500"}`} />
              Left: {activeProjData.remaining.toLocaleString()}
              {isLow && " ⚠"}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function ResearcherView() {
  const [selectedProposal, setSelectedProposal] = useState<Proposal | null>(null);

  return (
    <div className="space-y-6">
      {/* ═══════════ RESEARCHER STATUS OVERVIEW ═══════════ */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {[
          {
            label: "Assigned Tasks",
            value: MY_TASKS.length,
            sub: `${MY_TASKS.filter((t) => t.overdue).length} overdue items`,
            color: "text-amber-500",
            icon: CheckCircle2,
          },
          {
            label: "Active Workspaces",
            value: "3",
            sub: "Collaborative projects",
            color: "text-blue-500",
            icon: Users,
          },
          {
            label: "Research Output",
            value: MY_PUBLICATIONS.length,
            sub: "Publications & Patents",
            color: "text-emerald-500",
            icon: BarChart3,
          },
        ].map((m, idx) => (
          <motion.div
            key={m.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: idx * 0.1 }}
            whileHover={{ y: -4, transition: { duration: 0.2 } }}
          >
            <Card className="h-full border-border/50 bg-white transition-shadow hover:shadow-md dark:border-white/5 dark:bg-[#0D0D0D] dark:hover:shadow-primary/5 dark:hover:shadow-xl">
              <CardContent className="p-6">
                <div className="flex flex-col gap-4">
                  <div className="flex items-center justify-between">
                    <p className="font-bold text-[11px] text-muted-foreground uppercase tracking-[0.15em]">{m.label}</p>
                    <m.icon className={`h-5 w-5 ${m.color} opacity-80`} />
                  </div>
                  <div>
                    <p className="font-bold font-mono text-4xl text-foreground tracking-tight dark:text-white">
                      {m.value}
                    </p>
                    <p className={`mt-2 font-semibold text-[11px] ${m.color} dark:brightness-125`}>{m.sub}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

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
                    <span className="font-mono font-semibold text-[11px] text-foreground">
                      {p.currentStep}/{p.totalSteps}
                    </span>
                  </div>

                  {/* Footer: Step pill + Arrow */}
                  <div className="mt-3 flex items-center justify-between">
                    <span
                      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 font-medium text-[10px] ${
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
                      className={`min-h-[24px] w-0.5 flex-1 ${
                        step.status === "completed" ? "bg-emerald-400" : "bg-border"
                      }`}
                    />
                  )}
                </div>

                {/* Step Label */}
                <div className="pt-1 pb-4">
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
                    <p className="mt-0.5 inline-block rounded-full bg-blue-100 px-2 py-0.5 font-medium text-[10px] text-blue-700 dark:bg-blue-900/50 dark:text-blue-300">
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
        <div className="flex flex-col gap-4">
          <BudgetPieChart />
        </div>

        {/* My Tasks (Multi-Project) */}
        <Card className="group relative self-start overflow-hidden rounded-xl border-violet-500/20 bg-violet-500/5 shadow-sm transition-all hover:shadow-md">
          <div className="-top-4 -right-4 pointer-events-none absolute p-4 opacity-[0.03] transition-all group-hover:scale-110 group-hover:opacity-[0.05]">
            <FileText className="h-24 w-24 text-violet-500" />
          </div>
          <CardHeader className="relative z-10 pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2 font-semibold text-foreground text-sm uppercase tracking-widest">
                <FileText className="h-4 w-4 text-violet-500" />
                My Tasks
              </CardTitle>
              <Badge variant={MY_TASKS.some((t) => t.overdue) ? "destructive" : "secondary"} className="text-[10px]">
                {MY_TASKS.filter((t) => t.overdue).length} overdue
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="relative z-10 flex h-[280px] flex-col px-4 pt-0 pb-4">
            <div className="custom-scrollbar flex-1 overflow-y-auto px-1">
              <div className="relative flex flex-col pt-2 pb-4">
                {[...MY_TASKS]
                  .sort((a, b) => {
                    const priorityMap = { high: 3, medium: 2, low: 1 };
                    return priorityMap[b.priority] - priorityMap[a.priority];
                  })
                  .map((task, index) => {
                    const isTop = index === 0;

                    return (
                      <motion.div
                        key={task.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className={`hover:-translate-y-1 relative rounded-xl bg-card p-2.5 shadow-sm transition-transform hover:shadow-md ${
                          task.overdue ? "border border-red-500 dark:border-red-500" : "border border-border/60"
                        } ${index > 0 ? "-mt-4 pt-7" : ""}`}
                        style={{ zIndex: 50 - index }}
                      >
                        <div className="flex items-start justify-between">
                          {/* Top left short bar */}
                          <div className="flex flex-col gap-1.5">
                            {isTop && <div className="h-[3px] w-5 rounded-full bg-amber-400" />}
                          </div>
                          {/* Options Menu (Three dots) */}
                          <div className="mt-0.5 flex space-x-[2px]">
                            <div className="h-0.5 w-0.5 rounded-full bg-muted-foreground/50" />
                            <div className="h-0.5 w-0.5 rounded-full bg-muted-foreground/50" />
                            <div className="h-0.5 w-0.5 rounded-full bg-muted-foreground/50" />
                          </div>
                        </div>

                        <div className={`mt-1.5 ${isTop ? "mb-2" : "mb-0.5"}`}>
                          <h3
                            className={`font-semibold ${
                              task.overdue ? "text-red-600 dark:text-red-400" : "text-foreground"
                            } ${isTop ? "text-xs leading-tight" : "line-clamp-1 text-[10px] opacity-80"}`}
                          >
                            {task.title}
                          </h3>

                          {/* Project Name and Priority Dot */}
                          <div className="mt-1 flex items-center gap-1.5">
                            <div
                              className={`h-1.5 w-1.5 flex-shrink-0 rounded-full ${
                                task.priority === "high"
                                  ? "bg-red-500"
                                  : task.priority === "medium"
                                    ? "bg-amber-500"
                                    : "bg-blue-400"
                              }`}
                            />
                            <span className="truncate font-medium text-[9px] text-muted-foreground">
                              {task.project}
                            </span>
                          </div>

                          {isTop && (
                            <div className="mt-1.5 flex items-center gap-1.5">
                              <Badge
                                variant={task.overdue ? "destructive" : "secondary"}
                                className={`border-none px-1 py-0 text-[8px] ${
                                  task.overdue ? "" : "bg-muted text-muted-foreground"
                                }`}
                              >
                                {task.overdue && <AlertTriangle className="mr-1 inline h-2 w-2" />}
                                {task.due}
                              </Badge>
                            </div>
                          )}
                        </div>

                        {/* Bottom Avatars & Comments */}
                        <div className="mt-auto flex items-center justify-between">
                          {isTop ? (
                            <span className="font-medium text-[8px] text-muted-foreground">6 comments</span>
                          ) : (
                            <span /> // Spacer
                          )}

                          <div className="-space-x-1 flex">
                            <Avatar className="h-4 w-4 border border-background">
                              <AvatarImage src={`https://i.pravatar.cc/150?u=${task.id}`} />
                              <AvatarFallback>A</AvatarFallback>
                            </Avatar>
                            {isTop && (
                              <>
                                <Avatar className="h-4 w-4 border border-background">
                                  <AvatarImage src={`https://i.pravatar.cc/150?u=${task.id + 10}`} />
                                  <AvatarFallback>B</AvatarFallback>
                                </Avatar>
                                <div className="flex h-4 w-4 items-center justify-center rounded-full border border-background bg-slate-500 font-medium text-[6px] text-white">
                                  3+
                                </div>
                              </>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
              </div>
            </div>
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
                    <span className="truncate font-semibold text-foreground text-xs">{fb.name}</span>
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
                  <p className="font-semibold text-foreground text-sm leading-snug">{pub.title}</p>
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
