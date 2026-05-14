"use client";

// ============================================================
// EditorBubbleMenu
// Context-sensitive formatting menu that appears on text selection.
// Actions: Bold, Italic, Underline, Strikethrough, Code,
//          Highlight, Link, Subscript, Superscript.
// ============================================================

import type { Editor } from "@tiptap/react";
import { BubbleMenu } from "@tiptap/react/menus";
import {
  Bold,
  Code,
  Highlighter,
  Italic,
  Link as LinkIcon,
  Strikethrough,
  Subscript,
  Superscript,
  Underline,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

import { AiToolbarMenu } from "./ai-toolbar-menu";

interface EditorBubbleMenuProps {
  editor: Editor;
  onSetLink: () => void;
}

export function EditorBubbleMenu({ editor, onSetLink }: EditorBubbleMenuProps) {
  return (
    <BubbleMenu
      editor={editor}
      // @ts-expect-error tippyOptions exists at runtime but is missing from some TipTap TS definitions
      tippyOptions={{
        duration: 150,
        placement: "top",
        animation: "shift-away",
      }}
      className={cn(
        "fade-in zoom-in-95 flex animate-in items-center gap-0.5 duration-150",
        "rounded-xl border border-border/60 bg-card/95 p-1 shadow-2xl backdrop-blur-sm",
      )}
    >
      <AiToolbarMenu editor={editor} />

      <Separator orientation="vertical" className="mx-0.5 h-4" />

      {/* Inline code — useful for citations, variable names */}
      <Button
        variant="ghost"
        size="sm"
        className={cn("h-7 w-7 rounded-lg p-0 text-xs", editor.isActive("code") && "bg-primary/10 text-primary")}
        onClick={() => editor.chain().focus().toggleCode().run()}
        title="Inline code"
      >
        <Code className="h-3.5 w-3.5" />
      </Button>

      <Separator orientation="vertical" className="mx-0.5 h-4" />

      <Button
        variant="ghost"
        size="sm"
        className={cn("h-7 w-7 rounded-lg p-0", editor.isActive("bold") && "bg-primary/10 text-primary")}
        onClick={() => editor.chain().focus().toggleBold().run()}
        title="Bold (Ctrl+B)"
      >
        <Bold className="h-3.5 w-3.5" />
      </Button>
      <Button
        variant="ghost"
        size="sm"
        className={cn("h-7 w-7 rounded-lg p-0", editor.isActive("italic") && "bg-primary/10 text-primary")}
        onClick={() => editor.chain().focus().toggleItalic().run()}
        title="Italic (Ctrl+I)"
      >
        <Italic className="h-3.5 w-3.5" />
      </Button>
      <Button
        variant="ghost"
        size="sm"
        className={cn("h-7 w-7 rounded-lg p-0", editor.isActive("underline") && "bg-primary/10 text-primary")}
        onClick={() => editor.chain().focus().toggleUnderline().run()}
        title="Underline (Ctrl+U)"
      >
        <Underline className="h-3.5 w-3.5" />
      </Button>
      <Button
        variant="ghost"
        size="sm"
        className={cn("h-7 w-7 rounded-lg p-0", editor.isActive("strike") && "bg-primary/10 text-primary")}
        onClick={() => editor.chain().focus().toggleStrike().run()}
        title="Strikethrough"
      >
        <Strikethrough className="h-3.5 w-3.5" />
      </Button>

      <Separator orientation="vertical" className="mx-0.5 h-4" />

      {/* Academic: sub/superscript */}
      <Button
        variant="ghost"
        size="sm"
        className={cn("h-7 w-7 rounded-lg p-0", editor.isActive("subscript") && "bg-primary/10 text-primary")}
        onClick={() => editor.chain().focus().toggleSubscript().run()}
        title="Subscript"
      >
        <Subscript className="h-3.5 w-3.5" />
      </Button>
      <Button
        variant="ghost"
        size="sm"
        className={cn("h-7 w-7 rounded-lg p-0", editor.isActive("superscript") && "bg-primary/10 text-primary")}
        onClick={() => editor.chain().focus().toggleSuperscript().run()}
        title="Superscript"
      >
        <Superscript className="h-3.5 w-3.5" />
      </Button>

      <Separator orientation="vertical" className="mx-0.5 h-4" />

      <Button
        variant="ghost"
        size="sm"
        className={cn("h-7 w-7 rounded-lg p-0", editor.isActive("highlight") && "bg-primary/10 text-primary")}
        onClick={() => editor.chain().focus().toggleHighlight().run()}
        title="Highlight"
      >
        <Highlighter className="h-3.5 w-3.5" />
      </Button>
      <Button
        variant="ghost"
        size="sm"
        className={cn("h-7 w-7 rounded-lg p-0", editor.isActive("link") && "bg-primary/10 text-primary")}
        onClick={onSetLink}
        title="Insert link"
      >
        <LinkIcon className="h-3.5 w-3.5" />
      </Button>
    </BubbleMenu>
  );
}
