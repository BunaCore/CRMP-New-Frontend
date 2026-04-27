// ============================================================
// COLLAB PROVIDER FACTORY
//
// Creates a y-websocket WebsocketProvider for a given workspace.
//
// Backend transport (confirmed in collab-ws.server.ts + main.ts):
//   - Raw WebSocket server attached to the NestJS HTTP server
//   - Path: /collab/<workspaceId>  (workspaceId = y-websocket room name)
//   - Auth: ?token=<jwt> query param (read from URL search params on upgrade)
//   - Protocol: y-websocket/bin/utils setupWSConnection (standard y-protocol sync)
//   - On auth failure: HTTP 401/403 upgrade rejection → WS close
//
// URL derivation:
//   NEXT_PUBLIC_API_URL is the HTTP base (e.g. http://localhost:3000).
//   We convert it to WebSocket (ws:// or wss://) and append /collab.
//   WebsocketProvider then connects to ws://<host>/collab/<workspaceId>.
// ============================================================

import { WebsocketProvider } from "y-websocket";
import type * as Y from "yjs";

/** Convert an HTTP API base URL to its WebSocket equivalent. */
function toWsUrl(httpUrl: string): string {
  return httpUrl
    .replace(/^https:\/\//, "wss://")
    .replace(/^http:\/\//, "ws://")
    .replace(/\/$/, ""); // strip trailing slash
}

// NEXT_PUBLIC_API_URL: shared with the REST client (e.g. http://localhost:3000).
// The collab WS server lives on the SAME host:port under /collab/*.
const COLLAB_WS_URL = toWsUrl(process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3000") + "/collab";

export interface CollabProviderOptions {
  workspaceId: string;
  ydoc: Y.Doc;
  token: string;
}

/**
 * Returns a disconnected WebsocketProvider.
 *
 * Caller (useCollabProvider) binds listeners then calls .connect().
 *
 * Wire format:
 *   WebsocketProvider("ws://host/collab", workspaceId, ydoc)
 *   → connects to ws://host/collab/<workspaceId>?token=<token>
 *
 * Backend reads:
 *   urlObj.pathname  → strips /collab/ prefix → gets workspaceId
 *   urlObj.searchParams.get('token') → validates JWT + project membership
 */
export function createCollabProvider({ workspaceId, ydoc, token }: CollabProviderOptions): WebsocketProvider {
  return new WebsocketProvider(COLLAB_WS_URL, workspaceId, ydoc, {
    params: { token }, // sent as ?token=<jwt> query param
    connect: false, // caller connects explicitly after binding listeners
  });
}
