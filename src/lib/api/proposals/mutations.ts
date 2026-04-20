/**
 * Proposal API Mutations
 * Write actions (create, update proposals)
 */

import type {
  CreateProposalPayload,
  CreateProposalResponse,
  SubmitEvaluationScoresPayload,
  SubmitStepActionPayload,
} from "@/lib/api/proposals/types";

/**
 * Create a new proposal (as Draft)
 * POST /proposals
 *
 * Accepts multipart/form-data with optional file attachment.
 * Each field is added separately to FormData.
 * Returns minimal response with id, title, status.
 * Default saves as Draft. Use submit=true query param to submit directly.
 *
 * @param payload - Proposal data
 * @param file - Optional attachment file
 * @param options - { submit?: boolean }
 */
export async function createProposal(
  payload: CreateProposalPayload,
  file?: File | null,
  options?: { submit?: boolean },
): Promise<CreateProposalResponse> {
  const { apiClient } = await import("@/lib/api/client");
  const params = options?.submit ? { submit: "true" } : {};

  // Build FormData for multipart request with individual fields
  const formData = new FormData();

  // Add flat fields
  formData.append("title", payload.title);
  if (payload.abstract) {
    formData.append("abstract", payload.abstract);
  }
  formData.append("proposalProgram", payload.proposalProgram);
  if (payload.isFunded !== undefined) {
    formData.append("isFunded", String(payload.isFunded));
  }
  formData.append("researchArea", payload.researchArea);
  formData.append("departmentId", payload.departmentId);
  formData.append("durationMonths", String(payload.durationMonths));

  // Add optional advisor
  if (payload.advisorUserId) {
    formData.append("advisorUserId", payload.advisorUserId);
  }

  // Add budget as JSON string
  formData.append("budget", JSON.stringify(payload.budget));

  // Add members as JSON string
  formData.append("members", JSON.stringify(payload.members));

  // Add file if present
  if (file) {
    formData.append("file", file);
  }

  const response = await apiClient.post<CreateProposalResponse>("/proposals", formData, {
    params,
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
}

/**
 * Update an existing proposal (as Draft)
 * PATCH /proposals/{id}
 */
export async function updateProposal(
  proposalId: string,
  payload: Partial<CreateProposalPayload>,
): Promise<CreateProposalResponse> {
  const { apiClient } = await import("@/lib/api/client");
  const response = await apiClient.patch<CreateProposalResponse>(`/proposals/${proposalId}`, payload);
  return response.data;
}

/**
 * Submit a proposal (changes status from Draft → Under_Review)
 * POST /proposals/{id}/submit
 *
 * Alternatively: POST /proposals with submit=true query param during creation
 */
export async function submitProposal(proposalId: string): Promise<CreateProposalResponse> {
  const { apiClient } = await import("@/lib/api/client");
  const response = await apiClient.post<CreateProposalResponse>(`/proposals/${proposalId}/submit`);
  return response.data;
}

/**
 * Submit evaluation scores for a proposal or project phase
 * POST /proposals/:id/evaluations
 */
export async function submitEvaluationScores(proposalId: string, data: SubmitEvaluationScoresPayload): Promise<void> {
  const { apiClient } = await import("@/lib/api/client");
  await apiClient.post(`/proposals/${proposalId}/evaluations`, data);
}

/**
 * Submit an action to a proposal step (e.g. approve, reject, form submit).
 * POST /proposals/:id/action
 */
export async function submitStepAction(proposalId: string, payload: SubmitStepActionPayload): Promise<void> {
  const { apiClient } = await import("@/lib/api/client");
  await apiClient.post(`/proposals/${proposalId}/action`, payload);
}
