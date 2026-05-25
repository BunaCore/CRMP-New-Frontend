"use client";

import { useEffect, useRef, useState } from "react";

import { BookOpen, ChevronDown, ChevronUp, ExternalLink, Library, Sparkles, User } from "lucide-react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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

// Inline token parser for bold, inline code, citations, and links
function parseInline(text: string, sources?: RagSource[], onCitationClick?: (sourceId: string) => void) {
  const regex = /(\*\*.*?\*\*|`.*?`|\[\d+\]|\[.*?\]\(.*?\))/g;
  const parts = text.split(regex);
  if (parts.length === 1) return text;

  return parts.map((part, index) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return (
        // biome-ignore lint/suspicious/noArrayIndexKey: parts are static
        <strong key={index} className="font-semibold text-foreground dark:text-zinc-50">
          {part.slice(2, -2)}
        </strong>
      );
    }
    if (part.startsWith("`") && part.endsWith("`")) {
      return (
        // biome-ignore lint/suspicious/noArrayIndexKey: parts are static
        <code
          key={index}
          className="rounded bg-muted px-1.5 py-0.5 font-mono text-[11px] text-primary dark:bg-zinc-800"
        >
          {part.slice(1, -1)}
        </code>
      );
    }
    const citationMatch = part.match(/^\[(\d+)\]$/);
    if (citationMatch) {
      const sourceNum = citationMatch[1];
      const sourceIndex = Number.parseInt(sourceNum, 10) - 1;
      const associatedSource = sources?.[sourceIndex];
      return (
        <button
          type="button"
          // biome-ignore lint/suspicious/noArrayIndexKey: parts are static
          key={index}
          onClick={(e) => {
            if (associatedSource && onCitationClick) {
              e.preventDefault();
              onCitationClick(associatedSource.id);
            }
          }}
          className="mx-0.5 inline-flex h-4 min-w-4 cursor-pointer items-center justify-center rounded bg-primary/10 px-1 font-bold text-[10px] text-primary transition-colors hover:bg-primary/20 dark:bg-primary/20 dark:text-primary-foreground dark:hover:bg-primary/30"
          title={associatedSource ? `Source: ${associatedSource.fileName}` : `Citation [${sourceNum}]`}
        >
          {sourceNum}
        </button>
      );
    }
    const linkMatch = part.match(/^\[(.*?)\]\((.*?)\)$/);
    if (linkMatch) {
      const linkText = linkMatch[1];
      const linkUrl = linkMatch[2];
      return (
        <a
          // biome-ignore lint/suspicious/noArrayIndexKey: parts are static
          key={index}
          href={linkUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="font-medium text-primary underline underline-offset-4 transition-colors hover:text-primary/80"
        >
          {linkText}
        </a>
      );
    }
    // biome-ignore lint/suspicious/noArrayIndexKey: parts are static
    return <span key={index}>{part}</span>;
  });
}

// Block renderer for Markdown elements (Headings, quotes, lists, and paragraphs)
interface RagResponseRendererProps {
  content: string;
  sources?: RagSource[];
  onCitationClick?: (sourceId: string) => void;
}

function RagResponseRenderer({ content, sources, onCitationClick }: RagResponseRendererProps) {
  const lines = content.split("\n");
  const blocks: React.ReactNode[] = [];

  let currentList: { type: "bullet" | "number"; items: string[] } | null = null;
  let currentParagraph: string[] = [];

  const flushParagraph = () => {
    if (currentParagraph.length > 0) {
      const text = currentParagraph.join("\n");
      blocks.push(
        <p
          key={`p-${blocks.length}`}
          className="mb-2.5 whitespace-pre-wrap text-[13px] text-muted-foreground leading-relaxed last:mb-0"
        >
          {parseInline(text, sources, onCitationClick)}
        </p>,
      );
      currentParagraph = [];
    }
  };

  const flushList = () => {
    if (currentList) {
      const { type, items } = currentList;
      const listKey = `list-${blocks.length}`;
      if (type === "bullet") {
        blocks.push(
          <ul key={listKey} className="my-2.5 space-y-2">
            {items.map((item, i) => (
              // biome-ignore lint/suspicious/noArrayIndexKey: list is static
              <li key={i} className="flex items-start gap-2 text-[13px] text-muted-foreground leading-relaxed">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary/70" />
                <span className="flex-1">{parseInline(item, sources, onCitationClick)}</span>
              </li>
            ))}
          </ul>,
        );
      } else {
        blocks.push(
          <ol key={listKey} className="my-2.5 space-y-2">
            {items.map((item, i) => (
              // biome-ignore lint/suspicious/noArrayIndexKey: list is static
              <li key={i} className="flex items-start gap-2 text-[13px] text-muted-foreground leading-relaxed">
                <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-sm bg-muted font-bold text-[10px] text-muted-foreground dark:bg-zinc-800">
                  {i + 1}
                </span>
                <span className="flex-1">{parseInline(item, sources, onCitationClick)}</span>
              </li>
            ))}
          </ol>,
        );
      }
      currentList = null;
    }
  };

  for (let i = 0; i < lines.length; i++) {
    const rawLine = lines[i];
    const trimmed = rawLine.trim();

    if (!trimmed) {
      flushParagraph();
      flushList();
      continue;
    }

    // Headers
    const headerMatch = rawLine.match(/^(#{1,6})\s+(.*)$/);
    if (headerMatch) {
      flushParagraph();
      flushList();
      const level = headerMatch[1].length;
      const headerText = headerMatch[2];
      const headerClasses = cn(
        "font-semibold text-foreground tracking-tight mt-3 mb-1 first:mt-0",
        level === 1 && "text-[14px] border-b pb-0.5 border-border/50",
        level === 2 && "text-[13.5px]",
        level === 3 && "text-[13px]",
        level >= 4 && "text-[12.5px] uppercase text-muted-foreground/95",
      );

      if (level === 1) {
        blocks.push(
          <h1 key={`h-${i}`} className={headerClasses}>
            {parseInline(headerText, sources, onCitationClick)}
          </h1>,
        );
      } else if (level === 2) {
        blocks.push(
          <h2 key={`h-${i}`} className={headerClasses}>
            {parseInline(headerText, sources, onCitationClick)}
          </h2>,
        );
      } else if (level === 3) {
        blocks.push(
          <h3 key={`h-${i}`} className={headerClasses}>
            {parseInline(headerText, sources, onCitationClick)}
          </h3>,
        );
      } else {
        blocks.push(
          <h4 key={`h-${i}`} className={headerClasses}>
            {parseInline(headerText, sources, onCitationClick)}
          </h4>,
        );
      }
      continue;
    }

    // Blockquote
    const quoteMatch = rawLine.match(/^>\s*(.*)$/);
    if (quoteMatch) {
      flushParagraph();
      flushList();
      const quoteText = quoteMatch[1];
      blocks.push(
        <blockquote
          key={`q-${i}`}
          className="my-2.5 rounded-r-md border-primary/50 border-l-3 bg-muted/20 px-3 py-1.5 text-[12.5px] text-muted-foreground italic"
        >
          {parseInline(quoteText, sources, onCitationClick)}
        </blockquote>,
      );
      continue;
    }

    // Bullet List Item
    const bulletMatch = rawLine.match(/^(\*|-)\s+(.*)$/);
    if (bulletMatch) {
      flushParagraph();
      const itemText = bulletMatch[2];
      if (currentList && currentList.type === "bullet") {
        currentList.items.push(itemText);
      } else {
        flushList();
        currentList = { type: "bullet", items: [itemText] };
      }
      continue;
    }

    // Numbered List Item
    const numberMatch = rawLine.match(/^(\d+)\.\s+(.*)$/);
    if (numberMatch) {
      flushParagraph();
      const itemText = numberMatch[2];
      if (currentList && currentList.type === "number") {
        currentList.items.push(itemText);
      } else {
        flushList();
        currentList = { type: "number", items: [itemText] };
      }
      continue;
    }

    // Regular line
    if (currentList) {
      flushList();
    }
    currentParagraph.push(rawLine);
  }

  flushParagraph();
  flushList();

  return <div className="space-y-1">{blocks}</div>;
}

// Collapsible source citations view
interface RagSourcesViewProps {
  sources: RagSource[];
  expandedId: string | null;
  onToggle: (id: string) => void;
}

function RagSourcesView({ sources, expandedId, onToggle }: RagSourcesViewProps) {
  return (
    <div className="mt-3 flex w-full max-w-[320px] flex-col gap-2">
      <div className="ml-1 flex items-center gap-1.5 font-semibold text-[10px] text-muted-foreground uppercase tracking-widest">
        <BookOpen className="h-3.5 w-3.5 text-primary/70" />
        Sources Cited
      </div>
      {sources.map((source, index) => {
        const isExpanded = expandedId === source.id;
        return (
          <div
            key={source.id}
            id={`source-${source.id}`}
            className={cn(
              "group flex flex-col rounded-xl border border-border bg-background p-3 shadow-sm transition-all duration-300 hover:border-primary/40 hover:shadow-md dark:border-zinc-800 dark:bg-zinc-950",
              isExpanded && "border-primary/50 bg-card/50 ring-1 ring-primary/20 dark:bg-zinc-900/40",
            )}
          >
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-1.5 overflow-hidden">
                <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-sm bg-primary/10 font-bold text-[9px] text-primary dark:bg-primary/20 dark:text-primary-foreground">
                  {index + 1}
                </span>
                <Badge
                  variant="secondary"
                  className="h-4 rounded-sm border-none bg-muted px-1 font-bold text-[9px] text-muted-foreground dark:bg-zinc-800"
                >
                  {source.page ? `Pg ${source.page}` : "Doc"}
                </Badge>
                <span className="truncate font-semibold text-foreground text-xs" title={source.fileName}>
                  {source.fileName}
                </span>
              </div>
              <div className="flex items-center gap-1">
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-5 w-5 shrink-0 opacity-0 transition-opacity group-hover:opacity-100"
                >
                  <ExternalLink className="h-3 w-3 text-muted-foreground" />
                </Button>
                <button
                  type="button"
                  onClick={() => onToggle(source.id)}
                  className="flex h-5 w-5 shrink-0 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground dark:hover:bg-zinc-800"
                >
                  {isExpanded ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
                </button>
              </div>
            </div>
            {isExpanded && (
              <div className="mt-2 border-border/40 border-t pt-2 dark:border-zinc-800/60">
                <p className="relative pl-2 text-[11px] text-muted-foreground italic leading-relaxed before:absolute before:top-0 before:left-0 before:h-full before:w-[2px] before:rounded-full before:bg-primary/50">
                  &quot;{source.excerpt}&quot;
                </p>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

// Single Message Item to isolate local expanded citation state
interface RagMessageItemProps {
  message: RagMessage;
}

function RagMessageItem({ message }: RagMessageItemProps) {
  const [expandedSourceId, setExpandedSourceId] = useState<string | null>(null);

  const handleCitationClick = (sourceId: string) => {
    setExpandedSourceId(sourceId);
    setTimeout(() => {
      const el = document.getElementById(`source-${sourceId}`);
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "center" });
        el.classList.add("ring-2", "ring-primary", "ring-offset-2", "scale-[1.02]");
        setTimeout(() => {
          el.classList.remove("ring-2", "ring-primary", "ring-offset-2", "scale-[1.02]");
        }, 2000);
      }
    }, 100);
  };

  return (
    <div
      className={cn(
        "fade-in slide-in-from-bottom-2 flex w-full max-w-[95%] animate-in flex-col gap-2",
        message.role === "user" ? "items-end self-end" : "items-start self-start",
      )}
    >
      {/* Sender Identification */}
      <div className={cn("flex items-center gap-2", message.role === "user" && "flex-row-reverse")}>
        <Avatar
          className={cn(
            "h-6 w-6 border",
            message.role === "user" ? "border-primary/20" : "border-border bg-card shadow-sm dark:border-zinc-800",
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
      {message.role === "user" ? (
        <div className="w-full rounded-2xl rounded-tr-sm bg-primary px-4 py-3 text-[13px] text-primary-foreground leading-relaxed shadow-sm">
          <p className="whitespace-pre-wrap">{message.content}</p>
        </div>
      ) : (
        <div className="max-h-72 w-full overflow-y-auto rounded-2xl rounded-tl-sm border border-border bg-card p-4 text-[13px] leading-relaxed shadow-sm dark:border-zinc-800 dark:bg-zinc-900/50">
          <RagResponseRenderer
            content={message.content}
            sources={message.sources}
            onCitationClick={handleCitationClick}
          />
          {/* Academic Citations / Sources */}
          {message.sources && message.sources.length > 0 && (
            <RagSourcesView
              sources={message.sources}
              expandedId={expandedSourceId}
              onToggle={(id) => setExpandedSourceId(expandedSourceId === id ? null : id)}
            />
          )}
        </div>
      )}
    </div>
  );
}

export function RagMessageList({ messages, isThinking, isEmpty }: RagMessageListProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const endRef = useRef<HTMLDivElement>(null);

  // Auto-scroll when new messages appear or thinking state changes
  // biome-ignore lint/correctness/useExhaustiveDependencies: scroll when messages or thinking changes
  useEffect(() => {
    if (endRef.current) {
      endRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isThinking]);

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
    <div ref={scrollRef} className="h-0 flex-1 overflow-y-auto px-4 py-6">
      <div className="flex flex-col gap-6 pb-4">
        {messages.map((message) => (
          <RagMessageItem key={message.id} message={message} />
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
        <div ref={endRef} />
      </div>
    </div>
  );
}
