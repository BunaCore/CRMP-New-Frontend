"use client";

import { useState } from "react";

import { Plus, Save } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { useAdminUsers } from "../users-context";

export function RolesPermissionsPanel() {
  const {
    roles,
    selectedRoleId,
    setSelectedRoleId,
    rolePermissionDraft,
    hasRolePermissionChanges,
    toggleRolePermission,
    saveRolePermissionChanges,
    createRole,
    permissions,
    isRolesLoading,
    isPermissionsLoading,
  } = useAdminUsers();
  const [newRoleName, setNewRoleName] = useState("");
  const [newRoleDescription, setNewRoleDescription] = useState("");

  const [isSaving, setIsSaving] = useState(false);
  const [isCreatingRole, setIsCreatingRole] = useState(false);

  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-[280px_1fr]">
      <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-950">
        <h3 className="font-bold text-sm text-slate-700 uppercase tracking-wider dark:text-slate-300">Roles</h3>
        <div className="mt-3 space-y-2">
          {isRolesLoading ? (
            <div className="rounded-lg border border-dashed border-slate-300 p-3 text-slate-500 text-sm dark:border-slate-700">
              Loading roles...
            </div>
          ) : (
            roles.map((role) => (
              <button
                key={role.id}
                type="button"
                onClick={() => setSelectedRoleId(role.id)}
                className={`w-full rounded-lg border px-3 py-2 text-left transition ${
                  selectedRoleId === role.id
                    ? "border-blue-300 bg-blue-50 text-blue-700 dark:border-blue-800 dark:bg-blue-950/40 dark:text-blue-300"
                    : "border-slate-200 hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-900/50"
                }`}
              >
                <p className="font-semibold text-sm">{role.name}</p>
                <p className="text-xs opacity-80">{role.description}</p>
              </button>
            ))
          )}
        </div>

        <div className="mt-4 space-y-2 border-slate-200 border-t pt-4 dark:border-slate-800">
          <Label htmlFor="new-role-name">Create role</Label>
          <Input
            id="new-role-name"
            placeholder="Role name"
            value={newRoleName}
            onChange={(e) => setNewRoleName(e.target.value)}
          />
          <Input
            placeholder="Description"
            value={newRoleDescription}
            onChange={(e) => setNewRoleDescription(e.target.value)}
          />
          <Button
            className="w-full bg-indigo-600 hover:bg-indigo-700"
            disabled={isCreatingRole}
            onClick={async () => {
              if (!newRoleName.trim()) return;
              try {
                setIsCreatingRole(true);
                await createRole(newRoleName, newRoleDescription);
              } catch {
                toast.error("Could not create role.");
              } finally {
                setIsCreatingRole(false);
              }
              setNewRoleName("");
              setNewRoleDescription("");
            }}
          >
            <Plus className="mr-1.5 h-4 w-4" />
            {isCreatingRole ? "Creating..." : "Add Role"}
          </Button>
        </div>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-950">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="font-bold text-sm text-slate-700 uppercase tracking-wider dark:text-slate-300">Permissions</h3>
          <Button
            className="bg-emerald-600 hover:bg-emerald-700"
            disabled={!hasRolePermissionChanges || isSaving}
            onClick={async () => {
              try {
                setIsSaving(true);
                await saveRolePermissionChanges();
              } catch {
                toast.error("Could not save role permissions.");
              } finally {
                setIsSaving(false);
              }
            }}
          >
            <Save className="mr-1.5 h-4 w-4" />
            {isSaving ? "Saving..." : "Save changes"}
          </Button>
        </div>
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          {isPermissionsLoading ? (
            <div className="col-span-full rounded-lg border border-dashed border-slate-300 p-3 text-slate-500 text-sm dark:border-slate-700">
              Loading permissions...
            </div>
          ) : (
            permissions.map((permission) => {
              const checked = rolePermissionDraft.has(permission.id);
              return (
                <label
                  key={permission.id}
                  htmlFor="permission-checkbox"
                  className="flex cursor-pointer items-start gap-3 rounded-lg border border-slate-200 p-3 dark:border-slate-800"
                >
                  <Checkbox
                    id="permission-checkbox"
                    checked={checked}
                    onCheckedChange={() => toggleRolePermission(permission.id)}
                  />
                  <span>
                    <span className="block font-semibold text-sm">{permission.key}</span>
                    <span className="block text-slate-500 text-xs">{permission.description}</span>
                  </span>
                </label>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
