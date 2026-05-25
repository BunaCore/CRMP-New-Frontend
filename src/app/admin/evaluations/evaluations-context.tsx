"use client";

import type React from "react";
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { hasPermission } from "@/access-control/permission-gates";
import { useDebounce } from "@/hooks/use-debounce";
import { useGetEvaluationProjects } from "@/lib/api/evaluations/queries";
import type { EvaluationItem, EvaluationRubric } from "@/lib/api/evaluations/types";
import { getProjectDetails, useAllProjectsQuery, useScheduleProjectDefence } from "@/lib/api/projects/queries";
import type { ProjectDetails, ProjectListItem } from "@/lib/api/projects/types";
import { assignAdvisor, assignEvaluators } from "@/lib/api/proposals/mutations";
import {
  getAdminProposalDetails,
  getMyProposals,
  getPendingApprovals,
  useProposalsListQuery,
  useScheduleProposalDefence,
} from "@/lib/api/proposals/queries";
import type {
  AdminProposalDetail,
  PendingApproval,
  ProposalListItem,
  ResearcherProposal,
} from "@/lib/api/proposals/types";
import { useSearchAdvisors, useSearchEvaluators } from "@/lib/api/users/queries";
import { useAuthStore } from "@/stores/authStore";

import type { Evaluator } from "../proposals/types";
import { DEMO_RUBRIC } from "./_data/mock-evaluations";
import type { DrawerTab, EvalProposalRow, MainTab, RubricItem } from "./types";

export function rubricTotals(items: RubricItem[]) {
  const earned = items.reduce((s, r) => s + r.score, 0);
  const max = items.reduce((s, r) => s + r.max, 0);
  return {
    earned,
    max,
    pct: max > 0 ? Math.round((earned / max) * 1000) / 10 : 0,
  };
}

interface EvaluationsContextValue {
  mainTab: MainTab;
  setMainTab: React.Dispatch<React.SetStateAction<MainTab>>;
  proposalScope: "assigned" | "all";
  setProposalScope: React.Dispatch<React.SetStateAction<"assigned" | "all">>;
  search: string;
  setSearch: React.Dispatch<React.SetStateAction<string>>;
  yearFilter: string;
  setYearFilter: React.Dispatch<React.SetStateAction<string>>;
  drawerOpen: boolean;
  drawerKind: "proposal" | "project";
  drawerTab: DrawerTab;
  setDrawerTab: React.Dispatch<React.SetStateAction<DrawerTab>>;
  activeProposal: EvalProposalRow | null;
  activeProject: ProjectListItem | null;

  rubric: RubricItem[];
  setRubric: React.Dispatch<React.SetStateAction<RubricItem[]>>;
  totals: { earned: number; max: number; pct: number };

  defenceDate: Date | undefined;
  setDefenceDate: React.Dispatch<React.SetStateAction<Date | undefined>>;
  defenceTime: string;
  setDefenceTime: React.Dispatch<React.SetStateAction<string>>;
  defenceVenue: string;
  setDefenceVenue: React.Dispatch<React.SetStateAction<string>>;
  defenceMessage: string;
  setDefenceMessage: React.Dispatch<React.SetStateAction<string>>;
  defenceDraftSent: boolean;

  evalApproved: Record<string, boolean>;
  evalRejected: Record<string, boolean>;
  showApproveDialog: boolean;
  setShowApproveDialog: React.Dispatch<React.SetStateAction<boolean>>;
  approveNote: string;
  setApproveNote: React.Dispatch<React.SetStateAction<string>>;

  showAssign: boolean;
  setShowAssign: React.Dispatch<React.SetStateAction<boolean>>;
  pickedEvalIds: string[];
  setPickedEvalIds: React.Dispatch<React.SetStateAction<string[]>>;

  showAssignAdvisor: boolean;
  setShowAssignAdvisor: React.Dispatch<React.SetStateAction<boolean>>;
  pickedAdvisorIds: string[];
  setPickedAdvisorIds: React.Dispatch<React.SetStateAction<string[]>>;

  showTimelineReject: boolean;
  setShowTimelineReject: React.Dispatch<React.SetStateAction<boolean>>;
  timelineRejectComment: string;
  setTimelineRejectComment: React.Dispatch<React.SetStateAction<string>>;

  selectionKey: string;
  isEvalApproved: boolean;
  isEvalRejected: boolean;

  isLoadingProposals: boolean;

  filteredProposals: EvalProposalRow[];
  filteredProjects: ProjectListItem[];

  openDrawerProposal: (row: EvalProposalRow) => void;
  openDrawerProject: (row: ProjectListItem) => void;
  closeDrawer: () => void;
  handleSendDefenceInvite: () => void;
  handleConfirmApproveEvaluation: () => void;

  toggleEvalPick: (id: string) => void;
  toggleAdvisorPick: (id: string) => void;
  handleAssignConfirm: () => void;
  handleAssignAdvisorConfirm: () => void;
  handleTimelineRejectSubmit: () => void;

  filteredEvals: Evaluator[];
  filteredAdvisors: Evaluator[];
  evalSearch: string;
  setEvalSearch: React.Dispatch<React.SetStateAction<string>>;
  isAssigningEvaluators: boolean;
  advisorSearch: string;
  setAdvisorSearch: React.Dispatch<React.SetStateAction<string>>;

  // State for new Modals in Projects Tab
  scoreModalOpen: boolean;
  setScoreModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  scheduleModalOpen: boolean;
  setScheduleModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  selectedEvalItem: EvaluationItem | null;
  setSelectedEvalItem: React.Dispatch<React.SetStateAction<EvaluationItem | null>>;
  selectedEvalRubric: EvaluationRubric | null;
  setSelectedEvalRubric: React.Dispatch<React.SetStateAction<EvaluationRubric | null>>;
  apiProjects: EvaluationItem[];
  isSchedulingDefence: boolean;

  // Detailed loading and objects
  proposalDetails: AdminProposalDetail | null;
  projectDetails: ProjectDetails | null;
  isLoadingDetails: boolean;
  refetchDetails: () => Promise<void>;
}

const EvaluationsContext = createContext<EvaluationsContextValue | undefined>(undefined);

export function EvaluationsProvider({ children }: { children: React.ReactNode }) {
  const [mainTab, setMainTab] = useState<MainTab>("proposals");
  const [proposalScope, setProposalScope] = useState<"assigned" | "all">("assigned");
  const [search, setSearch] = useState("");
  const [yearFilter, setYearFilter] = useState("all");

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [drawerKind, setDrawerKind] = useState<"proposal" | "project">("proposal");
  const [drawerTab, setDrawerTab] = useState<DrawerTab>("overview");
  const [activeProposal, setActiveProposal] = useState<EvalProposalRow | null>(null);
  const [activeProject, setActiveProject] = useState<ProjectListItem | null>(null);

  const [rubric, setRubric] = useState<RubricItem[]>(DEMO_RUBRIC);

  const [defenceDate, setDefenceDate] = useState<Date | undefined>(undefined);
  const [defenceTime, setDefenceTime] = useState("09:00");
  const [defenceVenue, setDefenceVenue] = useState("Main campus — Senate Hall");
  const [defenceMessage, setDefenceMessage] = useState(
    "Please confirm attendance or propose an alternative slot within five working days.",
  );
  const [defenceDraftSent, setDefenceDraftSent] = useState(false);

  const [evalApproved, setEvalApproved] = useState<Record<string, boolean>>({});
  const [evalRejected, setEvalRejected] = useState<Record<string, boolean>>({});
  const [showApproveDialog, setShowApproveDialog] = useState(false);
  const [approveNote, setApproveNote] = useState("");

  const [showAssign, setShowAssign] = useState(false);
  const [evalSearch, setEvalSearch] = useState("");
  const [pickedEvalIds, setPickedEvalIds] = useState<string[]>([]);
  const debouncedEvalSearch = useDebounce(evalSearch, 300);

  const [showAssignAdvisor, setShowAssignAdvisor] = useState(false);
  const [advisorSearch, setAdvisorSearch] = useState("");
  const [pickedAdvisorIds, setPickedAdvisorIds] = useState<string[]>([]);
  const debouncedAdvisorSearch = useDebounce(advisorSearch, 300);

  const [showTimelineReject, setShowTimelineReject] = useState(false);
  const [timelineRejectComment, setTimelineRejectComment] = useState("");

  const [scoreModalOpen, setScoreModalOpen] = useState(false);
  const [scheduleModalOpen, setScheduleModalOpen] = useState(false);
  const [selectedEvalItem, setSelectedEvalItem] = useState<EvaluationItem | null>(null);
  const [selectedEvalRubric, setSelectedEvalRubric] = useState<EvaluationRubric | null>(null);

  const scheduleProposalMutation = useScheduleProposalDefence();
  const scheduleProjectMutation = useScheduleProjectDefence();

  const isSchedulingDefence = scheduleProposalMutation.isPending || scheduleProjectMutation.isPending;

  const queryClient = useQueryClient();

  const [proposalDetails, setProposalDetails] = useState<AdminProposalDetail | null>(null);
  const [projectDetails, setProjectDetails] = useState<ProjectDetails | null>(null);
  const [isLoadingDetails, setIsLoadingDetails] = useState(false);

  const activeId = drawerKind === "proposal" ? activeProposal?.id : activeProject?.projectId;

  const refetchDetails = useCallback(async () => {
    if (!activeId) {
      setProposalDetails(null);
      setProjectDetails(null);
      return;
    }
    setIsLoadingDetails(true);
    try {
      if (drawerKind === "proposal") {
        const details = await getAdminProposalDetails(activeId);
        setProposalDetails(details);
      } else {
        const details = await getProjectDetails(activeId);
        setProjectDetails(details);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoadingDetails(false);
    }
  }, [activeId, drawerKind]);

  useEffect(() => {
    refetchDetails();
  }, [refetchDetails]);

  const selectionKey =
    drawerKind === "proposal" && activeProposal
      ? `p-${activeProposal.id}`
      : activeProject
        ? `j-${activeProject.projectId}`
        : "";
  const isEvalApproved = selectionKey ? !!evalApproved[selectionKey] : false;
  const isEvalRejected = selectionKey ? !!evalRejected[selectionKey] : false;

  const totals = useMemo(() => rubricTotals(rubric), [rubric]);

  // ── Determine what the current user can do ────────────────────────────────────
  const { user } = useAuthStore();
  const userPerms = user?.permissions ?? [];
  // Evaluators can score but cannot assign evaluators — they use a different fetch path
  const isEvaluatorOnly =
    hasPermission(userPerms, "EVALUATION_SCORE_SUBMIT") && !hasPermission(userPerms, "EVALUATOR_ASSIGN");

  // ── Real API: proposals table data ───────────────────────────────────────────
  const [apiProposals, setApiProposals] = useState<EvalProposalRow[]>([]);
  const [isLoadingProposals, setIsLoadingProposals] = useState(true);
  const allProposalsQuery = useProposalsListQuery({}, mainTab === "proposals" && proposalScope === "all");

  // ── Real API: projects table data ───────────────────────────────────────────
  const [_isLoadingProjects, setIsLoadingProjects] = useState(true);
  const allProjectsQuery = useAllProjectsQuery({ limit: 200 }, mainTab === "projects");

  const mapAllProposalRow = useCallback((proposal: ProposalListItem): EvalProposalRow => {
    return {
      id: proposal.id,
      title: proposal.title,
      pi: proposal.pi.name,
      piAvatar: proposal.pi.name.slice(0, 2).toUpperCase(),
      piColor: "bg-indigo-100 text-indigo-700",
      dept: proposal.department?.name || "N/A",
      stage: proposal.status.replace(/_/g, " "),
      budget: `ETB ${proposal.budget?.toLocaleString() || 0}`,
      program: proposal.program || "—",
      teamCount: proposal.teamCount || 0,
      year: proposal.submittedDate
        ? new Date(proposal.submittedDate).getFullYear().toString()
        : new Date().getFullYear().toString(),
      evaluators: proposal.evaluators?.map((e) => e.name) || [],
      advisors: proposal.advisors?.map((a) => a.name) || [],
    };
  }, []);

  const mapMyProposalRow = useCallback((proposal: ResearcherProposal): EvalProposalRow => {
    return {
      id: proposal.id,
      title: proposal.title,
      pi: proposal.pi.name,
      piAvatar: proposal.pi.name.slice(0, 2).toUpperCase(),
      piColor: "bg-indigo-100 text-indigo-700",
      dept: proposal.department?.name || "N/A",
      stage: proposal.status.replace(/_/g, " "),
      budget: "—",
      program: proposal.type || "—",
      teamCount: proposal.team?.length ?? 0,
      year: proposal.createdAt
        ? new Date(proposal.createdAt).getFullYear().toString()
        : new Date().getFullYear().toString(),
      evaluators: proposal.evaluators?.map((e) => e.name) || [],
      advisors: proposal.advisors?.map((a) => a.name) || [],
    };
  }, []);

  useEffect(() => {
    setIsLoadingProposals(true);

    if (isEvaluatorOnly) {
      // Evaluator: fetch proposals they're assigned to from /proposals/detail
      getMyProposals()
        .then((data: ResearcherProposal[]) => {
          const mapped: EvalProposalRow[] = data.map(mapMyProposalRow);
          setApiProposals(mapped);
        })
        .catch(() => {
          setApiProposals([]);
        })
        .finally(() => setIsLoadingProposals(false));
    } else {
      // Admin / coordinator: use pending-approvals workflow endpoint
      getPendingApprovals()
        .then((data: PendingApproval[]) => {
          const mapped: EvalProposalRow[] = data.map((p) => ({
            id: p.id,
            title: p.title,
            pi: p.createdByName,
            piAvatar: p.createdByName.slice(0, 2).toUpperCase(),
            piColor: "bg-indigo-100 text-indigo-700",
            dept: p.currentApproverRole,
            stage: p.stepLabel,
            budget: "—",
            program: p.proposalProgram || "—",
            teamCount: 0,
            year: p.submittedAt
              ? new Date(p.submittedAt).getFullYear().toString()
              : new Date().getFullYear().toString(),
            evaluators: p.evaluatorAssigned ? ["Assigned"] : [],
            advisors: p.advisorAssigned ? ["Assigned"] : [],
          }));
          setApiProposals(mapped);
        })
        .catch(() => {
          setApiProposals([]);
        })
        .finally(() => setIsLoadingProposals(false));
    }
  }, [isEvaluatorOnly, mapMyProposalRow]);

  const filteredProposals = apiProposals.filter(
    (p) =>
      (p.title + p.pi + p.id + p.dept).toLowerCase().includes(search.toLowerCase()) &&
      (yearFilter === "all" || p.year === yearFilter),
  );
  const allProposalRows = useMemo(
    () =>
      (allProposalsQuery.data ?? [])
        .map(mapAllProposalRow)
        .filter((p) => (p.title + p.pi + p.id + p.dept + p.stage).toLowerCase().includes(search.toLowerCase()))
        .filter((p) => yearFilter === "all" || p.year === yearFilter),
    [allProposalsQuery.data, search, yearFilter, mapAllProposalRow],
  );
  const visibleProposals = proposalScope === "all" ? allProposalRows : filteredProposals;
  const loadingVisibleProposals = proposalScope === "all" ? allProposalsQuery.isLoading : isLoadingProposals;

  const { data: projectsData } = useGetEvaluationProjects(1, 100);
  const apiProjects = projectsData?.items || [];

  const filteredProjects = useMemo(
    () =>
      (allProjectsQuery.data?.items ?? [])
        .filter((project) =>
          (
            project.projectTitle +
            project.projectId +
            project.projectProgram +
            project.projectDescription +
            (project.pi?.fullName ?? "")
          )
            .toLowerCase()
            .includes(search.toLowerCase()),
        )
        .filter((project) => {
          if (yearFilter === "all") return true;
          const projectYear = new Date(project.createdAt).getFullYear().toString();
          return projectYear === yearFilter;
        }),
    [allProjectsQuery.data?.items, search, yearFilter],
  );

  useEffect(() => {
    setIsLoadingProjects(allProjectsQuery.isLoading);
  }, [allProjectsQuery.isLoading]);

  const evalUsersQuery = useSearchEvaluators(debouncedEvalSearch, showAssign);

  const filteredEvals = useMemo<Evaluator[]>(() => {
    const users = evalUsersQuery.data ?? [];
    return users.map((u, idx) => {
      const id = u.id || u.value;
      const name = u.name || u.label || "Unknown user";
      const initials =
        name
          .split(" ")
          .filter(Boolean)
          .slice(0, 2)
          .map((part) => part[0]?.toUpperCase() ?? "")
          .join("") || "US";

      const palette = [
        "bg-blue-100 text-blue-700",
        "bg-indigo-100 text-indigo-700",
        "bg-emerald-100 text-emerald-700",
        "bg-violet-100 text-violet-700",
      ];

      return {
        id,
        name,
        avatar: initials,
        color: palette[idx % palette.length],
        specialty: u.email || "Evaluator",
        assigned: 0,
      };
    });
  }, [evalUsersQuery.data]);

  const { mutate: assignEvaluatorsMutate, isPending: isAssigningEvaluators } = useMutation({
    mutationFn: ({ proposalId, userIds }: { proposalId: string; userIds: string[] }) =>
      assignEvaluators(proposalId, userIds),
    onSuccess: (_, variables) => {
      toast.success("Evaluators assigned successfully");
      setShowAssign(false);
      setEvalSearch("");
      setPickedEvalIds([]);
      refetchDetails();
      queryClient.invalidateQueries({
        queryKey: ["proposals", "byId", variables.proposalId],
      });
      queryClient.invalidateQueries({
        queryKey: ["proposals", "pending-approvals"],
      });
      queryClient.invalidateQueries({ queryKey: ["proposals", "list"] });
    },
    onError: () => {
      toast.error("Failed to assign evaluators");
    },
  });

  const advisorUsersQuery = useSearchAdvisors(debouncedAdvisorSearch, showAssignAdvisor);

  const filteredAdvisors = useMemo<Evaluator[]>(() => {
    const users = advisorUsersQuery.data ?? [];
    return users.map((u, idx) => {
      const id = u.id || u.value;
      const name = u.name || u.label || "Unknown user";
      const initials =
        name
          .split(" ")
          .filter(Boolean)
          .slice(0, 2)
          .map((part) => part[0]?.toUpperCase() ?? "")
          .join("") || "US";

      const palette = [
        "bg-violet-100 text-violet-700",
        "bg-indigo-100 text-indigo-700",
        "bg-emerald-100 text-emerald-700",
        "bg-blue-100 text-blue-700",
      ];

      return {
        id,
        name,
        avatar: initials,
        color: palette[idx % palette.length],
        specialty: u.email || "Advisor",
        assigned: 0,
      };
    });
  }, [advisorUsersQuery.data]);

  function openDrawerProposal(row: EvalProposalRow) {
    setDrawerKind("proposal");
    setActiveProposal(row);
    setActiveProject(null);
    setDrawerTab("overview");
    setRubric(DEMO_RUBRIC.map((r) => ({ ...r })));
    setDefenceDraftSent(false);
    setDrawerOpen(true);
  }

  function openDrawerProject(row: ProjectListItem) {
    setDrawerKind("project");
    setActiveProject(row);
    setActiveProposal(null);
    setDrawerTab("overview");
    setRubric(DEMO_RUBRIC.map((r) => ({ ...r })));
    setDefenceDraftSent(false);
    setDrawerOpen(true);
  }

  function closeDrawer() {
    setDrawerOpen(false);
    setShowApproveDialog(false);
    setApproveNote("");
  }

  async function handleSendDefenceInvite() {
    if (!defenceDate) return;

    const payload = {
      defenceDate: new Date(defenceDate).toISOString(),
      location: defenceVenue || "TBD",
      note: defenceMessage,
    };

    try {
      if (drawerKind === "proposal" && activeProposal?.id) {
        await scheduleProposalMutation.mutateAsync({
          proposalId: activeProposal.id,
          payload,
        });
        toast.success("Defence scheduled for proposal successfully");
      } else if (drawerKind === "project" && activeProject?.projectId) {
        await scheduleProjectMutation.mutateAsync({
          projectId: activeProject.projectId,
          payload,
        });
        toast.success("Defence scheduled for project successfully");
      }
      setDefenceDraftSent(true);
      // biome-ignore lint/suspicious/noExplicitAny: error object
    } catch (error: any) {
      toast.error(error?.response?.data?.message ?? "Failed to schedule defence");
    }
  }

  function handleConfirmApproveEvaluation() {
    if (!selectionKey) return;
    setEvalApproved((prev) => ({ ...prev, [selectionKey]: true }));
    setShowApproveDialog(false);
    setApproveNote("");
  }

  const toggleEvalPick = (id: string) => {
    setPickedEvalIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  };

  const toggleAdvisorPick = (id: string) => {
    setPickedAdvisorIds((prev) => (prev[0] === id ? [] : [id]));
  };

  const handleAssignConfirm = () => {
    if (!activeProposal?.id || pickedEvalIds.length === 0) return;
    assignEvaluatorsMutate({
      proposalId: activeProposal.id,
      userIds: pickedEvalIds,
    });
  };

  const { mutate: assignAdvisorMutate } = useMutation({
    mutationFn: ({ proposalId, userId }: { proposalId: string; userId: string }) => assignAdvisor(proposalId, userId),
    onSuccess: (_, variables) => {
      toast.success("Advisor assigned successfully");
      setShowAssignAdvisor(false);
      setAdvisorSearch("");
      setPickedAdvisorIds([]);
      refetchDetails();
      queryClient.invalidateQueries({
        queryKey: ["proposals", "byId", variables.proposalId],
      });
      queryClient.invalidateQueries({
        queryKey: ["proposals", "pending-approvals"],
      });
      queryClient.invalidateQueries({ queryKey: ["proposals", "list"] });
      if (drawerKind === "project") {
        queryClient.invalidateQueries({ queryKey: ["projects"] });
      }
    },
    onError: () => {
      toast.error("Failed to assign advisor");
    },
  });

  const handleAssignAdvisorConfirm = () => {
    const targetProposalId = drawerKind === "proposal" ? activeProposal?.id : projectDetails?.proposalId;
    if (!targetProposalId || pickedAdvisorIds.length === 0) {
      toast.error("No proposal ID found for assigning advisor");
      return;
    }
    assignAdvisorMutate({
      proposalId: targetProposalId,
      userId: pickedAdvisorIds[0],
    });
  };

  const handleTimelineRejectSubmit = () => {
    if (selectionKey) {
      setEvalRejected((prev) => ({ ...prev, [selectionKey]: true }));
      setEvalApproved((prev) => ({ ...prev, [selectionKey]: false }));
    }
    setShowTimelineReject(false);
    setTimelineRejectComment("");
  };

  return (
    <EvaluationsContext.Provider
      value={{
        mainTab,
        setMainTab,
        proposalScope,
        setProposalScope,
        search,
        setSearch,
        yearFilter,
        setYearFilter,
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
        evalApproved,
        evalRejected,
        showApproveDialog,
        setShowApproveDialog,
        approveNote,
        setApproveNote,
        selectionKey,
        isEvalApproved,
        isEvalRejected,
        isLoadingProposals: loadingVisibleProposals,
        filteredProposals: visibleProposals,
        filteredProjects,
        openDrawerProposal,
        openDrawerProject,
        closeDrawer,
        handleSendDefenceInvite,
        handleConfirmApproveEvaluation,

        showAssign,
        setShowAssign,
        pickedEvalIds,
        setPickedEvalIds,
        showAssignAdvisor,
        setShowAssignAdvisor,
        pickedAdvisorIds,
        setPickedAdvisorIds,
        showTimelineReject,
        setShowTimelineReject,
        timelineRejectComment,
        setTimelineRejectComment,
        toggleEvalPick,
        toggleAdvisorPick,
        handleAssignConfirm,
        handleAssignAdvisorConfirm,
        handleTimelineRejectSubmit,
        filteredEvals,
        filteredAdvisors,
        evalSearch,
        setEvalSearch,
        isAssigningEvaluators,
        advisorSearch,
        setAdvisorSearch,
        scoreModalOpen,
        setScoreModalOpen,
        scheduleModalOpen,
        setScheduleModalOpen,
        selectedEvalItem,
        setSelectedEvalItem,
        selectedEvalRubric,
        setSelectedEvalRubric,
        apiProjects,
        isSchedulingDefence,
        proposalDetails,
        projectDetails,
        isLoadingDetails,
        refetchDetails,
      }}
    >
      {children}
    </EvaluationsContext.Provider>
  );
}

export function useEvaluations() {
  const context = useContext(EvaluationsContext);
  if (!context) {
    throw new Error("useEvaluations must be used within an EvaluationsProvider");
  }
  return context;
}
