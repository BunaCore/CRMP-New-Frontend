"use client";

import type React from "react";
import { createContext, useCallback, useContext, useReducer } from "react";

import type {
  BudgetFilters,
  BudgetRequest,
  BudgetRequestDetail,
  BudgetRequestStatus,
  SortDir,
  SortField,
} from "../types";

// ─── State ──────────────────────────────────────────────────
interface State {
  requests: BudgetRequest[];
  activeRequest: BudgetRequestDetail | null;
  drawerOpen: boolean;
  approveModalOpen: boolean;
  returnModalOpen: boolean;
  rejectModalOpen: boolean;
  filters: BudgetFilters;
  lastRefetchAt: number;
}

const initialState: State = {
  requests: [],
  activeRequest: null,
  drawerOpen: false,
  approveModalOpen: false,
  returnModalOpen: false,
  rejectModalOpen: false,
  filters: {
    status: "ALL",
    search: "",
    sortField: null,
    sortDir: "asc",
  },
  lastRefetchAt: 0,
};

// ─── Actions ────────────────────────────────────────────────
type Action =
  | { type: "SET_REQUESTS"; payload: BudgetRequest[] }
  | { type: "SET_ACTIVE_REQUEST"; payload: BudgetRequestDetail | null }
  | { type: "SET_DRAWER_OPEN"; payload: boolean }
  | { type: "SET_APPROVE_MODAL"; payload: boolean }
  | { type: "SET_RETURN_MODAL"; payload: boolean }
  | { type: "SET_REJECT_MODAL"; payload: boolean }
  | { type: "SET_STATUS_FILTER"; payload: "ALL" | BudgetRequestStatus }
  | { type: "SET_SEARCH"; payload: string }
  | { type: "SET_SORT"; payload: { field: SortField; dir: SortDir } }
  | { type: "TRIGGER_REFETCH" };

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "SET_REQUESTS":
      return { ...state, requests: action.payload };
    case "SET_ACTIVE_REQUEST":
      return { ...state, activeRequest: action.payload };
    case "SET_DRAWER_OPEN":
      return { ...state, drawerOpen: action.payload };
    case "SET_APPROVE_MODAL":
      return { ...state, approveModalOpen: action.payload };
    case "SET_RETURN_MODAL":
      return { ...state, returnModalOpen: action.payload };
    case "SET_REJECT_MODAL":
      return { ...state, rejectModalOpen: action.payload };
    case "SET_STATUS_FILTER":
      return { ...state, filters: { ...state.filters, status: action.payload } };
    case "SET_SEARCH":
      return { ...state, filters: { ...state.filters, search: action.payload } };
    case "SET_SORT":
      return {
        ...state,
        filters: {
          ...state.filters,
          sortField: action.payload.field,
          sortDir: action.payload.dir,
        },
      };
    case "TRIGGER_REFETCH":
      return { ...state, lastRefetchAt: Date.now() };
    default:
      return state;
  }
}

// ─── Context ────────────────────────────────────────────────
interface ContextValue {
  state: State;
  dispatch: React.Dispatch<Action>;
  // Derived
  filteredRequests: BudgetRequest[];
  statusCounts: Record<string, number>;
}

const BudgetRequestsContext = createContext<ContextValue | undefined>(undefined);

// ─── Provider ───────────────────────────────────────────────
export function BudgetRequestsProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  const filteredRequests = useCallback((): BudgetRequest[] => {
    let rows = state.requests;

    // Text search
    if (state.filters.search.trim()) {
      const q = state.filters.search.toLowerCase();
      rows = rows.filter(
        (r) =>
          r.projectTitle.toLowerCase().includes(q) ||
          r.piName.toLowerCase().includes(q) ||
          r.requestId.toLowerCase().includes(q),
      );
    }

    // Client-side sort
    if (state.filters.sortField) {
      rows = [...rows].sort((a, b) => {
        let aVal = 0;
        let bVal = 0;
        if (state.filters.sortField === "amount") {
          aVal = a.totalAmount;
          bVal = b.totalAmount;
        } else if (state.filters.sortField === "daysWaiting") {
          aVal = Math.floor((Date.now() - new Date(a.submittedAt).getTime()) / 86_400_000);
          bVal = Math.floor((Date.now() - new Date(b.submittedAt).getTime()) / 86_400_000);
        }
        return state.filters.sortDir === "asc" ? aVal - bVal : bVal - aVal;
      });

      // On Pending tab, overdue requests float to top
      if (state.filters.status === "PENDING") {
        rows = [
          ...rows.filter((r) => {
            const d = Math.floor((Date.now() - new Date(r.submittedAt).getTime()) / 86_400_000);
            return d > 7;
          }),
          ...rows.filter((r) => {
            const d = Math.floor((Date.now() - new Date(r.submittedAt).getTime()) / 86_400_000);
            return d <= 7;
          }),
        ];
      }
    }

    return rows;
  }, [state.requests, state.filters])();

  const statusCounts = state.requests.reduce<Record<string, number>>(
    (acc, r) => {
      acc[r.status] = (acc[r.status] ?? 0) + 1;
      acc.ALL = (acc.ALL ?? 0) + 1;
      return acc;
    },
    { ALL: 0, PENDING: 0, RESUBMITTED: 0, PAID: 0, RETURNED: 0 },
  );

  return (
    <BudgetRequestsContext.Provider value={{ state, dispatch, filteredRequests, statusCounts }}>
      {children}
    </BudgetRequestsContext.Provider>
  );
}

// ─── Hook ───────────────────────────────────────────────────
export function useBudgetRequestsCtx() {
  const ctx = useContext(BudgetRequestsContext);
  if (!ctx) throw new Error("useBudgetRequestsCtx must be used within BudgetRequestsProvider");
  return ctx;
}
