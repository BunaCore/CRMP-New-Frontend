"use client";

import { useEffect, useState } from "react";

import { AnimatePresence, motion } from "framer-motion";
import { Bell, Info, Library, Plus, Share2, Sparkles } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { ChatComposer } from "./chat/chat-composer";
import { ChatMessageList, type Message } from "./chat/chat-message-list";
import { RagTab } from "./chat/rag-tab";
import { WorkspaceDetailsTab } from "./chat/workspace-details-tab";
import { ActivityTab } from "./chat/activity-tab";
import { useWorkspace } from "./workspace-context";

export function ChatPanel() {
  const { isChatOpen, autoSendTrigger, setAutoSendTrigger } = useWorkspace();
  const [messages, setMessages] = useState<Message[]>([]);

  // Automatically handle sending when triggered from the editor toolbar
  useEffect(() => {
    if (autoSendTrigger) {
      const combinedMessage = `${autoSendTrigger.prompt}:\n\n> ${autoSendTrigger.context.replace(/\n/g, "\n> ")}`;

      const newMessage: Message = {
        id: Math.random().toString(36).substr(2, 9),
        role: "user",
        content: combinedMessage,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, newMessage]);
      setAutoSendTrigger(null);
    }
  }, [autoSendTrigger, setAutoSendTrigger]);

  const handleSend = (content: string) => {
    const newMessage: Message = {
      id: Math.random().toString(36).substr(2, 9),
      role: "user",
      content,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, newMessage]);
  };

  const handleClear = () => {
    setMessages([]);
  };

  return (
    <AnimatePresence>
      {isChatOpen && (
        <motion.aside
          initial={{ width: 0, opacity: 0 }}
          animate={{ width: 350, opacity: 1 }}
          exit={{ width: 0, opacity: 0 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className="relative z-30 flex h-full shrink-0 flex-col overflow-hidden border-border border-l bg-background shadow-2xl dark:border-zinc-800 dark:bg-zinc-950/95"
        >
          <div className="flex h-full w-[350px] flex-col">
            {/* Top Bar */}
            <div className="flex items-center justify-between border-border border-b bg-card/40 px-4 py-3 backdrop-blur-md dark:border-zinc-800 dark:bg-zinc-900/60">
              <Button
                variant="ghost"
                size="sm"
                className="group gap-2 text-muted-foreground transition-colors hover:text-foreground dark:hover:bg-zinc-800/50"
                onClick={handleClear}
              >
                <Plus className="h-4 w-4 text-primary transition-transform group-hover:scale-110" />
                <span className="font-medium text-sm">New chat</span>
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="gap-2 rounded-full bg-muted/50 px-4 text-foreground hover:bg-muted dark:bg-zinc-800/80 dark:hover:bg-zinc-700"
              >
                <Share2 className="h-3.5 w-3.5" />
                <span className="font-semibold text-xs">Share</span>
              </Button>
            </div>

            {/* Tabs */}
            <Tabs defaultValue="chat" className="flex min-h-0 flex-1 flex-col overflow-hidden">
              <div className="px-4 pt-4">
                <TabsList className="h-10 w-full rounded-xl border border-border/50 bg-muted/30 p-1 dark:border-zinc-800/50 dark:bg-zinc-900/50">
                  <TabsTrigger
                    value="chat"
                    className="flex-1 gap-1.5 rounded-lg font-bold text-xs transition-all data-[state=active]:bg-background data-[state=active]:text-primary data-[state=active]:shadow-sm dark:data-[state=active]:bg-zinc-800"
                  >
                    <Sparkles className="h-3.5 w-3.5" />
                    Chat
                  </TabsTrigger>
                  <TabsTrigger
                    value="rag"
                    className="flex-1 gap-1.5 rounded-lg font-bold text-xs transition-all data-[state=active]:bg-background data-[state=active]:text-primary data-[state=active]:shadow-sm dark:data-[state=active]:bg-zinc-800"
                  >
                    <Library className="h-3.5 w-3.5" />
                    RAG
                  </TabsTrigger>
                  <TabsTrigger
                    value="details"
                    className="flex-1 gap-1.5 rounded-lg font-bold text-xs transition-all data-[state=active]:bg-background data-[state=active]:shadow-sm dark:data-[state=active]:bg-zinc-800"
                  >
                    <Info className="h-3.5 w-3.5" />
                    Details
                  </TabsTrigger>
                  <TabsTrigger
                    value="notifications"
                    className="flex-1 gap-2 rounded-lg font-bold text-xs transition-all data-[state=active]:bg-background data-[state=active]:shadow-sm dark:data-[state=active]:bg-zinc-800"
                  >
                    <Bell className="h-3.5 w-3.5" />
                    Activity
                  </TabsTrigger>
                </TabsList>
              </div>

              <TabsContent value="chat" className="relative m-0 min-h-0 flex-1 border-none p-0">
                <div className="absolute inset-0 flex flex-col overflow-hidden">
                  {/* Middle Content - Message List */}
                  <ChatMessageList messages={messages} />

                  {/* Sticky Bottom Composer */}
                  <ChatComposer onSend={handleSend} onClear={handleClear} />
                </div>
              </TabsContent>

              <TabsContent value="rag" className="relative m-0 min-h-0 flex-1 border-none p-0">
                <div className="absolute inset-0 flex flex-col overflow-hidden">
                  <RagTab />
                </div>
              </TabsContent>

              <TabsContent value="details" className="relative m-0 min-h-0 flex-1 border-none p-0">
                <div className="absolute inset-0 flex flex-col overflow-hidden">
                  <WorkspaceDetailsTab />
                </div>
              </TabsContent>

              <TabsContent value="notifications" className="relative m-0 min-h-0 flex-1 border-none p-0">
                <div className="absolute inset-0 flex flex-col overflow-hidden">
                  <ActivityTab />
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </motion.aside>
      )}
    </AnimatePresence>
  );
}
