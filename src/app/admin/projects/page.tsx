"use client";

import type React from "react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertTriangle,
  BookOpen,
  Calendar,
  CheckCircle2,
  ChevronRight,
  Clock,
  Download,
  FileText,
  Filter,
  FolderOpen,
  Search,
  Users,
  XCircle,
} from "lucide-react";
import { Can } from "@/access-control/permission-gates";

// ─── TYPES ──────────────────────────────────────────────────────────
interface TeamMember {
  name: string;
  role: string;
  avatar: string;
  color: string;
}

interface TimelineEvent {
  date: string;
  label: string;
  status: "done" | "active" | "upcoming";
}

interface Project {
  id: string;
  name: string;
  code: string;
  pi: string;
  piAvatar: string;
  piColor: string;
  dept: string;
  status: "Active" | "Under Review" | "Completed" | "Suspended" | "Pending";
  progress: number;
  budget: string;
  startDate: string;
  endDate: string;
  abstract: string;
  team: TeamMember[];
  timeline: TimelineEvent[];
}

// ─── MOCK DATA ───────────────────────────────────────────────────────
const MOCK_PROJECTS: Project[] = [
  {
    id: "PRJ-001",
    name: "Advanced Deep Learning for Medical Imagery Analysis",
    code: "PRJ-001",
    pi: "Dr. L. Vance",
    piAvatar: "LV",
    piColor: "bg-purple-100 text-purple-700",
    dept: "Computer Science",
    status: "Active",
    progress: 72,
    budget: "$128,000",
    startDate: "Jan 2024",
    endDate: "Dec 2025",
    abstract:
      "This project investigates the application of deep convolutional networks and transformer-based architectures for automated disease detection in radiological imagery. The primary goal is to achieve radiologist-level accuracy on publicly available benchmark datasets.",
    team: [
      { name: "Dr. S. Patel", role: "Co-Investigator", avatar: "SP", color: "bg-blue-100 text-blue-700" },
      { name: "M. Chen", role: "Research Assistant", avatar: "MC", color: "bg-emerald-100 text-emerald-700" },
      { name: "Prof. A. Ibrahim", role: "Advisor", avatar: "AI", color: "bg-amber-100 text-amber-700" },
    ],
    timeline: [
      { date: "Jan 2024", label: "Project Kickoff & Setup", status: "done" },
      { date: "Jun 2024", label: "Phase 1: Data Collection Complete", status: "done" },
      { date: "Dec 2024", label: "Phase 2: Model Training & Evaluation", status: "active" },
      { date: "Jun 2025", label: "Phase 3: Clinical Trials & Validation", status: "upcoming" },
      { date: "Dec 2025", label: "Final Report & Publication", status: "upcoming" },
    ],
  },
  {
    id: "PRJ-002",
    name: "Sustainable Renewable Energy Infrastructure",
    code: "PRJ-002",
    pi: "Prof. E. Stark",
    piAvatar: "ES",
    piColor: "bg-emerald-100 text-emerald-700",
    dept: "Engineering",
    status: "Under Review",
    progress: 40,
    budget: "$245,000",
    startDate: "Mar 2024",
    endDate: "Mar 2026",
    abstract:
      "A comprehensive study on deploying scalable micro-grid solutions powered by solar and wind in rural sub-Saharan Africa. Analyzes cost efficiency, maintenance models, and socio-economic impact on local communities.",
    team: [
      { name: "Dr. F. Nakamura", role: "Co-Investigator", avatar: "FN", color: "bg-blue-100 text-blue-700" },
      { name: "B. Alemu", role: "Field Engineer", avatar: "BA", color: "bg-slate-200 text-slate-700" },
    ],
    timeline: [
      { date: "Mar 2024", label: "Proposal Approved", status: "done" },
      { date: "Sep 2024", label: "Feasibility Study", status: "done" },
      { date: "Mar 2025", label: "Pilot Deployment", status: "active" },
      { date: "Mar 2026", label: "Scale & Final Assessment", status: "upcoming" },
    ],
  },
  {
    id: "PRJ-003",
    name: "Quantum Computing Algorithm Optimization",
    code: "PRJ-003",
    pi: "Dr. A. Turing",
    piAvatar: "AT",
    piColor: "bg-blue-100 text-blue-700",
    dept: "Physics",
    status: "Completed",
    progress: 100,
    budget: "$310,000",
    startDate: "Feb 2022",
    endDate: "Feb 2024",
    abstract:
      "Research into hybrid classical-quantum algorithms for solving NP-hard optimization problems in logistics and molecular simulation. Results published in Nature Quantum Information.",
    team: [
      { name: "Dr. G. Bell", role: "Co-Investigator", avatar: "GB", color: "bg-indigo-100 text-indigo-700" },
      { name: "R. Feynman Jr.", role: "Researcher", avatar: "RF", color: "bg-rose-100 text-rose-700" },
    ],
    timeline: [
      { date: "Feb 2022", label: "Project Initiated", status: "done" },
      { date: "Aug 2022", label: "Literature Review Done", status: "done" },
      { date: "Feb 2023", label: "Algorithm Prototype", status: "done" },
      { date: "Aug 2023", label: "Performance Benchmarking", status: "done" },
      { date: "Feb 2024", label: "Publication & Closure", status: "done" },
    ],
  },
  {
    id: "PRJ-004",
    name: "Bioinformatics Genomic Sequencing Pipeline",
    code: "PRJ-004",
    pi: "Dr. E. Wong",
    piAvatar: "EW",
    piColor: "bg-rose-100 text-rose-700",
    dept: "Bioinformatics",
    status: "Suspended",
    progress: 28,
    budget: "$95,000",
    startDate: "May 2024",
    endDate: "May 2026",
    abstract:
      "Development of a scalable, open-source genomic pipeline for processing next-generation sequencing data with a focus on rare disease identification in Ethiopian populations. Suspended pending ethics board re-review.",
    team: [
      { name: "M. Haile", role: "Data Analyst", avatar: "MH", color: "bg-amber-100 text-amber-700" },
    ],
    timeline: [
      { date: "May 2024", label: "IRB Ethics Approval", status: "done" },
      { date: "Aug 2024", label: "Pipeline Architecture Design", status: "done" },
      { date: "Nov 2024", label: "Data Collection (Suspended)", status: "active" },
      { date: "Feb 2025", label: "Analysis Phase", status: "upcoming" },
    ],
  },
  {
    id: "PRJ-005",
    name: "Urban Traffic Flow AI Optimization",
    code: "PRJ-005",
    pi: "Prof. R. Musa",
    piAvatar: "RM",
    piColor: "bg-amber-100 text-amber-700",
    dept: "Urban Planning",
    status: "Pending",
    progress: 5,
    budget: "$78,000",
    startDate: "Apr 2025",
    endDate: "Apr 2027",
    abstract:
      "Using real-time sensor data and reinforcement learning to improve urban traffic signal coordination in Addis Ababa. Aims to reduce average commute time by 20%.",
    team: [
      { name: "H. Tesfaye", role: "ML Engineer", avatar: "HT", color: "bg-blue-100 text-blue-700" },
      { name: "Dr. Y. Kebede", role: "Advisor", avatar: "YK", color: "bg-emerald-100 text-emerald-700" },
    ],
    timeline: [
      { date: "Apr 2025", label: "Proposal Submission", status: "active" },
      { date: "Jul 2025", label: "Budget Approval", status: "upcoming" },
      { date: "Oct 2025", label: "Sensor Deployment", status: "upcoming" },
      { date: "Apr 2027", label: "Final Report", status: "upcoming" },
    ],
  },
];

// ─── HELPERS ──────────────────────────────────────────────────────────
const STATUS_CONFIG: Record<string, { label: string; className: string; icon: React.ReactNode }> = {
  Active:        { label: "Active",        className: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400", icon: <CheckCircle2 className="h-3 w-3" /> },
  "Under Review":{ label: "Under Review", className: "bg-blue-100    text-blue-700    dark:bg-blue-900/30    dark:text-blue-400",    icon: <Clock className="h-3 w-3" /> },
  Completed:     { label: "Completed",     className: "bg-slate-200   text-slate-600   dark:bg-slate-700     dark:text-slate-300",   icon: <BookOpen className="h-3 w-3" /> },
  Suspended:     { label: "Suspended",     className: "bg-red-100     text-red-700     dark:bg-red-900/30    dark:text-red-400",     icon: <XCircle className="h-3 w-3" /> },
  Pending:       { label: "Pending",       className: "bg-amber-100   text-amber-700   dark:bg-amber-900/30  dark:text-amber-400",   icon: <AlertTriangle className="h-3 w-3" /> },
};

const PROGRESS_COLOR = (p: number) =>
  p === 100 ? "bg-emerald-500" : p >= 60 ? "bg-blue-600" : p >= 30 ? "bg-amber-500" : "bg-red-500";

// ─── PAGE ────────────────────────────────────────────────────────────
export default function AdminProjectsPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [selected, setSelected] = useState<Project | null>(null);
  const [activeTab, setActiveTab] = useState<"overview" | "team" | "timeline">("overview");

  const filtered = MOCK_PROJECTS.filter((p) => {
    const matchSearch =
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.pi.toLowerCase().includes(search.toLowerCase()) ||
      p.code.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "All" || p.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const openDrawer = (project: Project) => {
    setSelected(project);
    setActiveTab("overview");
  };

  return (
    <div className="flex flex-1 flex-col gap-6 p-4 md:p-6 lg:p-8">
      {/* ── Header ── */}
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="flex items-center gap-2 font-bold text-2xl text-slate-900 tracking-tight dark:text-slate-100">
            <FolderOpen className="h-6 w-6 text-blue-600 dark:text-blue-500" />
            Projects Registry
          </h1>
          <p className="mt-0.5 text-slate-500 text-sm">Manage and inspect all active university research projects.</p>
        </div>
        <Can permission="ADMIN_VIEW">
          <Button className="h-9 rounded-lg bg-blue-600 font-semibold text-sm text-white shadow-sm hover:bg-blue-700">
            <Download className="mr-2 h-4 w-4" /> Export Registry
          </Button>
        </Can>
      </div>

      {/* ── Filter Bar ── */}
      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search className="-translate-y-1/2 absolute top-1/2 left-3 h-4 w-4 text-slate-400" />
          <Input
            placeholder="Search by project name, PI, or code..."
            className="h-9 rounded-lg border-slate-200 bg-white pl-9 text-sm dark:border-slate-800 dark:bg-slate-950"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <Filter className="ml-1 h-4 w-4 text-slate-400" />
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="h-9 w-[160px] rounded-lg border-slate-200 bg-white text-sm dark:border-slate-800 dark:bg-slate-950">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              {["All", "Active", "Under Review", "Completed", "Suspended", "Pending"].map((s) => (
                <SelectItem key={s} value={s}>{s}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* ── Table ── */}
      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-950">
        <Table>
          <TableHeader className="bg-slate-50 dark:bg-slate-900/50">
            <TableRow className="border-slate-200 dark:border-slate-800">
              <TableHead className="h-10 w-[35%] pl-5 font-semibold text-slate-500 text-xs uppercase tracking-wider">Project</TableHead>
              <TableHead className="h-10 font-semibold text-slate-500 text-xs uppercase tracking-wider">Principal Investigator</TableHead>
              <TableHead className="h-10 font-semibold text-slate-500 text-xs uppercase tracking-wider">Status</TableHead>
              <TableHead className="h-10 w-[180px] font-semibold text-slate-500 text-xs uppercase tracking-wider">Progress</TableHead>
              <TableHead className="h-10 font-semibold text-slate-500 text-xs uppercase tracking-wider">Budget</TableHead>
              <TableHead className="h-10 w-[80px]" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="py-16 text-center text-slate-400 text-sm italic">
                  No projects match your search.
                </TableCell>
              </TableRow>
            ) : (
              filtered.map((project) => {
                const cfg = STATUS_CONFIG[project.status];
                return (
                  <TableRow
                    key={project.id}
                    className="group cursor-pointer border-slate-100 transition-colors hover:bg-slate-50/70 dark:border-slate-800 dark:hover:bg-slate-900/40"
                    onClick={() => openDrawer(project)}
                  >
                    {/* Name + Code */}
                    <TableCell className="py-4 pl-5">
                      <div className="flex flex-col gap-0.5">
                        <span className="line-clamp-1 font-semibold text-[13px] text-slate-900 leading-tight dark:text-slate-100">{project.name}</span>
                        <span className="font-bold text-[11px] text-slate-400 uppercase tracking-wider">{project.code} · {project.dept}</span>
                      </div>
                    </TableCell>

                    {/* PI */}
                    <TableCell className="py-4">
                      <div className="flex items-center gap-2.5">
                        <Avatar className="h-7 w-7 shrink-0">
                          <AvatarFallback className={`font-bold text-[10px] ${project.piColor}`}>{project.piAvatar}</AvatarFallback>
                        </Avatar>
                        <span className="truncate font-medium text-[13px] text-slate-700 dark:text-slate-300">{project.pi}</span>
                      </div>
                    </TableCell>

                    {/* Status */}
                    <TableCell className="py-4">
                      <Badge className={`${cfg.className} pointer-events-none flex w-fit items-center gap-1 border-0 px-2 py-0.5 font-bold text-[11px] shadow-none`}>
                        {cfg.icon}{cfg.label}
                      </Badge>
                    </TableCell>

                    {/* Progress */}
                    <TableCell className="py-4">
                      <div className="flex items-center gap-2.5">
                        <div className="h-2 flex-1 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                          <div
                            className={`h-full rounded-full transition-all ${PROGRESS_COLOR(project.progress)}`}
                            style={{ width: `${project.progress}%` }}
                          />
                        </div>
                        <span className="w-9 shrink-0 text-right font-bold text-[12px] text-slate-600 dark:text-slate-400">{project.progress}%</span>
                      </div>
                    </TableCell>

                    {/* Budget */}
                    <TableCell className="py-4">
                      <span className="font-semibold text-[13px] text-slate-700 dark:text-slate-300">{project.budget}</span>
                    </TableCell>

                    {/* View */}
                    <TableCell className="py-4 pr-4 text-right">
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-8 rounded-lg px-3 font-semibold text-blue-600 text-xs opacity-0 transition-opacity hover:bg-blue-50 group-hover:opacity-100 dark:text-blue-400 dark:hover:bg-blue-900/20"
                        onClick={(e) => { e.stopPropagation(); openDrawer(project); }}
                      >
                        View <ChevronRight className="ml-1 h-3.5 w-3.5" />
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>

        {/* Footer count */}
        <div className="flex items-center justify-between border-slate-100 border-t px-5 py-3 dark:border-slate-800">
          <p className="font-medium text-slate-400 text-xs">Showing {filtered.length} of {MOCK_PROJECTS.length} projects</p>
          {statusFilter !== "All" && (
            <button type="button" onClick={() => setStatusFilter("All")} className="font-semibold text-blue-600 text-xs hover:underline dark:text-blue-400">
              Clear filter
            </button>
          )}
        </div>
      </div>

      {/* ── Project Details Drawer ── */}
      <Sheet open={!!selected} onOpenChange={(o) => !o && setSelected(null)}>
        <SheetContent className="flex w-full flex-col overflow-hidden border-l border-slate-200/80 bg-white p-0 shadow-2xl dark:border-slate-800 dark:bg-slate-950 sm:max-w-[800px] xl:max-w-[1000px]" side="right">
          {selected && (
            <>
              {/* Drawer Header */}
              <SheetHeader className="shrink-0 space-y-0 border-slate-100 border-b bg-gradient-to-b from-slate-50/90 to-white px-6 pt-6 pb-4 dark:border-slate-800 dark:from-slate-900/80 dark:to-slate-950">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex min-w-0 flex-1 flex-col gap-1.5">
                    <div className="flex flex-wrap items-center gap-2">
                      <Badge className="border-0 bg-slate-200/80 font-bold text-[10px] text-slate-700 uppercase dark:bg-slate-800 dark:text-slate-300">{selected.code}</Badge>
                      <Badge className={`${STATUS_CONFIG[selected.status].className} pointer-events-none flex items-center gap-1 border-0 font-bold text-[10px]`}>
                        {STATUS_CONFIG[selected.status].icon}{selected.status}
                      </Badge>
                    </div>
                    <SheetTitle className="pr-2 font-bold text-[16px] text-slate-900 leading-snug tracking-tight dark:text-slate-100">
                      {selected.name}
                    </SheetTitle>
                    <SheetDescription className="font-medium text-slate-500 text-xs leading-relaxed">
                      {selected.dept} · {selected.startDate} → {selected.endDate}
                    </SheetDescription>
                  </div>
                </div>

                {/* Progress in header */}
                <div className="mt-4 flex items-center gap-3">
                  <div className="h-2.5 flex-1 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                    <div
                      className={`h-full rounded-full transition-all ${PROGRESS_COLOR(selected.progress)}`}
                      style={{ width: `${selected.progress}%` }}
                    />
                  </div>
                  <span className="w-10 shrink-0 text-right font-bold text-slate-700 text-sm dark:text-slate-300">{selected.progress}%</span>
                </div>

                {/* Tab Nav */}
                <div className="mt-4 flex flex-wrap gap-1.5 rounded-xl bg-slate-100/80 p-1 dark:bg-slate-900/60">
                  {(["overview", "team", "timeline"] as const).map((tab) => (
                    <button
                      type="button"
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`rounded-lg px-4 py-2 font-semibold text-xs capitalize transition-all ${
                        activeTab === tab
                          ? "bg-white text-blue-700 shadow-sm dark:bg-slate-800 dark:text-blue-400"
                          : "text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200"
                      }`}
                    >
                      {tab}
                    </button>
                  ))}
                </div>
              </SheetHeader>

              {/* Drawer Scrollable Content */}
              <div className="flex flex-1 flex-col gap-6 overflow-y-auto px-6 py-6 sm:px-8 sm:py-7">

                {/* ── TAB: OVERVIEW ── */}
                {activeTab === "overview" && (
                  <>
                    {/* Key Stats Row */}
                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                      <div className="rounded-lg border border-slate-100 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-900/50">
                        <p className="mb-1.5 font-bold text-[10px] text-slate-400 uppercase tracking-wider">Principal Investigator</p>
                        <div className="flex items-center gap-2">
                          <Avatar className="h-7 w-7">
                            <AvatarFallback className={`font-bold text-[10px] ${selected.piColor}`}>{selected.piAvatar}</AvatarFallback>
                          </Avatar>
                          <p className="truncate font-semibold text-[13px] text-slate-800 dark:text-slate-200">{selected.pi}</p>
                        </div>
                      </div>
                      <div className="rounded-lg border border-slate-100 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-900/50">
                        <p className="mb-1.5 font-bold text-[10px] text-slate-400 uppercase tracking-wider">Total Budget</p>
                        <p className="font-extrabold text-blue-600 text-xl dark:text-blue-400">{selected.budget}</p>
                      </div>
                      <div className="rounded-lg border border-slate-100 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-900/50">
                        <p className="mb-1.5 font-bold text-[10px] text-slate-400 uppercase tracking-wider">Start Date</p>
                        <p className="flex items-center gap-1.5 font-semibold text-[13px] text-slate-800 dark:text-slate-200">
                          <Calendar className="h-3.5 w-3.5 text-slate-400" />{selected.startDate}
                        </p>
                      </div>
                      <div className="rounded-lg border border-slate-100 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-900/50">
                        <p className="mb-1.5 font-bold text-[10px] text-slate-400 uppercase tracking-wider">End Date</p>
                        <p className="flex items-center gap-1.5 font-semibold text-[13px] text-slate-800 dark:text-slate-200">
                          <Calendar className="h-3.5 w-3.5 text-slate-400" />{selected.endDate}
                        </p>
                      </div>
                    </div>

                    {/* Abstract */}
                    <div>
                      <h4 className="mb-2.5 flex items-center gap-2 font-bold text-[11px] text-slate-500 uppercase tracking-wider">
                        <FileText className="h-3.5 w-3.5" /> Project Abstract
                      </h4>
                      <p className="rounded-lg border border-slate-100 bg-slate-50 p-4 text-[13px] text-slate-600 leading-relaxed dark:border-slate-800 dark:bg-slate-900/30 dark:text-slate-400">
                        {selected.abstract}
                      </p>
                    </div>

                    {/* Admin Actions */}
                    <div>
                      <h4 className="mb-3 font-bold text-[11px] text-slate-500 uppercase tracking-wider">Admin Actions</h4>
                      <div className="flex flex-wrap gap-2">
                        <Can permission="BUDGET_APPROVE">
                          <Button size="sm" variant="outline" className="h-8 font-semibold text-xs">
                            Approve Budget Release
                          </Button>
                        </Can>

                        <Can permission="PROJECT_REJECT">
                          <Button size="sm" variant="outline" className="h-8 border-red-200 font-semibold text-red-600 text-xs hover:bg-red-50 dark:border-red-900 dark:hover:bg-red-900/20">
                            Suspend / Terminate
                          </Button>
                        </Can>
                        <Button size="sm" variant="outline" className="h-8 font-semibold text-xs">
                          View Report
                        </Button>
                      </div>
                    </div>
                  </>
                )}

                {/* ── TAB: TEAM ── */}
                {activeTab === "team" && (
                  <div className="flex flex-col gap-3">
                    <h4 className="flex items-center gap-2 font-bold text-[11px] text-slate-500 uppercase tracking-wider">
                      <Users className="h-3.5 w-3.5" /> Research Team ({selected.team.length + 1} members)
                    </h4>

                    {/* PI Row */}
                    <div className="flex items-center gap-4 rounded-lg border border-blue-100 bg-blue-50/50 p-3.5 dark:border-blue-900/30 dark:bg-blue-900/10">
                      <Avatar className="h-10 w-10 border-2 border-blue-200 dark:border-blue-800">
                        <AvatarFallback className={`font-bold text-xs ${selected.piColor}`}>{selected.piAvatar}</AvatarFallback>
                      </Avatar>
                      <div className="flex min-w-0 flex-col">
                        <span className="truncate font-bold text-slate-900 text-sm dark:text-slate-100">{selected.pi}</span>
                        <span className="font-semibold text-blue-600 text-xs dark:text-blue-400">Principal Investigator</span>
                      </div>
                      <Badge className="ml-auto shrink-0 border-0 bg-blue-600 text-[10px] text-white">PI</Badge>
                    </div>

                    {/* Team Members */}
                    {selected.team.map((m) => (
                      <div key={m.avatar} className="flex items-center gap-4 rounded-lg border border-slate-100 bg-slate-50/30 p-3.5 transition-colors hover:bg-slate-100/60 dark:border-slate-800 dark:bg-slate-900/20 dark:hover:bg-slate-900/40">
                        <Avatar className="h-10 w-10">
                          <AvatarFallback className={`font-bold text-xs ${m.color}`}>{m.avatar}</AvatarFallback>
                        </Avatar>
                        <div className="flex min-w-0 flex-col">
                          <span className="truncate font-semibold text-slate-900 text-sm dark:text-slate-100">{m.name}</span>
                          <span className="font-medium text-slate-500 text-xs">{m.role}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* ── TAB: TIMELINE ── */}
                {activeTab === "timeline" && (
                  <div className="flex flex-col gap-0">
                    <h4 className="mb-5 flex items-center gap-2 font-bold text-[11px] text-slate-500 uppercase tracking-wider">
                      <Clock className="h-3.5 w-3.5" /> Project Milestones
                    </h4>
                    <div className="relative ml-3 flex flex-col gap-0 border-slate-200 border-l-2 dark:border-slate-700">
                      {selected.timeline.map((event) => (
                        <div key={`${event.date}-${event.label}`} className="relative pb-7 pl-6 last:pb-0">
                          {/* Dot */}
                          <div className={`-left-[9px] absolute top-0.5 flex h-4 w-4 items-center justify-center rounded-full border-2 border-white dark:border-slate-950 ${
                            event.status === "done"
                              ? "bg-emerald-500"
                              : event.status === "active"
                              ? "bg-blue-600 ring-4 ring-blue-100 dark:ring-blue-900/30"
                              : "bg-slate-300 dark:bg-slate-700"
                          }`}>
                            {event.status === "done" && <CheckCircle2 className="h-2.5 w-2.5 text-white" />}
                          </div>
                          <p className="font-bold text-[10px] text-slate-400 uppercase tracking-wider">{event.date}</p>
                          <p className={`mt-0.5 font-semibold text-sm ${
                            event.status === "done"
                              ? "text-slate-600 dark:text-slate-400"
                              : event.status === "active"
                              ? "text-blue-700 dark:text-blue-400"
                              : "text-slate-400 dark:text-slate-600"
                          }`}>
                            {event.label}
                          </p>
                          {event.status === "active" && (
                            <span className="mt-1 inline-block rounded-full bg-blue-50 px-2 py-0.5 font-bold text-[10px] text-blue-600 dark:bg-blue-900/20 dark:text-blue-500">IN PROGRESS</span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}
