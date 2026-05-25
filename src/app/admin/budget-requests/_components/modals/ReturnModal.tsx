"use client";

import { useState } from "react";

import { AlertCircle, Undo2 } from "lucide-react";
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

export function ReturnModal() {
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
      await apiClient.patch(`/budget/admin/requests/${request.requestId}/return`, {
        feedback: feedback.trim(),
      });

      toast.success("Request returned to PI.");

      // Close everything
      dispatch({ type: "SET_RETURN_MODAL", payload: false });
      dispatch({ type: "SET_DRAWER_OPEN", payload: false });
      dispatch({ type: "SET_ACTIVE_REQUEST", payload: null });

      // Trigger a shared refetch across all hook instances
      dispatch({ type: "TRIGGER_REFETCH" });
    } catch (err) {
      // biome-ignore lint/suspicious/noExplicitAny: error handling
      const error = err as any;
      toast.error(error.response?.data?.message || "Failed to return request.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Dialog open={state.returnModalOpen} onOpenChange={(open) => dispatch({ type: "SET_RETURN_MODAL", payload: open })}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-red-600">
            <Undo2 className="h-5 w-5" />
            Return for Correction
          </DialogTitle>
          <DialogDescription>
            Returning this request will notify the PI and allow them to correct and resubmit.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <Alert className="border-red-200 bg-red-50 dark:border-red-900 dark:bg-red-950/30">
            <AlertCircle className="h-4 w-4 text-red-600 dark:text-red-400" />
            <AlertDescription className="text-red-800 text-sm dark:text-red-300">
              You are returning Disbursement <span className="font-bold">#{request.requestSequence}</span> for project{" "}
              <span className="inline-block max-w-[150px] truncate align-bottom font-bold">{request.projectTitle}</span>
              .
            </AlertDescription>
          </Alert>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="feedback">Reason for Return</Label>
              <span className={`font-medium text-[10px] ${isFeedbackValid ? "text-muted-foreground" : "text-red-500"}`}>
                {feedback.length} / {minLength} min
              </span>
            </div>
            <Textarea
              id="feedback"
              placeholder="Describe exactly what is wrong and what the PI needs to fix…"
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
            onClick={() => dispatch({ type: "SET_RETURN_MODAL", payload: false })}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button variant="destructive" onClick={handleConfirm} disabled={!isFeedbackValid || isSubmitting}>
            {isSubmitting ? "Returning..." : "Return to PI"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
