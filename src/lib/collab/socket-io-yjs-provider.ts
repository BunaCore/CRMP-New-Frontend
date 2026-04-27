// ============================================================
// SocketIoYjsProvider
//
// Custom Y.js provider that connects to the backend's Socket.IO
// collaboration gateway using the exact event contract:
//
//   Client → Server:
//     'collab:join'   { workspaceId: string }
//     'collab:yjs'    Uint8Array  (y-protocols binary: sync or awareness)
//     'collab:leave'  (no payload)
//
//   Server → Client:
//     'collab:joined'   { projectId, workspaceId, onlineUserIds }
//     'collab:yjs'      Uint8Array  (sync step 1/2, update, or awareness)
//     'collab:presence' { projectId, onlineUserIds, timestamp }
//     'collab:error'    { message: string }
//     'auth:error'      { message: string }
//
// Y.js sync handshake (y-protocols spec):
//   1. Server sends step 1 (its state vector) after join
//   2. Client reads step 1 → replies with step 2 (client's diff)
//   3. Client sends its own step 1 (client's state vector)
//   4. Server reads client step 1 → replies with step 2 (server's diff)
//   5. Client receives step 2 → 'sync' event fires → editor unlocks
//
// Auth: JWT in Authorization header during Socket.IO handshake.
//   Same pattern as the existing SocketManager in lib/socket/socket.ts.
// ============================================================

import * as decoding from "lib0/decoding";
import * as encoding from "lib0/encoding";
import { io, type Socket } from "socket.io-client";
import * as awarenessProtocol from "y-protocols/awareness";
import * as syncProtocol from "y-protocols/sync";
import type * as Y from "yjs";

// Y.js binary protocol message types (per y-protocols spec)
const MSG_SYNC = 0;
const MSG_AWARENESS = 1;

// ─── Options ──────────────────────────────────────────────────

export interface SocketIoYjsProviderOptions {
  /** Socket.IO server base URL (e.g. http://localhost:3000) */
  url: string;
  /** Workspace ID — sent to backend to join the correct project room */
  workspaceId: string;
  /** Y.Doc to keep in sync with the server */
  doc: Y.Doc;
  /** JWT access token — sent as 'Authorization: Bearer ...' header */
  token: string;
}

// ─── Provider ─────────────────────────────────────────────────

export class SocketIoYjsProvider {
  private readonly socket: Socket;
  private joined = false;
  private synced = false;
  private destroyed = false;

  // Y.js primitives — exposed for TipTap awareness and useCollabProvider
  readonly doc: Y.Doc;
  readonly awareness: awarenessProtocol.Awareness;

  // biome-ignore lint/suspicious/noExplicitAny: mini event-emitter, typed at call sites
  private readonly listeners = new Map<string, Array<(...args: any[]) => void>>();

  constructor(private readonly opts: SocketIoYjsProviderOptions) {
    this.doc = opts.doc;
    this.awareness = new awarenessProtocol.Awareness(opts.doc);

    this.socket = io(opts.url, {
      // Authorization header — backend reads from client.handshake.headers['authorization']
      extraHeaders: { Authorization: `Bearer ${opts.token}` },
      autoConnect: false,
      // Start with polling so extraHeaders are sent in the HTTP phase,
      // then upgrade to WebSocket. Mirrors the existing SocketManager.
      transports: ["polling", "websocket"],
    });

    this.bindSocketListeners();

    // Wire Y.Doc and awareness updates → outbound messages
    this.doc.on("update", this.handleDocUpdate);
    this.awareness.on("update", this.handleAwarenessUpdate);
  }

  // ── Socket.IO listeners ──────────────────────────────────────

  private bindSocketListeners() {
    this.socket.on("connect", this.onConnect);
    this.socket.on("disconnect", this.onDisconnect);
    this.socket.on("connect_error", this.onConnectError);
    this.socket.on("collab:joined", this.onJoined);
    this.socket.on("collab:yjs", this.onYjsMessage);
    this.socket.on("collab:error", this.onError);
    this.socket.on("auth:error", this.onError);
  }

  private onConnect = () => {
    this.emit("status", { status: "connecting" });
    // Backend validates JWT and project membership on join
    this.socket.emit("collab:join", { workspaceId: this.opts.workspaceId });
  };

  private onDisconnect = () => {
    this.joined = false;
    this.synced = false;
    this.emit("status", { status: "disconnected" });
  };

  private onConnectError = () => {
    this.emit("status", { status: "disconnected" });
  };

  private onJoined = (_data: { projectId: string; workspaceId: string; onlineUserIds: string[] }) => {
    this.joined = true;
    this.emit("status", { status: "connected" });

    // Send our own sync step 1 so the server knows what we have and can
    // send us step 2 (the diff we're missing). Without this, the server
    // only sends us its updates; we'd never receive the server's content.
    this.sendSyncStep1();
  };

  private onYjsMessage = (payload: ArrayBuffer | Uint8Array | number[]) => {
    const buf = normaliseToUint8Array(payload);
    if (!buf || buf.length === 0) return;

    const decoder = decoding.createDecoder(buf);
    let msgType: number;
    try {
      msgType = decoding.readVarUint(decoder);
    } catch {
      return; // malformed — discard
    }

    if (msgType === MSG_SYNC) {
      const replyEnc = encoding.createEncoder();
      encoding.writeVarUint(replyEnc, MSG_SYNC);

      let syncType: number;
      try {
        // decoder is now positioned after the outer msgType, as the backend expects
        syncType = syncProtocol.readSyncMessage(decoder, replyEnc, this.doc, this);
      } catch {
        return; // malformed sync payload
      }

      // Send the reply (step 2 or empty) if it contains more than just the outer type byte
      const reply = encoding.toUint8Array(replyEnc);
      if (reply.length > 1) {
        this.socket.emit("collab:yjs", reply);
      }

      // syncType === 1 (messageSyncStep2) means the server sent us its diff.
      // This is the point at which the Y.Doc is fully in sync.
      if (syncType === 1 && !this.synced) {
        this.synced = true;
        this.emit("sync", true);
      }
    } else if (msgType === MSG_AWARENESS) {
      try {
        const update = decoding.readVarUint8Array(decoder);
        awarenessProtocol.applyAwarenessUpdate(this.awareness, update, this);
      } catch {
        // malformed awareness — ignore
      }
    }
  };

  private onError = (data: { message?: string }) => {
    const msg = (data?.message ?? "").toLowerCase();
    const isAuth =
      msg.includes("token") ||
      msg.includes("not authenticated") ||
      msg.includes("access denied") ||
      msg.includes("not joined");
    this.emit("status", { status: isAuth ? "unauthorized" : "disconnected" });
  };

  // ── Y.Doc → server ────────────────────────────────────────────

  private sendSyncStep1() {
    const enc = encoding.createEncoder();
    encoding.writeVarUint(enc, MSG_SYNC);
    syncProtocol.writeSyncStep1(enc, this.doc);
    this.socket.emit("collab:yjs", encoding.toUint8Array(enc));
  }

  // Called by Y.js whenever the local doc changes.
  // `origin === this` means the change came from the network → skip to avoid echo.
  private handleDocUpdate = (update: Uint8Array, origin: unknown) => {
    if (!this.joined || origin === this) return;
    const enc = encoding.createEncoder();
    // The backend messageType dispatcher reads the OUTER byte first (0=sync, 1=awareness).
    // `syncProtocol.writeUpdate` only writes [syncType=2][update] — it does NOT include
    // the outer MSG_SYNC (0) prefix. We must add it manually so the full wire format is
    // [0][2][update], matching what `onYjsMessage` on the server expects.
    encoding.writeVarUint(enc, MSG_SYNC);
    syncProtocol.writeUpdate(enc, update);
    this.socket.emit("collab:yjs", encoding.toUint8Array(enc));
  };

  // Called by Y.js awareness whenever local state changes.
  private handleAwarenessUpdate = ({
    added,
    updated,
    removed,
  }: {
    added: number[];
    updated: number[];
    removed: number[];
  }) => {
    if (!this.joined) return;
    const changed = [...added, ...updated, ...removed];
    const enc = encoding.createEncoder();
    encoding.writeVarUint(enc, MSG_AWARENESS);
    encoding.writeVarUint8Array(enc, awarenessProtocol.encodeAwarenessUpdate(this.awareness, changed));
    this.socket.emit("collab:yjs", encoding.toUint8Array(enc));
  };

  // ── Lifecycle ─────────────────────────────────────────────────

  connect() {
    if (!this.destroyed) this.socket.connect();
  }

  disconnect() {
    if (this.joined) {
      this.socket.emit("collab:leave");
      this.joined = false;
    }
    this.socket.disconnect();
  }

  destroy() {
    this.destroyed = true;
    this.awareness.setLocalState(null);
    this.disconnect();
    this.doc.off("update", this.handleDocUpdate);
    this.awareness.off("update", this.handleAwarenessUpdate);
    this.awareness.destroy();
    this.socket.removeAllListeners();
  }

  // ── Minimal event emitter ─────────────────────────────────────
  // Implements the interface expected by useCollabProvider:
  //   on('sync', handler)      — fires once when Y.Doc is fully synced
  //   on('status', handler)    — fires on connection state changes
  //   once(event, handler)     — one-shot listener

  // biome-ignore lint/suspicious/noExplicitAny: intentional — heterogeneous event payloads
  on(event: string, handler: (...args: any[]) => void) {
    if (!this.listeners.has(event)) this.listeners.set(event, []);
    this.listeners.get(event)?.push(handler);
  }

  // biome-ignore lint/suspicious/noExplicitAny: intentional
  off(event: string, handler: (...args: any[]) => void) {
    const arr = this.listeners.get(event);
    if (!arr) return;
    const idx = arr.indexOf(handler);
    if (idx >= 0) arr.splice(idx, 1);
  }

  // biome-ignore lint/suspicious/noExplicitAny: intentional
  once(event: string, handler: (...args: any[]) => void) {
    // biome-ignore lint/suspicious/noExplicitAny: intentional
    const wrapped = (...args: any[]) => {
      handler(...args);
      this.off(event, wrapped);
    };
    this.on(event, wrapped);
  }

  // biome-ignore lint/suspicious/noExplicitAny: intentional
  private emit(event: string, ...args: any[]) {
    this.listeners.get(event)?.forEach((h) => {
      h(...args);
    });
  }
}

// ─── Helpers ──────────────────────────────────────────────────

function normaliseToUint8Array(payload: ArrayBuffer | Uint8Array | number[]): Uint8Array | null {
  if (payload instanceof Uint8Array) return payload;
  if (payload instanceof ArrayBuffer) return new Uint8Array(payload);
  if (Array.isArray(payload)) return new Uint8Array(payload);
  return null;
}
