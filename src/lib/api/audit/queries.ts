import { type InfiniteData, useInfiniteQuery } from "@tanstack/react-query";

import type { AuditLogsQueryParams, CursorAuditResponse } from "@/lib/api/audit/types";
import { apiClient } from "@/lib/api/client";

function buildAuditLogsQueryString(params: AuditLogsQueryParams & { cursor?: string | null }): string {
  const searchParams = new URLSearchParams();

  if (params.cursor) searchParams.set("cursor", params.cursor);
  if (params.search) searchParams.set("search", params.search);
  if (params.entityType) searchParams.set("entityType", params.entityType);
  if (params.action) searchParams.set("action", params.action);
  if (params.limit) searchParams.set("limit", String(params.limit));

  const query = searchParams.toString();
  return query ? `?${query}` : "";
}

export async function getAuditLogs(
  params: AuditLogsQueryParams & { cursor?: string | null } = {},
): Promise<CursorAuditResponse> {
  const response = await apiClient.get<CursorAuditResponse>(`/audit-logs${buildAuditLogsQueryString(params)}`);
  return response.data;
}

export function useAuditLogsInfiniteQuery(params: AuditLogsQueryParams = {}) {
  return useInfiniteQuery<
    CursorAuditResponse, // TQueryFnData (single page)
    Error, // TError
    InfiniteData<CursorAuditResponse>, // TData (infinite data)
    readonly unknown[], // TQueryKey
    string | null // TPageParam (cursor token)
  >({
    queryKey: ["audit", "logs", params],
    queryFn: ({ pageParam = null }) =>
      getAuditLogs({
        ...params,
        cursor: pageParam as string | null,
      }),
    getNextPageParam: (lastPage) => lastPage.next ?? undefined,
    initialPageParam: null,
  });
}

import { useQuery } from "@tanstack/react-query";

import type { AuditStatsResponse } from "@/lib/api/audit/types";

export async function getAuditStats(): Promise<AuditStatsResponse> {
  const response = await apiClient.get<AuditStatsResponse>("/audit-logs/stats");
  return response.data;
}

export function useAuditStatsQuery() {
  return useQuery({
    queryKey: ["audit", "stats"],
    queryFn: getAuditStats,
  });
}
