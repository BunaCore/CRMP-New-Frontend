import type { UserProfile } from "@/lib/api/auth/types";
import { mapBackendPermissionsToFrontend } from "@/lib/permissions/permission-mapper";

import type { AcceptInvitationPayload } from "./types";

export async function acceptInvitation(payload: AcceptInvitationPayload): Promise<{
  accessToken: string;
  refreshToken?: string;
  user: UserProfile;
}> {
  const { apiClient } = await import("@/lib/api/client");
  const response = await apiClient.post<{
    accessToken: string;
    refreshToken?: string;
    user: Omit<UserProfile, "permissions"> & { permissions?: string[] };
  }>("/auth/invitations/accept", payload);

  // Transform backend response: map backend permissions to frontend canonical names
  return {
    accessToken: response.data.accessToken,
    refreshToken: response.data.refreshToken,
    user: {
      ...response.data.user,
      permissions: mapBackendPermissionsToFrontend(response.data.user.permissions),
    },
  };
}
