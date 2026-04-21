import type { QueryClient } from "@tanstack/react-query";

import type { GetMessagesResponse } from "@/lib/api/chat/types";

export function getLastMessageId(chatId: string, queryClient: QueryClient): string | null {
  const data = queryClient.getQueryData<{
    pages: GetMessagesResponse[];
    pageParams: unknown[];
  }>(["messages", chatId]);

  //backend fetches the cats newest first so in the query client we take from the top
  if (!data?.pages?.length) return null;

  const firstPage = data.pages[0];

  if (!firstPage.messages.length) return null;

  return firstPage.messages[0].id;
}
