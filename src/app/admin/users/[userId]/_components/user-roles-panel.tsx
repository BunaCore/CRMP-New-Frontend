"use client";

import { useEffect, useMemo, useState } from "react";

import { Check, Loader2, Shield, ShieldOff, UserRoundPlus } from "lucide-react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetAccessRoles } from "@/lib/api/access-control/queries";
import { useUpdateUserRoles } from "@/lib/api/users/mutations";
import type { UserDetails } from "@/lib/api/users/types";

interface UserRolesPanelProps {
  user: UserDetails;
}

export function UserRolesPanel({ user }: UserRolesPanelProps) {
  const [selectedRoleIds, setSelectedRoleIds] = useState<string[]>(user.roles.map((role) => role.id));
  const [savedRoleIds, setSavedRoleIds] = useState<string[]>(user.roles.map((role) => role.id));

  const { data: accessRoles = [], isLoading } = useGetAccessRoles(true);
  const updateUserRolesMutation = useUpdateUserRoles();

  useEffect(() => {
    const nextRoleIds = user.roles.map((role) => role.id);
    setSelectedRoleIds(nextRoleIds);
    setSavedRoleIds(nextRoleIds);
  }, [user.roles]);

  const hasChanges = useMemo(() => {
    const current = [...selectedRoleIds].sort();
    const original = [...savedRoleIds].sort();
    return current.length !== original.length || current.some((id, index) => id !== original[index]);
  }, [savedRoleIds, selectedRoleIds]);

  const assignedRoles = useMemo(
    () => accessRoles.filter((role) => selectedRoleIds.includes(role.id)),
    [accessRoles, selectedRoleIds],
  );

  function toggleRole(roleId: string) {
    setSelectedRoleIds((prev) => (prev.includes(roleId) ? prev.filter((id) => id !== roleId) : [...prev, roleId]));
  }

  async function handleSave() {
    try {
      await updateUserRolesMutation.mutateAsync({
        userId: user.id,
        roleIds: selectedRoleIds,
      });
      setSavedRoleIds(selectedRoleIds);
      toast.success("User roles updated.");
    } catch {
      toast.error("Could not update user roles.");
    }
  }

  return (
    <Card className="overflow-hidden border-slate-200/60 shadow-none dark:border-slate-800/60">
      <CardHeader className="border-slate-100 border-b bg-slate-50/50 pb-4 dark:border-slate-800 dark:bg-slate-900/20">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <CardTitle className="font-bold text-lg">Access Roles</CardTitle>
            <CardDescription className="mt-1">
              Compact role editor. Add or revoke roles by toggling the chips below. Saving replaces the full set.
            </CardDescription>
          </div>
          <Button
            className="rounded-full bg-blue-600 hover:bg-blue-700"
            disabled={!hasChanges || updateUserRolesMutation.isPending}
            onClick={handleSave}
          >
            {updateUserRolesMutation.isPending ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <UserRoundPlus className="mr-2 h-4 w-4" />
            )}
            Save Roles
          </Button>
        </div>
      </CardHeader>

      <CardContent className="space-y-5 p-6">
        <div className="flex flex-wrap gap-2 rounded-2xl border border-slate-200 bg-slate-50/70 p-4 dark:border-slate-800 dark:bg-slate-950/40">
          <div className="mr-2 flex items-center gap-2">
            <Shield className="h-4 w-4 text-slate-500" />
            <span className="font-semibold text-slate-600 text-sm dark:text-slate-300">Assigned roles</span>
          </div>
          {assignedRoles.length === 0 ? (
            <span className="text-slate-500 text-sm">No roles assigned yet.</span>
          ) : (
            assignedRoles.map((role) => (
              <Badge
                key={role.id}
                className="rounded-full border-0 bg-blue-100 px-3 py-1 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300"
              >
                <Check className="mr-1 h-3.5 w-3.5" />
                {role.name}
              </Badge>
            ))
          )}
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, index) => (
              // biome-ignore lint/suspicious/noArrayIndexKey: skeleton items
              <Skeleton key={index} className="h-24 rounded-2xl" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {accessRoles.map((role) => {
              const active = selectedRoleIds.includes(role.id);
              return (
                <button
                  key={role.id}
                  type="button"
                  onClick={() => toggleRole(role.id)}
                  className={`group rounded-2xl border p-4 text-left transition-all ${
                    active
                      ? "border-blue-300 bg-blue-50 shadow-sm dark:border-blue-900/50 dark:bg-blue-950/30"
                      : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-950/50 dark:hover:border-slate-700"
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <ShieldOff className={`h-4 w-4 ${active ? "text-blue-600" : "text-slate-400"}`} />
                        <p className="font-semibold text-slate-900 text-sm dark:text-slate-100">{role.name}</p>
                      </div>
                      <p className="mt-1 text-slate-500 text-xs leading-relaxed">{role.description}</p>
                    </div>
                    <div
                      className={`flex h-5 w-5 items-center justify-center rounded-full border ${
                        active
                          ? "border-blue-600 bg-blue-600 text-white"
                          : "border-slate-300 text-transparent dark:border-slate-700"
                      }`}
                    >
                      <Check className="h-3 w-3" />
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
