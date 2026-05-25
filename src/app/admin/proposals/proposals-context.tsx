"use client";

import type React from "react";
import { createContext, useContext, useState } from "react";

import type { PendingApproval, ProposalListItem } from "@/lib/api/proposals/types";
import { useSearchEvaluators } from "@/lib/api/users/queries";

import { ADVISORS } from "./_data/mock-proposals";
import type { Evaluator } from "./types";

interface ProposalsContextValue {
  tab: string;
  setTab: React.Dispatch<React.SetStateAction<string>>;
  search: string;
  setSearch: React.Dispatch<React.SetStateAction<string>>;
  selected: PendingApproval | ProposalListItem | null;
  setSelected: React.Dispatch<React.SetStateAction<PendingApproval | ProposalListItem | null>>;
  drawerTab: "details" | "team" | "approve" | "budget";
  setDrawerTab: React.Dispatch<React.SetStateAction<"details" | "team" | "approve" | "budget">>;

  showAssign: boolean;
  setShowAssign: React.Dispatch<React.SetStateAction<boolean>>;
  pickedEvalIds: string[];
  setPickedEvalIds: React.Dispatch<React.SetStateAction<string[]>>;

  showAssignAdvisor: boolean;
  setShowAssignAdvisor: React.Dispatch<React.SetStateAction<boolean>>;
  pickedAdvisorIds: string[];
  setPickedAdvisorIds: React.Dispatch<React.SetStateAction<string[]>>;

  showTimelineApprove: boolean;
  setShowTimelineApprove: React.Dispatch<React.SetStateAction<boolean>>;
  timelineApproveNote: string;
  setTimelineApproveNote: React.Dispatch<React.SetStateAction<string>>;

  showTimelineReject: boolean;
  setShowTimelineReject: React.Dispatch<React.SetStateAction<boolean>>;
  timelineRejectComment: string;
  setTimelineRejectComment: React.Dispatch<React.SetStateAction<string>>;

  // Actions
  openDrawer: (p: PendingApproval | ProposalListItem) => void;
  closeDrawer: () => void;
  toggleEvalPick: (id: string) => void;
  toggleAdvisorPick: (id: string) => void;
  handleAssignConfirm: () => void;
  handleAssignAdvisorConfirm: () => void;
  handleTimelineApproveSubmit: () => void;
  handleTimelineRejectSubmit: () => void;
  filteredEvals: Evaluator[];
  filteredAdvisors: Evaluator[];
  evalSearch: string;
  setEvalSearch: React.Dispatch<React.SetStateAction<string>>;
  advisorSearch: string;
  setAdvisorSearch: React.Dispatch<React.SetStateAction<string>>;
}

const ProposalsContext = createContext<ProposalsContextValue | undefined>(undefined);

export function ProposalsProvider({ children }: { children: React.ReactNode }) {
  const [tab, setTab] = useState<string>("all");
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<PendingApproval | ProposalListItem | null>(null);
  const [drawerTab, setDrawerTab] = useState<"details" | "team" | "approve" | "budget">("details");

  const [showAssign, setShowAssign] = useState(false);
  const [evalSearch, setEvalSearch] = useState("");
  const [pickedEvalIds, setPickedEvalIds] = useState<string[]>([]);

  const [showAssignAdvisor, setShowAssignAdvisor] = useState(false);
  const [advisorSearch, setAdvisorSearch] = useState("");
  const [pickedAdvisorIds, setPickedAdvisorIds] = useState<string[]>([]);

  const [showTimelineApprove, setShowTimelineApprove] = useState(false);
  const [timelineApproveNote, setTimelineApproveNote] = useState("");

  const [showTimelineReject, setShowTimelineReject] = useState(false);
  const [timelineRejectComment, setTimelineRejectComment] = useState("");

  const isEvalSearchActive = evalSearch.trim().length > 0;
  const { data: evaluatorOptions = [] } = useSearchEvaluators(evalSearch, isEvalSearchActive);

  const filteredEvals: Evaluator[] = isEvalSearchActive
    ? evaluatorOptions.map((option) => ({
        id: option.value,
        name: option.label,
        avatar: option.label.slice(0, 2).toUpperCase(),
        color: "bg-blue-100 text-blue-700",
        specialty: option.email ? option.email : "Faculty evaluator",
        assigned: 0,
      }))
    : [];

  const filteredAdvisors = ADVISORS.filter((a) =>
    (a.name + a.specialty).toLowerCase().includes(advisorSearch.toLowerCase()),
  );

  const openDrawer = (p: PendingApproval | ProposalListItem) => {
    setSelected(p);
    setDrawerTab("details");
    setPickedEvalIds([]);
    setPickedAdvisorIds([]);
    setTimelineApproveNote("");
    setTimelineRejectComment("");
  };

  const closeDrawer = () => {
    setSelected(null);
    setShowTimelineApprove(false);
    setShowTimelineReject(false);
    setShowAssign(false);
    setShowAssignAdvisor(false);
  };

  const toggleEvalPick = (id: string) => {
    setPickedEvalIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  };

  const toggleAdvisorPick = (id: string) => {
    setPickedAdvisorIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  };

  const handleAssignConfirm = () => {
    if (!selected) return;
    setSelected((s) => (s && s.id === selected.id ? { ...s } : s)); // Keep selection state alive temporarily
    setShowAssign(false);
    setEvalSearch("");
    setPickedEvalIds([]);
  };

  const handleAssignAdvisorConfirm = () => {
    if (!selected) return;
    setSelected((s) => (s && s.id === selected.id ? { ...s } : s));
    setShowAssignAdvisor(false);
    setAdvisorSearch("");
    setPickedAdvisorIds([]);
  };

  const handleTimelineApproveSubmit = () => {
    setShowTimelineApprove(false);
    setTimelineApproveNote("");
  };

  const handleTimelineRejectSubmit = () => {
    setShowTimelineReject(false);
    setTimelineRejectComment("");
  };

  return (
    <ProposalsContext.Provider
      value={{
        tab,
        setTab,
        search,
        setSearch,
        selected,
        setSelected,
        drawerTab,
        setDrawerTab,
        showAssign,
        setShowAssign,
        pickedEvalIds,
        setPickedEvalIds,
        showAssignAdvisor,
        setShowAssignAdvisor,
        pickedAdvisorIds,
        setPickedAdvisorIds,
        showTimelineApprove,
        setShowTimelineApprove,
        timelineApproveNote,
        setTimelineApproveNote,
        showTimelineReject,
        setShowTimelineReject,
        timelineRejectComment,
        setTimelineRejectComment,
        openDrawer,
        closeDrawer,
        toggleEvalPick,
        toggleAdvisorPick,
        handleAssignConfirm,
        handleAssignAdvisorConfirm,
        handleTimelineApproveSubmit,
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
    </ProposalsContext.Provider>
  );
}

export function useProposals() {
  const context = useContext(ProposalsContext);
  if (!context) {
    throw new Error("useProposals must be used within a ProposalsProvider");
  }
  return context;
}
