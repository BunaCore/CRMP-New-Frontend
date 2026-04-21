"use client";

import { useEffect } from "react";

import { useQueryClient } from "@tanstack/react-query";

import { useChatStore } from "@/stores/chat-store";

import { emitMarkAsRead } from "../utils/emit-mark-as-read";
import { getLastMessageId } from "../utils/get-last-message-id";

/**
 * Hook: useMarkAsRead
 *
 * Handles all read tracking scenarios:
 * 1. On chat open → emit markAsRead for the latest loaded message
 * 2. On window focus → re-emit for active chat
 *
 * Call this hook once inside the chat panel component.
 */
export function useMarkAsRead(chatId: string) {
  const queryClient = useQueryClient();
  const setUnreadCount = useChatStore((s) => s.setUnreadCount);

  // 1. Trigger mark as read when chatId changes (chat opened)
  useEffect(() => {
    const lastId = getLastMessageId(chatId, queryClient);
    if (lastId) {
      emitMarkAsRead(chatId, lastId);
      setUnreadCount(chatId, 0);
    }
  }, [chatId, queryClient, setUnreadCount]);

  // 2. Re-emit on window focus (user returns to tab)
  useEffect(() => {
    const onFocus = () => {
      const lastId = getLastMessageId(chatId, queryClient);
      if (lastId) {
        emitMarkAsRead(chatId, lastId);
        setUnreadCount(chatId, 0);
      }
    };

    window.addEventListener("focus", onFocus);
    return () => window.removeEventListener("focus", onFocus);
  }, [chatId, queryClient, setUnreadCount]);
}
