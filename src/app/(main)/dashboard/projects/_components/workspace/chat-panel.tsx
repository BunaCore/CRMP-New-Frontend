"use client";

import { useState } from "react";

import { AtSign, Bell, Info, MessageSquare, Plus, PlusCircle, SendHorizontal, Share2, Smile } from "lucide-react";

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
    <aside className="slide-in-from-right animate-in bg-background relative z-30 flex h-full w-95 shrink-0 flex-col overflow-hidden border-l duration-500 ease-in-out">
      {/* Top Bar */}
      <div className="flex items-center justify-between border-b px-4 py-3">
        <Button
          variant="ghost"
          size="sm"
          className="group text-muted-foreground hover:text-foreground gap-2 transition-colors"
        >
          <Plus className="text-primary h-4 w-4 transition-transform group-hover:scale-110" />
          <span className="text-sm font-medium">New chat</span>
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="bg-muted/50 text-foreground hover:bg-muted gap-2 rounded-full px-4"
        >
          <Share2 className="h-3.5 w-3.5" />
          <span className="text-xs font-semibold">Share</span>
        </Button>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="chat" className="flex flex-1 flex-col overflow-hidden">
        <div className="px-4 pt-4">
          <TabsList className="border-border/50 bg-muted/30 h-10 w-full rounded-xl border p-1">
            <TabsTrigger
              value="chat"
              className="data-[state=active]:bg-background flex-1 gap-2 rounded-lg text-xs font-bold transition-all data-[state=active]:shadow-sm"
            >
              <MessageSquare className="h-3.5 w-3.5" />
              Chat
            </TabsTrigger>
            <TabsTrigger
              value="details"
              className="data-[state=active]:bg-background flex-1 gap-2 rounded-lg text-xs font-bold transition-all data-[state=active]:shadow-sm"
            >
              <Info className="h-3.5 w-3.5" />
              Details
            </TabsTrigger>
            <TabsTrigger
              value="notifications"
              className="data-[state=active]:bg-background flex-1 gap-2 rounded-lg text-xs font-bold transition-all data-[state=active]:shadow-sm"
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
                <div className="bg-muted flex h-16 w-16 items-center justify-center rounded-3xl">
                  <MessageSquare className="text-muted-foreground h-8 w-8" />
                </div>
                <p className="text-sm font-medium tracking-tight">No active messages</p>
              </div>
            ) : (
              <div className="flex flex-col gap-6">
                {messages.map((m) => (
                  <div
                    key={m.id}
                    className={cn(
                      "flex max-w-[90%] flex-col gap-2",
                      m.role === "user" ? "ml-auto items-end" : "mr-auto items-start",
                    )}
                  >
                    <div
                      className={cn(
                        "border px-4 py-3 text-sm leading-relaxed shadow-xs transition-shadow hover:shadow-md",
                        m.role === "user"
                          ? "border-primary/20 bg-primary text-primary-foreground rounded-4xl rounded-br-lg"
                          : "border-border/50 bg-muted/40 rounded-4xl rounded-bl-lg",
                      )}
                    >
                      {m.content}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </ScrollArea>

          {/* Chat Input */}
          <div className="p-6 pt-2">
            <div className="group border-border/60 bg-muted/20 focus-within:border-primary/40 focus-within:bg-background focus-within:ring-primary/20 relative rounded-3xl border backdrop-blur-sm transition-all duration-300 focus-within:ring-2">
              <textarea
                rows={1}
                className="placeholder:text-muted-foreground/40 min-h-14 w-full resize-none border-none bg-transparent px-5 py-4 text-sm leading-[1.6] transition-colors placeholder:font-medium placeholder:italic focus:ring-0"
                placeholder="Untitled"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSend();
                  }
                }}
              />

              <div className="flex items-center justify-between px-4 pb-3">
                <div className="flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-muted-foreground hover:bg-primary/5 hover:text-primary h-8 w-8 rounded-full transition-all"
                  >
                    <PlusCircle className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-muted-foreground hover:bg-primary/5 hover:text-primary h-8 w-8 rounded-full transition-all"
                  >
                    <AtSign className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-muted-foreground hover:bg-primary/5 hover:text-primary h-8 w-8 rounded-full transition-all"
                  >
                    <Smile className="h-4 w-4" />
                  </Button>
                </div>

                <Button
                  onClick={handleSend}
                  disabled={!input.trim()}
                  size="sm"
                  variant="ghost"
                  className={cn(
                    "h-8 w-8 rounded-full p-0 transition-all",
                    input.trim() ? "text-primary hover:bg-primary/10" : "text-muted-foreground opacity-30",
                  )}
                >
                  <SendHorizontal className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="details" className="fade-in slide-in-from-top-2 animate-in flex-1 p-6 duration-300">
          <div className="space-y-6">
            <div className="space-y-2">
              <h4 className="text-muted-foreground/60 text-xs font-bold tracking-widest uppercase">Project Details</h4>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Detailed information about the current project and document lifecycle.
              </p>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="notifications" className="fade-in slide-in-from-top-2 animate-in flex-1 p-6 duration-300">
          <div className="flex h-full flex-col items-center justify-center space-y-3 opacity-30">
            <Bell className="h-8 w-8" />
            <p className="text-sm font-medium">Clear for now</p>
          </div>
        </TabsContent>
      </Tabs>
    </aside>
  );
}
