import { useQuery } from "@tanstack/react-query";

import { apiClient } from "@/lib/api/client";

export interface AdminProjectListItem {
  id: string;
  code: string;
  name: string;
  department:
    | {
        id: string;
        name: string;
      }
    | string;
  pi:
    | {
        id: string;
        name: string;
        avatarUrl?: string;
      }
    | string;
  status: string;
  progress: number;
  budget:
    | {
        total: number;
        currency?: string;
      }
    | string
    | number;
  startDate?: string;
  endDate?: string;
}

export interface AdminProjectsResponse {
  data: AdminProjectListItem[];
  meta: {
    total: number;
    page: number;
    totalPages: number;
  };
}

export interface AdminProjectsQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  departmentId?: string;
  program?: string;
}

function buildAdminProjectsQueryString(params: AdminProjectsQueryParams = {}): string {
  const searchParams = new URLSearchParams();

  if (params.search?.trim()) searchParams.set("search", params.search.trim());
  if (params.status && params.status !== "All") searchParams.set("status", params.status);
  if (params.departmentId) searchParams.set("departmentId", params.departmentId);
  if (params.program) searchParams.set("program", params.program);
  if (params.page) searchParams.set("page", String(params.page));
  if (params.limit) searchParams.set("limit", String(params.limit));

  const query = searchParams.toString();
  return query ? `?${query}` : "";
}

export async function getAdminProjects(params: AdminProjectsQueryParams = {}): Promise<AdminProjectsResponse> {
  const response = await apiClient.get<AdminProjectsResponse>(
    `/admin/projects${buildAdminProjectsQueryString(params)}`,
  );
  return response.data;
}

export function useAdminProjects(params: AdminProjectsQueryParams = {}) {
  return useQuery({
    queryKey: ["admin", "projects", params],
    queryFn: () => getAdminProjects(params),
  });
}

export async function terminateAdminProject(id: string, reason: string): Promise<void> {
  await apiClient.patch(`/admin/projects/${id}/terminate`, { reason });
}

export async function getAdminProjectExportUrl(id: string): Promise<string> {
  // It could return a URL or we can directly redirect to the endpoint if it returns a file
  return `${apiClient.defaults.baseURL}/admin/projects/${id}/export-pdf`;
}

export async function getAdminProjectDetails(id: string) {
  const response = await apiClient.get(`/admin/projects/${id}`);
  return response.data;
}

export function useAdminProjectDetails(id: string | null) {
  return useQuery({
    queryKey: ["admin", "projects", "detail", id],
    queryFn: () => getAdminProjectDetails(id as string),
    enabled: !!id,
  });
}
