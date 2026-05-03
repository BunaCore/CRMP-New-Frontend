"use client";

import * as React from "react";

import Link from "next/link";
import { useRouter } from "next/navigation";

import { zodResolver } from "@hookform/resolvers/zod";
import { AxiosError } from "axios";
import { ArrowLeft, ArrowRight, CheckCircle2 } from "lucide-react";
import { FormProvider, useForm } from "react-hook-form";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import type { ProposalProgram } from "@/lib/api/proposals/types";
import { ProposalMemberRole } from "@/lib/api/proposals/types";
import { useAuthStore } from "@/stores/authStore";

import { STEPS, Stepper } from "./_components/Stepper";
import { BasicInfoStep } from "./_components/steps/BasicInfoStep";
import { BudgetStep } from "./_components/steps/BudgetStep";
import { ReviewStep } from "./_components/steps/ReviewStep";
import { TeamStep } from "./_components/steps/TeamStep";
import { useCreateProposal } from "./hooks/useCreateProposal";
import { type CreateProposalFormValues, createProposalSchema } from "./schema/create-proposal";

export default function NewProposalPage() {
  const router = useRouter();
  const { user } = useAuthStore();

  const [currentStep, setCurrentStep] = React.useState(0);

  const methods = useForm<CreateProposalFormValues>({
    resolver: zodResolver(createProposalSchema),
    defaultValues: {
      title: "",
      abstract: "",
      proposalProgram: "" as ProposalProgram,
      researchArea: "",
      departmentId: "",
      departmentLabel: "",
      durationMonths: 1,
      isFunded: false,
      budget: [{ description: "", amount: 0, title: "" }],
      members: [],
      advisor: null,
      file: null,
    },
    mode: "onChange",
  });

  const {
    handleSubmit,
    watch,
    trigger,
    formState: { isSubmitting },
  } = methods;
  const isFunded = watch("isFunded");

  const { mutateAsync: createProposalMutation, isPending } = useCreateProposal();

  const handleNext = async () => {
    let fieldsToValidate: Array<keyof CreateProposalFormValues> = [];
    if (currentStep === 0) {
      fieldsToValidate = ["title", "abstract", "proposalProgram", "researchArea", "departmentId", "durationMonths"];
    } else if (currentStep === 1) {
      fieldsToValidate = ["members", "advisor"];
    } else if (currentStep === 2) {
      fieldsToValidate = ["budget", "isFunded"];
    }

    const isValid = await trigger(fieldsToValidate);
    if (!isValid) {
      toast.error("Please fill in all required fields correctly.");
      return;
    }

    if (currentStep < STEPS.length - 1) {
      if (currentStep === 1 && !isFunded) {
        setCurrentStep(3); // Skip budget
      } else {
        setCurrentStep((c) => c + 1);
      }
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      if (currentStep === 3 && !isFunded) {
        setCurrentStep(1); // Skip budget back to team
      } else {
        setCurrentStep((c) => c - 1);
      }
    }
  };

  const onSubmit = async (data: CreateProposalFormValues, submit: boolean) => {
    console.log("data", data);
    try {
      const payload = {
        title: data.title.trim(),
        abstract: data.abstract?.trim() || undefined,
        proposalProgram: data.proposalProgram,
        researchArea: data.researchArea.trim(),
        durationMonths: data.durationMonths,
        isFunded: data.isFunded,
        departmentId: data.departmentId,
        budget: data.isFunded
          ? data.budget.map((b) => ({ description: b.title || b.description, amount: b.amount }))
          : [],
        advisorUserId: data.advisor?.value,
        members: [
          { userId: user?.id || "", role: ProposalMemberRole.PI },
          ...data.members.map((m) => ({ userId: m.value, role: ProposalMemberRole.MEMBER })),
          // ...(data.advisor ? [{ userId: data.advisor.value, role: "ADVISOR" as unknown as ProposalMemberRole }] : []),
        ],
      };

      await createProposalMutation({ payload, file: data.file, submit });

      toast.success(submit ? "Proposal submitted successfully!" : "Proposal saved as draft!");
      router.push("/dashboard/proposals");
    } catch (error) {
      console.error("Failed to submit proposal:", error);
      toast.error(
        error instanceof AxiosError ? error.response?.data?.message : "Failed to submit proposal. Please try again.",
      );
    }
  };

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-4 p-4 md:p-6">
      <div className="mb-2 flex flex-col">
        <Link href="/dashboard/proposals" className="mb-2 w-fit">
          <Button
            variant="ghost"
            size="sm"
            className="-ml-2 h-7 rounded px-2 text-slate-500 text-xs transition-all hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <ArrowLeft className="mr-1.5 h-3.5 w-3.5" /> Back to Proposals
          </Button>
        </Link>
        <div>
          <h1 className="font-black text-3xl text-slate-900 tracking-tighter sm:text-4xl dark:text-slate-100">
            New Research Proposal
          </h1>
          <p className="mt-0.5 text-[13px] text-slate-500 text-sm md:text-base dark:text-slate-400">
            Draft your research framework, complete your whole team, and organize the budget.
          </p>
        </div>
      </div>

      <Card className="flex w-full flex-1 flex-col overflow-hidden rounded-xl border-slate-200 bg-white px-4 pt-6 pb-8 shadow-sm md:px-8 dark:border-slate-800 dark:bg-slate-950/50">
        <Stepper currentStep={currentStep} />

        <FormProvider {...methods}>
          <CardContent className="flex-1 p-0">
            {currentStep === 0 && <BasicInfoStep />}
            {currentStep === 1 && <TeamStep />}
            {currentStep === 2 && <BudgetStep />}
            {currentStep === 3 && <ReviewStep />}
          </CardContent>

          <div className="mt-10 flex w-full items-center justify-between border-slate-100 border-t pt-4 dark:border-slate-800">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleBack}
              disabled={currentStep === 0}
              className={`h-9 px-4 font-medium transition-opacity ${currentStep === 0 ? "pointer-events-none opacity-0" : ""}`}
            >
              Previous
            </Button>
            <div className="flex gap-2">
              {currentStep === 3 ? (
                <>
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={() =>
                      handleSubmit(
                        (data) => onSubmit(data, false),
                        (errors) => {
                          console.error("Validation errors:", errors);
                          toast.error("Please fix validation errors before saving.");
                        },
                      )()
                    }
                    disabled={isPending || isSubmitting}
                    className="h-9 px-6 font-semibold"
                  >
                    {isPending || isSubmitting ? "Saving..." : "Save as Draft"}
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    className="h-9 border-0 bg-blue-600 px-6 font-semibold text-white shadow-sm hover:bg-blue-700 disabled:opacity-50"
                    onClick={() =>
                      handleSubmit(
                        (data) => onSubmit(data, true),
                        (errors) => {
                          console.error("Validation errors:", errors);
                          toast.error("Please fix validation errors before submitting.");
                        },
                      )()
                    }
                    disabled={isPending || isSubmitting}
                  >
                    {isPending || isSubmitting ? "Submitting..." : "Submit Proposal"}
                    <CheckCircle2 className="ml-1.5 h-4 w-4" />
                  </Button>
                </>
              ) : (
                <Button
                  type="button"
                  size="sm"
                  onClick={handleNext}
                  className="h-9 border-0 bg-slate-900 px-6 font-semibold text-white shadow-sm hover:bg-slate-800 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-slate-200"
                >
                  Next <ArrowRight className="ml-1.5 h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
        </FormProvider>
      </Card>
    </div>
  );
}
