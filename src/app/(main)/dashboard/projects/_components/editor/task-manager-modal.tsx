"use client";

import { useEffect, useState } from "react";

import { formatDistanceToNow } from "date-fns";
import {
  Activity,
  AlertCircle,
  AlignLeft,
  BarChart3,
  Calendar,
  CheckCircle2,
  CircleDashed,
  ClipboardList,
  Clock,
  CornerDownLeft,
  Flag,
  Layout,
  MoreHorizontal,
  MoreVertical,
  Plus,
  Search,
  TrendingUp,
  UserPlus,
  Users,
} from "lucide-react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import {
  type Task,
  type TaskPriority,
  type TaskStatus,
  useAddComment,
  useCreateTask,
  useTaskActivity,
  useTaskDetail,
  useTaskList,
  useTeamMembers,
  useUpdateTask,
} from "@/lib/api/task-management";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/stores/authStore";

export function TaskManagerModal({ children, projectId }: { children: React.ReactNode; projectId: string }) {
  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="!max-w-[calc(100vw-3rem)] -translate-x-1/2 -translate-y-1/2 fixed top-1/2 left-1/2 flex h-[calc(100vh-3rem)] w-[calc(100vw-3rem)] flex-col gap-0 overflow-hidden rounded-2xl border-border/40 bg-background p-0 shadow-2xl">
        <Tabs defaultValue="board" className="flex h-full min-h-0 flex-col">
          <DialogHeader className="flex shrink-0 flex-col gap-5 border-border/40 border-b bg-card px-5 py-4 sm:px-8 sm:py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-primary/10 bg-gradient-to-br from-primary/20 to-primary/5 text-primary shadow-sm">
                  <ClipboardList className="h-5 w-5" />
                </div>
                <div className="space-y-0.5">
                  <DialogTitle className="font-bold text-foreground text-xl tracking-tight sm:text-2xl">
                    Task Management
                  </DialogTitle>
                  <p className="hidden text-muted-foreground text-sm sm:block">
                    Manage your workspace tasks, sprints, and priorities seamlessly.
                  </p>
                </div>
              </div>
            </div>

            <TabsList className="w-full justify-start gap-6 overflow-x-auto overflow-y-hidden rounded-none border-border/20 border-b bg-transparent p-0 sm:gap-8">
              <TabsTrigger
                value="summary"
                className="relative h-11 rounded-none border-b-2 border-b-transparent bg-transparent px-1 pt-2 pb-3 font-medium text-muted-foreground text-sm shadow-none transition-colors hover:text-foreground data-[state=active]:border-b-primary data-[state=active]:font-semibold data-[state=active]:text-foreground data-[state=active]:shadow-none"
              >
                <BarChart3 className="mr-2 h-4 w-4" />
                Summary
              </TabsTrigger>
              <TabsTrigger
                value="board"
                className="relative h-11 rounded-none border-b-2 border-b-transparent bg-transparent px-1 pt-2 pb-3 font-medium text-muted-foreground text-sm shadow-none transition-colors hover:text-foreground data-[state=active]:border-b-primary data-[state=active]:font-semibold data-[state=active]:text-foreground data-[state=active]:shadow-none"
              >
                <Layout className="mr-2 h-4 w-4" />
                Board
              </TabsTrigger>
              <TabsTrigger
                value="list"
                className="relative h-11 rounded-none border-b-2 border-b-transparent bg-transparent px-1 pt-2 pb-3 font-medium text-muted-foreground text-sm shadow-none transition-colors hover:text-foreground data-[state=active]:border-b-primary data-[state=active]:font-semibold data-[state=active]:text-foreground data-[state=active]:shadow-none"
              >
                <ClipboardList className="mr-2 h-4 w-4" />
                List
              </TabsTrigger>
            </TabsList>
          </DialogHeader>

          <div className="flex min-h-0 flex-1 flex-col overflow-hidden bg-muted/5">
            <TabsContent value="summary" className="m-0 h-full overflow-y-auto p-4 outline-none sm:p-6 lg:p-8">
              <SummaryView projectId={projectId} />
            </TabsContent>
            <TabsContent value="board" className="m-0 flex h-full min-h-0 flex-col p-4 outline-none sm:p-6 lg:p-8">
              <BoardView projectId={projectId} />
            </TabsContent>
            <TabsContent value="list" className="m-0 flex h-full min-h-0 flex-col p-0 outline-none">
              <ListView projectId={projectId} />
            </TabsContent>
          </div>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}

function NewTaskDialog({ children, projectId }: { children: React.ReactNode; projectId: string }) {
  const { data: members = [] } = useTeamMembers(projectId);
  const createTask = useCreateTask(projectId);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState<TaskStatus>("todo");
  const [priority, setPriority] = useState<TaskPriority>("medium");
  const [assigneeId, setAssigneeId] = useState("");
  const [dueDate, setDueDate] = useState("");

  const handleCreate = () => {
    if (title.trim()) {
      createTask.mutate({
        title: title.trim(),
        description: description.trim() || undefined,
        status,
        priority,
        assigneeId: assigneeId || undefined,
        dueDate: dueDate || undefined,
      });
      // Reset form
      setTitle("");
      setDescription("");
      setStatus("todo");
      setPriority("medium");
      setAssigneeId("");
      setDueDate("");
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-w-2xl overflow-hidden rounded-2xl border-border/50 bg-background p-0 shadow-2xl">
        <DialogHeader className="border-border/40 border-b bg-card/50 px-6 py-5">
          <DialogTitle className="font-bold text-foreground text-xl tracking-tight">Create New Task</DialogTitle>
          <DialogDescription className="mt-1 text-sm">
            Fill in the details below to instantly add a new task to your board.
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="max-h-[65vh]">
          <div className="space-y-8 p-6 sm:p-8">
            <div className="space-y-2.5">
              {/* biome-ignore lint/a11y/noLabelWithoutControl: Associated via structure */}
              <label className="font-semibold text-foreground text-sm">Task Title</label>
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="E.g., Implement OAuth authentication flow..."
                className="h-11 border-border/50 bg-muted/10 text-base shadow-sm transition-all focus-visible:ring-primary/30"
              />
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div className="space-y-2.5">
                {/* biome-ignore lint/a11y/noLabelWithoutControl: Associated via structure */}
                <label className="flex items-center gap-1.5 font-semibold text-foreground text-sm">
                  <CircleDashed className="h-4 w-4 text-muted-foreground" /> Status
                </label>
                <Select value={status} onValueChange={(value: TaskStatus) => setStatus(value)}>
                  <SelectTrigger className="h-11 border-border/50 bg-muted/10 text-sm shadow-sm transition-all focus:ring-primary/30">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todo">To Do</SelectItem>
                    <SelectItem value="in_progress">In Progress</SelectItem>
                    <SelectItem value="review">Review</SelectItem>
                    <SelectItem value="done">Done</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2.5">
                {/* biome-ignore lint/a11y/noLabelWithoutControl: Associated via structure */}
                <label className="flex items-center gap-1.5 font-semibold text-foreground text-sm">
                  <Flag className="h-4 w-4 text-muted-foreground" /> Priority
                </label>
                <Select value={priority} onValueChange={(value: TaskPriority) => setPriority(value)}>
                  <SelectTrigger className="h-11 border-border/50 bg-muted/10 text-sm shadow-sm transition-all focus:ring-primary/30">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="low">Low</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div className="space-y-2.5">
                {/* biome-ignore lint/a11y/noLabelWithoutControl: Associated via structure */}
                <label className="flex items-center gap-1.5 font-semibold text-foreground text-sm">
                  <UserPlus className="h-4 w-4 text-muted-foreground" /> Assignee
                </label>
                <Select value={assigneeId} onValueChange={setAssigneeId}>
                  <SelectTrigger className="h-11 border-border/50 bg-muted/10 text-sm shadow-sm transition-all focus:ring-primary/30">
                    <SelectValue placeholder="Select assignee..." />
                  </SelectTrigger>
                  <SelectContent>
                    {members.map((member) => (
                      <SelectItem key={member.id} value={member.id}>
                        <div className="flex items-center gap-2">
                          <Avatar className="h-5 w-5">
                            <AvatarFallback className="bg-primary/10 text-[8px] text-primary">
                              {member.initials ||
                                member.fullName
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")}
                            </AvatarFallback>
                          </Avatar>
                          {member.fullName}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2.5">
                {/* biome-ignore lint/a11y/noLabelWithoutControl: Associated via structure */}
                <label className="flex items-center gap-1.5 font-semibold text-foreground text-sm">
                  <Calendar className="h-4 w-4 text-muted-foreground" /> Due Date
                </label>
                <Input
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="h-11 border-border/50 bg-muted/10 text-sm shadow-sm transition-all focus-visible:ring-primary/30"
                />
              </div>
            </div>

            <div className="space-y-2.5">
              {/* biome-ignore lint/a11y/noLabelWithoutControl: Associated via structure */}
              <label className="font-semibold text-foreground text-sm">Description</label>
              <Textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Add comprehensive details, acceptance criteria, or context here..."
                className="min-h-[140px] resize-none border-border/50 bg-muted/10 p-3.5 text-sm leading-relaxed shadow-sm transition-all focus-visible:ring-primary/30"
              />
            </div>
          </div>
        </ScrollArea>
        <DialogFooter className="flex flex-col gap-3 border-border/40 border-t bg-muted/5 px-6 py-4 sm:flex-row sm:justify-end">
          <DialogClose asChild>
            <Button variant="outline" className="h-10 w-full font-medium sm:w-auto">
              Cancel
            </Button>
          </DialogClose>
          <DialogClose asChild>
            <Button
              onClick={handleCreate}
              disabled={!title.trim() || createTask.isPending}
              className="h-10 w-full font-medium shadow-sm sm:w-auto"
            >
              {createTask.isPending ? "Creating..." : "Create Task"}
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function TaskDetailsDialog({
  id,
  title,
  projectId,
  children,
}: {
  id: string;
  title: string;
  priority: string;
  projectId: string;
  children: React.ReactNode;
}) {
  const { data: task, isLoading } = useTaskDetail(projectId, id);
  const { data: activity = [] } = useTaskActivity(projectId, id);
  const { data: members = [] } = useTeamMembers(projectId);
  const updateTask = useUpdateTask(projectId, id);
  const addComment = useAddComment(projectId, id);

  const [localTitle, setLocalTitle] = useState(title);
  const [localDescription, setLocalDescription] = useState(task?.description || "");
  const [localStatus, setLocalStatus] = useState<TaskStatus>(task?.status || "todo");
  const [localPriority, setLocalPriority] = useState<TaskPriority>(task?.priority || "medium");
  const [localAssigneeId, setLocalAssigneeId] = useState(task?.assigneeId || "");
  const [localDueDate, setLocalDueDate] = useState(task?.dueDate || "");
  const [commentText, setCommentText] = useState("");

  useEffect(() => {
    if (task) {
      setLocalTitle(task.title);
      setLocalDescription(task.description || "");
      setLocalStatus(task.status);
      setLocalPriority(task.priority);
      setLocalAssigneeId(task.assigneeId);
      setLocalDueDate(task.dueDate || "");
    }
  }, [task]);

  const handleSave = () => {
    updateTask.mutate({
      title: localTitle,
      description: localDescription,
      status: localStatus,
      priority: localPriority,
      assigneeId: localAssigneeId,
      dueDate: localDueDate || undefined,
    });
  };

  const handleAddComment = () => {
    if (commentText.trim()) {
      addComment.mutate({ comment: commentText.trim() });
      setCommentText("");
    }
  };

  if (isLoading) {
    return (
      <Dialog>
        <DialogTrigger asChild>{children}</DialogTrigger>
        <DialogContent className="!max-w-[95vw] lg:!max-w-[85vw] xl:!max-w-[1200px] flex h-[90vh] flex-col gap-0 overflow-hidden rounded-2xl border-border/50 bg-background p-0 shadow-2xl">
          <div className="flex h-full items-center justify-center">
            <div className="text-muted-foreground">Loading task details...</div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  if (!task) {
    return (
      <Dialog>
        <DialogTrigger asChild>{children}</DialogTrigger>
        <DialogContent className="!max-w-[95vw] lg:!max-w-[85vw] xl:!max-w-[1200px] flex h-[90vh] flex-col gap-0 overflow-hidden rounded-2xl border-border/50 bg-background p-0 shadow-2xl">
          <div className="flex h-full items-center justify-center">
            <div className="text-destructive">Task not found</div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  const displayId = task.taskCode || task.id;

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="!max-w-[95vw] lg:!max-w-[85vw] xl:!max-w-[1200px] flex h-[90vh] flex-col gap-0 overflow-hidden rounded-2xl border-border/50 bg-background p-0 shadow-2xl">
        <DialogHeader className="flex shrink-0 flex-row items-center justify-between border-border/40 border-b bg-card/50 px-6 py-5">
          <div className="mr-4 flex w-full items-center gap-3">
            <Badge
              variant="secondary"
              className="shrink-0 rounded-md border border-border/50 px-2 py-0.5 font-mono text-muted-foreground text-xs uppercase shadow-sm"
            >
              {displayId}
            </Badge>
            <DialogTitle className="sr-only">{localTitle}</DialogTitle>
            <input
              value={localTitle}
              onChange={(e) => setLocalTitle(e.target.value)}
              className="w-full rounded-md border border-transparent bg-transparent px-2 py-1 font-bold text-foreground text-xl tracking-tight shadow-none outline-none transition-all hover:border-border/60 focus:border-border/60 focus:bg-muted/5 sm:text-2xl"
            />
          </div>
          <div className="flex shrink-0 items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-muted-foreground transition-colors hover:text-foreground"
            >
              <MoreVertical className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>

        <ScrollArea className="flex-1 bg-background">
          <div className="flex min-h-full flex-col lg:flex-row">
            {/* Left Side - Main Content */}
            <div className="min-w-0 flex-1 space-y-10 border-border/40 p-6 sm:p-8 lg:border-r">
              {/* Description Section */}
              <div className="space-y-4">
                <h3 className="flex items-center gap-2.5 font-semibold text-base text-foreground">
                  <AlignLeft className="h-5 w-5 text-muted-foreground" /> Description
                </h3>
                <div className="group relative">
                  <Textarea
                    placeholder="Add a more detailed description..."
                    value={localDescription}
                    onChange={(e) => setLocalDescription(e.target.value)}
                    className="min-h-[160px] resize-y border border-transparent bg-transparent p-4 text-sm leading-relaxed shadow-none transition-all hover:border-border/60 focus:border-border/60 focus:bg-muted/5"
                  />
                </div>
              </div>

              {/* Activity & Comments Section */}
              <div className="space-y-4 border-border/40 border-t pt-6">
                <h3 className="flex items-center gap-2.5 font-semibold text-base text-foreground">
                  <Activity className="h-5 w-5 text-muted-foreground" /> Activity Log
                </h3>

                <div className="mt-2 flex items-center gap-3">
                  <Avatar className="h-7 w-7 shrink-0 border shadow-sm">
                    <AvatarFallback className="bg-primary font-bold text-[9px] text-primary-foreground">
                      YOU
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-1 items-center gap-2 border-border/60 border-b pb-1.5 transition-all focus-within:border-primary">
                    <input
                      value={commentText}
                      onChange={(e) => setCommentText(e.target.value)}
                      placeholder="Write an update or comment..."
                      className="h-7 flex-1 border-none bg-transparent text-xs shadow-none outline-none placeholder:text-muted-foreground"
                    />
                    <Button
                      size="icon"
                      onClick={handleAddComment}
                      className="h-6 w-6 shrink-0 rounded-full bg-primary/10 text-primary shadow-none transition-colors hover:bg-primary hover:text-primary-foreground"
                    >
                      <CornerDownLeft className="h-3 w-3" />
                    </Button>
                  </div>
                </div>

                <div className="mt-6 space-y-4 pl-1">
                  {activity.map((item) => {
                    // Map backend activity → ActivityItem props
                    const mappedItem = {
                      user: item.user,
                      initials: item.initials,
                      action:
                        item.action === "commented"
                          ? "commented"
                          : item.action === "status_changed"
                            ? "changed status to"
                            : item.action === "priority_changed"
                              ? "changed priority to"
                              : item.action === "assigned"
                                ? "updated assignee"
                                : item.action === "created"
                                  ? "created this task"
                                  : item.action,
                      target: item.detail ?? "",
                      status: item.action === "status_changed" ? (item.detail?.split(" → ")[1] ?? "") : "",
                      time: formatDistanceToNow(new Date(item.time), { addSuffix: true }),
                    };
                    return (
                      <ActivityItem
                        key={item.id}
                        user={mappedItem.user}
                        action={mappedItem.action}
                        target={mappedItem.target}
                        status={mappedItem.status}
                        time={mappedItem.time}
                        initials={mappedItem.initials}
                      />
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Right Side - Properties Sidebar */}
            <div className="h-full min-h-[500px] w-full shrink-0 space-y-8 bg-muted/5 p-6 sm:p-8 lg:w-[320px]">
              <div className="space-y-5">
                <h4 className="mb-3 font-semibold text-muted-foreground text-xs uppercase tracking-widest">
                  Properties
                </h4>

                <div className="group flex flex-col justify-between gap-2 py-1 sm:flex-row sm:items-center">
                  <span className="flex w-28 shrink-0 items-center gap-2.5 font-medium text-muted-foreground text-sm">
                    <CircleDashed className="h-4 w-4" /> Status
                  </span>
                  <Select value={localStatus} onValueChange={(value: TaskStatus) => setLocalStatus(value)}>
                    <SelectTrigger className="h-9 w-full justify-between rounded-md border-transparent bg-transparent px-2.5 font-medium text-sm shadow-none transition-colors hover:bg-muted focus:ring-1 focus:ring-primary/30 sm:w-[160px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="todo">
                        <div className="flex items-center gap-2 font-medium text-muted-foreground">
                          <CircleDashed className="h-3.5 w-3.5" /> To Do
                        </div>
                      </SelectItem>
                      <SelectItem value="in_progress">
                        <div className="flex items-center gap-2 font-medium text-blue-600 dark:text-blue-400">
                          <Clock className="h-3.5 w-3.5" /> In Progress
                        </div>
                      </SelectItem>
                      <SelectItem value="review">
                        <div className="flex items-center gap-2 font-medium text-orange-600 dark:text-orange-400">
                          <AlertCircle className="h-3.5 w-3.5" /> Review
                        </div>
                      </SelectItem>
                      <SelectItem value="done">
                        <div className="flex items-center gap-2 font-medium text-emerald-600 dark:text-emerald-400">
                          <CheckCircle2 className="h-3.5 w-3.5" /> Done
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="group flex flex-col justify-between gap-2 py-1 sm:flex-row sm:items-center">
                  <span className="flex w-28 shrink-0 items-center gap-2.5 font-medium text-muted-foreground text-sm">
                    <Flag className="h-4 w-4" /> Priority
                  </span>
                  <Select value={localPriority} onValueChange={(value: TaskPriority) => setLocalPriority(value)}>
                    <SelectTrigger className="h-9 w-full justify-between rounded-md border-transparent bg-transparent px-2.5 font-medium text-sm shadow-none transition-colors hover:bg-muted focus:ring-1 focus:ring-primary/30 sm:w-[160px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="high">
                        <div className="flex items-center gap-2 font-bold text-red-600 dark:text-red-400">
                          <Flag className="h-3.5 w-3.5" /> High
                        </div>
                      </SelectItem>
                      <SelectItem value="medium">
                        <div className="flex items-center gap-2 font-bold text-blue-600 dark:text-blue-400">
                          <Flag className="h-3.5 w-3.5" /> Medium
                        </div>
                      </SelectItem>
                      <SelectItem value="low">
                        <div className="flex items-center gap-2 font-bold text-emerald-600 dark:text-emerald-400">
                          <Flag className="h-3.5 w-3.5" /> Low
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="group flex flex-col justify-between gap-2 py-1 sm:flex-row sm:items-center">
                  <span className="flex w-28 shrink-0 items-center gap-2.5 font-medium text-muted-foreground text-sm">
                    <UserPlus className="h-4 w-4" /> Assignee
                  </span>
                  <Select value={localAssigneeId} onValueChange={setLocalAssigneeId}>
                    <SelectTrigger className="h-9 w-full justify-start gap-2.5 rounded-md border-transparent bg-transparent px-2.5 font-medium text-sm shadow-none transition-colors hover:bg-muted focus:ring-1 focus:ring-primary/30 sm:w-[160px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <div className="px-2 py-1.5">
                        <input
                          placeholder="Search members..."
                          className="mb-1 w-full border-border/50 border-b bg-transparent pb-1.5 text-xs outline-none transition-colors focus:border-primary"
                        />
                      </div>
                      {members.map((member) => (
                        <SelectItem key={member.id} value={member.id}>
                          <div className="flex items-center gap-2 font-medium">
                            <Avatar className="h-5 w-5">
                              <AvatarFallback className="bg-primary/10 text-[8px] text-primary">
                                {member.initials ||
                                  member.fullName
                                    .split(" ")
                                    .map((n) => n[0])
                                    .join("")}
                              </AvatarFallback>
                            </Avatar>
                            {member.fullName}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="group flex flex-col justify-between gap-2 py-1 sm:flex-row sm:items-center">
                  <span className="flex w-28 shrink-0 items-center gap-2.5 font-medium text-muted-foreground text-sm">
                    <Calendar className="h-4 w-4" /> Due Date
                  </span>
                  <input
                    type="date"
                    value={localDueDate}
                    onChange={(e) => setLocalDueDate(e.target.value)}
                    className="h-9 w-full cursor-pointer rounded-md border-transparent bg-transparent px-2.5 font-medium text-sm shadow-none outline-none transition-colors hover:bg-muted focus:ring-1 focus:ring-primary/30 sm:w-[160px]"
                  />
                </div>
              </div>
            </div>
          </div>
        </ScrollArea>
        <DialogFooter className="border-border/40 border-t bg-muted/5 px-6 py-4 sm:justify-end">
          <DialogClose asChild>
            <Button size="sm" onClick={handleSave} className="h-9 px-6 font-medium shadow-sm">
              Save Changes
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function BoardView({ projectId }: { projectId: string }) {
  const { data: tasks = [], isLoading, error } = useTaskList(projectId);
  const { data: members = [] } = useTeamMembers(projectId);

  const groupedTasks = {
    todo: tasks.filter((t) => t.status === "todo"),
    in_progress: tasks.filter((t) => t.status === "in_progress"),
    review: tasks.filter((t) => t.status === "review"),
    done: tasks.filter((t) => t.status === "done"),
  };

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="text-muted-foreground">Loading tasks...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="text-destructive">Failed to load tasks</div>
      </div>
    );
  }

  return (
    <div className="fade-in slide-in-from-right-4 flex h-full min-h-0 animate-in flex-col space-y-6 duration-500">
      {/* Board Header / Toolbar */}
      <div className="flex shrink-0 flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div className="flex w-full items-center gap-4 sm:w-auto">
          <div className="relative flex-1 sm:flex-initial">
            <Search className="-translate-y-1/2 absolute top-1/2 left-3.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search tasks..."
              className="h-10 w-full rounded-full border-border/50 bg-card pl-10 text-sm shadow-sm transition-all focus-visible:ring-primary/20 sm:w-[280px]"
            />
          </div>
          <div className="-space-x-2.5 flex shrink-0 items-center">
            {members.slice(0, 3).map((member) => (
              <Avatar
                key={member.id}
                className="h-8 w-8 cursor-pointer border-2 border-background shadow-sm transition-transform hover:z-10 hover:scale-110"
              >
                <AvatarFallback className="bg-primary font-bold text-[10px] text-primary-foreground">
                  {member.initials ||
                    member.fullName
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                </AvatarFallback>
              </Avatar>
            ))}
            {members.length > 3 && (
              <Avatar className="h-8 w-8 cursor-pointer border-2 border-background shadow-sm transition-transform hover:z-10 hover:scale-110">
                <AvatarFallback className="bg-muted font-bold text-[10px] text-muted-foreground">
                  +{members.length - 3}
                </AvatarFallback>
              </Avatar>
            )}
          </div>
        </div>
      </div>

      {/* Kanban Board Container */}
      <div className="custom-scrollbar -mx-4 sm:-mx-6 lg:-mx-8 min-h-0 w-full flex-1 overflow-x-auto overflow-y-hidden px-4 pb-4 sm:px-6 lg:px-8">
        <div className="flex inline-flex h-full min-h-0 items-start gap-6">
          <BoardColumn
            title="TO DO"
            count={groupedTasks.todo.length}
            projectId={projectId}
            colorClass="bg-slate-50/80 border-slate-200 dark:bg-slate-900/30 dark:border-slate-800"
          >
            {groupedTasks.todo.map((task) => (
              <TaskCard key={task.id} task={task} projectId={projectId} />
            ))}
          </BoardColumn>

          <BoardColumn
            title="IN PROGRESS"
            count={groupedTasks.in_progress.length}
            projectId={projectId}
            colorClass="bg-blue-50/80 border-blue-200 dark:bg-blue-900/30 dark:border-blue-800"
          >
            {groupedTasks.in_progress.map((task) => (
              <TaskCard key={task.id} task={task} projectId={projectId} />
            ))}
          </BoardColumn>

          <BoardColumn
            title="REVIEW"
            count={groupedTasks.review.length}
            projectId={projectId}
            colorClass="bg-amber-50/80 border-amber-200 dark:bg-amber-900/30 dark:border-amber-800"
          >
            {groupedTasks.review.map((task) => (
              <TaskCard key={task.id} task={task} projectId={projectId} />
            ))}
          </BoardColumn>

          {/* DONE Column */}
          <BoardColumn
            title="DONE"
            count={groupedTasks.done.length}
            projectId={projectId}
            colorClass="bg-emerald-50/80 border-emerald-200 dark:bg-emerald-900/30 dark:border-emerald-800"
          >
            {groupedTasks.done.map((task) => (
              <TaskCard key={task.id} task={task} projectId={projectId} />
            ))}
          </BoardColumn>
        </div>
      </div>
    </div>
  );
}

function BoardColumn({
  title,
  count,
  children,
  projectId,
  colorClass,
}: {
  title: string;
  count: number;
  children: React.ReactNode;
  projectId: string;
  colorClass?: string;
}) {
  return (
    <div
      className={cn(
        "flex h-full max-h-full w-[260px] shrink-0 flex-col rounded-2xl border shadow-sm sm:w-[280px]",
        colorClass || "border-border/50 bg-muted/20",
      )}
    >
      <div
        className={cn(
          "flex shrink-0 items-center justify-between rounded-t-2xl border-b p-3",
          colorClass ? "border-black/5 bg-background/40 dark:border-white/5" : "border-border/40 bg-muted/10",
        )}
      >
        <div className="flex items-center gap-2.5">
          <h4 className="font-bold text-[13px] text-foreground uppercase tracking-wide">{title}</h4>
          <span className="flex h-5 w-5 items-center justify-center rounded-md border border-black/5 bg-background font-bold text-[11px] text-foreground shadow-sm dark:border-white/10">
            {count}
          </span>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7 rounded-lg text-muted-foreground transition-all hover:bg-background/80 hover:shadow-sm"
        >
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </div>
      <div className="custom-scrollbar min-h-0 flex-1 overflow-y-auto p-2.5">
        <div className="flex flex-col gap-2.5 pb-2">
          {children}
          <NewTaskDialog projectId={projectId}>
            <Button
              variant="ghost"
              className="mt-1 h-9 w-full justify-start gap-2 rounded-xl border border-border/60 border-dashed font-medium text-muted-foreground text-xs transition-all hover:border-border hover:bg-card hover:text-foreground hover:shadow-sm"
            >
              <Plus className="h-3.5 w-3.5" />
              Add task
            </Button>
          </NewTaskDialog>
        </div>
      </div>
    </div>
  );
}

function TaskCard({ task, projectId }: { task: Task; projectId: string }) {
  const _displayId = task.taskCode || task.id;
  const displayPriority = (task.priority.charAt(0).toUpperCase() + task.priority.slice(1)) as "High" | "Medium" | "Low";

  return (
    <TaskDetailsDialog id={task.id} title={task.title} priority={displayPriority} projectId={projectId}>
      <Card className="hover:-translate-y-0.5 group flex cursor-pointer flex-col overflow-hidden rounded-xl border border-border/60 bg-card shadow-sm transition-all duration-200 hover:border-blue-500/40 hover:shadow-md hover:ring-1 hover:ring-blue-500/20">
        <CardContent className="flex flex-col gap-2.5 p-3.5">
          <div className="flex items-start justify-between gap-2">
            <span className="line-clamp-2 flex-1 font-semibold text-[13px] text-foreground leading-snug transition-colors group-hover:text-blue-600 dark:group-hover:text-blue-400">
              {task.title}
            </span>
            <Avatar className="h-5 w-5 shrink-0 border shadow-sm ring-1 ring-background">
              <AvatarFallback className="bg-blue-100 font-bold text-[8px] text-blue-700 dark:bg-blue-900 dark:text-blue-300">
                {task.assigneeInitials ||
                  task.assigneeName
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
              </AvatarFallback>
            </Avatar>
          </div>

          <div className="mt-1 flex items-center justify-between">
            <Badge
              variant="outline"
              className={cn(
                "border-transparent px-2 py-0.5 font-bold text-[9px] uppercase tracking-wider shadow-sm",
                task.priority === "high"
                  ? "bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-400"
                  : task.priority === "medium"
                    ? "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400"
                    : "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400",
              )}
            >
              {displayPriority}
            </Badge>

            <div className="flex items-center gap-1.5 text-muted-foreground">
              <Calendar className="h-3 w-3" />
              <span className="font-medium text-[10px]">
                {task.dueDate
                  ? new Date(task.dueDate).toLocaleDateString("en-US", { month: "short", day: "numeric" })
                  : "No due date"}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </TaskDetailsDialog>
  );
}

function SummaryView({ projectId }: { projectId: string }) {
  const { data: tasks = [] } = useTaskList(projectId);
  const { data: members = [] } = useTeamMembers(projectId);
  const user = useAuthStore((state) => state.user);

  // Compute stats
  const totalTasks = tasks.length;
  const inProgressTasks = tasks.filter((t) => t.status === "in_progress").length;
  const completedTasks = tasks.filter((t) => t.status === "done").length;
  const blockedTasks = tasks.filter((t) => t.status === "review").length;

  // Compute team workload
  const teamWorkload = members
    .map((member) => {
      const memberTasks = tasks.filter((t) => t.assigneeId === member.id);
      const completed = memberTasks.filter((t) => t.status === "done").length;
      return {
        userId: member.id,
        name: member.fullName,
        taskCount: memberTasks.length,
        completionRate: memberTasks.length > 0 ? Math.round((completed / memberTasks.length) * 100) : 0,
      };
    })
    .filter((w) => w.taskCount > 0);

  // Compute upcoming deadlines for the logged-in user
  const upcomingDeadlines = tasks
    .filter((t) => t.assigneeId === user?.id && t.dueDate && t.status !== "done")
    .sort((a, b) => {
      if (!a.dueDate || !b.dueDate) return 0;
      return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
    })
    .slice(0, 5)
    .map((t) => ({
      id: t.id,
      title: t.title,
      // biome-ignore lint/style/noNonNullAssertion: filtered above
      dueDate: new Date(t.dueDate!).toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" }),
      priority: t.priority,
    }));

  // Construct pseudo recent activity from tasks
  const recentTasks = [...tasks].reverse().slice(0, 5);
  const pseudoActivity = recentTasks.map((t) => ({
    id: t.id,
    user: t.assigneeName || "Unassigned",
    initials: t.assigneeInitials || (t.assigneeName ? t.assigneeName.substring(0, 2).toUpperCase() : "U"),
    action: "was assigned to",
    target: t.title,
    status: t.status,
    time: t.createdAt ? formatDistanceToNow(new Date(t.createdAt), { addSuffix: true }) : "Recently",
  }));

  return (
    <div className="fade-in slide-in-from-bottom-4 mx-auto max-w-6xl animate-in space-y-4 pb-4 duration-500">
      {/* Stat Cards - responsive grid */}
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4 lg:gap-4">
        <StatCard
          title="Total Tasks"
          value={totalTasks.toString()}
          icon={<Activity className="h-4 w-4 text-blue-600 dark:text-blue-400" />}
          trend="Active project"
          colorClass="bg-blue-50/80 border-blue-200 dark:bg-blue-900/20 dark:border-blue-800"
        />
        <StatCard
          title="In Progress"
          value={inProgressTasks.toString()}
          icon={<Clock className="h-4 w-4 text-amber-600 dark:text-amber-400" />}
          trend="Currently working"
          colorClass="bg-amber-50/80 border-amber-200 dark:bg-amber-900/20 dark:border-amber-800"
        />
        <StatCard
          title="Completed"
          value={completedTasks.toString()}
          icon={<CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />}
          trend="Finished tasks"
          colorClass="bg-emerald-50/80 border-emerald-200 dark:bg-emerald-900/20 dark:border-emerald-800"
        />
        <StatCard
          title="Review/Blocked"
          value={blockedTasks.toString()}
          icon={<AlertCircle className="h-4 w-4 text-rose-600 dark:text-rose-400" />}
          trend="Needs attention"
          colorClass="bg-rose-50/80 border-rose-200 dark:bg-rose-900/20 dark:border-rose-800"
        />
      </div>

      <div className="grid gap-4 md:grid-cols-7">
        <Card className="rounded-xl border-border/50 bg-card shadow-sm transition-all hover:shadow-md md:col-span-4">
          <CardHeader className="rounded-t-xl border-border/40 border-b bg-muted/5 px-4 py-3">
            <CardTitle className="font-semibold text-sm">Project Velocity</CardTitle>
            <CardDescription className="mt-0.5 text-xs">Task completion rate over the last 14 days.</CardDescription>
          </CardHeader>
          <CardContent className="px-4 py-4">
            <div className="group relative flex h-[120px] w-full items-center justify-center overflow-hidden rounded-lg border border-border/60 border-dashed bg-muted/10">
              <div className="pointer-events-none absolute inset-0 z-10 bg-gradient-to-t from-background/50 to-transparent" />
              <div className="z-10 font-medium text-muted-foreground text-xs">
                Velocity chart requires timeline data
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-xl border-border/50 bg-card shadow-sm transition-all hover:shadow-md md:col-span-3">
          <CardHeader className="flex flex-row items-center justify-between rounded-t-xl border-border/40 border-b bg-muted/5 px-4 py-3">
            <div className="space-y-0.5">
              <CardTitle className="font-semibold text-sm">Team Workload</CardTitle>
              <CardDescription className="text-xs">Task distribution among members.</CardDescription>
            </div>
            <Users className="h-4 w-4 text-muted-foreground opacity-50" />
          </CardHeader>
          <CardContent className="custom-scrollbar h-[154px] space-y-4 overflow-y-auto px-4 pt-4 pb-4">
            {teamWorkload.length > 0 ? (
              teamWorkload.map((member) => (
                <TeamMemberWorkload
                  key={member.userId}
                  name={member.name}
                  tasks={member.taskCount}
                  progress={member.completionRate}
                />
              ))
            ) : (
              <div className="flex h-full items-center justify-center font-medium text-muted-foreground text-xs">
                No active team workloads
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card className="col-span-1 rounded-xl border-border/50 bg-card shadow-sm transition-all hover:shadow-md lg:col-span-2">
          <CardHeader className="rounded-t-xl border-border/40 border-b bg-muted/5 px-4 py-3">
            <CardTitle className="font-semibold text-sm">Recent Task Updates</CardTitle>
            <CardDescription className="mt-0.5 text-xs">Latest tasks assigned to your team.</CardDescription>
          </CardHeader>
          <CardContent className="custom-scrollbar h-[160px] overflow-y-auto px-4 py-4">
            <div className="space-y-4">
              {pseudoActivity.length > 0 ? (
                pseudoActivity.map((activity) => (
                  <ActivityItem
                    key={activity.id}
                    user={activity.user}
                    action={activity.action}
                    target={activity.target}
                    status={
                      activity.status === "in_progress"
                        ? "In Progress"
                        : activity.status.charAt(0).toUpperCase() + activity.status.slice(1)
                    }
                    time={activity.time}
                    initials={activity.initials}
                  />
                ))
              ) : (
                <div className="mt-8 flex h-full items-center justify-center font-medium text-muted-foreground text-xs">
                  No recent tasks
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="group relative col-span-1 overflow-hidden rounded-xl border-primary/20 bg-primary/5 shadow-sm transition-all hover:shadow-md">
          <div className="-top-4 -right-4 pointer-events-none absolute p-4 opacity-[0.03] transition-all group-hover:scale-110 group-hover:opacity-[0.05]">
            <TrendingUp className="h-24 w-24" />
          </div>
          <CardHeader className="px-4 py-3">
            <CardTitle className="flex items-center gap-2 font-semibold text-foreground text-sm">
              <TrendingUp className="h-4 w-4 text-primary" /> Upcoming Deadlines
            </CardTitle>
          </CardHeader>
          <CardContent className="relative z-10 flex h-[160px] flex-col space-y-3 px-4 pb-4">
            <div className="custom-scrollbar flex-1 space-y-3 overflow-y-auto">
              {upcomingDeadlines.length > 0 ? (
                upcomingDeadlines.map((deadline) => (
                  <DeadlineItem
                    key={deadline.id}
                    task={deadline.title}
                    date={deadline.dueDate}
                    priority={deadline.priority}
                  />
                ))
              ) : (
                <div className="mt-8 flex h-full items-center justify-center font-medium text-muted-foreground text-xs">
                  No upcoming deadlines
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function StatCard({
  title,
  value,
  icon,
  trend,
  colorClass,
}: {
  title: string;
  value: string;
  icon: React.ReactNode;
  trend: string;
  colorClass?: string;
}) {
  return (
    <Card
      className={cn(
        "group overflow-hidden rounded-xl border shadow-sm transition-all hover:shadow-md",
        colorClass || "border-border/50 bg-card",
      )}
    >
      <CardHeader className="flex flex-row items-center justify-between px-4 pt-4 pb-1 sm:px-5">
        <CardTitle className="font-bold text-foreground/80 text-xs">{title}</CardTitle>
        <div className="group-hover:-rotate-3 rounded-lg border border-black/5 bg-background/80 p-1.5 shadow-sm backdrop-blur-sm transition-all duration-300 group-hover:scale-110 dark:border-white/5">
          {icon}
        </div>
      </CardHeader>
      <CardContent className="px-4 pb-4 sm:px-5">
        <div className="font-bold text-foreground text-xl tracking-tight">{value}</div>
        <p className="mt-1 truncate font-medium text-[10px] text-muted-foreground">{trend}</p>
      </CardContent>
    </Card>
  );
}

function ListView({ projectId }: { projectId: string }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");

  const { data: tasks = [] } = useTaskList(projectId);

  const filteredTasks = tasks.filter((task) => {
    const matchesSearch =
      task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.taskCode?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || task.status === statusFilter;
    const matchesPriority = priorityFilter === "all" || task.priority === priorityFilter;
    return matchesSearch && matchesStatus && matchesPriority;
  });

  return (
    <div className="fade-in mx-auto flex h-full min-h-0 w-full max-w-6xl animate-in flex-col pt-4 duration-500 sm:pt-6">
      {/* Toolbar */}
      <div className="mb-4 flex shrink-0 flex-col items-start justify-between gap-4 px-4 sm:flex-row sm:items-center sm:px-6">
        <div className="flex w-full flex-wrap items-center gap-3 sm:w-auto">
          <div className="relative min-w-[200px] flex-1 sm:flex-initial">
            <Search className="-translate-y-1/2 absolute top-1/2 left-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search list..."
              className="h-9 w-full rounded-md border-border/50 bg-card pl-9 text-xs shadow-sm focus-visible:ring-primary/20 sm:w-[260px]"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="h-9 w-[120px] border-border/50 bg-card text-xs shadow-sm">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all" className="text-xs">
                All Status
              </SelectItem>
              <SelectItem value="todo" className="text-xs">
                To Do
              </SelectItem>
              <SelectItem value="in_progress" className="text-xs">
                In Progress
              </SelectItem>
              <SelectItem value="review" className="text-xs">
                Review
              </SelectItem>
              <SelectItem value="done" className="text-xs">
                Done
              </SelectItem>
            </SelectContent>
          </Select>
          <Select value={priorityFilter} onValueChange={setPriorityFilter}>
            <SelectTrigger className="h-9 w-[120px] border-border/50 bg-card text-xs shadow-sm">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all" className="text-xs">
                All Priority
              </SelectItem>
              <SelectItem value="high" className="text-xs">
                High
              </SelectItem>
              <SelectItem value="medium" className="text-xs">
                Medium
              </SelectItem>
              <SelectItem value="low" className="text-xs">
                Low
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
        <NewTaskDialog projectId={projectId}>
          <Button size="sm" className="h-9 w-full gap-1.5 text-xs shadow-sm sm:w-auto">
            <Plus className="h-3.5 w-3.5" /> Create Task
          </Button>
        </NewTaskDialog>
      </div>

      {/* List Header */}
      <div className="flex shrink-0 items-center gap-4 border-border/40 border-y bg-muted/10 px-6 py-2.5 font-bold text-[10px] text-muted-foreground uppercase tracking-widest">
        <div className="w-[80px] shrink-0">Task ID</div>
        <div className="min-w-[200px] flex-1">Title</div>
        <div className="w-[120px] shrink-0">Status</div>
        <div className="w-[100px] shrink-0">Priority</div>
        <div className="w-[120px] shrink-0">Assignee</div>
        <div className="w-[100px] shrink-0 text-right">Due Date</div>
      </div>

      {/* List Content */}
      <ScrollArea className="min-h-0 flex-1 bg-background">
        <div className="flex flex-col">
          {filteredTasks.map((task) => (
            <ListRow
              key={task.id}
              id={task.taskCode || task.id}
              title={task.title}
              priority={task.priority}
              status={task.status}
              assignee={task.assigneeName || "Unassigned"}
              date={task.dueDate ? new Date(task.dueDate).toLocaleDateString() : "No due date"}
              taskId={task.id}
              projectId={projectId}
            />
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}

function ListRow({
  id,
  title,
  priority,
  status,
  assignee,
  date,
  taskId,
  projectId,
}: {
  id: string;
  title: string;
  priority: "high" | "medium" | "low";
  status: "todo" | "in_progress" | "review" | "done";
  assignee: string;
  date: string;
  taskId: string;
  projectId: string;
}) {
  return (
    <TaskDetailsDialog id={taskId} title={title} priority={priority} projectId={projectId}>
      <div className="group flex cursor-pointer items-center gap-4 border-border/40 border-b px-6 py-3.5 transition-colors hover:bg-blue-50/50 dark:hover:bg-blue-900/10">
        <div className="w-[80px] shrink-0">
          <Badge
            variant="secondary"
            className="rounded border-transparent bg-muted/50 px-1.5 py-0 font-mono text-[10px] text-muted-foreground uppercase shadow-none transition-colors group-hover:bg-background"
          >
            {id}
          </Badge>
        </div>
        <div className="min-w-[200px] flex-1">
          <span className="line-clamp-1 font-semibold text-foreground/90 text-sm transition-colors group-hover:text-blue-600 dark:group-hover:text-blue-400">
            {title}
          </span>
        </div>
        <div className="flex w-[120px] shrink-0 items-center gap-2">
          {status === "todo" && <CircleDashed className="h-3.5 w-3.5 text-muted-foreground" />}
          {status === "in_progress" && <Clock className="h-3.5 w-3.5 text-amber-500" />}
          {status === "review" && <AlertCircle className="h-3.5 w-3.5 text-orange-500" />}
          {status === "done" && <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />}
          <span className="font-medium text-foreground/80 text-xs">
            {status === "todo"
              ? "To Do"
              : status === "in_progress"
                ? "In Progress"
                : status.charAt(0).toUpperCase() + status.slice(1)}
          </span>
        </div>
        <div className="w-[100px] shrink-0">
          <Badge
            variant="outline"
            className={cn(
              "border-transparent px-2 py-0.5 font-bold text-[9px] uppercase tracking-wider shadow-sm",
              priority === "high"
                ? "bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-400"
                : priority === "medium"
                  ? "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400"
                  : "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400",
            )}
          >
            {priority.charAt(0).toUpperCase() + priority.slice(1)}
          </Badge>
        </div>
        <div className="flex w-[120px] shrink-0 items-center gap-2.5">
          <Avatar className="h-6 w-6 border shadow-sm">
            <AvatarFallback className="bg-primary/10 font-bold text-[9px] text-primary">
              {assignee
                .split(" ")
                .map((n) => n[0])
                .join("")
                .toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <span className="font-medium text-foreground text-xs">{assignee}</span>
        </div>
        <div className="flex w-[100px] shrink-0 items-center justify-end gap-1.5 text-right">
          <Calendar className="h-3.5 w-3.5 text-muted-foreground opacity-70" />
          <span className="font-semibold text-[11px] text-muted-foreground">{date}</span>
        </div>
      </div>
    </TaskDetailsDialog>
  );
}

function TeamMemberWorkload({ name, tasks, progress }: { name: string; tasks: number; progress: number }) {
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("");
  return (
    <div className="flex items-center justify-between space-x-4">
      <div className="flex items-center space-x-4">
        <Avatar className="h-10 w-10 border shadow-sm">
          <AvatarFallback className="bg-primary/5 font-bold text-primary text-xs">{initials}</AvatarFallback>
        </Avatar>
        <div className="space-y-1">
          <p className="font-semibold text-sm leading-none">{name}</p>
          <p className="text-muted-foreground text-xs">{tasks} active tasks</p>
        </div>
      </div>
      <div className="flex w-[80px] items-center gap-3 sm:w-[120px]">
        <Progress value={progress} className="h-2 flex-1 bg-muted/50 shadow-inner" />
        <span className="hidden w-8 text-right font-bold text-[10px] text-muted-foreground sm:inline-block">
          {progress}%
        </span>
      </div>
    </div>
  );
}

function ActivityItem({
  user,
  action,
  target,
  status,
  time,
  initials,
}: {
  user: string;
  action: string;
  target?: string;
  status?: string;
  time: string;
  initials: string;
}) {
  return (
    <div className="group flex items-start gap-4">
      <Avatar className="mt-0.5 h-9 w-9 shrink-0 border shadow-sm transition-colors group-hover:border-primary/30">
        <AvatarFallback className="bg-primary/10 font-bold text-[10px] text-primary">{initials}</AvatarFallback>
      </Avatar>
      <div className="flex-1 space-y-1.5">
        <p className="text-sm leading-snug">
          <span className="font-semibold text-foreground">{user}</span>{" "}
          <span className="text-muted-foreground">{action}</span>{" "}
          {target && <span className="font-semibold text-foreground">{target}</span>}
        </p>
        <div className="flex items-center gap-2 font-medium text-muted-foreground text-xs">
          <Clock className="h-3 w-3" />
          <span>{time}</span>
          {status && (
            <>
              <span className="opacity-50">•</span>
              <Badge
                variant="secondary"
                className="h-4.5 border border-border/50 bg-muted/50 px-1.5 py-0 font-bold text-[10px] shadow-sm"
              >
                {status}
              </Badge>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function DeadlineItem({ task, date, priority }: { task: string; date: string; priority: TaskPriority }) {
  return (
    <div className="group flex flex-col gap-2 rounded-xl border border-border/50 bg-background/80 p-4 shadow-sm backdrop-blur-sm transition-all hover:border-primary/20 hover:shadow-md">
      <div className="flex items-start justify-between gap-3">
        <p className="font-semibold text-sm leading-snug transition-colors group-hover:text-primary">{task}</p>
        <Badge
          variant={priority === "high" ? "destructive" : "secondary"}
          className="h-5 shrink-0 px-2 py-0.5 font-bold text-[10px] uppercase tracking-wider shadow-sm"
        >
          {priority.charAt(0).toUpperCase() + priority.slice(1)}
        </Badge>
      </div>
      <div className="flex items-center gap-1.5 font-semibold text-muted-foreground text-xs">
        <Clock className="h-3.5 w-3.5 text-primary/70" />
        <span>{date}</span>
      </div>
    </div>
  );
}
