// ============================================================
// TASK MANAGEMENT QUERIES
// React Query hooks for fetching task data.
// ============================================================

import { useQuery } from "@tanstack/react-query";

import { apiClient } from "@/lib/api/client";

import type {
  TaskActivityResponse,
  TaskDetailResponse,
  TaskListResponse,
  TaskSummaryResponse,
  TeamMembersResponse,
} from "./types";
import {
  taskManagementKeys,
  unwrapTaskActivity,
  unwrapTaskDetail,
  unwrapTaskList,
  unwrapTaskSummary,
  unwrapTeamMembers,
} from "./utils";

// List tasks by project
export function useTaskList(projectId: string) {
  return useQuery({
    queryKey: taskManagementKeys.tasks(projectId),
    queryFn: async (): Promise<TaskListResponse["tasks"]> => {
      const response = await apiClient.get<TaskListResponse>(`/projects/${projectId}/tasks`);
      return unwrapTaskList(response.data);
    },
    enabled: !!projectId,
  });
}

// Get task detail
export function useTaskDetail(projectId: string, taskId: string) {
  return useQuery({
    queryKey: taskManagementKeys.task(projectId, taskId),
    queryFn: async (): Promise<TaskDetailResponse["task"]> => {
      const response = await apiClient.get<TaskDetailResponse>(`/tasks/${taskId}`);
      return unwrapTaskDetail(response.data);
    },
    enabled: !!projectId && !!taskId,
  });
}

// Get project team members
export function useTeamMembers(projectId: string) {
  return useQuery({
    queryKey: taskManagementKeys.members(projectId),
    queryFn: async (): Promise<TeamMembersResponse["members"]> => {
      const response = await apiClient.get<TeamMembersResponse>(`/projects/${projectId}/tasks/members`);
      return unwrapTeamMembers(response.data);
    },
    enabled: !!projectId,
  });
}

// Get task summary
export function useTaskSummary(projectId: string) {
  return useQuery({
    queryKey: taskManagementKeys.summary(projectId),
    queryFn: async (): Promise<TaskSummaryResponse["summary"]> => {
      const response = await apiClient.get<TaskSummaryResponse>(`/projects/${projectId}/tasks/summary`);
      return unwrapTaskSummary(response.data);
    },
    enabled: !!projectId,
  });
}

// Get task activity
export function useTaskActivity(projectId: string, taskId: string) {
  return useQuery({
    queryKey: taskManagementKeys.activity(projectId, taskId),
    queryFn: async (): Promise<TaskActivityResponse["activity"]> => {
      const response = await apiClient.get<TaskActivityResponse>(`/tasks/${taskId}/activity`);
      return unwrapTaskActivity(response.data);
    },
    enabled: !!projectId && !!taskId,
  });
}
