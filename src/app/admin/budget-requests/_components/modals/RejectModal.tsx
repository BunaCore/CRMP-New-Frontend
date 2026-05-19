"use client";

import { useState } from "react";

import { AlertCircle, XCircle } from "lucide-react";
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
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { apiClient } from "@/lib/api/client";

import { useBudgetRequestsCtx } from "../../_context/BudgetRequestsContext";

export function RejectModal() {
  const { state, dispatch } = useBudgetRequestsCtx();

  const [feedback, setFeedback] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const request = state.activeRequest;

  if (!request) return null;

  const minLength = 5;
  const isFeedbackValid = feedback.trim().length >= minLength;

  async function handleConfirm() {
    if (!isFeedbackValid) {
      setError(`Feedback must be at least ${minLength} characters.`);
      return;
    }

    setIsSubmitting(true);
    setError(null);

    if (!request) return;

    try {
      await apiClient.patch(`/budget/admin/requests/${request.requestId}/reject`, {
        feedback: feedback.trim(),
      });

      toast.success("Request permanently rejected.");

      // Close everything
      dispatch({ type: "SET_REJECT_MODAL", payload: false });
      dispatch({ type: "SET_DRAWER_OPEN", payload: false });
      dispatch({ type: "SET_ACTIVE_REQUEST", payload: null });

      // Trigger a shared refetch
      dispatch({ type: "TRIGGER_REFETCH" });
    } catch (err) {
      // biome-ignore lint/suspicious/noExplicitAny: error handling
      const error = err as any;
      toast.error(error.response?.data?.message || "Failed to reject request.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Dialog open={state.rejectModalOpen} onOpenChange={(open) => dispatch({ type: "SET_REJECT_MODAL", payload: open })}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-destructive">
            <XCircle className="h-5 w-5" />
            Reject Disbursement Request
          </DialogTitle>
          <DialogDescription>This will permanently reject the request and release the budget items.</DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <Alert variant="destructive" className="bg-destructive/5">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription className="font-medium text-sm">
              You are rejecting Disbursement <span className="font-bold">#{request.requestSequence}</span>. The items
              will become <span className="font-bold">AVAILABLE</span> for the PI to request again.
            </AlertDescription>
          </Alert>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="reject-feedback">Reason for Rejection</Label>
              <span className={`font-medium text-[10px] ${isFeedbackValid ? "text-muted-foreground" : "text-red-500"}`}>
                {feedback.length} / {minLength} min
              </span>
            </div>
            <Textarea
              id="reject-feedback"
              placeholder="Provide a clear reason why this request is being rejected..."
              rows={4}
              value={feedback}
              onChange={(e) => {
                setFeedback(e.target.value);
                if (error) setError(null);
              }}
              className={error ? "border-destructive focus-visible:ring-destructive" : ""}
            />
            {error && <p className="font-medium text-destructive text-xs">{error}</p>}
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => dispatch({ type: "SET_REJECT_MODAL", payload: false })}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button variant="destructive" onClick={handleConfirm} disabled={!isFeedbackValid || isSubmitting}>
            {isSubmitting ? "Rejecting..." : "Permanently Reject"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
