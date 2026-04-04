"use client";

import React, { createContext, useContext, useState, useMemo } from "react";
import { MainTab, DrawerTab, ProjectEvalStatus, RubricItem, EvalProposalRow, EvalProjectRow } from "./types";
import { DEMO_RUBRIC, EVAL_PROPOSALS, EVAL_PROJECTS } from "./_data/mock-evaluations";

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
  showApproveDialog: boolean;
  setShowApproveDialog: React.Dispatch<React.SetStateAction<boolean>>;
  approveNote: string;
  setApproveNote: React.Dispatch<React.SetStateAction<string>>;

  selectionKey: string;
  isEvalApproved: boolean;

  filteredProposals: EvalProposalRow[];
  filteredProjects: EvalProjectRow[];

  openDrawerProposal: (row: EvalProposalRow) => void;
  openDrawerProject: (row: EvalProjectRow) => void;
  closeDrawer: () => void;
  handleSendDefenceInvite: () => void;
  handleConfirmApproveEvaluation: () => void;
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
    "Please confirm attendance or propose an alternative slot within five working days."
  );
  const [defenceDraftSent, setDefenceDraftSent] = useState(false);

  const [evalApproved, setEvalApproved] = useState<Record<string, boolean>>({});
  const [showApproveDialog, setShowApproveDialog] = useState(false);
  const [approveNote, setApproveNote] = useState("");

  const selectionKey = drawerKind === "proposal" && activeProposal ? `p-${activeProposal.id}` : activeProject ? `j-${activeProject.id}` : "";
  const isEvalApproved = selectionKey ? !!evalApproved[selectionKey] : false;

  const totals = useMemo(() => rubricTotals(rubric), [rubric]);

  const filteredProposals = EVAL_PROPOSALS.filter((p) =>
    (p.title + p.pi + p.id + p.dept).toLowerCase().includes(search.toLowerCase())
  );
  const filteredProjects = EVAL_PROJECTS.filter((p) =>
    (p.title + p.lead + p.id + p.dept).toLowerCase().includes(search.toLowerCase())
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

  return (
    <EvaluationsContext.Provider value={{
      mainTab, setMainTab,
      search, setSearch,
      drawerOpen, drawerKind, drawerTab, setDrawerTab,
      activeProposal, activeProject,
      rubric, setRubric, totals,
      defenceDate, setDefenceDate, defenceTime, setDefenceTime,
      defenceVenue, setDefenceVenue, defenceMessage, setDefenceMessage, defenceDraftSent,
      evalApproved, showApproveDialog, setShowApproveDialog, approveNote, setApproveNote,
      selectionKey, isEvalApproved,
      filteredProposals, filteredProjects,
      openDrawerProposal, openDrawerProject, closeDrawer,
      handleSendDefenceInvite, handleConfirmApproveEvaluation
    }}>
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
