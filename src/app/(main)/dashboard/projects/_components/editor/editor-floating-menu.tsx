"use client";

// ============================================================
// EditorFloatingMenu
// Quick-insert panel that appears on a blank line.
// Shows the most common block inserts for research documents:
// Heading 1/2/3, Quote, Code Block, Task List, Table, Divider.
// ============================================================

import type { Editor } from "@tiptap/react";
import { FloatingMenu } from "@tiptap/react/menus";
import {
  CheckSquare,
  Code2,
  Heading1,
  Heading2,
  Heading3,
  Image as ImageIcon,
  Minus,
  Quote,
  Table as TableIcon,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

interface EditorFloatingMenuProps {
  editor: Editor;
  onAddImage: () => void;
}

interface QuickInsert {
  icon: React.ReactNode;
  label: string;
  action: () => void;
  title: string;
}

export function EditorFloatingMenu({ editor, onAddImage }: EditorFloatingMenuProps) {
  const inserts: QuickInsert[] = [
    {
      icon: <Heading1 className="h-4 w-4" />,
      label: "H1",
      title: "Heading 1",
      action: () => editor.chain().focus().toggleHeading({ level: 1 }).run(),
    },
    {
      icon: <Heading2 className="h-4 w-4" />,
      label: "H2",
      title: "Heading 2",
      action: () => editor.chain().focus().toggleHeading({ level: 2 }).run(),
    },
    {
      icon: <Heading3 className="h-4 w-4" />,
      label: "H3",
      title: "Heading 3",
      action: () => editor.chain().focus().toggleHeading({ level: 3 }).run(),
    },
  ];

  const structureInserts: QuickInsert[] = [
    {
      icon: <Quote className="h-4 w-4" />,
      label: "Quote",
      title: "Blockquote",
      action: () => editor.chain().focus().toggleBlockquote().run(),
    },
    {
      icon: <Code2 className="h-4 w-4" />,
      label: "Code",
      title: "Code block",
      action: () => editor.chain().focus().toggleCodeBlock().run(),
    },
    {
      icon: <CheckSquare className="h-4 w-4" />,
      label: "Tasks",
      title: "Task list",
      action: () => editor.chain().focus().toggleTaskList().run(),
    },
    {
      icon: <TableIcon className="h-4 w-4" />,
      label: "Table",
      title: "Insert 3×3 table",
      action: () => editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run(),
    },
    {
      icon: <ImageIcon className="h-4 w-4" />,
      label: "Image",
      title: "Insert image",
      action: onAddImage,
    },
    {
      icon: <Minus className="h-4 w-4" />,
      label: "Divider",
      title: "Horizontal rule",
      action: () => editor.chain().focus().setHorizontalRule().run(),
    },
  ];

  return (
    <FloatingMenu
      editor={editor}
      // @ts-expect-error tippyOptions exists at runtime but is missing from some TipTap TS definitions
      tippyOptions={{
        duration: 200,
        placement: "left",
        animation: "shift-away",
      }}
      className={cn(
        "slide-in-from-left-2 flex animate-in items-center gap-0.5 duration-200",
        "rounded-xl border border-border/60 bg-card/95 p-1 shadow-xl backdrop-blur-sm",
      )}
    >
      {/* Heading group */}
      {inserts.map((item) => (
        <Button
          key={item.label}
          variant="ghost"
          size="sm"
          className="h-8 w-8 rounded-lg p-0 hover:bg-primary/8"
          onClick={item.action}
          title={item.title}
        >
          {item.icon}
        </Button>
      ))}

      <Separator orientation="vertical" className="mx-0.5 h-4" />

      {/* Structure group */}
      {structureInserts.map((item) => (
        <Button
          key={item.label}
          variant="ghost"
          size="sm"
          className="h-8 w-8 rounded-lg p-0 hover:bg-primary/8"
          onClick={item.action}
          title={item.title}
        >
          {item.icon}
        </Button>
      ))}
    </FloatingMenu>
  );
}
