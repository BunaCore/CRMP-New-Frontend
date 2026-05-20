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

export function ChatRoomsList({ currentUserId }: ChatRoomsListProps) {
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
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-medium">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
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
      <div className="px-4 pb-4 space-y-4">
        <div className="relative group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground transition-colors group-focus-within:text-primary" />
          <Input
            placeholder="Search messages..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-9 bg-muted/50 border-transparent focus-visible:bg-background focus-visible:ring-2 focus-visible:ring-primary/20 rounded-full h-10 transition-all"
          />
        </div>
        <Tabs value={filterType} onValueChange={onFilterTypeChange}>
          <TabsList className="w-full grid grid-cols-3 bg-muted/50 h-9 p-1 rounded-full">
            <TabsTrigger value="all" className="rounded-full text-xs font-medium">
              All
            </TabsTrigger>
            <TabsTrigger value="group" className="rounded-full text-xs font-medium">
              Groups
            </TabsTrigger>
            <TabsTrigger value="dm" className="rounded-full text-xs font-medium">
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
            <div className="flex flex-col items-center justify-center py-12 text-center animate-in fade-in duration-300">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-muted/50 mb-4 shadow-sm border border-border/50">
                <Hash className="h-7 w-7 text-muted-foreground/70" />
              </div>
              <p className="font-semibold text-foreground text-sm">No conversations</p>
              <p className="mt-1.5 text-muted-foreground text-xs max-w-[200px]">
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
                      isSelected ? "bg-primary/10 shadow-sm" : "hover:bg-muted/80 border border-transparent"
                    }`}
                  >
                    {/* Room Icon or Avatar */}
                    {room.type === "dm" ? (
                      <div className="relative shrink-0">
                        <Avatar className="h-11 w-11 border border-border/50 shadow-sm transition-transform group-hover:scale-105">
                          <AvatarFallback
                            className={`${isSelected ? "bg-primary text-primary-foreground font-medium" : "bg-muted font-medium text-foreground"}`}
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
                    <div className="min-w-0 flex-1 flex flex-col justify-center">
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <span
                          className={`truncate font-semibold text-[14px] leading-none ${isSelected ? "text-primary" : "text-foreground"}`}
                        >
                          {displayName}
                        </span>
                        <span
                          className={`shrink-0 text-[11px] font-medium leading-none ${isSelected ? "text-primary/70" : "text-muted-foreground/70"}`}
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
                          <span className="truncate text-muted-foreground/70 text-[12px] font-medium">Team Member</span>
                        ) : (
                          <div className="flex items-center gap-1.5 text-muted-foreground/80 text-[12px] font-medium">
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
                            className="h-5 min-w-[20px] rounded-full px-1.5 flex items-center justify-center font-bold text-[10px] shadow-sm ml-auto"
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
