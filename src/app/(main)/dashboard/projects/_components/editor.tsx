"use client";

import { useEffect, useRef } from "react";

import { useRouter } from "next/navigation";

import BubbleMenuExtension from "@tiptap/extension-bubble-menu";
import CharacterCount from "@tiptap/extension-character-count";
import Color from "@tiptap/extension-color";
import FloatingMenuExtension from "@tiptap/extension-floating-menu";
import Highlight from "@tiptap/extension-highlight";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import Subscript from "@tiptap/extension-subscript";
import Superscript from "@tiptap/extension-superscript";
import { Table } from "@tiptap/extension-table";
import { TableCell } from "@tiptap/extension-table-cell";
import { TableHeader } from "@tiptap/extension-table-header";
import { TableRow } from "@tiptap/extension-table-row";
import TaskItem from "@tiptap/extension-task-item";
import TaskList from "@tiptap/extension-task-list";
import TextAlign from "@tiptap/extension-text-align";
import { TextStyle } from "@tiptap/extension-text-style";
import Typography from "@tiptap/extension-typography";
import Underline from "@tiptap/extension-underline";
import { type Editor, EditorContent, useEditor } from "@tiptap/react";
import { BubbleMenu, FloatingMenu } from "@tiptap/react/menus";
import StarterKit from "@tiptap/starter-kit";
import {
  AlignCenter,
  AlignJustify,
  AlignLeft,
  AlignRight,
  ArrowLeft,
  Bold,
  CheckSquare,
  Download,
  FileDown,
  Heading1,
  Heading2,
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
  Plus,
  Redo,
  Strikethrough,
  Table as TableIcon,
  Trash2,
  Type,
  Underline as UnderlineIcon,
  Undo,
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

import { useWorkspace } from "./workspace/workspace-context";
import "./editor.css";

interface EditorProps {
  initialContent: string;
  workspaceId: string;
  projectId: string;
}

const MenuBar = ({
  editor,
  onAddImage,
  onSetLink,
  projectId,
}: {
  editor: Editor | null;
  onAddImage: () => void;
  onSetLink: () => void;
  projectId: string;
}) => {
  const router = useRouter();
  const { toggleChat, isChatOpen, workspaceTitle, setWorkspaceTitle } = useWorkspace();

  if (!editor) return null;

  return (
    <div className="bg-background/50 sticky top-0 z-20 flex flex-col border-b backdrop-blur-md">
      {/* Navigation & Title Bar Section */}
      <div className="bg-muted/5 flex items-center justify-between border-b px-4 py-1.5">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 rounded-full"
            onClick={() => router.push(`/dashboard/projects/${projectId}`)}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>

          <div className="bg-border h-4 w-px" />

          <div className="text-muted-foreground/60 flex items-center gap-2">
            <input
              type="text"
              value={workspaceTitle}
              onChange={(e) => setWorkspaceTitle(e.target.value)}
              placeholder="Untitled Workspace"
              className="text-foreground min-w-75 border-none bg-transparent text-[11px] font-bold transition-all outline-none placeholder:font-normal placeholder:italic focus:ring-0"
            />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-muted-foreground/30 text-[9px] font-black tracking-[0.2em] uppercase">
            Editing Mode
          </span>
        </div>
      </div>

      <div className="flex w-full min-w-0 items-center justify-between overflow-hidden px-4 py-2">
        <div className="no-scrollbar flex min-w-0 flex-1 items-center gap-1 overflow-x-auto">
          {/* History Group */}
          <div className="mr-2 flex items-center gap-0.5">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => editor.chain().focus().undo().run()}
              disabled={!editor.can().undo()}
              className="h-8 w-8 p-0"
            >
              <Undo className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => editor.chain().focus().redo().run()}
              disabled={!editor.can().redo()}
              className="h-8 w-8 p-0"
            >
              <Redo className="h-4 w-4" />
            </Button>
          </div>

          <Separator orientation="vertical" className="mr-2 h-4" />

          {/* Typography Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8 min-w-25 justify-between gap-2 px-2 text-xs font-medium">
                {editor.isActive("heading", { level: 1 })
                  ? "Heading 1"
                  : editor.isActive("heading", { level: 2 })
                    ? "Heading 2"
                    : editor.isActive("heading", { level: 3 })
                      ? "Heading 3"
                      : "Normal Text"}
                <Type className="h-3 w-3 opacity-50" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              <DropdownMenuItem onClick={() => editor.chain().focus().setParagraph().run()}>
                Normal Text
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
                className="text-lg font-bold"
              >
                Heading 1
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                className="text-base font-semibold"
              >
                Heading 2
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
                className="text-sm font-medium"
              >
                Heading 3
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Separator orientation="vertical" className="mx-2 h-4" />

          {/* Basic Formatting */}
          <div className="flex items-center gap-0.5">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => editor.chain().focus().toggleBold().run()}
              className={cn("h-8 w-8 p-0", editor.isActive("bold") && "bg-primary/10 text-primary")}
            >
              <Bold className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => editor.chain().focus().toggleItalic().run()}
              className={cn("h-8 w-8 p-0", editor.isActive("italic") && "bg-primary/10 text-primary")}
            >
              <Italic className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => editor.chain().focus().toggleUnderline().run()}
              className={cn("h-8 w-8 p-0", editor.isActive("underline") && "bg-primary/10 text-primary")}
            >
              <UnderlineIcon className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => editor.chain().focus().toggleStrike().run()}
              className={cn("h-8 w-8 p-0", editor.isActive("strike") && "bg-primary/10 text-primary")}
            >
              <Strikethrough className="h-4 w-4" />
            </Button>
          </div>

          <Separator orientation="vertical" className="mx-2 h-4" />

          {/* Colors */}
          <div className="flex items-center gap-0.5">
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <Palette className="h-4 w-4" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-40 p-2">
                <div className="grid grid-cols-5 gap-1">
                  {["#000000", "#ef4444", "#3b82f6", "#10b981", "#f59e0b"].map((color) => (
                    <button
                      type="button"
                      key={color}
                      className="border-border h-6 w-6 rounded-md border"
                      style={{ backgroundColor: color }}
                      onClick={() => editor.chain().focus().setColor(color).run()}
                    />
                  ))}
                  <button
                    type="button"
                    className="hover:bg-muted col-span-5 mt-1 rounded py-1 text-[10px] font-bold uppercase"
                    onClick={() => editor.chain().focus().unsetColor().run()}
                  >
                    Reset Color
                  </button>
                </div>
              </PopoverContent>
            </Popover>

            <Button
              variant="ghost"
              size="sm"
              onClick={() => editor.chain().focus().toggleHighlight().run()}
              className={cn("h-8 w-8 p-0", editor.isActive("highlight") && "bg-primary/10 text-primary")}
            >
              <Highlighter className="h-4 w-4" />
            </Button>
          </div>

          <Separator orientation="vertical" className="mx-2 h-4" />

          {/* Alignment Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                {editor.isActive({ textAlign: "center" }) ? (
                  <AlignCenter className="h-4 w-4" />
                ) : editor.isActive({ textAlign: "right" }) ? (
                  <AlignRight className="h-4 w-4" />
                ) : editor.isActive({ textAlign: "justify" }) ? (
                  <AlignJustify className="h-4 w-4" />
                ) : (
                  <AlignLeft className="h-4 w-4" />
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="min-w-[37.5px]">
              <DropdownMenuItem onClick={() => editor.chain().focus().setTextAlign("left").run()} className="gap-2">
                <AlignLeft className="h-4 w-4" /> Align Left
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => editor.chain().focus().setTextAlign("center").run()} className="gap-2">
                <AlignCenter className="h-4 w-4" /> Align Center
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => editor.chain().focus().setTextAlign("right").run()} className="gap-2">
                <AlignRight className="h-4 w-4" /> Align Right
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => editor.chain().focus().setTextAlign("justify").run()} className="gap-2">
                <AlignJustify className="h-4 w-4" /> Align Justify
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Separator orientation="vertical" className="mx-2 h-4" />

          {/* Lists Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                {editor.isActive("orderedList") ? (
                  <ListOrdered className="h-4 w-4" />
                ) : editor.isActive("taskList") ? (
                  <CheckSquare className="h-4 w-4" />
                ) : (
                  <List className="h-4 w-4" />
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="min-w-[37.5px]">
              <DropdownMenuItem onClick={() => editor.chain().focus().toggleBulletList().run()} className="gap-2">
                <List className="h-4 w-4" /> Bullet List
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => editor.chain().focus().toggleOrderedList().run()} className="gap-2">
                <ListOrdered className="h-4 w-4" /> Ordered List
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => editor.chain().focus().toggleTaskList().run()} className="gap-2">
                <CheckSquare className="h-4 w-4" /> Task List
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Separator orientation="vertical" className="mx-2 h-4" />

          {/* Table Control */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className={cn("h-8 w-8 p-0", editor.isActive("table") && "bg-primary/10 text-primary")}
              >
                <TableIcon className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem
                onClick={() => editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()}
              >
                Insert Table
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => editor.chain().focus().addColumnAfter().run()}
                disabled={!editor.isActive("table")}
              >
                Add Column
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => editor.chain().focus().addRowAfter().run()}
                disabled={!editor.isActive("table")}
              >
                Add Row
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => editor.chain().focus().deleteColumn().run()}
                disabled={!editor.isActive("table")}
                className="text-destructive"
              >
                Delete Column
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => editor.chain().focus().deleteRow().run()}
                disabled={!editor.isActive("table")}
                className="text-destructive"
              >
                Delete Row
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => editor.chain().focus().deleteTable().run()}
                disabled={!editor.isActive("table")}
                className="text-destructive"
              >
                Delete Table
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Separator orientation="vertical" className="mx-2 h-4" />

          {/* Insertions */}
          <div className="flex items-center gap-0.5">
            <Button
              variant="ghost"
              size="sm"
              onClick={onSetLink}
              className={cn("h-8 w-8 p-0", editor.isActive("link") && "bg-primary/10 text-primary")}
            >
              <LinkIcon className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm" onClick={onAddImage} className="h-8 w-8 p-0">
              <ImageIcon className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => editor.chain().focus().setHorizontalRule().run()}
              className="h-8 w-8 p-0"
            >
              <Minus className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Right Info Section */}
        <div className="ml-4 flex min-w-fit items-center gap-2 border-l pl-4">
          <div className="text-muted-foreground/50 text-[10px] font-bold tracking-tighter uppercase">
            {editor.storage.characterCount.words()} Words
          </div>
          <Button
            variant="ghost"
            size="icon"
            className={cn("h-8 w-8 rounded-full transition-all", isChatOpen && "bg-primary/10 text-primary")}
            onClick={toggleChat}
          >
            {isChatOpen ? <PanelRightClose className="h-4 w-4" /> : <PanelRight className="h-4 w-4" />}
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem className="gap-2">
                <History className="h-4 w-4" /> Version History
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="gap-2">
                <FileDown className="h-4 w-4" /> Export as PDF
              </DropdownMenuItem>
              <DropdownMenuItem className="gap-2">
                <Download className="h-4 w-4" /> Export as Word
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-destructive focus:text-destructive gap-2">
                <Trash2 className="h-4 w-4" /> Delete Workspace
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
};

export default function DocumentEditor({ initialContent, workspaceId, projectId }: EditorProps) {
  const { saveWorkspace, workspaceTitle, allWorkspaces, setWorkspaceTitle } = useWorkspace();
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
        },
      }),
      Underline,
      Typography,
      TextStyle,
      Color,
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: "text-primary underline cursor-pointer",
        },
      }),
      Image.configure({
        HTMLAttributes: {
          class: "rounded-lg border shadow-lg mx-auto max-w-full",
        },
      }),
      Highlight.configure({ multicolor: true }),
      BubbleMenuExtension,
      FloatingMenuExtension,
      Subscript,
      Superscript,
      TaskList,
      TaskItem.configure({
        nested: true,
      }),
      Table.configure({
        resizable: true,
      }),
      TableRow,
      TableHeader,
      TableCell,
      CharacterCount,
      Placeholder.configure({
        placeholder: ({ node }) => {
          if (node.type.name === "heading") {
            return "Give it a title...";
          }
          return "Type '/' for commands or start writing...";
        },
      }),
    ],
    content: initialContent,
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class:
          "prose prose-lg dark:prose-invert focus:outline-none max-w-[850px] mx-auto p-4 sm:p-12 lg:p-24 min-h-screen selection:bg-primary/20",
      },
    },
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();

      // Debounced autosave
      if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
      saveTimeoutRef.current = setTimeout(() => {
        saveWorkspace(workspaceId, workspaceTitle, html);
      }, 1000);
    },
  });

  // Autosave when title/editor changes
  useEffect(() => {
    if (!editor) return;
    if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
    saveTimeoutRef.current = setTimeout(() => {
      saveWorkspace(workspaceId, workspaceTitle, editor.getHTML());
    }, 1000);
  }, [workspaceTitle, workspaceId, editor, saveWorkspace]);

  // Load content on mount
  useEffect(() => {
    if (!editor) return;

    // Find content from allWorkspaces instead of just relying on context state which might be empty
    const ws = allWorkspaces.find((w) => w.id === workspaceId);
    if (ws) {
      setWorkspaceTitle(ws.title);
      editor.commands.setContent(ws.content);
    }
  }, [workspaceId, editor, allWorkspaces, setWorkspaceTitle]);

  const addImage = () => {
    if (!editor) return;
    const url = window.prompt("URL");
    if (url) {
      editor.chain().focus().setImage({ src: url }).run();
    }
  };

  const setLink = () => {
    if (!editor) return;
    const previousUrl = editor.getAttributes("link").href;
    const url = window.prompt("URL", previousUrl);
    if (url === null) return;
    if (url === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }
    editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
  };

  return (
    <div className="anim-in fade-in bg-background flex h-full flex-col overflow-hidden duration-700">
      <MenuBar editor={editor} onAddImage={addImage} onSetLink={setLink} projectId={projectId} />

      <div className="project-editor-container custom-scrollbar flex w-full min-w-0 flex-1 flex-col items-stretch justify-stretch overflow-y-auto scroll-smooth">
        <EditorContent editor={editor} className="w-full flex-1" />
      </div>

      {editor && (
        <BubbleMenu
          editor={editor}
          className="fade-in zoom-in-95 animate-in bg-card flex items-center gap-0.5 rounded-full border p-1 shadow-2xl duration-200"
        >
          <Button
            variant="ghost"
            size="sm"
            className={cn("h-7 w-7 rounded-full p-0", editor.isActive("bold") && "text-primary")}
            onClick={() => editor.chain().focus().toggleBold().run()}
          >
            <Bold className="h-3.5 w-3.5" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className={cn("h-7 w-7 rounded-full p-0", editor.isActive("italic") && "text-primary")}
            onClick={() => editor.chain().focus().toggleItalic().run()}
          >
            <Italic className="h-3.5 w-3.5" />
          </Button>
          <Separator orientation="vertical" className="mx-1 h-4" />
          <Button
            variant="ghost"
            size="sm"
            className={cn("h-7 w-7 rounded-full p-0", editor.isActive("highlight") && "text-primary")}
            onClick={() => editor.chain().focus().toggleHighlight().run()}
          >
            <Highlighter className="h-3.5 w-3.5" />
          </Button>
          <Button variant="ghost" size="sm" className="h-7 w-7 rounded-full p-0" onClick={setLink}>
            <LinkIcon className="h-3.5 w-3.5" />
          </Button>
        </BubbleMenu>
      )}

      {editor && (
        <FloatingMenu
          editor={editor}
          className="slide-in-from-left-4 animate-in border-primary/10 bg-card flex items-center gap-1 rounded-xl border p-1 shadow-lg duration-300"
        >
          <Button
            variant="ghost"
            size="sm"
            className="hover:bg-primary/5 h-8 w-8 rounded-lg p-0"
            onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          >
            <Heading1 className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="hover:bg-primary/5 h-8 w-8 rounded-lg p-0"
            onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          >
            <Heading2 className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm" className="hover:bg-primary/5 h-8 w-8 rounded-lg p-0" onClick={addImage}>
            <Plus className="h-4 w-4" />
          </Button>
        </FloatingMenu>
      )}
    </div>
  );
}
