// ============================================================
// COLLAB EXTENSION BUILDER
// Returns the TipTap extension array for collab mode.
// ============================================================

import Collaboration from "@tiptap/extension-collaboration";
import CollaborationCaret from "@tiptap/extension-collaboration-caret";
import StarterKit from "@tiptap/starter-kit";
import type { WebsocketProvider } from "y-websocket";
import type * as Y from "yjs";

import {
  NON_STARTER_EXTENSIONS,
  STARTER_KIT_BASE_CONFIG,
} from "@/app/(main)/dashboard/projects/_components/editor/extensions";

export interface CollabUser {
  name?: string;
  color?: string;
  userId?: string;
  [key: string]: unknown;
}

/**
 * Renders a premium, Google Docs-style collaboration caret.
 *
 * We intentionally add BOTH classes to the root element:
 *   - "ProseMirror-yjs-cursor" → tells y-prosemirror this IS the cursor
 *     widget so it does NOT render a second default element alongside ours.
 *   - "collaboration-carets__caret" → our own class for the CSS styling.
 *
 * DOM structure:
 *   <span class="ProseMirror-yjs-cursor collaboration-carets__caret" style="--cc:#hex">
 *     <span class="collaboration-carets__handle"></span>   ← Tiny colored dot at top
 *     <div  class="collaboration-carets__label">Name</div> ← Hover-only pill tooltip
 *   </span>
 */
function buildCaretElement(user: CollabUser | null | undefined): HTMLElement {
  const color: string = user?.color || "#6366f1";

  // Root — the vertical caret line.
  // Adding ProseMirror-yjs-cursor prevents the library from injecting its own fallback.
  const caret = document.createElement("span");
  caret.className = "ProseMirror-yjs-cursor collaboration-carets__caret";
  caret.style.setProperty("--cc", color);
  caret.style.borderLeftColor = color;

  // The tiny colored dot sitting at the very top of the caret line
  const handle = document.createElement("span");
  handle.className = "collaboration-carets__handle";
  handle.style.backgroundColor = color;
  handle.setAttribute("aria-hidden", "true");

  caret.appendChild(handle);

  return caret;
}

/**
 * Builds the collab-mode extension array.
 * Collab includes: StarterKit + all shared extensions + Collaboration + CollaborationCaret.
 * Called once per workspace session — not on every render.
 */
export function buildCollabExtensions(
  ydoc: Y.Doc,
  provider: WebsocketProvider,
  user: { name: string; color: string; userId: string },
) {
  return [
    StarterKit.configure({ ...STARTER_KIT_BASE_CONFIG, undoRedo: false }),

    ...NON_STARTER_EXTENSIONS,

    // Y.js CRDT binding
    Collaboration.configure({ document: ydoc, field: "document" }),

    // Collaborative carets with custom render
    CollaborationCaret.configure({
      provider,
      user,
      render: buildCaretElement,
      // Translucent selection fill — append hex alpha for 22% opacity
      selectionRender: (u: CollabUser | null | undefined) => {
        const hex = (u?.color || "#6366f1") as string;
        return {
          nodeName: "span",
          class: "collab-selection",
          style: `background-color: ${hex}38`,
        };
      },
    }),
  ];
}
