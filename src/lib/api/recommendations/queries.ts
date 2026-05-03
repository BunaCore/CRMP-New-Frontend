import { useQuery } from "@tanstack/react-query";

import { getRecommendations, searchMembersML } from "./api";

export function useGetRecommendations(researcherId: string | null) {
  return useQuery({
    queryKey: ["recommendations", researcherId],
    // biome-ignore lint/style/noNonNullAssertion: enabled guarantees researcherId is set
    queryFn: () => getRecommendations(researcherId!),
    enabled: !!researcherId,
  });
}

export function useSearchMembersML(query: string, enabled = true) {
  return useQuery({
    queryKey: ["recommendations", "search", query],
    queryFn: () => searchMembersML(query),
    enabled: enabled && query.trim().length > 0,
  });
}
