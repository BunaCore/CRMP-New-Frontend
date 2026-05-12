"use client";

import { useRef, useState } from "react";

import { AlertCircle, CheckCircle2, ChevronRight, FileText, Info, Upload, X } from "lucide-react";
import { toast } from "sonner";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { apiClient } from "@/lib/api/client";

import type { BudgetItem, DisbursementRecord } from "../_hooks/useProjectBudget";

function formatETB(amount: number) {
  return `ETB ${amount.toLocaleString("en-ET")}`;
}

const MAX_FILE_SIZE = 10 * 1024 * 1024;
const ACCEPTED_TYPES = ["application/pdf", "image/jpeg", "image/png"];

interface NewRequestDialogProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  projectId: string;
  budgetItems: BudgetItem[];
  disbursementHistory: DisbursementRecord[];
}

export function NewRequestDialog({
  open,
  onClose,
  onSuccess,
  projectId,
  budgetItems,
  disbursementHistory,
}: NewRequestDialogProps) {
  const availableItems = budgetItems.filter((i) => i.status === "AVAILABLE");
  const requiresClearance = disbursementHistory.length > 0;

  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const selectedItems = availableItems.filter((i) => selectedIds.has(i.id));
  const totalRequested = selectedItems.reduce((s, i) => s + i.amount, 0);
  const allSelected = availableItems.length > 0 && selectedIds.size === availableItems.length;

  function toggleItem(id: string) {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }

  function toggleAll() {
    if (allSelected) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(availableItems.map((i) => i.id)));
    }
  }

  function handleFile(f: File) {
    if (!ACCEPTED_TYPES.includes(f.type)) {
      toast.error("Invalid file type. Please upload a PDF, JPG, or PNG.");
      return;
    }
    if (f.size > MAX_FILE_SIZE) {
      toast.error("File too large. Maximum size is 10 MB.");
      return;
    }
    setFile(f);
  }

  function goNext() {
    if (step === 1) {
      if (requiresClearance) {
        setStep(2);
      } else {
        setStep(3);
      }
    } else if (step === 2) {
      setStep(3);
    }
  }

  function goBack() {
    if (step === 3) {
      setStep(requiresClearance ? 2 : 1);
    } else if (step === 2) {
      setStep(1);
    }
  }

  async function handleSubmit() {
    setIsSubmitting(true);
    try {
      if (requiresClearance && file) {
        const formData = new FormData();
        for (const item of selectedItems) {
          formData.append("budgetItemIds[]", item.id);
        }
        formData.append("clearanceDocument", file);
        await apiClient.post(`/budget/project/${projectId}/request`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      } else {
        await apiClient.post(`/budget/project/${projectId}/request`, {
          budgetItemIds: selectedItems.map((i) => i.id),
        });
      }
      toast.success("Your disbursement request has been submitted successfully.");
      handleClose();
      onSuccess();
    } catch {
      toast.error("Failed to submit request. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  function handleClose() {
    setStep(1);
    setSelectedIds(new Set());
    setFile(null);
    onClose();
  }

  const stepLabels = requiresClearance
    ? ["Select Items", "Upload Clearance", "Review & Confirm"]
    : ["Select Items", "Review & Confirm"];
  const currentStepIdx = step === 1 ? 0 : step === 2 ? 1 : requiresClearance ? 2 : 1;

  return (
    <Dialog open={open} onOpenChange={(o) => !o && handleClose()}>
      <DialogContent className="flex max-h-[90vh] w-full max-w-2xl flex-col overflow-hidden">
        <DialogHeader className="shrink-0">
          <DialogTitle>Request Funds</DialogTitle>
          {/* Step indicator */}
          <div className="mt-3 flex items-center gap-2">
            {stepLabels.map((label, idx) => (
              <div key={label} className="flex items-center gap-2">
                <div
                  className={`flex h-6 w-6 items-center justify-center rounded-full font-bold text-xs transition-all ${
                    idx < currentStepIdx
                      ? "bg-primary text-primary-foreground"
                      : idx === currentStepIdx
                        ? "bg-primary text-primary-foreground ring-2 ring-primary/30"
                        : "bg-muted text-muted-foreground"
                  }`}
                >
                  {idx < currentStepIdx ? <CheckCircle2 className="h-3.5 w-3.5" /> : idx + 1}
                </div>
                <span
                  className={`font-medium text-xs ${
                    idx === currentStepIdx ? "text-foreground" : "text-muted-foreground"
                  }`}
                >
                  {label}
                </span>
                {idx < stepLabels.length - 1 && <ChevronRight className="h-3.5 w-3.5 text-muted-foreground" />}
              </div>
            ))}
          </div>
        </DialogHeader>

        <div className="min-h-0 flex-1 overflow-y-auto py-4">
          {/* ── STEP 1 ── Select Items */}
          {step === 1 && (
            <div className="space-y-4">
              {availableItems.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-10 text-center text-muted-foreground">
                  <AlertCircle className="mb-2 h-8 w-8 text-muted-foreground/50" />
                  <p className="font-medium text-sm">All budget items have been requested or disbursed.</p>
                </div>
              ) : (
                <>
                  {/* biome-ignore lint/a11y/noStaticElementInteractions: click is fallback */}
                  {/* biome-ignore lint/a11y/useKeyWithClickEvents: click is fallback */}
                  <div
                    className="flex cursor-pointer items-center gap-3 rounded-lg border border-border bg-muted/30 px-4 py-2.5 transition-colors hover:bg-muted/50"
                    onClick={toggleAll}
                  >
                    <Checkbox
                      checked={allSelected}
                      onCheckedChange={toggleAll}
                      id="select-all"
                      className="pointer-events-none"
                    />
                    <label htmlFor="select-all" className="cursor-pointer font-semibold text-sm">
                      Select All ({availableItems.length} items)
                    </label>
                  </div>

                  {/* Item list */}
                  <div className="space-y-2">
                    {availableItems.map((item) => {
                      return (
                        // biome-ignore lint/a11y/noStaticElementInteractions: click is fallback
                        // biome-ignore lint/a11y/useKeyWithClickEvents: click is fallback
                        <div
                          key={item.id}
                          className={`flex cursor-pointer items-center gap-3 rounded-lg border px-4 py-3 transition-all ${
                            selectedIds.has(item.id)
                              ? "border-primary/50 bg-primary/5"
                              : "border-border bg-card hover:bg-muted/30"
                          }`}
                          onClick={() => toggleItem(item.id)}
                        >
                          <Checkbox
                            checked={selectedIds.has(item.id)}
                            onCheckedChange={() => toggleItem(item.id)}
                            className="pointer-events-none"
                          />
                          <div className="min-w-0 flex-1">
                            <p className="truncate font-medium text-sm">{item.description}</p>
                            <p className="text-muted-foreground text-xs">{item.category}</p>
                          </div>
                          <span className="shrink-0 font-mono font-semibold text-sm">{formatETB(item.amount)}</span>
                        </div>
                      );
                    })}
                  </div>

                  {/* Running total */}
                  <div className="flex items-center justify-between rounded-lg border border-primary/20 bg-primary/5 px-4 py-3">
                    <span className="text-muted-foreground text-sm">Total Requested:</span>
                    <span className="font-bold font-mono text-lg text-primary">{formatETB(totalRequested)}</span>
                  </div>
                </>
              )}
            </div>
          )}

          {/* ── STEP 2 ── Upload Clearance */}
          {step === 2 && (
            <div className="space-y-4">
              <Alert className="border-amber-200 bg-amber-50 dark:border-amber-900 dark:bg-amber-950/30">
                <Info className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                <AlertDescription className="text-amber-700 text-sm dark:text-amber-300">
                  A clearance document is required because you have a previous disbursement. Please upload receipts or a
                  clearance certificate for the prior funds.
                </AlertDescription>
              </Alert>

              {/* biome-ignore lint/a11y/noStaticElementInteractions: drag and drop zone */}
              {/* biome-ignore lint/a11y/useKeyWithClickEvents: click is fallback for drag and drop */}
              <div
                onDragOver={(e) => {
                  e.preventDefault();
                  setIsDragging(true);
                }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={(e) => {
                  e.preventDefault();
                  setIsDragging(false);
                  const f = e.dataTransfer.files[0];
                  if (f) handleFile(f);
                }}
                onClick={() => fileInputRef.current?.click()}
                className={`cursor-pointer rounded-xl border-2 border-dashed p-10 text-center transition-all duration-200 ${
                  isDragging
                    ? "border-primary bg-primary/5"
                    : "border-border bg-muted/20 hover:border-primary/50 hover:bg-muted/30"
                }`}
              >
                <Upload className="mx-auto mb-3 h-10 w-10 text-muted-foreground" />
                <p className="font-medium text-foreground text-sm">
                  Drag &amp; drop or <span className="text-primary underline underline-offset-2">browse</span>
                </p>
                <p className="mt-1 text-muted-foreground text-xs">PDF, JPG, PNG — max 10 MB</p>
                <input
                  ref={fileInputRef}
                  type="file"
                  className="hidden"
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={(e) => {
                    const f = e.target.files?.[0];
                    if (f) handleFile(f);
                  }}
                />
              </div>

              {file && (
                <div className="flex items-center gap-3 rounded-lg border border-emerald-200 bg-emerald-50 p-3 dark:border-emerald-900 dark:bg-emerald-950/30">
                  <FileText className="h-4 w-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
                  <span className="flex-1 truncate font-medium text-emerald-700 text-sm dark:text-emerald-400">
                    {file.name}
                  </span>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 text-muted-foreground hover:text-destructive"
                    onClick={(e) => {
                      e.stopPropagation();
                      setFile(null);
                    }}
                  >
                    <X className="h-3.5 w-3.5" />
                  </Button>
                </div>
              )}
            </div>
          )}

          {/* ── STEP 3 ── Review & Confirm */}
          {step === 3 && (
            <div className="space-y-4">
              <div className="overflow-hidden rounded-lg border border-border bg-muted/20">
                <div className="border-border border-b bg-muted/40 px-4 py-2.5">
                  <p className="font-semibold text-sm">Selected Items</p>
                </div>
                <div className="divide-y divide-border">
                  {selectedItems.map((item) => (
                    <div key={item.id} className="flex items-center justify-between px-4 py-3">
                      <div>
                        <p className="font-medium text-sm">{item.description}</p>
                        <p className="text-muted-foreground text-xs">{item.category}</p>
                      </div>
                      <span className="font-mono font-semibold text-sm">{formatETB(item.amount)}</span>
                    </div>
                  ))}
                </div>
                <div className="flex items-center justify-between border-border border-t bg-muted/40 px-4 py-3">
                  <span className="font-semibold text-sm">Total</span>
                  <span className="font-bold font-mono text-lg text-primary">{formatETB(totalRequested)}</span>
                </div>
              </div>

              {/* Clearance doc confirmation */}
              {requiresClearance && file && (
                <div className="flex items-center gap-3 rounded-lg border border-emerald-200 bg-emerald-50 p-3 dark:border-emerald-900 dark:bg-emerald-950/30">
                  <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-600 dark:text-emerald-400" />
                  <div>
                    <p className="font-semibold text-emerald-700 text-sm dark:text-emerald-400">
                      Clearance Document Attached
                    </p>
                    <p className="truncate text-muted-foreground text-xs">{file.name}</p>
                  </div>
                </div>
              )}

              {/* Badge summary */}
              <div className="flex flex-wrap gap-2">
                <Badge variant="outline" className="text-xs">
                  {selectedItems.length} item{selectedItems.length !== 1 ? "s" : ""} selected
                </Badge>
                {requiresClearance && (
                  <Badge variant="outline" className="text-xs">
                    Clearance document: {file ? "✓ included" : "⚠ missing"}
                  </Badge>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Footer actions */}
        <div className="flex shrink-0 gap-3 border-border border-t pt-4">
          {step > 1 ? (
            <Button variant="outline" onClick={goBack} disabled={isSubmitting} className="flex-1">
              Back
            </Button>
          ) : (
            <Button variant="outline" onClick={handleClose} className="flex-1">
              Cancel
            </Button>
          )}

          {step < 3 ? (
            <Button
              className="flex-1"
              onClick={goNext}
              disabled={(step === 1 && selectedIds.size === 0) || (step === 2 && !file)}
            >
              Continue
              <ChevronRight className="ml-1 h-4 w-4" />
            </Button>
          ) : (
            <Button className="flex-1" onClick={handleSubmit} disabled={isSubmitting || (requiresClearance && !file)}>
              {isSubmitting ? (
                <span className="flex items-center gap-2">
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-background border-t-transparent" />
                  Submitting…
                </span>
              ) : (
                "Submit Request"
              )}
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
