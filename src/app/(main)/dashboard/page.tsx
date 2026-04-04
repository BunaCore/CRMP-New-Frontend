"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, } from "@/components/ui/avatar";
import {
  CheckCircle2,
  Clock,
  FileText,
  FolderOpen,
  Plus,
  Users,
  ArrowRight,
  CalendarDays,
  MapPin,
  MessageSquare,
} from "lucide-react";

export default function DashboardPage() {
  const [showRSVPModal, setShowRSVPModal] = useState(false);

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
  const activities = [
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
      avatarColor: "bg-purple-100 text-purple-700 dark:bg-purple-900/50 dark:text-purple-300"
    },
    {
      sender: "Prof. Michael Chen",
      avatar: "MC",
      role: "Lead Researcher",
      message: "I've uploaded the new methodology drafts. Let me know what you think.",
      time: "1h ago",
      unread: false,
      avatarColor: "bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300"
    },
    {
      sender: "Sarah Jenkins",
      avatar: "SJ",
      role: "Project Manager",
      message: "The evaluation committee just fully approved our timeline extension!",
      time: "2h ago",
      unread: false,
      avatarColor: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300"
    }
  ];

  // ─── MOCK FEATURE TOGGLE ─────────────────────────
  // Set to false to hide the scheduled defence alerts
  const SHOW_MOCK_APPOINTMENT = true;

  const mockAppointment = {
    title: "Quantum Computing Simulation",
    date: "14 Mar 2025",
    time: "10:00 AM (EAT)",
    venue: "Main Campus — Senate Hall",
    message: "Please ensure your presentation is strictly 15 minutes. The evaluation committee has already reviewed your abstract.",
  };

  return (
    <div className="flex flex-1 flex-col gap-8">
      {/* Option 1: Global Banner for Actionable Notifications */}
      {SHOW_MOCK_APPOINTMENT && (
        <div className="flex flex-col sm:flex-row items-center gap-4 rounded-xl border border-amber-200/80 bg-gradient-to-r from-amber-50 to-amber-100/50 p-4 shadow-sm dark:border-amber-900/50 dark:from-amber-950/40 dark:to-amber-900/20">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-amber-500 text-white shadow-sm">
            <CalendarDays className="h-5 w-5" />
          </div>
          <div className="flex-1 text-center sm:text-left">
            <h3 className="font-bold text-amber-900 text-sm dark:text-amber-200">Action Required: Upcoming Proposal Defence</h3>
            <p className="mt-0.5 text-amber-700 text-sm dark:text-amber-400">
              Your defence for <strong className="font-bold">{mockAppointment.title}</strong> is scheduled for {mockAppointment.date} at {mockAppointment.time}.
            </p>
          </div>
          <Button onClick={() => setShowRSVPModal(true)} className="w-full sm:w-auto bg-amber-600 hover:bg-amber-700 font-semibold text-white shadow-sm dark:bg-amber-600 dark:hover:bg-amber-500">
            View Details & RSVP
          </Button>
        </div>
      )}

      {/* Header Section */}
      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="font-semibold text-3xl text-slate-900 tracking-tight dark:text-slate-100">
            Principal Investigator Dashboard
          </h1>
          <p className="mt-1.5 font-medium text-slate-500 text-sm dark:text-slate-400">
            Welcome back. Here&apos;s an overview of your research projects and team.
          </p>
        </div>
        <Button className="w-full rounded-full border-0 bg-gradient-to-r from-blue-600 to-indigo-600 px-6 font-medium text-white shadow transition-all hover:from-blue-700 hover:to-indigo-700 hover:shadow-md sm:w-auto">
          <Plus className="mr-2 h-4 w-4" /> New Project
        </Button>
      </div>

      {/* Summary Cards - Horizontal Scrolling on Mobile */}
      <div className="flex w-full snap-x snap-mandatory gap-6 overflow-x-auto pb-2">
        <Card className="min-w-[280px] flex-1 snap-center rounded-xl border-slate-200/50 bg-white shadow-none dark:border-slate-800/50 dark:bg-slate-950/50">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="font-medium text-slate-600 text-sm dark:text-slate-400">
              Total Active Projects
            </CardTitle>
            <div className="rounded-lg bg-blue-50 p-2 dark:bg-blue-900/20">
              <FolderOpen className="h-4 w-4 text-blue-600 dark:text-blue-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="font-bold text-3xl text-slate-900 tracking-tight dark:text-slate-100">12</div>
            <p className="mt-1.5 font-medium text-slate-500 text-xs">+2 from last month</p>
          </CardContent>
        </Card>

        <Card className="min-w-[280px] flex-1 snap-center rounded-xl border-slate-200/50 bg-white shadow-none dark:border-slate-800/50 dark:bg-slate-950/50">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="font-medium text-slate-600 text-sm dark:text-slate-400">
              Pending Proposals
            </CardTitle>
            <div className="rounded-lg bg-amber-50 p-2 dark:bg-amber-900/20">
              <FileText className="h-4 w-4 text-amber-600 dark:text-amber-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="font-bold text-3xl text-slate-900 tracking-tight dark:text-slate-100">4</div>
            <p className="mt-1.5 font-medium text-slate-500 text-xs">2 awaiting faculty review</p>
          </CardContent>
        </Card>

        <Card className="min-w-[280px] flex-1 snap-center rounded-xl border-slate-200/50 bg-white shadow-none dark:border-slate-800/50 dark:bg-slate-950/50">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="font-medium text-slate-600 text-sm dark:text-slate-400">
              Team Members
            </CardTitle>
            <div className="rounded-lg bg-emerald-50 p-2 dark:bg-emerald-900/20">
              <Users className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="font-bold text-3xl text-slate-900 tracking-tight dark:text-slate-100">24</div>
            <p className="mt-1.5 font-medium text-slate-500 text-xs">Across all active projects</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-8 md:grid-cols-1 lg:grid-cols-3">
        {/* Project List / Insights */}
        <div className="flex flex-col gap-6 lg:col-span-2">
          <Card className="flex h-full flex-col overflow-hidden rounded-xl border-slate-200/50 bg-white shadow-none dark:border-slate-800/50 dark:bg-slate-950/50">
            <CardHeader className="border-slate-100 border-b bg-slate-50/30 pb-4 dark:border-slate-800/50 dark:bg-slate-900/10">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="font-semibold text-lg text-slate-800 tracking-tight dark:text-slate-200">
                    Active Projects Oversight
                  </CardTitle>
                  <CardDescription className="mt-1 font-medium text-slate-500 text-sm">
                    Track the progress and status of your ongoing research grants.
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="flex-1 p-0">
              <Table>
                <TableHeader>
                  <TableRow className="border-slate-100 hover:bg-transparent dark:border-slate-800">
                    <TableHead className="h-11 px-6 font-medium text-slate-500 tracking-tight">Project Name</TableHead>
                    <TableHead className="h-11 px-6 font-medium text-slate-500 tracking-tight">Status</TableHead>
                    <TableHead className="hidden h-11 px-6 font-medium text-slate-500 tracking-tight sm:table-cell">Progress</TableHead>
                    <TableHead className="h-11 px-6 text-right font-medium text-slate-500 tracking-tight">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {projects.map((project) => (
                    <TableRow
                      key={project.name}
                      className="group border-slate-100 transition-colors hover:bg-slate-50/50 dark:border-slate-800/50 dark:hover:bg-slate-800/20"
                    >
                      <TableCell className="px-6 py-4 font-medium text-slate-800 dark:text-slate-200">
                        {project.name}
                        <div className="mt-0.5 text-slate-500 text-xs sm:hidden">{project.team} members</div>
                      </TableCell>
                      <TableCell className="px-6 py-4">
                        <Badge
                          variant="outline"
                          className={`${project.badgeColor} inline-flex items-center rounded px-2.5 py-0.5 shadow-none`}
                        >
                          {project.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="hidden w-[30%] px-6 py-4 sm:table-cell">
                        <div className="flex items-center gap-3">
                          <Progress
                            value={project.progress}
                            className="h-1.5 w-full bg-slate-100 dark:bg-slate-800"
                          />
                          <span className="min-w-[3.5ch] font-medium text-slate-500 text-xs">
                            {project.progress}%
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="px-6 py-4 text-right">
                        <Button variant="ghost" size="sm" className="h-8 rounded-full px-3 font-medium text-blue-600 group-hover:bg-blue-50 dark:text-blue-400 group-hover:dark:bg-blue-900/20">
                          View <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
        <div className="flex flex-col gap-6 lg:col-span-1">



          {/* Notifications / Direct Messages */}
          <Card className="rounded-xl border-slate-200/50 bg-white shadow-none dark:border-slate-800/50 dark:bg-slate-950/50">
            <CardHeader className="border-slate-100 border-b bg-slate-50/30 pb-4 dark:border-slate-800/50 dark:bg-slate-900/10">
              <div className="flex items-center justify-between">
                <CardTitle className="font-semibold text-lg text-slate-800 tracking-tight dark:text-slate-200">
                  Recent Messages
                </CardTitle>
                <Badge variant="secondary" className="border-0 bg-blue-100 px-2 font-semibold text-blue-700 shadow-none hover:bg-blue-100 dark:bg-blue-900/40 dark:text-blue-300">
                  3 New
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="px-4 pt-6 sm:px-6">
              <div className="flex flex-col gap-5">
                {directMessages.map((msg) => (
                  <div
                    key={`${msg.sender}-${msg.time}`}
                    className="group flex cursor-pointer items-start gap-4"
                  >
                    <div className="relative mt-1">
                      <Avatar className="h-10 w-10 border border-slate-100 ring-blue-500/30 transition-all group-hover:ring-2 dark:border-slate-800">
                        <AvatarFallback className={`${msg.avatarColor} font-semibold text-sm`}>
                          {msg.avatar}
                        </AvatarFallback>
                      </Avatar>
                      {msg.unread && (
                        <div className="absolute top-0 right-0 h-2.5 w-2.5 rounded-full bg-blue-500 ring-2 ring-white dark:ring-slate-950" />
                      )}
                    </div>
                    <div className="flex flex-1 flex-col overflow-hidden">
                      <div className="flex items-baseline justify-between gap-2">
                        <p className={`truncate text-sm ${msg.unread ? 'font-semibold text-slate-900 dark:text-slate-100' : 'font-medium text-slate-800 dark:text-slate-200'}`}>
                          {msg.sender}
                        </p>
                        <p className="shrink-0 whitespace-nowrap font-medium text-[10px] text-slate-400">
                          {msg.time}
                        </p>
                      </div>
                      <p className="mb-1 text-[11px] text-slate-500 leading-none dark:text-slate-400">{msg.role}</p>
                      <p className={`line-clamp-2 text-[13px] leading-relaxed ${msg.unread ? 'font-medium text-slate-700 dark:text-slate-300' : 'text-slate-500 dark:text-slate-400'}`}>
                        {msg.message}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Activity Feed */}
          <Card className="flex-1 rounded-xl border-slate-200/50 bg-white shadow-none dark:border-slate-800/50 dark:bg-slate-950/50">
            <CardHeader className="border-slate-100 border-b bg-slate-50/30 pb-4 dark:border-slate-800/50 dark:bg-slate-900/10">
              <CardTitle className="font-semibold text-lg text-slate-800 tracking-tight dark:text-slate-200">
                Activity Feed
              </CardTitle>
            </CardHeader>
            <CardContent className="px-6 pt-6">
              <div className="space-y-6">
                {activities.map((act, i) => (
                  <div
                    key={`${act.title}-${act.time}`}
                    className="group relative flex items-start gap-4"
                  >
                    {/* Timeline Line */}
                    {i !== activities.length - 1 && (
                      <div className="absolute top-10 bottom-[-24px] left-[15px] w-px bg-slate-100 transition-colors dark:bg-slate-800" />
                    )}

                    <div className="relative z-10 flex items-center justify-center">
                      <div
                        className={`flex h-8 w-8 items-center justify-center rounded-full ring-4 ring-white dark:ring-slate-950 ${act.color}`}
                      >
                        <act.icon className="h-3.5 w-3.5" />
                      </div>
                    </div>

                    <div className="flex flex-col gap-1 pb-1">
                      <p className="font-semibold text-slate-800 text-sm leading-none dark:text-slate-200">
                        {act.title}
                      </p>
                      <p className="mt-1 text-[13px] text-slate-500 leading-relaxed">
                        {act.desc}
                      </p>
                      <p className="mt-1.5 font-semibold text-[10px] text-slate-400 uppercase tracking-wider">
                        {act.time}
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
            <DialogTitle className="mt-4 text-center text-xl font-semibold">Defence Appointment RSVP</DialogTitle>
            <DialogDescription className="text-center text-slate-500">
              Please review the details below and confirm your attendance or request a reschedule.
            </DialogDescription>
          </DialogHeader>

          <div className="my-4 flex flex-col gap-4">
            <div className="flex flex-col gap-1 rounded-lg border bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-900/50">
              <p className="font-bold text-[11px] uppercase tracking-wider text-slate-500">Proposal</p>
              <p className="font-semibold text-slate-900 dark:text-slate-100">{mockAppointment.title}</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1 rounded-lg border bg-slate-50 p-3 dark:border-slate-800 dark:bg-slate-900/50">
                <p className="flex items-center gap-1.5 font-bold text-[11px] uppercase tracking-wider text-slate-500">
                  <CalendarDays className="h-3.5 w-3.5" /> Date
                </p>
                <p className="font-semibold text-slate-900 dark:text-slate-100">{mockAppointment.date}</p>
              </div>
              <div className="flex flex-col gap-1 rounded-lg border bg-slate-50 p-3 dark:border-slate-800 dark:bg-slate-900/50">
                <p className="flex items-center gap-1.5 font-bold text-[11px] uppercase tracking-wider text-slate-500">
                  <Clock className="h-3.5 w-3.5" /> Time
                </p>
                <p className="font-semibold text-slate-900 dark:text-slate-100">{mockAppointment.time}</p>
              </div>
            </div>

            <div className="flex flex-col gap-1 rounded-lg border bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-900/50">
              <p className="flex items-center gap-1.5 font-bold text-[11px] uppercase tracking-wider text-slate-500">
                <MapPin className="h-3.5 w-3.5" /> Location / Link
              </p>
              <p className="font-semibold text-slate-900 dark:text-slate-100">{mockAppointment.venue}</p>
            </div>

            <div className="rounded-lg border border-indigo-100 bg-indigo-50 p-4 dark:border-indigo-900/30 dark:bg-indigo-900/10">
              <p className="flex items-center gap-1.5 font-bold text-[11px] uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                <MessageSquare className="h-3.5 w-3.5" /> Message from Admin
              </p>
              <p className="mt-2 text-sm text-indigo-900 leading-relaxed dark:text-indigo-200">
                {mockAppointment.message}
              </p>
            </div>
          </div>

          <DialogFooter className="flex-col sm:flex-row sm:space-x-2">
            <Button variant="outline" onClick={() => setShowRSVPModal(false)} className="w-full sm:w-auto">
              Request Reschedule
            </Button>
            <Button onClick={() => setShowRSVPModal(false)} className="w-full bg-amber-600 text-white hover:bg-amber-700 sm:w-auto">
              <CheckCircle2 className="mr-2 h-4 w-4" />
              Confirm Attendance
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
