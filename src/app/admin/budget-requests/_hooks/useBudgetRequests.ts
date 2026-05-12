"use client";

import { useCallback, useEffect, useRef } from "react";

import { apiClient } from "@/lib/api/client";

import { useBudgetRequestsCtx } from "../_context/BudgetRequestsContext";
import type { BudgetRequest, BudgetRequestStatus } from "../types";

export function useBudgetRequests() {
  const { state, dispatch } = useBudgetRequestsCtx();
  const abortRef = useRef<AbortController | null>(null);

  const fetch = useCallback(async () => {
    abortRef.current?.abort();
    abortRef.current = new AbortController();

    const params = new URLSearchParams();
    if (state.filters.status !== "ALL") {
      params.append("status", state.filters.status as BudgetRequestStatus);
    }

    try {
      const { data } = await apiClient.get<BudgetRequest[]>(
        `/budget/admin/requests${params.toString() ? `?${params}` : ""}`,
        { signal: abortRef.current.signal },
      );
      dispatch({ type: "SET_REQUESTS", payload: data });
    } catch (err: unknown) {
      const isAbort = err instanceof Error && (err.name === "AbortError" || err.name === "CanceledError");
      if (!isAbort) {
        dispatch({ type: "SET_REQUESTS", payload: [] });
      }
    }
  }, [state.filters.status, dispatch]);

  useEffect(() => {
    fetch();
    return () => abortRef.current?.abort();
  }, [fetch]);

  return { refetch: fetch };
}
