"use client";

import React from "react";
import { useEvaluations } from "../evaluations-context";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ShieldCheck } from "lucide-react";

export function ActionsAndModals() {
  const { showApproveDialog, setShowApproveDialog, totals, approveNote, setApproveNote, handleConfirmApproveEvaluation } = useEvaluations();

  return (
    <Dialog open={showApproveDialog} onOpenChange={setShowApproveDialog}>
      <DialogContent className="gap-0 overflow-hidden p-0 sm:max-w-[440px]">
        <DialogHeader className="border-b px-6 pt-6 pb-4 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-emerald-100 p-2 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <DialogTitle className="font-bold text-base">Approve evaluation</DialogTitle>
          </div>
          <DialogDescription className="text-left text-xs text-slate-500 dark:text-slate-400">
            Confirm that scores and defence arrangements are correct. Optional note is stored with the approval.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-3 px-6 py-4">
          <div className="rounded-lg border bg-slate-50 p-3 dark:border-slate-800 dark:bg-slate-900/50">
            <p className="font-bold text-[10px] text-slate-400 uppercase">Total</p>
            <p className="font-black text-indigo-700 text-xl tabular-nums dark:text-indigo-300">
              {totals.earned.toFixed(2)} / {totals.max}
            </p>
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="ap-note" className="text-xs font-semibold dark:text-slate-200">
              Optional note
            </Label>
            <Textarea
              id="ap-note"
              className="min-h-[88px] resize-none text-sm dark:bg-slate-950 dark:border-slate-700"
              placeholder="e.g. Approved after dean’s addendum received."
              value={approveNote}
              onChange={(e) => setApproveNote(e.target.value)}
            />
          </div>
        </div>
        <DialogFooter className="border-t px-6 py-4 dark:border-slate-800">
          <Button variant="outline" size="sm" onClick={() => setShowApproveDialog(false)}>
            Cancel
          </Button>
          <Button
            size="sm"
            className="bg-emerald-600 font-semibold hover:bg-emerald-700 text-white"
            onClick={handleConfirmApproveEvaluation}
          >
            Confirm approval
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
