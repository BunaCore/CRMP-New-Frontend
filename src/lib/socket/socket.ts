import { io, type Socket } from "socket.io-client";

// Define the environment variable for your backend URL in production
// Since we don't know the exact URL, default to empty to enforce relying on relative or env
const SOCKET_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

class SocketManager {
  private static instance: SocketManager;
  private socket: Socket | null = null;
  private isConnecting = false;

  private constructor() {}

  public static getInstance(): SocketManager {
    if (!SocketManager.instance) {
      SocketManager.instance = new SocketManager();
    }
    return SocketManager.instance;
  }

  public connect(token: string) {
    if (this.socket?.connected || this.isConnecting) return;

    this.isConnecting = true;

    // Setup Socket connection
    // extraHeaders are sent on the HTTP polling handshake request (before WS upgrade),
    // which is how the backend receives the Authorization header.
    // Forcing websocket-only would skip that HTTP phase and drop the headers.
    console.log("token", token);
    this.socket = io(SOCKET_URL, {
      extraHeaders: {
        Authorization: token,
      },
      autoConnect: false,
      transports: ["polling", "websocket"],
      reconnectionAttempts: 5,
      timeout: 10000,
    });

    this.setupInternalListeners();
    this.socket.connect();
  }

  private setupInternalListeners() {
    if (!this.socket) return;

    this.socket.on("connect", () => {
      this.isConnecting = false;
      console.log("[SocketManager] Connected to server");
    });

    this.socket.on("disconnect", (reason) => {
      console.log(`[SocketManager] Disconnected: ${reason}`);
    });

    this.socket.on("connect_error", (error) => {
      this.isConnecting = false;
      console.error("[SocketManager] Connection Error:", error.message);
    });
  }

  public disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  public getSocket(): Socket | null {
    return this.socket;
  }
}

export const socketManager = SocketManager.getInstance();
