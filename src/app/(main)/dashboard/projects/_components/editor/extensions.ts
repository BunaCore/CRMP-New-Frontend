// ============================================================
// TIPTAP EXTENSION REGISTRY
//
// IMPORTANT: Extensions are defined at module level (outside
// any React component). This guarantees they are created
// exactly once per application lifetime.
//
// Why this matters:
//   TipTap v3 checks extension identity to decide whether to
//   reinitialize the ProseMirror schema. If you pass a new
//   array on every render, TipTap tears down and recreates
//   the editor — losing selection, scroll position, and
//   causing visible reflow. Module-level constants prevent
//   this entirely. Only add .configure() calls here.
// ============================================================

import BubbleMenuExtension from "@tiptap/extension-bubble-menu";
import CharacterCount from "@tiptap/extension-character-count";
import Color from "@tiptap/extension-color";
import FloatingMenuExtension from "@tiptap/extension-floating-menu";
import FontFamily from "@tiptap/extension-font-family";
import Highlight from "@tiptap/extension-highlight";
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
import StarterKit from "@tiptap/starter-kit";
import ImageResize from "tiptap-extension-resize-image";

// ─── Extension registry ───────────────────────────────────────
// Grouped by logical concern for readability.

export const EDITOR_EXTENSIONS = [
  // ── Core document structure ──────────────────────────────────
  StarterKit.configure({
    heading: { levels: [1, 2, 3] },
    // Disable codeBlock from StarterKit if you add a syntax-highlighted one later
    // codeBlock: false,
  }),

  // ── Inline formatting ────────────────────────────────────────
  Underline,
  TextStyle, // Required by Color extension and FontFamily
  FontFamily,
  Color,
  Highlight.configure({ multicolor: true }),
  Subscript, // Academic: chemical formulas, footnotes
  Superscript, // Academic: exponents, citations

  // ── Smart typography ─────────────────────────────────────────
  // Converts "..." → ellipsis, "--" → em dash, smart quotes, etc.
  // Essential for professional document feel.
  Typography,

  // ── Alignment ────────────────────────────────────────────────
  TextAlign.configure({
    types: ["heading", "paragraph"],
    defaultAlignment: "left",
  }),

  // ── Links ────────────────────────────────────────────────────
  Link.configure({
    openOnClick: false, // Don't navigate on click in editor
    autolink: true, // Auto-detect URLs as user types
    linkOnPaste: true, // Detect links on paste
    HTMLAttributes: {
      class: "text-primary underline cursor-pointer decoration-primary/40 hover:decoration-primary",
      rel: "noopener noreferrer",
      target: "_blank",
    },
  }),

  // ── Media ────────────────────────────────────────────────────
  ImageResize.configure({
    // @ts-expect-error - allowBase64 exists but is missing from the extension types
    allowBase64: true, // Store images directly in DB as Base64 strings
    HTMLAttributes: {
      class: "rounded-xl border border-border shadow-md mx-auto max-w-full my-4",
    },
  }),

  // ── Lists ────────────────────────────────────────────────────
  TaskList,
  TaskItem.configure({
    nested: true, // Support checklist nesting
    HTMLAttributes: { class: "flex items-start gap-2" },
  }),

  // ── Tables ───────────────────────────────────────────────────
  Table.configure({
    resizable: true, // Drag column widths
    HTMLAttributes: { class: "border-collapse table-auto w-full" },
  }),
  TableRow,
  TableHeader,
  TableCell,

  // ── Utility ──────────────────────────────────────────────────
  CharacterCount, // For word/char count in status bar

  // ── BubbleMenu + FloatingMenu ProseMirror extensions ────────
  // These power the React <BubbleMenu> and <FloatingMenu> wrappers.
  BubbleMenuExtension,
  FloatingMenuExtension,

  // ── Placeholder ──────────────────────────────────────────────
  // Note: this IS a function, but defined once at module level.
  Placeholder.configure({
    placeholder: ({ node }) => {
      if (node.type.name === "heading") return "Heading…";
      return "Start writing, or type '/' for commands…";
    },
    showOnlyCurrent: true, // Only show placeholder for the current node
  }),
];
