import type { ReactNode } from "react";

import { cookies } from "next/headers";

import { AdminPermissionGuard } from "@/access-control/AdminPermissionGuard";
import { ThemeSwitcher } from "@/app/(main)/dashboard/_components/sidebar/theme-switcher";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";

import { AdminSidebar } from "./_components/admin-sidebar";

export default async function AdminLayout({ children }: { children: ReactNode }) {
  const cookieStore = await cookies();
  const defaultOpen = cookieStore.get("sidebar_state")?.value !== "false";

  return (
    <SidebarProvider defaultOpen={defaultOpen} className="bg-muted/30">
      <AdminSidebar />
      <SidebarInset>
        <header className="m-4 flex h-16 shrink-0 items-center justify-between gap-2 rounded-full border bg-background px-4 shadow-sm lg:px-6">
          <div className="flex items-center gap-2">
            <SidebarTrigger className="-ml-1" />
            <h1 className="font-semibold text-lg tracking-tight">Admin Console</h1>
          </div>
          <div className="flex items-center gap-2">
            <ThemeSwitcher />
          </div>
        </header>
        <div className="mx-4 mb-4 flex flex-1 flex-col gap-4 overflow-hidden rounded-lg border bg-background p-4 shadow-sm">
          <AdminPermissionGuard>{children}</AdminPermissionGuard>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
