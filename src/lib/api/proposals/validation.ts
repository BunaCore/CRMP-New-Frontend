/**
 * Proposal Program Validation
 * Centralized logic for user program restrictions
 */

import type { ProposalProgram } from "@/lib/api/proposals/types";

export interface ValidationResult {
  allowed: boolean;
  reason?: string;
}

/**
 * Check if user can create a proposal with a specific program.
 *
 * Rules:
 * - null userProgram → Can create any program (UG, PG, GENERAL)
 * - "UG" userProgram → Can only create UG proposals
 * - "PG" userProgram → Can only create PG proposals
 *
 * @param userProgram User's program from auth store (or null if unrestricted)
 * @param proposalProgram The proposal program to create
 * @returns { allowed, reason? }
 */
export function canUserCreateProposal(
  userProgram: "UG" | "PG" | null | undefined,
  proposalProgram: ProposalProgram | string,
): ValidationResult {
  // If user has no program restriction, allow anything
  if (!userProgram) {
    return { allowed: true };
  }

  // UG user can only create UG proposals
  if (userProgram === "UG" && proposalProgram !== "UG") {
    return {
      allowed: false,
      reason: "Your account is restricted to Undergraduate proposals only.",
    };
  }

  // PG user can only create PG proposals
  if (userProgram === "PG" && proposalProgram !== "PG") {
    return {
      allowed: false,
      reason: "Your account is restricted to Postgraduate proposals only.",
    };
  }

  return { allowed: true };
}

/**
 * Get list of allowed proposal programs for the user
 * Useful for filtering select options
 *
 * @param userProgram User's program from auth store
 * @returns Array of allowed proposal programs
 */
export function getAllowedProposalPrograms(
  userProgram: "UG" | "PG" | null | undefined,
): Array<"UG" | "PG" | "GENERAL"> {
  if (!userProgram) {
    // Unrestricted: can create any program
    return ["UG", "PG", "GENERAL"];
  }

  if (userProgram === "UG") {
    return ["UG"];
  }

  if (userProgram === "PG") {
    return ["PG"];
  }

  return [];
}
