"use client";

import { useCallback, useEffect, useState } from "react";

import { apiClient } from "@/lib/api/client";

import type { BudgetMetrics } from "../types";

export function useBudgetMetrics() {
  const [metrics, setMetrics] = useState<BudgetMetrics | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const { data } = await apiClient.get<BudgetMetrics>("/budget/admin/metrics");
      setMetrics(data);
    } catch {
      setError("Failed to load metrics.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetch();
  }, [fetch]);

  return { metrics, isLoading, error, refetch: fetch };
}
