import { useMutation, useQueryClient } from "@tanstack/react-query";

import { apiClient } from "@/lib/api/client";

import type { SubmitScorePayload } from "./types";

export async function submitEvaluationScores(payload: SubmitScorePayload): Promise<void> {
  await apiClient.post("/evaluations/scores", payload);
}

export function useSubmitEvaluationScores() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: submitEvaluationScores,
    onSuccess: () => {
      // Invalidate relevant queries to refetch data
      queryClient.invalidateQueries({ queryKey: ["evaluations"] });
    },
  });
}
