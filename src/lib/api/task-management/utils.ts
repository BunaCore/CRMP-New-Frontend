// ============================================================
// TASK MANAGEMENT UTILS
// Helper functions for error handling, response unwrapping, and query keys.
// ============================================================

import { AxiosError } from "axios";

// Query keys for React Query caching
export const taskManagementKeys = {
  all: ["task-management"] as const,
  tasks: (projectId: string) => [...taskManagementKeys.all, "tasks", projectId] as const,
  task: (projectId: string, taskId: string) => [...taskManagementKeys.tasks(projectId), taskId] as const,
  members: (projectId: string) => [...taskManagementKeys.all, "members", projectId] as const,
  summary: (projectId: string) => [...taskManagementKeys.all, "summary", projectId] as const,
  activity: (projectId: string, taskId: string) => [...taskManagementKeys.task(projectId, taskId), "activity"] as const,
};

// Error normalization
export function normalizeTaskError(error: unknown): string {
  if (error instanceof AxiosError) {
    return error.response?.data?.message || error.message || "An error occurred";
  }
  if (error instanceof Error) {
    return error.message;
  }
  return "Unknown error";
}

// Response unwrapping helpers
// biome-ignore lint/suspicious/noExplicitAny: response unwrapping
export function unwrapTaskList(response: { tasks: any[] }): any[] {
  return response.tasks;
}

// biome-ignore lint/suspicious/noExplicitAny: response unwrapping
export function unwrapTaskDetail(response: { task: any }): any {
  return response.task;
}

// biome-ignore lint/suspicious/noExplicitAny: response unwrapping
export function unwrapTeamMembers(response: { members: any[] }): any[] {
  return response.members;
}

// biome-ignore lint/suspicious/noExplicitAny: response unwrapping
export function unwrapTaskSummary(response: { summary: any }): any {
  return response.summary;
}

// biome-ignore lint/suspicious/noExplicitAny: response unwrapping
export function unwrapTaskActivity(response: { activity: any[] }): any[] {
  return response.activity;
}

// biome-ignore lint/suspicious/noExplicitAny: response unwrapping
export function unwrapCommentResponse(response: { activityItem: any }): any {
  return response.activityItem;
}
