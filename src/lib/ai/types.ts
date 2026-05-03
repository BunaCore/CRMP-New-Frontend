// ============================================================
// src/lib/ai/types.ts
// Central type definitions for the CRMP AI request layer.
// Every AI feature imports from here — no scattered inline types.
// ============================================================

// ─── Request type enum ────────────────────────────────────────

export type AiRequestType =
  | "CHAT_QUESTION"
  | "SUMMARIZE_SELECTION"
  | "EXPLAIN_SELECTION"
  | "GRAMMAR_FIX"
  | "SENTENCE_FIX_AND_REPLACE"
  | "OUTLINE_SUGGESTION"
  | "COLLABORATOR_RECOMMENDATION"
  | "CAPTION_GENERATION"
  | "INSERT_DIAGRAM"
  | "DOCUMENT_CHAT"
  | "FILE_BASED_QUESTION"
  | "PROJECT_DATA_QUESTION";

// ─── Model mode ───────────────────────────────────────────────

export type AiMode = "local" | "cloud";

export interface AiModelConfig {
  mode: AiMode;
  /** The specific model identifier, e.g. "crmp-research" or "gpt-4o" */
  modelId: string;
  /** For local mode: the Ollama base URL. Defaults to http://localhost:11434 */
  endpoint?: string;
  /** Whether this model is reachable. Set by health-check. */
  available?: boolean;
}

// ─── Request context ─────────────────────────────────────────
// Attached to every AI request so the backend has enough information
// to ground the response without requiring separate API calls.

export interface AiRequestContext {
  projectId: string;
  workspaceId: string;
  projectTitle?: string;
  workspaceName?: string;
  userRole?: string;
  aiMode: AiMode;
}

// ─── Editor action ───────────────────────────────────────────
// Describes what should happen in the TipTap editor after a response.

export type AiEditorActionType = "insert" | "replace" | "highlight" | "none";

export interface AiEditorAction {
  type: AiEditorActionType;
  /** ProseMirror start position (required for replace / highlight) */
  from?: number;
  /** ProseMirror end position (required for replace / highlight) */
  to?: number;
  /** The content to insert or replace with */
  content?: string;
  /** The original text before replacement (for diff display) */
  original?: string;
}

// ─── AI response envelope ────────────────────────────────────
// Generic wrapper returned by all AI endpoints.

export interface AiResponse<T = string> {
  requestType: AiRequestType;
  result: T;
  action: AiEditorAction;
  tokensUsed?: number;
  model?: string;
}

// ─── Source citation (RAG) ───────────────────────────────────

export interface AiSourceCitation {
  fileId: string;
  fileName: string;
  page?: number;
  excerpt: string;
}

// ─── Lifecycle state ─────────────────────────────────────────
// Used by useAiChat, useAiEdit, useRag to represent request state.

export type AiRequestStatus = "idle" | "pending" | "success" | "error";

// ─── Pending editor action ───────────────────────────────────
// Stored in conversation state when a response requires editor interaction.
// The user must click Apply or Dismiss before it is resolved.

export type PendingActionStatus = "waiting" | "applied" | "dismissed";

export interface PendingEditorAction {
  id: string;
  /** The message ID this action belongs to */
  messageId: string;
  action: AiEditorAction;
  requestType: AiRequestType;
  status: PendingActionStatus;
  /** Timestamp of when the request was made (for isDirty guard) */
  capturedAt: number;
}

// ─── Chat message ────────────────────────────────────────────

export type AiMessageRole = "user" | "assistant" | "system";

export interface AiChatMessage {
  id: string;
  role: AiMessageRole;
  content: string;
  timestamp: Date;
  requestType?: AiRequestType;
  /** The original context/selection sent with the request */
  originalContext?: string;
  /** Present when the response has an editor action */
  pendingAction?: PendingEditorAction;
  /** Present on RAG responses */
  sources?: AiSourceCitation[];
  /** Whether this message is the current streaming response */
  isStreaming?: boolean;
}

// ─── Conversation state ──────────────────────────────────────

export interface AiConversationState {
  messages: AiChatMessage[];
  status: AiRequestStatus;
  error: string | null;
  /** The current pending action waiting for Apply/Dismiss */
  activePendingAction: PendingEditorAction | null;
}

// ─── RAG state ───────────────────────────────────────────────

export interface RagUploadedFile {
  id: string;
  name: string;
  type: string;
  size: number;
  status: "uploading" | "ready" | "processing" | "failed";
  pages?: number;
  /** Backend file ID after upload completes */
  backendId?: string;
}

export interface RagState {
  files: RagUploadedFile[];
  messages: AiChatMessage[];
  uploadStatus: AiRequestStatus;
  queryStatus: AiRequestStatus;
  error: string | null;
}
