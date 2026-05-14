"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { Download, Search } from "lucide-react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { apiClient } from "@/lib/api/client";

import { useBudgetRequestsCtx } from "../_context/BudgetRequestsContext";
import type { BudgetRequestStatus } from "../types";

const TAB_OPTIONS: { value: "ALL" | BudgetRequestStatus; label: string }[] = [
  { value: "ALL", label: "All" },
  { value: "PENDING", label: "Pending" },
  { value: "RESUBMITTED", label: "Resubmitted" },
  { value: "PAID", label: "Paid" },
  { value: "RETURNED", label: "Returned" },
];

export function ControlsRow() {
  const { state, dispatch, statusCounts } = useBudgetRequestsCtx();
  const [searchValue, setSearchValue] = useState("");
  const [isExporting, setIsExporting] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleSearchChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const val = e.target.value;
      setSearchValue(val);
      if (debounceRef.current) clearTimeout(debounceRef.current);
      debounceRef.current = setTimeout(() => {
        dispatch({ type: "SET_SEARCH", payload: val });
      }, 300);
    },
    [dispatch],
  );

  useEffect(
    () => () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    },
    [],
  );

  async function handleExport() {
    setIsExporting(true);
    try {
      const response = await apiClient.get("/budget/admin/export?format=csv", {
        responseType: "blob",
      });
      const url = URL.createObjectURL(new Blob([response.data]));
      const a = document.createElement("a");
      a.href = url;
      a.download = `budget-ledger-${new Date().toISOString().slice(0, 10)}.csv`;
      a.click();
      URL.revokeObjectURL(url);
      toast.success("Ledger exported successfully.");
    } catch {
      toast.error("Failed to export ledger.");
    } finally {
      setIsExporting(false);
    }
  }

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      {/* Status Tabs */}
      <Tabs
        value={state.filters.status}
        onValueChange={(v) => dispatch({ type: "SET_STATUS_FILTER", payload: v as "ALL" | BudgetRequestStatus })}
      >
        <TabsList className="h-9 gap-0.5">
          {TAB_OPTIONS.map((tab) => (
            <TabsTrigger key={tab.value} value={tab.value} className="gap-1.5 px-3 text-xs">
              {tab.label}
              {statusCounts[tab.value] > 0 && (
                <Badge variant="secondary" className="h-4.5 min-w-[1.25rem] rounded-full px-1 font-bold text-[10px]">
                  {statusCounts[tab.value]}
                </Badge>
              )}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      {/* Search + Export */}
      <div className="flex items-center gap-2">
        <div className="relative">
          <Search className="-translate-y-1/2 absolute top-1/2 left-2.5 h-3.5 w-3.5 text-muted-foreground" />
          <Input
            id="budget-search"
            placeholder="Search project, PI, or request ID…"
            value={searchValue}
            onChange={handleSearchChange}
            className="h-9 w-72 pl-8 text-sm"
          />
        </div>
        <Button variant="outline" size="sm" className="h-9 gap-1.5" onClick={handleExport} disabled={isExporting}>
          {isExporting ? (
            <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-current border-t-transparent" />
          ) : (
            <Download className="h-3.5 w-3.5" />
          )}
          Export Ledger
        </Button>
      </div>
    </div>
  );
}
