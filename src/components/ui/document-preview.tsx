"use client";

import * as React from "react";
import { createPortal } from "react-dom";
import type { FileDetails } from "@/lib/api/files/types";
import { Button } from "@/components/ui/button";
import { ExternalLink, X } from "lucide-react";

interface DocumentPreviewProps {
  file: FileDetails;
  trigger?: React.ReactNode;
}

export function DocumentPreview({ file, trigger }: DocumentPreviewProps) {
  const [open, setOpen] = React.useState(false);
  const isImage = file.mimeType?.startsWith("image/");
  const isPdf = file.mimeType === "application/pdf";

  React.useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    if (open) document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  const triggerNode = React.isValidElement(trigger) ? (
    React.cloneElement(trigger as React.ReactElement, {
      onClick: (e: any) => {
        e?.preventDefault?.();
        setOpen(true);
        trigger.props?.onClick?.(e);
      },
    })
  ) : (
    <Button variant="ghost" size="sm" onClick={() => setOpen(true)}>
      View Document
    </Button>
  );

  return (
    <>
      {triggerNode}
      {open &&
        createPortal(
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div
              className="absolute inset-0 bg-black/50"
              onMouseDown={() => setOpen(false)}
            />

            <div
              role="dialog"
              aria-modal="true"
              className="relative w-[min(96vw,1000px)] max-h-[90vh] overflow-hidden rounded-xl bg-popover p-4 shadow-lg"
              onMouseDown={(e) => e.stopPropagation()}
            >
              <div className="mb-2 flex items-start justify-between gap-4">
                <div>
                  <h3 className="text-lg font-semibold">{file.originalName}</h3>
                  <p className="text-sm text-muted-foreground">
                    {Math.round((file.size ?? 0) / 1024)} KB — {file.mimeType}
                  </p>
                </div>
                <div className="ml-auto flex items-center gap-2">
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
                  <Button
                    variant="secondary"
                    className="h-9 w-9 p-0"
                    onClick={() => setOpen(false)}
                    aria-label="Close preview"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="max-h-[calc(90vh-120px)] overflow-auto">
                {isImage && (
                  <img
                    src={file.url}
                    alt={file.originalName}
                    className="mx-auto w-auto max-h-[70vh] object-contain"
                  />
                )}

                {isPdf && (
                  <iframe
                    src={file.url}
                    title={file.originalName}
                    className="h-[70vh] w-full border"
                  />
                )}

                {!isImage && !isPdf && (
                  <div className="flex flex-col items-start gap-3 py-3">
                    <a
                      href={file.url}
                      target="_blank"
                      rel="noreferrer"
                      className="text-blue-600 underline"
                    >
                      Open / Download file
                    </a>
                    <p className="text-sm text-muted-foreground">
                      {file.mimeType}
                    </p>
                  </div>
                )}
              </div>

              {/* actions moved to header */}
            </div>
          </div>,
          document.body,
        )}
    </>
  );
}

export default DocumentPreview;
