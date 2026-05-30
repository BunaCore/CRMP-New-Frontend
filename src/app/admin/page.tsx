"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Bell, Command } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useSession } from "@/context/SessionContext";

import { AdminApproverView } from "./_components/views/admin-approver-view";
import { AdminEvaluatorView } from "./_components/views/admin-evaluator-view";
import { AdminFinanceView } from "./_components/views/admin-finance-view";
import { AdminSystemView } from "./_components/views/admin-system-view";

export default function AdminDashboardPage() {
  const { user } = useSession();

  // Role labels for header — using canonical backend roles
  const getRoleLabel = (roles: string[] | undefined) => {
    if (!roles || roles.length === 0) return "Admin";
    const map: Record<string, string> = {
      SYSTEM_ADMIN: "System Admin",
      FINANCE: "Finance Officer",
      COORDINATOR: "Dept. Coordinator",
      DGC_MEMBER: "DGC Member",
      ADRPM: "Assoc. Director RPM",
      PG_OFFICE: "PG Office",
      RAD: "Research Director",
      VPRTT: "VP Research",
      AC_MEMBER: "Academic Council",
      EVALUATOR: "Peer Evaluator",
      ADVISOR: "Research Advisor",
      EXTERNAL_EXPERT: "External Expert",
      FACULTY: "Faculty",
      STUDENT: "Student",
    };
    return map[roles[0]] ?? roles[0];
  };

  const roleLabel = getRoleLabel(user?.roles);

  // Determine which perspective to show based on role prioritization
  // Same logic order as the main dashboard:
  // 1. System Admin → System governance view
  // 2. Finance → Disbursement management view
  // 3. Management/Approver roles → Approval queue view
  // 4. Everything else → Evaluator/Advisor view (default for admin console)
  const renderView = () => {
    if (!user) return null;
    const roles = user.roles || [];

    // Priority 1: System Admin — full system governance
    if (roles.includes("SYSTEM_ADMIN")) return <AdminSystemView />;

    // Priority 2: Finance — disbursement and budget management
    if (roles.includes("FINANCE")) return <AdminFinanceView />;

    // Priority 3: Management/Approver — proposal approval queue
    const approverRoles = ["COORDINATOR", "DGC_MEMBER", "ADRPM", "PG_OFFICE", "RAD", "VPRTT", "AC_MEMBER"];
    if (roles.some((r) => approverRoles.includes(r))) return <AdminApproverView />;

    // Priority 4: Evaluator, Advisor, External Expert — assigned reviews
    return <AdminEvaluatorView />;
  };

  return (
    <div className="flex flex-1 flex-col gap-8">
      {/* Header Section */}
      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="flex items-center gap-2 font-black text-2xl text-slate-900 uppercase tracking-tight dark:text-slate-100">
            <Command className="h-5 w-5 text-blue-600 dark:text-blue-500" />
            {roleLabel} <span className="text-primary">Console</span>
          </h1>
          <p className="mt-1 font-medium text-slate-500 text-xs dark:text-slate-400">
            Welcome back, <span className="font-bold text-foreground">{user?.name}</span>. Here&apos;s your
            institutional oversight dashboard.
          </p>
        </div>

        <div className="flex items-center gap-3">
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
              <TooltipContent>Admin notifications</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>

      {/* Multi-Perspective Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={roleLabel}
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -10 }}
          transition={{ duration: 0.4 }}
        >
          {renderView()}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
