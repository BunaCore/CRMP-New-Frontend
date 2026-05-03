"use client";

import { useState } from "react";

import {
  BarChart3,
  ChevronRight,
  ClipboardList,
  Layout,
  MessageSquare,
  MoreHorizontal,
  Paperclip,
  Plus,
  Search,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

type Tab = "summary" | "board" | "list" | "issues";

export function TaskManagerModal({ children }: { children: React.ReactNode }) {
  const [activeTab, setActiveTab] = useState<Tab>("summary");

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="h-screen w-screen max-w-none gap-0 overflow-hidden rounded-none border-none bg-[#f4f5f7] p-0 shadow-none">
        <DialogHeader className="border-[#dfe1e6] border-b bg-white px-6 pt-6 pb-0">
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-[#6554C0] p-2 text-white">
                <ClipboardList className="h-5 w-5" />
              </div>
              <DialogTitle className="font-bold text-[#172b4d] text-xl">Task Management</DialogTitle>
            </div>
          </div>

          <nav className="flex items-center gap-8">
            <NavItem
              active={activeTab === "summary"}
              onClick={() => setActiveTab("summary")}
              icon={<BarChart3 className="h-4 w-4" />}
              label="Summary"
            />
            <NavItem
              active={activeTab === "board"}
              onClick={() => setActiveTab("board")}
              icon={<Layout className="h-4 w-4" />}
              label="Board"
            />
            <NavItem
              active={activeTab === "list"}
              onClick={() => setActiveTab("list")}
              icon={<ClipboardList className="h-4 w-4" />}
              label="List"
            />
          </nav>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto p-10">
          {activeTab === "summary" && <SummaryView />}
          {activeTab === "board" && <BoardView />}
        </div>
      </DialogContent>
    </Dialog>
  );
}

function NavItem({
  active,
  onClick,
  icon,
  label,
}: {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "relative flex items-center gap-2 pb-3 font-medium text-sm transition-all",
        active ? "text-[#6554C0]" : "text-[#42526e] hover:text-[#172b4d]",
      )}
    >
      {icon}
      {label}
      {active && <div className="absolute right-0 bottom-0 left-0 h-[3px] rounded-t-full bg-[#6554C0]" />}
    </button>
  );
}

function SummaryView() {
  return (
    <div className="fade-in slide-in-from-bottom-2 animate-in space-y-8 duration-300">
      {/* Stat Cards */}
      <div className="grid grid-cols-4 gap-4">
        <StatCard label="Total tasks" value="24" color="#0052cc" />
        <StatCard label="In progress" value="8" color="#6554C0" />
        <StatCard label="Done" value="12" color="#36b37e" />
        <StatCard label="Blocked" value="4" color="#ff5630" />
      </div>

      {/* Empty State Panels */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <EmptyPanel
          title="Recent activity"
          description="Keep track of what's happening in your project. Activity will show up here as your team works."
        />
        <EmptyPanel
          title="Your work"
          description="Tasks assigned to you will appear here. Start by creating a task or assigning one to yourself."
        />
      </div>
    </div>
  );
}

function StatCard({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <div className="rounded-xl border border-[#dfe1e6] bg-white p-6 shadow-[0_1px_1px_rgba(9,30,66,0.25),0_0_1px_0_rgba(9,30,66,0.31)] transition-all hover:shadow-md">
      <p className="mb-1 font-bold text-[#6b778c] text-xs uppercase tracking-wider">{label}</p>
      <div className="flex items-center gap-2">
        <div className="h-2 w-2 rounded-full" style={{ backgroundColor: color }} />
        <span className="font-bold text-2xl text-[#172b4d]">{value}</span>
      </div>
    </div>
  );
}

function EmptyPanel({ title, description }: { title: string; description: string }) {
  return (
    <div className="flex min-h-[300px] flex-col items-center justify-center rounded-xl border border-[#dfe1e6] bg-white p-12 text-center shadow-sm">
      <div className="mb-6 rounded-full bg-[#f4f5f7] p-4">
        <ClipboardList className="h-8 w-8 text-[#6b778c] opacity-50" />
      </div>
      <h3 className="mb-2 font-bold text-[#172b4d] text-lg">{title}</h3>
      <p className="max-w-[280px] text-[#6b778c] text-sm leading-relaxed">{description}</p>
    </div>
  );
}

function BoardView() {
  return (
    <div className="fade-in slide-in-from-right-4 flex h-full animate-in flex-col space-y-6 duration-300">
      {/* Board Header / Toolbar */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="-translate-y-1/2 absolute top-1/2 left-3 h-4 w-4 text-[#6b778c]" />
            <Input
              placeholder="Search board"
              className="h-9 w-[240px] border-[#dfe1e6] bg-white pl-10 focus-visible:ring-[#6554C0]"
            />
          </div>
          <div className="-space-x-2 flex">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-white bg-[#6554C0] font-bold text-[10px] text-white shadow-sm"
              >
                JD
              </div>
            ))}
            <div className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-white bg-[#ebecf0] font-bold text-[#42526e] text-[10px] shadow-sm">
              +5
            </div>
          </div>
        </div>
        <Button
          size="sm"
          className="h-9 gap-2 border-none bg-[#ebecf0] px-4 font-semibold text-[#42526e] hover:bg-[#dfe1e6]"
        >
          <Plus className="h-4 w-4" />
          Create
        </Button>
      </div>

      {/* Kanban Board */}
      <div className="flex flex-1 gap-4 overflow-x-auto pb-4">
        <BoardColumn title="TO DO" count={4}>
          <TaskCard id="TASK-1" title="Research competitor features" priority="High" />
          <TaskCard id="TASK-2" title="Draft initial project scope" priority="Medium" />
          <TaskCard id="TASK-3" title="Define user personas" priority="Low" />
          <TaskCard id="TASK-4" title="Initial layout sketches" priority="High" />
        </BoardColumn>

        <BoardColumn title="IN PROGRESS" count={2}>
          <TaskCard id="TASK-5" title="Implement authentication flow" priority="High" />
          <TaskCard id="TASK-6" title="Design system documentation" priority="Medium" />
        </BoardColumn>

        {/* Vertically Collapsed Column */}
        <div className="flex w-12 shrink-0 flex-col items-center gap-4 rounded-lg border border-[#dfe1e6] bg-[#ebecf0]/50 py-4">
          <span className="rotate-180 font-bold text-[#6b778c] text-[10px] tracking-widest [writing-mode:vertical-lr]">
            DONE
          </span>
          <div className="rounded-full border border-[#dfe1e6] bg-white px-1.5 py-0.5 font-bold text-[10px]">12</div>
          <div className="mt-auto">
            <ChevronRight className="h-4 w-4 text-[#6b778c]" />
          </div>
        </div>

        <BoardColumn title="REVIEW" count={1}>
          <TaskCard id="TASK-7" title="Code review for API gateway" priority="High" />
        </BoardColumn>
      </div>
    </div>
  );
}

function BoardColumn({ title, count, children }: { title: string; count: number; children: React.ReactNode }) {
  return (
    <div className="flex w-[300px] shrink-0 flex-col rounded-lg bg-[#ebecf0]/50 p-3">
      <div className="mb-4 flex items-center justify-between px-1">
        <div className="flex items-center gap-2">
          <h4 className="font-bold text-[#6b778c] text-[11px] uppercase tracking-wider">{title}</h4>
          <span className="rounded-full bg-[#dfe1e6] px-1.5 py-0.5 font-bold text-[#42526e] text-[10px]">{count}</span>
        </div>
        <Button variant="ghost" size="icon" className="h-6 w-6 text-[#6b778c]">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </div>
      <div className="space-y-3 overflow-y-auto pr-1">
        {children}
        <Button
          variant="ghost"
          className="h-9 w-full justify-start gap-2 font-medium text-[#42526e] text-sm hover:bg-[#ebecf0]"
        >
          <Plus className="h-4 w-4" />
          Create task
        </Button>
      </div>
    </div>
  );
}

function TaskCard({ id, title, priority }: { id: string; title: string; priority: "High" | "Medium" | "Low" }) {
  return (
    <div className="cursor-grab rounded-lg border border-[#dfe1e6] bg-white p-4 shadow-sm transition-all hover:shadow-md active:cursor-grabbing">
      <p className="mb-4 font-medium text-[#172b4d] text-sm leading-tight">{title}</p>
      <div className="mt-auto flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Badge
            variant="outline"
            className={cn(
              "h-5 border-none px-1.5 font-bold text-[9px]",
              priority === "High"
                ? "bg-red-50 text-red-600"
                : priority === "Medium"
                  ? "bg-blue-50 text-blue-600"
                  : "bg-green-50 text-green-600",
            )}
          >
            {priority}
          </Badge>
          <div className="flex items-center gap-1.5 text-[#6b778c]">
            <MessageSquare className="h-3 w-3" />
            <span className="font-medium text-[10px]">2</span>
          </div>
          <div className="flex items-center gap-1.5 text-[#6b778c]">
            <Paperclip className="h-3 w-3" />
            <span className="font-medium text-[10px]">1</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="font-bold text-[#6b778c] text-[10px]">{id}</span>
          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-[#6554C0] font-bold text-[9px] text-white">
            JD
          </div>
        </div>
      </div>
    </div>
  );
}
