import { useQuery } from "@tanstack/react-query";

import { apiClient } from "@/lib/api/client";
import type { PaginatedResponse } from "@/lib/api/types/pagination";

import type { EvaluationItem } from "./types";

export async function getEvaluationProposals(page = 1, limit = 10): Promise<PaginatedResponse<EvaluationItem>> {
  const response = await apiClient.get<PaginatedResponse<EvaluationItem>>("/evaluations/proposals", {
    params: { page, limit },
  });
  return response.data;
}

export function useGetEvaluationProposals(page = 1, limit = 10) {
  return useQuery({
    queryKey: ["evaluations", "proposals", page, limit],
    queryFn: () => getEvaluationProposals(page, limit),
  });
}

export async function getEvaluationProjects(page = 1, limit = 10): Promise<PaginatedResponse<EvaluationItem>> {
  const response = await apiClient.get<PaginatedResponse<EvaluationItem>>("/evaluations/projects", {
    params: { page, limit },
  });
  return response.data;
}

export function useGetEvaluationProjects(page = 1, limit = 10) {
  return useQuery({
    queryKey: ["evaluations", "projects", page, limit],
    queryFn: () => getEvaluationProjects(page, limit),
  });
}
