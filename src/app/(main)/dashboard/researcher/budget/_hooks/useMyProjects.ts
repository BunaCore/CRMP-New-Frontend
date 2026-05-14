"use client";

import { useCallback, useEffect, useState } from "react";

import { apiClient } from "@/lib/api/client";

export interface ResearcherProject {
  projectId: string;
  title: string;
  projectType: "PG" | "GENERAL";
  totalApprovedBudget: number;
  totalDisbursed: number;
  activeRequestStatus: "PENDING" | "RETURNED" | "RESUBMITTED" | null;
}

interface UseMyProjectsResult {
  projects: ResearcherProject[];
  isLoading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useMyProjects(): UseMyProjectsResult {
  const [projects, setProjects] = useState<ResearcherProject[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProjects = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const { data } = await apiClient.get<ResearcherProject[]>("/budget/my-projects");
      setProjects(data);
    } catch {
      setError("Failed to load your projects. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  return { projects, isLoading, error, refetch: fetchProjects };
}
