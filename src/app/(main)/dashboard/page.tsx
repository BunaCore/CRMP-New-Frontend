"use client";

import { useEffect, useMemo, useState } from "react";

import { motion } from "framer-motion";

import Link from "next/link";

import { useQuery } from "@tanstack/react-query";
import { differenceInDays, differenceInHours, differenceInMinutes, differenceInSeconds, isFuture } from "date-fns";
import {
  ArrowRight,
  CalendarDays,
  CheckCircle2,
  Clock,
  FileText,
  FolderOpen,
  MapPin,
  MessageSquare,
  Plus,
  Users,
} from "lucide-react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useSession } from "@/context/SessionContext";
import { getMyProposals } from "@/lib/api/proposals/queries";

export default function DashboardPage() {
  const [showRSVPModal, setShowRSVPModal] = useState(false);
  const { user } = useSession();

  // Role labels for header
  const getRoleLabel = (roles: string[] | undefined) => {
    if (!roles || roles.length === 0) return "Researcher";
    const map: Record<string, string> = {
      PI: "Principal Investigator",
      RAD: "Research & Dev.",
      RA: "Research Associate",
      ADRPM: "Assoc. Dir. RPM",
      AC: "Academic Coordinator",
      VPRTT: "VP Research",
      Finance: "Finance",
      Coordinator: "Coordinator",
      Department: "Department Head",
      "College/School": "College / School",
      PGMO: "PG Management",
      "Examiner/Evaluator": "Evaluator",
      Advisor: "Advisor",
      Evaluator: "Evaluator",
      DGC_MEMBER: "DGC Member",
      PG_OFFICE: "PG Office",
    };
    return map[roles[0]] ?? roles[0];
  };

  const roleLabel = getRoleLabel(user?.roles);

  // Mock data for projects
  const projects = [
    {
      name: "AI Health Diagnostics",
      status: "Active",
      progress: 75,
      team: 6,
      badgeColor:
        "bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 font-medium border-blue-200/50 dark:border-blue-800/50",
    },
    {
      name: "Quantum Computing Simulation",
      status: "In Review",
      progress: 40,
      team: 4,
      badgeColor:
        "bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 font-medium border-amber-200/50 dark:border-amber-800/50",
    },
    {
      name: "Neural Interface Robotics",
      status: "Delayed",
      progress: 20,
      team: 5,
      badgeColor:
        "bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-400 font-medium border-red-200/50 dark:border-red-800/50",
    },
    {
      name: "Climate Change Modeling",
      status: "Active",
      progress: 90,
      team: 8,
      badgeColor:
        "bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 font-medium border-blue-200/50 dark:border-blue-800/50",
    },
  ];

  // Mock data for recent activity
  const _activities = [
    {
      title: "Evaluation submitted",
      desc: "Dr. Smith submitted eval for AI Health Diagnostics.",
      time: "2h ago",
      icon: CheckCircle2,
      color: "text-emerald-600 bg-emerald-100 dark:bg-emerald-900/50 dark:text-emerald-400",
    },
    {
      title: "Proposal updated",
      desc: "Quantum Computing Phase 2 draft uploaded.",
      time: "5h ago",
      icon: FileText,
      color: "text-blue-600 bg-blue-100 dark:bg-blue-900/50 dark:text-blue-400",
    },
    {
      title: "Deadline approaching",
      desc: "Neural Interface milestone due in 3 days.",
      time: "1d ago",
      icon: Clock,
      color: "text-amber-600 bg-amber-100 dark:bg-amber-900/50 dark:text-amber-400",
    },
    {
      title: "New team member",
      desc: "Alice joined Climate Change Modeling.",
      time: "2d ago",
      icon: Users,
      color: "text-indigo-600 bg-indigo-100 dark:bg-indigo-900/50 dark:text-indigo-400",
    },
  ];

  // Mock data for direct messages/notifications
  const directMessages = [
    {
      sender: "Dr. Elena Rostova",
      avatar: "ER",
      role: "Co-Investigator",
      message: "Please review the updated Phase 1 budget allocations when you have a moment.",
      time: "10m ago",
      unread: true,
      avatarColor: "bg-purple-100 text-purple-700 dark:bg-purple-900/50 dark:text-purple-300",
    },
    {
      sender: "Prof. Michael Chen",
      avatar: "MC",
      role: "Lead Researcher",
      message: "I've uploaded the new methodology drafts. Let me know what you think.",
      time: "1h ago",
      unread: false,
      avatarColor: "bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300",
    },
    {
      sender: "Sarah Jenkins",
      avatar: "SJ",
      role: "Project Manager",
      message: "The evaluation committee just fully approved our timeline extension!",
      time: "2h ago",
      unread: false,
      avatarColor: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300",
    },
  ];

  // Fetch user's proposals using React Query
  const { data: userProposals, isLoading: _isLoadingProposals } = useQuery({
    queryKey: ["dashboard_proposals"],
    queryFn: getMyProposals,
  });

  // Find the single closest upcoming defence
  const upcomingDefence = useMemo(() => {
    if (!userProposals) return null;

    const allDefences = userProposals.flatMap((p) =>
      (p.defenceSchedules || []).map((d) => ({
        ...d,
        proposalTitle: p.title,
        proposalId: p.id,
      })),
    );

    // Filter only future defences and sort by closest date
    const futureDefences = allDefences
      .filter((d) => isFuture(new Date(d.defenceDate)))
      .sort((a, b) => new Date(a.defenceDate).getTime() - new Date(b.defenceDate).getTime());

    return futureDefences[0] || null;
  }, [userProposals]);

  const [timeLeft, setTimeLeft] = useState<{ d: number; h: number; m: number; s: number } | null>(null);

  // Countdown timer effect
  useEffect(() => {
    if (!upcomingDefence) {
      setTimeLeft(null);
      return;
    }

    const targetDate = new Date(upcomingDefence.defenceDate);

    const updateTimer = () => {
      const now = new Date();
      if (!isFuture(targetDate)) {
        setTimeLeft(null);
        return;
      }

      const d = differenceInDays(targetDate, now);
      const h = differenceInHours(targetDate, now) % 24;
      const m = differenceInMinutes(targetDate, now) % 60;
      const s = differenceInSeconds(targetDate, now) % 60;

      setTimeLeft({ d, h, m, s });
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [upcomingDefence]);

  // Determine urgency level (amber vs red)
  const isUrgent = timeLeft !== null && timeLeft.d === 0 && timeLeft.h < 24; // Less than 24 hours
  const alertColor = isUrgent
    ? "border-red-200/80 bg-gradient-to-r from-red-50 to-red-100/50 dark:border-red-900/50 dark:from-red-950/40 dark:to-red-900/20"
    : "border-amber-200/80 bg-gradient-to-r from-amber-50 to-amber-100/50 dark:border-amber-900/50 dark:from-amber-950/40 dark:to-amber-900/20";

  const textTitleColor = isUrgent ? "text-red-900 dark:text-red-200" : "text-amber-900 dark:text-amber-200";
  const textDescColor = isUrgent ? "text-red-700 dark:text-red-400" : "text-amber-700 dark:text-amber-400";
  const iconBgColor = isUrgent ? "bg-red-500" : "bg-amber-500";
  const buttonColor = isUrgent
    ? "bg-red-600 hover:bg-red-700 dark:bg-red-600 dark:hover:bg-red-500"
    : "bg-amber-600 hover:bg-amber-700 dark:bg-amber-600 dark:hover:bg-amber-500";

  return (
    <div className="flex flex-1 flex-col gap-8">
      {/* Dynamic Defence Alert Notification */}
      {upcomingDefence && timeLeft !== null && (
        <div
          className={`flex flex-col items-center gap-4 rounded-xl border p-4 shadow-sm transition-colors duration-500 sm:flex-row ${alertColor}`}
        >
          <div
            className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-white shadow-sm transition-colors duration-500 ${iconBgColor}`}
          >
            <CalendarDays className="h-5 w-5" />
          </div>
          <div className="flex-1 text-center sm:text-left">
            <h3 className={`font-bold text-sm transition-colors duration-500 ${textTitleColor}`}>
              {isUrgent ? "CRITICAL: " : "Action Required: "} Upcoming Proposal Defence
            </h3>
            <p className={`mt-0.5 text-sm transition-colors duration-500 ${textDescColor}`}>
              Your defence for <strong className="font-bold">{upcomingDefence.proposalTitle}</strong> is coming up in{" "}
              <span className="rounded bg-white/50 px-1.5 py-0.5 font-bold font-mono tracking-tight dark:bg-black/20">
                {timeLeft.d}d {timeLeft.h.toString().padStart(2, "0")}h {timeLeft.m.toString().padStart(2, "0")}m{" "}
                {timeLeft.s.toString().padStart(2, "0")}s
              </span>
            </p>
          </div>

          {/* button (smaller) */}
          <Button
            onClick={() => setShowRSVPModal(true)}
            className={`w-full font-semibold text-white shadow-sm transition-colors duration-500 sm:w-auto ${buttonColor}`}
          >
            View
          </Button>
        </div>
      )}
      {/* Header Section */}
      <div className="flex flex-col items-start justify-between gap-1 sm:flex-row sm:items-center">
        <div>
          <h1 className="font-black text-xl tracking-tight text-slate-900 dark:text-slate-100">
            {roleLabel} <span>Dashboard</span>
          </h1>

          <p className="mt-1 text-xs font-medium text-slate-500 dark:text-slate-400">
            Welcome back{user?.name ? `, ${user.name}` : ""}. Here&apos;s an overview of your research projects and
            team.
          </p>
        </div>
        <Link href="/dashboard/proposals/new" passHref legacyBehavior>
          <Button className="w-full rounded-full border-0 bg-gradient-to-r from-blue-600 to-indigo-600 px-6 font-medium text-white shadow transition-all hover:from-blue-700 hover:to-indigo-700 hover:shadow-md sm:w-auto">
            <Plus className="mr-2 h-4 w-4" /> New Project
          </Button>
        </Link>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 gap-7 md:grid-cols-3">
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          whileHover={{ y: -2, scale: 1.01 }}
          transition={{ duration: 0.2 }}
          viewport={{ once: true }}
        >
          <Card className="group relative overflow-hidden border-none bg-card shadow-sm transition-all hover:shadow dark:bg-slate-950/50">
            <div className="absolute top-0 left-0 h-full w-[1px] bg-primary" />

            <CardContent className="p-1">
              <div className="flex items-center justify-between gap-1.5">
                <div className="flex items-center gap-1.5">
                  <div className="rounded-md bg-primary/10 p-0.5 text-primary transition-colors group-hover:bg-primary group-hover:text-white">
                    <FolderOpen className="h-3.5 w-3.5" />
                  </div>

                  <div className="leading-none">
                    <p className="text-[12px] font-medium uppercase tracking-wide text-muted-foreground">Active</p>

                    <h3 className="text-sm font-semibold leading-none text-slate-900 dark:text-slate-100">12</h3>
                  </div>
                </div>

                <p className="flex items-center gap-1 text-[12px] font-medium text-primary">
                  <ArrowRight className="h-3.5 w-3.5" />
                  +2
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
        <motion.div
          initial={{ y: 15, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          whileHover={{ y: -2, scale: 1.01 }}
          transition={{ duration: 0.2, delay: 0.1 }}
          viewport={{ once: true }}
        >
          <Card className="group relative overflow-hidden border-none bg-card shadow-sm transition-all hover:shadow dark:bg-slate-950/50">
            <div className="absolute top-0 left-0 h-full w-[1px] bg-amber-500" />

            <CardContent className="p-1">
              <div className="flex items-center justify-between gap-1.5">
                {/* LEFT */}
                <div className="flex items-center gap-1.5">
                  <div className="rounded-md bg-amber-500/10 p-0.5 text-amber-600 transition-colors group-hover:bg-amber-500 group-hover:text-white">
                    <Clock className="h-3.5 w-3.5" />
                  </div>

                  <div className="leading-none">
                    <p className="text-[12px] font-medium uppercase tracking-wide text-muted-foreground">Pending</p>

                    <h3 className="text-sm font-semibold leading-none text-slate-900 dark:text-slate-100">04</h3>
                  </div>
                </div>

                {/* RIGHT */}
                <p className="text-[11px] font-medium text-muted-foreground">Review</p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
        <motion.div
          initial={{ y: 15, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          whileHover={{ y: -2, scale: 1.01 }}
          transition={{ duration: 0.2, delay: 0.2 }}
          viewport={{ once: true }}
        >
          <Card className="group relative overflow-hidden border-none bg-card shadow-sm transition-all hover:shadow dark:bg-slate-950/50">
            <div className="absolute top-0 left-0 h-full w-[1px] bg-emerald-500" />

            <CardContent className="p-1">
              <div className="flex items-center justify-between gap-1.5">
                {/* LEFT */}
                <div className="flex items-center gap-1.5">
                  <div className="rounded-md bg-emerald-500/10 p-0.5 text-emerald-600 transition-colors group-hover:bg-emerald-500 group-hover:text-white">
                    <Users className="h-3.5 w-3.5" />
                  </div>

                  <div className="leading-none">
                    <p className="text-[12px] font-medium uppercase tracking-wide text-muted-foreground">Team</p>

                    <h3 className="text-sm font-semibold leading-none text-slate-900 dark:text-slate-100">24</h3>
                  </div>
                </div>

                {/* RIGHT */}
                <p className="text-[11px] font-medium text-muted-foreground">Members</p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        {/* LEFT */}
        <div className="flex flex-col gap-2 lg:col-span-2">
          <Card className="flex h-full flex-col overflow-hidden border-slate-200/50 bg-white shadow-none dark:border-slate-800/50 dark:bg-slate-950/50">
            <CardHeader className="border-b border-slate-100 bg-slate-50/30 px-3 py-1.5 dark:border-slate-800/50 dark:bg-slate-900/10">
              <CardTitle className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                Active Projects Oversight
              </CardTitle>
              <CardDescription className="text-[10px] text-slate-500">Track ongoing research grants</CardDescription>
            </CardHeader>

            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow className="border-slate-100 dark:border-slate-800">
                    <TableHead className="h-7 px-2 text-[10px] text-slate-500">Project</TableHead>

                    <TableHead className="h-7 px-2 text-[10px] text-slate-500">Status</TableHead>

                    <TableHead className="hidden h-7 px-2 text-[10px] text-slate-500 sm:table-cell">Progress</TableHead>

                    <TableHead className="h-7 px-2 text-right text-[10px] text-slate-500">Action</TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {projects.map((project) => (
                    <TableRow
                      key={project.name}
                      className="border-slate-100 hover:bg-slate-50/30 dark:border-slate-800/50 dark:hover:bg-slate-800/20"
                    >
                      <TableCell className="px-2 py-1.5 text-[11px] font-medium text-slate-800 dark:text-slate-200">
                        {project.name}
                      </TableCell>

                      <TableCell className="px-2 py-1.5">
                        <Badge className={`${project.badgeColor} px-1.5 py-0 text-[9px]`}>{project.status}</Badge>
                      </TableCell>

                      <TableCell className="hidden px-2 py-1.5 sm:table-cell">
                        <div className="flex items-center gap-2">
                          <Progress value={project.progress} className="h-1 w-full" />
                          <span className="text-[9px] text-slate-500">{project.progress}%</span>
                        </div>
                      </TableCell>

                      <TableCell className="px-2 py-1.5 text-right">
                        <Button variant="ghost" size="sm" className="h-5 px-2 text-[10px] text-blue-600">
                          View
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>

        {/* RIGHT */}
        <div className="flex flex-col gap-5 lg:col-span-1">
          <Card className="border-slate-200/50 bg-white shadow-none dark:border-slate-800/50 dark:bg-slate-950/50">
            <CardHeader className="border-b border-slate-100  px-3 py-1.5 dark:border-slate-800/50">
              <div className="flex items-center justify-between">
                <CardTitle className="text-xs font-semibold text-slate-800 dark:text-slate-200">Messages</CardTitle>

                <Badge className="bg-blue-100 px-2 py-0 text-[9px] text-blue-700 dark:bg-blue-900/40 dark:text-blue-300">
                  3
                </Badge>
              </div>
            </CardHeader>

            <CardContent className="p-2">
              <div className="flex flex-col gap-2">
                {directMessages.map((msg) => (
                  <div key={msg.sender} className="flex items-start gap-2">
                    <Avatar className="h-6 w-6">
                      <AvatarFallback className={`${msg.avatarColor} text-[9px]`}>{msg.avatar}</AvatarFallback>
                    </Avatar>

                    <div className="flex flex-1 flex-col leading-tight">
                      <div className="flex justify-between">
                        <p className="text-[11px] font-medium text-slate-800 dark:text-white">{msg.sender}</p>
                        <span className="text-[8px] text-slate-400 dark:text-slate-200">{msg.time}</span>
                      </div>
                      <p className="mb-1 text-[11px] text-slate-500 leading-none dark:text-slate-400">{msg.role}</p>
                      <p
                        className={`line-clamp-2 text-[13px] leading-relaxed ${msg.unread ? "font-medium text-slate-700 dark:text-slate-300" : "text-slate-500 dark:text-slate-400"}`}
                      >
                        {msg.message}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <Dialog open={showRSVPModal} onOpenChange={setShowRSVPModal}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-amber-100 dark:bg-amber-900/50">
              <CalendarDays className="h-6 w-6 text-amber-600 dark:text-amber-400" />
            </div>
            <DialogTitle className="mt-4 text-center font-semibold text-xl">Defence Appointment RSVP</DialogTitle>
            <DialogDescription className="text-center text-slate-500">
              Please review the details below and confirm your attendance or request a reschedule.
            </DialogDescription>
          </DialogHeader>

          <div className="my-4 flex flex-col gap-4">
            <div className="flex flex-col gap-1 rounded-lg border bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-900/50">
              <p className="font-bold text-[11px] text-slate-500 uppercase tracking-wider">Proposal</p>
              <p className="font-semibold text-slate-900 dark:text-slate-100">{upcomingDefence?.proposalTitle}</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1 rounded-lg border bg-slate-50 p-3 dark:border-slate-800 dark:bg-slate-900/50">
                <p className="flex items-center gap-1.5 font-bold text-[11px] text-slate-500 uppercase tracking-wider">
                  <CalendarDays className="h-3.5 w-3.5" /> Date & Time
                </p>
                <p className="font-semibold text-slate-900 dark:text-slate-100">
                  {upcomingDefence
                    ? new Date(upcomingDefence.defenceDate).toLocaleString(undefined, {
                        weekday: "long",
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                        hour: "numeric",
                        minute: "2-digit",
                      })
                    : "—"}
                </p>
              </div>
            </div>

            <div className="flex flex-col gap-1 rounded-lg border bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-900/50">
              <p className="flex items-center gap-1.5 font-bold text-[11px] text-slate-500 uppercase tracking-wider">
                <MapPin className="h-3.5 w-3.5" /> Location / Link
              </p>
              <p className="font-semibold text-slate-900 dark:text-slate-100">{upcomingDefence?.location}</p>
            </div>

            {upcomingDefence?.note && (
              <div className="rounded-lg border border-indigo-100 bg-indigo-50 p-4 dark:border-indigo-900/30 dark:bg-indigo-900/10">
                <p className="flex items-center gap-1.5 font-bold text-[11px] text-indigo-600 uppercase tracking-wider dark:text-indigo-400">
                  <MessageSquare className="h-3.5 w-3.5" /> Message from Admin
                </p>
                <p className="mt-2 text-indigo-900 text-sm leading-relaxed dark:text-indigo-200">
                  {upcomingDefence.note}
                </p>
              </div>
            )}
          </div>

          <DialogFooter className="flex-col sm:flex-row sm:space-x-2">
            <Button variant="outline" onClick={() => setShowRSVPModal(false)} className="w-full sm:w-auto">
              Request Reschedule
            </Button>
            <Button
              onClick={() => setShowRSVPModal(false)}
              className="w-full bg-amber-600 text-white hover:bg-amber-700 sm:w-auto"
            >
              <CheckCircle2 className="mr-2 h-4 w-4" />
              Confirm Attendance
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
