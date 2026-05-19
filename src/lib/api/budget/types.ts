export interface PiProjectBudget {
  projectId: string;
  title: string;
  projectType: string;
  totalApprovedBudget: string;
  totalDisbursed: string;
  activeRequestStatus: string | null;
}

export interface BudgetDashboard {
  projectId: string;
  title: string;
  projectType: string;
  totalApprovedBudget: number;
  totalDisbursed: number;
  remainingBalance: number;
  budgetItems: Array<{
    id: string;
    description: string;
    category: string;
    amount: string;
    status: string;
  }>;
  disbursementHistory: Array<{
    id: string;
    requestSequence: number;
    totalAmount: string;
    submittedAt: string;
    status: string;
    bankTransactionId: string | null;
    paidAt: string | null;
    clearanceDocumentUrl: string | null;
    clearanceDocumentName: string | null;
    financeFeedback: string | null;
    items: Array<{
      id: string;
      description: string;
      amount: string;
    }>;
  }>;
}
