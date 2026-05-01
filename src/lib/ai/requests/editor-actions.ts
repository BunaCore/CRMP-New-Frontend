// ============================================================
// src/lib/ai/requests/editor-actions.ts
// Summarize, Explain, Outline, Caption, Collaborators, Diagram.
// These map to the toolbar buttons in AiToolbarMenu.
// ============================================================

import type { AiBaseRequest } from "../client";
import { AI_ENDPOINTS, aiPost } from "../client";
import type { AiMode, AiResponse } from "../types";

// ─── Shared selection context ─────────────────────────────────

interface SelectionContext extends AiBaseRequest {
  selectedText: string;
}

// ─── Summarize ───────────────────────────────────────────────

export interface SummarizeResult {
  summary: string;
}

export async function sendSummarize(req: SelectionContext): Promise<AiResponse<SummarizeResult>> {
  return aiPost(AI_ENDPOINTS.summarize, req);
}

// ─── Explain ─────────────────────────────────────────────────

export interface ExplainResult {
  explanation: string;
}

export async function sendExplain(req: SelectionContext): Promise<AiResponse<ExplainResult>> {
  return aiPost(AI_ENDPOINTS.explain, req);
}

// ─── Outline ─────────────────────────────────────────────────

export interface OutlineRequest extends AiBaseRequest {
  selectedText?: string;
  documentTitle: string;
}
export interface OutlineResult {
  outline: string[];
}

export async function sendOutline(req: OutlineRequest): Promise<AiResponse<OutlineResult>> {
  return aiPost(AI_ENDPOINTS.outline, req);
}

// ─── Caption ─────────────────────────────────────────────────

export interface CaptionResult {
  caption: string;
}

export async function sendCaption(req: SelectionContext): Promise<AiResponse<CaptionResult>> {
  return aiPost(AI_ENDPOINTS.caption, req);
}

// ─── Collaborator recommendation ─────────────────────────────

export interface CollaboratorsRequest extends SelectionContext {
  projectDepartment?: string;
}
export interface CollaboratorEntry {
  name: string;
  expertise: string;
}
export interface CollaboratorsResult {
  recommendations: CollaboratorEntry[];
}

export async function sendCollaborators(req: CollaboratorsRequest): Promise<AiResponse<CollaboratorsResult>> {
  return aiPost(AI_ENDPOINTS.collaborators, req);
}

// ─── Diagram ─────────────────────────────────────────────────

export type DiagramType = "flowchart" | "timeline" | "table";

export interface DiagramRequest extends SelectionContext {
  diagramType?: DiagramType;
}
export interface DiagramResult {
  imageUrl?: string;
  mermaidCode?: string;
}

export async function sendDiagram(req: DiagramRequest): Promise<AiResponse<DiagramResult>> {
  return aiPost(AI_ENDPOINTS.diagram, req);
}

// ─── Shared builder ──────────────────────────────────────────
// Creates the SelectionContext base for toolbar actions.

export function buildSelectionRequest(
  selectedText: string,
  ctx: {
    projectId: string;
    workspaceId: string;
    projectTitle?: string;
    workspaceName?: string;
    aiMode: AiMode;
    userRole?: string;
  },
): SelectionContext {
  return {
    selectedText,
    aiMode: ctx.aiMode,
    projectId: ctx.projectId,
    workspaceId: ctx.workspaceId,
    projectTitle: ctx.projectTitle,
    workspaceName: ctx.workspaceName,
    userRole: ctx.userRole,
  };
}
