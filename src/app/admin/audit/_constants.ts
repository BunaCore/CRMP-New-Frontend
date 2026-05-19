import { FileText, KeyRound, LayoutList, ShieldCheck, UserCog } from "lucide-react";

import type { AuditAction, AuditEntityType } from "@/lib/api/audit/types";

export const actionStyles: Record<AuditAction, { dot: string; badge: string; label: string }> = {
  CREATED: {
    dot: "bg-violet-600",
    badge:
      "border-violet-200 bg-violet-50 text-violet-700 dark:border-violet-900/40 dark:bg-violet-950/30 dark:text-violet-300",
    label: "Created",
  },
  UPDATED: {
    dot: "bg-sky-500",
    badge: "border-sky-200 bg-sky-50 text-sky-700 dark:border-sky-900/40 dark:bg-sky-950/30 dark:text-sky-300",
    label: "Updated",
  },
  DELETED: {
    dot: "bg-rose-500",
    badge: "border-rose-200 bg-rose-50 text-rose-700 dark:border-rose-900/40 dark:bg-rose-950/30 dark:text-rose-300",
    label: "Deleted",
  },
  LOGIN: {
    dot: "bg-emerald-500",
    badge:
      "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900/40 dark:bg-emerald-950/30 dark:text-emerald-300",
    label: "Login",
  },
  PERMISSION_CHANGED: {
    dot: "bg-lime-500",
    badge: "border-lime-200 bg-lime-50 text-lime-700 dark:border-lime-900/40 dark:bg-lime-950/30 dark:text-lime-300",
    label: "Permissions",
  },
  APPROVED: {
    dot: "bg-emerald-500",
    badge:
      "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900/40 dark:bg-emerald-950/30 dark:text-emerald-300",
    label: "Approved",
  },
  REJECTED: {
    dot: "bg-amber-500",
    badge:
      "border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-900/40 dark:bg-amber-950/30 dark:text-amber-300",
    label: "Rejected",
  },
};

export const entityIcons: Record<AuditEntityType, typeof FileText> = {
  proposals: FileText,
  projects: LayoutList,
  users: UserCog,
  budget: ShieldCheck,
  auth: KeyRound,
};
