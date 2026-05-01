"use client";

import type { ReactNode } from "react";
import { useEffect } from "react";

import { useRouter } from "next/navigation";

import { useAuthStore } from "@/stores/authStore";

/**
 * Dashboard space permission guard.
 *
 * Rule:
 * - Any authenticated user can access /dashboard (students, researchers, etc.)
 * - Unauthenticated users are redirected to /login.
 *
 * Granular per-section access within /dashboard is handled by
 * individual <RequiresPermissions> / <Can> gates on each page.
 */
export function DashboardPermissionGuard({ children }: { children: ReactNode }) {
  const router = useRouter();
  const { user, isLoading } = useAuthStore();

  // Any logged-in user is allowed into /dashboard.
  const allowed = !isLoading && !!user;

  useEffect(() => {
    if (isLoading) return;
    if (allowed) return;

    // Unauthenticated — send to login.
    router.replace("/login");
  }, [allowed, isLoading, router]);

  if (isLoading) {
    return (
      <div className="flex h-dvh w-full items-center justify-center bg-slate-50 dark:bg-slate-950">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-slate-200 border-t-blue-600" />
      </div>
    );
  }

  if (!allowed) return null;

  return <>{children}</>;
}
