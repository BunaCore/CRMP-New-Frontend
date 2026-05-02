/**
 * Proposal API Mutations
 * Write actions (create, update proposals)
 */

import type {
  CreateProposalPayload,
  CreateProposalResponse,
  SubmitEvaluationScoresPayload,
  SubmitStepActionPayload,
  UpdateProposalPayload,
} from "@/lib/api/proposals/types";

/**
 * Create a new proposal (as Draft)
 * POST /proposals
 *
 * Accepts application/json.
 * Returns minimal response with id, title, status.
 * Default saves as Draft. Use submit=true query param to submit directly.
 *
 * @param payload - Proposal data (including fileId if file was uploaded)
 * @param options - { submit?: boolean }
 */
export async function createProposal(
  payload: CreateProposalPayload,
  options?: { submit?: boolean },
): Promise<CreateProposalResponse> {
  const { apiClient } = await import("@/lib/api/client");
  const params = options?.submit ? { submit: "true" } : {};

  const response = await apiClient.post<CreateProposalResponse>("/proposals", payload, {
    params,
  });
  return response.data;
}

/**
 * Update an existing proposal (as Draft)
 * PATCH /proposals/{id}
 */
export async function updateProposal(
  proposalId: string,
  payload: UpdateProposalPayload,
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

/**
 * Assign evaluators to a proposal.
 * POST /proposals/:id/evaluator-assign
 * @param proposalId - Proposal ID
 * @param userIds - Array of user IDs to assign as evaluators
 */
export async function assignEvaluators(proposalId: string, userIds: string[]): Promise<void> {
  const { apiClient } = await import("@/lib/api/client");
  await apiClient.post(`/proposals/${proposalId}/evaluator-assign`, {
    userIds,
  });
}
