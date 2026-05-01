"use client";

import { usePathname, useRouter } from "next/navigation";

import { Check, ChevronDown, Command, LayoutDashboard } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuthStore } from "@/stores/authStore";

export function DashboardSwitcher() {
  const router = useRouter();
  const pathname = usePathname();
  const { user } = useAuthStore();

  const canAccessAdmin = user?.canAccessAdmin === true || user?.permissions?.includes("admin:view");
  const isAdminWorkspace = pathname.startsWith("/admin");

  if (!canAccessAdmin) {
    return null;
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="h-8 w-auto gap-1.5 rounded-full px-3 font-medium text-slate-600 text-xs shadow-none transition-colors hover:bg-slate-100 hover:text-slate-900 focus-visible:ring-0 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-slate-50"
        >
          {isAdminWorkspace ? (
            <Command className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" />
          ) : (
            <LayoutDashboard className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" />
          )}
          <span className="hidden sm:inline-block">{isAdminWorkspace ? "Admin" : "Workspace"}</span>
          <ChevronDown className="h-3 w-3 text-slate-400 opacity-70" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="w-48 rounded-xl border-slate-200 p-1 shadow-md dark:border-slate-800 dark:bg-slate-950"
      >
        <div className="px-2 py-1.5 font-semibold text-[11px] text-slate-400 uppercase tracking-wider">
          Switch Environment
        </div>
        <DropdownMenuSeparator className="mx-1 dark:bg-slate-800" />
        <DropdownMenuItem
          className="flex cursor-pointer items-center justify-between rounded-lg px-2 py-2 text-slate-600 text-sm focus:bg-slate-100 focus:text-slate-900 dark:text-slate-300 dark:focus:bg-slate-900 dark:focus:text-slate-50"
          onClick={() => router.push("/dashboard")}
        >
          <div className="flex items-center gap-2.5">
            <LayoutDashboard
              className={`h-4 w-4 ${!isAdminWorkspace ? "text-blue-600 dark:text-blue-400" : "text-slate-400 dark:text-slate-500"}`}
            />
            <span className={!isAdminWorkspace ? "font-semibold" : "font-medium"}>Workspace</span>
          </div>
          {!isAdminWorkspace && <Check className="h-4 w-4 text-blue-600 dark:text-blue-400" />}
        </DropdownMenuItem>

        <DropdownMenuItem
          className="flex cursor-pointer items-center justify-between rounded-lg px-2 py-2 text-slate-600 text-sm focus:bg-slate-100 focus:text-slate-900 dark:text-slate-300 dark:focus:bg-slate-900 dark:focus:text-slate-50"
          onClick={() => router.push("/admin")}
        >
          <div className="flex items-center gap-2.5">
            <Command
              className={`h-4 w-4 ${isAdminWorkspace ? "text-blue-600 dark:text-blue-400" : "text-slate-400 dark:text-slate-500"}`}
            />
            <span className={isAdminWorkspace ? "font-semibold" : "font-medium"}>Admin Console</span>
          </div>
          {isAdminWorkspace && <Check className="h-4 w-4 text-blue-600 dark:text-blue-400" />}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
