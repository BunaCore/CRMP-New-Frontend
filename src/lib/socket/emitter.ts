import { socketManager } from "./socket";

export function emitSendMessage(payload: { chatId: string; content: string; tempId: string }) {
  const socket = socketManager.getSocket();
  if (socket) {
    socket.emit("chat:sendMessage", payload);
  } else {
    console.warn("Socket not connected, cannot emit chat:sendMessage");
  }
}

export function emitTyping(payload: { chatId: string; isTyping: boolean }) {
  const socket = socketManager.getSocket();
  if (socket) {
    socket.emit("chat:typing", payload);
  }
}

export function emitGetInitialPresence() {
  const socket = socketManager.getSocket();
  if (socket) {
    socket.emit("presence:getInitial");
  }
}
