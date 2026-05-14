"use client";

import { useEffect, useRef, useState } from "react";

import { ArrowUp, ChevronDown, Cloud, Image as ImageIcon, Laptop, Paperclip, Sparkles, Trash2, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

import { useWorkspace } from "../workspace-context";

interface ChatComposerProps {
  onSend: (message: string) => void;
  onClear: () => void;
  isSending?: boolean;
}

export function ChatComposer({ onSend, onClear, isSending }: ChatComposerProps) {
  const { aiMode, setAiMode, selectedContext, setSelectedContext, prefillPrompt, setPrefillPrompt } = useWorkspace();
  const [input, setInput] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (prefillPrompt) {
      setInput(prefillPrompt);
      setPrefillPrompt(null);
      if (textareaRef.current) {
        textareaRef.current.focus();
      }
    }
  }, [prefillPrompt, setPrefillPrompt]);

  const handleSend = () => {
    if (!input.trim() || isSending) return;

    // Combine context and input if needed, but for UI just pass input
    // The backend logic would append the context
    onSend(input);
    setInput("");
    setSelectedContext(null);
  };

  const ModeIcon = aiMode === "local" ? Laptop : Cloud;

  return (
    <div className="flex flex-col gap-2 p-4 pt-0">
      {/* Context Awareness Chip */}
      {selectedContext && (
        <div className="fade-in slide-in-from-bottom-2 flex animate-in items-start gap-2 rounded-lg border border-primary/20 bg-primary/5 px-3 py-2 text-primary text-sm transition-all dark:border-primary/30 dark:bg-primary/10">
          <Sparkles className="mt-0.5 h-3.5 w-3.5 shrink-0" />
          <div className="flex-1 overflow-hidden">
            <span className="mb-0.5 block font-semibold text-xs uppercase tracking-wider opacity-70">
              Selected Context
            </span>
            <p className="truncate text-xs">{selectedContext}</p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="h-5 w-5 shrink-0 rounded-full hover:bg-primary/20 hover:text-primary dark:hover:bg-primary/30"
            onClick={() => setSelectedContext(null)}
          >
            <X className="h-3 w-3" />
          </Button>
        </div>
      )}

      {/* Quick Actions (if empty) */}
      {!input && !selectedContext && (
        <div className="scrollbar-hide flex gap-2 overflow-x-auto pb-1">
          <Button
            variant="outline"
            size="sm"
            className="h-7 shrink-0 rounded-full text-[10px] dark:border-zinc-800 dark:bg-zinc-900/50 dark:hover:bg-zinc-800"
            onClick={() => setInput("Summarize the document")}
          >
            Summarize
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="h-7 shrink-0 rounded-full text-[10px] dark:border-zinc-800 dark:bg-zinc-900/50 dark:hover:bg-zinc-800"
            onClick={() => setInput("Explain key concepts")}
          >
            Explain key concepts
          </Button>
        </div>
      )}

      {/* Composer Box */}
      <div className="group relative flex w-full flex-col overflow-hidden rounded-xl border border-border bg-card/50 shadow-sm transition-colors focus-within:border-primary/40 focus-within:ring-2 focus-within:ring-primary/20 dark:border-zinc-800 dark:bg-zinc-900/50">
        <textarea
          ref={textareaRef}
          rows={1}
          className="custom-scrollbar max-h-[200px] min-h-[44px] w-full resize-none border-none bg-transparent px-4 py-3 text-sm outline-none transition-all placeholder:text-muted-foreground/50"
          placeholder={selectedContext ? "Ask about selected text..." : "Ask CRMP..."}
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

        {/* Toolbar */}
        <div className="flex items-center justify-between px-3 pb-3">
          <div className="flex items-center gap-1">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 gap-1.5 px-2 font-medium text-muted-foreground text-xs hover:text-foreground"
                >
                  <ModeIcon className="h-3.5 w-3.5" />
                  {aiMode === "local" ? "Local AI" : "Cloud AI"}
                  <ChevronDown className="h-3 w-3 opacity-50" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-[200px]">
                <DropdownMenuLabel className="text-muted-foreground text-xs">Model Mode</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => setAiMode("local")}
                  className="flex cursor-pointer flex-col items-start gap-1 p-2"
                >
                  <div className="flex items-center gap-2 font-medium">
                    <Laptop className="h-4 w-4" />
                    Local AI
                  </div>
                  <span className="text-[10px] text-muted-foreground">Private device model, secure</span>
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => setAiMode("cloud")}
                  className="flex cursor-pointer flex-col items-start gap-1 p-2"
                >
                  <div className="flex items-center gap-2 font-medium">
                    <Cloud className="h-4 w-4" />
                    Cloud AI
                  </div>
                  <span className="text-[10px] text-muted-foreground">Stronger hosted model, faster</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <div className="mx-1 h-4 w-px bg-border" />

            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 rounded-full text-muted-foreground hover:text-foreground"
              title="Attach file"
            >
              <Paperclip className="h-3.5 w-3.5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 rounded-full text-muted-foreground hover:text-foreground"
              title="Attach image"
            >
              <ImageIcon className="h-3.5 w-3.5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 rounded-full text-muted-foreground hover:text-foreground"
              title="Clear chat"
              onClick={onClear}
            >
              <Trash2 className="h-3.5 w-3.5" />
            </Button>
          </div>

          <Button
            onClick={handleSend}
            disabled={!input.trim() || isSending}
            size="icon"
            className={cn(
              "h-7 w-7 rounded-md shadow-sm transition-all",
              input.trim() && !isSending
                ? "bg-primary text-primary-foreground hover:bg-primary/90"
                : "bg-muted text-muted-foreground opacity-50",
            )}
          >
            <ArrowUp className="h-4 w-4" />
          </Button>
        </div>
      </div>
      <div className="mt-1 text-center font-medium text-[10px] text-muted-foreground/50">
        AI can make mistakes. Verify important information.
      </div>
    </div>
  );
}
