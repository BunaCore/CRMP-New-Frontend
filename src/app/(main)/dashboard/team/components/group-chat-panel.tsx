/** biome-ignore-all lint/complexity/noUselessFragments: false positive */
/** biome-ignore-all lint/correctness/useExhaustiveDependencies: false positive */
/** biome-ignore-all assist/source/organizeImports: false positive */
/** biome-ignore-all lint/nursery/useSortedClasses: false positive */
"use client";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import type { ChatRoom, GroupChatMessage, TeamMember } from "@/lib/team-data";
import { Check, CheckCheck, Hash, Info, MoreVertical, Paperclip, Send, Settings, Smile, Users } from "lucide-react";
import { useEffect, useRef, useState } from "react";

interface GroupChatPanelProps {
  room: ChatRoom;
  messages: GroupChatMessage[];
  members: TeamMember[];
  currentUserId: string;
  typingUsers: string[];
  onSendMessage: (content: string) => void;
  onViewRoomInfo: () => void;
  onViewProfile?: (memberId: string) => void;
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

function getRelativeTime(timestamp: string) {
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

const roleColors: Record<string, string> = {
  "Principal Investigator": "bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-300",
  "Co-Investigator": "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300",
  "Research Assistant": "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300",
  "Graduate Student": "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300",
  "Postdoctoral Fellow": "bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-300",
};

export function GroupChatPanel({
  room,
  messages,
  members,
  currentUserId,
  typingUsers,
  onSendMessage,
  onViewRoomInfo,
  onViewProfile,
}: GroupChatPanelProps) {
  const [inputValue, setInputValue] = useState("");
  const [showMembers, setShowMembers] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Get member map for quick lookups
  const memberMap = new Map(members.map((m) => [m.id, m]));
  const roomMembers = room.memberIds.map((id) => memberMap.get(id)).filter(Boolean) as TeamMember[];
  const onlineMembers = roomMembers.filter((m) => m.isOnline);
  const typingMemberNames = typingUsers.map((id) => memberMap.get(id)?.name.split(" ")[0]).filter(Boolean);

  // For direct messages, get the other participant
  const isDirectMessage = room.type === "direct";
  const dmPartner = isDirectMessage ? memberMap.get(room.memberIds.find((id) => id !== currentUserId) || "") : null;

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    inputRef.current?.focus();
  }, [room.id]);

  const handleSend = () => {
    if (inputValue.trim()) {
      onSendMessage(inputValue.trim());
      setInputValue("");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // Group messages by date
  const groupedMessages: { date: string; messages: GroupChatMessage[] }[] = [];
  let currentDate = "";
  messages.forEach((msg) => {
    const msgDate = new Date(msg.timestamp).toDateString();
    if (msgDate !== currentDate) {
      currentDate = msgDate;
      groupedMessages.push({ date: msg.timestamp, messages: [msg] });
    } else {
      groupedMessages[groupedMessages.length - 1].messages.push(msg);
    }
  });

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
                {dmPartner.isOnline && (
                  <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-card bg-emerald-500" />
                )}
              </div>
              <div>
                <h3 className="font-semibold text-foreground">{dmPartner.name}</h3>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className={`text-[10px] px-1.5 py-0 ${roleColors[dmPartner.role] || ""}`}>
                    {dmPartner.role}
                  </Badge>
                  <span className="text-xs text-muted-foreground">
                    {dmPartner.isOnline
                      ? "Online"
                      : dmPartner.lastSeen
                        ? getRelativeTime(dmPartner.lastSeen)
                        : "Offline"}
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
                        <p className="text-xs text-muted-foreground">{member.role}</p>
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
                  <DropdownMenuItem onClick={() => onViewProfile?.(dmPartner.id)}>
                    <Info className="mr-2 h-4 w-4" />
                    View Profile
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="text-destructive">
                    <Settings className="mr-2 h-4 w-4" />
                    Block User
                  </DropdownMenuItem>
                </>
              ) : (
                <>
                  <DropdownMenuItem onClick={onViewRoomInfo}>
                    <Info className="mr-2 h-4 w-4" />
                    Room Details
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setShowMembers(true)}>
                    <Users className="mr-2 h-4 w-4" />
                    View Members ({roomMembers.length})
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <Settings className="mr-2 h-4 w-4" />
                    Room Settings
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Messages Area */}
        <ScrollArea className="flex-1 p-4" ref={scrollRef}>
          <div className="space-y-6">
            {groupedMessages.map((group) => (
              <div key={group.date}>
                {/* Date Header */}
                <div className="mb-4 flex items-center justify-center">
                  <span className="rounded-full bg-muted px-3 py-1 text-xs text-muted-foreground">
                    {formatDateHeader(group.date)}
                  </span>
                </div>
                {/* Messages */}
                <div className="space-y-4">
                  {group.messages.map((message, msgIdx) => {
                    const isSent = message.senderId === currentUserId;
                    const sender = memberMap.get(message.senderId);
                    const showAvatar = msgIdx === 0 || group.messages[msgIdx - 1].senderId !== message.senderId;

                    return (
                      <div key={message.id} className={`flex gap-3 ${isSent ? "flex-row-reverse" : ""}`}>
                        {/* Avatar */}
                        <div className="w-8 shrink-0">
                          {showAvatar && !isSent && sender && (
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <div className="relative">
                                    <Avatar className="h-8 w-8">
                                      <AvatarFallback className="bg-primary/10 text-primary text-xs">
                                        {getInitials(sender.name)}
                                      </AvatarFallback>
                                    </Avatar>
                                    {sender.isOnline && (
                                      <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-card bg-emerald-500" />
                                    )}
                                  </div>
                                </TooltipTrigger>
                                <TooltipContent side="left">
                                  <p className="font-medium">{sender.name}</p>
                                  <p className="text-xs text-muted-foreground">{sender.role}</p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          )}
                        </div>

                        {/* Message Content */}
                        <div className={`max-w-[70%] ${isSent ? "items-end" : "items-start"}`}>
                          {showAvatar && !isSent && sender && (
                            <div className="mb-1 flex items-center gap-2">
                              <span className="text-sm font-medium text-foreground">{sender.name}</span>
                              <Badge
                                variant="secondary"
                                className={`text-[10px] px-1.5 py-0 ${roleColors[sender.role] || ""}`}
                              >
                                {sender.role
                                  .split(" ")
                                  .map((w) => w[0])
                                  .join("")}
                              </Badge>
                              <span className="text-[10px] text-muted-foreground">
                                {getRelativeTime(message.timestamp)}
                              </span>
                            </div>
                          )}
                          <div
                            className={`rounded-2xl px-4 py-2 ${
                              isSent
                                ? "bg-primary text-primary-foreground rounded-br-md"
                                : "bg-muted text-foreground rounded-bl-md"
                            }`}
                          >
                            <p className="text-sm leading-relaxed">{message.content}</p>
                          </div>
                          <div
                            className={`mt-1 flex items-center gap-1 text-[10px] ${
                              isSent ? "justify-end" : ""
                            } text-muted-foreground`}
                          >
                            <span>{formatTime(message.timestamp)}</span>
                            {isSent && (
                              <>
                                {message.readBy.length > 1 ? (
                                  <TooltipProvider>
                                    <Tooltip>
                                      <TooltipTrigger asChild>
                                        <span className="flex items-center gap-0.5">
                                          <CheckCheck className="h-3 w-3 text-primary" />
                                          <span className="text-primary">{message.readBy.length - 1}</span>
                                        </span>
                                      </TooltipTrigger>
                                      <TooltipContent>
                                        <p className="text-xs">
                                          Read by{" "}
                                          {message.readBy
                                            .filter((id) => id !== currentUserId)
                                            .map((id) => memberMap.get(id)?.name.split(" ")[0])
                                            .filter(Boolean)
                                            .join(", ")}
                                        </p>
                                      </TooltipContent>
                                    </Tooltip>
                                  </TooltipProvider>
                                ) : (
                                  <Check className="h-3 w-3" />
                                )}
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}

            {/* Typing Indicator */}
            {typingMemberNames.length > 0 && (
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
            )}
          </div>
        </ScrollArea>

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
                        <p className="truncate text-[10px] text-muted-foreground">{member.role}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Offline Members */}
                {roomMembers.filter((m) => !m.isOnline).length > 0 && (
                  <div>
                    <p className="mb-2 px-2 text-xs font-medium text-muted-foreground uppercase">
                      Offline - {roomMembers.filter((m) => !m.isOnline).length}
                    </p>
                    {roomMembers
                      .filter((m) => !m.isOnline)
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
                            <p className="truncate text-[10px] text-muted-foreground">
                              {member.lastSeen ? getRelativeTime(member.lastSeen) : "Offline"}
                            </p>
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
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={
                isDirectMessage && dmPartner
                  ? `Message ${dmPartner.name.split(" ")[0]}...`
                  : `Message #${room.name.toLowerCase().replace(/\s+/g, "-")}`
              }
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
    </div>
  );
}
