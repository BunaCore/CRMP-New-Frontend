import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { apiClient } from "@/lib/api/client";
import type { PaginatedResponse } from "@/lib/api/types/pagination";

import type {
  ProjectDefenceSchedule,
  ProjectDetails,
  ProjectListItem,
  ProjectsQueryParams,
  PublicProjectListItem,
  PublicProjectMember,
  PublicProjectsResponse,
} from "./types";

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

/**
 * Fetch a single project by ID with full details (members, budget, etc).
 * GET /projects/:id
 */
export async function getProjectDetails(projectId: string): Promise<ProjectDetails> {
  const response = await apiClient.get<ProjectDetails>(`/projects/${projectId}`);
  return response.data;
}

/**
 * React Query hook for fetching a single project's details.
 */
export function useProjectDetailsQuery(projectId: string | null, enabled = true) {
  const resolvedProjectId = projectId ?? "";

  return useQuery({
    queryKey: ["projects", resolvedProjectId],
    queryFn: () => getProjectDetails(resolvedProjectId),
    enabled: enabled && !!resolvedProjectId,
  });
}

/**
 * Toggle a project's public visibility.
 * PATCH /projects/:projectId/visibility
 */
export async function updateProjectVisibility(projectId: string, isPublic: boolean) {
  const response = await apiClient.patch(`/projects/${projectId}/visibility`, {
    isPublic,
  });
  return response.data;
}

export function useUpdateProjectVisibility() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ projectId, isPublic }: { projectId: string; isPublic: boolean }) =>
      updateProjectVisibility(projectId, isPublic),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["projects", variables.projectId],
      });
      queryClient.invalidateQueries({ queryKey: ["projects", "all"] });
    },
  });
}

/**
 * Upload a banner image for a project.
 * POST /projects/:projectId/upload-banner
 */
export async function uploadProjectBanner(projectId: string, file: File) {
  const form = new FormData();
  form.append("file", file);
  const response = await apiClient.post(`/projects/${projectId}/upload-banner`, form);
  return response.data;
}

export function useUploadProjectBanner() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ projectId, file }: { projectId: string; file: File }) => uploadProjectBanner(projectId, file),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["projects", variables.projectId],
      });
      queryClient.invalidateQueries({ queryKey: ["projects", "all"] });
    },
  });
}

/**
 * Upload a public file for a project.
 * POST /projects/:projectId/upload-public-file
 */
export async function uploadProjectPublicFile(projectId: string, file: File) {
  const form = new FormData();
  form.append("file", file);
  const response = await apiClient.post(`/projects/${projectId}/upload-public-file`, form);
  return response.data;
}

export function useUploadProjectPublicFile() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ projectId, file }: { projectId: string; file: File }) => uploadProjectPublicFile(projectId, file),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["projects", variables.projectId],
      });
      queryClient.invalidateQueries({ queryKey: ["projects", "all"] });
    },
  });
}

/**
 * Fetch published public projects for the public research discovery page.
 * GET /public/projects/
 */
type PublicProjectsApiResponse = PublicProjectListItem[] | PublicProjectsResponse;

type PublicProjectsQueryParams = Pick<ProjectsQueryParams, "search" | "page" | "limit">;

function buildPublicProjectsQueryString(params: PublicProjectsQueryParams = {}): string {
  const searchParams = new URLSearchParams();

  if (params.search?.trim()) searchParams.set("search", params.search.trim());
  if (params.page) searchParams.set("page", String(params.page));
  if (params.limit) searchParams.set("limit", String(params.limit));

  const query = searchParams.toString();
  return query ? `?${query}` : "";
}

function normalizePublicProjectMember(member: unknown): PublicProjectMember {
  const source = typeof member === "object" && member !== null ? (member as Record<string, unknown>) : {};

  return {
    userId: String(source.userId ?? source.id ?? ""),
    fullName: String(source.fullName ?? source.name ?? "Unknown member"),
    email: source.email === undefined || source.email === null ? null : String(source.email),
    avatarUrl: source.avatarUrl === undefined || source.avatarUrl === null ? null : String(source.avatarUrl),
    role: source.role === "PI" || source.role === "ADVISOR" ? source.role : "MEMBER",
    addedAt: String(source.addedAt ?? ""),
  };
}

function normalizePublicProject(project: unknown): PublicProjectListItem {
  const source = typeof project === "object" && project !== null ? (project as Record<string, unknown>) : {};

  return {
    projectId: String(source.projectId ?? ""),
    projectTitle: String(source.projectTitle ?? "Untitled project"),
    projectDescription: String(source.projectDescription ?? ""),
    researchArea: source.researchArea === undefined ? null : (source.researchArea as string | null),
    bannerUrl: source.bannerUrl === undefined || source.bannerUrl === null ? null : String(source.bannerUrl),
    publicFileUrl:
      source.publicFileUrl === undefined || source.publicFileUrl === null ? null : String(source.publicFileUrl),
    projectProgram: String(source.projectProgram ?? "GENERAL"),
    department: String(source.department ?? "Unknown department"),
    departmentId: String(source.departmentId ?? ""),
    publishedAt: String(source.publishedAt ?? ""),
    durationMonths: Number(source.durationMonths ?? 0),
    members: Array.isArray(source.members) ? source.members.map((member) => normalizePublicProjectMember(member)) : [],
  };
}

function normalizePublicProjectsResponse(data: PublicProjectsApiResponse): PublicProjectsResponse {
  if (Array.isArray(data)) {
    const items = (data as unknown[]).map(normalizePublicProject);
    return {
      items,
      meta: {
        page: 1,
        limit: items.length,
        totalItems: items.length,
        totalPages: 1,
        hasNextPage: false,
        hasPrevPage: false,
      },
    };
  }

  const items = Array.isArray(data.items) ? (data.items as unknown[]).map(normalizePublicProject) : [];
  const meta = data.meta ?? {
    page: 1,
    limit: items.length,
    totalItems: items.length,
    totalPages: 1,
    hasNextPage: false,
    hasPrevPage: false,
  };

  return {
    items,
    meta,
  };
}

export async function getPublicProjects(params: PublicProjectsQueryParams = {}): Promise<PublicProjectsResponse> {
  const response = await apiClient.get<PublicProjectsApiResponse>(
    `/public/projects/${buildPublicProjectsQueryString(params)}`,
  );
  return normalizePublicProjectsResponse(response.data);
}

/**
 * React Query hook for fetching public projects.
 */
export function usePublicProjectsQuery(params: PublicProjectsQueryParams = {}, enabled = true) {
  return useQuery({
    queryKey: ["projects", "public", params],
    queryFn: () => getPublicProjects(params),
    enabled,
  });
}

// ─── User's own projects (for dashboard) ────────────────────────────────────

/**
 * Fetch projects the current user is a member of.
 * GET /projects  (the backend resolves the user from the JWT token)
 * Returns ProjectListItem[] including defenceSchedules[].
 */
export async function getMyProjects(): Promise<ProjectListItem[]> {
  const response = await apiClient.get<ProjectListItem[]>("/projects");
  const raw = Array.isArray(response.data) ? response.data : [];
  return raw.map((p) => ({
    ...p,
    defenceSchedules: Array.isArray(p.defenceSchedules) ? p.defenceSchedules : [],
  }));
}

/**
 * React Query hook for the current user's own projects (dashboard use).
 */
export function useMyProjectsQuery(enabled = true) {
  return useQuery({
    queryKey: ["projects", "mine"],
    queryFn: getMyProjects,
    enabled,
  });
}

// ─── Defence scheduling mutations ────────────────────────────────────────────

export interface ScheduleDefencePayload {
  defenceDate: string; // ISO string
  location: string;
  note?: string;
}

/**
 * POST /projects/:projectId/defence
 * Schedules a project-phase defence.
 * Also auto-sets project stage to 'Under Review' on the backend.
 */
export async function scheduleProjectDefence(
  projectId: string,
  payload: ScheduleDefencePayload,
): Promise<ProjectDefenceSchedule> {
  const response = await apiClient.post<{ defence: ProjectDefenceSchedule }>(`/projects/${projectId}/defence`, payload);
  return response.data.defence;
}

export function useScheduleProjectDefence() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ projectId, payload }: { projectId: string; payload: ScheduleDefencePayload }) =>
      scheduleProjectDefence(projectId, payload),
    onSuccess: (_data, variables) => {
      // Invalidate so the project list and detail both refresh
      queryClient.invalidateQueries({ queryKey: ["projects", "mine"] });
      queryClient.invalidateQueries({
        queryKey: ["projects", variables.projectId],
      });
    },
  });
}

/**
 * Fetch projects for admin context.
 * GET /projects
 * Returns the same structure as /projects/all for use in admin evaluations view.
 */
export async function getAdminProjects(
  params: ProjectsQueryParams = {},
): Promise<PaginatedResponse<ProjectListItem> | ProjectListItem[]> {
  const response = await apiClient.get<PaginatedResponse<ProjectListItem> | ProjectListItem[]>(
    `/projects${buildProjectsQueryString(params)}`,
  );
  return response.data;
}

/**
 * React Query hook for fetching admin projects.
 */
export function useAdminProjectsQuery(params: ProjectsQueryParams = {}, enabled = true) {
  return useQuery({
    queryKey: ["projects", "admin", params],
    queryFn: () => getAdminProjects(params),
    enabled,
  });
}
