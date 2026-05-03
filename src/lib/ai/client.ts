// ============================================================
// src/lib/ai/client.ts
// Thin AI API client.
// All AI requests go through this file — one place to update
// when backend endpoints are finalized.
// ============================================================

import { apiClient } from "@/lib/api/client";

import type { AiMode, AiResponse } from "./types";

// ─── Base request shape ───────────────────────────────────────
// Every request body must include mode so the backend
// can route to the correct model provider.

export interface AiBaseRequest {
  aiMode: AiMode;
  projectId: string;
  workspaceId: string;
  projectTitle?: string;
  workspaceName?: string;
  userRole?: string;
}

// ─── Endpoint registry ────────────────────────────────────────
// Single place to update when backend routes change.

export const AI_ENDPOINTS = {
  chat: "/ai/chat",
  summarize: "/ai/summarize",
  explain: "/ai/explain",
  grammarFix: "/ai/grammar-fix",
  sentenceFix: "/ai/sentence-fix",
  outline: "/ai/outline",
  collaborators: "/ai/collaborators",
  caption: "/ai/caption",
  diagram: "/ai/diagram",
  ragUpload: "/ai/rag/upload",
  ragQuery: "/ai/rag/query",
  fileQuestion: "/ai/file-question",
  projectQuestion: "/ai/project-question",
  health: "/ai/health",
} as const;

// ─── Generic POST helper ─────────────────────────────────────

export async function aiPost<TReq extends AiBaseRequest, TResult>(
  endpoint: string,
  body: TReq,
): Promise<AiResponse<TResult>> {
  const response = await apiClient.post<AiResponse<TResult>>(endpoint, body);
  return response.data;
}

// ─── File upload helper ──────────────────────────────────────
// Used by the RAG flow. Sends multipart/form-data.

export async function aiUploadFile(file: File, workspaceId: string): Promise<{ fileId: string; pages?: number }> {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("workspaceId", workspaceId);

  const response = await apiClient.post<{ fileId: string; pages?: number }>(AI_ENDPOINTS.ragUpload, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
}

// ─── Health check ────────────────────────────────────────────

export async function checkAiHealth(mode: AiMode): Promise<boolean> {
  try {
    const response = await apiClient.get<{ available: boolean }>(`${AI_ENDPOINTS.health}?mode=${mode}`);
    return response.data.available ?? false;
  } catch {
    return false;
  }
}
