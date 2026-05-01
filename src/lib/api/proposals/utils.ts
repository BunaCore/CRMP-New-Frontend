/**
 * Proposal UI Utilities
 * Presentation helpers for mapping backend data to UI elements.
 * Import these wherever proposal status or dates are displayed.
 */

import type { ProposalStatus } from "@/lib/api/proposals/types";

// ─── Status → Badge class mapping ─────────────────────────────────────────────

/**
 * Maps a backend ProposalStatus string to the appropriate Tailwind
 * class string for use with the shadcn <Badge variant="outline"> component.
 *
 * @param status - Backend status string (e.g. "Under_Review", "Draft")
 * @returns Tailwind class string for background, text, and border colors
 */
export function getStatusBadgeClass(status: ProposalStatus | string): string {
  switch (status) {
    case "Draft":
      return "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border-slate-200/50";
    case "Under_Review":
      return "bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 border-blue-200/50";
    case "Revision":
      return "bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 border-amber-200/50";
    case "Approved":
      return "bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 border-emerald-200/50";
    case "Rejected":
      return "bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-400 border-red-200/50";
    case "Pending":
      return "bg-indigo-50 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400 border-indigo-200/50";
    default:
      return "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400 border-slate-200/50";
  }
}

// ─── Status → Human-readable label ────────────────────────────────────────────

/**
 * Maps a backend ProposalStatus string to a human-readable display label.
 * Converts snake_case values like "Under_Review" → "Under Review".
 *
 * @param status - Backend status string
 * @returns Display-friendly label string
 */
export function getStatusLabel(status: ProposalStatus | string): string {
  switch (status) {
    case "Draft":
      return "Draft";
    case "Under_Review":
      return "Under Review";
    case "Revision":
      return "Revisions Required";
    case "Accepted":
      return "Approved";
    case "Rejected":
      return "Rejected";
    case "Pending":
      return "Submitted";
    default:
      return status.replace(/_/g, " ");
  }
}

// ─── Date formatting ───────────────────────────────────────────────────────────

/**
 * Formats an ISO 8601 date string into a short, readable date.
 * Example: "2026-04-01T14:30:00.000Z" → "Apr 1, 2026"
 *
 * @param isoDate - ISO date string from the API
 * @returns Formatted date string, or "—" if the input is invalid/empty
 */
export function formatProposalDate(isoDate: string | null | undefined): string {
  if (!isoDate) return "—";
  try {
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    }).format(new Date(isoDate));
  } catch {
    return "—";
  }
}

/**
 * Formats an ISO 8601 date string into a relative "time ago" string.
 * Uses Intl.RelativeTimeFormat for locale-aware output.
 * Example: "2026-04-05T14:30:00.000Z" → "2 days ago"
 *
 * @param isoDate - ISO date string from the API
 * @returns Relative time string, or "—" if the input is invalid/empty
 */
export function formatRelativeDate(isoDate: string | null | undefined): string {
  if (!isoDate) return "—";
  try {
    const date = new Date(isoDate);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffSecs = Math.floor(diffMs / 1_000);
    const diffMins = Math.floor(diffSecs / 60);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);
    const diffWeeks = Math.floor(diffDays / 7);

    const rtf = new Intl.RelativeTimeFormat("en", { numeric: "auto" });

    if (diffSecs < 60) return rtf.format(-diffSecs, "second");
    if (diffMins < 60) return rtf.format(-diffMins, "minute");
    if (diffHours < 24) return rtf.format(-diffHours, "hour");
    if (diffDays < 7) return rtf.format(-diffDays, "day");
    return rtf.format(-diffWeeks, "week");
  } catch {
    return "—";
  }
}

// ─── ID helpers ────────────────────────────────────────────────────────────────

/**
 * Shortens a UUID for display in table ID cells.
 * Example: "550e8400-e29b-41d4-a716-446655440000" → "#550e8400"
 *
 * @param id - Full UUID string
 * @returns Prefixed short ID string
 */
export function shortProposalId(id: string): string {
  if (!id) return "—";
  return `#${id.slice(0, 8)}`;
}

/**
 * Generates avatar initials from a full name string.
 * Example: "Abebe Kebede" → "AK"
 *
 * @param name - Full name string
 * @returns 1–2 character uppercase initials
 */
export function getNameInitials(name: string): string {
  if (!name) return "??";
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
}
