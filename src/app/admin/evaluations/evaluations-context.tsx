"use client";

import type React from "react";
import { createContext, useContext, useEffect, useMemo, useState } from "react";

import { getPendingApprovals } from "@/lib/api/proposals/queries";
import type { PendingApproval } from "@/lib/api/proposals/types";

import { ADVISORS, EVALUATORS } from "../proposals/_data/mock-proposals";
import type { Evaluator } from "../proposals/types";
import { DEMO_RUBRIC } from "./_data/mock-evaluations";
import type { DrawerTab, EvalProjectRow, EvalProposalRow, MainTab, RubricItem } from "./types";

export function rubricTotals(items: RubricItem[]) {
  const earned = items.reduce((s, r) => s + r.score, 0);
  const max = items.reduce((s, r) => s + r.max, 0);
  return { earned, max, pct: max > 0 ? Math.round((earned / max) * 1000) / 10 : 0 };
}

interface EvaluationsContextValue {
  mainTab: MainTab;
  setMainTab: React.Dispatch<React.SetStateAction<MainTab>>;
  search: string;
  setSearch: React.Dispatch<React.SetStateAction<string>>;
  drawerOpen: boolean;
  drawerKind: "proposal" | "project";
  drawerTab: DrawerTab;
  setDrawerTab: React.Dispatch<React.SetStateAction<DrawerTab>>;
  activeProposal: EvalProposalRow | null;
  activeProject: EvalProjectRow | null;

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
  filteredProjects: EvalProjectRow[];

  openDrawerProposal: (row: EvalProposalRow) => void;
  openDrawerProject: (row: EvalProjectRow) => void;
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
  advisorSearch: string;
  setAdvisorSearch: React.Dispatch<React.SetStateAction<string>>;
}

const EvaluationsContext = createContext<EvaluationsContextValue | undefined>(undefined);

export function EvaluationsProvider({ children }: { children: React.ReactNode }) {
  const [mainTab, setMainTab] = useState<MainTab>("proposals");
  const [search, setSearch] = useState("");

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [drawerKind, setDrawerKind] = useState<"proposal" | "project">("proposal");
  const [drawerTab, setDrawerTab] = useState<DrawerTab>("overview");
  const [activeProposal, setActiveProposal] = useState<EvalProposalRow | null>(null);
  const [activeProject, setActiveProject] = useState<EvalProjectRow | null>(null);

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

  const [showAssignAdvisor, setShowAssignAdvisor] = useState(false);
  const [advisorSearch, setAdvisorSearch] = useState("");
  const [pickedAdvisorIds, setPickedAdvisorIds] = useState<string[]>([]);

  const [showTimelineReject, setShowTimelineReject] = useState(false);
  const [timelineRejectComment, setTimelineRejectComment] = useState("");

  const selectionKey =
    drawerKind === "proposal" && activeProposal
      ? `p-${activeProposal.id}`
      : activeProject
        ? `j-${activeProject.id}`
        : "";
  const isEvalApproved = selectionKey ? !!evalApproved[selectionKey] : false;
  const isEvalRejected = selectionKey ? !!evalRejected[selectionKey] : false;

  const totals = useMemo(() => rubricTotals(rubric), [rubric]);

  // ── Real API: proposals table data ───────────────────────────────────────────
  const [apiProposals, setApiProposals] = useState<EvalProposalRow[]>([]);
  const [isLoadingProposals, setIsLoadingProposals] = useState(true);

  useEffect(() => {
    setIsLoadingProposals(true);
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
          budget: "—", // Budget not in PendingApproval — fetched in drawer
        }));
        setApiProposals(mapped);
      })
      .catch(() => {
        // silently fall back to empty; error shown in UI
        setApiProposals([]);
      })
      .finally(() => setIsLoadingProposals(false));
  }, []);

  const filteredProposals = apiProposals.filter((p) =>
    (p.title + p.pi + p.id + p.dept).toLowerCase().includes(search.toLowerCase()),
  );
  // Projects: no dedicated backend endpoint yet — keep empty until connected
  const filteredProjects: EvalProjectRow[] = [];

  const filteredEvals = EVALUATORS.filter((e) =>
    (e.name + e.specialty).toLowerCase().includes(evalSearch.toLowerCase()),
  );

  const filteredAdvisors = ADVISORS.filter((a) =>
    (a.name + a.specialty).toLowerCase().includes(advisorSearch.toLowerCase()),
  );

  function openDrawerProposal(row: EvalProposalRow) {
    setDrawerKind("proposal");
    setActiveProposal(row);
    setActiveProject(null);
    setDrawerTab("overview");
    setRubric(DEMO_RUBRIC.map((r) => ({ ...r })));
    setDefenceDraftSent(false);
    setDrawerOpen(true);
  }

  function openDrawerProject(row: EvalProjectRow) {
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

  function handleSendDefenceInvite() {
    setDefenceDraftSent(true);
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
    setPickedAdvisorIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  };

  const handleAssignConfirm = () => {
    setShowAssign(false);
    setEvalSearch("");
    setPickedEvalIds([]);
  };

  const handleAssignAdvisorConfirm = () => {
    setShowAssignAdvisor(false);
    setAdvisorSearch("");
    setPickedAdvisorIds([]);
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
        search,
        setSearch,
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
        isLoadingProposals,
        filteredProposals,
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
        advisorSearch,
        setAdvisorSearch,
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
