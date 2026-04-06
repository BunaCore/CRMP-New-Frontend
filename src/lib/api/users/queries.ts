/**
 * Users API Queries
 * Fetch users by role for selector dropdowns
 */

import type { UserOption } from "@/lib/api/proposals/types";

/**
 * Fetch users for selector dropdown.
 * GET /users/selector?role=ROLE (role is optional)
 * @param role - Optional role filter (e.g., "FACULTY" for advisors)
 */
export async function getUsers(role?: string): Promise<UserOption[]> {
  const { apiClient } = await import("@/lib/api/client");
  const params = role ? { role } : undefined;
  const response = await apiClient.get<UserOption[]>("/users/selector", {
    params,
  });
  return response.data;
}

/**
 * Convenience function to fetch advisors (faculty)
 */
export async function getAdvisors(): Promise<UserOption[]> {
  return getUsers("FACULTY");
}
