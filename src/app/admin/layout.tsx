import type { ReactNode } from "react";

import { cookies } from "next/headers";

import { Bell } from "lucide-react";

import { AdminPermissionGuard } from "@/access-control/AdminPermissionGuard";
import { ThemeSwitcher } from "@/app/(main)/dashboard/_components/sidebar/theme-switcher";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";

import { AdminSidebar } from "./_components/admin-sidebar";

export default async function AdminLayout({ children }: { children: ReactNode }) {
  const cookieStore = await cookies();
  const defaultOpen = cookieStore.get("sidebar_state")?.value !== "false";

  return (
    <SidebarProvider defaultOpen={defaultOpen} className="bg-muted/30">
      <AdminSidebar />
      <SidebarInset>
        <header className="m-4 flex h-12 shrink-0 items-center justify-between gap-2 rounded-full border bg-background px-4 shadow-sm lg:px-6">
          {/* LEFT */}
          <div className="flex items-center gap-2">
            <SidebarTrigger className="-ml-1" />
            <h1 className="font-semibold text-base tracking-tight">Admin Console</h1>
          </div>

          {/* RIGHT */}
          <div className="flex items-center gap-3">
            <ThemeSwitcher />

            {/* Bell */}
            <Button
              variant="outline"
              size="icon"
              className="relative h-9 w-9 rounded-full border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900"
            >
              <Bell className="h-4 w-4 text-slate-600 dark:text-slate-400" />
              <span className="absolute top-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-white bg-red-500 dark:border-slate-900" />
            </Button>

            {/* Avatar */}
            <Avatar className="h-9 w-9 border-2 border-white shadow-sm dark:border-slate-800">
              <AvatarFallback className="bg-blue-600 text-xs font-bold text-white">AD</AvatarFallback>
            </Avatar>
          </div>
        </header>
        <div className="mx-4 mb-4 flex flex-1 flex-col gap-4 overflow-hidden rounded-lg border bg-background p-4 shadow-sm">
          <AdminPermissionGuard>{children}</AdminPermissionGuard>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
