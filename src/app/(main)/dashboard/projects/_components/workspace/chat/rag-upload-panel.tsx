"use client";

import { CheckCircle2, FileCode, FileImage, FileText, Loader2, Plus, UploadCloud, X } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

export interface UploadedFile {
  id: string;
  name: string;
  type: string;
  size: number;
  status: "ready" | "processing" | "failed";
  pages?: number;
}

interface RagUploadPanelProps {
  files: UploadedFile[];
  onUpload: (files: File[]) => void;
  onRemove: (id: string) => void;
  isUploading: boolean;
}

export function RagUploadPanel({ files, onUpload, onRemove, isUploading }: RagUploadPanelProps) {
  const formatSize = (bytes: number) => {
    if (bytes === 0) return "0 B";
    const k = 1024;
    const sizes = ["B", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / k ** i).toFixed(1))} ${sizes[i]}`;
  };

  const getFileIcon = (type: string, className?: string) => {
    if (type.includes("pdf")) return <FileText className={cn("text-red-500", className)} />;
    if (type.includes("image")) return <FileImage className={cn("text-blue-500", className)} />;
    if (type.includes("code") || type.includes("json"))
      return <FileCode className={cn("text-emerald-500", className)} />;
    return <FileText className={cn("text-blue-600 dark:text-blue-400", className)} />;
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      onUpload(Array.from(e.target.files));
    }
  };

  // Empty State: Large Upload Area
  if (files.length === 0 && !isUploading) {
    return (
      <div className="p-4">
        <label className="group relative flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-muted-foreground/25 border-dashed bg-muted/20 py-10 transition-all hover:border-primary/50 hover:bg-muted/50 dark:border-zinc-800 dark:bg-zinc-900/50 dark:hover:border-zinc-700">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-background shadow-sm ring-1 ring-border transition-transform group-hover:scale-105 dark:bg-zinc-800 dark:ring-zinc-700">
            <UploadCloud className="h-6 w-6 text-primary" />
          </div>
          <h3 className="mt-4 font-semibold text-sm tracking-tight">Upload Documents</h3>
          <p className="mt-1 max-w-[200px] text-center text-muted-foreground text-xs">
            Drag & drop or click to upload PDF, DOCX, TXT, or images to chat with them.
          </p>
          <input
            type="file"
            multiple
            className="hidden"
            onChange={handleFileChange}
            accept=".pdf,.docx,.txt,.md,image/*"
          />
        </label>
      </div>
    );
  }

  // Uploading State
  if (files.length === 0 && isUploading) {
    return (
      <div className="p-4">
        <div className="flex flex-col items-center justify-center rounded-xl border border-border bg-card py-10 shadow-sm dark:border-zinc-800 dark:bg-zinc-900/50">
          <Loader2 className="mb-4 h-8 w-8 animate-spin text-primary" />
          <p className="animate-pulse font-medium text-sm">Processing documents...</p>
        </div>
      </div>
    );
  }

  // Populated State: Compact Document Stack/List
  return (
    <div className="bg-card/50 px-4 py-3 dark:bg-zinc-900/30">
      <div className="mb-2 flex items-center justify-between">
        <h4 className="font-semibold text-muted-foreground text-xs uppercase tracking-wider">Document Context</h4>
        <label className="flex cursor-pointer items-center gap-1 font-medium text-primary text-xs transition-colors hover:text-primary/80">
          <Plus className="h-3 w-3" />
          Add More
          <input type="file" multiple className="hidden" onChange={handleFileChange} />
        </label>
      </div>

      <ScrollArea className="w-full whitespace-nowrap">
        <div className="flex w-max space-x-3 pb-2">
          {files.map((file) => (
            <div
              key={file.id}
              className="group relative flex w-[220px] items-center gap-3 rounded-lg border border-border bg-background p-2.5 shadow-sm transition-all hover:border-primary/30 hover:shadow-md dark:border-zinc-800 dark:bg-zinc-950"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-muted/50 dark:bg-zinc-900">
                {getFileIcon(file.type, "h-5 w-5")}
              </div>

              <div className="flex flex-col overflow-hidden">
                <span className="truncate font-semibold text-sm tracking-tight" title={file.name}>
                  {file.name}
                </span>
                <div className="mt-0.5 flex items-center gap-2 text-[10px] text-muted-foreground">
                  <span className="font-medium uppercase">{file.type.split("/").pop()}</span>
                  <span>•</span>
                  <span>{formatSize(file.size)}</span>
                  {file.pages && (
                    <>
                      <span>•</span>
                      <span>{file.pages} pgs</span>
                    </>
                  )}
                </div>
              </div>

              {/* Status Badge */}
              <div className="-top-2 -right-2 absolute">
                <Badge
                  variant="secondary"
                  className="flex h-5 items-center gap-1 border border-border bg-background px-1.5 font-bold text-[9px] text-green-600 shadow-sm dark:border-zinc-800 dark:bg-zinc-900 dark:text-green-400"
                >
                  <CheckCircle2 className="h-3 w-3" />
                  Ready
                </Badge>
              </div>

              {/* Remove Button (appears on hover) */}
              <Button
                variant="destructive"
                size="icon"
                className="-bottom-2 -right-2 absolute h-6 w-6 rounded-full opacity-0 shadow-sm transition-opacity group-hover:opacity-100"
                onClick={() => onRemove(file.id)}
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          ))}

          {isUploading && (
            <div className="flex w-[220px] items-center gap-3 rounded-lg border border-primary/30 border-dashed bg-primary/5 p-2.5">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-primary/10">
                <Loader2 className="h-5 w-5 animate-spin text-primary" />
              </div>
              <div className="flex flex-col">
                <span className="font-medium text-primary text-sm">Uploading...</span>
                <span className="text-[10px] text-primary/70">Analyzing contents</span>
              </div>
            </div>
          )}
        </div>
        <ScrollBar orientation="horizontal" className="h-1.5" />
      </ScrollArea>
    </div>
  );
}
