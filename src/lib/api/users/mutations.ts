import { useMutation, useQueryClient } from "@tanstack/react-query";

import type { UserProfile } from "@/lib/api/auth/types";
import { apiClient } from "@/lib/api/client";
import { useAuthStore } from "@/stores/authStore";

import type {
  InviteUserPayload,
  UpdateSelfProfilePayload,
  UpdateUserProfilePayload,
  UpdateUserRolesPayload,
  UpdateUserStatusPayload,
} from "./types";

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

/**
 * Update a user's account status (active/deactive).
 * PATCH /users/:id/status
 */
export async function updateUserStatus(payload: UpdateUserStatusPayload) {
  const response = await apiClient.patch(`/users/${payload.userId}/status`, {
    status: payload.status,
  });
  return response.data;
}

export function useUpdateUserStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateUserStatus,
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["users", "list"] });
      queryClient.invalidateQueries({
        queryKey: ["users", "byId", variables.userId],
      });
    },
  });
}

/**
 * Update user profile information.
 * PATCH /users/:id
 */
export async function updateUserProfile(payload: UpdateUserProfilePayload) {
  const { userId, ...data } = payload;
  const response = await apiClient.patch(`/users/${userId}`, data);
  return response.data;
}

export function useUpdateUserProfile() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateUserProfile,
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["users", "list"] });
      queryClient.invalidateQueries({
        queryKey: ["users", "byId", variables.userId],
      });
    },
  });
}

/**
 * Update the current user's own profile.
 * PATCH /users/me — only requires JWT (no admin perms).
 * On success, syncs the updated user back into the Zustand auth store
 * so sidebar/nav components reflect changes immediately.
 */
export async function updateSelfProfile(payload: UpdateSelfProfilePayload): Promise<UserProfile> {
  const response = await apiClient.patch<UserProfile>("/users/me", payload);
  return response.data;
}

export function useUpdateSelfProfile() {
  const updateUser = useAuthStore((s) => s.updateUser);
  return useMutation({
    mutationFn: updateSelfProfile,
    onSuccess: (data) => {
      // Sync updated user back into Zustand so UI reflects changes immediately
      updateUser(data);
    },
  });
}
