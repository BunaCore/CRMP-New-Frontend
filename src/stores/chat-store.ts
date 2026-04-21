import { create } from "zustand";

import type { Message } from "@/lib/api/chat/types";

interface ChatState {
  activeChatId: string | null;
  presenceMap: Record<string, "online" | "offline">;
  typingState: Record<string, Record<string, number>>; // chatId -> userId -> timestamp
  lastReadMessageIdByChatId: Record<string, string | null>;
  unreadCountByChatId: Record<string, number>;
  lastTypingEmitByChatId: Record<string, number>;

  // Actions
  setActiveChatId: (chatId: string | null) => void;
  setPresence: (userId: string, status: "online" | "offline") => void;
  setAllPresence: (presenceMap: Record<string, "online" | "offline">) => void;
  setTyping: (chatId: string, userId: string) => void;
  shouldThrottleTyping: (chatId: string) => boolean;
  setLastReadMessageId: (chatId: string, messageId: string) => void;
  setUnreadCount: (chatId: string, count: number) => void;
  incrementUnreadCount: (chatId: string) => void;

  // Stub for future socket action (would normally inject into queryClient)
  appendMessage: (chatId: string, message: Message) => void;
}

export const useChatStore = create<ChatState>((set, get) => ({
  activeChatId: null,
  presenceMap: {},
  typingState: {},
  lastReadMessageIdByChatId: {},
  unreadCountByChatId: {},
  lastTypingEmitByChatId: {},

  setActiveChatId: (chatId) => set({ activeChatId: chatId }),

  setPresence: (userId, status) =>
    set((state) => ({
      presenceMap: {
        ...state.presenceMap,
        [userId]: status,
      },
    })),

  setAllPresence: (newPresenceMap) =>
    set(() => ({
      presenceMap: newPresenceMap,
    })),

  setTyping: (chatId, userId) =>
    set((state) => {
      const chatTyping = state.typingState[chatId] || {};
      return {
        typingState: {
          ...state.typingState,
          [chatId]: {
            ...chatTyping,
            [userId]: Date.now(),
          },
        },
      };
    }),

  shouldThrottleTyping: (chatId) => {
    const lastEmit = get().lastTypingEmitByChatId[chatId] || 0;
    const now = Date.now();
    if (now - lastEmit > 3000) {
      set((state) => ({
        lastTypingEmitByChatId: {
          ...state.lastTypingEmitByChatId,
          [chatId]: now,
        },
      }));
      return false;
    }
    return true;
  },

  setLastReadMessageId: (chatId, messageId) =>
    set((state) => ({
      lastReadMessageIdByChatId: {
        ...state.lastReadMessageIdByChatId,
        [chatId]: messageId,
      },
    })),

  setUnreadCount: (chatId, count) =>
    set((state) => ({
      unreadCountByChatId: {
        ...state.unreadCountByChatId,
        [chatId]: count,
      },
    })),

  incrementUnreadCount: (chatId) =>
    set((state) => ({
      unreadCountByChatId: {
        ...state.unreadCountByChatId,
        [chatId]: (state.unreadCountByChatId[chatId] || 0) + 1,
      },
    })),

  appendMessage: (chatId, message) => {
    // STUB: Real implementation will likely be moved to a hook to access queryClient.setQueryData
    console.log(`[Socket Stub] Appending message to chat ${chatId}:`, message);
  },
}));
