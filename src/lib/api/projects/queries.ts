import { useQuery } from "@tanstack/react-query";

import { apiClient } from "@/lib/api/client";
import type { PaginatedResponse } from "@/lib/api/types/pagination";

import type { ProjectListItem, ProjectsQueryParams } from "./types";

function buildProjectsQueryString(params: ProjectsQueryParams = {}): string {
  const searchParams = new URLSearchParams();

  if (params.me) searchParams.set("me", "true");
  if (params.isPublic !== undefined) searchParams.set("isPublic", String(params.isPublic));
  if (params.program) searchParams.set("program", params.program);
  if (params.search?.trim()) searchParams.set("search", params.search.trim());
  if (params.page) searchParams.set("page", String(params.page));
  if (params.limit) searchParams.set("limit", String(params.limit));

  const query = searchParams.toString();
  return query ? `?${query}` : "";
}

/**
 * Fetch all projects.
 * GET /projects/all
 */
export async function getAllProjects(params: ProjectsQueryParams = {}): Promise<PaginatedResponse<ProjectListItem>> {
  const response = await apiClient.get<PaginatedResponse<ProjectListItem>>(
    `/projects/all${buildProjectsQueryString(params)}`,
  );
  return response.data;
}

/**
 * React Query hook for fetching all projects.
 */
export function useAllProjectsQuery(params: ProjectsQueryParams = {}, enabled = true) {
  return useQuery({
    queryKey: ["projects", "all", params],
    queryFn: () => getAllProjects(params),
    enabled,
  });
}
