"use client";

import type { ReactNode } from "react";
import { useEffect } from "react";

import { useRouter } from "next/navigation";

import NotFoundPage from "@/app/404";
import { useAuthStore } from "@/stores/authStore";

/**
 * Admin space permission guard (permission-only; no roles).
 *
 * Rule:
 * - Only users with ADMIN_VIEW or ADMIN_EDIT permission can access /admin.
 * - Any authenticated user without admin permissions is redirected to /dashboard.
 * - Unauthenticated users are redirected to /login.
 */
export function AdminPermissionGuard({ children }: { children: ReactNode }) {
  const router = useRouter();
  const { user, isLoading } = useAuthStore();

  // A user is an admin if they have either ADMIN_VIEW or ADMIN_EDIT permission.
  // The backend now provides a convenient `canAccessAdmin` flag based on these permissions.
  const isAdmin =
    !isLoading && !!user && (user.canAccessAdmin === true || (user.permissions ?? []).includes("ADMIN_EDIT"));

  useEffect(() => {
    if (isLoading) return;
    if (!user) {
      router.replace("/login");
      return;
    }

    if (isAdmin) return;

    // Non-admin authenticated user — redirect to their own space.
    const t = window.setTimeout(() => {
      router.replace("/dashboard");
    }, 200);

    return () => window.clearTimeout(t);
  }, [isAdmin, isLoading, router, user]);

  if (isLoading) {
    return (
      <div className="flex h-dvh w-full items-center justify-center bg-slate-50 dark:bg-slate-950">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-slate-200 border-t-blue-600" />
      </div>
    );
  }

  // Non-admin: show 404 while redirect fires.
  if (!isAdmin) return <NotFoundPage />;

  return <>{children}</>;
}
