"use client";

// ============================================================
// src/lib/ai/hooks/useAiChat.ts
// Manages the main Chat tab conversation lifecycle.
// Replaces the local-only useState in ChatPanel.
// ============================================================

import { useCallback, useRef, useState } from "react";

import { nanoid } from "nanoid";

import { buildUnifiedChatRequest, sendUnifiedChat } from "../requests/chat";
import type { AiChatMessage, AiConversationState, AiMode, AiRequestStatus, AiRequestType } from "../types";

interface UseAiChatOptions {
  projectId: string;
  workspaceId: string;
  projectTitle?: string;
  workspaceName?: string;
  userRole?: string;
}

interface UseAiChatReturn {
  messages: AiChatMessage[];
  status: AiRequestStatus;
  error: string | null;
  /** Send a free-form message, optionally with selected editor context */
  sendMessage: (
    message: string,
    selectedContext?: string | null,
    requestType?: AiRequestType,
    from?: number,
    to?: number,
  ) => Promise<void>;
  /** Send a pre-built prompt+context pair from the editor toolbar */
  sendToolbarAction: (
    prompt: string,
    context: string,
    requestType?: AiRequestType,
    from?: number,
    to?: number,
  ) => Promise<void>;
  clearMessages: () => void;
}

export function useAiChat(aiMode: AiMode, options: UseAiChatOptions): UseAiChatReturn {
  const [state, setState] = useState<AiConversationState>({
    messages: [],
    status: "idle",
    error: null,
    activePendingAction: null,
  });

  // Keep a stable ref to the current messages for history building
  const messagesRef = useRef<AiChatMessage[]>([]);
  messagesRef.current = state.messages;

  const appendMessage = useCallback((msg: AiChatMessage) => {
    setState((prev) => ({
      ...prev,
      messages: [...prev.messages, msg],
    }));
  }, []);

  const setStatus = useCallback((status: AiRequestStatus, error: string | null = null) => {
    setState((prev) => ({ ...prev, status, error }));
  }, []);

  const buildHistory = useCallback(
    () =>
      messagesRef.current
        .filter((m) => m.role === "user" || m.role === "assistant")
        .slice(-10) // keep last 10 for context window
        .map((m) => ({ role: m.role as "user" | "assistant", content: m.content })),
    [],
  );

  const sendMessage = useCallback(
    async (
      message: string,
      selectedContext?: string | null,
      requestType: AiRequestType = "CHAT_QUESTION",
      from?: number,
      to?: number,
    ) => {
      if (!message.trim() && !selectedContext) return;
      if (state.status === "pending") return;

      // 1. Append user message immediately
      const userMsg: AiChatMessage = {
        id: nanoid(),
        role: "user",
        content:
          selectedContext && message
            ? `${message}:\n\n> ${selectedContext.slice(0, 500)}`
            : message || `Action: ${requestType}`,
        timestamp: new Date(),
        requestType,
      };
      appendMessage(userMsg);
      setStatus("pending");

      // 2. Build and send request
      try {
        const req = buildUnifiedChatRequest(
          requestType,
          {
            message,
            context: selectedContext ?? undefined,
            from,
            to,
            history: requestType === "CHAT_QUESTION" ? buildHistory() : [],
          },
          {
            ...options,
            aiMode,
          },
        );

        const response = await sendUnifiedChat(req);

        const assistantMsg: AiChatMessage = {
          id: nanoid(),
          role: "assistant",
          content: response.result.reply,
          timestamp: new Date(),
          requestType,
          originalContext: selectedContext ?? undefined,
        };

        // If the AI returns an actionable instruction for the editor, attach it.
        // Prevent EXPLAIN, SUMMARIZE, OUTLINE from having replacement actions even if backend sends them.
        const isReadOnlyType = [
          "EXPLAIN_SELECTION",
          "SUMMARIZE_SELECTION",
          "OUTLINE_SUGGESTION",
          "DOCUMENT_CHAT",
          "FILE_BASED_QUESTION",
          "PROJECT_DATA_QUESTION",
        ].includes(requestType);

        if (response.action && response.action.type !== "none" && !isReadOnlyType) {
          const pendingAction = {
            id: nanoid(),
            messageId: assistantMsg.id,
            action: response.action,
            requestType,
            status: "waiting" as const,
            capturedAt: Date.now(),
          };
          assistantMsg.pendingAction = pendingAction;
        }

        appendMessage(assistantMsg);
        setStatus("success");
      } catch (err) {
        const errorMsg: AiChatMessage = {
          id: nanoid(),
          role: "assistant",
          content: "Sorry, I could not process your request. Please try again.",
          timestamp: new Date(),
        };
        appendMessage(errorMsg);
        setStatus("error", err instanceof Error ? err.message : "Request failed");
      }
    },
    [state.status, aiMode, options, appendMessage, setStatus, buildHistory],
  );

  const sendToolbarAction = useCallback(
    async (
      prompt: string,
      context: string,
      requestType: AiRequestType = "SUMMARIZE_SELECTION",
      from?: number,
      to?: number,
    ) => {
      await sendMessage(prompt, context, requestType, from, to);
    },
    [sendMessage],
  );

  const clearMessages = useCallback(() => {
    setState({
      messages: [],
      status: "idle",
      error: null,
      activePendingAction: null,
    });
  }, []);

  return {
    messages: state.messages,
    status: state.status,
    error: state.error,
    sendMessage,
    sendToolbarAction,
    clearMessages,
  };
}
