import { useQuery } from "@tanstack/react-query";

import { apiClient } from "@/lib/api/client";

import type { BudgetDashboard, PiProjectBudget } from "./types";

export const budgetKeys = {
  all: ["budget"] as const,
  myProjects: () => [...budgetKeys.all, "my-projects"] as const,
  dashboard: (projectId: string) => [...budgetKeys.all, "dashboard", projectId] as const,
};

export function useMyBudgetProjects(options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: budgetKeys.myProjects(),
    queryFn: async (): Promise<PiProjectBudget[]> => {
      const response = await apiClient.get<PiProjectBudget[]>("/budget/my-projects");
      return response.data;
    },
    ...options,
  });
}

export function useProjectBudgetDashboard(projectId: string) {
  return useQuery({
    queryKey: budgetKeys.dashboard(projectId),
    queryFn: async (): Promise<BudgetDashboard> => {
      const response = await apiClient.get<BudgetDashboard>(`/budget/project/${projectId}/dashboard`);
      return response.data;
    },
    enabled: !!projectId,
  });
}
