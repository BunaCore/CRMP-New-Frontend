<<<<<<< HEAD
/** biome-ignore-all assist/source/organizeImports: intentional suppression */
=======
/** biome-ignore-all assist/source/organizeImports: <explanation> */
>>>>>>> main
"use client";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
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
import type { GroupChatMessage, TeamMember } from "@/lib/team-data";

// Legacy ChatMessage type alias for backwards compatibility
type ChatMessage = Omit<GroupChatMessage, "roomId" | "senderName" | "readBy"> & {
  senderId: string;
  isRead: boolean;
};

import { useEffect, useRef, useState } from "react";

import { Check, CheckCheck, MoreVertical, Paperclip, Send, Smile, User } from "lucide-react";

interface ChatPanelProps {
  member: TeamMember;
  messages: ChatMessage[];
  onSendMessage: (content: string) => void;
  onViewProfile: () => void;
  onRemoveMember: () => void;
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
<<<<<<< HEAD
  return date.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });
=======
  return date.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });
>>>>>>> main
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
<<<<<<< HEAD
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
=======
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
>>>>>>> main
}

export function ChatPanel({ member, messages, onSendMessage, onViewProfile, onRemoveMember }: ChatPanelProps) {
  const [inputValue, setInputValue] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, []);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

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
  const groupedMessages: { date: string; messages: ChatMessage[] }[] = [];
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
          <div className="relative">
            <Avatar className="h-10 w-10">
              <AvatarFallback className="bg-primary/10 font-medium text-primary">
                {getInitials(member.name)}
              </AvatarFallback>
            </Avatar>
            <span
              className={`absolute right-0 bottom-0 h-3 w-3 rounded-full border-2 border-card ${
                member.status === "Active" ? "bg-emerald-500" : "bg-muted-foreground/50"
              }`}
            />
          </div>
          <div>
            <h3 className="font-semibold text-foreground">{member.name}</h3>
            <p className="text-muted-foreground text-xs">
              {member.role} {member.status === "Active" ? "- Online" : "- Offline"}
            </p>
          </div>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <MoreVertical className="h-4 w-4" />
              <span className="sr-only">More options</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={onViewProfile}>
              <User className="mr-2 h-4 w-4" />
              View Profile
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={onRemoveMember} className="text-destructive focus:text-destructive">
              Remove from Team
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Messages Area */}
      <ScrollArea className="flex-1 p-4" ref={scrollRef}>
        <div className="space-y-6">
          {groupedMessages.map((group, _groupIdx) => (
            <div key={group.date}>
              {/* Date Header */}
              <div className="mb-4 flex items-center justify-center">
                <span className="rounded-full bg-muted px-3 py-1 text-muted-foreground text-xs">
                  {formatDateHeader(group.date)}
                </span>
              </div>
              {/* Messages */}
              <div className="space-y-3">
                {group.messages.map((message) => {
                  const isSent = message.senderId === "current";
                  return (
                    <div key={message.id} className={`flex ${isSent ? "justify-end" : "justify-start"}`}>
                      <div
                        className={`group max-w-[75%] rounded-2xl px-4 py-2 ${
                          isSent
                            ? "rounded-br-md bg-primary text-primary-foreground"
                            : "rounded-bl-md bg-muted text-foreground"
                        }`}
                      >
                        <p className="text-sm leading-relaxed">{message.content}</p>
                        <div
                          className={`mt-1 flex items-center gap-1 text-[10px] ${
                            isSent ? "justify-end text-primary-foreground/70" : "text-muted-foreground"
                          }`}
                        >
                          <span>{formatTime(message.timestamp)}</span>
                          {isSent &&
                            (message.isRead ? <CheckCheck className="h-3 w-3" /> : <Check className="h-3 w-3" />)}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>

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
              placeholder="Type a message..."
              className="pr-10"
            />
            <Button variant="ghost" size="icon" className="-translate-y-1/2 absolute top-1/2 right-1 h-7 w-7">
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
