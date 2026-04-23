/** biome-ignore-all lint/a11y/noStaticElementInteractions: static element interactions managed manually */
/** biome-ignore-all lint/a11y/useKeyWithClickEvents: key events managed manually */
"use client";
import { useEffect, useState } from "react";

import { Loader2, Search, X } from "lucide-react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useCreateChat } from "@/lib/api/chat/mutations";
import { useGetUsersSelector } from "@/lib/api/users/queries";
import { useChatStore } from "@/stores/chat-store";

export function CreateChatModal() {
  const isCreateChatOpen = useChatStore((s) => s.isCreateChatOpen);
  const setIsCreateChatOpen = useChatStore((s) => s.setIsCreateChatOpen);
  const createChatMode = useChatStore((s) => s.createChatMode);

  const { mutate: createChat, isPending } = useCreateChat();

  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [selectedUsers, setSelectedUsers] = useState<{ id: string; name: string }[]>([]);
  const [groupName, setGroupName] = useState("");

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 300);
    return () => clearTimeout(handler);
  }, [searchQuery]);

  const isSearchActive = debouncedSearch.trim().length > 0;
  const { data: users = [], isLoading } = useGetUsersSelector(undefined, debouncedSearch, isSearchActive);

  // Prevent local filtering so we strictly rely on backend hits
  const filteredUsers = isSearchActive ? users : [];

  const handleOpenChange = (open: boolean) => {
    setIsCreateChatOpen(open);
    if (!open) {
      setTimeout(() => {
        setSearchQuery("");
        setSelectedUsers([]);
        setGroupName("");
      }, 300);
    }
  };

  const handleSelectUser = (id: string, name: string) => {
    if (createChatMode === "dm") {
      createChat({ type: "dm", memberIds: [id] }, { onSuccess: () => handleOpenChange(false) });
    } else {
      setSelectedUsers((prev) =>
        prev.some((u) => u.id === id) ? prev.filter((u) => u.id !== id) : [...prev, { id, name }],
      );
    }
  };

  const handleCreateGroup = () => {
    if (groupName.trim() && selectedUsers.length > 0) {
      createChat(
        { type: "group", name: groupName.trim(), memberIds: selectedUsers.map((u) => u.id) },
        { onSuccess: () => handleOpenChange(false) },
      );
    }
  };

  return (
    <Dialog open={isCreateChatOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{createChatMode === "dm" ? "New Direct Message" : "Create Group Chat"}</DialogTitle>
          <DialogDescription>
            {createChatMode === "dm"
              ? "Select a team member to start chatting."
              : "Name your group and select members."}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {createChatMode === "group" && (
            <div className="space-y-2">
              <label htmlFor="groupName" className="text-sm font-medium">
                Group Name
              </label>
              <Input
                id="groupName"
                placeholder="E.g. Marketing Campaign..."
                value={groupName}
                onChange={(e) => setGroupName(e.target.value)}
                disabled={isPending}
              />
            </div>
          )}

          <div className="space-y-2">
            <label htmlFor="searchMembers" className="text-sm font-medium">
              Search Members
            </label>

            {/* Visual Chips for selected users */}
            {createChatMode === "group" && selectedUsers.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-2 p-2 border rounded-md min-h-[42px]">
                {selectedUsers.map((user) => (
                  <Badge key={user.id} variant="secondary" className="flex items-center gap-1">
                    {user.name}
                    <X
                      className="h-3 w-3 cursor-pointer ml-1 hover:text-destructive"
                      onClick={() => handleSelectUser(user.id, user.name)}
                    />
                  </Badge>
                ))}
              </div>
            )}

            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Type to search..."
                className="pl-9"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                disabled={isPending}
              />
            </div>
          </div>

          <div className="max-h-64 overflow-y-auto rounded-md border p-2 space-y-1">
            {isLoading && isSearchActive ? (
              <div className="flex items-center justify-center p-4">
                <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
              </div>
            ) : filteredUsers.length > 0 ? (
              filteredUsers.map((user) => {
                const isSelected = selectedUsers.some((u) => u.id === user.value);
                return (
                  <div
                    key={user.value}
                    onClick={() => {
                      if (isPending) return;
                      handleSelectUser(user.value, user.label);
                    }}
                    className={`flex items-center gap-3 rounded-lg p-2 cursor-pointer transition-colors ${
                      isSelected ? "bg-primary/20 text-primary" : "hover:bg-muted"
                    } ${isPending ? "opacity-50 cursor-not-allowed" : ""}`}
                  >
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className={isSelected ? "bg-primary/20 text-primary" : ""}>
                        {user.label.slice(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{user.label}</p>
                    </div>
                  </div>
                );
              })
            ) : isSearchActive ? (
              <p className="text-center text-sm text-muted-foreground p-4">No users found.</p>
            ) : (
              <p className="text-center text-sm text-muted-foreground p-4">Type a name to search members.</p>
            )}
          </div>
        </div>

        {createChatMode === "group" && (
          <DialogFooter>
            <Button variant="outline" onClick={() => handleOpenChange(false)} disabled={isPending}>
              Cancel
            </Button>
            <Button onClick={handleCreateGroup} disabled={isPending || !groupName.trim() || selectedUsers.length === 0}>
              {isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              Create Group
            </Button>
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
}
