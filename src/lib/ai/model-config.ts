// ============================================================
// src/lib/ai/model-config.ts
// Model mode management: persistence, availability, fallback.
// This is the single source of truth for which model is active.
// ============================================================

import type { AiMode, AiModelConfig } from "./types";

// ─── Constants ───────────────────────────────────────────────

const STORAGE_KEY = "crmp-ai-mode";

export const AI_MODEL_DEFINITIONS: Record<AiMode, Omit<AiModelConfig, "available">> = {
  local: {
    mode: "local",
    modelId: "crmp-research",
    endpoint: "http://localhost:11434",
  },
  cloud: {
    mode: "cloud",
    modelId: "gpt-4o",
  },
};

export const AI_MODE_LABELS: Record<AiMode, string> = {
  local: "Local AI",
  cloud: "Cloud AI",
};

export const AI_MODE_DESCRIPTIONS: Record<AiMode, string> = {
  local: "Private device model, secure · No data leaves your machine",
  cloud: "Stronger hosted model, faster · Best for large documents",
};

export const AI_MODE_HINTS: Record<AiMode, string> = {
  local: "Running on your device · Private · May be slower",
  cloud: "Faster responses · Data processed on server",
};

// ─── Persistence ──────────────────────────────────────────────

export function getPersistedAiMode(): AiMode {
  if (typeof window === "undefined") return "cloud";
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored === "local" || stored === "cloud") return stored;
  return "cloud";
}

export function persistAiMode(mode: AiMode): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, mode);
}

// ─── Availability check ───────────────────────────────────────
// Pings the local Ollama endpoint to determine if local mode is reachable.
// Returns true if available, false otherwise.

export async function checkLocalModelAvailability(endpoint = "http://localhost:11434"): Promise<boolean> {
  try {
    const res = await fetch(`${endpoint}/api/tags`, {
      method: "GET",
      signal: AbortSignal.timeout(2000),
    });
    return res.ok;
  } catch {
    return false;
  }
}

// ─── Config builder ───────────────────────────────────────────
// Returns the full AiModelConfig for the given mode.

export function buildModelConfig(mode: AiMode, available = true): AiModelConfig {
  return {
    ...AI_MODEL_DEFINITIONS[mode],
    available,
  };
}

// ─── Effective mode resolution ────────────────────────────────
// If local is selected but unavailable, fall back to cloud.
// Returns the resolved mode and whether a fallback occurred.

export function resolveEffectiveMode(
  selected: AiMode,
  localAvailable: boolean,
): { effectiveMode: AiMode; fellBack: boolean } {
  if (selected === "local" && !localAvailable) {
    return { effectiveMode: "cloud", fellBack: true };
  }
  return { effectiveMode: selected, fellBack: false };
}
