"use client";

import Link from "next/link";

import { Command } from "lucide-react";
import { useShallow } from "zustand/react/shallow";

import { NavMain } from "@/app/(main)/dashboard/_components/sidebar/nav-main";
import { NavUser } from "@/app/(main)/dashboard/_components/sidebar/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { APP_CONFIG } from "@/config/app-config";
import { useSession } from "@/context/SessionContext";
import { getAuthorizedAdminNavItems } from "@/navigation/sidebar/admin-nav-config";
import { usePreferencesStore } from "@/stores/preferences/preferences-provider";

export function AdminSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { sidebarVariant, sidebarCollapsible, isSynced } = usePreferencesStore(
    useShallow((s) => ({
      sidebarVariant: s.sidebarVariant,
      sidebarCollapsible: s.sidebarCollapsible,
      isSynced: s.isSynced,
    })),
  );

  const { user } = useSession();

  // keep smart syncing behavior (this was the important part from version 1)
  const variant = isSynced ? "floating" : sidebarVariant;
  const collapsible = isSynced ? sidebarCollapsible : props.collapsible;

  const dynamicNavItems = getAuthorizedAdminNavItems(user?.permissions ?? []);

  return (
    <Sidebar
      {...props}
      variant={variant}
      collapsible={collapsible}
      className="border-r border-slate-200/50 dark:border-slate-800/50"
    >
      {/* HEADER */}
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild className="hover:bg-transparent active:bg-transparent">
              <Link prefetch={false} href="/admin" className="flex w-full items-center gap-2 px-2">
                <Command className="size-6 text-blue-600" />

                <span className="font-semibold text-base tracking-tight">{APP_CONFIG.name} - Admin Space</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      {/* CONTENT */}
      <SidebarContent className="px-2">
        <NavMain items={dynamicNavItems} />
      </SidebarContent>

      {/* FOOTER */}
      <SidebarFooter className="px-2">
        <NavUser
          user={{
            name: user?.name || "Guest",
            email: user?.email || "No email",
            avatar: "",
          }}
        />
      </SidebarFooter>
    </Sidebar>
  );
}
