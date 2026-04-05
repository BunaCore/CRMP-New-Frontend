"use client";

import type { ReactNode } from "react";
import { useEffect } from "react";

import { useRouter } from "next/navigation";

import { hasPermission } from "@/access-control/permission-gates";
import NotFoundPage from "@/app/404";
import { useAuthStore } from "@/stores/authStore";

export function DashboardPermissionGuard({ children }: { children: ReactNode }) {
  const router = useRouter();
  const { user, isLoading } = useAuthStore();

  const allowed = !isLoading && !!user && hasPermission(user.permissions ?? [], "PROJECT_CREATE");

  useEffect(() => {
    if (isLoading) return;
    if (!user) {
      router.replace("/login");
      return;
    }

    if (allowed) return;

    // Show 404 UX first, then redirect.
    const t = window.setTimeout(() => {
      router.replace("/admin");
    }, 200);

    return () => window.clearTimeout(t);
  }, [allowed, isLoading, router, user]);

  if (isLoading) {
    return (
      <div className="flex h-dvh w-full items-center justify-center bg-slate-50 dark:bg-slate-950">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-slate-200 border-t-blue-600" />
      </div>
    );
  }

  if (!allowed) return <NotFoundPage />;

  return <>{children}</>;
}
