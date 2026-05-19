"use client";

import { useEffect, useMemo, useState } from "react";

import Link from "next/link";

import { useQuery } from "@tanstack/react-query";
import { differenceInDays, differenceInHours, differenceInMinutes, differenceInSeconds, isFuture } from "date-fns";
import { motion } from "framer-motion";
import { Bell, CalendarDays, CheckCircle2, MapPin, MessageSquare, Plus } from "lucide-react";

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
import { getMyProjects } from "@/lib/api/projects/queries";
import { getMyProposals } from "@/lib/api/proposals/queries";

import { ResearcherView } from "./_components/views/researcher-view";

type DefenceAlertItem = {
  id: string;
  sourceId: string;
  sourceTitle: string;
  phase: "PROPOSAL" | "PROJECT";
  defenceDate: string;
  location: string;
  note?: string;
} | null;

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

  // Fetch user's projects (includes defenceSchedules)
  const { data: userProjects } = useQuery({
    queryKey: ["projects", "mine"],
    queryFn: getMyProjects,
  });

  // Build a unified upcoming defence list from BOTH phases
  // Each alert carries a `phase` so the UI can label it correctly
  const upcomingDefences = useMemo(() => {
    // ── Proposal-phase defences ────────────────────────────────────────────
    const proposalDefences = (userProposals ?? []).flatMap((p) =>
      (p.defenceSchedules ?? []).map((d) => ({
        id: d.id,
        sourceId: p.id,
        sourceTitle: p.title,
        phase: "PROPOSAL" as const,
        defenceDate: d.defenceDate,
        location: d.location,
        note: d.note ?? undefined,
      })),
    );

    // ── Project-phase defences ─────────────────────────────────────────────
    const projectDefences = (userProjects ?? []).flatMap((p) =>
      (p.defenceSchedules ?? []).map((d) => ({
        id: d.id,
        sourceId: p.projectId,
        sourceTitle: p.projectTitle,
        phase: "PROJECT" as const,
        defenceDate: d.defenceDate,
        location: d.location,
        note: d.note ?? undefined,
      })),
    );

    // Keep only future defences and sort by closest date
    return [...proposalDefences, ...projectDefences]
      .filter((d) => isFuture(new Date(d.defenceDate)))
      .sort((a, b) => new Date(a.defenceDate).getTime() - new Date(b.defenceDate).getTime());
  }, [userProposals, userProjects]);

  // The single most-upcoming defence drives the countdown
  const upcomingDefence = upcomingDefences[0] ?? null;

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

  // Track which defence the RSVP modal is showing (typed explicitly)
  const [activeRSVP, setActiveRSVP] = useState<DefenceAlertItem>(null);

  return (
    <div className="flex flex-1 flex-col gap-8">
      {/* Dynamic Defence Alert Notifications — one banner per upcoming defence, both PROPOSAL & PROJECT phases */}
      {upcomingDefences.map((defence) => {
        const defenceDateObj = new Date(defence.defenceDate);
        if (!isFuture(defenceDateObj)) return null; // expired: skip

        // Check urgency for each defence separately
        const targetDate = new Date(defence.defenceDate);
        const now = new Date();
        const diffD = differenceInDays(targetDate, now);
        const diffH = differenceInHours(targetDate, now);
        const isDefenceUrgent = diffD === 0 && diffH < 24;

        const alertColor = isDefenceUrgent
          ? "border-red-200 bg-red-50/50 dark:border-red-900 dark:bg-red-950/20"
          : "border-amber-200 bg-amber-50/50 dark:border-amber-900 dark:bg-amber-950/20";
        const iconBgColor = isDefenceUrgent ? "bg-red-500" : "bg-amber-500";
        const textTitleColor = isDefenceUrgent
          ? "text-red-900 dark:text-red-200"
          : "text-amber-900 dark:text-amber-200";
        const textDescColor = isDefenceUrgent ? "text-red-700 dark:text-red-400" : "text-amber-700 dark:text-amber-400";
        const buttonColor = isDefenceUrgent ? "bg-red-600 hover:bg-red-700" : "bg-amber-600 hover:bg-amber-700";

        const phaseLabel = defence.phase === "PROJECT" ? "Project Defence" : "Proposal Defence";
        return (
          <div
            key={defence.id}
            className={`flex flex-col items-center gap-4 rounded-xl border p-4 shadow-sm transition-colors duration-500 sm:flex-row ${alertColor}`}
          >
            <div
              className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-white shadow-sm transition-colors duration-500 ${iconBgColor}`}
            >
              <CalendarDays className="h-5 w-5" />
            </div>
            <div className="flex-1 text-center sm:text-left">
              <h3 className={`font-bold text-sm transition-colors duration-500 ${textTitleColor}`}>
                {isDefenceUrgent ? "CRITICAL: " : "Action Required: "} Upcoming {phaseLabel}
              </h3>
              <p className={`mt-0.5 text-sm transition-colors duration-500 ${textDescColor}`}>
                Your {phaseLabel.toLowerCase()} for <strong className="font-bold">{defence.sourceTitle}</strong> is{" "}
                coming up in{" "}
                {defence.id === upcomingDefence?.id && timeLeft !== null ? (
                  <span className="rounded bg-white/50 px-1.5 py-0.5 font-bold font-mono tracking-tight dark:bg-black/20">
                    {timeLeft.d}d {timeLeft.h.toString().padStart(2, "0")}h {timeLeft.m.toString().padStart(2, "0")}m{" "}
                    {timeLeft.s.toString().padStart(2, "0")}s
                  </span>
                ) : (
                  <span className="font-semibold">
                    {defenceDateObj.toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" })}
                  </span>
                )}
              </p>
            </div>
            <Button
              onClick={() => {
                setActiveRSVP(defence);
                setShowRSVPModal(true);
              }}
              className={`w-full font-semibold text-white shadow-sm transition-colors duration-500 sm:w-auto ${buttonColor}`}
            >
              View
            </Button>
          </div>
        );
      })}

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
              <p className="font-bold text-[11px] text-slate-500 uppercase tracking-wider">
                {activeRSVP?.phase === "PROJECT" ? "Project" : "Proposal"}
              </p>
              <p className="font-semibold text-slate-900 dark:text-slate-100">{activeRSVP?.sourceTitle}</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1 rounded-lg border bg-slate-50 p-3 dark:border-slate-800 dark:bg-slate-900/50">
                <p className="flex items-center gap-1.5 font-bold text-[11px] text-slate-500 uppercase tracking-wider">
                  <CalendarDays className="h-3.5 w-3.5" /> Date & Time
                </p>
                <p className="font-semibold text-slate-900 dark:text-slate-100">
                  {activeRSVP
                    ? new Date(activeRSVP.defenceDate).toLocaleString(undefined, {
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

              <div className="flex flex-col gap-1 rounded-lg border bg-slate-50 p-3 dark:border-slate-800 dark:bg-slate-900/50">
                <p className="flex items-center gap-1.5 font-bold text-[11px] text-slate-500 uppercase tracking-wider">
                  <MapPin className="h-3.5 w-3.5" /> Location / Link
                </p>
                <p className="font-semibold text-slate-900 dark:text-slate-100">{activeRSVP?.location}</p>
              </div>
            </div>

            {activeRSVP?.note && (
              <div className="rounded-lg border border-indigo-100 bg-indigo-50 p-4 dark:border-indigo-900/30 dark:bg-indigo-900/10">
                <p className="flex items-center gap-1.5 font-bold text-[11px] text-indigo-600 uppercase tracking-wider dark:text-indigo-400">
                  <MessageSquare className="h-3.5 w-3.5" /> Message from Admin
                </p>
                <p className="mt-2 text-indigo-900 text-sm leading-relaxed dark:text-indigo-200">{activeRSVP.note}</p>
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
