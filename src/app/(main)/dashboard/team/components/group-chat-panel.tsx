/** biome-ignore-all lint/complexity/noUselessFragments: fragments used for conditional multi-element rendering */
/** biome-ignore-all lint/correctness/useExhaustiveDependencies: deps managed intentionally to avoid infinite loops */
/** biome-ignore-all assist/source/organizeImports: import order managed manually */
/** biome-ignore-all lint/nursery/useSortedClasses: class ordering managed manually */
"use client";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
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
import { ArrowDown, Hash, Info, MoreHorizontal, Paperclip, Send, Smile, Search, Users, User, X } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { useChatScroll } from "@/lib/hooks/use-chat-scroll";
import { ChatMessageSkeleton } from "./skeletons/chat-message-skeleton";
import { Separator } from "@/components/ui/separator";

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
    hour: "numeric",
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
    weekday: "long",
    month: "long",
    day: "numeric",
  });
}

function TypingIndicator({ chatId, roomMembers }: { chatId: string; roomMembers: { id: string; name?: string }[] }) {
  const typingState = useChatStore((s) => s.typingState[chatId]);
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
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
    <div className="flex items-center gap-2 text-muted-foreground text-[13px] font-medium animate-in fade-in duration-300 ml-[52px] mt-1 mb-4">
      <div className="flex gap-1 items-center px-1.5 py-1 rounded-full">
        <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-muted-foreground/60 [animation-delay:-0.3s]" />
        <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-muted-foreground/60 [animation-delay:-0.15s]" />
        <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-muted-foreground/60" />
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
    emitTyping({ chatId });
  };

  const handleSend = () => {
    const content = inputValue.trim();
    if (!content) return;

    const tempId = `temp-${Date.now()}-${Math.random().toString(36).slice(2)}`;
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
    <div className="px-6 pb-6 pt-2 bg-background relative z-10 w-full">
      <div className="flex flex-col w-full bg-background rounded-xl border border-border shadow-sm focus-within:ring-1 focus-within:ring-primary focus-within:border-primary transition-all overflow-hidden">
        {/* Input Field */}
        <div className="flex-1">
          <Input
            ref={inputRef}
            value={inputValue}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            className="border-0 bg-transparent shadow-none focus-visible:ring-0 focus-visible:ring-offset-0 px-4 py-4 min-h-[50px] text-[15px] resize-none"
            autoComplete="off"
          />
        </div>

        {/* Toolbar */}
        <div className="flex items-center justify-between px-2 pb-2">
          <div className="flex items-center gap-1">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 rounded-md text-muted-foreground hover:text-foreground"
                  >
                    <Paperclip className="h-4 w-4" />
                    <span className="sr-only">Attach file</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Attach file</TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 rounded-md text-muted-foreground hover:text-foreground"
                  >
                    <Smile className="h-4 w-4" />
                    <span className="sr-only">Add emoji</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Add emoji</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>

          <Button
            onClick={handleSend}
            disabled={!inputValue.trim()}
            size="sm"
            className={`h-8 px-3 rounded-md transition-all font-medium ${inputValue.trim() ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground opacity-50"}`}
          >
            <Send className="h-4 w-4 mr-1.5" />
            Send
          </Button>
        </div>
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

  useMarkAsRead(chatId);

  const presenceMap = useChatStore((s) => s.presenceMap);

  const roomMembers = room?.members || [];
  const onlineMembers = roomMembers.filter((m) => presenceMap[m.id] === "online");

  const isDirectMessage = room?.type === "dm";
  const dmPartner = isDirectMessage ? roomMembers.find((m) => m.id !== currentUserId) : null;

  useEffect(() => {
    emitGetInitialPresence();
  }, [chatId]);

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
    return (
      <div className="flex h-full w-full items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4 text-muted-foreground animate-pulse">
          <div className="h-8 w-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
          <p className="text-sm font-medium">Loading conversation...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full w-full relative overflow-hidden bg-background">
      {/* Main Chat Area */}
      <div className="flex h-full flex-col flex-1 relative z-10 w-full min-w-0">
        {/* Chat Header (Slack/Linear Enterprise Style) */}
        <div className="flex items-center justify-between bg-background/95 backdrop-blur border-b border-border/60 px-6 py-4 z-20 shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            {isDirectMessage && dmPartner ? (
              <>
                <Avatar className="h-10 w-10 border border-border/50 shrink-0">
                  <AvatarFallback className="bg-primary/10 text-primary font-medium">
                    {getInitials(dmPartner.name)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-col justify-center min-w-0">
                  <h3 className="font-semibold text-foreground text-[16px] leading-tight truncate">
                    {dmPartner?.name}
                  </h3>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span className={`relative flex h-2 w-2 shrink-0`}>
                      {presenceMap[dmPartner?.id || ""] === "online" && (
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                      )}
                      <span
                        className={`relative inline-flex rounded-full h-2 w-2 ${presenceMap[dmPartner?.id || ""] === "online" ? "bg-emerald-500" : "bg-muted-foreground/40"}`}
                      />
                    </span>
                    <span className="text-[12px] font-medium text-muted-foreground truncate">
                      {presenceMap[dmPartner?.id || ""] === "online" ? "Active now" : "Offline"}
                    </span>
                  </div>
                </div>
              </>
            ) : (
              <>
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 border border-primary/10">
                  <Hash className="h-5 w-5 text-primary" />
                </div>
                <div className="flex flex-col justify-center min-w-0">
                  <h3 className="font-semibold text-foreground text-[16px] leading-tight truncate">{room.name}</h3>
                  <div className="flex items-center gap-1.5 mt-0.5 text-[12px] font-medium text-muted-foreground">
                    <Users className="h-3.5 w-3.5" />
                    <span>{roomMembers.length} members</span>
                    <span className="opacity-50">•</span>
                    <span className="text-emerald-600 dark:text-emerald-500">{onlineMembers.length} online</span>
                  </div>
                </div>
              </>
            )}
          </div>

          <div className="flex items-center gap-1 ml-4 shrink-0">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-9 w-9 text-muted-foreground hover:text-foreground">
                    <Search className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Search</TooltipContent>
              </Tooltip>
            </TooltipProvider>

            {!isDirectMessage && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant={showMembers ? "secondary" : "ghost"}
                      size="icon"
                      className={`h-9 w-9 text-muted-foreground hover:text-foreground ${showMembers ? "bg-muted" : ""}`}
                      onClick={() => setShowMembers(!showMembers)}
                    >
                      <User className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Show Members</TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-9 w-9 text-muted-foreground hover:text-foreground">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuItem className="cursor-pointer">
                  <Info className="mr-2 h-4 w-4" />
                  <span>View Details</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        <ScrollArea className="flex-1 w-full" viewportRef={scrollRef}>
          <div className="px-6 py-4">
            <div ref={topRef} className="h-1 w-full" />
            {isFetchingNextPage && <ChatMessageSkeleton />}

            <div className="flex flex-col pb-4">
              {groupedMessages.map((group) => (
                <div key={group.date} className="flex flex-col">
                  {/* Date Separator */}
                  <div className="flex items-center justify-center my-6">
                    <Separator className="flex-1" />
                    <span className="mx-4 text-[11px] font-semibold tracking-widest text-muted-foreground uppercase">
                      {formatDateHeader(group.date)}
                    </span>
                    <Separator className="flex-1" />
                  </div>

                  <div className="flex flex-col gap-5">
                    {[...group.messages].map((msg, index, arr) => {
                      const isMe = msg.sender.id === currentUserId;
                      const isFirstInGroup = index === 0 || arr[index - 1].sender.id !== msg.sender.id;
                      const isLastInGroup = index === arr.length - 1 || arr[index + 1].sender.id !== msg.sender.id;
                      const showAvatar = !isMe && isFirstInGroup;

                      return (
                        <div
                          key={msg.id}
                          className={`flex gap-4 w-full ${isMe ? "justify-end" : "justify-start"} ${!isFirstInGroup && !isMe ? "mt-[-12px]" : ""} ${!isFirstInGroup && isMe ? "mt-[-12px]" : ""}`}
                        >
                          {/* Avatar (Left aligned for others) */}
                          {!isMe && (
                            <div className="w-10 shrink-0">
                              {showAvatar ? (
                                <Avatar className="h-10 w-10 border border-border/50 shadow-sm mt-0.5">
                                  <AvatarFallback className="bg-primary/5 text-primary text-[14px] font-medium">
                                    {getInitials(msg.sender.name)}
                                  </AvatarFallback>
                                </Avatar>
                              ) : (
                                <div className="w-10" />
                              )}
                            </div>
                          )}

                          <div className={`flex flex-col max-w-[75%] ${isMe ? "items-end" : "items-start"}`}>
                            {/* Sender Name & Time (Top of bubble) */}
                            {isFirstInGroup && (
                              <div className={`flex items-baseline gap-2 mb-1.5 ${isMe ? "flex-row-reverse" : "ml-1"}`}>
                                {!isMe && !isDirectMessage && (
                                  <span className="text-[14px] font-semibold text-foreground tracking-tight">
                                    {msg.sender.name}
                                  </span>
                                )}
                                <span className="text-[11px] font-medium text-muted-foreground">
                                  {formatTime(msg.createdAt)}
                                </span>
                              </div>
                            )}

                            {/* Message Bubble */}
                            <div
                              className={`px-4 py-2.5 text-[15px] leading-relaxed whitespace-pre-wrap break-words shadow-sm
                                ${isMe ? "bg-primary text-primary-foreground" : "bg-muted/50 border border-border/50 text-foreground"}
                                ${isMe && isFirstInGroup && isLastInGroup ? "rounded-2xl rounded-tr-sm" : ""}
                                ${isMe && isFirstInGroup && !isLastInGroup ? "rounded-2xl rounded-tr-sm rounded-br-sm" : ""}
                                ${isMe && !isFirstInGroup && isLastInGroup ? "rounded-2xl rounded-tr-sm rounded-br-sm" : ""}
                                ${isMe && !isFirstInGroup && !isLastInGroup ? "rounded-2xl rounded-r-sm" : ""}
                                
                                ${!isMe && isFirstInGroup && isLastInGroup ? "rounded-2xl rounded-tl-sm" : ""}
                                ${!isMe && isFirstInGroup && !isLastInGroup ? "rounded-2xl rounded-tl-sm rounded-bl-sm" : ""}
                                ${!isMe && !isFirstInGroup && isLastInGroup ? "rounded-2xl rounded-tl-sm rounded-bl-sm" : ""}
                                ${!isMe && !isFirstInGroup && !isLastInGroup ? "rounded-2xl rounded-l-sm" : ""}
                              `}
                            >
                              {msg.content}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}

              <TypingIndicator chatId={chatId} roomMembers={roomMembers} />
            </div>
          </div>
        </ScrollArea>

        {!isAtBottom && (
          <Button
            size="icon"
            className="absolute bottom-28 right-8 rounded-full shadow-lg z-20 animate-in fade-in zoom-in w-10 h-10 bg-background hover:bg-muted text-foreground border border-border"
            onClick={() => scrollToBottom(true)}
          >
            <ArrowDown className="h-4 w-4" />
            {hasUnreadDownBelow && (
              <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-primary-foreground text-[10px] font-bold shadow-sm">
                1
              </span>
            )}
          </Button>
        )}

        {/* Input Area */}
        <ChatInput
          chatId={chatId}
          placeholder={
            isDirectMessage && dmPartner ? `Message ${dmPartner.name.split(" ")[0]}` : `Message ${room.name}`
          }
        />
      </div>

      {/* Slide-over Right Sidebar (Members Info) */}
      <div
        className={`absolute top-0 right-0 h-full w-[300px] bg-background border-l border-border/60 shadow-2xl z-30 transition-transform duration-300 ease-in-out flex flex-col ${
          showMembers ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-border/60 bg-background/95 backdrop-blur shrink-0">
          <h4 className="text-[15px] font-semibold text-foreground">Room Details</h4>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 rounded-md hover:bg-muted text-muted-foreground"
            onClick={() => setShowMembers(false)}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        <ScrollArea className="flex-1 w-full">
          <div className="p-5 flex flex-col items-center border-b border-border/40">
            <div className="h-20 w-20 rounded-2xl bg-primary/10 border border-primary/10 flex items-center justify-center mb-4">
              <Hash className="h-10 w-10 text-primary" />
            </div>
            <h2 className="text-lg font-semibold text-foreground text-center">{room.name}</h2>
            <p className="text-[13px] text-muted-foreground mt-1 text-center">
              Created {formatDateHeader(room.createdAt)}
            </p>
          </div>

          <div className="p-4">
            <div className="flex items-center justify-between mb-4">
              <h5 className="text-[13px] font-semibold text-foreground">Members</h5>
              <span className="text-[12px] font-medium text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
                {roomMembers.length}
              </span>
            </div>

            <div className="space-y-1">
              {roomMembers.map((member) => (
                <div
                  key={member.id}
                  className="flex items-center gap-3 rounded-lg px-2 py-2 hover:bg-muted/50 cursor-pointer transition-colors group"
                >
                  <div className="relative shrink-0">
                    <Avatar className="h-9 w-9 border border-border/50">
                      <AvatarFallback className="text-[13px] font-medium bg-primary/5 text-primary">
                        {getInitials(member.name)}
                      </AvatarFallback>
                    </Avatar>
                    <span
                      className={`absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-background ${presenceMap[member.id] === "online" ? "bg-emerald-500" : "bg-muted-foreground/30"}`}
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[14px] font-medium text-foreground leading-tight">{member.name}</p>
                    <p className="truncate text-[12px] text-muted-foreground mt-0.5">
                      {presenceMap[member.id] === "online" ? "Active" : "Offline"}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </ScrollArea>
      </div>
    </div>
  );
}
