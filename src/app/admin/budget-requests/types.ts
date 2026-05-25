// ============================================================
// FINANCE BUDGET MODULE — Shared Types
// ============================================================

export interface BudgetMetrics {
  totalPendingAmount: number;
  pendingCount: number;
  totalDisbursedAllTime: number;
  awaitingCorrectionCount: number;
}

export interface BudgetRequestItem {
  id: string;
  description: string;
  category: string;
  amount: number;
}

export type BudgetRequestStatus = "PENDING" | "RESUBMITTED" | "PAID" | "RETURNED" | "REJECTED";

export interface BudgetRequest {
  requestId: string;
  projectId: string;
  projectTitle: string;
  projectType: "PG" | "GENERAL";
  piName: string;
  piEmail: string;
  requestSequence: number;
  totalPhases: number;
  totalAmount: number;
  status: BudgetRequestStatus;
  submittedAt: string;
  paidAt: string | null;
  clearanceDocumentUrl: string | null;
  clearanceRequired: boolean;
  bankTransactionId: string | null;
  financeFeedback: string | null;
  items: BudgetRequestItem[];
}

export interface TimelineEntry {
  sequence: number;
  amount: number;
  status: "PAID" | "PENDING" | "RESUBMITTED" | "RETURNED" | "LOCKED";
  submittedAt?: string;
  paidAt?: string;
  bankTransactionId?: string;
}

export interface ProjectBudgetSummary {
  totalApprovedBudget: number;
  totalPaid: number;
  totalPending: number;
  totalRemaining: number;
}

export interface BudgetRequestDetail extends BudgetRequest {
  piPhone: string;
  piBankName: string;
  piBankAccountNumber: string;
  clearanceDocumentName: string | null;
  projectBudgetSummary: ProjectBudgetSummary;
  disbursementTimeline: TimelineEntry[];
}

export type SortField = "amount" | "daysWaiting" | null;
export type SortDir = "asc" | "desc";

export interface BudgetFilters {
  status: "ALL" | BudgetRequestStatus;
  search: string;
  sortField: SortField;
  sortDir: SortDir;
}
