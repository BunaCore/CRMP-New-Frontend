"use client";

import Link from "next/link";

import { Command } from "lucide-react";
import { useShallow } from "zustand/react/shallow";

// We reuse the existing generic Nav components from your main dash
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
  const variant = isSynced ? sidebarVariant : props.variant;
  const collapsible = isSynced ? sidebarCollapsible : props.collapsible;

  // Permission-driven sidebar filtering (no role-based gating).
  const dynamicNavItems = getAuthorizedAdminNavItems(user?.permissions ?? []);

  return (
    <Sidebar {...props} variant={variant} collapsible={collapsible}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <Link prefetch={false} href="/admin">
                <Command />
                <span className="text-base font-semibold">{APP_CONFIG.name} - Admin Space</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        {/* Pass the fully computed and permitted items to the nav list */}
        <NavMain items={dynamicNavItems} />
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <div className="text-muted-foreground w-full px-2 pb-2 text-center text-xs">
            Logged in as: <span className="font-bold">{user?.roles[0] || "Unknown"}</span>
          </div>
        </SidebarMenu>
        {/* We can re-use the generic user menu component for Admin sidebar */}
        <NavUser
          user={{
            name: user?.name || "Guest",
            email: user?.email || "No email",
            avatar: "", // Add avatar field if available in user profile
          }}
        />
      </SidebarFooter>
    </Sidebar>
  );
}
