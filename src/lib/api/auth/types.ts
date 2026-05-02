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
  | "Evaluator"
  | "DGC_MEMBER"
  | "PG_OFFICE";

// Full user profile returned from backend after login or /auth/me
export interface UserProfile {
  id: string;
  fullName: string;
  email: string;
  /**
   * User's assigned roles (e.g., "FACULTY", "COORDINATOR").
   * Deprecated in favor of permissions, but kept for reference.
   */
  roles?: string[];
  role?: string;
  department?: string | null;
  avatarUrl?: string;
  permissions?: string[];
  /**
   * Account status (e.g., "active", "inactive", "suspended").
   */
  accountStatus?: string;
  /**
   * Boolean flag sent from the backend to determine if user can access admin dashboard
   */
  canAccessAdmin?: boolean;
}

// ─── Request Shapes ─────────────────────────────────────────
export interface LoginCredentials {
  email: string;
  password: string;
}

// ─── Response Shapes ────────────────────────────────────────
export interface LoginResponse {
  access_token: string; // Normalized from backend's accessToken
  user: UserProfile;
}
