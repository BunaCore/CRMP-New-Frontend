"use client";

import { useEffect, useRef } from "react";

import { Bot, Loader2, MessageSquare, User } from "lucide-react";

import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

export interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

interface ChatMessageListProps {
  messages: Message[];
  isLoading?: boolean;
}

export function ChatMessageList({ messages, isLoading }: ChatMessageListProps) {
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (endRef.current) {
      endRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, []);

  if (messages.length === 0) {
    return (
      <ScrollArea className="min-h-0 flex-1 p-6">
        <div className="flex h-full flex-col items-center justify-center space-y-4 pt-24 opacity-40">
          <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-muted/60">
            <MessageSquare className="h-8 w-8 text-muted-foreground" />
          </div>
          <div className="text-center">
            <p className="font-semibold text-foreground text-sm tracking-tight">AI Copilot Ready</p>
            <p className="mt-1 text-muted-foreground text-xs">Start a conversation or select text to begin</p>
          </div>
        </div>
      </ScrollArea>
    );
  }

  return (
    <ScrollArea className="min-h-0 flex-1 p-4">
      <div className="flex flex-col gap-6 pb-4">
        {messages.map((m) => {
          const isUser = m.role === "user";
          return (
            <div
              key={m.id}
              className={cn("group flex w-full gap-3 transition-colors", isUser ? "flex-row-reverse" : "flex-row")}
            >
              <div
                className={cn(
                  "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border shadow-sm",
                  isUser
                    ? "border-primary/20 bg-primary/10 text-primary dark:border-primary/30 dark:bg-primary/20"
                    : "border-border bg-card text-foreground dark:border-zinc-800 dark:bg-zinc-900",
                )}
              >
                {isUser ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
              </div>
              <div className={cn("flex min-w-0 max-w-[85%] flex-col gap-1.5", isUser ? "items-end" : "items-start")}>
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-foreground text-xs">{isUser ? "You" : "Copilot"}</span>
                  <span className="font-medium text-[10px] text-muted-foreground/60 opacity-0 transition-opacity group-hover:opacity-100">
                    {m.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  </span>
                </div>
                <div
                  className={cn(
                    "relative break-words rounded-2xl px-4 py-3 text-sm leading-relaxed shadow-sm",
                    isUser
                      ? "rounded-tr-sm bg-primary text-primary-foreground dark:bg-primary dark:text-primary-foreground"
                      : "rounded-tl-sm border border-border bg-card text-card-foreground dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-100",
                  )}
                >
                  <div className="whitespace-pre-wrap">{m.content}</div>
                </div>
              </div>
            </div>
          );
        })}
        {isLoading && (
          <div className="flex w-full flex-row gap-3 transition-colors">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-border bg-card text-foreground shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
              <Bot className="h-4 w-4" />
            </div>
            <div className="flex min-w-0 max-w-[85%] flex-col items-start gap-1.5">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-foreground text-xs">Copilot</span>
              </div>
              <div className="relative flex items-center gap-2 break-words rounded-2xl rounded-tl-sm border border-border bg-card px-4 py-3 text-muted-foreground text-sm leading-relaxed shadow-sm dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-400">
                <Loader2 className="h-4 w-4 animate-spin" />
                Thinking...
              </div>
            </div>
          </div>
        )}
        <div ref={endRef} />
      </div>
    </ScrollArea>
  );
}
