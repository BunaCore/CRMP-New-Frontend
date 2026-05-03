// ============================================================
// src/lib/ai/requests/chat.ts
// Unified /ai/chat endpoint request builder.
// The backend handles normal chat, grammar fixes, summarization, etc.
// based on the 'requestType' property.
// ============================================================

import type { AiBaseRequest } from "../client";
import { AI_ENDPOINTS, aiPost } from "../client";
import type { AiMode, AiRequestType, AiResponse } from "../types";

export interface UnifiedChatRequest extends AiBaseRequest {
  requestType: AiRequestType;
  /** For normal chat or custom instructions */
  message?: string;
  /** Context or selected text from the editor */
  context?: string;
  /** ProseMirror positions when replacing text in the editor */
  from?: number;
  to?: number;
  /** Chat history for conversational context */
  history?: { role: "user" | "assistant"; content: string }[];
}

export interface UnifiedChatResult {
  reply: string;
}

export async function sendUnifiedChat(req: UnifiedChatRequest): Promise<AiResponse<UnifiedChatResult>> {
  return aiPost<UnifiedChatRequest, UnifiedChatResult>(AI_ENDPOINTS.chat, req);
}

// ─── Request builder ────────────────────────────────────────

export function buildUnifiedChatRequest(
  requestType: AiRequestType,
  data: {
    message?: string;
    context?: string;
    from?: number;
    to?: number;
    history?: { role: "user" | "assistant"; content: string }[];
  },
  ctx: {
    projectId: string;
    workspaceId: string;
    projectTitle?: string;
    workspaceName?: string;
    userRole?: string;
    aiMode: AiMode;
  },
): UnifiedChatRequest {
  return {
    requestType,
    message: data.message,
    context: data.context,
    from: data.from,
    to: data.to,
    history: data.history,
    aiMode: ctx.aiMode,
    projectId: ctx.projectId,
    workspaceId: ctx.workspaceId,
    projectTitle: ctx.projectTitle,
    workspaceName: ctx.workspaceName,
    userRole: ctx.userRole,
  };
}
