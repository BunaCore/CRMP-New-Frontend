// ============================================================
// AUTH MUTATIONS — Write actions (login, register)
//
// HOW TO SWITCH TO REAL BACKEND:
//   Set USE_MOCK = false. Uncomment the real block.
//   Nothing else changes anywhere in the app.
// ============================================================

import { getMockLoginResponse } from "@/data/mock-auth";
import type { LoginCredentials, LoginResponse, RegisterPayload, UserProfile } from "@/lib/api/auth/types";
import { mapBackendPermissionsToFrontend } from "@/lib/permissions/permission-mapper";

// ─── 🟢 MOCK SWITCH ──────────────────────────────────────────
const USE_MOCK = false;
// ─────────────────────────────────────────────────────────────

/**
 * Signs in a user. Returns { access_token, user }.
 * MOCK: resolves with fake data based on email.
 * REAL: POST /auth/login
 */

export async function loginUser(credentials: LoginCredentials): Promise<LoginResponse> {
  if (USE_MOCK) {
    return getMockLoginResponse(credentials.email);
  }

  const { apiClient } = await import("@/lib/api/client");
  // Backend response type: has accessToken (camelCase) and user with backend permission format
  const response = await apiClient.post<{
    accessToken: string;
    user: Omit<UserProfile, "permissions"> & { permissions?: string[] };
  }>("/auth/login", {
    email: credentials.email,
    password: credentials.password,
  });
  // Transform backend response:
  // 1. Convert accessToken → access_token
  // 2. Map backend permissions to frontend canonical names
  return {
    access_token: response.data.accessToken,
    user: {
      ...response.data.user,
      permissions: mapBackendPermissionsToFrontend(response.data.user.permissions),
    },
  };
}

/**
 * Registers a new user. Does NOT auto-login (user must sign in separately).
 * passwordConfirm is validated client-side only — not sent here.
 */
export async function registerUser(_payload: {
  email: string;
  password: string;
  fullName: string;
  departmentId?: string;
  phoneNumber?: string;
  userProgram: "UG" | "PG" | null;
}): Promise<{ message: string }> {
  if (USE_MOCK) {
    await new Promise((r) => setTimeout(r, 600));
    return { message: "Registration successful. Please sign in." };
  }
  // REAL BACKEND
  const { apiClient } = await import("@/lib/api/client");
  const response = await apiClient.post<{ message: string }>("/auth/register", _payload as RegisterPayload);
  return response.data;
}
