/**
 * Proposal API Queries
 * Read-only fetch actions for the researcher's proposals.
 *
 * NOTE: Authentication token is automatically injected via the
 * apiClient request interceptor (see src/lib/api/client.ts).
 * The backend resolves the current user from the token — no userId needed.
 */

import type {
  AdminProposalDetail,
  Advisor,
  ApprovalTimelineResponse,
  DefenceSchedule,
  Evaluator,
  GetEvaluationsResponse,
  PendingApproval,
  PiMember,
  ProposalComment,
  ProposalDepartment,
  ProposalListItem,
  ProposalListQueryParams,
  ProposalMemberEntry,
  ProposalStatus,
  ResearcherProposal,
  TeamMember,
  Workflow,
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
    department: (raw?.department ?? {
      id: "",
      name: "—",
      code: "—",
    }) as ProposalDepartment,
    pi: (raw?.pi ?? { id: "", name: "Unknown", avatarUrl: null }) as PiMember,
    advisors: Array.isArray(raw?.advisors) ? (raw.advisors as Advisor[]) : [],
    evaluators: Array.isArray(raw?.evaluators) ? (raw.evaluators as Evaluator[]) : [],
    team: Array.isArray(raw?.team) ? (raw.team as TeamMember[]) : [],
    workflow: (raw?.workflow ?? { currentStepOrder: 0, steps: [] }) as Workflow,
    comments: Array.isArray(raw?.comments) ? (raw.comments as ProposalComment[]) : [],
    defenceSchedules: Array.isArray(raw?.defenceSchedules) ? (raw.defenceSchedules as DefenceSchedule[]) : [],
    file: raw?.file
      ? {
          id: raw.file.id,
          name: raw.file.name,
          mimeType: raw.file.mimeType,
          size: raw.file.size,
          url: raw.file.url,
          visibility: raw.file.visibility,
          expiresIn: raw.file.expiresIn,
        }
      : undefined,
    createdAt: raw?.createdAt ?? "",
  };
}

// ─── Queries ───────────────────────────────────────────────────────────────────

import { useQuery } from "@tanstack/react-query";

function buildProposalQueryString(params: ProposalListQueryParams = {}): string {
  const searchParams = new URLSearchParams();

  if (params.program) searchParams.set("program", params.program);
  if (params.search?.trim()) searchParams.set("search", params.search.trim());
  if (params.status) searchParams.set("status", params.status);

  const query = searchParams.toString();
  return query ? `?${query}` : "";
}

/**
 * Fetch a specific proposal by ID.
 * GET /proposals/:id
 */
export async function getProposalById(proposalId: string): Promise<ResearcherProposal> {
  const { apiClient } = await import("@/lib/api/client");
  const response = await apiClient.get<ResearcherProposal>(`/proposals/${proposalId}`);
  return normalizeProposal(response.data);
}

/**
 * React Query hook to fetch a proposal by ID.
 */
export function useGetProposalById(proposalId: string | null, enabled = true) {
  return useQuery({
    queryKey: ["proposals", "byId", proposalId],
    queryFn: () => getProposalById(proposalId as string),
    enabled: enabled && !!proposalId,
  });
}

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

/**
 * Fetch detailed information about a specific proposal for admins.
 * GET /proposals/admin/:proposalId
 *
 * Returns detailed information about the proposal, including workflow,
 * comments, team members, and evaluation status.
 *
 * @param proposalId - The ID of the proposal to fetch details for.
 * @returns AdminProposalDetail object containing proposal details.
 * @throws AxiosError on network or server failure.
 */
export async function getAdminProposalDetails(proposalId: string): Promise<AdminProposalDetail> {
  const { apiClient } = await import("@/lib/api/client");
  const response = await apiClient.get<AdminProposalDetail>(`/proposals/${proposalId}`);
  return response.data;
}

/**
 * Fetch evaluations for a specific proposal.
 * GET /proposals/evaluations/:proposalId
 *
 * @param proposalId - The ID of the proposal to fetch evaluations for.
 * @returns Evaluation data for the proposal.
 * @throws AxiosError on network or server failure.
 */
export async function fetchProposalEvaluations(proposalId: string): Promise<GetEvaluationsResponse> {
  const { apiClient } = await import("@/lib/api/client");
  const response = await apiClient.get<GetEvaluationsResponse>(`/proposals/evaluations/${proposalId}`);
  return response.data;
}

/**
 * Fetch members of a specific proposal.
 * GET /proposals/members/:proposalId
 *
 * @param proposalId - The ID of the proposal to fetch members for.
 * @returns Array of ProposalMemberEntry.
 * @throws AxiosError on network or server failure.
 */
export async function getProposalMembers(proposalId: string): Promise<ProposalMemberEntry[]> {
  const { apiClient } = await import("@/lib/api/client");
  const response = await apiClient.get<ProposalMemberEntry[]>(`/proposals/members/${proposalId}`);
  return response.data;
}

/**
 * Fetch pending approvals for the admin dashboard.
 * GET /proposals/pending-approvals
 *
 * @returns Array of PendingApproval.
 * @throws AxiosError on network or server failure.
 */
export async function getPendingApprovals(): Promise<PendingApproval[]> {
  const { apiClient } = await import("@/lib/api/client");
  const response = await apiClient.get<PendingApproval[]>("/proposals/pending-approvals");
  return response.data;
}

/**
 * React Query hook for pending approvals on the admin dashboard.
 */
export function usePendingApprovalsQuery() {
  return useQuery({
    queryKey: ["proposals", "pending-approvals"],
    queryFn: getPendingApprovals,
  });
}

/**
 * Fetch the proposals related to the currently authenticated privileged user.
 * GET /proposals?program=UG&search=text&status=Approved
 */
export async function getProposalsList(params: ProposalListQueryParams = {}): Promise<ProposalListItem[]> {
  const { apiClient } = await import("@/lib/api/client");
  const response = await apiClient.get<ProposalListItem[]>(`/proposals${buildProposalQueryString(params)}`);
  return response.data;
}

/**
 * React Query hook for the admin proposals tab.
 */
export function useProposalsListQuery(params: ProposalListQueryParams = {}, enabled = true) {
  return useQuery({
    queryKey: ["proposals", "list", params.program ?? "all", params.status ?? "all", params.search ?? ""],
    queryFn: () => getProposalsList(params),
    enabled,
  });
}

/**
 * Fetch the approval timeline view for a proposal.
 * GET /proposals/:id/approval-timeline
 */
export async function getApprovalTimeline(proposalId: string): Promise<ApprovalTimelineResponse> {
  const { apiClient } = await import("@/lib/api/client");
  const response = await apiClient.get<ApprovalTimelineResponse>(`/proposals/${proposalId}/approval-timeline`);
  return response.data;
}
