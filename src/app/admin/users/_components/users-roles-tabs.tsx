"use client";

import { Shield, Users } from "lucide-react";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { useAdminUsers } from "../users-context";
import { InviteUserModal } from "./invite-user-modal";
import { RolesPermissionsPanel } from "./roles-permissions-panel";
import { UsersTable } from "./users-table";

export function UsersRolesTabs() {
  const { activeTab, setActiveTab } = useAdminUsers();

  return (
    <>
      <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as "users" | "roles")}>
        <TabsList variant="line" className="h-10 border-slate-200 border-b p-0 dark:border-slate-800">
          <TabsTrigger value="users" className="rounded-none px-5 font-semibold">
            <Users className="mr-2 h-4 w-4" />
            Users
          </TabsTrigger>
          <TabsTrigger value="roles" className="rounded-none px-5 font-semibold">
            <Shield className="mr-2 h-4 w-4" />
            Roles & Permissions
          </TabsTrigger>
        </TabsList>

        <TabsContent value="users" className="mt-4">
          <UsersTable />
        </TabsContent>
        <TabsContent value="roles" className="mt-4">
          <RolesPermissionsPanel />
        </TabsContent>
      </Tabs>
      <InviteUserModal />
    </>
  );
}
