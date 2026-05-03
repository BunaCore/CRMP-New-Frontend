// ============================================================
// src/lib/ai/requests/grammar.ts
// GRAMMAR_FIX and SENTENCE_FIX_AND_REPLACE request builders.
// These are the only request types that produce a "replace" editor action.
// ============================================================

import type { AiBaseRequest } from "../client";
import { AI_ENDPOINTS, aiPost } from "../client";
import type { AiMode, AiResponse } from "../types";

// ─── Grammar fix ─────────────────────────────────────────────

export interface GrammarFixRequest extends AiBaseRequest {
  selectedText: string;
  /** ProseMirror document position of the start of the selection */
  from: number;
  /** ProseMirror document position of the end of the selection */
  to: number;
}

export interface GrammarFixResult {
  original: string;
  correctedText: string;
}

export async function sendGrammarFix(req: GrammarFixRequest): Promise<AiResponse<GrammarFixResult>> {
  return aiPost<GrammarFixRequest, GrammarFixResult>(AI_ENDPOINTS.grammarFix, req);
}

// ─── Sentence fix and replace ────────────────────────────────

export interface SentenceFixRequest extends AiBaseRequest {
  sentence: string;
  instruction: string;
  from: number;
  to: number;
}

export interface SentenceFixResult {
  original: string;
  replacement: string;
}

export async function sendSentenceFix(req: SentenceFixRequest): Promise<AiResponse<SentenceFixResult>> {
  return aiPost<SentenceFixRequest, SentenceFixResult>(AI_ENDPOINTS.sentenceFix, req);
}

// ─── Request builders ────────────────────────────────────────

export function buildGrammarFixRequest(
  selectedText: string,
  from: number,
  to: number,
  ctx: { projectId: string; workspaceId: string; aiMode: AiMode; userRole?: string },
): GrammarFixRequest {
  return {
    selectedText,
    from,
    to,
    aiMode: ctx.aiMode,
    projectId: ctx.projectId,
    workspaceId: ctx.workspaceId,
    userRole: ctx.userRole,
  };
}

export function buildSentenceFixRequest(
  sentence: string,
  instruction: string,
  from: number,
  to: number,
  ctx: { projectId: string; workspaceId: string; aiMode: AiMode; userRole?: string },
): SentenceFixRequest {
  return {
    sentence,
    instruction,
    from,
    to,
    aiMode: ctx.aiMode,
    projectId: ctx.projectId,
    workspaceId: ctx.workspaceId,
    userRole: ctx.userRole,
  };
}
