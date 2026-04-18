import { apiClient } from "@/lib/api/client";
import type {
  ImportMarkdownPayload,
  ImportMarkdownResponse,
  SaveDocumentPayload,
  SaveDocumentResponse,
  WorkspaceInfo,
} from "@/types/editor";

/**
 * POST /workspaces/project/:projectId
 * Create a new workspace within a project.
 */
export async function createWorkspace(projectId: string, payload: { name: string }): Promise<WorkspaceInfo> {
  const res = await apiClient.post<WorkspaceInfo>(`/workspaces/project/${projectId}`, payload);
  return res.data;
}

/**
 * PATCH /workspaces/:workspaceId
 * Update workspace metadata (like name/title).
 */
export async function updateWorkspaceTitle(workspaceId: string, name: string): Promise<WorkspaceInfo> {
  const res = await apiClient.patch<WorkspaceInfo>(`/workspaces/${workspaceId}`, { name });
  return res.data;
}

/**
 * PUT /workspaces/:workspaceId/document
 * Save the current document state.
 * Content is always TipTap JSONContent — never raw HTML.
 */
export async function saveWorkspace(workspaceId: string, payload: SaveDocumentPayload): Promise<SaveDocumentResponse> {
  const res = await apiClient.put<SaveDocumentResponse>(`/workspaces/${workspaceId}/document`, payload);
  return res.data;
}

/**
 * POST /workspaces/:workspaceId/versions/:versionId/restore
 * Restore a snapshot over the current document.
 */
export async function restoreVersion(workspaceId: string, versionId: string): Promise<SaveDocumentResponse> {
  const res = await apiClient.post<SaveDocumentResponse>(`/workspaces/${workspaceId}/versions/${versionId}/restore`);
  return res.data;
}

/**
 * POST /workspaces/:workspaceId/import/markdown
 * Parse external markdown to native JSON content.
 */
export async function importMarkdown(
  workspaceId: string,
  payload: ImportMarkdownPayload,
): Promise<ImportMarkdownResponse> {
  const res = await apiClient.post<ImportMarkdownResponse>(`/workspaces/${workspaceId}/import/markdown`, payload);
  return res.data;
}
