import { useMutation, useQueryClient } from "@tanstack/react-query";

import { apiClient } from "@/lib/api/client";

import type { InviteUserPayload } from "./types";

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
