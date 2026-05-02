// ============================================================
// COLLAB EXTENSION BUILDER
//
// Returns the TipTap extension array for collab mode.
// Called from useCollabProvider after ydoc + provider are ready.
//
// Key differences from EDITOR_EXTENSIONS (solo):
//   • StarterKit.history is DISABLED — Y.js Collaboration
//     provides its own undo/redo via y-protocols. Running both
//     causes a double-undo bug where Ctrl+Z undoes twice.
//   • Collaboration extension is added — binds TipTap to a
//     Y.Doc fragment so the CRDT becomes the content source.
//
// NOTE — CollaborationCursor (remote cursor rendering):
//   @tiptap/extension-collaboration-cursor has not yet published a
//   TipTap v3-compatible release (still at v2). The extension is
//   intentionally omitted until TipTap publishes a v3 version.
//   Peer presence (who is in the room) is surfaced via Y.js
//   awareness in useCollabProvider + CollabAwarenessBar.
//   To add cursor rendering once the package is available:
//     import CollaborationCursor from "@tiptap/extension-collaboration-cursor";
//     Add after Collaboration: CollaborationCursor.configure({ provider, user: { name, color } })
// ============================================================

import Collaboration from "@tiptap/extension-collaboration";
import StarterKit from "@tiptap/starter-kit";
import type * as Y from "yjs";

import {
  NON_STARTER_EXTENSIONS,
  STARTER_KIT_BASE_CONFIG,
} from "@/app/(main)/dashboard/projects/_components/editor/extensions";

/**
 * Builds the collab-mode extension array.
 *
 * Composes:
 *   1. StarterKit with history:false (Y.js owns undo/redo)
 *   2. All NON_STARTER_EXTENSIONS unchanged (same as solo mode)
 *   3. Collaboration — binds TipTap to the Y.Doc field "document"
 *
 * Called once per workspace collab session — not on every render.
 */
export function buildCollabExtensions(ydoc: Y.Doc) {
  return [
    // StarterKit base configuration (heading levels etc.).
    // NOTE: In TipTap v3, `history: false` is NOT a valid StarterKitOption.
    // The @tiptap/extension-collaboration v3 extension automatically overrides
    // the undo/redo commands to use Y.js's UndoManager, so the native History
    // plugin is effectively disabled for collaborative sessions without any
    // explicit StarterKit configuration needed.
    StarterKit.configure({
      ...STARTER_KIT_BASE_CONFIG,
      history: false,
    }),

    // All other base extensions — identical to solo mode
    ...NON_STARTER_EXTENSIONS,

    // Y.js document binding — makes Y.Doc the content source of truth.
    // field "document" must match the backend Y.Doc fragment name.
    Collaboration.configure({
      document: ydoc,
      field: "document",
    }),
  ];
}
