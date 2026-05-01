import { useMutation, useQueryClient } from "@tanstack/react-query";

import { apiClient } from "@/lib/api/client";

import type { InviteUserPayload, UpdateUserRolesPayload } from "./types";

/**
 * Invite user to the system (admin).
 * POST /users/invite
 */
export async function inviteUser(payload: InviteUserPayload) {
  const response = await apiClient.post("/users/invitations", payload);
  return response.data;
}

export function useInviteUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: inviteUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users", "list"] });
    },
  });
}

/**
 * Replace all assigned roles for a user.
 * PUT /users/:id/roles
 */
export async function updateUserRoles(payload: UpdateUserRolesPayload) {
  const response = await apiClient.put(`/users/${payload.userId}/roles`, {
    roleIds: payload.roleIds,
  });
  return response.data;
}

export function useUpdateUserRoles() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateUserRoles,
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["users", "byId", variables.userId],
      });
      queryClient.invalidateQueries({ queryKey: ["users", "list"] });
    },
  });
}
