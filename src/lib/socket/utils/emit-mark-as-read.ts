import { useChatStore } from "@/stores/chat-store";

import { socketManager } from "../socket";

// Per-chat debounce timers — keyed by chatId
const markAsReadTimers: Record<string, ReturnType<typeof setTimeout>> = {};

/**
 * Emits `chat:markAsRead` with per-chat debouncing (400ms).
 * Skips emit if:
 *  - Socket not connected
 *  - No message ID provided
 *  - Same ID was already emitted for this chat (deduplication guard)
 */
export function emitMarkAsRead(chatId: string, lastSeenMessageId: string | null): void {
  if (!lastSeenMessageId) return;

  const socket = socketManager.getSocket();
  if (!socket?.connected) return;

  // Deduplication: skip if we already marked this exact message
  const { lastReadMessageIdByChatId, setLastReadMessageId } = useChatStore.getState();
  if (lastReadMessageIdByChatId[chatId] === lastSeenMessageId) return;

  // Clear existing debounce for this chat
  if (markAsReadTimers[chatId]) {
    clearTimeout(markAsReadTimers[chatId]);
  }

  markAsReadTimers[chatId] = setTimeout(() => {
    // Re-check dedup inside debounce — state may have updated
    const currentState = useChatStore.getState();
    if (currentState.lastReadMessageIdByChatId[chatId] === lastSeenMessageId) return;

    socket.emit("chat:markAsRead", { chatId, lastSeenMessageId });
    setLastReadMessageId(chatId, lastSeenMessageId);

    delete markAsReadTimers[chatId];
  }, 400);
}
