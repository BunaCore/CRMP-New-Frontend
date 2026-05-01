"use client";

import Image from "next/image";
import Link from "next/link";

import { CircleHelp, ClipboardList, Command, Database, File, Search, Settings } from "lucide-react";
import { useShallow } from "zustand/react/shallow";

import { hasPermission } from "@/access-control/permission-gates";
import {
  DASHBOARD_SIDEBAR_PERMISSION_RULES,
  SIDEBAR_UNCONFIGURED_ROUTES_VISIBILITY,
} from "@/access-control/sidebar-permission-config";
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
import { rootUser } from "@/data/users";
import { sidebarItems } from "@/navigation/sidebar/sidebar-items";
import { usePreferencesStore } from "@/stores/preferences/preferences-provider";

import { NavMain } from "./nav-main";
import { NavUser } from "./nav-user";
import { SidebarSupportCard } from "./sidebar-support-card";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { sidebarVariant, sidebarCollapsible, isSynced } = usePreferencesStore(
    useShallow((s) => ({
      sidebarVariant: s.sidebarVariant,
      sidebarCollapsible: s.sidebarCollapsible,
      isSynced: s.isSynced,
    })),
  );

  const { user, isLoading } = useSession();

  // 🔥 shape behavior (keep this consistent system-wide)
  const variant = isSynced ? "floating" : sidebarVariant;
  const collapsible = isSynced ? sidebarCollapsible : props.collapsible;

  const filteredNavGroups = isLoading
    ? []
    : sidebarItems
        .map((group) => ({
          ...group,
          items: group.items.filter((item) => {
            const required = DASHBOARD_SIDEBAR_PERMISSION_RULES[item.url];

            if (!required || required.length === 0) {
              return SIDEBAR_UNCONFIGURED_ROUTES_VISIBILITY === "visible";
            }

            return required.some((p) => hasPermission(user?.permissions ?? [], p));
          }),
        }))
        .filter((group) => group.items.length > 0);

  return (
    <Sidebar
      {...props}
      variant={variant}
      collapsible={collapsible}
      className="border-r border-slate-200/50 dark:border-slate-800/50"
    >
      {/* HEADER */}
      <SidebarHeader className="px-2 pt-3">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild className="hover:bg-transparent active:bg-transparent">
              <Link prefetch={false} href="/dashboard" className="flex w-full items-center gap-2 px-2">
                {/* cleaner logo version (your second style) */}
                <Image src="/logo.png" alt="Logo" width={28} height={28} className="object-contain" />

                <span className="font-semibold text-base tracking-tight">{APP_CONFIG.name}</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      {/* CONTENT */}
      <SidebarContent className="px-2">
        <NavMain items={filteredNavGroups} />
      </SidebarContent>

      {/* FOOTER */}
      <SidebarFooter className="px-2 pb-3 space-y-2">
        <SidebarSupportCard />

        <NavUser
          user={{
            name: user?.name ?? rootUser.name,
            email: user?.email ?? rootUser.email,
            avatar: user?.avatarUrl ?? rootUser.avatar,
          }}
        />
      </SidebarFooter>
    </Sidebar>
  );
}
