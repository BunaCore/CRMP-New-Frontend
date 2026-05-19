"use client";

import { useCallback, useEffect, useState } from "react";

import { apiClient } from "@/lib/api/client";

export interface BudgetItem {
  id: string;
  description: string;
  category: string;
  amount: number;
  status: "AVAILABLE" | "PENDING_DISBURSEMENT" | "PAID";
}

export interface DisbursementItem {
  id: string;
  description: string;
  amount: number;
}

export interface DisbursementRecord {
  id: string;
  requestSequence: number;
  totalAmount: number;
  submittedAt: string;
  status: "PENDING" | "RESUBMITTED" | "PAID" | "RETURNED" | "REJECTED";
  bankTransactionId: string | null;
  paidAt: string | null;
  clearanceDocumentUrl: string | null;
  financeFeedback: string | null;
  items: DisbursementItem[];
}

export interface ProjectBudgetDashboard {
  projectId: string;
  title: string;
  projectType: "PG" | "GENERAL";
  totalApprovedBudget: number;
  totalDisbursed: number;
  remainingBalance: number;
  budgetItems: BudgetItem[];
  disbursementHistory: DisbursementRecord[];
}

interface UseProjectBudgetResult {
  dashboard: ProjectBudgetDashboard | null;
  isLoading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useProjectBudget(projectId: string | null): UseProjectBudgetResult {
  const [dashboard, setDashboard] = useState<ProjectBudgetDashboard | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchDashboard = useCallback(async () => {
    if (!projectId) return;
    setIsLoading(true);
    setError(null);
    try {
      const { data } = await apiClient.get<ProjectBudgetDashboard>(`/budget/project/${projectId}/dashboard`);
      setDashboard(data);
    } catch {
      setError("Failed to load budget dashboard. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }, [projectId]);

  useEffect(() => {
    fetchDashboard();
  }, [fetchDashboard]);

  return { dashboard, isLoading, error, refetch: fetchDashboard };
}
