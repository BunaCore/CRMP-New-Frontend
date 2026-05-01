"use client";

// ============================================================
// src/lib/ai/hooks/useAiEdit.ts
// Manages editor-action AI requests (grammar fix, sentence fix).
// Handles the pending action lifecycle:
//   idle → pending → success (waiting for Apply/Dismiss) → applied | dismissed
// ============================================================

import { useCallback, useState } from "react";

import type { Editor } from "@tiptap/react";
import { nanoid } from "nanoid";

import {
  buildSelectionRequest,
  sendCaption,
  sendCollaborators,
  sendDiagram,
  sendExplain,
  sendOutline,
  sendSummarize,
} from "../requests/editor-actions";
import { sendGrammarFix, sendSentenceFix } from "../requests/grammar";
import type {
  AiChatMessage,
  AiEditorAction,
  AiMode,
  AiRequestStatus,
  AiRequestType,
  PendingEditorAction,
} from "../types";

interface UseAiEditOptions {
  projectId: string;
  workspaceId: string;
  projectTitle?: string;
  workspaceName?: string;
  userRole?: string;
}

interface UseAiEditReturn {
  /** Messages produced by edit actions (shown in chat panel) */
  editMessages: AiChatMessage[];
  editStatus: AiRequestStatus;
  editError: string | null;
  /** Active pending action waiting for Apply or Dismiss */
  pendingAction: PendingEditorAction | null;
  /** Run a grammar fix on a selection. Produces a replace action. */
  runGrammarFix: (editor: Editor) => Promise<void>;
  /** Run a sentence fix with a custom instruction */
  runSentenceFix: (editor: Editor, instruction: string) => Promise<void>;
  /** Run a simple text-only toolbar action */
  runToolbarAction: (
    requestType: AiRequestType,
    editor: Editor,
    extra?: { documentTitle?: string; projectDepartment?: string },
  ) => Promise<AiChatMessage | null>;
  /** Apply the pending editor action to the TipTap document */
  applyPendingAction: (editor: Editor) => void;
  /** Dismiss the pending editor action without applying */
  dismissPendingAction: () => void;
}

export function useAiEdit(aiMode: AiMode, options: UseAiEditOptions): UseAiEditReturn {
  const [editMessages, setEditMessages] = useState<AiChatMessage[]>([]);
  const [editStatus, setEditStatus] = useState<AiRequestStatus>("idle");
  const [editError, setEditError] = useState<string | null>(null);
  const [pendingAction, setPendingAction] = useState<PendingEditorAction | null>(null);

  const appendEditMessage = useCallback((msg: AiChatMessage) => {
    setEditMessages((prev) => [...prev, msg]);
  }, []);

  // ─── Grammar fix ──────────────────────────────────────────

  const runGrammarFix = useCallback(
    async (editor: Editor) => {
      const { from, to } = editor.state.selection;
      const selectedText = editor.state.doc.textBetween(from, to, " ");
      if (!selectedText.trim()) return;

      setEditStatus("pending");
      setEditError(null);

      try {
        const response = await sendGrammarFix({
          selectedText,
          from,
          to,
          aiMode,
          projectId: options.projectId,
          workspaceId: options.workspaceId,
          userRole: options.userRole,
        });

        const msgId = nanoid();
        const actionId = nanoid();

        const pending: PendingEditorAction = {
          id: actionId,
          messageId: msgId,
          action: {
            type: "replace",
            from,
            to,
            content: response.result.correctedText,
            original: response.result.original,
          },
          requestType: "GRAMMAR_FIX",
          status: "waiting",
          capturedAt: Date.now(),
        };

        setPendingAction(pending);

        const msg: AiChatMessage = {
          id: msgId,
          role: "assistant",
          content: response.result.correctedText,
          timestamp: new Date(),
          requestType: "GRAMMAR_FIX",
          pendingAction: pending,
        };

        appendEditMessage(msg);
        setEditStatus("success");
      } catch (err) {
        setEditStatus("error");
        setEditError(err instanceof Error ? err.message : "Grammar fix failed");
      }
    },
    [aiMode, options, appendEditMessage],
  );

  // ─── Sentence fix ─────────────────────────────────────────

  const runSentenceFix = useCallback(
    async (editor: Editor, instruction: string) => {
      const { from, to } = editor.state.selection;
      const sentence = editor.state.doc.textBetween(from, to, " ");
      if (!sentence.trim()) return;

      setEditStatus("pending");
      setEditError(null);

      try {
        const response = await sendSentenceFix({
          sentence,
          instruction,
          from,
          to,
          aiMode,
          projectId: options.projectId,
          workspaceId: options.workspaceId,
          userRole: options.userRole,
        });

        const msgId = nanoid();
        const actionId = nanoid();

        const pending: PendingEditorAction = {
          id: actionId,
          messageId: msgId,
          action: {
            type: "replace",
            from,
            to,
            content: response.result.replacement,
            original: response.result.original,
          },
          requestType: "SENTENCE_FIX_AND_REPLACE",
          status: "waiting",
          capturedAt: Date.now(),
        };

        setPendingAction(pending);

        appendEditMessage({
          id: msgId,
          role: "assistant",
          content: response.result.replacement,
          timestamp: new Date(),
          requestType: "SENTENCE_FIX_AND_REPLACE",
          pendingAction: pending,
        });

        setEditStatus("success");
      } catch (err) {
        setEditStatus("error");
        setEditError(err instanceof Error ? err.message : "Sentence fix failed");
      }
    },
    [aiMode, options, appendEditMessage],
  );

  // ─── Toolbar actions (text-only or insert) ────────────────

  const runToolbarAction = useCallback(
    async (
      requestType: AiRequestType,
      editor: Editor,
      extra: { documentTitle?: string; projectDepartment?: string } = {},
    ): Promise<AiChatMessage | null> => {
      const { from, to } = editor.state.selection;
      const selectedText = editor.state.doc.textBetween(from, to, " ");
      if (!selectedText.trim()) return null;

      const base = buildSelectionRequest(selectedText, { ...options, aiMode });

      setEditStatus("pending");
      setEditError(null);

      try {
        let content = "";
        let action: AiEditorAction = { type: "none" };

        switch (requestType) {
          case "SUMMARIZE_SELECTION": {
            const r = await sendSummarize(base);
            content = r.result.summary;
            action = r.action;
            break;
          }
          case "EXPLAIN_SELECTION": {
            const r = await sendExplain(base);
            content = r.result.explanation;
            action = r.action;
            break;
          }
          case "OUTLINE_SUGGESTION": {
            const r = await sendOutline({ ...base, documentTitle: extra.documentTitle ?? "" });
            content = r.result.outline.join("\n");
            action = r.action;
            break;
          }
          case "CAPTION_GENERATION": {
            const r = await sendCaption(base);
            content = r.result.caption;
            action = { type: "insert", content: r.result.caption };
            break;
          }
          case "COLLABORATOR_RECOMMENDATION": {
            const r = await sendCollaborators({ ...base, projectDepartment: extra.projectDepartment });
            content = r.result.recommendations.map((rec) => `• ${rec.name} — ${rec.expertise}`).join("\n");
            action = r.action;
            break;
          }
          case "INSERT_DIAGRAM": {
            const r = await sendDiagram(base);
            content = r.result.mermaidCode ?? r.result.imageUrl ?? "";
            action = { type: "insert", content };
            break;
          }
          default:
            return null;
        }

        const msgId = nanoid();
        let pending: PendingEditorAction | undefined;

        if (action.type === "insert" || action.type === "replace") {
          const actionId = nanoid();
          pending = {
            id: actionId,
            messageId: msgId,
            action: { ...action, from, to },
            requestType,
            status: "waiting",
            capturedAt: Date.now(),
          };
          setPendingAction(pending);
        }

        const msg: AiChatMessage = {
          id: msgId,
          role: "assistant",
          content,
          timestamp: new Date(),
          requestType,
          pendingAction: pending,
        };

        appendEditMessage(msg);
        setEditStatus("success");
        return msg;
      } catch (err) {
        setEditStatus("error");
        setEditError(err instanceof Error ? err.message : "Action failed");
        return null;
      }
    },
    [options, aiMode, appendEditMessage],
  );

  // ─── Apply / dismiss ──────────────────────────────────────

  const applyPendingAction = useCallback(
    (editor: Editor) => {
      if (!pendingAction) return;
      const { action } = pendingAction;

      // Safety guard: if isDirty after capturedAt, the positions may have shifted
      // The backend echoes the positions back — apply them as-is.
      if (action.type === "replace" && action.from !== undefined && action.to !== undefined && action.content) {
        editor
          .chain()
          .focus()
          .setTextSelection({ from: action.from, to: action.to })
          .insertContent(action.content)
          .run();
      } else if (action.type === "insert" && action.content) {
        editor.chain().focus().insertContent(action.content).run();
      }

      setPendingAction((prev) => (prev ? { ...prev, status: "applied" } : null));

      setEditMessages((prev) =>
        prev.map((m) =>
          m.pendingAction?.id === pendingAction.id
            ? { ...m, pendingAction: { ...m.pendingAction, status: "applied" } }
            : m,
        ),
      );
    },
    [pendingAction],
  );

  const dismissPendingAction = useCallback(() => {
    if (!pendingAction) return;

    setPendingAction((prev) => (prev ? { ...prev, status: "dismissed" } : null));

    setEditMessages((prev) =>
      prev.map((m) =>
        m.pendingAction?.id === pendingAction.id
          ? { ...m, pendingAction: { ...m.pendingAction, status: "dismissed" } }
          : m,
      ),
    );
  }, [pendingAction]);

  return {
    editMessages,
    editStatus,
    editError,
    pendingAction,
    runGrammarFix,
    runSentenceFix,
    runToolbarAction,
    applyPendingAction,
    dismissPendingAction,
  };
}
