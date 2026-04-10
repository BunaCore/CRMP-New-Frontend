// ============================================================
// AUTH QUERIES — Read actions (get current user on startup)
//
// HOW TO SWITCH TO REAL BACKEND:
//   Set USE_MOCK = false. Uncomment the real block.
// ============================================================

import type { UserProfile } from "@/lib/api/auth/types";
import { mapBackendPermissionsToFrontend } from "@/lib/permissions/permission-mapper";

// ─── 🟢 MOCK SWITCH ──────────────────────────────────────────
const USE_MOCK = true;
// ─────────────────────────────────────────────────────────────

/**
 * Fetches the currently authenticated user.
 * Called by AuthInitializer on every app startup to restore session.
 *
 * MOCK: reads user already in Zustand store (from localStorage).
 * REAL: GET /auth/me — backend validates JWT and returns user.
 */
export async function getCurrentUser(): Promise<UserProfile | null> {
  if (USE_MOCK) {
    // If running on server (SSR), we can't access Zustand's localStorage persistence.
    // Return null to allow the client to handle session restoration after hydration.
    if (typeof window === "undefined") {
      return null;
    }

    // Simulate a short delay for realism
    await new Promise((r) => setTimeout(r, 100));
    // Read the persisted Zustand user (survives page reload via localStorage)
    const { useAuthStore } = await import("@/stores/authStore");
    return useAuthStore.getState().user;
  }

  const { apiClient } = await import("@/lib/api/client");
  const response = await apiClient.get<UserProfile>("/auth/me");
  return {
    ...response.data,
    permissions: mapBackendPermissionsToFrontend(response.data.permissions),
  };
}
