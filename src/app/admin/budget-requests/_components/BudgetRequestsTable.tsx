"use client";

import { ArrowDown, ArrowUp, ArrowUpDown, ChevronRight, FileWarning } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { cn } from "@/lib/utils";

import { useBudgetRequestsCtx } from "../_context/BudgetRequestsContext";
import { useBudgetRequestDetail } from "../_hooks/useBudgetRequestDetail";
import type { BudgetRequest, BudgetRequestStatus, SortField } from "../types";

function formatETB(n: number) {
  return `ETB ${n.toLocaleString("en-ET")}`;
}

function _formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

const statusConfig: Record<BudgetRequestStatus, { label: string; className: string }> = {
  PENDING: {
    label: "Pending",
    className:
      "border-amber-300 bg-amber-50 text-amber-700 dark:border-amber-800 dark:bg-amber-950/40 dark:text-amber-300",
  },
  RESUBMITTED: {
    label: "Resubmitted",
    className: "border-blue-300 bg-blue-50 text-blue-700 dark:border-blue-800 dark:bg-blue-950/40 dark:text-blue-300",
  },
  PAID: {
    label: "Paid",
    className:
      "border-emerald-300 bg-emerald-50 text-emerald-700 dark:border-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300",
  },
  RETURNED: {
    label: "Returned",
    className: "border-red-300 bg-red-50 text-red-700 dark:border-red-800 dark:bg-red-950/40 dark:text-red-300",
  },
  REJECTED: {
    label: "Rejected",
    className:
      "border-destructive bg-destructive/10 text-destructive dark:border-destructive dark:bg-destructive/20 dark:text-destructive",
  },
};

function SortButton({ field, label }: { field: SortField; label: string }) {
  const { state, dispatch } = useBudgetRequestsCtx();
  const isActive = state.filters.sortField === field;
  const dir = state.filters.sortDir;

  function toggle() {
    if (!isActive) {
      dispatch({ type: "SET_SORT", payload: { field, dir: "asc" } });
    } else {
      dispatch({
        type: "SET_SORT",
        payload: { field, dir: dir === "asc" ? "desc" : "asc" },
      });
    }
  }

  return (
    <button type="button" onClick={toggle} className="flex items-center gap-1 transition-colors hover:text-foreground">
      {label}
      {isActive ? (
        dir === "asc" ? (
          <ArrowUp className="h-3 w-3" />
        ) : (
          <ArrowDown className="h-3 w-3" />
        )
      ) : (
        <ArrowUpDown className="h-3 w-3 opacity-50" />
      )}
    </button>
  );
}

interface BudgetRequestsTableProps {
  isLoading: boolean;
}

export function BudgetRequestsTable({ isLoading }: BudgetRequestsTableProps) {
  const { filteredRequests } = useBudgetRequestsCtx();
  const { openRequest } = useBudgetRequestDetail();

  if (isLoading) {
    return <TableSkeleton />;
  }

  if (filteredRequests.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-20 text-center text-muted-foreground">
        <FileWarning className="h-14 w-14 text-muted-foreground/30" />
        <div>
          <p className="font-semibold text-foreground">No requests found</p>
          <p className="text-sm">No requests match your current filter or search.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-lg border border-border">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/40 hover:bg-muted/40">
            <TableHead className="font-semibold text-muted-foreground text-xs uppercase tracking-wider">
              Project
            </TableHead>
            <TableHead className="font-semibold text-muted-foreground text-xs uppercase tracking-wider">PI</TableHead>
            <TableHead className="font-semibold text-muted-foreground text-xs uppercase tracking-wider">
              Request #
            </TableHead>
            <TableHead className="font-semibold text-muted-foreground text-xs uppercase tracking-wider">
              Items
            </TableHead>
            <TableHead className="text-right font-semibold text-muted-foreground text-xs uppercase tracking-wider">
              <SortButton field="amount" label="Amount" />
            </TableHead>
            <TableHead className="font-semibold text-muted-foreground text-xs uppercase tracking-wider">
              Status
            </TableHead>
            <TableHead className="font-semibold text-muted-foreground text-xs uppercase tracking-wider">
              Clearance
            </TableHead>
            <TableHead className="font-semibold text-muted-foreground text-xs uppercase tracking-wider">
              <SortButton field="daysWaiting" label="Waiting" />
            </TableHead>
            <TableHead className="text-right font-semibold text-muted-foreground text-xs uppercase tracking-wider">
              Action
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredRequests.map((req) => (
            <RequestRow key={req.requestId} request={req} onReview={openRequest} />
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

function RequestRow({ request, onReview }: { request: BudgetRequest; onReview: (id: string) => void }) {
  const config = statusConfig[request.status];
  const isActive = request.status === "PENDING" || request.status === "RESUBMITTED";
  const days = Math.floor((Date.now() - new Date(request.submittedAt).getTime()) / 86_400_000);
  const isOverdue = isActive && days > 7;

  return (
    <TableRow className="transition-colors hover:bg-muted/30">
      {/* Project */}
      <TableCell>
        <div className="flex flex-col gap-0.5">
          <span className="max-w-[200px] truncate font-medium text-sm">{request.projectTitle}</span>
          <Badge
            variant="outline"
            className={cn(
              "w-fit text-[10px]",
              request.projectType === "PG"
                ? "border-violet-300 bg-violet-50 text-violet-700 dark:border-violet-800 dark:bg-violet-950/40 dark:text-violet-300"
                : "border-sky-300 bg-sky-50 text-sky-700 dark:border-sky-800 dark:bg-sky-950/40 dark:text-sky-300",
            )}
          >
            {request.projectType === "PG" ? "PG Research" : "General"}
          </Badge>
        </div>
      </TableCell>

      {/* PI */}
      <TableCell>
        <div className="flex flex-col gap-0.5">
          <span className="font-medium text-sm">{request.piName}</span>
          <span className="max-w-[160px] truncate text-muted-foreground text-xs">{request.piEmail}</span>
        </div>
      </TableCell>

      {/* Request # */}
      <TableCell className="text-muted-foreground text-sm">Disbursement #{request.requestSequence}</TableCell>

      {/* Items */}
      <TableCell>
        <Popover>
          <PopoverTrigger asChild>
            <button type="button" className="text-primary text-sm underline-offset-2 hover:underline">
              {request.items.length} Item{request.items.length !== 1 ? "s" : ""}
            </button>
          </PopoverTrigger>
          <PopoverContent className="w-64 p-3">
            <p className="mb-2 font-semibold text-muted-foreground text-xs uppercase">Budget Items</p>
            <ul className="space-y-1.5">
              {request.items.map((item) => (
                <li key={item.id} className="flex items-center justify-between text-xs">
                  <span className="text-foreground">{item.description}</span>
                  <span className="font-mono text-muted-foreground">ETB {item.amount.toLocaleString("en-ET")}</span>
                </li>
              ))}
            </ul>
          </PopoverContent>
        </Popover>
      </TableCell>

      {/* Amount */}
      <TableCell className="text-right font-mono font-semibold text-sm">{formatETB(request.totalAmount)}</TableCell>

      {/* Status */}
      <TableCell>
        <Badge variant="outline" className={cn("font-medium text-xs", config.className)}>
          {config.label}
        </Badge>
      </TableCell>

      {/* Clearance */}
      <TableCell>
        {request.clearanceRequired ? (
          <Badge
            variant="outline"
            className="border-orange-300 bg-orange-50 text-[10px] text-orange-700 dark:border-orange-800 dark:bg-orange-950/40 dark:text-orange-300"
          >
            Required
          </Badge>
        ) : (
          <span className="text-muted-foreground text-xs">N/A (Initial)</span>
        )}
      </TableCell>

      {/* Days Waiting */}
      <TableCell>
        {isActive ? (
          <span
            className={cn("text-sm", isOverdue ? "font-bold text-red-600 dark:text-red-400" : "text-muted-foreground")}
          >
            {days}d {isOverdue && "⚠️"}
          </span>
        ) : (
          <span className="text-muted-foreground/40 text-xs">—</span>
        )}
      </TableCell>

      {/* Action */}
      <TableCell className="text-right">
        {request.status !== "PAID" ? (
          <Button
            size="sm"
            variant="ghost"
            className="h-7 gap-1 font-medium text-primary text-xs hover:bg-primary/10"
            onClick={() => onReview(request.requestId)}
          >
            Review
            <ChevronRight className="h-3.5 w-3.5" />
          </Button>
        ) : (
          <Button
            size="sm"
            variant="ghost"
            className="h-7 gap-1 text-muted-foreground text-xs"
            onClick={() => onReview(request.requestId)}
          >
            View
            <ChevronRight className="h-3.5 w-3.5" />
          </Button>
        )}
      </TableCell>
    </TableRow>
  );
}

function TableSkeleton() {
  return (
    <div className="overflow-hidden rounded-lg border border-border">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/40 hover:bg-muted/40">
            {["Project", "PI", "Request #", "Items", "Amount", "Status", "Clearance", "Waiting", "Action"].map((h) => (
              <TableHead key={h} className="text-muted-foreground text-xs uppercase tracking-wider">
                {h}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {Array.from({ length: 5 }).map((_, i) => (
            // biome-ignore lint/suspicious/noArrayIndexKey: skeleton items
            <TableRow key={i}>
              <TableCell>
                <div className="space-y-1">
                  <Skeleton className="h-4 w-36" />
                  <Skeleton className="h-4 w-16 rounded-full" />
                </div>
              </TableCell>
              <TableCell>
                <div className="space-y-1">
                  <Skeleton className="h-4 w-28" />
                  <Skeleton className="h-3 w-36" />
                </div>
              </TableCell>
              <TableCell>
                <Skeleton className="h-4 w-24" />
              </TableCell>
              <TableCell>
                <Skeleton className="h-4 w-14" />
              </TableCell>
              <TableCell>
                <Skeleton className="ml-auto h-4 w-20" />
              </TableCell>
              <TableCell>
                <Skeleton className="h-5 w-20 rounded-full" />
              </TableCell>
              <TableCell>
                <Skeleton className="h-5 w-16 rounded-full" />
              </TableCell>
              <TableCell>
                <Skeleton className="h-4 w-8" />
              </TableCell>
              <TableCell>
                <Skeleton className="ml-auto h-7 w-16 rounded-md" />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
