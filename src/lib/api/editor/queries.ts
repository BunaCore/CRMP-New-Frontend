import { apiClient } from "@/lib/api/client";
import type {
  DocumentVersion,
  DocumentVersionSummary,
  ExportFormat,
  ProjectIdentity,
  WorkspaceDocument,
  WorkspaceInfo,
} from "@/types/editor";

/**
 * GET /projects
 * Fetch all available projects for the user.
 */
export async function fetchProjects(): Promise<ProjectIdentity[]> {
  const res = await apiClient.get<ProjectIdentity[]>("/projects");
  return res.data;
}

/**
 * GET /workspaces/project/:projectId
 * Fetch all workspaces for a given project.
 */
export async function fetchWorkspaces(projectId: string): Promise<WorkspaceInfo[]> {
  const res = await apiClient.get<WorkspaceInfo[]>(`/workspaces/project/${projectId}`);
  return res.data;
}

/**
 * GET /workspaces/:workspaceId/document
 * Fetch the full workspace document (TipTap JSONContent).
 */
export async function fetchWorkspaceDocument(workspaceId: string): Promise<WorkspaceDocument> {
  const res = await apiClient.get<WorkspaceDocument>(`/workspaces/${workspaceId}/document`);
  return res.data;
}

/**
 * GET /workspaces/:workspaceId/versions
 * Returns a list of version summaries (lazy loaded, no content).
 */
export async function fetchVersions(workspaceId: string): Promise<DocumentVersionSummary[]> {
  const res = await apiClient.get<DocumentVersionSummary[]>(`/workspaces/${workspaceId}/versions`);
  return res.data;
}

/**
 * GET /workspaces/:workspaceId/versions/:versionId
 * Fetch the full content of a specific snapshot.
 */
export async function fetchVersion(workspaceId: string, versionId: string): Promise<DocumentVersion> {
  const res = await apiClient.get<DocumentVersion>(`/workspaces/${workspaceId}/versions/${versionId}`);
  return res.data;
}

/**
 * GET /workspaces/:workspaceId/export/:format
 * Downloads the document in the specified format (Blob).
 */
export async function exportWorkspace(workspaceId: string, format: ExportFormat): Promise<Blob> {
  const params: Record<string, string | boolean> = {};
  if (format === "markdown") {
    params.download = true; // Required by backend for binary attachment
  }

  const res = await apiClient.get(`/workspaces/${workspaceId}/export/${format}`, {
    params,
    responseType: "blob",
  });
  return res.data as Blob;
}
