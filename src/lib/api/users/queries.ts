/**
 * Users API Queries
 * Fetch users by role for selector dropdowns
 */

import { useQuery } from "@tanstack/react-query";

import { apiClient } from "@/lib/api/client";
import type { UserOption } from "@/lib/api/proposals/types";

import type { UserDetails, UsersListResponse, UsersQueryParams } from "./types";

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
 * Fetch users list (admin use-case).
 * GET /users/?limit=&search=&sortBy=&sortDir=&page=
 */
export async function getUsersList(params: UsersQueryParams): Promise<UsersListResponse> {
  const response = await apiClient.get<UsersListResponse>("/users", { params });
  return response.data;
}

/**
 * Fetch user details by id (admin use-case).
 * GET /users/:id
 */
export async function getUserById(userId: string): Promise<UserDetails> {
  const response = await apiClient.get<UserDetails>(`/users/${userId}`);
  return response.data;
}

export function useGetUsersList(params: UsersQueryParams, enabled = true) {
  return useQuery({
    queryKey: ["users", "list", params],
    queryFn: () => getUsersList(params),
    enabled,
  });
}

export function useGetUserById(userId: string | null, enabled = true) {
  return useQuery({
    queryKey: ["users", "byId", userId],
    queryFn: () => getUserById(userId as string),
    enabled: enabled && !!userId,
  });
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
