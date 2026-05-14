"use client";

import { useState } from "react";

import { AlertCircle, Banknote } from "lucide-react";
import { toast } from "sonner";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { apiClient } from "@/lib/api/client";

import { useBudgetRequestsCtx } from "../../_context/BudgetRequestsContext";

function formatETB(n: number) {
  return `ETB ${n.toLocaleString("en-ET")}`;
}

export function ApproveModal() {
  const { state, dispatch } = useBudgetRequestsCtx();

  const [transactionId, setTransactionId] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const request = state.activeRequest;

  if (!request) return null;

  async function handleConfirm() {
    if (!transactionId.trim() || transactionId.length < 5) {
      setError("Please enter a valid bank transaction ID (min 5 characters).");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    if (!request) return;

    try {
      await apiClient.patch(`/budget/admin/requests/${request.requestId}/approve`, {
        bankTransactionId: transactionId,
      });

      toast.success("Funds released successfully.");

      // Close everything
      dispatch({ type: "SET_APPROVE_MODAL", payload: false });
      dispatch({ type: "SET_DRAWER_OPEN", payload: false });
      dispatch({ type: "SET_ACTIVE_REQUEST", payload: null });

      // Trigger a shared refetch across all hook instances
      dispatch({ type: "TRIGGER_REFETCH" });
    } catch (err) {
      // biome-ignore lint/suspicious/noExplicitAny: error handling
      const error = err as any;
      toast.error(error.response?.data?.message || "Failed to approve request.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Dialog
      open={state.approveModalOpen}
      onOpenChange={(open) => dispatch({ type: "SET_APPROVE_MODAL", payload: open })}
    >
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Banknote className="h-5 w-5 text-emerald-600" />
            Approve & Release Funds
          </DialogTitle>
          <DialogDescription>You are about to authorize the disbursement of funds for this project.</DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <Alert className="border-emerald-200 bg-emerald-50 dark:border-emerald-900 dark:bg-emerald-950/30">
            <AlertCircle className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
            <AlertDescription className="text-emerald-800 text-sm dark:text-emerald-300">
              Confirming this will release <span className="font-bold">{formatETB(request.totalAmount)}</span> to{" "}
              <span className="font-bold">{request.piName}</span>.
            </AlertDescription>
          </Alert>

          <div className="space-y-3 rounded-lg border border-border bg-muted/30 p-3 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Project:</span>
              <span className="max-w-[200px] truncate text-right font-medium">{request.projectTitle}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Disbursement:</span>
              <span className="font-medium">#{request.requestSequence}</span>
            </div>
            <div className="flex justify-between border-border border-t pt-2 font-bold">
              <span>Total Amount:</span>
              <span>{formatETB(request.totalAmount)}</span>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="transactionId">Bank Transaction Reference ID</Label>
            <Input
              id="transactionId"
              placeholder="e.g., TXN-ETB-009231"
              value={transactionId}
              onChange={(e) => {
                setTransactionId(e.target.value);
                if (error) setError(null);
              }}
              className={error ? "border-destructive" : ""}
            />
            {error && <p className="font-medium text-destructive text-xs">{error}</p>}
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => dispatch({ type: "SET_APPROVE_MODAL", payload: false })}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            onClick={handleConfirm}
            disabled={!transactionId.trim() || isSubmitting}
            className="bg-emerald-600 hover:bg-emerald-700"
          >
            {isSubmitting ? "Processing..." : "Confirm & Mark as Paid"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
