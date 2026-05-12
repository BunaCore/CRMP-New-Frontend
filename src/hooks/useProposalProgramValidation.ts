/**
 * Hook for proposal program validation
 * Use in forms to get user's allowed programs and validation state
 */

import type { ProposalProgram } from "@/lib/api/proposals/types";
import { canUserCreateProposal, getAllowedProposalPrograms } from "@/lib/api/proposals/validation";
import { useAuthStore } from "@/stores/authStore";

interface UseProposalProgramValidationResult {
  userProgram: "UG" | "PG" | null | undefined;
  allowedPrograms: Array<"UG" | "PG" | "GENERAL">;
  isRestricted: boolean;
  canCreate: (program: ProposalProgram | string) => boolean;
  getRestrictionMessage: (program: ProposalProgram | string) => string | undefined;
}

/**
 * Hook to validate proposal program creation against user's restrictions
 *
 * Usage:
 * ```
 * const { allowedPrograms, isRestricted, getRestrictionMessage } = useProposalProgramValidation();
 *
 * // Filter select options
 * <SelectItem value="UG" disabled={!allowedPrograms.includes("UG")} />
 *
 * // Show error message
 * const error = getRestrictionMessage(selectedProgram);
 * ```
 */
export function useProposalProgramValidation(): UseProposalProgramValidationResult {
  const user = useAuthStore((state) => state.user);
  const userProgram = user?.userProgram;

  const allowedPrograms = getAllowedProposalPrograms(userProgram);
  const isRestricted = allowedPrograms.length < 3;

  return {
    userProgram,
    allowedPrograms,
    isRestricted,
    canCreate: (program) => canUserCreateProposal(userProgram, program).allowed,
    getRestrictionMessage: (program) => {
      const result = canUserCreateProposal(userProgram, program);
      return result.reason;
    },
  };
}
