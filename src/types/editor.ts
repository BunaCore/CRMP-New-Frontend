// ============================================================
// EDITOR TYPES — Shared frontend/backend contract
// These types mirror the NestJS DTOs exactly.
// Source of truth: structured JSON (TipTap JSONContent), NOT HTML.
// ============================================================

import type { JSONContent } from "@tiptap/react";

// ─── Core Identifiers ────────────────────────────────────────

export interface WorkspaceIdentity {
  projectId: string;
  workspaceId: string;
}

// ─── Document (the live editable document) ───────────────────

// ─── Projects & Workspaces ─────────────────────────────────────

export interface ProjectIdentity {
  projectId: string;
  projectTitle: string;
  // projectStage, etc.
}

export interface WorkspaceInfo {
  id: string;
  projectId: string;
  name: string;
  createdBy: string;
  createdAt: string; // ISO
}

/**
 * The full workspace document as returned by GET /workspaces/:workspaceId/document
 * The `content` field is TipTap JSONContent — never plain HTML.
 */
export interface WorkspaceDocument {
  id: string;
  workspaceId: string;
  content: JSONContent; // TipTap structured JSON
  updatedAt: string; // ISO
}

// ─── Version Snapshot ────────────────────────────────────────

/**
 * A single snapshot in version history.
 * Snapshots are immutable once created.
 */
export interface DocumentVersion {
  id: string;
  versionNumber: number;
  content: JSONContent;
  createdAt: string;
  createdBy: string;
  sourceAction: string;
  contentHash: string;
}

/**
 * Summary list item — returned by GET /workspaces/:workspaceId/versions
 * Full content is only fetched on demand (GET /workspaces/:workspaceId/versions/:versionId)
 */
export interface DocumentVersionSummary {
  id: string;
  versionNumber: number;
  createdAt: string;
  createdBy: string;
  sourceAction: string;
  contentHash: string;
}

// ─── API Request Bodies ───────────────────────────────────────

/** PATCH /workspaces/:workspaceId — autosave payload */
export interface SaveDocumentPayload {
  content: JSONContent;
}

export interface SaveDocumentResponse {
  document: WorkspaceDocument;
  newVersion: DocumentVersionSummary | null;
}

/** POST /workspaces/:workspaceId/versions — create snapshot */
export interface CreateVersionPayload {
  label?: string;
}

/** POST /workspaces/:projectId — create new workspace */
export interface CreateWorkspacePayload {
  title: string;
}

// ─── API Response Envelopes ───────────────────────────────────

export interface ApiResponse<T> {
  data: T;
  message?: string;
}

// ─── Client-Side Document State ───────────────────────────────

/**
 * Represents the full document state managed on the client.
 * This is the single source of truth for the editor UI.
 */
export type SaveStatus = "idle" | "saving" | "saved" | "error";
export type LoadStatus = "idle" | "loading" | "loaded" | "error";

export interface DocumentState {
  // Identity
  workspaceId: string | null;
  projectId: string | null;

  // Content
  title: string;
  content: JSONContent | null;

  // Metadata
  version: number;
  wordCount: number;
  updatedAt: string | null;

  // UI state
  loadStatus: LoadStatus;
  saveStatus: SaveStatus;
  isDirty: boolean; // true when unsaved local changes exist

  // Version history
  versions: DocumentVersionSummary[];
  isVersionPanelOpen: boolean;
}

// ─── Import / Export ─────────────────────────────────────────

export type ExportFormat = "markdown" | "pdf";

export interface ImportMarkdownPayload {
  markdown: string;
}

/** Response from POST /workspaces/:workspaceId/import/markdown */
export interface ImportMarkdownResponse {
  document: WorkspaceDocument;
  newVersion: DocumentVersionSummary | null;
}
