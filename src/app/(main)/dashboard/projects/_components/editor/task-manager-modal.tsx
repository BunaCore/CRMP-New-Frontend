"use client";

import { useState } from "react";

import {
  addDays,
  addMonths,
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  format,
  isSameDay,
  isSameMonth,
  startOfMonth,
  startOfWeek,
  subDays,
  subMonths,
} from "date-fns";
import {
  BarChart3,
  Calendar,
  ChevronRight,
  ClipboardList,
  Layout,
  MessageSquare,
  MoreHorizontal,
  Paperclip,
  Plus,
  Search,
} from "lucide-react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogOverlay,
  DialogPortal,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { teamMembers } from "@/lib/team-data";
import { cn } from "@/lib/utils";

type Tab = "summary" | "board" | "list" | "issues";

export function TaskManagerModal({ children }: { children: React.ReactNode }) {
  const [activeTab, setActiveTab] = useState<Tab>("summary");

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>

      <DialogPortal>
        <DialogOverlay className="fixed inset-0 bg-black/40 backdrop-blur-sm" />

        <DialogContent className="!fixed !left-1/2 !top-1/2 !h-[92vh] !w-[min(1200px,92vw)] !max-w-none !translate-x-[-50%] !translate-y-[-50%] overflow-hidden rounded-xl bg-[#f4f5f7] p-0 shadow-2xl">
          <div className="flex h-full w-full flex-col">
            {/* HEADER */}
            <DialogHeader className="border-[#dfe1e6] border-b bg-white px-6 pt-6 pb-2">
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
                <NavItem
                  active={activeTab === "issues"}
                  onClick={() => setActiveTab("issues")}
                  icon={<Calendar className="h-4 w-4" />}
                  label="Calendar"
                />
              </nav>
            </DialogHeader>

            {/* CONTENT */}
            <div className="flex-1 overflow-y-auto p-10">
              {activeTab === "summary" && <SummaryView />}
              {activeTab === "board" && <BoardView />}
              {activeTab === "list" && <ListView />}
              {activeTab === "issues" && <CalendarView />}
            </div>
          </div>
        </DialogContent>
      </DialogPortal>
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

function ListView() {
  const tasks = [
    { id: "TASK-1", title: "Research competitor features", status: "TO DO", priority: "High", assignee: "JD" },
    { id: "TASK-2", title: "Draft initial project scope", status: "TO DO", priority: "Medium", assignee: "JD" },
    { id: "TASK-3", title: "Define user personas", status: "TO DO", priority: "Low", assignee: "JD" },
    { id: "TASK-4", title: "Initial layout sketches", status: "TO DO", priority: "High", assignee: "JD" },
    { id: "TASK-5", title: "Implement authentication flow", status: "IN PROGRESS", priority: "High", assignee: "JD" },
    { id: "TASK-6", title: "Design system documentation", status: "IN PROGRESS", priority: "Medium", assignee: "JD" },
    { id: "TASK-7", title: "Code review for API gateway", status: "REVIEW", priority: "High", assignee: "JD" },
  ];

  return (
    <div className="fade-in slide-in-from-bottom-2 flex animate-in flex-col space-y-6 duration-300">
      <div className="flex items-center justify-between">
        <div className="relative">
          <Search className="-translate-y-1/2 absolute top-1/2 left-3 h-4 w-4 text-[#6b778c]" />
          <Input
            placeholder="Search tasks"
            className="h-9 w-[320px] border-[#dfe1e6] bg-white pl-10 focus-visible:ring-[#6554C0]"
          />
        </div>
        <Button size="sm" className="h-9 gap-2 bg-[#6554C0] font-semibold text-white hover:bg-[#5243aa]">
          <Plus className="h-4 w-4" />
          Create task
        </Button>
      </div>

      <div className="overflow-hidden rounded-lg border border-[#dfe1e6] bg-white shadow-sm">
        <table className="w-full border-collapse text-left">
          <thead>
            <tr className="border-[#dfe1e6] border-b bg-[#f4f5f7]">
              <th className="px-4 py-3 font-bold text-[#6b778c] text-[11px] uppercase tracking-wider">Key</th>
              <th className="px-4 py-3 font-bold text-[#6b778c] text-[11px] uppercase tracking-wider">Summary</th>
              <th className="px-4 py-3 font-bold text-[#6b778c] text-[11px] uppercase tracking-wider">Status</th>
              <th className="px-4 py-3 font-bold text-[#6b778c] text-[11px] uppercase tracking-wider">Priority</th>
              <th className="px-4 py-3 text-right font-bold text-[#6b778c] text-[11px] uppercase tracking-wider">
                Assignee
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#dfe1e6]">
            {tasks.map((task) => (
              <tr key={task.id} className="transition-colors hover:bg-[#f4f5f7]/50">
                <td className="px-4 py-3 font-bold text-[#6b778c] text-[11px]">{task.id}</td>
                <td className="px-4 py-3 font-medium text-[#172b4d] text-sm">{task.title}</td>
                <td className="px-4 py-3">
                  <Badge className="bg-[#ebecf0] px-2 py-0.5 font-bold text-[#42526e] text-[10px] hover:bg-[#dfe1e6]">
                    {task.status}
                  </Badge>
                </td>
                <td className="px-4 py-3">
                  <Badge
                    variant="outline"
                    className={cn(
                      "border-none px-1.5 font-bold text-[9px]",
                      task.priority === "High"
                        ? "bg-red-50 text-red-600"
                        : task.priority === "Medium"
                          ? "bg-blue-50 text-blue-600"
                          : "bg-green-50 text-green-600",
                    )}
                  >
                    {task.priority}
                  </Badge>
                </td>
                <td className="px-4 py-3 text-right">
                  <div className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-[#6554C0] font-bold text-[9px] text-white">
                    {task.assignee}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

type Task = {
  id: string;
  title: string;
  color: string;
  assigneeId?: string;
};

type TaskStore = Record<string, Task[]>;

function CalendarView() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<"month" | "week">("month");
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());

  // Initialize tasks state with some mock data
  const [tasks, setTasks] = useState<TaskStore>({
    "2026-04-12": [
      { id: "TASK-1", title: "Competitor Research", color: "#0052cc", assigneeId: "1" },
      { id: "TASK-2", title: "Scope Draft", color: "#6554C0", assigneeId: "2" },
    ],
    "2026-04-15": [{ id: "TASK-5", title: "Auth Flow", color: "#36b37e", assigneeId: "3" }],
    "2026-04-18": [{ id: "TASK-6", title: "Design Review", color: "#ff5630", assigneeId: "4" }],
  });

  const startDate = viewMode === "month" ? startOfWeek(startOfMonth(currentDate)) : startOfWeek(currentDate);
  const endDate = viewMode === "month" ? endOfWeek(endOfMonth(currentDate)) : endOfWeek(currentDate);

  const calendarDays = eachDayOfInterval({ start: startDate, end: endDate });

  const next = () => {
    setCurrentDate(viewMode === "month" ? addMonths(currentDate, 1) : addDays(currentDate, 7));
  };

  const prev = () => {
    setCurrentDate(viewMode === "month" ? subMonths(currentDate, 1) : subDays(currentDate, 7));
  };

  const goToToday = () => {
    const today = new Date();
    setCurrentDate(today);
    setSelectedDate(today);
  };

  const addTaskToDate = (date: Date, title: string, assigneeId: string) => {
    const dateKey = format(date, "yyyy-MM-dd");
    const newTask: Task = {
      id: `TASK-${Math.floor(Math.random() * 1000)}`,
      title: title.trim(),
      color: "#6554C0",
      assigneeId,
    };

    setTasks((prev) => ({
      ...prev,
      [dateKey]: [...(prev[dateKey] || []), newTask],
    }));
  };

  const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  return (
    <div className="fade-in slide-in-from-right-4 flex h-full animate-in flex-col space-y-6 duration-300">
      {/* Calendar Toolbar */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-6">
          <h2 className="w-[180px] font-bold text-[#172b4d] text-xl">
            {viewMode === "month" ? format(currentDate, "MMMM yyyy") : `Week of ${format(startDate, "MMM d")}`}
          </h2>
          <div className="flex items-center rounded-md border border-[#dfe1e6] bg-white shadow-sm">
            <Button
              variant="ghost"
              size="sm"
              onClick={goToToday}
              className="h-8 rounded-r-none border-[#dfe1e6] border-r px-4 font-semibold text-[#42526e] hover:bg-[#f4f5f7]"
            >
              Today
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={prev}
              className="h-8 w-9 rounded-none border-[#dfe1e6] border-r text-[#42526e] hover:bg-[#f4f5f7]"
            >
              <ChevronRight className="h-4 w-4 rotate-180" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={next}
              className="h-8 w-9 rounded-l-none text-[#42526e] hover:bg-[#f4f5f7]"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>

          <Select value={viewMode} onValueChange={(v: "month" | "week") => setViewMode(v)}>
            <SelectTrigger size="sm" className="w-[110px] border-[#dfe1e6] bg-white font-medium text-[#42526e]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="month">Month</SelectItem>
              <SelectItem value="week">Week</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Button size="sm" className="h-9 gap-2 bg-[#6554C0] font-semibold text-white hover:bg-[#5243aa]">
          <Plus className="h-4 w-4" />
          Create task
        </Button>
      </div>

      {/* Calendar Grid Container */}
      <div className="flex flex-1 flex-col overflow-hidden rounded-xl border border-[#dfe1e6] bg-white shadow-sm">
        {/* Days of Week Header */}
        <div className="grid grid-cols-7 border-[#dfe1e6] border-b bg-[#f4f5f7]">
          {weekDays.map((day) => (
            <div
              key={day}
              className="px-4 py-2.5 text-center font-bold text-[#6b778c] text-[11px] uppercase tracking-wider"
            >
              {day}
            </div>
          ))}
        </div>

        {/* The Grid */}
        <div className="grid flex-1 grid-cols-7 overflow-y-auto">
          {calendarDays.map((day, i) => {
            const dateKey = format(day, "yyyy-MM-dd");
            const isCurrentMonthDay = isSameMonth(day, currentDate);
            const isToday = isSameDay(day, new Date());
            const isSelected = selectedDate && isSameDay(day, selectedDate);
            const dayTasks = tasks[dateKey] || [];

            return (
              <Popover key={day.toString()}>
                <PopoverTrigger asChild>
                  <button
                    type="button"
                    onClick={() => setSelectedDate(day)}
                    className={cn(
                      "relative min-h-[120px] cursor-pointer border-[#dfe1e6] border-r border-b p-2 text-left transition-all hover:bg-[#f4f5f7]/60",
                      !isCurrentMonthDay && "bg-[#fafbfc]/80 text-[#a5adba]",
                      isSelected && "bg-[#6554c0]/5 ring-2 ring-[#6554C0] ring-inset",
                      i % 7 === 6 && "border-r-0",
                    )}
                  >
                    <div className="flex items-center justify-between">
                      <span
                        className={cn(
                          "inline-flex h-7 w-7 items-center justify-center rounded-full font-bold text-xs transition-colors",
                          isToday ? "bg-[#6554C0] text-white shadow-sm" : "text-[#172b4d]",
                          !isCurrentMonthDay && "text-[#a5adba]",
                          isSelected && !isToday && "bg-[#ebecf0] text-[#6554C0]",
                        )}
                      >
                        {format(day, "d")}
                      </span>
                    </div>

                    <div className="mt-2 space-y-1.5">
                      {dayTasks.map((task) => (
                        <div
                          key={task.id}
                          className="group cursor-pointer rounded-md border border-[#dfe1e6] bg-white p-1.5 shadow-[0_1px_2px_rgba(9,30,66,0.08)] transition-all hover:border-[#6554C0] hover:shadow-md active:scale-[0.98]"
                        >
                          <div className="flex items-center gap-2 overflow-hidden">
                            <div
                              className="h-2 w-2 shrink-0 rounded-full shadow-inner"
                              style={{ backgroundColor: task.color }}
                            />
                            <span className="truncate font-bold text-[#172b4d] text-[10px] leading-tight">
                              {task.title}
                            </span>
                            {task.assigneeId && (
                              <div className="ml-auto flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-[#ebecf0] font-bold text-[#6b778c] text-[8px]">
                                {teamMembers
                                  .find((m) => m.id === task.assigneeId)
                                  ?.name.split(" ")
                                  .map((n) => n[0])
                                  .join("")}
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </button>
                </PopoverTrigger>
                <PopoverContent className="w-80 p-0 shadow-xl" align="start">
                  <QuickTaskForm date={day} onAdd={(title, assigneeId) => addTaskToDate(day, title, assigneeId)} />
                </PopoverContent>
              </Popover>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function QuickTaskForm({ date, onAdd }: { date: Date; onAdd: (title: string, assigneeId: string) => void }) {
  const [title, setTitle] = useState("");
  const [selectedAssignee, setSelectedAssignee] = useState(teamMembers[0].id);

  return (
    <div className="flex flex-col gap-4 p-4">
      <div className="flex items-center gap-2 border-[#dfe1e6] border-b pb-3">
        <div className="rounded-lg bg-[#6554C0] p-1.5 text-white">
          <Plus className="h-4 w-4" />
        </div>
        <div>
          <h4 className="font-bold text-[#172b4d] text-sm">Create New Task</h4>
          <p className="text-[#6b778c] text-[10px]">{format(date, "EEEE, MMMM d")}</p>
        </div>
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (title.trim()) {
            onAdd(title, selectedAssignee);
            setTitle("");
          }
        }}
        className="space-y-4"
      >
        <div className="space-y-1.5">
          <label htmlFor="task-summary" className="font-bold text-[#6b778c] text-[10px] uppercase tracking-wider">
            Summary
          </label>
          <Input
            id="task-summary"
            autoFocus
            placeholder="What needs to be done?"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="h-9 border-[#dfe1e6] bg-white text-sm focus-visible:ring-[#6554C0]"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="task-assignee" className="font-bold text-[#6b778c] text-[10px] uppercase tracking-wider">
            Assignee
          </label>
          <div id="task-assignee" className="flex flex-wrap gap-2">
            {teamMembers.slice(0, 5).map((member) => (
              <button
                key={member.id}
                type="button"
                onClick={() => setSelectedAssignee(member.id)}
                className={cn(
                  "relative h-8 w-8 rounded-full transition-all hover:scale-110",
                  selectedAssignee === member.id ? "ring-2 ring-[#6554C0] ring-offset-2" : "opacity-60 grayscale-[50%]",
                )}
                title={member.name}
              >
                <Avatar className="h-full w-full">
                  <AvatarFallback className="bg-[#ebecf0] font-bold text-[#42526e] text-[10px]">
                    {member.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
              </button>
            ))}
          </div>
        </div>

        <div className="flex justify-end border-[#dfe1e6] border-t pt-3">
          <Button
            type="submit"
            size="sm"
            disabled={!title.trim()}
            className="h-8 bg-[#6554C0] px-4 font-semibold text-white hover:bg-[#5243aa]"
          >
            Create Task
          </Button>
        </div>
      </form>
    </div>
  );
}
