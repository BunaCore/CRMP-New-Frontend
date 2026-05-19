"use client";

import { useEffect } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { useFieldArray, useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useSubmitEvaluationScores } from "@/lib/api/evaluations/mutations";
import type { EvaluationItem, EvaluationRubric } from "@/lib/api/evaluations/types";

interface EvaluationScoreModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  item: EvaluationItem | null;
  rubric: EvaluationRubric | null;
  type: "proposal" | "project";
}

type FormValues = {
  massScore?: number;
  scores?: { studentId: string; score: number }[];
};

export function EvaluationScoreModal({ open, onOpenChange, item, rubric, type }: EvaluationScoreModalProps) {
  const { mutateAsync: submitScores, isPending } = useSubmitEvaluationScores();

  // Create schema dynamically based on scoring mode
  const isIndividual = rubric?.isIndividual ?? false;

  const schema = isIndividual
    ? z.object({
        scores: z.array(
          z.object({
            studentId: z.string(),
            score: z.coerce
              .number()
              .min(0, "Score must be at least 0")
              .max(rubric?.totalPoints ?? 100, `Score cannot exceed ${rubric?.totalPoints ?? 100}`),
          }),
        ),
      })
    : z.object({
        massScore: z.coerce
          .number()
          .min(0, "Score must be at least 0")
          .max(rubric?.totalPoints ?? 100, `Score cannot exceed ${rubric?.totalPoints ?? 100}`),
      });

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      massScore: undefined,
      scores: [],
    },
  });

  const { fields, replace } = useFieldArray({
    control,
    name: "scores",
  });

  // Initialize field array when modal opens in individual mode
  useEffect(() => {
    if (open && item && rubric) {
      if (rubric.isIndividual) {
        replace(
          item.members.map((member) => ({
            studentId: member.id,
            score: 0,
          })),
        );
      } else {
        reset({ massScore: 0 });
      }
    }
  }, [open, item, rubric, replace, reset]);

  const onSubmit = async (data: FormValues) => {
    if (!item || !rubric) return;

    try {
      const payloadScores = rubric.isIndividual
        ? data.scores || []
        : item.members.map((member) => ({
            studentId: member.id,
            score: data.massScore as number,
          }));

      await submitScores({
        rubricId: rubric.id,
        ...(type === "proposal" ? { proposalId: item.id } : { projectId: item.id }),
        scores: payloadScores,
      });

      toast.success("Evaluation scores submitted successfully");
      onOpenChange(false);
    } catch (error) {
      console.error(error);
      toast.error("Failed to submit scores");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Submit Evaluation</DialogTitle>
          <DialogDescription>
            {item?.title} - {rubric?.name}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 pt-4">
          {!isIndividual ? (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="massScore">Group Score</Label>
                <Input
                  id="massScore"
                  type="number"
                  step="0.01"
                  {...register("massScore")}
                  placeholder={`Max: ${rubric?.totalPoints ?? 100}`}
                />
                {errors.massScore && <p className="font-medium text-destructive text-sm">{errors.massScore.message}</p>}
                <p className="text-muted-foreground text-sm">
                  This group score will be applied equally to all team members.
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {fields.map((field, index) => {
                const member = item?.members.find((m) => m.id === field.studentId);
                return (
                  <div key={field.id} className="space-y-2">
                    <Label htmlFor={`scores.${index}.score`}>{member?.name || "Student"}</Label>
                    <Input
                      id={`scores.${index}.score`}
                      type="number"
                      step="0.01"
                      {...register(`scores.${index}.score` as const)}
                      placeholder={`Max: ${rubric?.totalPoints ?? 100}`}
                    />
                    {errors.scores?.[index]?.score && (
                      <p className="font-medium text-destructive text-sm">{errors.scores[index]?.score?.message}</p>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isPending}>
              Cancel
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? "Submitting..." : "Submit Score"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
