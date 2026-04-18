// ============================================================
// WORKSPACE API SERVICE
// All editor-related HTTP calls live here.
// Components never call apiClient directly — they go through this layer.
// ============================================================

import { apiClient } from "@/lib/api/client";
import type {
  DocumentVersion,
  DocumentVersionSummary,
  ExportFormat,
  ImportMarkdownPayload,
  ImportMarkdownResponse,
  ProjectIdentity,
  SaveDocumentPayload,
  SaveDocumentResponse,
  WorkspaceDocument,
  WorkspaceInfo,
} from "@/types/editor";

export async function fetchProjects(): Promise<ProjectIdentity[]> {
  const res = await apiClient.get<ProjectIdentity[]>("/projects");
  return res.data;
}

export async function fetchWorkspaces(projectId: string): Promise<WorkspaceInfo[]> {
  const res = await apiClient.get<WorkspaceInfo[]>(`/workspaces/project/${projectId}`);
  return res.data;
}

// ─── Load ────────────────────────────────────────────────────

/**
 * GET /workspaces/:workspaceId
 * Fetch the full workspace document (title + JSONContent).
 */
export async function fetchWorkspace(workspaceId: string): Promise<WorkspaceDocument> {
  const res = await apiClient.get<WorkspaceDocument>(`/workspaces/${workspaceId}/document`);
  return res.data;
}

// ─── Create ──────────────────────────────────────────────────

/**
 * POST /workspaces
 * Create a new workspace within a project.
 */
export async function createWorkspace(projectId: string, payload: { name: string }): Promise<WorkspaceInfo> {
  const res = await apiClient.post<WorkspaceInfo>(`/workspaces/project/${projectId}`, payload);
  return res.data;
}

// ─── Save (autosave) ──────────────────────────────────────────

/**
 * PATCH /workspaces/:workspaceId
 * Autosave the current document state.
 * Content is always TipTap JSONContent — never raw HTML.
 */
export async function saveWorkspace(workspaceId: string, payload: SaveDocumentPayload): Promise<SaveDocumentResponse> {
  const res = await apiClient.put<SaveDocumentResponse>(
    // Note: PUT, not PATCH based on specs
    `/workspaces/${workspaceId}/document`,
    payload,
  );
  return res.data;
}

// ─── Version History ─────────────────────────────────────────

/**
 * GET /workspaces/:workspaceId/versions
 * Returns a list of version summaries (no content — lazy loaded).
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
 * POST /workspaces/:workspaceId/versions/:versionId/restore
 * Restore a snapshot as the current document content.
 * Returns the updated WorkspaceDocument so the editor can refresh.
 */
export async function restoreVersion(workspaceId: string, versionId: string): Promise<SaveDocumentResponse> {
  const res = await apiClient.post<SaveDocumentResponse>(`/workspaces/${workspaceId}/versions/${versionId}/restore`);
  return res.data;
}

// ─── Import ──────────────────────────────────────────────────

/**
 * POST /workspaces/:workspaceId/import/markdown
 * Send raw markdown, receive converted TipTap JSONContent.
 * The backend converts using remark/unified — keeps conversion server-side.
 */
export async function importMarkdown(
  workspaceId: string,
  payload: ImportMarkdownPayload,
): Promise<ImportMarkdownResponse> {
  const res = await apiClient.post<ImportMarkdownResponse>(`/workspaces/${workspaceId}/import/markdown`, payload);
  return res.data;
}

// ─── Export ──────────────────────────────────────────────────

/**
 * GET /workspaces/:workspaceId/export?format=markdown|pdf
 * Returns a Blob for download.
 * - markdown → text/plain
 * - pdf      → application/pdf (generated server-side via puppeteer/weasyprint)
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

/**
 * Utility: trigger a browser file download from a Blob.
 */
export function triggerDownload(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
