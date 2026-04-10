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
    <div className="border-border bg-background relative flex h-full flex-col border-r">
      {/* PDF Toolbar */}
      <div className="border-border bg-background text-muted-foreground relative z-10 flex h-12 w-full flex-shrink-0 items-center justify-between border-b px-5">
        <div className="flex items-center gap-6">
          <Menu className="hover:text-foreground h-4 w-4 cursor-pointer transition-colors" />
          <Search className="hover:text-foreground h-4 w-4 cursor-pointer transition-colors" />
          <PenTool className="hover:text-foreground h-4 w-4 cursor-pointer transition-colors" />
          <span className="hover:text-foreground ml-2 flex cursor-pointer items-center gap-1.5 text-[12px] font-semibold transition-colors">
            100% <ChevronDown className="text-muted-foreground h-3 w-3" />
          </span>
        </div>
        <div className="text-muted-foreground flex items-center gap-3 text-[12px] font-medium">
          <Button variant="ghost" size="icon" className="hover:bg-muted h-7 w-7 rounded-md">
            <ChevronLeft className="h-3.5 w-3.5" />
          </Button>
          <div className="flex items-center gap-1.5">
            <div className="border-border bg-background text-foreground w-8 rounded border py-0.5 text-center shadow-sm">
              1
            </div>
            <span className="text-muted-foreground">/ 15</span>
          </div>
          <Button variant="ghost" size="icon" className="hover:bg-muted h-7 w-7 rounded-md">
            <ChevronRight className="h-3.5 w-3.5" />
          </Button>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="hover:bg-muted h-8 w-8 rounded-full">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Dummy PDF Embed Container */}
      <div className="bg-muted/30 relative flex w-full flex-1 flex-col overflow-hidden p-4 md:p-6">
        <div className="border-border bg-background relative mx-auto flex w-full max-w-5xl flex-1 flex-col overflow-hidden rounded-lg border shadow-sm">
          <div className="absolute inset-0 -z-0 flex items-center justify-center">
            <div className="text-muted-foreground text-center">
              <FileText className="mx-auto mb-3 h-12 w-12 opacity-20" />
              <p className="text-foreground font-medium">Loading uploaded PDF...</p>
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
