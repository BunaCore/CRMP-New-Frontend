export type BudgetRequestStatus = "Pending" | "Paid" | "Returned" | "Resubmitted";
export type BudgetRequestMode = "All-at-once" | "Phased";

export interface BudgetPhase {
  phase: number;
  label: string;
  amount: number;
  status: BudgetRequestStatus;
  /** null = no clearance required (Phase 1) */
  clearanceFileName: string | null;
  /** Date the PI submitted this request */
  submittedAt: string | null;
  /** Date Finance acted on it */
  actedAt: string | null;
  transactionId: string | null;
  approvedAmount: number | null;
  financeComment: string | null;
  budgetItems?: { description: string; amount: number }[];
}

export interface BudgetRequest {
  id: string;
  projectId: string;
  projectTitle: string;
  pi: string;
  piAvatar: string;
  piColor: string;
  dept: string;
  totalBudget: number;
  mode: BudgetRequestMode;
  bankRoutingInfo: string;
  phases: BudgetPhase[];
  /** Which phase index is currently active/pending (0-based) */
  activePhasIndex: number;
  pgOfficerNote: string;
}
