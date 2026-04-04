"use client";

import React, { createContext, useContext, useState } from "react";
import { Proposal, Evaluator } from "./types";
import { PROPOSALS_INITIAL, EVALUATORS, ADVISORS } from "./_data/mock-proposals";

interface ProposalsContextValue {
  proposals: Proposal[];
  setProposals: React.Dispatch<React.SetStateAction<Proposal[]>>;
  tab: string;
  setTab: React.Dispatch<React.SetStateAction<string>>;
  search: string;
  setSearch: React.Dispatch<React.SetStateAction<string>>;
  selected: Proposal | null;
  setSelected: React.Dispatch<React.SetStateAction<Proposal | null>>;
  drawerTab: "details" | "team" | "approve";
  setDrawerTab: React.Dispatch<React.SetStateAction<"details" | "team" | "approve">>;

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
  openDrawer: (p: Proposal) => void;
  closeDrawer: () => void;
  toggleEvalPick: (id: string) => void;
  toggleAdvisorPick: (id: string) => void;
  handleAssignConfirm: () => void;
  handleAssignAdvisorConfirm: () => void;
  handleTimelineApproveSubmit: () => void;
  handleTimelineRejectSubmit: () => void;
  filtered: Proposal[];
  filteredEvals: Evaluator[];
  filteredAdvisors: Evaluator[];
  evalSearch: string;
  setEvalSearch: React.Dispatch<React.SetStateAction<string>>;
  advisorSearch: string;
  setAdvisorSearch: React.Dispatch<React.SetStateAction<string>>;
}

const ProposalsContext = createContext<ProposalsContextValue | undefined>(undefined);

export function ProposalsProvider({ children }: { children: React.ReactNode }) {
  const [proposals, setProposals] = useState<Proposal[]>(PROPOSALS_INITIAL);
  const [tab, setTab] = useState<string>("all");
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<Proposal | null>(null);
  const [drawerTab, setDrawerTab] = useState<"details" | "team" | "approve">("details");

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

  const filtered = proposals.filter(p => {
    const matchTab = tab === "all" || p.status === tab;
    const matchSearch = p.title.toLowerCase().includes(search.toLowerCase()) ||
                        p.pi.toLowerCase().includes(search.toLowerCase()) ||
                        p.id.toLowerCase().includes(search.toLowerCase());
    return matchTab && matchSearch;
  });

  const filteredEvals = EVALUATORS.filter(e =>
    (e.name + e.specialty).toLowerCase().includes(evalSearch.toLowerCase())
  );

  const filteredAdvisors = ADVISORS.filter(a =>
    (a.name + a.specialty).toLowerCase().includes(advisorSearch.toLowerCase())
  );

  const openDrawer = (p: Proposal) => {
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
    setPickedEvalIds(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  const toggleAdvisorPick = (id: string) => {
    setPickedAdvisorIds(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  const handleAssignConfirm = () => {
    if (!selected) return;
    const names = pickedEvalIds.map(id => EVALUATORS.find(e => e.id === id)?.name).filter(Boolean) as string[];
    setProposals(prev => prev.map(p => p.id === selected.id ? { ...p, evaluators: names } : p));
    setSelected(s => s && s.id === selected.id ? { ...s, evaluators: names } : s);
    setShowAssign(false);
    setEvalSearch("");
    setPickedEvalIds([]);
  };

  const handleAssignAdvisorConfirm = () => {
    if (!selected) return;
    const names = pickedAdvisorIds.map(id => ADVISORS.find(a => a.id === id)?.name).filter(Boolean) as string[];
    setProposals(prev => prev.map(p => p.id === selected.id ? { ...p, advisors: names } : p));
    setSelected(s => s && s.id === selected.id ? { ...s, advisors: names } : s);
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
    <ProposalsContext.Provider value={{
      proposals, setProposals,
      tab, setTab,
      search, setSearch,
      selected, setSelected,
      drawerTab, setDrawerTab,
      showAssign, setShowAssign,
      pickedEvalIds, setPickedEvalIds,
      showAssignAdvisor, setShowAssignAdvisor,
      pickedAdvisorIds, setPickedAdvisorIds,
      showTimelineApprove, setShowTimelineApprove,
      timelineApproveNote, setTimelineApproveNote,
      showTimelineReject, setShowTimelineReject,
      timelineRejectComment, setTimelineRejectComment,
      openDrawer, closeDrawer,
      toggleEvalPick, toggleAdvisorPick,
      handleAssignConfirm, handleAssignAdvisorConfirm,
      handleTimelineApproveSubmit, handleTimelineRejectSubmit,
      filtered, filteredEvals, filteredAdvisors,
      evalSearch, setEvalSearch,
      advisorSearch, setAdvisorSearch
    }}>
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
