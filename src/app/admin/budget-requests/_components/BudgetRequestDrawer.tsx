"use client";

import { AlertCircle, CheckCircle2, Info, Landmark, Mail, Phone, Undo2, XCircle } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Sheet, SheetContent, SheetFooter } from "@/components/ui/sheet";
import { Skeleton } from "@/components/ui/skeleton";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/stores/authStore";

import { useBudgetRequestsCtx } from "../_context/BudgetRequestsContext";
import { useBudgetRequestDetail } from "../_hooks/useBudgetRequestDetail";
import { ClearanceViewer } from "./ClearanceViewer";
import { DisbursementTimeline } from "./DisbursementTimeline";
import { SegmentedProgressBar } from "./ProgressBar";

function formatETB(n: number) {
  return `ETB ${n.toLocaleString("en-ET")}`;
}

const statusConfig: Record<string, { label: string; className: string }> = {
  PENDING: { label: "Pending Review", className: "border-amber-300 bg-amber-50 text-amber-700" },
  RESUBMITTED: { label: "Resubmitted", className: "border-blue-300 bg-blue-50 text-blue-700" },
  PAID: { label: "Paid", className: "border-emerald-300 bg-emerald-50 text-emerald-700" },
  RETURNED: { label: "Returned", className: "border-red-300 bg-red-50 text-red-700" },
  REJECTED: { label: "Rejected", className: "border-destructive bg-destructive/10 text-destructive" },
};

export function BudgetRequestDrawer() {
  const { state, dispatch } = useBudgetRequestsCtx();
  const { isLoading, closeDrawer } = useBudgetRequestDetail();
  const { user } = useAuthStore();

  const request = state.activeRequest;
  const canApprove = user?.permissions?.includes("BUDGET_APPROVE");
  const canReject = user?.permissions?.includes("BUDGET_REJECT");
  const isPending = request?.status === "PENDING" || request?.status === "RESUBMITTED";
  const missingClearance = request?.clearanceRequired && !request?.clearanceDocumentUrl;

  return (
    <Sheet open={state.drawerOpen} onOpenChange={(open) => !open && closeDrawer()}>
      <SheetContent className="flex w-full flex-col p-0 sm:max-w-xl">
        <div className="min-h-0 flex-1 overflow-y-auto">
          <div className="space-y-8 p-6">
            {isLoading ? (
              <DrawerSkeleton />
            ) : request ? (
              <>
                {/* Zone A — Context Header */}
                <div className="space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <h2 className="font-bold text-2xl tracking-tight">{request.projectTitle}</h2>
                      <div className="flex items-center gap-2 text-muted-foreground text-sm">
                        <span className="font-semibold text-foreground">PI: {request.piName}</span>
                        <span>•</span>
                        <span>
                          Disbursement #{request.requestSequence} of {request.totalPhases} Phases
                        </span>
                      </div>
                    </div>
                    <Badge
                      variant="outline"
                      className={cn("shrink-0 font-medium text-xs", statusConfig[request.status]?.className)}
                    >
                      {statusConfig[request.status]?.label}
                    </Badge>
                  </div>

                  <div className="grid grid-cols-2 gap-4 rounded-lg border border-border bg-muted/20 p-3">
                    <div className="flex items-center gap-2 text-xs">
                      <Mail className="h-3.5 w-3.5 text-muted-foreground" />
                      <span className="truncate">{request.piEmail}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs">
                      <Phone className="h-3.5 w-3.5 text-muted-foreground" />
                      <span>{request.piPhone}</span>
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Zone B — Budget Progress Bar */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-muted-foreground text-sm uppercase tracking-wider">
                    Budget Utilization
                  </h3>
                  <SegmentedProgressBar summary={request.projectBudgetSummary} />
                </div>

                <Separator />

                {/* Zone C — Disbursement Timeline */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-muted-foreground text-sm uppercase tracking-wider">
                    Payment Timeline
                  </h3>
                  <DisbursementTimeline
                    timeline={request.disbursementTimeline}
                    currentSequence={request.requestSequence}
                  />
                </div>

                <Separator />

                {/* Zone D — Line Items */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-muted-foreground text-sm uppercase tracking-wider">
                    Requested Items
                  </h3>
                  <div className="overflow-hidden rounded-lg border border-border">
                    <table className="w-full text-sm">
                      <thead className="bg-muted/40 font-medium text-muted-foreground text-xs">
                        <tr>
                          <th className="px-3 py-2 text-left">Item Name</th>
                          <th className="px-3 py-2 text-left">Category</th>
                          <th className="px-3 py-2 text-right">Amount</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border">
                        {request.items.map((item) => (
                          <tr key={item.id}>
                            <td className="px-3 py-2 font-medium">{item.description}</td>
                            <td className="px-3 py-2 text-muted-foreground">{item.category}</td>
                            <td className="px-3 py-2 text-right font-mono">{formatETB(item.amount)}</td>
                          </tr>
                        ))}
                      </tbody>
                      <tfoot className="bg-muted/20 font-bold">
                        <tr>
                          <td colSpan={2} className="px-3 py-2 text-right">
                            Total Requested
                          </td>
                          <td className="px-3 py-2 text-right font-mono text-primary">
                            {formatETB(request.totalAmount)}
                          </td>
                        </tr>
                      </tfoot>
                    </table>
                  </div>
                </div>

                <Separator />

                {/* Zone E — Clearance Document Viewer */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-muted-foreground text-sm uppercase tracking-wider">
                    Clearance Document
                  </h3>
                  {request.clearanceRequired ? (
                    <ClearanceViewer
                      clearanceDocumentUrl={request.clearanceDocumentUrl}
                      clearanceDocumentName={request.clearanceDocumentName}
                    />
                  ) : (
                    <div className="flex items-center gap-3 rounded-lg border border-emerald-200 bg-emerald-50 p-4 dark:border-emerald-800 dark:bg-emerald-950/20">
                      <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-600" />
                      <div>
                        <p className="font-semibold text-emerald-800 text-sm dark:text-emerald-300">
                          No Clearance Required
                        </p>
                        <p className="text-emerald-700 text-xs dark:text-emerald-400">
                          This is the initial disbursement (Request #1). No receipts are needed.
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                <Separator />

                {/* Zone F — Bank Routing Information */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-muted-foreground text-sm uppercase tracking-wider">
                    Bank Account Details
                  </h3>
                  <div className="space-y-3 rounded-lg border border-border bg-blue-50/50 p-4 dark:bg-blue-950/20">
                    <div className="flex items-start gap-3">
                      <Landmark className="mt-0.5 h-5 w-5 text-blue-600" />
                      <div className="space-y-1">
                        <p className="font-bold text-blue-900 text-sm dark:text-blue-300">{request.piBankName}</p>
                        <p className="font-bold font-mono text-blue-800 text-lg tracking-wider dark:text-blue-400">
                          {request.piBankAccountNumber}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-[10px] text-blue-700 opacity-70 dark:text-blue-400">
                      <Info className="h-3 w-3" />
                      <span>Verify these details match your transfer before proceeding.</span>
                    </div>
                  </div>
                </div>
              </>
            ) : null}
          </div>
        </div>

        {/* Zone G — Action Buttons */}
        <SheetFooter className="border-border border-t bg-card p-6">
          <div className="flex w-full flex-col gap-3">
            {!canApprove && !canReject ? (
              <p className="text-center text-muted-foreground text-xs italic">
                You have view-only access to budget requests.
              </p>
            ) : isPending ? (
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  className="flex-1 border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700 dark:border-red-900 dark:hover:bg-red-950/40"
                  onClick={() => dispatch({ type: "SET_RETURN_MODAL", payload: true })}
                >
                  <Undo2 className="mr-2 h-4 w-4" />
                  Return
                </Button>

                <Button
                  variant="outline"
                  className="flex-1 border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700 dark:border-red-900 dark:hover:bg-red-950/40"
                  onClick={() => dispatch({ type: "SET_REJECT_MODAL", payload: true })}
                >
                  <XCircle className="mr-2 h-4 w-4" />
                  Reject
                </Button>

                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="flex-1">
                        <Button
                          className="w-full bg-emerald-600 hover:bg-emerald-700"
                          disabled={missingClearance}
                          onClick={() => dispatch({ type: "SET_APPROVE_MODAL", payload: true })}
                        >
                          <CheckCircle2 className="mr-2 h-4 w-4" />
                          Approve & Pay
                        </Button>
                      </div>
                    </TooltipTrigger>
                    {missingClearance && (
                      <TooltipContent side="top" className="bg-destructive text-destructive-foreground">
                        <div className="flex items-center gap-2 text-xs">
                          <AlertCircle className="h-3 w-3" />
                          Cannot approve — clearance document is missing.
                        </div>
                      </TooltipContent>
                    )}
                  </Tooltip>
                </TooltipProvider>
              </div>
            ) : (
              <p className="text-center text-muted-foreground text-xs">
                This request is in <span className="font-bold">{request?.status}</span> status and is read-only.
              </p>
            )}
            <Button variant="ghost" onClick={closeDrawer} className="w-full">
              Close Details
            </Button>
          </div>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}

function DrawerSkeleton() {
  return (
    <div className="space-y-8">
      <div className="space-y-3">
        <Skeleton className="h-8 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
        <Skeleton className="h-10 w-full rounded-lg" />
      </div>
      <Skeleton className="h-px w-full" />
      <div className="space-y-4">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-12 w-full rounded-full" />
      </div>
      <Skeleton className="h-px w-full" />
      <div className="space-y-6">
        <Skeleton className="h-4 w-32" />
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex gap-3">
              <Skeleton className="h-3 w-3 shrink-0 rounded-full" />
              <Skeleton className="h-4 w-full" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
