"use client";

import * as React from "react";
import type { FileDetails } from "@/lib/api/files/types";
import { Button } from "@/components/ui/button";
import { ExternalLink } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface DocumentPreviewProps {
  file: FileDetails;
  trigger?: React.ReactNode;
}

export function DocumentPreview({ file, trigger }: DocumentPreviewProps) {
  const isImage = file.mimeType?.startsWith("image/");
  const isPdf = file.mimeType === "application/pdf";

  const triggerNode = trigger || (
    <Button variant="ghost" size="sm">
      View Document
    </Button>
  );

  return (
    <Dialog>
      <DialogTrigger asChild>
        {triggerNode}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[95vw] lg:max-w-[1200px] w-[96vw] max-h-[90vh] flex flex-col p-6 overflow-hidden">
        <DialogHeader className="flex flex-row items-center justify-between border-b pb-4 gap-4 pr-10">
          <div>
            <DialogTitle className="text-lg font-semibold truncate max-w-[500px]">
              {file.name}
            </DialogTitle>
            <p className="text-sm text-muted-foreground">
              {Math.round((file.size ?? 0) / 1024)} KB — {file.mimeType}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <a
              href={file.url}
              target="_blank"
              rel="noreferrer"
              aria-label="Open in new tab"
            >
              <Button variant="secondary" className="h-9 w-9 p-0">
                <ExternalLink className="h-4 w-4" />
              </Button>
            </a>
          </div>
        </DialogHeader>

        <div className="flex-1 overflow-auto mt-4 min-h-0">
          {isImage && (
            <img
              src={file.url}
              alt={file.name}
              className="mx-auto w-auto max-h-[70vh] object-contain"
            />
          )}

          {isPdf && (
            <iframe
              src={file.url}
              title={file.name}
              className="h-[70vh] w-full border rounded-md"
            />
          )}

          {!isImage && !isPdf && (
            <div className="flex flex-col items-start gap-3 py-3">
              <a
                href={file.url}
                target="_blank"
                rel="noreferrer"
                className="text-blue-600 underline font-semibold"
              >
                Open / Download file
              </a>
              <p className="text-sm text-muted-foreground">
                {file.mimeType}
              </p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default DocumentPreview;
