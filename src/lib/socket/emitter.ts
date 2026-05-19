import { useChatStore } from "@/stores/chat-store";

import { socketManager } from "./socket";

export function emitSendMessage(payload: { chatId: string; content: string; tempId: string }) {
  const socket = socketManager.getSocket();
  if (socket) {
    socket.emit("chat:sendMessage", payload);
  } else {
    console.warn("Socket not connected, cannot emit chat:sendMessage");
  }
}

export function emitJoinChat(payload: { chatId: string }) {
  const socket = socketManager.getSocket();
  if (socket) {
    socket.emit("chat:join", payload);
  } else {
    console.warn("Socket not connected, cannot emit chat:join");
  }
}

// Per-chat typing debounce: emit immediately, then throttle subsequent fires
export function emitTyping(payload: { chatId: string }) {
  const socket = socketManager.getSocket();
  if (!socket) return;

  const shouldThrottle = useChatStore.getState().shouldThrottleTyping(payload.chatId);
  if (!shouldThrottle) {
    socket.emit("chat:typing", payload);
  }
}

export function emitGetInitialPresence() {
  const socket = socketManager.getSocket();
  if (socket) {
    socket.emit("presence:getInitial");
  }
}
