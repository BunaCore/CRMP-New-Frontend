/**
 * Proposal API Types
 * Mirrors backend DTOs exactly (minus DegreeLevel)
 */

export enum ProposalProgram {
  UG = "UG",
  PG = "PG",
  GENERAL = "GENERAL",
}

export enum ProposalMemberRole {
  PI = "PI",
  MEMBER = "MEMBER",
}

export interface BudgetItem {
  description: string;
  amount: number;
}

export interface ProposalMember {
  userId: string; // UUID
  role: ProposalMemberRole;
}

export interface CreateProposalPayload {
  title: string;
  abstract?: string;
  proposalProgram: ProposalProgram;
  isFunded?: boolean;
  researchArea: string;
  advisorUserId?: string; // UUID, optional
  departmentId: string; // UUID, required
  durationMonths: number; // >= 1
  budget: BudgetItem[];
  members: ProposalMember[];
}

/**
 * Backend response after creating a proposal
 * Note: Backend returns minimal data. Full proposal fetched separately.
 * submitted=false → Draft, submitted=true → Under_Review
 */
export interface CreateProposalResponse {
  proposal: {
    id: string;
    title: string;
    status: "Draft" | "Under_Review";
  };
  submitted: boolean;
  submissionError?: string;
}

// ─── Nested types for ResearcherProposal ──────────────────────────────────────

export interface ProposalDepartment {
  id: string;
  name: string;
  code: string;
}

export interface PiMember {
  id: string;
  name: string;
  avatarUrl: string | null;
}

export interface Advisor {
  id: string;
  name: string;
}

export interface Evaluator {
  id: string;
  name: string;
}

export interface TeamMember {
  id: string;
  name: string;
}

export type WorkflowStepStatus = "Accepted" | "Rejected" | "Pending" | "Revision";
export type WorkflowStepRole = "ADVISOR" | "COORDINATOR" | "DGC" | "PG_OFFICE" | "EVALUATOR";

export interface WorkflowStep {
  stepOrder: number;
  label: string;
  role: WorkflowStepRole;
  status: WorkflowStepStatus;
  isActive: boolean;
  comment?: string;
  approverUserId?: string;
}

export interface Workflow {
  currentStepOrder: number;
  steps: WorkflowStep[];
}

export type StepType = "APPROVAL" | "VOTE" | "FORM";

export type StepStatus = "PENDING" | "IN_PROGRESS" | "COMPLETED" | "REJECTED";

export interface FormField {
  name: string;
  type: string;
  multiple?: boolean;
  required?: boolean;
}

export interface ApprovalTimelineStep {
  id: string;
  stepOrder: number;
  stepLabel: string;
  stepType: StepType;
  approverRole: string;
  status: StepStatus | WorkflowStepStatus | string;
  isActive: boolean;
  isFinal: boolean;
  canAct: boolean;
  // biome-ignore lint/suspicious/noExplicitAny: API design constraint
  userAction: any | null;
  decision?: {
    // biome-ignore lint/suspicious/noExplicitAny: API design constraint
    value: any | null;
    by?: string;
    at?: string;
    comment?: string;
  };
  vote?: {
    threshold: number;
    strategy: string;
    counts: {
      approved: number;
      rejected: number;
      total: number;
    };
    votes: string[];
  };
  form?: {
    schema: {
      fields: FormField[];
    };
    submission: {
      submittedBy: string;
      submittedAt: string;
      // biome-ignore lint/suspicious/noExplicitAny: API design constraint
      values: Record<string, any>;
    } | null;
  };
  approverUserId?: string;
}

export interface ApprovalTimelineResponse {
  proposalId: string;
  currentStepOrder: number;
  steps: ApprovalTimelineStep[];
}

export interface SubmitStepActionPayload {
  decision?: "Accepted" | "Rejected" | "Needs_Revision";
  // biome-ignore lint/suspicious/noExplicitAny: Form inputs have dynamic structures
  input?: Record<string, any>;
  comment?: string;
}

export interface ProposalComment {
  id: string;
  commentText: string;
  authorId: string;
  isResolved: boolean;
  createdAt: string; // ISO date
}

export interface DefenceSchedule {
  id: string;
  defenceDate: string; // ISO date
  location: string;
  note?: string;
  scheduledBy: string;
  createdAt: string; // ISO date
}

export type ProposalStatus = "Draft" | "Under_Review" | "Revision" | "Accepted" | "Rejected" | "Pending";

/**
 * Full rich proposal returned by GET /proposals/detail.
 * Replaces the old minimal ProposalResponse.
 * Mirrors the backend DTO exactly.
 */
export interface ResearcherProposal {
  id: string; // UUID
  title: string;
  type: string; // e.g. "PG" | "UG" | "GENERAL"
  status: ProposalStatus;
  department: ProposalDepartment;
  pi: PiMember;
  advisors: Advisor[];
  evaluators: Evaluator[];
  team: TeamMember[];
  workflow: Workflow;
  comments: ProposalComment[];
  defenceSchedules: DefenceSchedule[];
  createdAt: string; // ISO date
}

/**
 * @deprecated Use ResearcherProposal for GET operations.
 * Kept for backwards compatibility with existing code.
 */
export interface ProposalResponse {
  id: string;
  title: string;
  abstract?: string;
  proposalProgram: ProposalProgram;
  isFunded: boolean;
  researchArea: string;
  advisorUserId?: string;
  departmentId: string;
  durationMonths: number;
  budget: BudgetItem[];
  members: ProposalMember[];
  status: ProposalStatus;
  createdAt: string;
  updatedAt: string;
}

// ─── Dropdown/Selector types ───────────────────────────────────────────────────

export interface DepartmentOption {
  label: string;
  value: string; // UUID
}

export interface UserOption {
  label: string;
  value: string; // UUID
  id?: string;
  name?: string;
  email?: string;
}

// ─── Admin Specific Types ──────────────────────────────────────────────────────

export interface PendingApproval {
  id: string;
  title: string;
  abstract?: string;
  proposalProgram: string;
  isFunded: boolean;
  currentStatus: ProposalStatus | string;
  submittedAt: string;
  createdAt: string;
  createdBy: string;
  createdByName: string;
  currentStepOrder: number;
  currentApproverRole: string;
  stepLabel: string;
  evaluatorAssigned: boolean;
  advisorAssigned: boolean;
  budget: BudgetItem[]; // Added budget property as an array of BudgetItem
}

export interface AdminProposalDetail {
  id: string;
  title: string;
  type: string;
  status: ProposalStatus | string;
  budget: {
    total: number;
    items: BudgetItem[];
  };
  department: ProposalDepartment;
  pi: PiMember;
  advisors: Advisor[];
  evaluators: Evaluator[];
  team: TeamMember[];
  workflow: Workflow;
  comments: ProposalComment[];
  defenceSchedules: DefenceSchedule[];
  createdAt: string;
}

// ─── Evaluation Types ────────────────────────────────────────────────────────

export interface AwardedScore {
  id: string;
  studentId: string;
  evaluatorId: string;
  score: number;
  feedback: string;
  projectId: string | null;
  updatedAt: string;
}

export interface EvaluationRubric {
  id: string;
  name: string;
  phase: "PROPOSAL" | "PROJECT";
  type: "continuous" | "final";
  maxPoints: number;
  awardedScores: AwardedScore[];
}

export interface GetEvaluationsResponse {
  proposalId: string;
  rubrics: EvaluationRubric[];
}

export interface ScoreInput {
  rubricId: string;
  studentId: string;
  score: number;
  feedback: string;
  projectId: string | null;
}

export interface SubmitEvaluationScoresPayload {
  scores: ScoreInput[];
}

// ─── Proposal Members ────────────────────────────────────────────────────────

export interface ProposalMemberEntry {
  userId: string;
  role: "PI" | "MEMBER" | string;
}
