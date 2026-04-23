import { z } from "zod";

import { ProposalProgram } from "@/lib/api/proposals/types";

export const budgetItemSchema = z.object({
  id: z.string().optional(),
  title: z.string().optional(),
  description: z.string().min(1, "Description is required"),
  amount: z.coerce.number().min(0, "Amount must be a positive number"),
});

/**
 * Schema for selected user labels (stored alongside IDs for review display).
 * These are NOT sent to the API; they only exist so ReviewStep can show names.
 */
const selectedMemberSchema = z.object({
  value: z.string(),
  label: z.string(),
});

export const createProposalSchema = z
  .object({
    title: z.string().min(1, "Proposal title is required"),
    abstract: z.string().optional(),
    proposalProgram: z.nativeEnum(ProposalProgram, {
      errorMap: () => ({ message: "Please select a program" }),
    }),
    researchArea: z.string().min(1, "Research area is required"),
    departmentId: z.string().min(1, "Department is required"),
    departmentLabel: z.string().optional(), // Display-only
    durationMonths: z.coerce.number().min(1, "Duration must be at least 1 month"),
    isFunded: z.boolean().default(false),
    budget: z.array(budgetItemSchema).default([]),
    // Team — store value+label pairs so ReviewStep can display names
    members: z.array(selectedMemberSchema).default([]),
    advisor: selectedMemberSchema.nullable().default(null),
    file: z.custom<File | null>((val) => val === null || val instanceof File).default(null),
  })
  .superRefine((data, ctx) => {
    if (data.isFunded && data.budget.length === 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Please add at least one budget item if funded",
        path: ["budget"],
      });
    }
  });

export type CreateProposalFormValues = z.infer<typeof createProposalSchema>;
