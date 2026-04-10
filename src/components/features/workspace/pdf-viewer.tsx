"use client";

import { ChevronDown, ChevronLeft, ChevronRight, FileText, Menu, MoreHorizontal, PenTool, Search } from "lucide-react";

import { Button } from "@/components/ui/button";

interface PDFViewerProps {
  title: string;
  url: string; // the mocked url
}

export function PDFViewer({ title, url }: PDFViewerProps) {
  // In a real application, you'd integrate React-PDF or a robust iframe here.
  // We're mimicking the visual from earlier and a clean dummy embed.
  return (
    <div className="relative flex h-full flex-col border-border border-r bg-background">
      {/* PDF Toolbar */}
      <div className="relative z-10 flex h-12 w-full flex-shrink-0 items-center justify-between border-border border-b bg-background px-5 text-muted-foreground">
        <div className="flex items-center gap-6">
          <Menu className="h-4 w-4 cursor-pointer transition-colors hover:text-foreground" />
          <Search className="h-4 w-4 cursor-pointer transition-colors hover:text-foreground" />
          <PenTool className="h-4 w-4 cursor-pointer transition-colors hover:text-foreground" />
          <span className="ml-2 flex cursor-pointer items-center gap-1.5 font-semibold text-[12px] transition-colors hover:text-foreground">
            100% <ChevronDown className="h-3 w-3 text-muted-foreground" />
          </span>
        </div>
        <div className="flex items-center gap-3 font-medium text-[12px] text-muted-foreground">
          <Button variant="ghost" size="icon" className="h-7 w-7 rounded-md hover:bg-muted">
            <ChevronLeft className="h-3.5 w-3.5" />
          </Button>
          <div className="flex items-center gap-1.5">
            <div className="w-8 rounded border border-border bg-background py-0.5 text-center text-foreground shadow-sm">
              1
            </div>
            <span className="text-muted-foreground">/ 15</span>
          </div>
          <Button variant="ghost" size="icon" className="h-7 w-7 rounded-md hover:bg-muted">
            <ChevronRight className="h-3.5 w-3.5" />
          </Button>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full hover:bg-muted">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Dummy PDF Embed Container */}
      <div className="relative flex w-full flex-1 flex-col overflow-hidden bg-muted/30 p-4 md:p-6">
        <div className="relative mx-auto flex w-full max-w-5xl flex-1 flex-col overflow-hidden rounded-lg border border-border bg-background shadow-sm">
          <div className="-z-0 absolute inset-0 flex items-center justify-center">
            <div className="text-center text-muted-foreground">
              <FileText className="mx-auto mb-3 h-12 w-12 opacity-20" />
              <p className="font-medium text-foreground">Loading uploaded PDF...</p>
              <p className="mt-1 text-xs opacity-70">{title}</p>
            </div>
          </div>

          <iframe
            src={`/api/documents/stream?url=${url}`}
            className="z-10 h-full w-full flex-1 border-none bg-transparent"
            title={title}
          />
        </div>
      </div>
    </div>
  );
}
