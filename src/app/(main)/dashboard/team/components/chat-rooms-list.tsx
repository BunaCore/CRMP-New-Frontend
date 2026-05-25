/** biome-ignore-all assist/source/organizeImports: import order managed manually */
"use client";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useGetChats } from "@/lib/api/chat/chat.queries";
import type { ChatSummary } from "@/lib/api/chat/types";
import { useChatStore } from "@/stores/chat-store";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { formatDistanceToNow } from "date-fns";
import { Hash, MessageSquarePlus, Search, UserPlus, Users } from "lucide-react";
import { useState } from "react";
import { CreateChatModal } from "./create-chat-modal";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Separator } from "@/components/ui/separator";

type ChatRoomsListProps = {
  currentUserId: string;
};

function getInitials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

function formatRelativeTime(timestamp: string | undefined) {
  if (!timestamp) return "now";
  return formatDistanceToNow(new Date(timestamp), { addSuffix: true });
}

export function ChatRoomsList({ currentUserId: _currentUserId }: ChatRoomsListProps) {
  const { data: rooms = [] } = useGetChats();
  const activeChatId = useChatStore((s) => s.activeChatId);
  const setActiveChatId = useChatStore((s) => s.setActiveChatId);
  const presenceMap = useChatStore((s) => s.presenceMap);
  const setCreateChatMode = useChatStore((s) => s.setCreateChatMode);
  const setIsCreateChatOpen = useChatStore((s) => s.setIsCreateChatOpen);

  const [searchQuery, onSearchChange] = useState("");
  const [filterType, onFilterTypeChange] = useState<string>("all");

  const filteredRooms = rooms.filter((room) => {
    const matchesSearch = room.displayName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = filterType === "all" || room.type === filterType;
    return matchesSearch && matchesType;
  });

  const getOnlineMembersCount = (room: ChatSummary) => {
    return (room.memberIds || []).filter((id) => presenceMap[id] === "online").length;
  };

  return (
    <div className="flex h-full flex-col border-r bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-4">
        <div className="flex flex-col gap-0.5">
          <h2 className="font-semibold text-lg tracking-tight">Messages</h2>
          <div className="flex items-center gap-1.5 font-medium text-muted-foreground text-xs">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
            </span>
            {Object.values(presenceMap).filter((v) => v === "online").length} online
          </div>
        </div>
        <DropdownMenu>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <DropdownMenuTrigger asChild>
                  <Button size="icon" variant="ghost" className="h-9 w-9 rounded-full hover:bg-muted">
                    <MessageSquarePlus className="h-5 w-5 text-muted-foreground" />
                    <span className="sr-only">New message</span>
                  </Button>
                </DropdownMenuTrigger>
              </TooltipTrigger>
              <TooltipContent>New message</TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuItem
              onClick={() => {
                setCreateChatMode("dm");
                setIsCreateChatOpen(true);
              }}
              className="cursor-pointer"
            >
              <UserPlus className="mr-2 h-4 w-4" />
              <span>Direct Message</span>
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => {
                setCreateChatMode("group");
                setIsCreateChatOpen(true);
              }}
              className="cursor-pointer"
            >
              <Users className="mr-2 h-4 w-4" />
              <span>Group Chat</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <CreateChatModal />

      {/* Search & Filter */}
      <div className="space-y-4 px-4 pb-4">
        <div className="group relative">
          <Search className="-translate-y-1/2 absolute top-1/2 left-3 h-4 w-4 text-muted-foreground transition-colors group-focus-within:text-primary" />
          <Input
            placeholder="Search messages..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="h-10 rounded-full border-transparent bg-muted/50 pl-9 transition-all focus-visible:bg-background focus-visible:ring-2 focus-visible:ring-primary/20"
          />
        </div>
        <Tabs value={filterType} onValueChange={onFilterTypeChange}>
          <TabsList className="grid h-9 w-full grid-cols-3 rounded-full bg-muted/50 p-1">
            <TabsTrigger value="all" className="rounded-full font-medium text-xs">
              All
            </TabsTrigger>
            <TabsTrigger value="group" className="rounded-full font-medium text-xs">
              Groups
            </TabsTrigger>
            <TabsTrigger value="dm" className="rounded-full font-medium text-xs">
              Direct
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <Separator className="opacity-50" />

      {/* Room List */}
      <ScrollArea type="hover" className="h-full flex-1">
        <div className="p-3">
          {filteredRooms.length === 0 ? (
            <div className="fade-in flex animate-in flex-col items-center justify-center py-12 text-center duration-300">
              <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl border border-border/50 bg-muted/50 shadow-sm">
                <Hash className="h-7 w-7 text-muted-foreground/70" />
              </div>
              <p className="font-semibold text-foreground text-sm">No conversations</p>
              <p className="mt-1.5 max-w-[200px] text-muted-foreground text-xs">
                {searchQuery ? "No matches found for your search." : "Start a new conversation to get started."}
              </p>
            </div>
          ) : (
            <div className="space-y-1">
              {filteredRooms.map((room) => {
                const isSelected = room.id === activeChatId;
                const onlineCount = getOnlineMembersCount(room);
                const displayName = room.displayName;
                const isPartnerOnline =
                  room.type === "dm" && room.otherMemberId ? presenceMap[room.otherMemberId] === "online" : false;

                return (
                  <button
                    type="button"
                    key={room.id}
                    onClick={() => setActiveChatId(room.id)}
                    className={`group flex w-full items-center gap-3 rounded-xl p-3 text-left transition-all duration-200 ${
                      isSelected ? "bg-primary/10 shadow-sm" : "border border-transparent hover:bg-muted/80"
                    }`}
                  >
                    {/* Room Icon or Avatar */}
                    {room.type === "dm" ? (
                      <div className="relative shrink-0">
                        <Avatar className="h-11 w-11 border border-border/50 shadow-sm transition-transform group-hover:scale-105">
                          <AvatarFallback
                            className={`${isSelected ? "bg-primary font-medium text-primary-foreground" : "bg-muted font-medium text-foreground"}`}
                          >
                            {getInitials(displayName)}
                          </AvatarFallback>
                        </Avatar>
                        {isPartnerOnline && (
                          <span className="absolute right-0 bottom-0 h-3.5 w-3.5 rounded-full border-[2.5px] border-background bg-emerald-500 shadow-sm" />
                        )}
                      </div>
                    ) : (
                      <div
                        className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-border/50 shadow-sm transition-transform group-hover:scale-105 ${
                          isSelected ? "bg-primary" : "bg-muted"
                        }`}
                      >
                        <Hash
                          className={`h-5 w-5 ${isSelected ? "text-primary-foreground" : "text-muted-foreground"}`}
                        />
                      </div>
                    )}

                    {/* Room Info */}
                    <div className="flex min-w-0 flex-1 flex-col justify-center">
                      <div className="mb-1 flex items-center justify-between gap-2">
                        <span
                          className={`truncate font-semibold text-[14px] leading-none ${isSelected ? "text-primary" : "text-foreground"}`}
                        >
                          {displayName}
                        </span>
                        <span
                          className={`shrink-0 font-medium text-[11px] leading-none ${isSelected ? "text-primary/70" : "text-muted-foreground/70"}`}
                        >
                          {formatRelativeTime(room.lastMessage?.createdAt)}
                        </span>
                      </div>

                      <div className="flex items-center justify-between gap-2">
                        {room.lastMessage ? (
                          <p
                            className={`truncate text-[13px] leading-tight ${isSelected ? "text-foreground/80" : "text-muted-foreground"}`}
                          >
                            {room.lastMessage.content}
                          </p>
                        ) : room.type === "dm" ? (
                          <span className="truncate font-medium text-[12px] text-muted-foreground/70">Team Member</span>
                        ) : (
                          <div className="flex items-center gap-1.5 font-medium text-[12px] text-muted-foreground/80">
                            <span className="flex items-center gap-1">
                              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                              {onlineCount} online
                            </span>
                            <span className="opacity-50">•</span>
                            <span>{(room.memberIds || []).length} members</span>
                          </div>
                        )}

                        {room.unreadCount && room.unreadCount > 0 ? (
                          <Badge
                            variant="default"
                            className="ml-auto flex h-5 min-w-[20px] items-center justify-center rounded-full px-1.5 font-bold text-[10px] shadow-sm"
                          >
                            {room.unreadCount > 99 ? "99+" : room.unreadCount}
                          </Badge>
                        ) : null}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
}
