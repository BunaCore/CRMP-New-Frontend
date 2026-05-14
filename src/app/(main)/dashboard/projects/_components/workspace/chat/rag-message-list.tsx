"use client";

import { useEffect, useRef } from "react";

import { BookOpen, ExternalLink, Library, Sparkles, User } from "lucide-react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

export interface RagSource {
  id: string;
  fileId: string;
  fileName: string;
  page?: number;
  excerpt: string;
}

export interface RagMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
  sources?: RagSource[];
}

interface RagMessageListProps {
  messages: RagMessage[];
  isThinking: boolean;
  isEmpty: boolean;
}

export function RagMessageList({ messages, isThinking, isEmpty }: RagMessageListProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, []);

  if (isEmpty) {
    return (
      <div className="flex min-h-0 flex-1 flex-col items-center justify-center bg-slate-50/50 p-8 text-center dark:bg-zinc-950/50">
        <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-primary/10 shadow-inner dark:bg-primary/20">
          <Library className="h-10 w-10 text-primary opacity-80" />
        </div>
        <h3 className="mb-2 font-bold text-foreground text-xl tracking-tight">Research Assistant</h3>
        <p className="max-w-[250px] text-muted-foreground text-sm leading-relaxed">
          Upload one or more documents above to start an intelligent, source-aware conversation.
        </p>
      </div>
    );
  }

  return (
    <ScrollArea className="min-h-0 flex-1 px-4 py-6" viewportRef={scrollRef}>
      <div className="flex flex-col gap-6 pb-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={cn(
              "fade-in slide-in-from-bottom-2 flex max-w-[95%] animate-in flex-col gap-2",
              message.role === "user" ? "items-end self-end" : "items-start self-start",
            )}
          >
            {/* Sender Identification */}
            <div className={cn("flex items-center gap-2", message.role === "user" && "flex-row-reverse")}>
              <Avatar
                className={cn(
                  "h-6 w-6 border",
                  message.role === "user"
                    ? "border-primary/20"
                    : "border-border bg-card shadow-sm dark:border-zinc-800",
                )}
              >
                <AvatarFallback
                  className={cn(message.role === "user" ? "bg-primary text-primary-foreground" : "bg-transparent")}
                >
                  {message.role === "user" ? (
                    <User className="h-3.5 w-3.5" />
                  ) : (
                    <Sparkles className="h-3.5 w-3.5 text-primary" />
                  )}
                </AvatarFallback>
              </Avatar>
              <span className="font-semibold text-[11px] text-muted-foreground uppercase tracking-wider">
                {message.role === "user" ? "You" : "Research Assistant"}
              </span>
            </div>

            {/* Message Bubble */}
            <div
              className={cn(
                "rounded-2xl px-4 py-3 text-[13px] leading-relaxed shadow-sm",
                message.role === "user"
                  ? "rounded-tr-sm bg-primary text-primary-foreground"
                  : "rounded-tl-sm border border-border bg-card text-card-foreground dark:border-zinc-800 dark:bg-zinc-900/50",
              )}
            >
              <p className="whitespace-pre-wrap">{message.content}</p>
            </div>

            {/* Academic Citations / Sources */}
            {message.sources && message.sources.length > 0 && (
              <div className="mt-2 flex w-full max-w-[320px] flex-col gap-2">
                <div className="ml-1 flex items-center gap-1.5 font-semibold text-[10px] text-muted-foreground uppercase tracking-widest">
                  <BookOpen className="h-3 w-3" />
                  Sources Cited
                </div>
                {message.sources.map((source) => (
                  <div
                    key={source.id}
                    className="group flex flex-col rounded-xl border border-border bg-background p-3 shadow-sm transition-all hover:border-primary/40 hover:shadow-md dark:border-zinc-800 dark:bg-zinc-950"
                  >
                    <div className="mb-1.5 flex items-center justify-between">
                      <div className="flex items-center gap-1.5 overflow-hidden">
                        <Badge
                          variant="secondary"
                          className="h-4 rounded-sm border-none bg-primary/10 px-1 font-bold text-[9px] text-primary dark:bg-primary/20"
                        >
                          {source.page ? `Pg ${source.page}` : "Doc"}
                        </Badge>
                        <span className="truncate font-semibold text-foreground text-xs" title={source.fileName}>
                          {source.fileName}
                        </span>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-5 w-5 shrink-0 opacity-0 transition-opacity group-hover:opacity-100"
                      >
                        <ExternalLink className="h-3 w-3 text-muted-foreground" />
                      </Button>
                    </div>
                    <p className="relative line-clamp-3 pl-2 text-[11px] text-muted-foreground italic leading-relaxed before:absolute before:top-0 before:left-0 before:h-full before:w-[2px] before:rounded-full before:bg-border">
                      &quot;{source.excerpt}&quot;
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}

        {isThinking && (
          <div className="fade-in flex max-w-[85%] animate-in flex-col items-start gap-2 self-start">
            <div className="flex items-center gap-2">
              <Avatar className="h-6 w-6 border border-border bg-card shadow-sm dark:border-zinc-800">
                <AvatarFallback className="bg-transparent">
                  <Sparkles className="h-3.5 w-3.5 animate-pulse text-primary" />
                </AvatarFallback>
              </Avatar>
              <span className="animate-pulse font-semibold text-[11px] text-muted-foreground uppercase tracking-wider">
                Analyzing Sources...
              </span>
            </div>
            <div className="flex gap-1.5 rounded-2xl rounded-tl-sm border border-border bg-card px-5 py-4 dark:border-zinc-800 dark:bg-zinc-900/50">
              <div
                className="h-1.5 w-1.5 animate-bounce rounded-full bg-primary/40"
                style={{ animationDelay: "0ms" }}
              />
              <div
                className="h-1.5 w-1.5 animate-bounce rounded-full bg-primary/60"
                style={{ animationDelay: "150ms" }}
              />
              <div
                className="h-1.5 w-1.5 animate-bounce rounded-full bg-primary/80"
                style={{ animationDelay: "300ms" }}
              />
            </div>
          </div>
        )}
      </div>
    </ScrollArea>
  );
}
