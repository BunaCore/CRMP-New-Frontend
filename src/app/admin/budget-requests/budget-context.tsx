"use client";

import type React from "react";
import { createContext, useContext, useState } from "react";

import { MOCK_BUDGET_REQUESTS } from "./_data/mock-budget-requests";
import type { BudgetRequest } from "./types";

interface BudgetRequestsContextValue {
  budgetRequests: BudgetRequest[];
  search: string;
  setSearch: React.Dispatch<React.SetStateAction<string>>;
  statusFilter: string;
  setStatusFilter: React.Dispatch<React.SetStateAction<string>>;
  filtered: BudgetRequest[];

  selected: BudgetRequest | null;
  openDrawer: (d: BudgetRequest) => void;
  closeDrawer: () => void;

  // Stamp as Paid dialog
  showPaidDialog: boolean;
  setShowPaidDialog: React.Dispatch<React.SetStateAction<boolean>>;
  transactionId: string;
  setTransactionId: React.Dispatch<React.SetStateAction<string>>;
  adjustedAmount: string;
  setAdjustedAmount: React.Dispatch<React.SetStateAction<string>>;
  handleConfirmPaid: () => void;

  // Return for Correction dialog
  showReturnDialog: boolean;
  setShowReturnDialog: React.Dispatch<React.SetStateAction<boolean>>;
  returnComment: string;
  setReturnComment: React.Dispatch<React.SetStateAction<string>>;
  handleConfirmReturn: () => void;
}

const BudgetRequestsContext = createContext<BudgetRequestsContextValue | undefined>(undefined);

export function BudgetRequestsProvider({ children }: { children: React.ReactNode }) {
  const [budgetRequests, setBudgetRequests] = useState<BudgetRequest[]>(MOCK_BUDGET_REQUESTS);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selected, setSelected] = useState<BudgetRequest | null>(null);

  // Stamp as Paid
  const [showPaidDialog, setShowPaidDialog] = useState(false);
  const [transactionId, setTransactionId] = useState("");
  const [adjustedAmount, setAdjustedAmount] = useState("");

  // Return for Correction
  const [showReturnDialog, setShowReturnDialog] = useState(false);
  const [returnComment, setReturnComment] = useState("");

  const filtered = budgetRequests.filter((d) => {
    const activePhase = d.phases[d.activePhasIndex];
    const matchSearch =
      d.projectTitle.toLowerCase().includes(search.toLowerCase()) ||
      d.pi.toLowerCase().includes(search.toLowerCase()) ||
      d.projectId.toLowerCase().includes(search.toLowerCase());
    const matchStatus =
      statusFilter === "all" || activePhase?.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const openDrawer = (d: BudgetRequest) => {
    setSelected(d);
    setTransactionId("");
    setAdjustedAmount("");
    setReturnComment("");
  };

  const closeDrawer = () => {
    setSelected(null);
    setShowPaidDialog(false);
    setShowReturnDialog(false);
  };

  const handleConfirmPaid = () => {
    if (!selected || !transactionId.trim()) return;
    const approvedAmt = adjustedAmount
      ? parseFloat(adjustedAmount)
      : selected.phases[selected.activePhasIndex].amount;

    setBudgetRequests((prev) =>
      prev.map((d) => {
        if (d.id !== selected.id) return d;
        const updatedPhases = d.phases.map((p, i) => {
          if (i !== d.activePhasIndex) return p;
          return {
            ...p,
            status: "Paid" as const,
            transactionId: transactionId.trim(),
            approvedAmount: approvedAmt,
            actedAt: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
          };
        });
        // Advance to next phase if exists
        const nextActive = d.activePhasIndex + 1 < d.phases.length ? d.activePhasIndex + 1 : d.activePhasIndex;
        return { ...d, phases: updatedPhases, activePhasIndex: nextActive };
      }),
    );

    // Update selected to reflect change
    setSelected((prev) => {
      if (!prev) return null;
      const updatedPhases = prev.phases.map((p, i) => {
        if (i !== prev.activePhasIndex) return p;
        return {
          ...p,
          status: "Paid" as const,
          transactionId: transactionId.trim(),
          approvedAmount: parseFloat(adjustedAmount) || p.amount,
          actedAt: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
        };
      });
      const nextActive = prev.activePhasIndex + 1 < prev.phases.length ? prev.activePhasIndex + 1 : prev.activePhasIndex;
      return { ...prev, phases: updatedPhases, activePhasIndex: nextActive };
    });

    setShowPaidDialog(false);
    setTransactionId("");
    setAdjustedAmount("");
  };

  const handleConfirmReturn = () => {
    if (!selected || returnComment.trim().length < 10) return;

    setBudgetRequests((prev) =>
      prev.map((d) => {
        if (d.id !== selected.id) return d;
        const updatedPhases = d.phases.map((p, i) => {
          if (i !== d.activePhasIndex) return p;
          return {
            ...p,
            status: "Returned" as const,
            financeComment: returnComment.trim(),
            actedAt: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
          };
        });
        return { ...d, phases: updatedPhases };
      }),
    );

    setSelected((prev) => {
      if (!prev) return null;
      const updatedPhases = prev.phases.map((p, i) => {
        if (i !== prev.activePhasIndex) return p;
        return { ...p, status: "Returned" as const, financeComment: returnComment.trim() };
      });
      return { ...prev, phases: updatedPhases };
    });

    setShowReturnDialog(false);
    setReturnComment("");
  };

  return (
    <BudgetRequestsContext.Provider
      value={{
        budgetRequests,
        search,
        setSearch,
        statusFilter,
        setStatusFilter,
        filtered,
        selected,
        openDrawer,
        closeDrawer,
        showPaidDialog,
        setShowPaidDialog,
        transactionId,
        setTransactionId,
        adjustedAmount,
        setAdjustedAmount,
        handleConfirmPaid,
        showReturnDialog,
        setShowReturnDialog,
        returnComment,
        setReturnComment,
        handleConfirmReturn,
      }}
    >
      {children}
    </BudgetRequestsContext.Provider>
  );
}

export function useBudgetRequests() {
  const ctx = useContext(BudgetRequestsContext);
  if (!ctx) throw new Error("useBudgetRequests must be used within BudgetRequestsProvider");
  return ctx;
}
