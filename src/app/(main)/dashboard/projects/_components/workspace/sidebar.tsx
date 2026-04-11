"use client";

import { useRef } from "react";

import Link from "next/link";

import { ArrowLeft, ChevronRight, Files, FileText, Layout, Plus, Upload } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

import { type FileData, useWorkspace } from "./workspace-context";

interface SidebarProps {
  projectName: string;
}

export function Sidebar({ projectName }: SidebarProps) {
  const { files, addFile, activeFile, setActiveFile, activeView, setActiveView } = useWorkspace();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const mammoth = await import("mammoth");
    const arrayBuffer = await file.arrayBuffer();
    const result = await mammoth.convertToHtml({ arrayBuffer });

    const newFileData: FileData = {
      id: Math.random().toString(36).substr(2, 9),
      name: file.name,
      type: file.name.endsWith(".pdf") ? "pdf" : "docx",
      content: result.value,
    };

    addFile(newFileData);
    toast.success("File uploaded successfully");
  };

  return (
    <div className="flex h-full w-72 shrink-0 flex-col gap-4 border-r bg-muted/20 p-4 transition-all duration-300">
      <div className="flex flex-col gap-4">
        <Link
          href="/dashboard/projects"
          className="group mb-2 flex items-center gap-2 text-muted-foreground text-xs transition-colors hover:text-primary"
        >
          <ArrowLeft className="group-hover:-translate-x-1 h-3 w-3 transition-transform" />
          Back to Projects
        </Link>
        <div className="flex items-center justify-between">
          <h2 className="flex-1 truncate font-bold text-xl tracking-tight" title={projectName}>
            {projectName}
          </h2>
        </div>
      </div>

      <Separator />

      <div className="flex flex-col gap-2">
        <Button
          variant={activeView === "editor" ? "secondary" : "ghost"}
          className="group relative h-10 w-full justify-start gap-3 px-3"
          onClick={() => {
            setActiveView("editor");
            setActiveFile(null);
          }}
        >
          <Layout className="h-4 w-4" />
          <span>Workspace</span>
          {activeView === "editor" && <div className="absolute right-3 h-1.5 w-1.5 rounded-full bg-primary" />}
        </Button>
      </div>

      <Separator />

      <div className="flex flex-1 flex-col gap-4 overflow-hidden">
        <div className="flex items-center justify-between px-2">
          <h3 className="flex items-center gap-2 font-semibold text-muted-foreground/80 text-xs uppercase tracking-wider">
            <Files className="h-3 w-3" />
            Files
          </h3>
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6 rounded-md hover:bg-primary/10 hover:text-primary"
            onClick={() => fileInputRef.current?.click()}
          >
            <Plus className="h-4 w-4" />
          </Button>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            className="hidden"
            accept=".doc,.docx,.pdf"
          />
        </div>

        <div className="flex-1 space-y-1 overflow-y-auto pr-2">
          {files.map((file) => (
            <button
              type="button"
              key={file.id}
              onClick={() => {
                setActiveFile(file);
                setActiveView("file-viewer");
              }}
              className={cn(
                "group relative flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-sm transition-all duration-200",
                activeFile?.id === file.id
                  ? "bg-primary/10 font-medium text-primary"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground",
              )}
            >
              <div
                className={cn(
                  "flex h-8 w-8 shrink-0 items-center justify-center rounded-md border transition-colors",
                  activeFile?.id === file.id
                    ? "border-primary/20 bg-primary/5"
                    : "border-border bg-background group-hover:border-muted-foreground/30",
                )}
              >
                <FileText className="h-4 w-4 opacity-70" />
              </div>
              <span className="flex-1 truncate">{file.name}</span>
              <ChevronRight
                className={cn(
                  "h-3 w-3 transition-all duration-300",
                  activeFile?.id === file.id ? "translate-x-0 opacity-100" : "-translate-x-2 opacity-0",
                )}
              />
            </button>
          ))}

          {files.length === 0 && (
            <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed bg-muted/10 p-8 opacity-60">
              <Upload className="h-8 w-8 text-muted-foreground/40" />
              <p className="text-center text-muted-foreground text-xs leading-relaxed">
                No files uploaded yet. <br />
                Drag & drop or Click +
              </p>
            </div>
          )}
        </div>
      </div>

      <div className="border-t p-2 pt-4">
        <Button
          className="w-full gap-2 shadow-sm transition-shadow hover:shadow-md"
          size="sm"
          onClick={() => fileInputRef.current?.click()}
        >
          <Upload className="h-4 w-4 font-bold" />
          Upload Document
        </Button>
      </div>
    </div>
  );
}
