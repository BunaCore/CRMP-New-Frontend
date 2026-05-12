"use client";

import { AlertTriangle, ExternalLink, FileImage, FileText } from "lucide-react";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";

function isImageUrl(url: string): boolean {
  const lower = url.toLowerCase();
  return lower.endsWith(".jpg") || lower.endsWith(".jpeg") || lower.endsWith(".png");
}

function getFileName(url: string, name: string | null): string {
  if (name) return name;
  try {
    return decodeURIComponent(url.split("/").pop() ?? url);
  } catch {
    return url;
  }
}

interface ClearanceViewerProps {
  clearanceDocumentUrl: string | null;
  clearanceDocumentName: string | null;
}

export function ClearanceViewer({ clearanceDocumentUrl, clearanceDocumentName }: ClearanceViewerProps) {
  if (!clearanceDocumentUrl) {
    return (
      <Alert className="border-red-200 bg-red-50 dark:border-red-900 dark:bg-red-950/40">
        <AlertTriangle className="h-4 w-4 text-red-600 dark:text-red-400" />
        <AlertDescription className="text-red-700 text-sm dark:text-red-300">
          ⚠️ No clearance document uploaded yet. You cannot approve this request.
        </AlertDescription>
      </Alert>
    );
  }

  const isImage = isImageUrl(clearanceDocumentUrl);
  const fileName = getFileName(clearanceDocumentUrl, clearanceDocumentName);

  return (
    <div className="space-y-3">
      {/* Thumbnail preview for images */}
      {isImage && (
        <a href={clearanceDocumentUrl} target="_blank" rel="noreferrer">
          {/* biome-ignore lint/performance/noImgElement: document preview */}
          <img
            src={clearanceDocumentUrl}
            alt="Clearance document preview"
            className="max-h-40 cursor-pointer rounded-lg border border-border object-cover transition-opacity hover:opacity-90"
          />
        </a>
      )}

      {/* File info row */}
      <div className="flex items-center gap-3 rounded-lg border border-border bg-muted/30 p-3">
        {isImage ? (
          <FileImage className="h-5 w-5 shrink-0 text-blue-500" />
        ) : (
          <FileText className="h-5 w-5 shrink-0 text-red-500" />
        )}
        <span className="flex-1 truncate font-medium text-foreground text-sm">{fileName}</span>
        <Button asChild variant="outline" size="sm" className="h-7 shrink-0 gap-1.5 text-xs">
          <a href={clearanceDocumentUrl} target="_blank" rel="noreferrer">
            Open Document
            <ExternalLink className="h-3 w-3" />
          </a>
        </Button>
      </div>
    </div>
  );
}
