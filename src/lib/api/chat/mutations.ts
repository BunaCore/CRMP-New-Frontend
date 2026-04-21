import { useMutation, useQueryClient } from "@tanstack/react-query";

import { useChatStore } from "@/stores/chat-store";

import { apiClient } from "../client";
import type { ChatDetails } from "./types";

interface CreateChatPayload {
  type: "dm" | "group";
  memberIds: string[];
  name?: string;
}

export function useCreateChat() {
  const queryClient = useQueryClient();
  const setActiveChatId = useChatStore((s) => s.setActiveChatId);

  return useMutation({
    mutationFn: async (data: CreateChatPayload) => {
      const response = await apiClient.post<ChatDetails>("/chats", data);
      return response.data;
    },
    onSuccess: (chat) => {
      // Refresh the chat sidebar list
      queryClient.invalidateQueries({ queryKey: ["chats"] });
      // Immediately open the newly created chat
      setActiveChatId(chat.id);
    },
  });
}
