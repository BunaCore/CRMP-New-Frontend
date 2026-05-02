import { useQuery } from "@tanstack/react-query";

import { getRecommendations } from "./api";

export function useGetRecommendations(researcherId: number | null) {
  return useQuery({
    queryKey: ["recommendations", researcherId],
    // biome-ignore lint/style/noNonNullAssertion: enabled guarantees researcherId is set
    queryFn: () => getRecommendations(researcherId!),
    enabled: !!researcherId,
  });
}
