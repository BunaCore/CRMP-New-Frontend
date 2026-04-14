"use client";

import DOMPurify from "dompurify";
import { Download, ExternalLink, FileText, Layout, RotateCw, Search } from "lucide-react";

import { Button } from "@/components/ui/button";

import DocumentEditor from "../editor";
import { useWorkspace } from "./workspace-context";

export function MainView({ workspaceId, projectId }: { workspaceId: string; projectId: string }) {
  const { activeView, activeFile, setActiveView } = useWorkspace();

  if (activeView === "editor") {
    return (
      <div className="group relative flex h-full w-full min-w-0 flex-1 flex-col overflow-hidden bg-background">
        <div className="w-full min-w-0 flex-1 overflow-hidden">
          <DocumentEditor workspaceId={workspaceId} projectId={projectId} />
        </div>
      </div>
    );
  }

  if (activeView === "file-viewer" && activeFile) {
    return (
      <div className="group relative flex h-full flex-1 flex-col overflow-hidden bg-muted/30">
        <div className="flex items-center justify-between border-b bg-card px-6 py-4 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <FileText className="h-5 w-5" />
            </div>
            <div className="max-w-sm truncate">
              <h3 className="truncate font-bold tracking-tight">{activeFile.name}</h3>
              <p className="text-muted-foreground text-xs uppercase">{activeFile.type} DOCUMENT</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="gap-2">
              <Download className="h-4 w-4" />
              Download
            </Button>
            <Button variant="ghost" size="icon">
              <ExternalLink className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" onClick={() => setActiveView("editor")}>
              <RotateCw className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <div className="relative flex-1 overflow-hidden p-6">
          <div className="flex h-full flex-col overflow-hidden rounded-2xl border bg-white shadow-xl dark:bg-black/40">
            <div className="flex items-center justify-center gap-4 border-b bg-muted/20 p-2">
              <Button variant="ghost" size="icon" className="h-7 w-7">
                <Search className="h-4 w-4" />
              </Button>
              <div className="h-4 w-px bg-border" />
              <span className="font-medium text-[10px] text-muted-foreground uppercase tracking-widest">
                Preview Mode
              </span>
            </div>
            <div className="flex-1 overflow-y-auto p-12 lg:p-20">
              <article className="prose prose-sm lg:prose-base dark:prose-invert fade-in slide-in-from-bottom-5 mx-auto max-w-none animate-in duration-500">
                {/**
                  NOTE: This HTML preview is sanitized with DOMPurify before rendering.
                  Biome will always warn about dangerouslySetInnerHTML, but this is safe and industry standard.
                */}
                {parse(DOMPurify.sanitize(activeFile.content || "<p>No content available for preview.</p>"))}
              </article>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-1 items-center justify-center bg-muted/5">
      <div className="zoom-in-95 max-w-xs animate-in space-y-4 text-center duration-500">
        <Layout className="mx-auto h-12 w-12 text-muted-foreground opacity-20" />
        <h3 className="font-semibold text-lg tracking-tight">Accessing workspace...</h3>
        <p className="text-muted-foreground text-sm italic leading-relaxed">
          Initializing your project-centered workspace. Please wait.
        </p>
      </div>
    </div>
  );
}

import parse from "html-react-parser";
