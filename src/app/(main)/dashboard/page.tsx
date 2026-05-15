"use client";

import { useEffect, useMemo, useState } from "react";

import Link from "next/link";

import { useQuery } from "@tanstack/react-query";
import { differenceInDays, differenceInHours, differenceInMinutes, differenceInSeconds, isFuture } from "date-fns";
import { motion } from "framer-motion";
import { Bell, CalendarDays, CheckCircle2, MapPin, Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useSession } from "@/context/SessionContext";
import { getMyProposals } from "@/lib/api/proposals/queries";

// Perspectives components
import { ResearcherView } from "./_components/views/researcher-view";

export default function DashboardPage() {
  const [showRSVPModal, setShowRSVPModal] = useState(false);
  const { user } = useSession();

  // Role labels for header — using canonical backend roles
  const getRoleLabel = (roles: string[] | undefined) => {
    if (!roles || roles.length === 0) return "Researcher";
    const map: Record<string, string> = {
      STUDENT: "Student Researcher",
      FACULTY: "Faculty Researcher",
      ADVISOR: "Research Advisor",
      EVALUATOR: "Peer Evaluator",
      COORDINATOR: "Dept. Coordinator",
      DGC_MEMBER: "DGC Member",
      ADRPM: "Assoc. Director RPM",
      PG_OFFICE: "PG Office",
      RAD: "Research Director",
      FINANCE: "Finance Officer",
      VPRTT: "VP Research",
      AC_MEMBER: "Academic Council",
      SYSTEM_ADMIN: "System Admin",
      EXTERNAL_EXPERT: "External Expert",
    };
    return map[roles[0]] ?? roles[0];
  };

  const roleLabel = getRoleLabel(user?.roles);

  // Fetch real proposals for defense countdown
  const { data: userProposals } = useQuery({
    queryKey: ["dashboard_proposals"],
    queryFn: getMyProposals,
  });

  const upcomingDefence = useMemo(() => {
    if (!userProposals) return null;
    const allDefences = userProposals.flatMap((p) =>
      (p.defenceSchedules || []).map((d) => ({
        ...d,
        proposalTitle: p.title,
      })),
    );
    const futureDefences = allDefences
      .filter((d) => isFuture(new Date(d.defenceDate)))
      .sort((a, b) => new Date(a.defenceDate).getTime() - new Date(b.defenceDate).getTime());

    return futureDefences[0] || null;
  }, [userProposals]);

  const [timeLeft, setTimeLeft] = useState<{ d: number; h: number; m: number; s: number } | null>(null);

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

  // In the Workspace environment, every user is treated as a researcher.
  // Role-specific views (Finance, Approver, Admin) live in the Admin Console (/admin).
  // The Workspace always shows the unified ResearcherView.

  const isUrgent = timeLeft !== null && timeLeft.d === 0 && timeLeft.h < 24;

  return (
    <div className="flex flex-1 flex-col gap-8">
      {/* Defence Alert — Premium UI */}
      {upcomingDefence && timeLeft !== null && (
        <div
          className={`flex flex-col items-center gap-4 rounded-xl border p-4 shadow-sm transition-all sm:flex-row ${
            isUrgent
              ? "border-red-200 bg-red-50/50 dark:border-red-900 dark:bg-red-950/20"
              : "border-amber-200 bg-amber-50/50 dark:border-amber-900 dark:bg-amber-950/20"
          }`}
        >
          <div
            className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-white shadow-sm ${
              isUrgent ? "bg-red-500" : "bg-amber-500"
            }`}
          >
            <CalendarDays className="h-5 w-5" />
          </div>
          <div className="flex-1 text-center sm:text-left">
            <h3
              className={`font-bold text-sm ${isUrgent ? "text-red-900 dark:text-red-200" : "text-amber-900 dark:text-amber-200"}`}
            >
              Upcoming Proposal Defence
            </h3>
            <p
              className={`text-sm ${isUrgent ? "text-red-700 dark:text-red-400" : "text-amber-700 dark:text-amber-400"}`}
            >
              Your defence for <strong className="font-bold">{upcomingDefence.proposalTitle}</strong> is coming up in{" "}
              <span className="rounded bg-background/50 px-1.5 py-0.5 font-bold font-mono">
                {timeLeft.d}d {timeLeft.h.toString().padStart(2, "0")}h {timeLeft.m.toString().padStart(2, "0")}m{" "}
                {timeLeft.s.toString().padStart(2, "0")}s
              </span>
            </p>
          </div>
          <Button
            size="sm"
            onClick={() => setShowRSVPModal(true)}
            className={isUrgent ? "bg-red-600 hover:bg-red-700" : "bg-amber-600 hover:bg-amber-700"}
          >
            View Appointment
          </Button>
        </div>
      )}

      {/* Header Section */}
      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="font-black text-2xl text-slate-900 uppercase tracking-tight dark:text-slate-100">
            {roleLabel} <span className="text-primary">Workspace</span>
          </h1>
          <p className="mt-1 font-medium text-slate-500 text-xs dark:text-slate-400">
            Welcome back, <span className="font-bold text-foreground">{user?.name}</span>. Here&apos;s your personalized
            research oversight.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link href="/dashboard/proposals/new" className="w-full sm:w-auto">
            <Button size="sm" className="h-9 gap-2">
              <Plus className="h-3.5 w-3.5" />
              New Proposal
            </Button>
          </Link>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  className="relative h-9 w-9 rounded-full border-slate-200 dark:border-slate-800"
                >
                  <Bell className="h-4 w-4" />
                  <span className="absolute top-2 right-2 h-2 w-2 rounded-full border-2 border-background bg-destructive" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>You have 4 new notifications</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>

      {/* Perspectives Content */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        <ResearcherView />
      </motion.div>

      {/* RSVP Modal */}
      <Dialog open={showRSVPModal} onOpenChange={setShowRSVPModal}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-amber-100 dark:bg-amber-900/50">
              <CalendarDays className="h-6 w-6 text-amber-600 dark:text-amber-400" />
            </div>
            <DialogTitle className="mt-4 text-center font-semibold text-xl">Defence Appointment RSVP</DialogTitle>
            <DialogDescription className="text-center text-slate-500">
              Please review the details below and confirm your attendance.
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
              <div className="flex flex-col gap-1 rounded-lg border bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-900/50">
                <p className="flex items-center gap-1.5 font-bold text-[11px] text-slate-500 uppercase tracking-wider">
                  <MapPin className="h-3.5 w-3.5" /> Location
                </p>
                <p className="font-semibold text-slate-900 dark:text-slate-100">{upcomingDefence?.location}</p>
              </div>
            </div>
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
