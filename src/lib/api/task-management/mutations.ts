// ============================================================
// TASK MANAGEMENT MUTATIONS
// React Query hooks for creating, updating, and commenting on tasks.
// ============================================================

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { apiClient } from "@/lib/api/client";

import type {
  CommentPayload,
  CommentResponse,
  CreateTaskPayload,
  TaskDetailResponse,
  UpdateTaskPayload,
} from "./types";
import { normalizeTaskError, taskManagementKeys, unwrapCommentResponse, unwrapTaskDetail } from "./utils";

// Create task
export function useCreateTask(projectId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: CreateTaskPayload): Promise<TaskDetailResponse["task"]> => {
      const response = await apiClient.post<TaskDetailResponse>(`/projects/${projectId}/tasks`, payload);
      return unwrapTaskDetail(response.data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: taskManagementKeys.tasks(projectId) });
      queryClient.invalidateQueries({ queryKey: taskManagementKeys.summary(projectId) });
    },
    onError: (error) => {
      console.error("Create task error:", normalizeTaskError(error));
    },
  });
}

// Update task
export function useUpdateTask(projectId: string, taskId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: UpdateTaskPayload): Promise<TaskDetailResponse["task"]> => {
      const response = await apiClient.patch<TaskDetailResponse>(`/tasks/${taskId}`, payload);
      return unwrapTaskDetail(response.data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: taskManagementKeys.task(projectId, taskId) });
      queryClient.invalidateQueries({ queryKey: taskManagementKeys.tasks(projectId) });
      queryClient.invalidateQueries({ queryKey: taskManagementKeys.summary(projectId) });
    },
    onError: (error) => {
      console.error("Update task error:", normalizeTaskError(error));
    },
  });
}

// Add comment
export function useAddComment(projectId: string, taskId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: CommentPayload): Promise<CommentResponse["activityItem"]> => {
      const response = await apiClient.post<CommentResponse>(`/tasks/${taskId}/comments`, payload);
      return unwrapCommentResponse(response.data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: taskManagementKeys.activity(projectId, taskId) });
      queryClient.invalidateQueries({ queryKey: taskManagementKeys.task(projectId, taskId) });
    },
    onError: (error) => {
      console.error("Add comment error:", normalizeTaskError(error));
    },
  });
}
