// Invitation queries
import type { Invitation } from "@/lib/api/invitations/types";

// Mock switch for dev
const USE_MOCK = false;

export async function getInvitationByToken(token: string): Promise<Invitation> {
  if (!token) throw new Error("Missing token");
  if (USE_MOCK) {
    // return a sample invite
    await new Promise((r) => setTimeout(r, 200));
    return {
      email: "inviteduser@gmail.com",
      roleName: "COORDINATOR",
      expiresAt: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
    };
  }

  const { apiClient } = await import("@/lib/api/client");
  const resp = await apiClient.get<Invitation>("/auth/invitations", {
    params: { token },
  });
  return resp.data;
}
