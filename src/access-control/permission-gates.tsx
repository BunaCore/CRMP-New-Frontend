"use client";

import type { ReactNode } from "react";
import { useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";

import NotFoundPage from "@/app/404";
import { useAuthStore } from "@/stores/authStore";

/**
 * Canonical permission names expected from the backend.
 *
 * Notes:
 * - Your UI should always use these canonical strings.
 * - `normalizePermission()` is defensive and may accept aliases while you
 *   migrate between backend permission naming styles.
 * 
 * 
 * d permission-gating utilities in src/access-control/ as
 *  real React components (client-side) that read permissions 
 * from the existing Zustand auth store, wait for session readiness
 *  to avoid UI flashes, and on denial show the existing src/app/not-found.tsx 
 * UI while redirecting back (or to /login).
 */
export type Permission =
  | "PROJECT_CREATE"
  | "PROJECT_PRE_REGISTER"
  | "PROJECT_SUBMIT"
  | "PROJECT_VIEW"
  | "PROJECT_REVIEW"
  | "PROJECT_RECOMMEND"
  | "PROJECT_APPROVE"
  | "PROJECT_REJECT"
  | "TEAM_VIEW"
  | "TEAM_MANAGE"
  | "USER_VIEW"
  | "EVALUATOR_ASSIGN"
  | "ADVISOR_ASSIGN"
  | "COORDINATOR_PROPOSALS_VIEW"
  | "COORDINATOR_DECIDE"
  | "COORDINATOR_ASSIGN"
  | "BUDGET_VIEW"
  | "BUDGET_APPROVE"
  | "BUDGET_REJECT"
  | "ADMIN_VIEW"
  | "ADMIN_EDIT"
  | "FUNDED_SUBMIT"
  | "FUNDED_VIEW"
  | "FUNDED_DECIDE"
  | "FUNDED_ASSIGN"
  | "FUNDED_EVALUATOR_ACCESS"
  | "FUNDED_RAD_ACCESS"
  | "FUNDED_APPROVER_ACCESS"
  | "EVALUATION_SCORE_SUBMIT";

const CANONICAL_PERMISSIONS: Permission[] = [
  "PROJECT_CREATE",
  "PROJECT_PRE_REGISTER",
  "PROJECT_SUBMIT",
  "PROJECT_VIEW",
  "PROJECT_REVIEW",
  "PROJECT_RECOMMEND",
  "PROJECT_APPROVE",
  "PROJECT_REJECT",
  "TEAM_VIEW",
  "TEAM_MANAGE",
  "USER_VIEW",
  "EVALUATOR_ASSIGN",
  "ADVISOR_ASSIGN",
  "COORDINATOR_PROPOSALS_VIEW",
  "COORDINATOR_DECIDE",
  "COORDINATOR_ASSIGN",
  "BUDGET_VIEW",
  "BUDGET_APPROVE",
  "BUDGET_REJECT",
  "ADMIN_VIEW",
  "ADMIN_EDIT",
  "FUNDED_SUBMIT",
  "FUNDED_VIEW",
  "FUNDED_DECIDE",
  "FUNDED_ASSIGN",
  "FUNDED_EVALUATOR_ACCESS",
  "FUNDED_RAD_ACCESS",
  "FUNDED_APPROVER_ACCESS",
  "EVALUATION_SCORE_SUBMIT",
];

/**
 * Optional aliases to smooth migration between permission naming styles.
 * Extend this map as soon as you confirm the exact backend strings.
 */
const PERMISSION_ALIASES: Partial<Record<Permission, string[]>> = {
  PROJECT_CREATE: ["create_proposal"],
  PROJECT_SUBMIT: ["submit_for_review"],
  TEAM_MANAGE: ["manage_team"],
  TEAM_VIEW: ["team_view", "view_team"],

  PROJECT_REVIEW: ["review_proposal"],
  PROJECT_APPROVE: ["approve_proposal", "approve"],
  PROJECT_REJECT: ["reject_proposal", "reject"],

  USER_VIEW: ["manage_users", "user_view", "view_users"],
  EVALUATOR_ASSIGN: ["assign_evaluator"],

  BUDGET_VIEW: ["view_budget"],
  BUDGET_APPROVE: ["approve_budget"],
  BUDGET_REJECT: ["reject_budget"],

  ADMIN_VIEW: ["admin_view"],
  ADMIN_EDIT: ["admin_edit"],
};

function normalizePermission(input: unknown): Permission | null {
  if (typeof input !== "string") return null;
  const raw = input.trim();
  if (!raw) return null;

  const upper = raw.toUpperCase();
  if ((CANONICAL_PERMISSIONS as readonly string[]).includes(upper)) {
    return upper as Permission;
  }

  for (const [canonical, aliases] of Object.entries(PERMISSION_ALIASES)) {
    if (!aliases) continue;
    const normalizedAliases = aliases.map((a) => a.trim().toUpperCase());
    if (normalizedAliases.includes(upper)) return canonical as Permission;
  }

  return null;
}

function normalizePermissions(permissions: string[] | undefined | null): Permission[] {
  if (!permissions) return [];
  const set = new Set<Permission>();
  for (const p of permissions) {
    const normalized = normalizePermission(p);
    if (normalized) set.add(normalized);
  }
  return [...set];
}

export function hasPermission(permissions: string[], permission: Permission): boolean {
  const normalized = normalizePermissions(permissions);
  return normalized.includes(permission);
}

export type PermissionCheckMode = "any" | "all";

export type PermissionGateFallback =
  | null
  | ReactNode
  | "notFoundOrRedirect"; // must render 404-style page and redirect

function getRedirectTarget(): string {
  // Prefer a "real previous page" referrer; otherwise login.
  if (typeof document === "undefined") return "/login";
  const ref = document.referrer;
  if (ref && window.location && ref.startsWith(window.location.origin)) return ref;
  return "/login";
}

export function Can({
  permission,
  fallback = null,
  children,
}: {
  permission: Permission;
  fallback?: PermissionGateFallback;
  children: ReactNode;
}) {
  return (
    <RequiresPermissions
      permissions={[permission]}
      mode="any"
      fallback={fallback}
      // For component-level gating, don't force redirects.
      redirectOnDenied={false}
    >
      {children}
    </RequiresPermissions>
  );
}

export function RequiresPermissions({
  permissions,
  mode = "any",
  fallback = "notFoundOrRedirect",
  children,
  redirectOnDenied,
}: {
  permissions: Permission[];
  mode?: PermissionCheckMode;
  fallback?: PermissionGateFallback;
  children: ReactNode;
  /**
   * If true, the gate will redirect after showing the 404-style UI.
   * Defaults to true only for the `notFoundOrRedirect` fallback.
   */
  redirectOnDenied?: boolean;
}) {
  const router = useRouter();
  const { user, isLoading } = useAuthStore();

  const allowed = useMemo(() => {
    if (!user) return false;
    const userPermissions = user.permissions ?? [];
    const normalized = normalizePermissions(userPermissions);

    if (mode === "all") {
      return permissions.every((p) => normalized.includes(p));
    }
    // mode === "any"
    return permissions.some((p) => normalized.includes(p));
  }, [user, permissions, mode]);

  const shouldRedirect =
    typeof redirectOnDenied === "boolean" ? redirectOnDenied : fallback === "notFoundOrRedirect";

  useEffect(() => {
    if (isLoading) return;
    if (allowed) return;
    if (fallback !== "notFoundOrRedirect") return;
    if (!shouldRedirect) return;

    // Redirect quickly after the 404 UI is available.
    // `router.back()` preserves "redirect to previous" UX when possible.
    const canGoBack = typeof window !== "undefined" && window.history.length > 1;
    if (canGoBack) {
      router.back();
      return;
    }
    router.replace(getRedirectTarget());
  }, [allowed, fallback, isLoading, router, shouldRedirect]);

  // Avoid flash: don't render gated content until permissions are ready.
  if (isLoading) return null;

  if (allowed) return <>{children}</>;

  if (fallback === "notFoundOrRedirect") {
    return <NotFoundPage />;
  }

  // If `fallback` is a ReactNode/null, render it as-is.
  return <>{fallback}</>;
}

