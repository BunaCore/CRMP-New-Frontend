"use client";

import type { ReactNode } from "react";
import { useEffect } from "react";

import { useRouter } from "next/navigation";

import { hasPermission } from "@/access-control/permission-gates";
import NotFoundPage from "@/app/404";
import { useAuthStore } from "@/stores/authStore";

/**
 * Admin space permission guard (permission-only; no roles).
 *
 * Rule:
 * - If the user has `PROJECT_CREATE`, they are treated as PI and redirected
 *   away from `/admin` to `/dashboard`.
 * - Otherwise, admin routes are allowed (sidebar + component gates handle
 *   the granular permissions).
 */
export function AdminPermissionGuard({ children }: { children: ReactNode }) {
  const router = useRouter();
  const { user, isLoading } = useAuthStore();

  const isPI = !isLoading && !!user && hasPermission(user.permissions ?? [], "PROJECT_CREATE");

  useEffect(() => {
    if (isLoading) return;
    if (!user) {
      router.replace("/login");
      return;
    }

    if (!isPI) return;

    // Show the 404 UX first, then redirect to the PI space.
    const t = window.setTimeout(() => {
      router.replace("/dashboard");
    }, 200);

    return () => window.clearTimeout(t);
  }, [isPI, isLoading, router, user]);

  if (isLoading) {
    return (
      <div className="flex h-dvh w-full items-center justify-center bg-slate-50 dark:bg-slate-950">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-slate-200 border-t-blue-600" />
      </div>
    );
  }

  if (isPI) return <NotFoundPage />;

  return <>{children}</>;
}
