"use client";

import { useEffect, useState } from "react";

import { Award, Banknote, CalendarDays, CheckCircle2, FileText, ShieldCheck, Users } from "lucide-react";
import { toast } from "sonner";

import { hasPermission } from "@/access-control/permission-gates";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { submitEvaluationScores } from "@/lib/api/proposals/mutations";
import { fetchProposalEvaluations, useGetProposalMembers } from "@/lib/api/proposals/queries";
import type { EvaluationRubric } from "@/lib/api/proposals/types";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/stores/authStore";

import { formatPeopleList } from "../../proposals/_components/proposals-table";
import { useEvaluations } from "../evaluations-context";
import {
  type DraftScore,
  EvaluationBudgetTab,
  EvaluationDefenceTab,
  EvaluationOverviewTab,
  EvaluationReviewTab,
  EvaluationScoresTab,
  TeamTabContent,
} from "./evaluation-drawer-sections";
import { STATUS_STYLES } from "./evaluations-tabs";

export function EvaluationDrawer() {
  const {
    drawerOpen,
    drawerKind,
    drawerTab,
    setDrawerTab,
    activeProposal,
    activeProject,
    rubric,
    setRubric,
    totals,
    defenceDate,
    setDefenceDate,
    defenceTime,
    setDefenceTime,
    defenceVenue,
    setDefenceVenue,
    defenceMessage,
    setDefenceMessage,
    defenceDraftSent,
    handleSendDefenceInvite,
    isEvalApproved,
    closeDrawer,
    setPickedEvalIds,
    setShowAssign,
    filteredAdvisors,
    setPickedAdvisorIds,
    setShowAssignAdvisor,
  } = useEvaluations();

  const { user } = useAuthStore();
  const userPerms = user?.permissions ?? [];
  const canScheduleDefence = hasPermission(userPerms, "DEFENCE_SCHEDULE");
  const canViewBudget = hasPermission(userPerms, "BUDGET_VIEW");
  const canAssignEvaluators = hasPermission(userPerms, "EVALUATOR_ASSIGN");
  const canAssignAdvisors = hasPermission(userPerms, "ADVISOR_ASSIGN");

  const [apiRubrics, setApiRubrics] = useState<EvaluationRubric[]>([]);
  const [draftScores, setDraftScores] = useState<Record<string, DraftScore>>({});
  const [scoresLoading, setScoresLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const activeId = drawerKind === "proposal" ? activeProposal?.id : activeProject?.id;

  const { data: members = [], isLoading: membersLoading } = useGetProposalMembers(activeId ?? null);

  useEffect(() => {
    if (drawerTab !== "scores" || !activeId) return;

    setScoresLoading(true);
    fetchProposalEvaluations(activeId)
      .then((data) => {
        setApiRubrics(data.rubrics);
        const prefilled: Record<string, DraftScore> = {};
        for (const rubricItem of data.rubrics) {
          const existing = rubricItem.awardedScores[0];
          prefilled[rubricItem.id] = {
            score: existing?.score ?? 0,
            feedback: existing?.feedback ?? "",
          };
        }
        setDraftScores(prefilled);
      })
      .catch(() => {
        toast.error("Failed to load evaluation rubrics.");
      })
      .finally(() => setScoresLoading(false));
  }, [drawerTab, activeId]);

  const phaseFilter = drawerKind === "proposal" ? "PROPOSAL" : "PROJECT";
  const filteredApiRubrics = apiRubrics.filter((rubricItem) => rubricItem.phase === phaseFilter);

  const apiAggregate = filteredApiRubrics.reduce(
    (acc, rubricItem) => {
      acc.earned += draftScores[rubricItem.id]?.score ?? 0;
      acc.max += rubricItem.maxPoints;
      return acc;
    },
    { earned: 0, max: 0 },
  );

  async function handleSubmitScores() {
    if (!activeId) return;

    if (filteredApiRubrics.length === 0) {
      toast.error("No rubrics found for this proposal. Cannot submit scores.");
      return;
    }

    // Find the PI first, fall back to any MEMBER, then any member at all
    const targetStudent =
      members.find((m) => m.role === "PI") ?? members.find((m) => m.role === "MEMBER") ?? members[0];

    if (!targetStudent) {
      toast.error("Could not find a valid student to evaluate. Make sure team members are loaded.");
      return;
    }

    const scores = filteredApiRubrics.map((rubricItem) => ({
      rubricId: rubricItem.id,
      studentId: targetStudent.userId,
      score: draftScores[rubricItem.id]?.score ?? 0,
      feedback: draftScores[rubricItem.id]?.feedback ?? "",
      projectId: drawerKind === "project" ? activeId : null,
    }));

    setIsSubmitting(true);
    try {
      await submitEvaluationScores(activeId, { scores });
      toast.success("Evaluation scores submitted successfully!");
    } catch {
      toast.error("Failed to submit scores. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  const drawerTitle = drawerKind === "proposal" ? activeProposal?.title : activeProject?.title;
  const drawerSubtitle =
    drawerKind === "proposal"
      ? activeProposal
        ? `${activeProposal.id} · ${activeProposal.dept} · ${activeProposal.pi}`
        : ""
      : activeProject
        ? `${activeProject.id} · ${activeProject.dept} · ${activeProject.lead}`
        : "";

  const evaluatorSummary = (activeProposal as { evaluators?: string[] } | null)?.evaluators?.length
    ? `${(activeProposal as { evaluators?: string[] } | null)?.evaluators?.length} assigned: ${formatPeopleList((activeProposal as { evaluators?: string[] } | null)?.evaluators || [], 3)}`
    : "No evaluators assigned";

  const advisorSummary = (activeProposal as { advisors?: string[] } | null)?.advisors?.length
    ? `${(activeProposal as { advisors?: string[] } | null)?.advisors?.length} assigned: ${formatPeopleList((activeProposal as { advisors?: string[] } | null)?.advisors || [], 3)}`
    : "No advisors assigned";

  const handleAssignEvaluatorsClick = () => {
    setPickedEvalIds([]);
    setShowAssign(true);
  };

  const handleAssignAdvisorClick = () => {
    const pre = filteredAdvisors
      // biome-ignore lint/suspicious/noExplicitAny: dynamic access allowed for mockup
      .filter((advisor) => ((activeProposal as any)?.advisors || []).includes(advisor.name))
      .map((advisor) => advisor.id);
    setPickedAdvisorIds(pre);
    setShowAssignAdvisor(true);
  };

  return (
    <Sheet open={drawerOpen} onOpenChange={(open) => !open && closeDrawer()}>
      <SheetContent
        side="right"
        className="flex w-full flex-col overflow-hidden border-slate-200/80 border-l p-0 shadow-2xl sm:max-w-230 xl:max-w-275 dark:border-slate-800"
      >
        {drawerTitle && (
          <>
            <SheetHeader className="shrink-0 space-y-0 border-slate-100 border-b bg-linear-to-br from-indigo-50/90 via-white to-white px-6 pt-6 pb-4 dark:border-slate-800 dark:from-indigo-950/40 dark:via-slate-950 dark:to-slate-950">
              <div className="flex flex-wrap items-center gap-2">
                <Badge className="border-0 bg-white/80 font-bold text-[10px] text-slate-700 shadow-sm dark:bg-slate-800 dark:text-slate-200">
                  {drawerKind === "proposal" ? "Proposal evaluation" : "Project evaluation"}
                </Badge>
                {drawerKind === "project" && activeProject && (
                  <Badge
                    className={cn("border-0 font-bold text-[10px]", STATUS_STYLES[activeProject.evalStatus].className)}
                  >
                    {activeProject.evalStatus}
                  </Badge>
                )}
                {isEvalApproved && (
                  <Badge className="border-0 bg-emerald-600 font-bold text-[10px] text-white">
                    <CheckCircle2 className="mr-1 h-3 w-3" />
                    Evaluation approved
                  </Badge>
                )}
              </div>
              <SheetTitle className="mt-2 pr-2 text-left font-bold text-[17px] text-slate-900 leading-snug dark:text-slate-100">
                {drawerTitle}
              </SheetTitle>
              <SheetDescription className="text-left text-xs leading-relaxed">{drawerSubtitle}</SheetDescription>

              <div className="no-scrollbar mt-4 flex flex-nowrap items-center gap-1.5 overflow-x-auto rounded-xl bg-slate-100/80 p-1 dark:bg-slate-900/60">
                {[
                  {
                    id: "overview" as const,
                    label: "Overview",
                    icon: FileText,
                  },
                  { id: "team" as const, label: "Team", icon: Users },
                  ...(canViewBudget
                    ? [
                        {
                          id: "budget" as const,
                          label: "Budget",
                          icon: Banknote,
                        },
                      ]
                    : []),
                  { id: "scores" as const, label: "Scores", icon: Award },
                  ...(canScheduleDefence
                    ? [
                        {
                          id: "defence" as const,
                          label: "Defence",
                          icon: CalendarDays,
                        },
                      ]
                    : []),
                  {
                    id: "review" as const,
                    label: "Approve",
                    icon: ShieldCheck,
                  },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setDrawerTab(tab.id)}
                    className={cn(
                      "flex shrink-0 items-center justify-center gap-2 rounded-lg px-3 py-2 font-semibold text-xs transition-all",
                      drawerTab === tab.id
                        ? "bg-white text-indigo-700 shadow-sm dark:bg-slate-800 dark:text-indigo-400"
                        : "text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200",
                    )}
                  >
                    <tab.icon className="h-3.5 w-3.5 shrink-0" />
                    {tab.label}
                  </button>
                ))}
              </div>
            </SheetHeader>

            <div className="flex flex-1 flex-col gap-6 overflow-y-auto px-6 py-6 sm:px-8 sm:py-8">
              {drawerTab === "overview" && (
                <EvaluationOverviewTab
                  drawerKind={drawerKind}
                  activeProposal={activeProposal}
                  activeProject={activeProject}
                  canAssignEvaluators={canAssignEvaluators}
                  canAssignAdvisors={canAssignAdvisors}
                  evaluatorSummary={evaluatorSummary}
                  advisorSummary={advisorSummary}
                  onAssignEvaluators={handleAssignEvaluatorsClick}
                  onAssignAdvisor={handleAssignAdvisorClick}
                />
              )}

              {drawerTab === "team" && (
                <TeamTabContent proposalId={drawerKind === "proposal" ? activeProposal?.id : undefined} />
              )}

              {drawerTab === "budget" && canViewBudget && (
                <EvaluationBudgetTab
                  drawerKind={drawerKind}
                  activeProposal={activeProposal}
                  activeProject={activeProject}
                />
              )}

              {drawerTab === "scores" && (
                <EvaluationScoresTab
                  drawerKind={drawerKind}
                  rubric={rubric}
                  setRubric={setRubric}
                  apiRubrics={apiRubrics}
                  filteredApiRubrics={filteredApiRubrics}
                  draftScores={draftScores}
                  setDraftScores={setDraftScores}
                  scoresLoading={scoresLoading}
                  membersLoading={membersLoading}
                  isSubmitting={isSubmitting}
                  totals={totals}
                  apiAggregate={apiAggregate}
                  handleSubmitScores={handleSubmitScores}
                />
              )}

              {drawerTab === "defence" && canScheduleDefence && (
                <EvaluationDefenceTab
                  defenceDate={defenceDate}
                  setDefenceDate={setDefenceDate}
                  defenceTime={defenceTime}
                  setDefenceTime={setDefenceTime}
                  defenceVenue={defenceVenue}
                  setDefenceVenue={setDefenceVenue}
                  defenceMessage={defenceMessage}
                  setDefenceMessage={setDefenceMessage}
                  defenceDraftSent={defenceDraftSent}
                  handleSendDefenceInvite={handleSendDefenceInvite}
                />
              )}

              {drawerTab === "review" && (
                <EvaluationReviewTab drawerKind={drawerKind} activeProposal={activeProposal} />
              )}
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
