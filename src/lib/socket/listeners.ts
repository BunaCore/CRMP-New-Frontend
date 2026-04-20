import type { QueryClient } from "@tanstack/react-query";

import { useChatStore } from "@/stores/chat-store";

import type { ChatSummary, Message } from "../api/chat/types";
import { socketManager } from "./socket";

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

    // A) Always append to the Infinite Query cache if it exists
    const queryKey = ["messages", chatId];
    // We update pages if it exists, otherwise it will just fetch cleanly on mount
    queryClient.setQueryData<any>(queryKey, (oldData: any) => {
      if (!oldData || !oldData.pages) return oldData;

      const newPages = [...oldData.pages];
      // Insert into the newest page (usually the first one if we sort desc, or last if asc)
      // Assuming pages[0].messages has the newest items (based on typical cursor mapping)
      // We will place it at the front. If you sort differently, adjust this:
      const mutatedPage = { ...newPages[0] };

      // If we used a tempId (optimistic update), we should replace it
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

    // B) Track Unread / Last Message in the chat sidebar list
    const chatsQueryKey = ["chats"];
    queryClient.setQueryData<ChatSummary[]>(chatsQueryKey, (oldChats) => {
      if (!oldChats) return oldChats;
      return oldChats.map((chat) => {
        if (chat.id === chatId) {
          return {
            ...chat,
            lastMessage: newMessage,
            unreadCount: chatId === activeChatId ? chat.unreadCount : (chat.unreadCount || 0) + 1,
          };
        }
        return chat;
      });
    });

    // C) If chat is active, optionally trigger mutation to mark as read here (TODO implementation)
  });

  // 4. Chat User Typing
  socket.on("chat:typing", (data: { userId: string; chatId: string; isTyping: boolean }) => {
    // The instructions specified using a 3s expiry in the store rather than tracking perfectly based on `false`
    // The Zustand store action handles that safely
    useChatStore.getState().setTyping(data.chatId, data.userId);
  });

  // 5. Chat Error handling (Reverting optimistic UI)
  socket.on("chat:error", (data: { message: string }) => {
    // Depending on tempId passed, you would reverse the specific queryCache patch here
    // For now we toast it to the system.
    console.error("Chat Error:", data.message);
  });

  // 6. Authentication Error
  socket.on("auth:error", (data: { message: string }) => {
    console.error("Socket Auth Error:", data.message);
    socketManager.disconnect();
  });
}
