import { useQuery } from "@tanstack/react-query";

import { apiClient } from "@/lib/api/client";

import type { AccessPermission, AccessRole, AccessRolePermissionsResponse } from "./types";

/**
 * Integration seam for GET /access-control/roles.
 */
export async function getAccessRoles(): Promise<AccessRole[]> {
  const response = await apiClient.get<AccessRole[]>("/access-control/roles");
  return response.data;
}

/**
 * Integration seam for GET /access-control/permissions.
 */
export async function getAccessPermissions(): Promise<AccessPermission[]> {
  const response = await apiClient.get<AccessPermission[]>("/access-control/permissions");
  return response.data;
}

/**
 * Integration seam for GET /access-control/roles/:id/permissions.
 */
export async function getRolePermissions(roleId: string): Promise<AccessRolePermissionsResponse> {
  const response = await apiClient.get<AccessRolePermissionsResponse>(`/access-control/roles/${roleId}/permissions`);
  return response.data;
}

export function useGetAccessRoles(enabled = true) {
  return useQuery({
    queryKey: ["access-control", "roles"],
    queryFn: getAccessRoles,
    enabled,
  });
}

export function useGetAccessPermissions(enabled = true) {
  return useQuery({
    queryKey: ["access-control", "permissions"],
    queryFn: getAccessPermissions,
    enabled,
  });
}

export function useGetRolePermissions(roleId: string | null, enabled = true) {
  return useQuery({
    queryKey: ["access-control", "roles", roleId, "permissions"],
    queryFn: () => getRolePermissions(roleId as string),
    enabled: enabled && !!roleId,
  });
}
