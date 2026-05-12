"use client";

import { useCallback, useState } from "react";

import { apiClient } from "@/lib/api/client";

import { useBudgetRequestsCtx } from "../_context/BudgetRequestsContext";
import type { BudgetRequestDetail } from "../types";

export function useBudgetRequestDetail() {
  const { dispatch } = useBudgetRequestsCtx();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const openRequest = useCallback(
    async (requestId: string) => {
      setIsLoading(true);
      setError(null);
      dispatch({ type: "SET_ACTIVE_REQUEST", payload: null });
      dispatch({ type: "SET_DRAWER_OPEN", payload: true });

      try {
        const { data } = await apiClient.get<BudgetRequestDetail>(`/budget/admin/requests/${requestId}`);
        dispatch({ type: "SET_ACTIVE_REQUEST", payload: data });
      } catch {
        setError("Failed to load request details. Please try again.");
      } finally {
        setIsLoading(false);
      }
    },
    [dispatch],
  );

  const closeDrawer = useCallback(() => {
    dispatch({ type: "SET_DRAWER_OPEN", payload: false });
    dispatch({ type: "SET_ACTIVE_REQUEST", payload: null });
    dispatch({ type: "SET_APPROVE_MODAL", payload: false });
    dispatch({ type: "SET_RETURN_MODAL", payload: false });
  }, [dispatch]);

  return { openRequest, closeDrawer, isLoading, error };
}
