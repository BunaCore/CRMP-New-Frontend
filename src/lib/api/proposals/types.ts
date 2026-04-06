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

/**
 * Full proposal response (for GET operations)
 * Backend will improve this in the backlog
 */
export interface ProposalResponse {
  id: string; // UUID
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
  status: "Draft" | "Under_Review" | "Submitted" | "Revision";
  createdAt: string; // ISO date
  updatedAt: string; // ISO date
}

// Dropdown/Selector types
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
