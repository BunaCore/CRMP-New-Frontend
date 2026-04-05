export type ProposalStatus = "Draft" | "Submitted" | "Under Review" | "Revision";

export interface Proposal {
  id: string;
  title: string;
  pi: string;
  piAvatar: string;
  piColor: string;
  dept: string;
  submittedDate: string;
  status: ProposalStatus;
  budget: string;
  abstract: string;
  evaluators: string[];
  advisors: string[];
  lastAction: string;
  teamCount: number;
}

export type ApprovalStepState = "completed" | "current" | "upcoming";

export interface ApprovalStep {
  id: string;
  role: string;
  approverName: string;
  approvedAt?: string;
  state: ApprovalStepState;
}

export interface Evaluator {
  id: string;
  name: string;
  avatar: string;
  color: string;
  specialty: string;
  assigned: number;
}
