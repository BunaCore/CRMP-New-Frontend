/**
 * Users API Queries
 * Fetch users by role for selector dropdowns
 */

import { useQuery } from "@tanstack/react-query";

import type { UserOption } from "@/lib/api/proposals/types";

/**
 * Fetch users for selector dropdown.
 * GET /users/selector?role=ROLE (role is optional)
 * @param role - Optional role filter (e.g., "FACULTY" for advisors)
 */
export async function getUsers(role?: string, q?: string): Promise<UserOption[]> {
  const { apiClient } = await import("@/lib/api/client");
  const params: Record<string, string> = {};
  if (role) params.role = role;
  if (q) params.q = q;
  const response = await apiClient.get<UserOption[]>("/users/selector", { params });
  return response.data;
}

/**
 * Convenience function to fetch advisors (faculty)
 */
export async function getAdvisors(): Promise<UserOption[]> {
  return getUsers("FACULTY");
}

/**
 * Hook to retrieve user elements for selectors
 */
export function useGetUsersSelector(role?: string, q?: string, enabled = true) {
  return useQuery({
    queryKey: ["users", "selector", role, q],
    queryFn: () => getUsers(role, q),
    enabled,
  });
}

/**
 * Hook to search members (no role filter) with a debounced query.
 */
export function useSearchUsers(q: string, enabled = true) {
  return useQuery({
    queryKey: ["users", "selector", "all", q],
    queryFn: () => getUsers(undefined, q),
    enabled,
  });
}

/**
 * Hook to search advisors (role=FACULTY) with a debounced query.
 */
export function useSearchAdvisors(q: string, enabled = true) {
  return useQuery({
    queryKey: ["users", "selector", q],
    queryFn: () => getUsers(undefined, q),
    enabled,
  });
}
