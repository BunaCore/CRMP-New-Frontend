"use client";

import { useCallback, useMemo, useState } from "react";

import { useQuery } from "@tanstack/react-query";
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
import { Skeleton } from "@/components/ui/skeleton";
import { useSession } from "@/context/SessionContext";
import { useMyBudgetProjects } from "@/lib/api/budget/queries";
import { apiClient } from "@/lib/api/client";
import type { ProjectListItem } from "@/lib/api/projects/types";
import { getMyProposals } from "@/lib/api/proposals/queries";
import { shortProposalId } from "@/lib/api/proposals/utils";
import { useMyTasks } from "@/lib/api/task-management/queries";
import type { Task } from "@/lib/api/task-management/types";
import type { WorkspaceInfo } from "@/types/editor";

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

// (Mock data removed; we now use real data from the API)
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

function BudgetPieChart() {
  const { user } = useSession();
  const hasBudgetPermission = useMemo(() => {
    if (!user) return false;
    const hasKey = user.permissions?.includes("budget:view");
    const hasRole = user.roles?.some((r) => ["STUDENT", "FACULTY", "RAD", "FINANCE"].includes(r));
    return !!(hasKey || hasRole);
  }, [user]);

  const { data: rawProjects, isLoading } = useMyBudgetProjects({
    enabled: hasBudgetPermission,
  });
  const id = "budget-pie-interactive";

  // Filter out UG projects which have no budget
  const projects = useMemo(() => {
    return rawProjects?.filter((p) => p.projectType !== "UG") || [];
  }, [rawProjects]);

  const [activeProject, setActiveProject] = useState<string>("");

  // Auto-select first project
  useMemo(() => {
    if (projects.length > 0 && !activeProject) {
      setActiveProject(projects[0].projectId);
    }
  }, [projects, activeProject]);

  const activeIndex = useMemo(() => {
    const idx = projects.findIndex((item) => item.projectId === activeProject);
    return idx === -1 ? 0 : idx;
  }, [activeProject, projects]);

  const chartData = useMemo(
    () =>
      projects.map((proj) => ({
        ...proj,
        approved: Number(proj.totalApprovedBudget),
        spent: Number(proj.totalDisbursed),
        remaining: Number(proj.totalApprovedBudget) - Number(proj.totalDisbursed),
        fill: `var(--color-${proj.projectId})`,
      })),
    [projects],
  );

  const chartConfig = useMemo(() => {
    return projects.reduce(
      (acc, proj, index) => {
        const alphaValues = ["", "CC", "99", "66", "33"];
        acc[proj.projectId] = {
          label: proj.title,
          color: `#1447E6${alphaValues[index % 5] || "11"}`,
        };
        return acc;
      },
      {
        approved: { label: "Approved" },
        spent: { label: "Spent" },
        remaining: { label: "Remaining" },
      } as ChartConfig,
    );
  }, [projects]);

  const aggregate = useMemo(() => {
    let totalApproved = 0;
    let totalSpent = 0;
    for (const p of projects) {
      totalApproved += Number(p.totalApprovedBudget);
      totalSpent += Number(p.totalDisbursed);
    }
    return {
      totalApproved,
      totalSpent,
      totalRemaining: totalApproved - totalSpent,
    };
  }, [projects]);

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
  const pct =
    activeProjData && activeProjData.approved > 0
      ? Math.round((activeProjData.spent / activeProjData.approved) * 100)
      : 0;
  const isLow = activeProjData && activeProjData.remaining < activeProjData.approved * 0.15;

  if (isLoading) {
    return <Skeleton className="h-[380px] w-full rounded-xl" />;
  }

  if (projects.length === 0) {
    return null; // Don't render budget overview if no projects with budget
  }

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
              {projects.map((proj) => {
                const key = proj.projectId;
                const config = chartConfig[key as keyof typeof chartConfig];
                if (!config) return null;

                const pData = chartData.find((p) => p.projectId === key);
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
          Total Approved: ETB {aggregate.totalApproved.toLocaleString()}
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

// ─────────────────────────────────────────────────────────
// Live Data Hook — Aggregates stats across user's projects
// ─────────────────────────────────────────────────────────
function useResearcherStats(userId: string | undefined) {
  return useQuery({
    queryKey: ["researcher-dashboard-stats", userId],
    queryFn: async () => {
      // 1. Fetch the current user's projects
      const projectsRes = await apiClient.get<ProjectListItem[]>("/projects");
      const projects = Array.isArray(projectsRes.data) ? projectsRes.data : [];

      if (projects.length === 0) {
        return { projects: 0, tasks: 0, overdueTasks: 0, workspaces: 0 };
      }

      // 2. Fetch tasks and workspaces for each project in parallel
      const [tasksResults, workspacesResults] = await Promise.all([
        Promise.allSettled(
          projects.map((p) => apiClient.get<{ tasks: Task[] } | Task[]>(`/projects/${p.projectId}/tasks`)),
        ),
        Promise.allSettled(projects.map((p) => apiClient.get<WorkspaceInfo[]>(`/workspaces/project/${p.projectId}`))),
      ]);

      // 3. Aggregate tasks assigned to this user
      let totalTasks = 0;
      let overdueTasks = 0;
      const now = new Date();
      for (const result of tasksResults) {
        if (result.status === "fulfilled") {
          const raw = result.value.data;
          const tasks: Task[] = Array.isArray(raw) ? raw : ((raw as { tasks: Task[] })?.tasks ?? []);
          for (const task of tasks) {
            if (!userId || task.assigneeId === userId) {
              totalTasks++;
              if (task.dueDate && new Date(task.dueDate) < now && task.status !== "done") {
                overdueTasks++;
              }
            }
          }
        }
      }

      // 4. Aggregate workspaces
      let totalWorkspaces = 0;
      for (const result of workspacesResults) {
        if (result.status === "fulfilled") {
          const ws = result.value.data;
          totalWorkspaces += Array.isArray(ws) ? ws.length : 0;
        }
      }

      return {
        projects: projects.length,
        tasks: totalTasks,
        overdueTasks,
        workspaces: totalWorkspaces,
      };
    },
    enabled: !!userId,
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
    refetchOnWindowFocus: false,
  });
}

export function ResearcherView() {
  const [selectedProposal, setSelectedProposal] = useState<Proposal | null>(null);
  const { user } = useSession();

  // ── Live data from backend ──────────────────────────────────
  const { data: stats, isLoading: statsLoading } = useResearcherStats(user?.id);

  // Proposals data
  const { data: apiProposals, isLoading: proposalsLoading } = useQuery({
    queryKey: ["myProposals"],
    queryFn: getMyProposals,
  });

  // Tasks data
  const { data: apiTasks, isLoading: tasksLoading } = useMyTasks();

  const myTasks = useMemo(() => {
    if (!apiTasks) return [];
    const now = new Date();

    // Filter active tasks that have a due date
    const filteredTasks = apiTasks.filter((t) => t.dueDate && t.status !== "done");

    // Sort by due date ascending
    const sortedTasks = [...filteredTasks].sort((a, b) => {
      if (!a.dueDate || !b.dueDate) return 0;
      return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
    });

    // Limit to 5 upcoming deadlines
    const slicedTasks = sortedTasks.slice(0, 5);

    return slicedTasks.map((t) => {
      let dueStr = "No due date";
      let overdue = false;
      if (t.dueDate) {
        const d = new Date(t.dueDate);
        overdue = d < now && t.status !== "done";
        const diffDays = Math.round((d.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
        if (diffDays === 0) dueStr = "Today";
        else if (diffDays === 1) dueStr = "Tomorrow";
        else if (diffDays === -1) dueStr = "Yesterday";
        else if (diffDays < -1) dueStr = `${Math.abs(diffDays)} days ago`;
        else dueStr = `In ${diffDays} days`;
      }
      return {
        id: t.id,
        title: t.title,
        due: dueStr,
        overdue,
        priority: t.priority as "high" | "medium" | "low",
        project: t.projectTitle || "Unassigned",
      };
    });
  }, [apiTasks]);

  const activeProposals = useMemo(() => {
    if (!apiProposals) return [];

    // Filter to active ones
    const active = apiProposals.filter((p) =>
      ["Under_Review", "Revision", "Needs_Revision", "Pending"].includes(p.status),
    );

    return active.map((p) => {
      const steps: ProposalStep[] = p.workflow.steps.map((s) => {
        let status: "completed" | "current" | "pending" = "pending";
        if (s.stepOrder < p.workflow.currentStepOrder) status = "completed";
        else if (s.stepOrder === p.workflow.currentStepOrder) status = "current";

        if (s.isActive) status = "current";
        else if (s.status === "Accepted") status = "completed";

        return {
          label: s.label,
          status,
          holder: s.role,
          daysWaiting: s.isActive ? 2 : undefined, // Simulated
          date: undefined,
        };
      });

      const currentStepInfo = p.workflow.steps.find((s) => s.isActive) || p.workflow.steps[p.workflow.steps.length - 1];

      return {
        id: shortProposalId(p.id),
        rawId: p.id,
        title: p.title,
        type: p.type,
        currentStep: p.workflow.currentStepOrder || 1,
        totalSteps: p.workflow.steps.length || 1,
        currentStepLabel: currentStepInfo?.label || "Unknown",
        holder: currentStepInfo?.role || "Unknown",
        daysWaiting: 2, // Simulated
        steps,
      };
    });
  }, [apiProposals]);

  return (
    <div className="space-y-6">
      {/* ═══════════ RESEARCHER STATUS OVERVIEW ═══════════ */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {[
          {
            label: "Assigned Tasks",
            value: stats?.tasks ?? 0,
            sub: `${stats?.overdueTasks ?? 0} overdue items`,
            color: "text-amber-500",
            icon: CheckCircle2,
          },
          {
            label: "Active Workspaces",
            value: stats?.workspaces ?? 0,
            sub: "Collaborative projects",
            color: "text-blue-500",
            icon: Users,
          },
          {
            label: "Research Output",
            value: stats?.projects ?? 0,
            sub: "Projects & Publications",
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
                    {statsLoading ? (
                      <Skeleton className="mb-2 h-10 w-16" />
                    ) : (
                      <p className="font-bold font-mono text-4xl text-foreground tracking-tight dark:text-white">
                        {m.value}
                      </p>
                    )}
                    {statsLoading ? (
                      <Skeleton className="mt-2 h-4 w-24" />
                    ) : (
                      <p className={`mt-2 font-semibold text-[11px] ${m.color} dark:brightness-125`}>{m.sub}</p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* ═══════════ PROPOSAL STAT CARDS (Clickable → Modal) ═══════════ */}
      {(proposalsLoading || activeProposals.length > 0) && (
        <div>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-semibold text-muted-foreground text-sm uppercase tracking-widest">My Proposals</h2>
            <Badge variant="secondary" className="font-mono text-[10px]">
              {activeProposals.length} active
            </Badge>
          </div>

          {proposalsLoading ? (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              <Skeleton className="h-[250px] w-full rounded-3xl" />
              <Skeleton className="h-[250px] w-full rounded-3xl" />
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {activeProposals.map((p, idx) => {
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
          )}
        </div>
      )}

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
              <Badge variant={myTasks.some((t) => t.overdue) ? "destructive" : "secondary"} className="text-[10px]">
                {myTasks.filter((t) => t.overdue).length} overdue
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="relative z-10 flex h-[280px] flex-col px-4 pt-0 pb-4">
            <div className="custom-scrollbar flex-1 overflow-y-auto px-1">
              <div className="relative flex flex-col pt-2 pb-4">
                {tasksLoading ? (
                  <div className="flex flex-col gap-2 p-2">
                    <Skeleton className="h-12 w-full rounded-xl" />
                    <Skeleton className="h-12 w-full rounded-xl" />
                    <Skeleton className="h-12 w-full rounded-xl" />
                  </div>
                ) : myTasks.length === 0 ? (
                  <div className="flex h-[200px] flex-col items-center justify-center text-center">
                    <CheckCircle2 className="mb-2 h-8 w-8 text-muted-foreground opacity-50" />
                    <p className="text-muted-foreground text-xs">All caught up! No tasks assigned.</p>
                  </div>
                ) : (
                  myTasks.map((task, index) => {
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
                  })
                )}
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
