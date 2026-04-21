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

interface ChatRoomsListProps {
  onStartDirectMessage: (memberId: string) => void;
}

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

export function ChatRoomsList({ onStartDirectMessage }: ChatRoomsListProps) {
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
    <div className="flex h-full flex-col border-r bg-background">
      {/* Header */}
      <div className="border-b px-4 py-3">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-semibold text-foreground text-lg">Team Chat</h2>
            <p className="text-muted-foreground text-xs">
              {Object.values(presenceMap).filter((v) => v === "online").length} members online
            </p>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button size="icon" variant="outline" className="h-8 w-8">
                <MessageSquarePlus className="h-4 w-4" />
                <span className="sr-only">Create room</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                onClick={() => {
                  setCreateChatMode("dm");
                  setIsCreateChatOpen(true);
                }}
              >
                <UserPlus className="mr-2 h-4 w-4" />
                Direct Message
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => {
                  setCreateChatMode("group");
                  setIsCreateChatOpen(true);
                }}
              >
                <Users className="mr-2 h-4 w-4" />
                Group Chat
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <CreateChatModal />

      {/* Search & Filter */}
      <div className="space-y-3 p-3">
        <div className="relative">
          <Search className="-translate-y-1/2 absolute top-1/2 left-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search conversations..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-9"
          />
        </div>
        <Tabs value={filterType} onValueChange={onFilterTypeChange}>
          <TabsList className="w-full">
            <TabsTrigger value="all" className="flex-1">
              All
            </TabsTrigger>
            <TabsTrigger value="group" className="flex-1">
              Groups
            </TabsTrigger>
            <TabsTrigger value="dm" className="flex-1">
              Direct
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Room List */}
      <ScrollArea type="hover" className="flex-1 h-full">
        <div className="p-2">
          {filteredRooms.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted">
                <Hash className="h-6 w-6 text-muted-foreground" />
              </div>
              <p className="mt-3 font-medium text-foreground text-sm">No conversations found</p>
              <p className="mt-1 text-muted-foreground text-xs">
                {searchQuery ? "Try a different search" : "Create a new conversation to get started"}
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
                    className={`flex w-full items-start gap-3 rounded-lg p-3 text-left transition-colors ${
                      isSelected ? "border border-primary/20 bg-primary/10" : "border border-transparent hover:bg-muted"
                    }`}
                  >
                    {/* Room Icon or Avatar */}
                    {room.type === "dm" ? (
                      <div className="relative shrink-0">
                        <Avatar className="h-10 w-10">
                          <AvatarFallback className={`${isSelected ? "bg-primary/20 text-primary" : "bg-muted"}`}>
                            {getInitials(displayName)}
                          </AvatarFallback>
                        </Avatar>
                        {isPartnerOnline && (
                          <span className="absolute right-0 bottom-0 h-3 w-3 rounded-full border-2 border-background bg-emerald-500" />
                        )}
                      </div>
                    ) : (
                      <div
                        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${
                          isSelected ? "bg-primary/20" : "bg-muted"
                        }`}
                      >
                        <Hash className={`h-5 w-5 ${isSelected ? "text-primary" : "text-muted-foreground"}`} />
                      </div>
                    )}

                    {/* Room Info */}
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-2">
                        <span
                          className={`truncate font-medium text-sm ${isSelected ? "text-primary" : "text-foreground"}`}
                        >
                          {displayName}
                        </span>
                        <span className="shrink-0 text-[10px] text-muted-foreground">
                          {formatRelativeTime(room.lastMessage?.createdAt)}
                        </span>
                      </div>
                      <div className="mt-0.5 flex items-center justify-between gap-2">
                        {room.type === "dm" ? (
                          <span className="truncate text-muted-foreground text-xs">Team Member</span>
                        ) : (
                          <div className="flex items-center gap-1.5 text-muted-foreground text-xs">
                            <span className="flex items-center gap-1">
                              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                              {onlineCount} online
                            </span>
                            <span className="text-muted-foreground/50">|</span>
                            <span>{(room.memberIds || []).length} members</span>
                          </div>
                        )}
                        {room.unreadCount && room.unreadCount > 0 && (
                          <Badge variant="default" className="h-5 min-w-5 rounded-full px-1.5 font-bold text-[10px]">
                            {room.unreadCount > 99 ? "99+" : room.unreadCount}
                          </Badge>
                        )}
                      </div>
                      {room.lastMessage && room.type === "group" && (
                        <p className="mt-1 truncate text-muted-foreground/70 text-xs">{room.lastMessage.content}</p>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Start New Direct Message Section */}
        {/* Temporarily disabled while we implement "all members" directory fetching */}
      </ScrollArea>
    </div>
  );
}
