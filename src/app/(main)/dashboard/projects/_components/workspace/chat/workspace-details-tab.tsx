"use client";

import { Activity, AlignLeft, Clock, Download, FileText, Share, Sparkles, Users } from "lucide-react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";

import { useWorkspace } from "../workspace-context";

export function WorkspaceDetailsTab() {
  // Use real backend data provided by the WorkspaceContext
  const { projectMembers, loading, workspaces, isSoloProject } = useWorkspace();

  // Helper to extract initials from full name
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .substring(0, 2)
      .toUpperCase();
  };

  return (
    <ScrollArea className="min-h-0 flex-1">
      <div className="flex flex-col gap-6 p-5">
        {/* Document Header & AI Summary */}
        <div className="space-y-4">
          <div>
            <h3 className="font-semibold text-lg tracking-tight">Project Overview</h3>
            <p className="mt-1 text-muted-foreground text-xs">Detailed metrics and intelligent insights.</p>
          </div>

          <div className="relative overflow-hidden rounded-xl border border-primary/20 bg-primary/5 p-4 shadow-sm dark:border-primary/30 dark:bg-primary/10">
            <div className="mb-2 flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-primary" />
              <span className="font-semibold text-primary text-xs uppercase tracking-wider">AI Auto-Summary</span>
            </div>
            <p className="text-foreground/80 text-sm leading-relaxed">
              This document serves as the primary collaborative workspace for your project. Features and sections will
              automatically synchronize among active team members.
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            className="w-full flex-1 gap-2 font-medium text-xs dark:border-zinc-800 dark:bg-zinc-900/50 dark:hover:bg-zinc-800"
          >
            <Share className="h-3.5 w-3.5" />
            Share Link
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="w-full flex-1 gap-2 font-medium text-xs dark:border-zinc-800 dark:bg-zinc-900/50 dark:hover:bg-zinc-800"
          >
            <Download className="h-3.5 w-3.5" />
            Export PDF
          </Button>
        </div>

        <Separator className="dark:bg-zinc-800" />

        {/* Document Statistics */}
        <div className="space-y-3">
          <h4 className="flex items-center gap-2 font-medium text-foreground/90 text-sm">
            <Activity className="h-4 w-4 text-muted-foreground" />
            Workspace Stats
          </h4>
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col rounded-lg border border-border bg-card p-3 shadow-sm dark:border-zinc-800 dark:bg-zinc-900/50">
              <div className="mb-1 flex items-center gap-2 text-muted-foreground">
                <FileText className="h-3.5 w-3.5" />
                <span className="font-medium text-[10px] uppercase tracking-wider">Workspaces</span>
              </div>
              <span className="font-semibold text-lg tracking-tight">
                {loading ? <Skeleton className="mt-1 h-6 w-8 dark:bg-zinc-800" /> : workspaces.length}
              </span>
            </div>
            <div className="flex flex-col rounded-lg border border-border bg-card p-3 shadow-sm dark:border-zinc-800 dark:bg-zinc-900/50">
              <div className="mb-1 flex items-center gap-2 text-muted-foreground">
                <Users className="h-3.5 w-3.5" />
                <span className="font-medium text-[10px] uppercase tracking-wider">Members</span>
              </div>
              <span className="font-semibold text-lg tracking-tight">
                {loading ? <Skeleton className="mt-1 h-6 w-8 dark:bg-zinc-800" /> : projectMembers.length}
              </span>
            </div>
            <div className="flex flex-col rounded-lg border border-border bg-card p-3 shadow-sm dark:border-zinc-800 dark:bg-zinc-900/50">
              <div className="mb-1 flex items-center gap-2 text-muted-foreground">
                <AlignLeft className="h-3.5 w-3.5" />
                <span className="font-medium text-[10px] uppercase tracking-wider">Type</span>
              </div>
              <span className="mt-0.5 font-semibold text-sm tracking-tight">
                {loading ? (
                  <Skeleton className="h-5 w-16 dark:bg-zinc-800" />
                ) : isSoloProject ? (
                  "Solo"
                ) : (
                  "Collaborative"
                )}
              </span>
            </div>
            <div className="flex flex-col rounded-lg border border-border bg-card p-3 shadow-sm dark:border-zinc-800 dark:bg-zinc-900/50">
              <div className="mb-1 flex items-center gap-2 text-muted-foreground">
                <Clock className="h-3.5 w-3.5" />
                <span className="font-medium text-[10px] uppercase tracking-wider">Status</span>
              </div>
              <span className="mt-0.5 font-semibold text-green-600 text-sm tracking-tight dark:text-green-400">
                Active
              </span>
            </div>
          </div>
        </div>

        <Separator className="dark:bg-zinc-800" />

        {/* Real Data: Project Members from Backend */}
        <div className="space-y-3 pb-6">
          <div className="flex items-center justify-between">
            <h4 className="flex items-center gap-2 font-medium text-foreground/90 text-sm">
              <Users className="h-4 w-4 text-muted-foreground" />
              Project Team
            </h4>
            <Badge variant="secondary" className="bg-primary/10 text-[10px] text-primary hover:bg-primary/20">
              {loading ? "Loading..." : `${projectMembers.length} Members`}
            </Badge>
          </div>

          <div className="mt-2 flex flex-col gap-3">
            {loading ? (
              // Loading Skeletons
              Array.from({ length: 3 }).map((_, i) => (
                // biome-ignore lint/suspicious/noArrayIndexKey: Skeletons are static and do not reorder
                <div key={i} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Skeleton className="h-8 w-8 rounded-full dark:bg-zinc-800" />
                    <div className="flex flex-col gap-1.5">
                      <Skeleton className="h-3.5 w-24 dark:bg-zinc-800" />
                      <Skeleton className="h-2.5 w-16 dark:bg-zinc-800" />
                    </div>
                  </div>
                  <Skeleton className="h-3 w-12 dark:bg-zinc-800" />
                </div>
              ))
            ) : projectMembers.length === 0 ? (
              <div className="py-4 text-center text-muted-foreground text-xs">No members found.</div>
            ) : (
              projectMembers.map((member) => (
                <div key={member.userId} className="group flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-8 w-8 border border-background">
                      <AvatarFallback className="bg-primary/10 font-medium text-primary text-xs dark:bg-primary/20">
                        {getInitials(member.fullName)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                      <span className="font-medium text-sm">{member.fullName}</span>
                      <span className="max-w-[120px] truncate text-[10px] text-muted-foreground">{member.email}</span>
                    </div>
                  </div>
                  <span className="font-medium text-[10px] text-muted-foreground/50 uppercase tracking-widest">
                    {member.role || "Member"}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </ScrollArea>
  );
}
