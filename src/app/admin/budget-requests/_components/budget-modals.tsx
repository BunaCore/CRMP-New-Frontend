"use client";

import { RefreshCw, Stamp, XCircle } from "lucide-react";

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
import { Textarea } from "@/components/ui/textarea";

import { useBudgetRequests } from "../budget-context";

export function BudgetRequestModals() {
  const {
    selected,
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
  } = useBudgetRequests();

  const activePhase = selected?.phases[selected.activePhasIndex ?? 0];
  const fmt = (n: number) => `Br ${new Intl.NumberFormat("en-US").format(n)}`;

  return (
    <>
      {/* ── STAMP AS PAID DIALOG ── */}
      <Dialog open={showPaidDialog} onOpenChange={setShowPaidDialog}>
        <DialogContent className="gap-0 overflow-hidden p-0 sm:max-w-[480px]">
          <DialogHeader className="border-b border-slate-100 px-6 pt-6 pb-4 dark:border-slate-800">
            <div className="mb-1 flex items-center gap-3">
              <div className="rounded-lg bg-emerald-100 p-2 text-emerald-600 dark:bg-emerald-900/40 dark:text-emerald-400">
                <Stamp className="h-5 w-5" />
              </div>
              <DialogTitle className="text-base font-bold">Confirm Transfer & Stamp as Paid</DialogTitle>
            </div>
            <DialogDescription className="ml-11 text-xs text-slate-500">
              This action marks the budget request as released. Enter the bank transaction ID for audit traceability.
            </DialogDescription>
          </DialogHeader>

          <div className="flex flex-col gap-4 px-6 py-5">
            {/* Context */}
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-lg border border-slate-100 bg-slate-50 p-3 dark:border-slate-800 dark:bg-slate-900/50">
                <p className="text-[10px] font-bold text-slate-400 uppercase">Phase</p>
                <p className="mt-0.5 text-[13px] font-semibold text-slate-800 dark:text-slate-200">
                  Phase {activePhase?.phase} — {activePhase?.label}
                </p>
              </div>
              <div className="rounded-lg border border-slate-100 bg-slate-50 p-3 dark:border-slate-800 dark:bg-slate-900/50">
                <p className="text-[10px] font-bold text-slate-400 uppercase">Amount Requested</p>
                <p className="mt-0.5 text-[15px] font-bold text-emerald-600 dark:text-emerald-400">
                  {fmt(activePhase?.amount ?? 0)}
                </p>
              </div>
            </div>

            {/* Transaction ID — mandatory */}
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="txn-id" className="text-[12px] font-semibold text-slate-700 dark:text-slate-300">
                Bank Transaction / Reference ID <span className="text-rose-500">*</span>
              </Label>
              <Input
                id="txn-id"
                placeholder="e.g. TXN-ETB-009231"
                className="h-10 font-mono text-sm dark:bg-slate-950"
                value={transactionId}
                onChange={(e) => setTransactionId(e.target.value)}
              />
              <p className="text-[10px] text-slate-400">Required for audit trail. This will be stored permanently.</p>
            </div>

            {/* Adjust amount — optional */}
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="adj-amount" className="text-[12px] font-semibold text-slate-700 dark:text-slate-300">
                Adjusted Approved Amount{" "}
                <span className="font-normal text-slate-400">(optional — leave blank for full amount)</span>
              </Label>
              <div className="relative">
                <span className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-sm font-semibold text-slate-400">
                  Br
                </span>
                <Input
                  id="adj-amount"
                  type="number"
                  min={0}
                  max={activePhase?.amount}
                  placeholder={String(activePhase?.amount ?? "")}
                  className="h-10 pl-10 font-mono text-sm dark:bg-slate-950"
                  value={adjustedAmount}
                  onChange={(e) => setAdjustedAmount(e.target.value)}
                />
              </div>
              <p className="text-[10px] text-slate-400">
                Use this to partially approve if receipts do not cover the full requested amount. The difference rolls
                back to remaining budget.
              </p>
            </div>
          </div>

          <DialogFooter className="flex gap-2 border-t border-slate-100 px-6 py-4 dark:border-slate-800">
            <Button variant="outline" size="sm" className="h-9" onClick={() => setShowPaidDialog(false)}>
              Cancel
            </Button>
            <Button
              size="sm"
              className="h-9 flex-1 bg-emerald-600 font-semibold text-white hover:bg-emerald-700"
              disabled={!transactionId.trim()}
              onClick={handleConfirmPaid}
            >
              <Stamp className="mr-1.5 h-4 w-4" />
              Confirm & Stamp as Paid
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ── RETURN FOR CORRECTION DIALOG ── */}
      <Dialog open={showReturnDialog} onOpenChange={setShowReturnDialog}>
        <DialogContent className="gap-0 overflow-hidden p-0 sm:max-w-[460px]">
          <DialogHeader className="border-b border-slate-100 px-6 pt-6 pb-4 dark:border-slate-800">
            <div className="mb-1 flex items-center gap-3">
              <div className="rounded-lg bg-rose-100 p-2 text-rose-600 dark:bg-rose-900/40 dark:text-rose-400">
                <XCircle className="h-5 w-5" />
              </div>
              <DialogTitle className="text-base font-bold">Return for Correction</DialogTitle>
            </div>
            <DialogDescription className="ml-11 text-xs text-slate-500">
              The PI will be informed and must resubmit a corrected clearance document before the funds can be released.
            </DialogDescription>
          </DialogHeader>

          <div className="flex flex-col gap-4 px-6 py-5">
            <div className="rounded-lg border border-slate-100 bg-slate-50 p-3.5 dark:border-slate-800 dark:bg-slate-900/50">
              <p className="text-[10px] font-bold tracking-wider text-slate-400 uppercase">Project</p>
              <p className="mt-0.5 line-clamp-2 text-[13px] font-semibold text-slate-800 dark:text-slate-200">
                {selected?.projectTitle}
              </p>
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="return-comment" className="text-[12px] font-semibold text-slate-700 dark:text-slate-300">
                Reason for return <span className="text-rose-500">*</span>
              </Label>
              <Textarea
                id="return-comment"
                placeholder="Be specific: what is missing, which receipt is unreadable, or what document is required."
                className="min-h-[140px] resize-none rounded-lg bg-white text-sm focus-visible:ring-rose-400 dark:bg-slate-950"
                value={returnComment}
                onChange={(e) => setReturnComment(e.target.value)}
              />
              <p className="text-[10px] font-medium text-slate-400">{returnComment.length} / 600 characters</p>
            </div>
          </div>

          <DialogFooter className="flex gap-2 border-t border-slate-100 px-6 py-4 dark:border-slate-800">
            <Button variant="outline" size="sm" className="h-9" onClick={() => setShowReturnDialog(false)}>
              Cancel
            </Button>
            <Button
              size="sm"
              className="h-9 flex-1 bg-rose-600 font-semibold text-white hover:bg-rose-700"
              disabled={returnComment.trim().length < 10}
              onClick={handleConfirmReturn}
            >
              <RefreshCw className="mr-1.5 h-4 w-4" />
              Return to PI
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
