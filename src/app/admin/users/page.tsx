"use client";

import { ShieldCheck } from "lucide-react";

import { RequiresPermissions } from "@/access-control/permission-gates";

import { UsersRolesTabs } from "./_components/users-roles-tabs";
import { UsersProvider } from "./users-context";

export default function AdminUsersPage() {
  return (
    <UsersProvider>
      <RequiresPermissions
        permissions={["USER_VIEW", "ADMIN_EDIT", "USER_PROVISION"]}
        mode="any"
        fallback="notFoundOrRedirect"
      >
        <div className="flex flex-1 flex-col gap-5 p-4 md:p-6 lg:p-8">
          <div className="flex flex-col justify-between gap-3 md:flex-row md:items-center">
            <div>
              <h1 className="flex items-center gap-2 font-bold text-2xl text-slate-900 tracking-tight dark:text-slate-100">
                <ShieldCheck className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                Users & Roles
              </h1>
              <p className="mt-0.5 max-w-3xl text-slate-500 text-sm">
                Manage user accounts, invite new members, and configure role permission mapping.
              </p>
            </div>
          </div>
          <UsersRolesTabs />
        </div>
      </RequiresPermissions>
    </UsersProvider>
  );
}
