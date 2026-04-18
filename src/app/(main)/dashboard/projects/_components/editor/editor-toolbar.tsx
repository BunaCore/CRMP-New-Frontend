"use client";

// ============================================================
// EditorToolbar
// Full document toolbar: title bar row + formatting bar row.
// Memoized — only re-renders when editor transaction changes
// marks/nodes relevant to active-state indicators.
//
// Structure:
//   <EditorToolbar>
//     <TitleBar>      back nav · title input · chat toggle · ⋮ menu
//     <FormattingBar> undo/redo · style · formatting · color ·
//                     alignment · lists · table · insert · meta
// ============================================================

import { memo } from "react";

import { useRouter } from "next/navigation";

import type { Editor } from "@tiptap/react";
import {
  AlignCenter,
  AlignJustify,
  AlignLeft,
  AlignRight,
  ArrowLeft,
  Bold,
  CheckSquare,
  Code,
  Code2,
  Download,
  FileDown,
  Heading1,
  Heading2,
  Heading3,
  Highlighter,
  History,
  Image as ImageIcon,
  Italic,
  Link as LinkIcon,
  List,
  ListOrdered,
  Minus,
  MoreVertical,
  Palette,
  PanelRight,
  PanelRightClose,
  Quote,
  Redo,
  Strikethrough,
  Subscript,
  Superscript,
  Table as TableIcon,
  Trash2,
  Type,
  Underline as UnderlineIcon,
  Undo,
  Upload,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

import { useWorkspace } from "../workspace/workspace-context";

// ─── Constants ────────────────────────────────────────────────

const TEXT_COLORS = [
  { label: "Default", value: "currentColor" },
  { label: "Red", value: "#ef4444" },
  { label: "Orange", value: "#f97316" },
  { label: "Yellow", value: "#eab308" },
  { label: "Green", value: "#22c55e" },
  { label: "Blue", value: "#3b82f6" },
  { label: "Purple", value: "#a855f7" },
  { label: "Pink", value: "#ec4899" },
  { label: "Black", value: "#000000" },
  { label: "White", value: "#ffffff" },
];

const HIGHLIGHT_COLORS = [
  { label: "Yellow", value: "#fef08a" },
  { label: "Green", value: "#bbf7d0" },
  { label: "Blue", value: "#bfdbfe" },
  { label: "Pink", value: "#fbcfe8" },
  { label: "Orange", value: "#fed7aa" },
];

const FONTS = [
  { label: "Default Font", value: "" },
  { label: "Inter", value: "var(--font-inter), sans-serif" },
  { label: "Arial", value: "Arial, Helvetica, sans-serif" },
  { label: "Times New Roman", value: "'Times New Roman', Times, serif" },
  { label: "Amharic (Noto)", value: "var(--font-noto-sans-ethiopic), 'Noto Sans Ethiopic', sans-serif" },
];

// ─── Heading label helper ─────────────────────────────────────

function getHeadingLabel(editor: Editor): string {
  if (editor.isActive("heading", { level: 1 })) return "Heading 1";
  if (editor.isActive("heading", { level: 2 })) return "Heading 2";
  if (editor.isActive("heading", { level: 3 })) return "Heading 3";
  if (editor.isActive("blockquote")) return "Quote";
  if (editor.isActive("codeBlock")) return "Code block";
  return "Normal text";
}

// ─── ToolbarButton helper ─────────────────────────────────────

function TB({
  active,
  disabled,
  title,
  onClick,
  children,
  className,
}: {
  active?: boolean;
  disabled?: boolean;
  title?: string;
  onClick: () => void;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <Button
      variant="ghost"
      size="sm"
      disabled={disabled}
      title={title}
      onClick={onClick}
      className={cn("h-8 w-8 shrink-0 p-0 transition-colors", active && "bg-primary/10 text-primary", className)}
    >
      {children}
    </Button>
  );
}

// ─── Title Bar (top row) ──────────────────────────────────────

interface TitleBarProps {
  projectId: string;
  title: string;
  onTitleChange: (t: string) => void;
  onToggleVersionPanel: () => void;
  onImportMarkdownClick: () => void;
  onExportPdf: () => void;
  onExportMarkdown: () => void;
}

function TitleBar({
  projectId,
  title,
  onTitleChange,
  onToggleVersionPanel,
  onImportMarkdownClick,
  onExportPdf,
  onExportMarkdown,
}: TitleBarProps) {
  const router = useRouter();
  const { toggleChat, isChatOpen } = useWorkspace();

  return (
    <div className="flex items-center justify-between border-b bg-muted/5 px-4 py-1.5">
      {/* Left: back + title */}
      <div className="flex min-w-0 items-center gap-3">
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7 shrink-0 rounded-full"
          onClick={() => router.push(`/dashboard/projects/${projectId}`)}
          title="Back to project"
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>

        <div className="h-4 w-px shrink-0 bg-border" />

        <input
          type="text"
          value={title}
          onChange={(e) => onTitleChange(e.target.value)}
          placeholder="Untitled Document"
          spellCheck={false}
          className={cn(
            "min-w-0 flex-1 border-none bg-transparent",
            "font-semibold text-[12px] text-foreground outline-none",
            "transition-colors placeholder:font-normal placeholder:text-muted-foreground/40 placeholder:italic",
            "focus:ring-0",
          )}
        />
      </div>

      {/* Right: status label + chat + more */}
      <div className="flex shrink-0 items-center gap-2">
        <span className="hidden font-black text-[9px] text-muted-foreground/25 uppercase tracking-[0.2em] sm:block">
          Editing
        </span>

        <TB title={isChatOpen ? "Close AI Chat" : "Open AI Chat"} onClick={toggleChat} active={isChatOpen}>
          {isChatOpen ? <PanelRightClose className="h-4 w-4" /> : <PanelRight className="h-4 w-4" />}
        </TB>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-7 w-7 rounded-full">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-52">
            <DropdownMenuItem className="gap-2" onClick={onToggleVersionPanel}>
              <History className="h-4 w-4" />
              Version History
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="gap-2" onClick={onImportMarkdownClick}>
              <Upload className="h-4 w-4" />
              Import Markdown
            </DropdownMenuItem>
            <DropdownMenuItem className="gap-2" onClick={onExportMarkdown}>
              <Download className="h-4 w-4" />
              Export as Markdown
            </DropdownMenuItem>
            <DropdownMenuItem className="gap-2" onClick={onExportPdf}>
              <FileDown className="h-4 w-4" />
              Export as PDF
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="gap-2 text-destructive focus:text-destructive">
              <Trash2 className="h-4 w-4" />
              Delete Workspace
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}

// ─── Formatting Bar (bottom row) ─────────────────────────────

function FormattingBar({
  editor,
  onAddImage,
  onSetLink,
}: {
  editor: Editor;
  onAddImage: () => void;
  onSetLink: () => void;
}) {
  return (
    <div className="no-scrollbar flex w-full min-w-0 items-center justify-between overflow-x-auto px-4 py-2">
      <div className="flex min-w-0 items-center gap-0.5">
        {/* Undo / Redo */}
        <TB title="Undo (Ctrl+Z)" disabled={!editor.can().undo()} onClick={() => editor.chain().focus().undo().run()}>
          <Undo className="h-4 w-4" />
        </TB>
        <TB title="Redo (Ctrl+Y)" disabled={!editor.can().redo()} onClick={() => editor.chain().focus().redo().run()}>
          <Redo className="h-4 w-4" />
        </TB>

        <Separator orientation="vertical" className="mx-2 h-4 shrink-0" />

        {/* Font Family Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-32 shrink-0 justify-between gap-1 px-2 font-medium text-xs"
              title="Font Family"
            >
              <span className="truncate">
                {(() => {
                  const currentFont = editor.getAttributes("textStyle")?.fontFamily;
                  if (!currentFont) return "Default Font";
                  const match = FONTS.find(
                    (f) =>
                      f.value &&
                      currentFont.includes(
                        f.value
                          .split(",")[0]
                          .replace(/['"var()]/g, "")
                          .trim(),
                      ),
                  );
                  return match ? match.label : "Custom";
                })()}
              </span>
              <Type className="h-3 w-3 shrink-0 opacity-50" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-44">
            {FONTS.map((font) => (
              <DropdownMenuItem
                key={font.label}
                className="font-medium"
                style={font.value ? { fontFamily: font.value } : {}}
                onClick={() => {
                  if (font.value) {
                    editor.chain().focus().setFontFamily(font.value).run();
                  } else {
                    editor.chain().focus().unsetFontFamily().run();
                  }
                }}
              >
                {font.label}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        <Separator orientation="vertical" className="mx-2 h-4 shrink-0" />

        {/* Block style dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-28 shrink-0 justify-between gap-1 px-2 font-medium text-xs"
            >
              <span className="truncate">{getHeadingLabel(editor)}</span>
              <Type className="h-3 w-3 shrink-0 opacity-50" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-44">
            <DropdownMenuItem onClick={() => editor.chain().focus().setParagraph().run()}>Normal text</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="font-bold text-lg"
              onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
            >
              <Heading1 className="mr-2 h-4 w-4" /> Heading 1
            </DropdownMenuItem>
            <DropdownMenuItem
              className="font-semibold text-base"
              onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
            >
              <Heading2 className="mr-2 h-4 w-4" /> Heading 2
            </DropdownMenuItem>
            <DropdownMenuItem
              className="font-medium"
              onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
            >
              <Heading3 className="mr-2 h-4 w-4" /> Heading 3
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => editor.chain().focus().toggleBlockquote().run()}>
              <Quote className="mr-2 h-4 w-4" /> Blockquote
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => editor.chain().focus().toggleCodeBlock().run()}>
              <Code2 className="mr-2 h-4 w-4" /> Code block
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <Separator orientation="vertical" className="mx-2 h-4 shrink-0" />

        {/* Inline formatting */}
        <TB
          active={editor.isActive("bold")}
          title="Bold (Ctrl+B)"
          onClick={() => editor.chain().focus().toggleBold().run()}
        >
          <Bold className="h-4 w-4" />
        </TB>
        <TB
          active={editor.isActive("italic")}
          title="Italic (Ctrl+I)"
          onClick={() => editor.chain().focus().toggleItalic().run()}
        >
          <Italic className="h-4 w-4" />
        </TB>
        <TB
          active={editor.isActive("underline")}
          title="Underline (Ctrl+U)"
          onClick={() => editor.chain().focus().toggleUnderline().run()}
        >
          <UnderlineIcon className="h-4 w-4" />
        </TB>
        <TB
          active={editor.isActive("strike")}
          title="Strikethrough"
          onClick={() => editor.chain().focus().toggleStrike().run()}
        >
          <Strikethrough className="h-4 w-4" />
        </TB>
        <TB
          active={editor.isActive("code")}
          title="Inline code"
          onClick={() => editor.chain().focus().toggleCode().run()}
        >
          <Code className="h-4 w-4" />
        </TB>

        <Separator orientation="vertical" className="mx-2 h-4 shrink-0" />

        {/* Academic: sub / superscript */}
        <TB
          active={editor.isActive("subscript")}
          title="Subscript"
          onClick={() => editor.chain().focus().toggleSubscript().run()}
        >
          <Subscript className="h-4 w-4" />
        </TB>
        <TB
          active={editor.isActive("superscript")}
          title="Superscript"
          onClick={() => editor.chain().focus().toggleSuperscript().run()}
        >
          <Superscript className="h-4 w-4" />
        </TB>

        <Separator orientation="vertical" className="mx-2 h-4 shrink-0" />

        {/* Color */}
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0" title="Text color">
              <Palette className="h-4 w-4" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-44 p-3" align="start">
            <p className="mb-2 font-bold text-[10px] text-muted-foreground uppercase tracking-wider">Text Color</p>
            <div className="grid grid-cols-5 gap-1.5">
              {TEXT_COLORS.map((c) => (
                <button
                  type="button"
                  key={c.value}
                  title={c.label}
                  className="h-6 w-6 rounded-md border border-border/50 transition-transform hover:scale-110"
                  style={{ backgroundColor: c.value === "currentColor" ? "transparent" : c.value }}
                  onClick={() =>
                    c.value === "currentColor"
                      ? editor.chain().focus().unsetColor().run()
                      : editor.chain().focus().setColor(c.value).run()
                  }
                />
              ))}
            </div>
            <p className="mt-3 mb-2 font-bold text-[10px] text-muted-foreground uppercase tracking-wider">Highlight</p>
            <div className="grid grid-cols-5 gap-1.5">
              {HIGHLIGHT_COLORS.map((c) => (
                <button
                  type="button"
                  key={c.value}
                  title={c.label}
                  className="h-6 w-6 rounded-md border border-border/50 transition-transform hover:scale-110"
                  style={{ backgroundColor: c.value }}
                  onClick={() => editor.chain().focus().setHighlight({ color: c.value }).run()}
                />
              ))}
            </div>
            <button
              type="button"
              className="mt-2 w-full rounded-md py-1 text-center text-[10px] text-muted-foreground hover:bg-muted"
              onClick={() => editor.chain().focus().unsetHighlight().run()}
            >
              Clear highlight
            </button>
          </PopoverContent>
        </Popover>

        <TB
          active={editor.isActive("highlight")}
          title="Highlight (toggle)"
          onClick={() => editor.chain().focus().toggleHighlight().run()}
        >
          <Highlighter className="h-4 w-4" />
        </TB>

        <Separator orientation="vertical" className="mx-2 h-4 shrink-0" />

        {/* Alignment */}
        <TB
          active={
            editor.isActive({ textAlign: "left" }) ||
            (!editor.isActive({ textAlign: "center" }) &&
              !editor.isActive({ textAlign: "right" }) &&
              !editor.isActive({ textAlign: "justify" }))
          }
          title="Align left"
          onClick={() => editor.chain().focus().setTextAlign("left").run()}
        >
          <AlignLeft className="h-4 w-4" />
        </TB>
        <TB
          active={editor.isActive({ textAlign: "center" })}
          title="Align center"
          onClick={() => editor.chain().focus().setTextAlign("center").run()}
        >
          <AlignCenter className="h-4 w-4" />
        </TB>
        <TB
          active={editor.isActive({ textAlign: "right" })}
          title="Align right"
          onClick={() => editor.chain().focus().setTextAlign("right").run()}
        >
          <AlignRight className="h-4 w-4" />
        </TB>
        <TB
          active={editor.isActive({ textAlign: "justify" })}
          title="Justify"
          onClick={() => editor.chain().focus().setTextAlign("justify").run()}
        >
          <AlignJustify className="h-4 w-4" />
        </TB>

        <Separator orientation="vertical" className="mx-2 h-4 shrink-0" />

        {/* Lists */}
        <TB
          active={editor.isActive("bulletList")}
          title="Bullet list"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
        >
          <List className="h-4 w-4" />
        </TB>
        <TB
          active={editor.isActive("orderedList")}
          title="Numbered list"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
        >
          <ListOrdered className="h-4 w-4" />
        </TB>
        <TB
          active={editor.isActive("taskList")}
          title="Task list (checklist)"
          onClick={() => editor.chain().focus().toggleTaskList().run()}
        >
          <CheckSquare className="h-4 w-4" />
        </TB>

        <Separator orientation="vertical" className="mx-2 h-4 shrink-0" />

        {/* Table */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className={cn("h-8 w-8 p-0", editor.isActive("table") && "bg-primary/10 text-primary")}
              title="Table"
            >
              <TableIcon className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start">
            <DropdownMenuItem
              onClick={() => editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()}
            >
              Insert 3×3 table
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              disabled={!editor.isActive("table")}
              onClick={() => editor.chain().focus().addColumnAfter().run()}
            >
              Add column
            </DropdownMenuItem>
            <DropdownMenuItem
              disabled={!editor.isActive("table")}
              onClick={() => editor.chain().focus().addRowAfter().run()}
            >
              Add row
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              disabled={!editor.isActive("table")}
              className="text-destructive"
              onClick={() => editor.chain().focus().deleteColumn().run()}
            >
              Delete column
            </DropdownMenuItem>
            <DropdownMenuItem
              disabled={!editor.isActive("table")}
              className="text-destructive"
              onClick={() => editor.chain().focus().deleteRow().run()}
            >
              Delete row
            </DropdownMenuItem>
            <DropdownMenuItem
              disabled={!editor.isActive("table")}
              className="text-destructive"
              onClick={() => editor.chain().focus().deleteTable().run()}
            >
              Delete table
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <Separator orientation="vertical" className="mx-2 h-4 shrink-0" />

        {/* Insert: Link, Image, HR */}
        <TB active={editor.isActive("link")} title="Insert link" onClick={onSetLink}>
          <LinkIcon className="h-4 w-4" />
        </TB>
        <TB title="Insert image" onClick={onAddImage}>
          <ImageIcon className="h-4 w-4" />
        </TB>
        <TB title="Horizontal divider" onClick={() => editor.chain().focus().setHorizontalRule().run()}>
          <Minus className="h-4 w-4" />
        </TB>
      </div>

      {/* Right meta: word count */}
      <div className="ml-4 hidden shrink-0 items-center gap-2 border-l pl-4 sm:flex">
        <span className="font-mono text-[10px] text-muted-foreground/40 uppercase tracking-wider">
          {(editor.storage.characterCount as { words: () => number }).words()} words
        </span>
      </div>
    </div>
  );
}

// ─── EditorToolbar (composed, memoized) ───────────────────────

export interface EditorToolbarProps {
  editor: Editor | null;
  projectId: string;
  title: string;
  onTitleChange: (t: string) => void;
  onAddImage: () => void;
  onSetLink: () => void;
  onToggleVersionPanel: () => void;
  onImportMarkdownClick: () => void;
  onExportPdf: () => void;
  onExportMarkdown: () => void;
}

export const EditorToolbar = memo(function EditorToolbar({
  editor,
  projectId,
  title,
  onTitleChange,
  onAddImage,
  onSetLink,
  onToggleVersionPanel,
  onImportMarkdownClick,
  onExportPdf,
  onExportMarkdown,
}: EditorToolbarProps) {
  if (!editor) return null;

  return (
    <div className="sticky top-0 z-20 flex flex-col border-b bg-background/95 backdrop-blur-md">
      <TitleBar
        projectId={projectId}
        title={title}
        onTitleChange={onTitleChange}
        onToggleVersionPanel={onToggleVersionPanel}
        onImportMarkdownClick={onImportMarkdownClick}
        onExportPdf={onExportPdf}
        onExportMarkdown={onExportMarkdown}
      />
      <FormattingBar editor={editor} onAddImage={onAddImage} onSetLink={onSetLink} />
    </div>
  );
});
