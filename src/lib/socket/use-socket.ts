"use client";

import { useEffect } from "react";

import { useQueryClient } from "@tanstack/react-query";

import { setupSocketListeners } from "./listeners";
import { socketManager } from "./socket";

export function useSocketInitialization(token: string | null) {
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!token) {
      socketManager.disconnect();
      return;
    }

    // Connect the singleton
    socketManager.connect(token);

    // Bind listeners tracking specific caches safely
    setupSocketListeners(queryClient);

    return () => {
      // Typically we don't disconnect arbitrarily on re-renders,
      // but ensuring listeners are cleanly managed inside setupSocketListeners prevents leaks
    };
  }, [token, queryClient]);
}
