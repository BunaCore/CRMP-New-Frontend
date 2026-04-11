/** biome-ignore-all assist/source/organizeImports: import order managed manually */
"use client";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { ChatRoom, TeamMember } from "@/lib/team-data";
import { Hash, MessageSquarePlus, Search, User } from "lucide-react";

interface ChatRoomsListProps {
  rooms: ChatRoom[];
  members: TeamMember[];
  selectedRoomId: string | null;
  currentUserId: string;
  onSelectRoom: (room: ChatRoom) => void;
  onCreateRoom: () => void;
  onStartDirectMessage: (memberId: string) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  filterType: string;
  onFilterTypeChange: (type: string) => void;
}

function getInitials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

function formatRelativeTime(timestamp: string) {
  const now = new Date();
  const date = new Date(timestamp);
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return "now";
  if (diffMins < 60) return `${diffMins}m`;
  if (diffHours < 24) return `${diffHours}h`;
  if (diffDays < 7) return `${diffDays}d`;
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

export function ChatRoomsList({
  rooms,
  members,
  selectedRoomId,
  currentUserId,
  onSelectRoom,
  onCreateRoom,
  onStartDirectMessage,
  searchQuery,
  onSearchChange,
  filterType,
  onFilterTypeChange,
}: ChatRoomsListProps) {
  const memberMap = new Map(members.map((m) => [m.id, m]));

  // Get the other member in a direct message room
  const getDirectMessagePartner = (room: ChatRoom): TeamMember | undefined => {
    if (room.type !== "direct") return undefined;
    const partnerId = room.memberIds.find((id) => id !== currentUserId);
    return partnerId ? memberMap.get(partnerId) : undefined;
  };

  const filteredRooms = rooms.filter((room) => {
    let searchName = room.name;
    if (room.type === "direct") {
      const partner = getDirectMessagePartner(room);
      if (partner) searchName = partner.name;
    }
    const matchesSearch = searchName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = filterType === "all" || room.type === filterType;
    return matchesSearch && matchesType;
  });

  // Get members not in direct message with current user (for starting new DMs)
  const availableForDM = members.filter((m) => {
    if (m.id === currentUserId) return false;
    const existingDM = rooms.find(
      (r) => r.type === "direct" && r.memberIds.includes(m.id) && r.memberIds.includes(currentUserId),
    );
    return !existingDM;
  });

  const getOnlineMembersCount = (room: ChatRoom) => {
    return room.memberIds.filter((id) => memberMap.get(id)?.isOnline).length;
  };

  return (
    <div className="flex h-full flex-col border-r bg-background">
      {/* Header */}
      <div className="border-b px-4 py-3">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-semibold text-foreground text-lg">Team Chat</h2>
            <p className="text-muted-foreground text-xs">{members.filter((m) => m.isOnline).length} members online</p>
          </div>
          <Button size="icon" variant="outline" className="h-8 w-8" onClick={onCreateRoom}>
            <MessageSquarePlus className="h-4 w-4" />
            <span className="sr-only">Create room</span>
          </Button>
        </div>
      </div>

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
            <TabsTrigger value="direct" className="flex-1">
              Direct
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Room List */}
      <ScrollArea className="flex-1">
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
                const isSelected = room.id === selectedRoomId;
                const onlineCount = getOnlineMembersCount(room);
                const partner = room.type === "direct" ? getDirectMessagePartner(room) : null;
                const displayName = partner ? partner.name : room.name;
                const isPartnerOnline = partner?.isOnline;

                return (
                  <button
                    type="button"
                    key={room.id}
                    onClick={() => onSelectRoom(room)}
                    className={`flex w-full items-start gap-3 rounded-lg p-3 text-left transition-colors ${
                      isSelected ? "border border-primary/20 bg-primary/10" : "border border-transparent hover:bg-muted"
                    }`}
                  >
                    {/* Room Icon or Avatar */}
                    {room.type === "direct" && partner ? (
                      <div className="relative shrink-0">
                        <Avatar className="h-10 w-10">
                          <AvatarFallback className={`${isSelected ? "bg-primary/20 text-primary" : "bg-muted"}`}>
                            {getInitials(partner.name)}
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
                          {formatRelativeTime(room.lastActivity)}
                        </span>
                      </div>
                      <div className="mt-0.5 flex items-center justify-between gap-2">
                        {room.type === "direct" && partner ? (
                          <span className="truncate text-muted-foreground text-xs">{partner.role}</span>
                        ) : (
                          <div className="flex items-center gap-1.5 text-muted-foreground text-xs">
                            <span className="flex items-center gap-1">
                              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                              {onlineCount} online
                            </span>
                            <span className="text-muted-foreground/50">|</span>
                            <span>{room.memberIds.length} members</span>
                          </div>
                        )}
                        {room.unreadCount && room.unreadCount > 0 && (
                          <Badge variant="default" className="h-5 min-w-5 rounded-full px-1.5 font-bold text-[10px]">
                            {room.unreadCount > 99 ? "99+" : room.unreadCount}
                          </Badge>
                        )}
                      </div>
                      {room.description && room.type === "group" && (
                        <p className="mt-1 truncate text-muted-foreground/70 text-xs">{room.description}</p>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Start New Direct Message Section */}
        {filterType !== "group" && availableForDM.length > 0 && (
          <div className="border-t p-3">
            <p className="mb-2 font-medium text-muted-foreground text-xs uppercase">Start a conversation</p>
            <div className="space-y-1">
              {availableForDM.slice(0, 3).map((member) => (
                <button
                  type="button"
                  key={member.id}
                  onClick={() => onStartDirectMessage(member.id)}
                  className="flex w-full items-center gap-3 rounded-lg p-2 text-left transition-colors hover:bg-muted"
                >
                  <div className="relative">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="bg-muted text-xs">{getInitials(member.name)}</AvatarFallback>
                    </Avatar>
                    {member.isOnline && (
                      <span className="absolute right-0 bottom-0 h-2 w-2 rounded-full border border-background bg-emerald-500" />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-medium text-foreground text-sm">{member.name}</p>
                    <p className="truncate text-muted-foreground text-xs">{member.department}</p>
                  </div>
                  <User className="h-4 w-4 text-muted-foreground" />
                </button>
              ))}
            </div>
          </div>
        )}
      </ScrollArea>

      {/* Online Members Quick View */}
      <div className="border-t p-3">
        <p className="mb-2 font-medium text-muted-foreground text-xs uppercase">Active Now</p>
        <div className="flex flex-wrap gap-1">
          {members
            .filter((m) => m.isOnline)
            .slice(0, 6)
            .map((member) => (
              <button
                type="button"
                key={member.id}
                onClick={() => {
                  const existingDM = rooms.find(
                    (r) =>
                      r.type === "direct" && r.memberIds.includes(member.id) && r.memberIds.includes(currentUserId),
                  );
                  if (existingDM) {
                    onSelectRoom(existingDM);
                  } else if (member.id !== currentUserId) {
                    onStartDirectMessage(member.id);
                  }
                }}
                className="group relative"
                title={member.name}
              >
                <Avatar className="h-8 w-8 border-2 border-background transition-transform group-hover:scale-110">
                  <AvatarFallback className="bg-primary/10 text-primary text-xs">
                    {getInitials(member.name)}
                  </AvatarFallback>
                </Avatar>
                <span className="absolute right-0 bottom-0 h-2.5 w-2.5 rounded-full border-2 border-background bg-emerald-500" />
              </button>
            ))}
          {members.filter((m) => m.isOnline).length > 6 && (
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted font-medium text-xs">
              +{members.filter((m) => m.isOnline).length - 6}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
