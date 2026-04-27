/**
 * Department API Queries
 * Fetch departments for selector dropdowns
 */

import { useQuery } from "@tanstack/react-query";

import type { DepartmentOption } from "@/lib/api/proposals/types";

/**
 * Fetch departments for selector dropdown.
 * GET /departments/selector
 * @param q - Optional search query (name or code)
 */
export async function getDepartmentsSelector(q?: string): Promise<DepartmentOption[]> {
  const { apiClient } = await import("@/lib/api/client");
  const params: Record<string, string> = {};
  if (q) params.q = q;
  const response = await apiClient.get<DepartmentOption[]>("/departments/selector", { params });
  return response.data;
}

/**
 * Hook to search departments with a debounced query.
 */
export function useSearchDepartments(q: string, enabled = true) {
  return useQuery({
    queryKey: ["departments", "selector", q],
    queryFn: () => getDepartmentsSelector(q),
    enabled,
  });
}
