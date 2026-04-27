import { useMutation, useQueryClient } from "@tanstack/react-query";

import { createProposal } from "@/lib/api/proposals/mutations";
import type { CreateProposalPayload, CreateProposalResponse } from "@/lib/api/proposals/types";

interface UseCreateProposalOptions {
  onSuccess?: (
    data: CreateProposalResponse,
    variables: { payload: CreateProposalPayload; file: File | null; submit: boolean },
  ) => void;
  onError?: (error: Error) => void;
}

export function useCreateProposal(options?: UseCreateProposalOptions) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      payload,
      file,
      submit,
    }: {
      payload: CreateProposalPayload;
      file: File | null;
      submit: boolean;
    }) => {
      const response = await createProposal(payload, file, { submit });
      if (response.submissionError) {
        throw new Error(response.submissionError);
      }
      return response;
    },
    onSuccess: (data, variables) => {
      // Invalidate existing proposal queries to refresh the list after creation
      queryClient.invalidateQueries({ queryKey: ["proposals"] });
      options?.onSuccess?.(data, variables);
    },
    onError: (error) => {
      options?.onError?.(error instanceof Error ? error : new Error(String(error)));
    },
  });
}
