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
//
// Additional exports:
//   STARTER_KIT_BASE_CONFIG — the StarterKit configure options.
//     Used by collab-extensions to rebuild with history:false.
//   NON_STARTER_EXTENSIONS  — all extensions except StarterKit.
//     Used by collab-extensions to compose the collab array.
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
import type { AnyExtension } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import ImageResize from "tiptap-extension-resize-image";

import { LineHeight } from "./line-height-extension";

// ─── StarterKit configure options ────────────────────────────
// Exported separately so collab-extensions can rebuild StarterKit
// with { history: false } without duplicating config.

export const STARTER_KIT_BASE_CONFIG = {
  heading: { levels: [1, 2, 3] as (1 | 2 | 3)[] },
  // history is enabled by default here (solo mode).
  // Collab mode overrides this to false via STARTER_KIT_BASE_CONFIG spread.
};

// ─── Non-StarterKit extensions ────────────────────────────────
// Everything except StarterKit — shared between solo and collab.
// Collab mode adds this array after its own StarterKit + Collaboration.

export const NON_STARTER_EXTENSIONS: AnyExtension[] = [
  // ── Inline formatting ────────────────────────────────────────
  Underline,
  TextStyle, // Required by Color extension and FontFamily
  FontFamily,
  Color,
  Highlight.configure({ multicolor: true }),
  Subscript, // Academic: chemical formulas, footnotes
  Superscript, // Academic: exponents, citations

  // ── Smart typography ─────────────────────────────────────────
  Typography,

  // ── Alignment ────────────────────────────────────────────────
  TextAlign.configure({
    types: ["heading", "paragraph"],
    defaultAlignment: "left",
  }),

  // ── Line Height ───────────────────────────────────────────────
  LineHeight.configure({
    types: ["heading", "paragraph"],
  }),

  // ── Links ────────────────────────────────────────────────────
  Link.configure({
    openOnClick: false,
    autolink: true,
    linkOnPaste: true,
    HTMLAttributes: {
      class: "text-primary underline cursor-pointer decoration-primary/40 hover:decoration-primary",
      rel: "noopener noreferrer",
      target: "_blank",
    },
  }),

  // ── Media ────────────────────────────────────────────────────
  ImageResize.configure({
    allowBase64: true,
    HTMLAttributes: {
      class: "rounded-xl border border-border shadow-md mx-auto max-w-full my-4",
    },
  }),

  // ── Lists ────────────────────────────────────────────────────
  TaskList,
  TaskItem.configure({
    nested: true,
    HTMLAttributes: { class: "flex items-start gap-2" },
  }),

  // ── Tables ───────────────────────────────────────────────────
  Table,
  TableRow,
  TableHeader,
  TableCell,

  // ── Utility ──────────────────────────────────────────────────
  CharacterCount,

  // ── BubbleMenu + FloatingMenu ────────────────────────────────
  BubbleMenuExtension,
  FloatingMenuExtension,

  // ── Placeholder ──────────────────────────────────────────────
  Placeholder.configure({
    placeholder: ({ node }) => {
      if (node.type.name === "heading") return "Heading…";
      return "Start writing, or type '/' for commands…";
    },
    showOnlyCurrent: true,
  }),
];

// ─── Full extension registry (solo mode) ─────────────────────
// This is the default extension array used when there is only
// one project member (no realtime collaboration needed).

export const EDITOR_EXTENSIONS: AnyExtension[] = [
  StarterKit.configure(STARTER_KIT_BASE_CONFIG),
  ...NON_STARTER_EXTENSIONS,
];
