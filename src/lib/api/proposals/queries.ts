/**
 * Proposal API Queries
 * Read-only fetch actions for the researcher's proposals.
 *
 * NOTE: Authentication token is automatically injected via the
 * apiClient request interceptor (see src/lib/api/client.ts).
 * The backend resolves the current user from the token — no userId needed.
 */

import type {
  Advisor,
  DefenceSchedule,
  Evaluator,
  PiMember,
  ProposalComment,
  ProposalDepartment,
  ProposalStatus,
  ResearcherProposal,
  TeamMember,
  Workflow,
  PendingApproval,
  AdminProposalDetail,
  GetEvaluationsResponse,
  ProposalMemberEntry,
} from "@/lib/api/proposals/types";

// ─── Null-safety normalization ─────────────────────────────────────────────────

/**
 * Sanitizes a raw API proposal response, replacing all null/undefined
 * nested objects and arrays with safe empty defaults.
 * This prevents runtime errors in pages when the backend omits optional fields.
 */
// biome-ignore lint/suspicious/noExplicitAny: raw API response type unknown
function normalizeProposal(raw: any): ResearcherProposal {
  return {
    id: raw?.id ?? "",
    title: raw?.title ?? "Untitled Proposal",
    type: raw?.type ?? "—",
    status: (raw?.status ?? "Draft") as ProposalStatus,
    department: (raw?.department ?? { id: "", name: "—", code: "—" }) as ProposalDepartment,
    pi: (raw?.pi ?? { id: "", name: "Unknown", avatarUrl: null }) as PiMember,
    advisors: Array.isArray(raw?.advisors) ? (raw.advisors as Advisor[]) : [],
    evaluators: Array.isArray(raw?.evaluators) ? (raw.evaluators as Evaluator[]) : [],
    team: Array.isArray(raw?.team) ? (raw.team as TeamMember[]) : [],
    workflow: (raw?.workflow ?? { currentStepOrder: 0, steps: [] }) as Workflow,
    comments: Array.isArray(raw?.comments) ? (raw.comments as ProposalComment[]) : [],
    defenceSchedules: Array.isArray(raw?.defenceSchedules)
      ? (raw.defenceSchedules as DefenceSchedule[])
      : [],
    createdAt: raw?.createdAt ?? "",
  };
}

// ─── Queries ───────────────────────────────────────────────────────────────────

/**
 * Fetch all proposals related to the currently authenticated researcher.
 * GET /proposals/detail
 *
 * Returns every proposal the user is involved in as PI, team member,
 * advisor, or evaluator — along with full workflow, comments, and
 * defence schedules for each.
 *
 * All nested objects are guaranteed non-null via normalizeProposal().
 *
 * @returns Array of ResearcherProposal (empty array if none exist)
 * @throws AxiosError on network or server failure
 */
export async function getMyProposals(): Promise<ResearcherProposal[]> {
  const { apiClient } = await import("@/lib/api/client");
  // biome-ignore lint/suspicious/noExplicitAny: raw API response normalized below
  const response = await apiClient.get<any[]>("/proposals/detail");
  const raw = Array.isArray(response.data) ? response.data : [];
  return raw.map(normalizeProposal);
}

// ─── Admin Queries ─────────────────────────────────────────────────────────────

/**
 * Fetch all pending proposals awaiting the authenticated admin's approval
 * GET /proposals/pending-approvals
 */
export async function getPendingApprovals(): Promise<PendingApproval[]> {
  const { apiClient } = await import("@/lib/api/client");
  const response = await apiClient.get<PendingApproval[]>("/proposals/pending-approvals");
  return Array.isArray(response.data) ? response.data : [];
}

/**
 * Fetch the exact details for a specific proposal (admin view)
 * GET /proposals/:id
 */
export async function getAdminProposalDetails(id: string): Promise<AdminProposalDetail> {
  const { apiClient } = await import("@/lib/api/client");
  const response = await apiClient.get<AdminProposalDetail>(`/proposals/${id}`);
  return response.data;
}

/**
 * Fetch evaluations and rubrics for a specific proposal
 * GET /proposals/:id/evaluations
 */
export async function fetchProposalEvaluations(proposalId: string): Promise<GetEvaluationsResponse> {
  const { apiClient } = await import("@/lib/api/client");
  const response = await apiClient.get<GetEvaluationsResponse>(`/proposals/${proposalId}/evaluations`);
  return response.data;
}

/**
 * Fetch all members (PI + team) for a proposal
 * GET /proposals/:id/all-members
 */
export async function getProposalMembers(proposalId: string): Promise<ProposalMemberEntry[]> {
  const { apiClient } = await import("@/lib/api/client");
  const response = await apiClient.get<ProposalMemberEntry[]>(`/proposals/${proposalId}/all-members`);
  return Array.isArray(response.data) ? response.data : [];
}

