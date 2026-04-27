"use client";

// ============================================================
// CollabAwarenessBar
// Displays connected peers as stacked avatars and a live
// connection status badge. Only rendered when collab is active.
//
// Reads directly from collabStore — no props needed.
// Zero impact on solo-mode renders (returns null).
// ============================================================

import { Loader2, Users, Wifi, WifiOff } from "lucide-react";

import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/stores/authStore";
import { type CollabConnectionStatus, useCollabStore } from "@/stores/collabStore";

// ─── Connection badge ─────────────────────────────────────────

function ConnectionBadge({ status }: { status: CollabConnectionStatus }) {
  if (status === "connected") {
    return (
      <span className="flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-0.5 font-semibold text-[10px] text-emerald-600 dark:text-emerald-400">
        <Wifi className="h-2.5 w-2.5" />
        Live
      </span>
    );
  }

  if (status === "connecting") {
    return (
      <span className="flex items-center gap-1 rounded-full bg-amber-500/10 px-2 py-0.5 font-semibold text-[10px] text-amber-600 dark:text-amber-400">
        <Loader2 className="h-2.5 w-2.5 animate-spin" />
        Connecting
      </span>
    );
  }

  if (status === "disconnected") {
    return (
      <span className="flex items-center gap-1 rounded-full bg-destructive/10 px-2 py-0.5 font-semibold text-[10px] text-destructive">
        <WifiOff className="h-2.5 w-2.5" />
        Offline
      </span>
    );
  }

  if (status === "unauthorized") {
    return (
      <span className="flex items-center gap-1 rounded-full bg-destructive/10 px-2 py-0.5 font-semibold text-[10px] text-destructive">
        <WifiOff className="h-2.5 w-2.5" />
        Access denied
      </span>
    );
  }

  return null;
}

// ─── Single peer avatar ───────────────────────────────────────

function PeerAvatar({ name, color }: { name: string; color: string }) {
  const initials = name
    .split(" ")
    .map((p) => p[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <div
          className="flex h-6 w-6 shrink-0 cursor-default items-center justify-center rounded-full border-2 border-background font-bold text-[9px] text-white shadow-sm ring-1 ring-white/20 transition-transform hover:z-10 hover:scale-110"
          style={{ backgroundColor: color }}
        >
          {initials}
        </div>
      </TooltipTrigger>
      <TooltipContent side="bottom" className="text-xs">
        {name}
      </TooltipContent>
    </Tooltip>
  );
}

// ─── Main component ───────────────────────────────────────────

export function CollabAwarenessBar() {
  const isActive = useCollabStore((s) => s.isActive);
  const status = useCollabStore((s) => s.status);
  const peers = useCollabStore((s) => s.peers);
  const currentUser = useAuthStore((s) => s.user);

  // Only render in collab mode
  if (!isActive) return null;

  const peerCount = peers.length;

  return (
    <section
      className={cn(
        "flex items-center gap-2 rounded-full border bg-card/80 px-3 py-1 shadow-sm backdrop-blur-sm",
        "transition-all duration-300",
      )}
      aria-label="Collaboration status"
    >
      {/* Connection badge */}
      <ConnectionBadge status={status} />

      {/* Peer avatars — only show when connected */}
      {status === "connected" && (
        <div className="flex items-center">
          {/* Current user avatar (always first) */}
          {currentUser && (
            <div className="-mr-1">
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="flex h-6 w-6 shrink-0 cursor-default items-center justify-center rounded-full border-2 border-background bg-primary font-bold text-[9px] text-primary-foreground shadow-sm">
                    {currentUser.fullName
                      .split(" ")
                      .map((p) => p[0])
                      .join("")
                      .slice(0, 2)
                      .toUpperCase()}
                  </div>
                </TooltipTrigger>
                <TooltipContent side="bottom" className="text-xs">
                  You ({currentUser.fullName})
                </TooltipContent>
              </Tooltip>
            </div>
          )}

          {/* Remote peer avatars */}
          {peers.slice(0, 4).map((peer, idx) => (
            <div key={peer.userId} className="-mr-1 relative" style={{ zIndex: peers.length - idx }}>
              <PeerAvatar name={peer.name} color={peer.color} />
            </div>
          ))}

          {/* Overflow badge when >4 peers */}
          {peerCount > 4 && (
            <div className="-mr-1 relative flex h-6 w-6 items-center justify-center rounded-full border-2 border-background bg-muted font-bold text-[9px] text-muted-foreground shadow-sm">
              +{peerCount - 4}
            </div>
          )}
        </div>
      )}

      {/* Peer count label */}
      {status === "connected" && (
        <span className="flex items-center gap-1 text-[10px] text-muted-foreground">
          <Users className="h-2.5 w-2.5" />
          {peerCount + 1} {peerCount + 1 === 1 ? "editor" : "editors"}
        </span>
      )}
    </section>
  );
}
