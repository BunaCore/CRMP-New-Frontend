"use client";

import * as React from "react";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";

import { ArrowUpRight, ChevronRight, Columns, FileText, Sidebar } from "lucide-react";

import { ChatPanel } from "@/components/features/workspace/chat-panel";
// Feature Components
import { EditorPanel } from "@/components/features/workspace/editor-panel";
import { PDFViewer } from "@/components/features/workspace/pdf-viewer";
import { Button } from "@/components/ui/button";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import { useWorkspaceStore } from "@/store/workspace-store";

export default function FileWorkspacePage() {
  const params = useParams();
  const router = useRouter();
  const fileId = params?.id as string;

  const getFileById = useWorkspaceStore((state) => state.getFileById);
  const selectFile = useWorkspaceStore((state) => state.selectFile);
  const updateContent = useWorkspaceStore((state) => state.updateFileContent);
  const fileContents = useWorkspaceStore((state) => state.fileContents);

  const file = getFileById(fileId);

  React.useEffect(() => {
    selectFile(fileId);
  }, [fileId, selectFile]);

  if (!file) {
    return (
      <div className="flex h-[calc(100vh-8rem)] flex-col items-center justify-center rounded-2xl border border-border bg-muted/50 text-muted-foreground">
        <FileText className="mb-4 h-12 w-12 text-muted-foreground/50" />
        <h2 className="font-semibold text-foreground text-lg">File not found</h2>
        <p className="mt-1 mb-6 text-muted-foreground text-sm">
          The document you're looking for doesn't exist or was removed.
        </p>
        <Button onClick={() => router.push("/dashboard/projects")} variant="outline">
          Return to Projects
        </Button>
      </div>
    );
  }

  const isPDF = file.type === "pdf";
  const mapTypeToLanguage = (type: string) => {
    switch (type) {
      case "ts":
        return "typescript";
      case "js":
        return "javascript";
      case "md":
        return "markdown";
      default:
        return "plaintext";
    }
  };

  const handleEditorChange = (newContent: string) => {
    updateContent(file.id, newContent);
  };

  const activeContent = fileContents[file.id] !== undefined ? fileContents[file.id] : file.content;

  return (
    <div className="flex h-[calc(100vh-6rem)] w-full flex-col overflow-hidden rounded-xl border border-border bg-background font-sans text-foreground shadow-sm">
      {/* Header */}
      <header className="z-10 flex h-14 flex-shrink-0 items-center justify-between border-border border-b bg-background px-5 shadow-sm">
        <div className="flex items-center gap-1.5 font-medium text-[14px] text-muted-foreground">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.push("/dashboard/projects")}
            className="mr-1 h-8 w-8 rounded-md text-muted-foreground hover:text-foreground"
          >
            <Sidebar className="h-4 w-4" />
          </Button>
          <Link
            href="/dashboard/projects"
            className="hidden cursor-pointer transition-colors hover:text-foreground sm:block"
          >
            Projects
          </Link>
          <ChevronRight className="hidden h-4 w-4 text-muted-foreground/50 sm:block" />
          <div className="flex items-center gap-2 rounded-lg border border-border bg-muted/50 px-2.5 py-1.5 text-foreground shadow-sm">
            <FileText className="h-3.5 w-3.5 text-primary" />
            <span className="max-w-[200px] truncate font-semibold md:max-w-[400px]">{file.title}</span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            className="hidden h-8 gap-1.5 rounded-full border-primary/20 bg-primary/10 px-4 font-semibold text-[13px] text-primary shadow-sm transition-colors hover:bg-primary/20 md:flex"
          >
            <ArrowUpRight className="h-3.5 w-3.5" />
            Upgrade UI
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 rounded-full border border-border bg-muted/50 text-muted-foreground hover:text-foreground"
          >
            <Columns className="h-4 w-4" />
          </Button>
        </div>
      </header>

      {/* Main Workspace */}
      <ResizablePanelGroup direction="horizontal" className="h-full flex-1 bg-muted/10">
        {/* Left Panel (Editor / PDF Visualizer) */}
        <ResizablePanel defaultSize={65} minSize={30} className="relative z-10 flex h-full flex-col bg-background">
          {isPDF ? (
            <PDFViewer title={file.title} url={file.content} />
          ) : (
            <EditorPanel
              id={file.id}
              language={mapTypeToLanguage(file.type)}
              initialContent={activeContent}
              onChange={handleEditorChange}
            />
          )}
        </ResizablePanel>

        {/* Resizer */}
        <ResizableHandle
          withHandle
          className="relative z-20 w-[1px] bg-border transition-all hover:w-[4px] hover:bg-primary/50"
        >
          <div className="-translate-x-1/2 -translate-y-1/2 absolute top-1/2 left-1/2 h-8 w-1 rounded-full bg-border" />
        </ResizableHandle>

        {/* Right Panel (Chat) */}
        <ResizablePanel defaultSize={35} minSize={25} className="relative z-0 flex h-full flex-col bg-background">
          <ChatPanel fileId={file.id} fileTitle={file.title} />
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
}
