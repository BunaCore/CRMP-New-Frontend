/** biome-ignore-all lint/nursery/useSortedClasses: class ordering managed manually */
/** biome-ignore-all lint/correctness/noUnusedImports: imports used across the file */
/** biome-ignore-all assist/source/organizeImports: import order managed manually */
"use client";

import { Hash } from "lucide-react";
import { useCallback } from "react";
import { useChatStore } from "@/stores/chat-store";
import { ChatRoomsList } from "./chat-rooms-list";
import { GroupChatPanel } from "./group-chat-panel";

// Current user ID (simulating logged-in user)
const CURRENT_USER_ID = "2";

export function TeamManagement() {
  const activeChatId = useChatStore((s) => s.activeChatId);

  const handleCreateRoom = useCallback(() => {
    // For demo, just show alert - in real app would open dialog
    alert("Create new room feature - would open a dialog to create a new chat room");
  }, []);

  const handleStartDirectMessage = useCallback((memberId: string) => {
    // Logic to be moved downstream using API
    alert(`Initiate direct message with user ${memberId} - Not fully implemented without members directory.`);
  }, []);

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Left Panel - Chat Rooms List */}
      <div className="w-full shrink-0 sm:w-80 lg:w-96">
        <ChatRoomsList onCreateRoom={handleCreateRoom} onStartDirectMessage={handleStartDirectMessage} />
      </div>

      {/* Right Panel - Chat Section (Group or Direct) */}
      <div className="hidden flex-1 flex-col sm:flex">
        {activeChatId ? (
          <GroupChatPanel chatId={activeChatId} currentUserId={CURRENT_USER_ID} />
        ) : (
          <div className="flex flex-1 flex-col items-center justify-center bg-card">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted">
              <Hash className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="mt-4 text-lg font-medium text-foreground">No conversation selected</h3>
            <p className="mt-1 text-sm text-muted-foreground">Select a chat room or start a direct message</p>
          </div>
        )}
      </div>
    </div>
  );
}
