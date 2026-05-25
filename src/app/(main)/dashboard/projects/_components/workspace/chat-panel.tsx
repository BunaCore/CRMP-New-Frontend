"use client";

import { useEffect } from "react";

import { AnimatePresence, motion } from "framer-motion";
import { Bell, Info, Library, Plus, Share2, Sparkles } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAiChat } from "@/lib/ai/hooks/useAiChat";
import { useAuthStore } from "@/stores/authStore";

import { ActivityTab } from "./chat/activity-tab";
import { ChatComposer } from "./chat/chat-composer";
import { ChatMessageList } from "./chat/chat-message-list";
import { RagTab } from "./chat/rag-tab";
import { WorkspaceDetailsTab } from "./chat/workspace-details-tab";
import { useWorkspace } from "./workspace-context";

export function ChatPanel() {
  const { isChatOpen, autoSendTrigger, setAutoSendTrigger, projectId, workspaceName, aiMode } = useWorkspace();
  const user = useAuthStore((state) => state.user);

  const { messages, status, sendMessage, sendToolbarAction, clearMessages } = useAiChat(aiMode, {
    projectId,
    workspaceId: "",
    workspaceName,
    userRole: user?.roles?.[0] ?? "Member",
  });

  useEffect(() => {
    if (autoSendTrigger) {
      sendToolbarAction(
        autoSendTrigger.prompt,
        autoSendTrigger.context,
        autoSendTrigger.requestType,
        autoSendTrigger.from,
        autoSendTrigger.to,
      );
      setAutoSendTrigger(null);
    }
  }, [autoSendTrigger, setAutoSendTrigger, sendToolbarAction]);

  const handleSend = (content: string) => sendMessage(content);
  const handleClear = () => clearMessages();

  return (
    <AnimatePresence>
      {isChatOpen && (
        <motion.aside
          initial={{ width: 0, opacity: 0 }}
          animate={{ width: 360, opacity: 1 }}
          exit={{ width: 0, opacity: 0 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          // overflow-hidden clips the inner 360px content while the panel slides in/out
          className="relative z-30 flex h-full max-h-full shrink-0 flex-col overflow-hidden border-border border-l bg-background shadow-2xl dark:border-zinc-800 dark:bg-zinc-950/95"
        >
          {/*
           * Fixed-width inner shell — always 360px so children never measure
           * an animated partial width. overflow-hidden on the aside clips this.
           */}
          <div className="flex h-full max-h-full w-[360px] min-w-0 flex-col overflow-hidden">
            {/* ── Top Bar ─────────────────────────────────── */}
            <div className="flex shrink-0 items-center justify-between border-border border-b bg-card/40 px-4 py-3 backdrop-blur-md dark:border-zinc-800 dark:bg-zinc-900/60">
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

            {/* ── Tabs ────────────────────────────────────── */}
            {/*
             * KEY FIX: min-h-0 + flex-1 + overflow-hidden allows the tab
             * container to shrink to fit the panel without overflowing.
             * Each TabsContent is a plain flex column child — NO absolute positioning.
             */}
            <Tabs defaultValue="chat" className="flex min-h-0 flex-1 flex-col overflow-hidden">
              {/* Tab strip */}
              <div className="shrink-0 px-4 pt-3 pb-2">
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
                    Related
                  </TabsTrigger>
                </TabsList>
              </div>

              {/*
               * TabsContent: m-0 border-none p-0 removes shadcn defaults.
               * flex flex-col flex-1 min-h-0 overflow-hidden replaces the
               * old "relative + absolute inset-0" hack — no absolute children.
               */}
              <TabsContent value="chat" className="m-0 flex h-0 flex-1 flex-col overflow-hidden border-none p-0">
                <ChatMessageList messages={messages} isLoading={status === "pending"} />
                <ChatComposer onSend={handleSend} onClear={handleClear} isSending={status === "pending"} />
              </TabsContent>

              <TabsContent value="rag" className="m-0 flex h-0 flex-1 flex-col overflow-hidden border-none p-0">
                <RagTab />
              </TabsContent>

              <TabsContent value="details" className="m-0 flex h-0 flex-1 flex-col overflow-hidden border-none p-0">
                <WorkspaceDetailsTab />
              </TabsContent>

              <TabsContent
                value="notifications"
                className="m-0 flex h-0 flex-1 flex-col overflow-hidden border-none p-0"
              >
                <ActivityTab />
              </TabsContent>
            </Tabs>
          </div>
        </motion.aside>
      )}
    </AnimatePresence>
  );
}
