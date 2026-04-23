import { apiClient } from "../client";
import type { ChatDetails, ChatSummary, GetMessagesResponse } from "./types";

/**
 * Retrieves the summary list of all chats (Groups & DMs) for the current user.
 */
export async function getChats(): Promise<ChatSummary[]> {
  const response = await apiClient.get<ChatSummary[]>("/chats");
  return response.data;
}

/**
 * Retrieves full metadata and participant list for a specific chat room.
 */
export async function getChatById(chatId: string): Promise<ChatDetails> {
  const response = await apiClient.get<ChatDetails>(`/chats/${chatId}`);
  return response.data;
}

/**
 * Retrieves cursor-paginated messages for a specific chat room.
 */
export async function getMessages(chatId: string, cursor?: string | null): Promise<GetMessagesResponse> {
  // Pass cursor dynamically. Handles null mapping via URLSearchParams internally or explicit query param logic.
  const response = await apiClient.get<GetMessagesResponse>(`/chats/${chatId}/messages`, {
    params: { ...(cursor ? { cursor } : {}) },
  });
  return response.data;
}
