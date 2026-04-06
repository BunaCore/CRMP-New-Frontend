/**
 * Department API Queries
 * Fetch departments for selector dropdowns
 */

import type { DepartmentOption } from "@/lib/api/proposals/types";

/**
 * Fetch departments for selector dropdown.
 * GET /departments/selector
 */
export async function getDepartmentsSelector(): Promise<DepartmentOption[]> {
  const { apiClient } = await import("@/lib/api/client");
  const response = await apiClient.get<DepartmentOption[]>("/departments/selector");
  return response.data;
}
