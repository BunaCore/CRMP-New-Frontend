"use client";

import { useEffect, useRef, useState } from "react";

import { Bot, Check, CheckCircle2, Copy, FileText, MessageSquare, User } from "lucide-react";

import { ScrollArea } from "@/components/ui/scroll-area";
import type { AiChatMessage } from "@/lib/ai/types";
import { cn } from "@/lib/utils";

function FormattedText({ text }: { text: string }) {
  const parts = text.split(/(\*\*.*?\*\*)/g);
  return (
    <>
      {parts.map((part, i) => {
        if (part.startsWith("**") && part.endsWith("**")) {
          // biome-ignore lint/suspicious/noArrayIndexKey: static parts
          return (
            <strong key={`part-${i}`} className="font-semibold text-foreground">
              {part.slice(2, -2)}
            </strong>
          );
        }
        // biome-ignore lint/suspicious/noArrayIndexKey: static parts
        return <span key={`part-${i}`}>{part}</span>;
      })}
    </>
  );
}

function PremiumTextRenderer({ content }: { content: string }) {
  const lines = (content || "").split("\n");
  const elements = [];
  let currentList: string[] = [];
  let currentParagraph: string[] = [];

  const flushParagraph = () => {
    if (currentParagraph.length > 0) {
      elements.push(
        <div key={`p-${elements.length}`} className="text-muted-foreground leading-relaxed">
          <FormattedText text={currentParagraph.join(" ")} />
        </div>,
      );
      currentParagraph = [];
    }
  };

  const flushList = () => {
    if (currentList.length > 0) {
      elements.push(
        <ol
          key={`list-${elements.length}`}
          className="list-decimal space-y-1.5 pl-5 marker:font-medium marker:text-muted-foreground/80"
        >
          {currentList.map((item, i) => (
            // biome-ignore lint/suspicious/noArrayIndexKey: List items are static
            <li key={`item-${i}`} className="pl-1">
              <FormattedText text={item} />
            </li>
          ))}
        </ol>,
      );
      currentList = [];
    }
  };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) {
      flushParagraph();
      flushList();
      continue;
    }

    if (line.match(/^#{1,6}\s/) || line.match(/^\*\*([^*]+)\*\*$/)) {
      flushParagraph();
      flushList();
      const headingText = line.replace(/^#{1,6}\s/, "").replace(/^\*\*([^*]+)\*\*$/, "$1");
      elements.push(
        <div
          key={`h-${i}`}
          className="mt-2 mb-1 font-semibold text-[13px] text-foreground uppercase tracking-wide opacity-90"
        >
          {headingText}
        </div>,
      );
      continue;
    }

    const listMatch = line.match(/^(\*|-|\d+\.)\s+(.*)/);
    if (listMatch) {
      flushParagraph();
      currentList.push(listMatch[2]);
      continue;
    }

    flushList();
    currentParagraph.push(line);
  }
  flushParagraph();
  flushList();

  return <div className="flex flex-col gap-2.5 text-sm">{elements}</div>;
}

interface ChatMessageListProps {
  messages: AiChatMessage[];
  isLoading?: boolean;
}

export function ChatMessageList({ messages, isLoading }: ChatMessageListProps) {
  const endRef = useRef<HTMLDivElement>(null);

  const [appliedActions, setAppliedActions] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (endRef.current && messages) {
      endRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const handleApplyAction = (
    action: NonNullable<AiChatMessage["pendingAction"]>["action"] | { type: "insert"; content: string },
    actionId: string,
  ) => {
    if (typeof window !== "undefined") {
      const event = new CustomEvent("apply-ai-action", {
        detail: action,
      });
      window.dispatchEvent(event);
      setAppliedActions((prev) => new Set(prev).add(actionId));
    }
  };

  const handleCopy = (content: string) => {
    navigator.clipboard.writeText(content);
  };

  if (messages.length === 0) {
    return (
      <ScrollArea className="min-h-0 flex-1 p-6">
        <div className="flex h-full flex-col items-center justify-center space-y-4 pt-24 opacity-40">
          <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-muted/60">
            <MessageSquare className="h-8 w-8 text-muted-foreground" />
          </div>
          <div className="text-center">
            <p className="font-semibold text-foreground text-sm tracking-tight">AI CRMP Ready</p>
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
                  <span className="font-semibold text-foreground text-xs">{isUser ? "You" : "CRMP"}</span>
                  <span className="font-medium text-[10px] text-muted-foreground/60 opacity-0 transition-opacity group-hover:opacity-100">
                    {m.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  </span>
                </div>
                {m.requestType && m.requestType !== "CHAT_QUESTION" && !isUser ? (
                  <div className="flex flex-col gap-2 rounded-2xl rounded-tl-sm border border-border bg-card p-4 text-sm shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
                    <div className="flex items-center gap-2 border-border/50 border-b pb-2 font-medium text-foreground">
                      <FileText className="h-4 w-4 text-primary" />
                      {m.requestType.replace(/_/g, " ")} RESULT
                    </div>
                    {/* Render diff-like view if it is a grammar/replacement action */}
                    {m.pendingAction && m.pendingAction.action.type === "replace" && m.originalContext ? (
                      <div className="mt-1 flex flex-col gap-2 rounded-md border border-border bg-muted/30 p-3">
                        <div className="flex flex-col gap-1">
                          <span className="font-semibold text-[10px] text-red-500/70 uppercase tracking-wider">
                            Original
                          </span>
                          <div className="text-muted-foreground line-through decoration-red-500/30">
                            {m.originalContext}
                          </div>
                        </div>
                        <div className="mt-1 flex flex-col gap-1">
                          <span className="font-semibold text-[10px] text-green-600/70 uppercase tracking-wider dark:text-green-500/70">
                            Corrected
                          </span>
                          <div className="text-foreground">
                            <PremiumTextRenderer content={m.content} />
                          </div>
                        </div>
                      </div>
                    ) : (
                      <PremiumTextRenderer content={m.content} />
                    )}

                    {/* Render action buttons if there is a pending action to apply */}
                    {m.pendingAction && m.pendingAction.action.type !== "none" ? (
                      <div className="mt-2 flex items-center gap-2 pt-2">
                        {appliedActions.has(m.pendingAction.id) ? (
                          <div className="flex items-center gap-1.5 font-medium text-green-600 text-xs dark:text-green-500">
                            <CheckCircle2 className="h-3.5 w-3.5" /> Applied to Editor
                          </div>
                        ) : (
                          <button
                            type="button"
                            onClick={() => {
                              if (m.pendingAction) {
                                handleApplyAction(m.pendingAction.action, m.pendingAction.id);
                              }
                            }}
                            className="flex items-center gap-1.5 rounded-md bg-primary px-3 py-1.5 font-medium text-primary-foreground text-xs transition-colors hover:bg-primary/90"
                          >
                            <Check className="h-3.5 w-3.5" />
                            Apply Changes
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => handleCopy(m.pendingAction?.action.content || m.content)}
                          className="flex items-center gap-1.5 rounded-md border border-border bg-background px-3 py-1.5 font-medium text-foreground text-xs transition-colors hover:bg-muted"
                        >
                          <Copy className="h-3.5 w-3.5" />
                          Copy
                        </button>
                      </div>
                    ) : (
                      <div className="mt-2 flex items-center gap-2 pt-2">
                        <button
                          type="button"
                          onClick={() => handleCopy(m.content)}
                          className="flex items-center gap-1.5 rounded-md border border-border bg-background px-3 py-1.5 font-medium text-foreground text-xs transition-colors hover:bg-muted"
                        >
                          <Copy className="h-3.5 w-3.5" />
                          Copy
                        </button>
                        <button
                          type="button"
                          onClick={() => handleApplyAction({ type: "insert", content: m.content }, m.id)}
                          className="flex items-center gap-1.5 rounded-md bg-secondary px-3 py-1.5 font-medium text-secondary-foreground text-xs transition-colors hover:bg-secondary/80"
                        >
                          Insert at Cursor
                        </button>
                      </div>
                    )}
                  </div>
                ) : isUser && m.requestType && m.requestType !== "CHAT_QUESTION" ? (
                  <div className="flex flex-col gap-1.5 rounded-2xl rounded-tr-sm bg-muted px-4 py-3 text-sm shadow-sm dark:bg-zinc-800/50">
                    <div className="border-border/40 border-b pb-1 font-medium text-foreground">
                      {m.content.split(":")[0]}
                    </div>
                    <div className="mt-1 whitespace-pre-wrap border-primary/40 border-l-2 pl-2 text-muted-foreground text-xs italic">
                      {m.content.split(":").slice(1).join(":").trim().replace(/^>\s*/, "")}
                    </div>
                  </div>
                ) : (
                  <div
                    className={cn(
                      "relative break-words rounded-2xl px-4 py-3 text-sm leading-relaxed shadow-sm",
                      isUser
                        ? "rounded-tr-sm bg-primary text-primary-foreground dark:bg-primary dark:text-primary-foreground"
                        : "rounded-tl-sm border border-border bg-card text-card-foreground dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-100",
                    )}
                  >
                    {isUser ? (
                      <div className="whitespace-pre-wrap">{m.content}</div>
                    ) : (
                      <PremiumTextRenderer content={m.content} />
                    )}
                  </div>
                )}
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
                <span className="font-semibold text-foreground text-xs">CRMP</span>
              </div>
              <div className="relative flex h-[38px] items-center break-words rounded-2xl rounded-tl-sm border border-border bg-card px-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
                <div className="flex items-center gap-1.5">
                  <div
                    className="h-1.5 w-1.5 animate-bounce rounded-full bg-primary/60"
                    style={{ animationDelay: "0ms" }}
                  />
                  <div
                    className="h-1.5 w-1.5 animate-bounce rounded-full bg-primary/60"
                    style={{ animationDelay: "150ms" }}
                  />
                  <div
                    className="h-1.5 w-1.5 animate-bounce rounded-full bg-primary/60"
                    style={{ animationDelay: "300ms" }}
                  />
                </div>
              </div>
            </div>
          </div>
        )}
        <div ref={endRef} />
      </div>
    </ScrollArea>
  );
}
