import type { QueryClient } from "@tanstack/react-query";

import { useChatStore } from "@/stores/chat-store";

import type { ChatSummary, Message } from "../api/chat/types";
import { socketManager } from "./socket";
import { emitMarkAsRead } from "./utils/emit-mark-as-read";

export function setupSocketListeners(queryClient: QueryClient) {
  const socket = socketManager.getSocket();
  if (!socket) return;

  // Clear existing listeners to prevent duplicates if re-authenticating
  socket.removeAllListeners("presence:sync");
  socket.removeAllListeners("presence:update");
  socket.removeAllListeners("chat:message");
  socket.removeAllListeners("chat:error");
  socket.removeAllListeners("auth:error");
  socket.removeAllListeners("chat:typing");

  // 1. Presence Sync (Initial batch of online users)
  socket.on("presence:sync", (data: { onlineUserIds: string[] }) => {
    const presenceMap: Record<string, "online" | "offline"> = {};
    for (const userId of data.onlineUserIds) {
      presenceMap[userId] = "online";
    }
    useChatStore.getState().setAllPresence(presenceMap);
  });

  // 2. Presence Update (Single user status toggle)
  socket.on("presence:update", (data: { userId: string; status: "online" | "offline" }) => {
    useChatStore.getState().setPresence(data.userId, data.status);
  });

  // 3. Chat Message handling
  socket.on("chat:message", (newMessage: Message & { tempId?: string }) => {
    const store = useChatStore.getState();
    const activeChatId = store.activeChatId;
    const { chatId } = newMessage;

    // A) Append to the Infinite Query cache
    const queryKey = ["messages", chatId];
    queryClient.setQueryData<any>(queryKey, (oldData: any) => {
      if (!oldData || !oldData.pages) return oldData;

      const newPages = [...oldData.pages];
      const mutatedPage = { ...newPages[0] };

      // Replace optimistic temp message or prepend new
      if (newMessage.tempId) {
        const index = mutatedPage.messages.findIndex((m: Message) => m.id === newMessage.tempId);
        if (index !== -1) {
          mutatedPage.messages[index] = newMessage;
        } else {
          mutatedPage.messages = [newMessage, ...mutatedPage.messages];
        }
      } else {
        mutatedPage.messages = [newMessage, ...mutatedPage.messages];
      }

      newPages[0] = mutatedPage;
      return { ...oldData, pages: newPages };
    });

    // B) Update sidebar last message
    queryClient.setQueryData<ChatSummary[]>(["chats"], (oldChats) => {
      if (!oldChats) return oldChats;
      return oldChats.map((chat) => {
        if (chat.id === chatId) {
          return { ...chat, lastMessage: newMessage };
        }
        return chat;
      });
    });

    // C) Read tracking — only emit if this is the active chat
    if (chatId === activeChatId) {
      // Reset unread and mark as read immediately
      store.setUnreadCount(chatId, 0);
      emitMarkAsRead(chatId, newMessage.id);
    } else {
      // Increment unread in Zustand (sidebar reads from Zustand for realtime)
      store.incrementUnreadCount(chatId);
    }
  });

  // 4. Chat User Typing — timestamp-based (store handles 3s expiry)
  socket.on("chat:typing", (data: { userId: string; chatId: string }) => {
    useChatStore.getState().setTyping(data.chatId, data.userId);
  });

  // 5. Chat Error handling
  socket.on("chat:error", (data: { message: string }) => {
    console.error("Chat Error:", data.message);
  });

  // 6. Auth Error
  socket.on("auth:error", (data: { message: string }) => {
    console.error("Socket Auth Error:", data.message);
    socketManager.disconnect();
  });
}
