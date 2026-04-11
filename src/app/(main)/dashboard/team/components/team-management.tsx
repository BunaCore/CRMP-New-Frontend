/** biome-ignore-all lint/nursery/useSortedClasses: class ordering managed manually */
/** biome-ignore-all lint/correctness/noUnusedImports: imports used across the file */
/** biome-ignore-all assist/source/organizeImports: import order managed manually */
"use client";

import {
  type ChatRoom,
  type GroupChatMessage,
  type TeamMember,
  autoReplyMessages,
  chatRooms as initialChatRooms,
  directMessages as initialDirectMessages,
  groupChatMessages as initialGroupMessages,
  teamMembers as initialTeamMembers,
} from "@/lib/team-data";
import { Hash, User } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { ChatRoomsList } from "./chat-rooms-list";
import { GroupChatPanel } from "./group-chat-panel";

// Current user ID (simulating logged-in user - Betelhem)
const CURRENT_USER_ID = "2";
const CURRENT_USER_NAME = "Betelhem Tekle";

export function TeamManagement() {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>(initialTeamMembers);
  const [chatRooms, setChatRooms] = useState<ChatRoom[]>(initialChatRooms);
  const [groupMessages, setGroupMessages] = useState<Record<string, GroupChatMessage[]>>({
    ...initialGroupMessages,
    ...initialDirectMessages,
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState<string>("all");
  const [selectedRoom, setSelectedRoom] = useState<ChatRoom | null>(null);
  const [typingUsers, setTypingUsers] = useState<string[]>([]);

  // Auto-select first room
  useEffect(() => {
    if (!selectedRoom && chatRooms.length > 0) {
      setSelectedRoom(chatRooms[0]);
    }
  }, [chatRooms, selectedRoom]);

  // Simulate random online status changes
  useEffect(() => {
    const interval = setInterval(() => {
      setTeamMembers((prev) =>
        prev.map((member) => {
          // Don't change current user's status
          if (member.id === CURRENT_USER_ID) return { ...member, isOnline: true };
          // Random chance to toggle online status
          if (Math.random() < 0.05) {
            return {
              ...member,
              isOnline: !member.isOnline,
              lastSeen: member.isOnline ? new Date().toISOString() : member.lastSeen,
            };
          }
          return member;
        }),
      );
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  // Simulate incoming messages from other team members
  useEffect(() => {
    if (!selectedRoom) return;

    const simulateIncomingMessage = () => {
      // Random chance for someone to send a message
      if (Math.random() < 0.3) {
        const roomMembers = selectedRoom.memberIds.filter((id) => id !== CURRENT_USER_ID);
        const onlineMembers = roomMembers.filter((id) => teamMembers.find((m) => m.id === id)?.isOnline);

        if (onlineMembers.length === 0) return;

        const randomSenderId = onlineMembers[Math.floor(Math.random() * onlineMembers.length)];
        const sender = teamMembers.find((m) => m.id === randomSenderId);

        if (!sender) return;

        // Show typing indicator
        setTypingUsers([randomSenderId]);

        // After typing delay, send message
        setTimeout(
          () => {
            setTypingUsers([]);
            const randomMessage = autoReplyMessages[Math.floor(Math.random() * autoReplyMessages.length)];

            const newMessage: GroupChatMessage = {
              id: `msg-${Date.now()}`,
              roomId: selectedRoom.id,
              senderId: sender.id,
              senderName: sender.name,
              content: randomMessage,
              timestamp: new Date().toISOString(),
              isRead: false,
              readBy: [sender.id],
            };

            setGroupMessages((prev) => ({
              ...prev,
              [selectedRoom.id]: [...(prev[selectedRoom.id] || []), newMessage],
            }));

            // Update room's last activity and unread count
            setChatRooms((prev) =>
              prev.map((room) =>
                room.id === selectedRoom.id
                  ? {
                      ...room,
                      lastActivity: new Date().toISOString(),
                      unreadCount: (room.unreadCount || 0) + 1,
                    }
                  : room,
              ),
            );
          },
          2000 + Math.random() * 2000,
        );
      }
    };

    const interval = setInterval(simulateIncomingMessage, 8000 + Math.random() * 7000);
    return () => clearInterval(interval);
  }, [selectedRoom, teamMembers]);

  // Simulate typing indicators from multiple users
  useEffect(() => {
    if (!selectedRoom) return;

    const interval = setInterval(() => {
      if (Math.random() < 0.15) {
        const roomMembers = selectedRoom.memberIds.filter((id) => id !== CURRENT_USER_ID);
        const onlineMembers = roomMembers.filter((id) => teamMembers.find((m) => m.id === id)?.isOnline);

        if (onlineMembers.length === 0) return;

        // For direct messages, only show typing from the partner
        // For group chats, show 1-2 users typing
        if (selectedRoom.type === "direct") {
          setTypingUsers(onlineMembers.slice(0, 1));
        } else {
          const typingCount = Math.min(Math.floor(Math.random() * 2) + 1, onlineMembers.length);
          const shuffled = [...onlineMembers].sort(() => 0.5 - Math.random());
          setTypingUsers(shuffled.slice(0, typingCount));
        }

        // Clear typing after a delay
        setTimeout(
          () => {
            setTypingUsers([]);
          },
          2000 + Math.random() * 3000,
        );
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [selectedRoom, teamMembers]);

  // Mark messages as read when viewing a room
  useEffect(() => {
    if (!selectedRoom) return;

    const markAsRead = () => {
      setGroupMessages((prev) => ({
        ...prev,
        [selectedRoom.id]: (prev[selectedRoom.id] || []).map((msg) => ({
          ...msg,
          isRead: true,
          readBy: msg.readBy.includes(CURRENT_USER_ID) ? msg.readBy : [...msg.readBy, CURRENT_USER_ID],
        })),
      }));

      setChatRooms((prev) => prev.map((room) => (room.id === selectedRoom.id ? { ...room, unreadCount: 0 } : room)));
    };

    const timeout = setTimeout(markAsRead, 500);
    return () => clearTimeout(timeout);
  }, [selectedRoom]);

  const handleSelectRoom = useCallback((room: ChatRoom) => {
    setSelectedRoom(room);
    setTypingUsers([]);
  }, []);

  const handleCreateRoom = () => {
    // For demo, just show alert - in real app would open dialog
    alert("Create new room feature - would open a dialog to create a new chat room");
  };

  const handleStartDirectMessage = useCallback(
    (memberId: string) => {
      const member = teamMembers.find((m) => m.id === memberId);
      if (!member) return;

      // Check if DM already exists
      const existingDM = chatRooms.find(
        (r) => r.type === "direct" && r.memberIds.includes(memberId) && r.memberIds.includes(CURRENT_USER_ID),
      );

      if (existingDM) {
        setSelectedRoom(existingDM);
        return;
      }

      // Create new DM room
      const newRoom: ChatRoom = {
        id: `dm-${CURRENT_USER_ID}-${memberId}`,
        name: member.name,
        type: "direct",
        memberIds: [CURRENT_USER_ID, memberId],
        createdAt: new Date().toISOString(),
        lastActivity: new Date().toISOString(),
        unreadCount: 0,
      };

      setChatRooms((prev) => [newRoom, ...prev]);
      setGroupMessages((prev) => ({
        ...prev,
        [newRoom.id]: [],
      }));
      setSelectedRoom(newRoom);
      setFilterType("direct"); // Switch to direct filter to show the new DM
    },
    [teamMembers, chatRooms],
  );

  const handleSendMessage = useCallback(
    (content: string) => {
      if (!selectedRoom) return;

      const newMessage: GroupChatMessage = {
        id: `msg-${Date.now()}`,
        roomId: selectedRoom.id,
        senderId: CURRENT_USER_ID,
        senderName: CURRENT_USER_NAME,
        content,
        timestamp: new Date().toISOString(),
        isRead: true,
        readBy: [CURRENT_USER_ID],
      };

      setGroupMessages((prev) => ({
        ...prev,
        [selectedRoom.id]: [...(prev[selectedRoom.id] || []), newMessage],
      }));

      // Update room's last activity
      setChatRooms((prev) =>
        prev.map((room) => (room.id === selectedRoom.id ? { ...room, lastActivity: new Date().toISOString() } : room)),
      );

      // Simulate read receipts coming in
      setTimeout(
        () => {
          const roomMembers = selectedRoom.memberIds.filter((id) => id !== CURRENT_USER_ID);
          const onlineMembers = roomMembers.filter((id) => teamMembers.find((m) => m.id === id)?.isOnline);

          if (onlineMembers.length > 0) {
            setGroupMessages((prev) => ({
              ...prev,
              [selectedRoom.id]: (prev[selectedRoom.id] || []).map((msg) =>
                msg.id === newMessage.id
                  ? {
                      ...msg,
                      readBy: [...new Set([...msg.readBy, ...onlineMembers])],
                    }
                  : msg,
              ),
            }));
          }
        },
        1500 + Math.random() * 2000,
      );

      // Simulate auto-reply for direct messages
      if (selectedRoom.type === "direct") {
        const partnerId = selectedRoom.memberIds.find((id) => id !== CURRENT_USER_ID);
        const partner = teamMembers.find((m) => m.id === partnerId);

        if (!partnerId || !partner) return;
        if (partner.isOnline && Math.random() < 0.6) {
          // Show typing after a delay
          setTimeout(
            () => {
              setTypingUsers([partnerId]);

              // Send reply after typing
              setTimeout(
                () => {
                  setTypingUsers([]);
                  const replyMessage = autoReplyMessages[Math.floor(Math.random() * autoReplyMessages.length)];

                  const reply: GroupChatMessage = {
                    id: `msg-${Date.now()}`,
                    roomId: selectedRoom.id,
                    senderId: partnerId,
                    senderName: partner.name,
                    content: replyMessage,
                    timestamp: new Date().toISOString(),
                    isRead: true,
                    readBy: [partnerId, CURRENT_USER_ID],
                  };

                  setGroupMessages((prev) => ({
                    ...prev,
                    [selectedRoom.id]: [...(prev[selectedRoom.id] || []), reply],
                  }));

                  setChatRooms((prev) =>
                    prev.map((room) =>
                      room.id === selectedRoom.id ? { ...room, lastActivity: new Date().toISOString() } : room,
                    ),
                  );
                },
                2000 + Math.random() * 2000,
              );
            },
            1000 + Math.random() * 2000,
          );
        }
      }
    },
    [selectedRoom, teamMembers],
  );

  const handleViewRoomInfo = () => {
    if (selectedRoom) {
      if (selectedRoom.type === "direct") {
        const partnerId = selectedRoom.memberIds.find((id) => id !== CURRENT_USER_ID);
        const partner = teamMembers.find((m) => m.id === partnerId);
        if (partner) {
          alert(
            `Direct Message with ${partner.name}\nRole: ${partner.role}\nDepartment: ${partner.department}\nEmail: ${partner.email}`,
          );
        }
      } else {
        alert(
          `Room: ${selectedRoom.name}\nDescription: ${selectedRoom.description}\nMembers: ${selectedRoom.memberIds.length}`,
        );
      }
    }
  };

  const handleViewProfile = (memberId: string) => {
    const member = teamMembers.find((m) => m.id === memberId);
    if (member) {
      alert(
        `Profile: ${member.name}\nRole: ${member.role}\nDepartment: ${member.department}\nEmail: ${member.email}\nExpertise: ${member.expertise.join(", ")}`,
      );
    }
  };

  const currentMessages = selectedRoom ? groupMessages[selectedRoom.id] || [] : [];

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Left Panel - Chat Rooms List */}
      <div className="w-full shrink-0 sm:w-80 lg:w-96">
        <ChatRoomsList
          rooms={chatRooms}
          members={teamMembers}
          selectedRoomId={selectedRoom?.id || null}
          currentUserId={CURRENT_USER_ID}
          onSelectRoom={handleSelectRoom}
          onCreateRoom={handleCreateRoom}
          onStartDirectMessage={handleStartDirectMessage}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          filterType={filterType}
          onFilterTypeChange={setFilterType}
        />
      </div>

      {/* Right Panel - Chat Section (Group or Direct) */}
      <div className="hidden flex-1 flex-col sm:flex">
        {selectedRoom ? (
          <GroupChatPanel
            room={selectedRoom}
            messages={currentMessages}
            members={teamMembers}
            currentUserId={CURRENT_USER_ID}
            typingUsers={typingUsers}
            onSendMessage={handleSendMessage}
            onViewRoomInfo={handleViewRoomInfo}
            onViewProfile={handleViewProfile}
          />
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
