// ============================================================
// TASK MANAGEMENT TYPES
// Defines all TypeScript interfaces for task management API.
// ============================================================

export type TaskStatus = "todo" | "in_progress" | "review" | "done";
export type TaskPriority = "high" | "medium" | "low";
export type DisplayPriority = "High" | "Medium" | "Low";

// Base task interface
export interface Task {
  id: string;
  taskCode?: string; // Display label, fallback to id
  projectId: string;
  title: string;
  description?: string;
  status: TaskStatus;
  priority: TaskPriority;
  assigneeId: string;
  assigneeName: string;
  assigneeInitials?: string;
  assigneeAvatarUrl?: string;
  dueDate?: string;
  createdAt?: string;
  updatedAt?: string;
}

// Task detail includes activity
export interface TaskDetail extends Task {
  activity?: ActivityItem[];
}

// Team member for assignee selection
export interface TeamMember {
  id: string;
  fullName: string;
  initials?: string;
  avatarUrl?: string;
  color?: string;
}

// Summary dashboard data
export interface TaskSummary {
  totalTasks: number;
  inProgressTasks: number;
  completedTasks: number;
  blockedTasks: number;
  velocity: number[];
  teamWorkload: Array<{
    userId: string;
    name: string;
    taskCount: number;
    completionRate: number;
  }>;
  recentActivity: ActivityItem[];
  upcomingDeadlines: Array<{
    id: string;
    title: string;
    dueDate: string;
    priority: TaskPriority;
  }>;
}

// Activity/comment item
export interface ActivityItem {
  id: string;
  taskId: string;
  taskCode?: string;
  userId: string;
  user: string;
  initials: string;
  avatarUrl?: string;
  action: string;
  detail?: string;
  time: string;
}

// Payloads for mutations
export interface CreateTaskPayload {
  title: string;
  description?: string;
  status: TaskStatus;
  priority: TaskPriority;
  assigneeId?: string;
  dueDate?: string;
}

export interface UpdateTaskPayload {
  title?: string;
  description?: string;
  status?: TaskStatus;
  priority?: TaskPriority;
  assigneeId?: string;
  dueDate?: string;
}

export interface CommentPayload {
  comment: string;
}

// API response wrappers
export interface TaskListResponse {
  tasks: Task[];
}

export interface TaskDetailResponse {
  task: TaskDetail;
}

export interface TeamMembersResponse {
  members: TeamMember[];
}

export interface TaskSummaryResponse {
  summary: TaskSummary;
}

export interface TaskActivityResponse {
  activity: ActivityItem[];
}

export interface CommentResponse {
  activityItem: ActivityItem;
}
