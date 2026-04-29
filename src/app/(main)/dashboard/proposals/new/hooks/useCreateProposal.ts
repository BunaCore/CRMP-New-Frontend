import { useMutation, useQueryClient } from "@tanstack/react-query";

import { performFullUpload } from "@/lib/api/files/mutations";
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
      let finalFileId = payload.fileId;

      // 1. Handle file upload if a file is provided
      if (file) {
        try {
          finalFileId = await performFullUpload(file, "PROPOSAL_DOCUMENT");
        } catch (uploadError) {
          console.error("File upload failed:", uploadError);
          throw new Error("Failed to upload attachment. Please try again.");
        }
      }

      // 2. Submit the proposal with the fileId
      const response = await createProposal(
        {
          ...payload,
          fileId: finalFileId,
        },
        { submit },
      );

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
