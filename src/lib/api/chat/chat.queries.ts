import { useInfiniteQuery, useQuery } from "@tanstack/react-query";

import { getChatById, getChats, getMessages } from "./api";

/**
 * Hook to retrieve the user's chat navigation list (sidebar).
 */
export function useGetChats() {
  return useQuery({
    queryKey: ["chats"],
    queryFn: getChats,
  });
}

/**
 * Hook to retrieve specific chat metadata (full members, descriptions).
 */
export function useGetChatById(chatId: string | null) {
  return useQuery({
    queryKey: ["chat", chatId],
    // biome-ignore lint/style/noNonNullAssertion: enabled guarantees chatId is set
    queryFn: () => getChatById(chatId!),
    enabled: !!chatId,
  });
}

/**
 * Hook to infinitely load messages using cursor pagination.
 */
export function useGetMessages(chatId: string | null) {
  return useInfiniteQuery({
    queryKey: ["messages", chatId],
    // biome-ignore lint/style/noNonNullAssertion: enabled guarantees chatId is set
    queryFn: ({ pageParam }) => getMessages(chatId!, pageParam as string | null),
    getNextPageParam: (lastPage) => lastPage.nextCursor || undefined,
    initialPageParam: null as string | null,
    enabled: !!chatId,
  });
}
