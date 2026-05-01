"use client";

// ============================================================
// src/lib/ai/hooks/useModelConfig.ts
// Manages AI model mode with localStorage persistence and
// local model availability checking.
// ============================================================

import { useCallback, useEffect, useState } from "react";

import {
  AI_MODE_HINTS,
  AI_MODE_LABELS,
  checkLocalModelAvailability,
  getPersistedAiMode,
  persistAiMode,
  resolveEffectiveMode,
} from "../model-config";
import type { AiMode } from "../types";

interface UseModelConfigReturn {
  /** The mode the user has selected (local or cloud) */
  selectedMode: AiMode;
  /** The resolved effective mode (may differ from selected if local is unavailable) */
  effectiveMode: AiMode;
  /** Whether local model is reachable */
  localAvailable: boolean;
  /** Whether a local→cloud fallback is currently active */
  isFallbackActive: boolean;
  /** Whether the availability check is in progress */
  isChecking: boolean;
  /** Human-readable label for the current selected mode */
  modeLabel: string;
  /** Hint text shown below the composer */
  modeHint: string;
  /** Set mode — persists to localStorage and re-checks availability */
  setMode: (mode: AiMode) => void;
  /** Re-run the local availability check manually */
  recheckAvailability: () => Promise<void>;
}

export function useModelConfig(): UseModelConfigReturn {
  const [selectedMode, setSelectedMode] = useState<AiMode>(getPersistedAiMode);
  const [localAvailable, setLocalAvailable] = useState(true);
  const [isChecking, setIsChecking] = useState(false);

  const recheckAvailability = useCallback(async () => {
    setIsChecking(true);
    const available = await checkLocalModelAvailability();
    setLocalAvailable(available);
    setIsChecking(false);
  }, []);

  // Check once on mount, then whenever the user switches to local
  useEffect(() => {
    if (selectedMode === "local") {
      recheckAvailability();
    }
  }, [selectedMode, recheckAvailability]);

  const setMode = useCallback(
    (mode: AiMode) => {
      setSelectedMode(mode);
      persistAiMode(mode);
      if (mode === "local") {
        recheckAvailability();
      }
    },
    [recheckAvailability],
  );

  const { effectiveMode, fellBack } = resolveEffectiveMode(selectedMode, localAvailable);

  return {
    selectedMode,
    effectiveMode,
    localAvailable,
    isFallbackActive: fellBack,
    isChecking,
    modeLabel: AI_MODE_LABELS[selectedMode],
    modeHint: AI_MODE_HINTS[effectiveMode],
    setMode,
    recheckAvailability,
  };
}
