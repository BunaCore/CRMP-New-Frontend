"use client";

import { useRef, useState } from "react";

import { AlertTriangle, ExternalLink, FileText, Upload, X } from "lucide-react";
import { toast } from "sonner";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { apiClient } from "@/lib/api/client";

import type { DisbursementRecord } from "../_hooks/useProjectBudget";

interface FixResubmitDrawerProps {
  record: DisbursementRecord;
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB
const ACCEPTED_TYPES = ["application/pdf", "image/jpeg", "image/png"];

function getFileNameFromUrl(url: string): string {
  try {
    return decodeURIComponent(url.split("/").pop() ?? url);
  } catch {
    return url;
  }
}

export function FixResubmitDrawer({ record, open, onClose, onSuccess }: FixResubmitDrawerProps) {
  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  function handleDrop(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault();
    setIsDragging(false);
    const dropped = e.dataTransfer.files[0];
    if (dropped) handleFile(dropped);
  }

  async function handleSubmit() {
    if (!file) return;
    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.append("clearanceDocument", file);
      await apiClient.patch(`/budget/request/${record.id}/resubmit`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      toast.success("Your request has been resubmitted successfully.");
      onSuccess();
    } catch {
      toast.error("Failed to resubmit. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  function handleClose() {
    if (isSubmitting) return;
    setFile(null);
    onClose();
  }

  return (
    <Sheet open={open} onOpenChange={(o) => !o && handleClose()}>
      <SheetContent className="flex w-full flex-col gap-6 overflow-y-auto sm:max-w-lg">
        <SheetHeader>
          <SheetTitle>Fix &amp; Resubmit Request #{record.requestSequence}</SheetTitle>
          <SheetDescription>Upload a corrected clearance document to resubmit your request.</SheetDescription>
        </SheetHeader>

        {/* Finance Feedback */}
        <Alert className="border-red-200 bg-red-50 dark:border-red-900 dark:bg-red-950/40">
          <AlertTriangle className="h-4 w-4 text-red-600 dark:text-red-400" />
          <AlertTitle className="text-red-700 dark:text-red-400">Finance has returned your request</AlertTitle>
          <AlertDescription className="mt-1 text-red-700/80 text-sm dark:text-red-300/80">
            {record.financeFeedback ?? "No specific feedback was provided. Please contact the finance office."}
          </AlertDescription>
        </Alert>

        {/* Previous Document */}
        {record.clearanceDocumentUrl && (
          <div className="space-y-2">
            <p className="font-semibold text-foreground text-sm">Previous Document</p>
            <div className="flex items-center gap-3 rounded-lg border border-border bg-muted/30 p-3">
              <FileText className="h-5 w-5 shrink-0 text-muted-foreground" />
              <span className="flex-1 truncate text-muted-foreground text-sm">
                {getFileNameFromUrl(record.clearanceDocumentUrl)}
              </span>
              <a
                href={record.clearanceDocumentUrl}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1 text-primary text-xs hover:underline"
              >
                Open <ExternalLink className="h-3 w-3" />
              </a>
            </div>
          </div>
        )}

        {/* Upload Zone */}
        <div className="space-y-2">
          <p className="font-semibold text-foreground text-sm">Upload corrected clearance document / receipts</p>
          {/* biome-ignore lint/a11y/noStaticElementInteractions: this is a file dropzone */}
          {/* biome-ignore lint/a11y/useKeyWithClickEvents: click is just a fallback for drag and drop */}
          <div
            onDragOver={(e) => {
              e.preventDefault();
              setIsDragging(true);
            }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`cursor-pointer rounded-xl border-2 border-dashed p-8 text-center transition-all duration-200 ${
              isDragging
                ? "border-primary bg-primary/5"
                : "border-border bg-muted/20 hover:border-primary/50 hover:bg-muted/30"
            }`}
          >
            <Upload className="mx-auto mb-3 h-8 w-8 text-muted-foreground" />
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

          {/* Selected file preview */}
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

        {/* Submit */}
        <div className="mt-auto flex gap-3 border-border border-t pt-4">
          <Button variant="outline" className="flex-1" onClick={handleClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button className="flex-1" onClick={handleSubmit} disabled={!file || isSubmitting}>
            {isSubmitting ? (
              <span className="flex items-center gap-2">
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-background border-t-transparent" />
                Resubmitting…
              </span>
            ) : (
              "Resubmit Request"
            )}
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
