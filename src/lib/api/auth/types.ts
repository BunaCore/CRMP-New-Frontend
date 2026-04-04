// ============================================================
// AUTH TYPES — Single source of truth for all role/user types.
// All components, stores, guards and nav configs import from here.
// ============================================================

export type UserRole =
  | "PI"
  | "RAD"
  | "RA"
  | "ADRPM"
  | "AC"
  | "VPRTT"
  | "Finance"
  | "Coordinator"
  | "Department"
  | "College/School"
  | "PGMO"
  | "Examiner/Evaluator"
  | "Advisor"
  | "Evaluator";

// Full user profile returned from backend after login or /auth/me
export interface UserProfile {
  id: string;
  fullName: string;
  email: string;
  /**
   * Backend may omit `role` and provide only `permissions`.
   * UI should treat this as optional (display-only).
   */
  role?: UserRole;
  department?: string;
  avatarUrl?: string;
  permissions?: string[];
}

// ─── Request Shapes ─────────────────────────────────────────
export interface LoginCredentials {
  email: string;
  password: string;
}

// ─── Response Shapes ────────────────────────────────────────
export interface LoginResponse {
  access_token: string;
  user: UserProfile;
}
