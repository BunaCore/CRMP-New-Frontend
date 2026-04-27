import { useMutation, useQueryClient } from "@tanstack/react-query";

import { apiClient } from "@/lib/api/client";

/**
 * Integration seam for POST /access-control/roles.
 */
export async function createAccessRole(payload: { name: string; description: string }) {
  const response = await apiClient.post("/access-control/roles", payload);
  return response.data;
}

/**
 * Integration seam for persisting role permission updates.
 * Backend contract can be adapted in phase 2.
 */
export async function updateRolePermissions(payload: { roleId: string; permissionIds: string[] }) {
  const response = await apiClient.put(`/access-control/roles/${payload.roleId}/permissions`, {
    permissionIds: payload.permissionIds,
  });
  return response.data;
}

export function useCreateAccessRole() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createAccessRole,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["access-control", "roles"] });
    },
  });
}

export function useUpdateRolePermissions() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateRolePermissions,
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["access-control", "roles", variables.roleId, "permissions"] });
    },
  });
}
