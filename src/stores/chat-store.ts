import { create } from "zustand";

interface ChatState {
  activeChatId: string | null;
  presenceMap: Record<string, "online" | "offline">;
  typingState: Record<string, Record<string, number>>; // chatId -> userId -> timestamp

  // Actions
  setActiveChatId: (chatId: string | null) => void;
  setPresence: (userId: string, status: "online" | "offline") => void;
  setTyping: (chatId: string, userId: string) => void;
  clearTyping: (chatId: string, userId: string) => void;

  // Stub for future socket action (would normally inject into queryClient)
  appendMessage: (chatId: string, message: any) => void;
}

export const useChatStore = create<ChatState>((set) => ({
  activeChatId: null,
  presenceMap: {},
  typingState: {},

  setActiveChatId: (chatId) => set({ activeChatId: chatId }),

  setPresence: (userId, status) =>
    set((state) => ({
      presenceMap: {
        ...state.presenceMap,
        [userId]: status,
      },
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

  clearTyping: (chatId, userId) =>
    set((state) => {
      const chatTyping = { ...(state.typingState[chatId] || {}) };
      delete chatTyping[userId];
      return {
        typingState: {
          ...state.typingState,
          [chatId]: chatTyping,
        },
      };
    }),

  appendMessage: (chatId, message) => {
    // STUB: Real implementation will likely be moved to a hook to access queryClient.setQueryData
    console.log(`[Socket Stub] Appending message to chat ${chatId}:`, message);
  },
}));
