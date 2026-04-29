"use client";

import { useEffect, useRef, useState } from "react";

import { BookMarked, Lightbulb, ListTree, Send, SplitSquareVertical } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

interface RagComposerProps {
  onSend: (message: string) => void;
  onQuickAction: (action: string) => void;
  disabled: boolean;
}

const QUICK_ACTIONS = [
  { icon: ListTree, label: "Summarize doc" },
  { icon: Lightbulb, label: "Find key points" },
  { icon: SplitSquareVertical, label: "Compare sources" },
  { icon: BookMarked, label: "Extract citations" },
];

export function RagComposer({ onSend, onQuickAction, disabled }: RagComposerProps) {
  const [content, setContent] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`;
    }
  }, []);

  const handleSubmit = () => {
    if (!content.trim() || disabled) return;
    onSend(content.trim());
    setContent("");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="flex flex-col gap-3 bg-background p-4">
      {/* Quick Actions Scroll Area */}
      <ScrollArea className="w-full whitespace-nowrap">
        <div className="flex w-max gap-2 pb-1">
          {QUICK_ACTIONS.map((action) => {
            const Icon = action.icon;
            return (
              <Badge
                key={action.label}
                variant="outline"
                className={cn(
                  "cursor-pointer gap-1.5 border-border/80 bg-muted/20 px-2.5 py-1 font-medium text-[11px] text-muted-foreground transition-colors hover:bg-muted hover:text-foreground dark:border-zinc-800 dark:hover:bg-zinc-800",
                  disabled && "pointer-events-none cursor-not-allowed opacity-50",
                )}
                onClick={() => onQuickAction(action.label)}
              >
                <Icon className="h-3 w-3" />
                {action.label}
              </Badge>
            );
          })}
        </div>
        <ScrollBar orientation="horizontal" className="h-1" />
      </ScrollArea>

      {/* Input Box Area */}
      <div className="relative flex w-full flex-col overflow-hidden rounded-2xl border border-input bg-card shadow-sm focus-within:ring-1 focus-within:ring-primary dark:border-zinc-800 dark:bg-zinc-900/50">
        <Textarea
          ref={textareaRef}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={disabled ? "Upload a document to ask questions..." : "Ask about your documents..."}
          className="scrollbar-thin min-h-[44px] w-full resize-none border-0 bg-transparent px-4 py-3 text-foreground text-sm placeholder:text-muted-foreground/60 focus-visible:ring-0"
          rows={1}
          disabled={disabled}
        />

        <div className="flex items-center justify-between px-2 pb-2">
          <div className="flex items-center">
            {/* Optional Mode Chip inside Composer */}
            <Badge
              variant="secondary"
              className="ml-2 bg-primary/10 font-bold text-[9px] text-primary uppercase tracking-wider dark:bg-primary/20"
            >
              RAG Mode
            </Badge>
          </div>
          <Button
            size="icon"
            className={cn(
              "h-8 w-8 rounded-full transition-all",
              content.trim() && !disabled
                ? "bg-primary text-primary-foreground hover:bg-primary/90"
                : "bg-muted text-muted-foreground opacity-50 dark:bg-zinc-800",
            )}
            onClick={handleSubmit}
            disabled={!content.trim() || disabled}
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
