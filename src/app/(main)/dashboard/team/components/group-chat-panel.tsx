/** biome-ignore-all lint/complexity/noUselessFragments: fragments used for conditional multi-element rendering */
/** biome-ignore-all lint/correctness/useExhaustiveDependencies: deps managed intentionally to avoid infinite loops */
/** biome-ignore-all assist/source/organizeImports: import order managed manually */
/** biome-ignore-all lint/nursery/useSortedClasses: class ordering managed manually */
"use client";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useGetChatById, useGetMessages } from "@/lib/api/chat/chat.queries";
import type { Message } from "@/lib/api/chat/types";
import { useChatStore } from "@/stores/chat-store";
import { emitGetInitialPresence, emitSendMessage, emitTyping } from "@/lib/socket/emitter";
import { useMarkAsRead } from "@/lib/socket/hooks/use-mark-as-read";
import { ArrowDown, Hash, Info, MoreVertical, Paperclip, Send, Smile, Users } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { useChatScroll } from "@/lib/hooks/use-chat-scroll";
import { ChatMessageSkeleton } from "./skeletons/chat-message-skeleton";

interface GroupChatPanelProps {
  chatId: string;
  currentUserId: string;
}

function getInitials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

function formatTime(timestamp: string) {
  const date = new Date(timestamp);
  return date.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatDateHeader(timestamp: string) {
  const date = new Date(timestamp);
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  if (date.toDateString() === today.toDateString()) {
    return "Today";
  }
  if (date.toDateString() === yesterday.toDateString()) {
    return "Yesterday";
  }
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function _getRelativeTime(timestamp: string) {
  const now = new Date();
  const date = new Date(timestamp);
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  return `${diffDays}d ago`;
}

const _roleColors: Record<string, string> = {
  "Principal Investigator": "bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-300",
  "Co-Investigator": "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300",
  "Research Assistant": "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300",
  "Graduate Student": "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300",
  "Postdoctoral Fellow": "bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-300",
};

function TypingIndicator({ chatId, roomMembers }: { chatId: string; roomMembers: { id: string; name?: string }[] }) {
  const typingState = useChatStore((s) => s.typingState[chatId]);
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    // Only run interval if there might be typing active
    const hasTypers = Object.keys(typingState || {}).length > 0;
    if (!hasTypers) return;

    const timer = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(timer);
  }, [typingState]);

  const typingUsers = Object.entries(typingState ?? {})
    .filter(([_, timestamp]) => now - timestamp < 3000)
    .map(([id]) => id);

  const typingMemberNames = typingUsers
    .map((id) => roomMembers.find((m) => m.id === id)?.name?.split(" ")[0])
    .filter(Boolean);

  if (typingMemberNames.length === 0) return null;

  return (
    <div className="flex items-center gap-2 text-sm text-muted-foreground">
      <div className="flex gap-1">
        <span className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground/50 [animation-delay:-0.3s]" />
        <span className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground/50 [animation-delay:-0.15s]" />
        <span className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground/50" />
      </div>
      <span>
        {typingMemberNames.length === 1
          ? `${typingMemberNames[0]} is typing...`
          : typingMemberNames.length === 2
            ? `${typingMemberNames.join(" and ")} are typing...`
            : `${typingMemberNames.slice(0, 2).join(", ")} and ${typingMemberNames.length - 2} others are typing...`}
      </span>
    </div>
  );
}

function ChatInput({ chatId, placeholder }: { chatId: string; placeholder: string }) {
  const [inputValue, setInputValue] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
    // Emit typing started (cooldown managed by Zustand/socket emitter)
    emitTyping({ chatId });
  };

  const handleSend = () => {
    const content = inputValue.trim();
    if (!content) return;

    const tempId = `temp-${Date.now()}-${Math.random().toString(36).slice(2)}`;
    // Emit via socket — backend will echo back with real id replacing tempId
    emitSendMessage({ chatId, content, tempId });

    setInputValue("");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="border-t p-4">
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" className="h-9 w-9 shrink-0">
          <Paperclip className="h-4 w-4 text-muted-foreground" />
          <span className="sr-only">Attach file</span>
        </Button>
        <div className="relative flex-1">
          <Input
            ref={inputRef}
            value={inputValue}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            className="pr-10"
          />
          <Button variant="ghost" size="icon" className="absolute right-1 top-1/2 h-7 w-7 -translate-y-1/2">
            <Smile className="h-4 w-4 text-muted-foreground" />
            <span className="sr-only">Add emoji</span>
          </Button>
        </div>
        <Button onClick={handleSend} size="icon" className="h-9 w-9 shrink-0">
          <Send className="h-4 w-4" />
          <span className="sr-only">Send message</span>
        </Button>
      </div>
    </div>
  );
}

export function GroupChatPanel({ chatId, currentUserId }: GroupChatPanelProps) {
  const [showMembers, setShowMembers] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const topRef = useRef<HTMLDivElement>(null);

  const { data: room, isLoading: isLoadingRoom } = useGetChatById(chatId);
  const { data: messagesPages, fetchNextPage, hasNextPage, isFetchingNextPage } = useGetMessages(chatId);
  const messages = useMemo(() => {
    if (!messagesPages) return [];
    return messagesPages.pages.flatMap((page) => page.messages).reverse();
  }, [messagesPages]);

  const { isAtBottom, hasUnreadDownBelow, scrollToBottom, snapshotScrollBeforeFetch } = useChatScroll(
    scrollRef,
    messages.length,
  );

  // Intersection Observer for fetching older messages when topRef comes into view
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          snapshotScrollBeforeFetch();
          fetchNextPage();
        }
      },
      { root: scrollRef.current, rootMargin: "100px" },
    );
    if (topRef.current) observer.observe(topRef.current);
    return () => observer.disconnect();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage, snapshotScrollBeforeFetch]);

  // Handles: on chat open, on window focus → emit chat:markAsRead
  useMarkAsRead(chatId);

  const presenceMap = useChatStore((s) => s.presenceMap);

  const roomMembers = room?.members || [];
  const onlineMembers = roomMembers.filter((m) => presenceMap[m.id] === "online");

  const isDirectMessage = room?.type === "dm";
  const dmPartner = isDirectMessage ? roomMembers.find((m) => m.id !== currentUserId) : null;

  useEffect(() => {
    // Request initial presence whenever the chat changes
    emitGetInitialPresence();
  }, [chatId]);

  // Group messages by date
  const groupedMessages = useMemo(() => {
    const result: { date: string; messages: Message[] }[] = [];
    let currentDate = "";
    messages.forEach((msg) => {
      const msgDate = new Date(msg.createdAt).toDateString();
      if (msgDate !== currentDate) {
        currentDate = msgDate;
        result.push({ date: msg.createdAt, messages: [msg] });
      } else {
        result[result.length - 1].messages.push(msg);
      }
    });
    return result;
  }, [messages]);

  if (isLoadingRoom || !room) {
    return <div className="flex h-full items-center justify-center text-muted-foreground">Loading chat...</div>;
  }

  return (
    <div className="flex h-full flex-col bg-card">
      {/* Chat Header */}
      <div className="flex items-center justify-between border-b px-4 py-3">
        <div className="flex items-center gap-3">
          {isDirectMessage && dmPartner ? (
            <>
              <div className="relative">
                <Avatar className="h-10 w-10">
                  <AvatarFallback className="bg-primary/10 text-primary">{getInitials(dmPartner.name)}</AvatarFallback>
                </Avatar>
                {presenceMap[dmPartner.id] === "online" && (
                  <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-card bg-emerald-500" />
                )}
              </div>
              <div>
                <h3 className="font-semibold text-foreground">{dmPartner?.name || "Direct Message"}</h3>
                <div className="flex items-center gap-2">
                  <Badge
                    variant="secondary"
                    className="text-[10px] px-1.5 py-0 bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300"
                  >
                    Team Member
                  </Badge>
                  <span className="text-xs text-muted-foreground">
                    {presenceMap[dmPartner?.id || ""] === "online" ? "Online" : "Offline"}
                  </span>
                </div>
              </div>
            </>
          ) : (
            <>
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                <Hash className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground">{room.name}</h3>
                <p className="text-xs text-muted-foreground">
                  {onlineMembers.length} online of {roomMembers.length} members
                </p>
              </div>
            </>
          )}
        </div>
        <div className="flex items-center gap-1">
          {/* Online Members Avatars - Only show for group chats */}
          {!isDirectMessage && (
            <>
              <TooltipProvider>
                <div className="mr-2 flex -space-x-2">
                  {onlineMembers.slice(0, 4).map((member) => (
                    <Tooltip key={member.id}>
                      <TooltipTrigger asChild>
                        <div className="relative">
                          <Avatar className="h-7 w-7 border-2 border-card">
                            <AvatarFallback className="bg-primary/10 text-primary text-xs">
                              {getInitials(member.name)}
                            </AvatarFallback>
                          </Avatar>
                          <span className="absolute bottom-0 right-0 h-2 w-2 rounded-full border border-card bg-emerald-500" />
                        </div>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="font-medium">{member.name}</p>
                        <p className="text-xs text-muted-foreground">Team Member</p>
                      </TooltipContent>
                    </Tooltip>
                  ))}
                  {onlineMembers.length > 4 && (
                    <div className="flex h-7 w-7 items-center justify-center rounded-full border-2 border-card bg-muted text-xs font-medium">
                      +{onlineMembers.length - 4}
                    </div>
                  )}
                </div>
              </TooltipProvider>

              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setShowMembers(!showMembers)}>
                <Users className="h-4 w-4" />
                <span className="sr-only">Show members</span>
              </Button>
            </>
          )}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreVertical className="h-4 w-4" />
                <span className="sr-only">More options</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {isDirectMessage && dmPartner ? (
                <>
                  <DropdownMenuItem onClick={() => alert("Profile API not connected")}>
                    <Info className="mr-2 h-4 w-4" />
                    View Profile
                  </DropdownMenuItem>
                </>
              ) : (
                <>
                  <DropdownMenuItem onClick={() => alert("Room API not connected")}>
                    <Info className="mr-2 h-4 w-4" />
                    Room Info
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden relative">
        <ScrollArea className="flex-1 p-4" viewportRef={scrollRef}>
          <div ref={topRef} className="h-1 w-full" />
          {isFetchingNextPage && <ChatMessageSkeleton />}
          <div className="flex flex-col gap-6">
            {groupedMessages.map((group) => (
              <div key={group.date}>
                <div className="mb-4 flex items-center justify-center">
                  <span className="rounded-full bg-muted px-3 py-1 text-xs text-muted-foreground">
                    {formatDateHeader(group.date)}
                  </span>
                </div>
                <div className="flex flex-col gap-4">
                  {[...group.messages].map((msg, index, arr) => {
                    const isMe = msg.sender.id === currentUserId;
                    const showAvatar = index === arr.length - 1 || arr[index + 1].sender.id !== msg.sender.id;

                    return (
                      <div key={msg.id} className={`flex gap-3 ${isMe ? "flex-row-reverse" : ""}`}>
                        {/* Avatar */}
                        <div className="w-8 shrink-0 flex flex-col justify-end">
                          {showAvatar && !isMe && (
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <div className="relative">
                                    <Avatar className="h-8 w-8">
                                      <AvatarFallback className="bg-primary/10 text-primary text-xs">
                                        {getInitials(msg.sender.name)}
                                      </AvatarFallback>
                                    </Avatar>
                                    {presenceMap[msg.sender.id] === "online" && (
                                      <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-card bg-emerald-500" />
                                    )}
                                  </div>
                                </TooltipTrigger>
                                <TooltipContent side="left">
                                  <p className="font-medium">{msg.sender.name}</p>
                                  <p className="text-xs text-muted-foreground">Team Member</p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          )}
                        </div>

                        {/* Message Content */}
                        <div className={`max-w-[70%] flex flex-col ${isMe ? "items-end" : "items-start"}`}>
                          {showAvatar && !isMe && (
                            <div className="mb-1 flex items-center gap-2">
                              <span className="text-sm font-medium text-foreground">{msg.sender.name}</span>
                              <Badge
                                variant="secondary"
                                className="text-[10px] px-1.5 py-0 bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300"
                              >
                                Team Member
                              </Badge>
                            </div>
                          )}
                          <div
                            className={`rounded-2xl px-4 py-2 ${
                              isMe
                                ? "bg-primary text-primary-foreground rounded-br-md"
                                : "bg-muted text-foreground rounded-bl-md"
                            }`}
                          >
                            <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                          </div>
                          <div
                            className={`mt-1 flex items-center gap-1 text-[10px] text-muted-foreground ${
                              isMe ? "justify-end" : ""
                            }`}
                          >
                            <span>{formatTime(msg.createdAt)}</span>
                            {/* Read receipts simulation conditionally omitted per strict instructions to fallback without data mapping overhead */}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}

            {/* Typing Indicator */}
            <TypingIndicator chatId={chatId} roomMembers={roomMembers} />
          </div>
        </ScrollArea>

        {!isAtBottom && (
          <Button
            size="icon"
            className="absolute bottom-6 right-6 rounded-full shadow-lg z-10 animate-in fade-in zoom-in w-10 h-10 bg-neutral-200/20 hover:bg-neutral-200/30 cursor-pointer"
            onClick={() => scrollToBottom(true)}
          >
            <ArrowDown className="h-5 w-5 text-foreground" />
            {hasUnreadDownBelow && (
              <span className="absolute -top-1 -right-1 flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-destructive opacity-75" />
                <span className="relative inline-flex rounded-full h-3 w-3 bg-destructive" />
              </span>
            )}
          </Button>
        )}

        {/* Members Sidebar */}
        {showMembers && (
          <div className="w-56 border-l bg-background">
            <div className="border-b p-3">
              <h4 className="text-sm font-medium">Members ({roomMembers.length})</h4>
            </div>
            <ScrollArea className="h-[calc(100%-45px)]">
              <div className="p-2">
                {/* Online Members */}
                <div className="mb-3">
                  <p className="mb-2 px-2 text-xs font-medium text-muted-foreground uppercase">
                    Online - {onlineMembers.length}
                  </p>
                  {onlineMembers.map((member) => (
                    <div key={member.id} className="flex items-center gap-2 rounded-lg px-2 py-1.5 hover:bg-muted">
                      <div className="relative">
                        <Avatar className="h-6 w-6">
                          <AvatarFallback className="bg-primary/10 text-primary text-xs">
                            {getInitials(member.name)}
                          </AvatarFallback>
                        </Avatar>
                        <span className="absolute bottom-0 right-0 h-2 w-2 rounded-full border border-card bg-emerald-500" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-xs font-medium">{member.name}</p>
                        <p className="truncate text-[10px] text-muted-foreground">Team Member</p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Offline Members */}
                {roomMembers.filter((m) => presenceMap[m.id] !== "online").length > 0 && (
                  <div>
                    <p className="mb-2 px-2 text-xs font-medium text-muted-foreground uppercase">
                      Offline - {roomMembers.filter((m) => presenceMap[m.id] !== "online").length}
                    </p>
                    {roomMembers
                      .filter((m) => presenceMap[m.id] !== "online")
                      .map((member) => (
                        <div
                          key={member.id}
                          className="flex items-center gap-2 rounded-lg px-2 py-1.5 opacity-60 hover:bg-muted"
                        >
                          <Avatar className="h-6 w-6">
                            <AvatarFallback className="bg-muted text-muted-foreground text-xs">
                              {getInitials(member.name)}
                            </AvatarFallback>
                          </Avatar>
                          <div className="min-w-0 flex-1">
                            <p className="truncate text-xs font-medium">{member.name}</p>
                            <p className="truncate text-[10px] text-muted-foreground">Offline</p>
                          </div>
                        </div>
                      ))}
                  </div>
                )}
              </div>
            </ScrollArea>
          </div>
        )}
      </div>

      {/* Input Area */}
      <ChatInput
        chatId={chatId}
        placeholder={
          isDirectMessage && dmPartner
            ? `Message ${dmPartner.name.split(" ")[0]}...`
            : `Message #${room.name.toLowerCase().replace(/\s+/g, "-")}`
        }
      />
    </div>
  );
}
