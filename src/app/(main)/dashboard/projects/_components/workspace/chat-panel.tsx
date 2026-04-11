"use client";

import { useState } from "react";

import { ArrowUp, Bell, Bot, Info, MessageSquare, Paperclip, Plus, Share2, User } from "lucide-react";

import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

import { useWorkspace } from "./workspace-context";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

export function ChatPanel() {
  const { isChatOpen } = useWorkspace();
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);

  if (!isChatOpen) return null;

  const handleSend = () => {
    if (!input.trim()) return;

    const newMessage: Message = {
      id: Math.random().toString(36).substr(2, 9),
      role: "user",
      content: input,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, newMessage]);
    setInput("");
  };

  return (
    <aside className="slide-in-from-right relative z-30 flex h-full w-96 shrink-0 animate-in flex-col overflow-hidden border-l bg-background duration-500 ease-in-out">
      {/* Top Bar */}
      <div className="flex items-center justify-between border-b px-4 py-3">
        <Button
          variant="ghost"
          size="sm"
          className="group gap-2 text-muted-foreground transition-colors hover:text-foreground"
        >
          <Plus className="h-4 w-4 text-primary transition-transform group-hover:scale-110" />
          <span className="font-medium text-sm">New chat</span>
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="gap-2 rounded-full bg-muted/50 px-4 text-foreground hover:bg-muted"
        >
          <Share2 className="h-3.5 w-3.5" />
          <span className="font-semibold text-xs">Share</span>
        </Button>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="chat" className="flex flex-1 flex-col overflow-hidden">
        <div className="px-4 pt-4">
          <TabsList className="h-10 w-full rounded-xl border border-border/50 bg-muted/30 p-1">
            <TabsTrigger
              value="chat"
              className="flex-1 gap-2 rounded-lg font-bold text-xs transition-all data-[state=active]:bg-background data-[state=active]:shadow-sm"
            >
              <MessageSquare className="h-3.5 w-3.5" />
              Chat
            </TabsTrigger>
            <TabsTrigger
              value="details"
              className="flex-1 gap-2 rounded-lg font-bold text-xs transition-all data-[state=active]:bg-background data-[state=active]:shadow-sm"
            >
              <Info className="h-3.5 w-3.5" />
              Details
            </TabsTrigger>
            <TabsTrigger
              value="notifications"
              className="flex-1 gap-2 rounded-lg font-bold text-xs transition-all data-[state=active]:bg-background data-[state=active]:shadow-sm"
            >
              <Bell className="h-3.5 w-3.5" />
              Notification
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="chat" className="m-0 flex flex-1 flex-col overflow-hidden border-none p-0">
          {/* Middle Content - Mostly Empty for clean look */}
          <ScrollArea className="flex-1 p-6">
            {messages.length === 0 ? (
              <div className="flex h-full flex-col items-center justify-center space-y-4 pt-24 opacity-20">
                <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-muted">
                  <MessageSquare className="h-8 w-8 text-muted-foreground" />
                </div>
                <p className="font-medium text-sm tracking-tight">No active messages</p>
              </div>
            ) : (
              <div className="flex flex-col gap-6">
                {messages.map((m) => {
                  const isUser = m.role === "user";
                  return (
                    <div
                      key={m.id}
                      className={cn(
                        "group flex w-full gap-3 transition-colors",
                        isUser ? "flex-row-reverse" : "flex-row",
                      )}
                    >
                      <div
                        className={cn(
                          "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border shadow-sm",
                          isUser
                            ? "border-primary/20 bg-primary/10 text-primary"
                            : "border-border bg-card text-foreground",
                        )}
                      >
                        {isUser ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
                      </div>
                      <div
                        className={cn(
                          "flex min-w-0 max-w-[85%] flex-col gap-1.5",
                          isUser ? "items-end" : "items-start",
                        )}
                      >
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-foreground text-xs">{isUser ? "You" : "Assistant"}</span>
                          <span className="font-medium text-[10px] text-muted-foreground/60 opacity-0 transition-opacity group-hover:opacity-100">
                            {m.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                          </span>
                        </div>
                        <div
                          className={cn(
                            "relative break-words rounded-2xl px-4 py-3 text-sm leading-relaxed shadow-sm",
                            isUser
                              ? "rounded-tr-sm bg-primary text-primary-foreground"
                              : "rounded-tl-sm border border-border bg-card text-card-foreground",
                          )}
                        >
                          <div className="whitespace-pre-wrap">{m.content}</div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </ScrollArea>

          {/* Chat Input */}
          <div className="p-4 pt-0">
            <div className="group relative flex w-full flex-col overflow-hidden rounded-2xl border border-border/80 bg-card/50 shadow-sm transition-colors focus-within:border-primary/40 focus-within:ring-2 focus-within:ring-primary/20">
              <textarea
                rows={1}
                className="custom-scrollbar max-h-[200px] min-h-[44px] w-full resize-none border-none bg-transparent px-4 py-3 text-sm outline-none transition-all placeholder:text-muted-foreground/50"
                placeholder="Message assistant..."
                value={input}
                onChange={(e) => {
                  setInput(e.target.value);
                  e.target.style.height = "inherit";
                  e.target.style.height = `${Math.min(e.target.scrollHeight, 200)}px`;
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSend();
                    setTimeout(() => {
                      if (e.target instanceof HTMLTextAreaElement) {
                        e.target.style.height = "inherit";
                      }
                    }, 0);
                  }
                }}
              />
              <div className="flex items-center justify-between px-3 pb-3">
                <div className="flex items-center gap-1 text-muted-foreground">
                  <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full transition-colors hover:bg-muted">
                    <Paperclip className="h-4 w-4" />
                  </Button>
                </div>
                <Button
                  onClick={handleSend}
                  disabled={!input.trim()}
                  size="icon"
                  className={cn(
                    "h-8 w-8 rounded-full shadow-sm transition-all",
                    input.trim()
                      ? "bg-primary text-primary-foreground hover:bg-primary/90"
                      : "bg-muted text-muted-foreground opacity-50",
                  )}
                >
                  <ArrowUp className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <div className="mt-2 text-center font-medium text-[10px] text-muted-foreground/50">
              Assistant is an AI and may occasionally be incorrect.
            </div>
          </div>
        </TabsContent>

        <TabsContent value="details" className="fade-in slide-in-from-top-2 flex-1 animate-in p-6 duration-300">
          <div className="space-y-6">
            <div className="space-y-2">
              <h4 className="font-bold text-muted-foreground/60 text-xs uppercase tracking-widest">Project Details</h4>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Detailed information about the current project and document lifecycle.
              </p>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="notifications" className="fade-in slide-in-from-top-2 flex-1 animate-in p-6 duration-300">
          <div className="flex h-full flex-col items-center justify-center space-y-3 opacity-30">
            <Bell className="h-8 w-8" />
            <p className="font-medium text-sm">Clear for now</p>
          </div>
        </TabsContent>
      </Tabs>
    </aside>
  );
}
