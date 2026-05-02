// ============================================================
// src/lib/ai/requests/project-qa.ts
// PROJECT_DATA_QUESTION — uses proposal context as grounding data.
// ============================================================

import type { AiBaseRequest } from "../client";
import { AI_ENDPOINTS, aiPost } from "../client";
import type { AiMode, AiResponse } from "../types";

export interface ProposalContext {
  proposalId: string;
  title: string;
  status: string;
  type?: string;
  department?: string;
  teamMembers?: string[];
  advisors?: string[];
  workflowCurrentStep?: number;
}

export interface ProjectQaRequest extends AiBaseRequest {
  question: string;
  proposalContext: ProposalContext;
}

export interface ProjectQaResult {
  answer: string;
}

export async function sendProjectQuestion(req: ProjectQaRequest): Promise<AiResponse<ProjectQaResult>> {
  return aiPost<ProjectQaRequest, ProjectQaResult>(AI_ENDPOINTS.projectQuestion, req);
}

export function buildProjectQaRequest(
  question: string,
  proposalContext: ProposalContext,
  ctx: { projectId: string; workspaceId: string; aiMode: AiMode; userRole?: string },
): ProjectQaRequest {
  return {
    question,
    proposalContext,
    aiMode: ctx.aiMode,
    projectId: ctx.projectId,
    workspaceId: ctx.workspaceId,
    userRole: ctx.userRole,
  };
}
