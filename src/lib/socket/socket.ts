import { io, type Socket } from "socket.io-client";

import { diagnoseSocketConnection, logDiagnosticResults } from "./socket-diagnostics";

// Define the environment variable for your backend URL in production
// Since we don't know the exact URL, default to empty to enforce relying on relative or env
const SOCKET_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

class SocketManager {
  private static instance: SocketManager;
  private socket: Socket | null = null;
  private isConnecting = false;
  private diagnosticsShown = false;

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

    console.log("[SocketManager] Attempting connection to:", SOCKET_URL);
    console.log("[SocketManager] Token provided:", token ? "Yes" : "No");

    // Setup Socket connection with improved configuration
    this.socket = io(SOCKET_URL, {
      auth: {
        token: token,
      },
      extraHeaders: {
        Authorization: token ? `Bearer ${token}` : "",
      },
      autoConnect: false,
      // Try WebSocket first, then fall back to polling
      transports: ["websocket", "polling"],
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: 10,
      timeout: 20000,
      // Socket.IO CORS configuration
      withCredentials: true,
      // Upgrade timeout to allow for slower connections
      ...({ upgradeTimeout: 10000 } as any),
    });

    this.setupInternalListeners();
    this.socket.connect();
  }

  private setupInternalListeners() {
    if (!this.socket) return;

    this.socket.on("connect", () => {
      this.isConnecting = false;
      this.diagnosticsShown = false; // Reset for future disconnections
      console.log("[SocketManager] ✓ Connected to server successfully");
    });

    this.socket.on("disconnect", (reason) => {
      console.warn(`[SocketManager] ✗ Disconnected: ${reason}`);
      this.isConnecting = false;
    });

    this.socket.on("connect_error", async (error) => {
      this.isConnecting = false;
      console.error("[SocketManager] Connection Error:", error.message || error, "\nDetails:", error);

      // Show diagnostics only once per connection attempt
      if (!this.diagnosticsShown) {
        this.diagnosticsShown = true;
        console.log("[SocketManager] Running diagnostics... (check console for details)");

        try {
          const diagnostics = await diagnoseSocketConnection(SOCKET_URL);
          logDiagnosticResults(diagnostics);
        } catch (diagErr) {
          console.error("[SocketManager] Diagnostics failed:", diagErr);
        }
      }

      // Log more diagnostic info
      if ((error as any).type === "TransportError") {
        console.error("[SocketManager] Transport Error - Server may not be running or unreachable");
        console.error(`[SocketManager] Trying to reach: ${SOCKET_URL}`);
      }
    });

    this.socket.on("error", (error) => {
      console.error("[SocketManager] Socket Error:", error);
    });
  }

  public disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.isConnecting = false;
    }
  }

  public getSocket(): Socket | null {
    return this.socket;
  }

  public isConnected(): boolean {
    return this.socket?.connected ?? false;
  }
}

export const socketManager = SocketManager.getInstance();
