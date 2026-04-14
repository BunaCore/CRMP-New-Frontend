"use client";

// ============================================================
// ImportMarkdownModal
// Warning modal + file picker for importing external markdown.
// Performs a pre-import snapshot, reads the file, and
// proxies the content to the caller (which handles TipTap).
// ============================================================

import { useEffect, useRef, useState } from "react";

import { AlertCircle, CheckCheck, FileText, Loader2, Upload, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ImportMarkdownModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImport: (markdownText: string) => Promise<void>;
}

export function ImportMarkdownModal({ isOpen, onClose, onImport }: ImportMarkdownModalProps) {
  const [file, setFile] = useState<File | null>(null);
  const [isImporting, setIsImporting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Reset state when opened
  useEffect(() => {
    if (isOpen) {
      setFile(null);
      setError(null);
      setSuccess(false);
      setIsImporting(false);
    }
  }, [isOpen]);

  const handleFileDrop = (e: React.DragEvent<HTMLButtonElement>) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile && (droppedFile.name.endsWith(".md") || droppedFile.type === "text/markdown")) {
      setFile(droppedFile);
      setError(null);
    } else {
      setError("Please drop a valid .md file");
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setError(null);
    }
  };

  const handleImport = async () => {
    if (!file) return;

    setIsImporting(true);
    setError(null);

    try {
      const text = await file.text();
      await onImport(text);
      setSuccess(true);
      setTimeout(() => {
        onClose();
      }, 1500);
    } catch (err) {
      console.error(err);
      setError("Failed to process markdown file.");
      setIsImporting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      {/* biome-ignore lint/a11y/useKeyWithClickEvents: Backdrop click is a convenience */}
      {/* biome-ignore lint/a11y/noStaticElementInteractions: Backdrop */}
      <div
        className="fixed inset-0 z-[100] bg-background/80 backdrop-blur-sm transition-opacity"
        onClick={!isImporting ? onClose : undefined}
      />

      {/* Modal */}
      <div className="fixed top-[50%] left-[50%] z-[100] w-full max-w-md translate-x-[-50%] translate-y-[-50%] overflow-hidden rounded-xl border bg-card shadow-2xl duration-200">
        <div className="flex items-center justify-between border-b bg-muted/10 px-4 py-3">
          <div className="flex items-center gap-2 font-semibold">
            <Upload className="h-4 w-4 text-primary" />
            Import Markdown
          </div>
          <Button variant="ghost" size="icon" className="h-7 w-7" onClick={onClose} disabled={isImporting}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="p-6">
          <div className="mb-6 flex gap-3 rounded-lg border border-amber-500/20 bg-amber-500/5 p-3 text-amber-700 dark:text-amber-400">
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
            <div className="text-sm">
              <p className="font-semibold">This replaces your document</p>
              <p className="mt-1 text-xs opacity-80">
                A snapshot of your current work will be saved automatically before importing. Note that complex custom
                formatting might not translate perfectly from vanilla markdown.
              </p>
            </div>
          </div>

          <button
            type="button"
            className={cn(
              "flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed bg-muted/20 p-8 text-center transition-colors hover:bg-muted/40",
              file ? "border-primary/50 bg-primary/5" : "border-muted-foreground/20",
              isImporting && "pointer-events-none opacity-50",
            )}
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleFileDrop}
            onClick={() => !isImporting && fileInputRef.current?.click()}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                if (!isImporting) fileInputRef.current?.click();
              }
            }}
          >
            <input
              type="file"
              accept=".md,text/markdown"
              className="hidden"
              ref={fileInputRef}
              onChange={handleFileChange}
            />
            {file ? (
              <>
                <FileText className="mb-3 h-8 w-8 text-primary" />
                <p className="font-medium text-primary text-sm">{file.name}</p>
                <p className="text-muted-foreground text-xs">Click or drag to change</p>
              </>
            ) : (
              <>
                <Upload className="mb-3 h-8 w-8 text-muted-foreground/30" />
                <p className="font-medium text-sm">Select or drop a .md file</p>
                <p className="mt-1 text-muted-foreground text-xs">Max file size 2MB</p>
              </>
            )}
          </button>

          {error && <p className="mt-4 text-center font-medium text-destructive text-sm">{error}</p>}

          {success && (
            <div className="mt-4 flex items-center justify-center gap-2 font-medium text-emerald-600 text-sm">
              <CheckCheck className="h-4 w-4" />
              Import successful!
            </div>
          )}

          <div className="mt-6 flex justify-end gap-3">
            <Button variant="ghost" onClick={onClose} disabled={isImporting}>
              Cancel
            </Button>
            <Button onClick={handleImport} disabled={!file || isImporting || success} className="min-w-[120px]">
              {isImporting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Importing...
                </>
              ) : (
                "Import & Replace"
              )}
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
