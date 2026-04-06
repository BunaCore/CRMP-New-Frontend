/**
 * Backend → Frontend Permission Mapping
 *
 * Converts backend permission strings (e.g., "proposal:create") to frontend
 * canonical permission names (e.g., "PROJECT_CREATE").
 *
 * Used in the auth flow to normalize permissions before they reach the UI.
 */

/**
 * Mapping of backend permission strings to frontend canonical Permission names.
 * Backend permissions use lowercase with colons, e.g., "proposal:create"
 * Frontend permissions use uppercase with underscores, e.g., "PROJECT_CREATE"
 */
const BACKEND_TO_FRONTEND_PERMISSION_MAP: Record<string, string> = {
  // --- Proposal Core ---
  "proposal:create": "PROJECT_CREATE",
  "proposal:read": "PROJECT_VIEW",
  "proposal:update": "PROJECT_UPDATE",
  "proposal:delete": "PROJECT_DELETE",
  "proposal:submit": "PROJECT_SUBMIT",

  // --- Proposal Workflow (Decisions) ---
  "proposal:approve": "PROJECT_APPROVE",
  "proposal:reject": "PROJECT_REJECT",
  "proposal:request_revision": "PROJECT_REQUEST_REVISION",

  // --- Proposal Assignments ---
  "proposal:assign_advisor": "ADVISOR_ASSIGN",
  "proposal:assign_supervisor": "ADVISOR_ASSIGN", // Map supervisor to advisor for now
  "proposal:assign_evaluator": "EVALUATOR_ASSIGN",
  "proposal:add_member": "TEAM_MANAGE",
  "proposal:manage_members": "TEAM_MANAGE",

  // --- Project Core ---
  "project:create": "PROJECT_CREATE",
  "project:read": "PROJECT_VIEW",
  "project:update": "PROJECT_UPDATE",
  "project:delete": "PROJECT_DELETE",

  // --- Evaluation ---
  "evaluation:assign": "EVALUATOR_ASSIGN",
  "evaluation:submit": "EVALUATION_SCORE_SUBMIT",
  "evaluation:read": "PROJECT_VIEW",

  // --- Users ---
  "user:read": "USER_VIEW",
  "user:provision": "ADMIN_EDIT",
  "user:assign_role": "ADMIN_EDIT",

  // --- Roles & Permissions Management ---
  "role:create": "ADMIN_EDIT",
  "role:read": "ADMIN_VIEW",
  "role:update": "ADMIN_EDIT",
  "role:delete": "ADMIN_EDIT",
  "permission:assign": "ADMIN_EDIT",

  // --- Organization ---
  "department:create": "ADMIN_EDIT",
  "department:read": "ADMIN_VIEW",
  "department:update": "ADMIN_EDIT",
  "department:delete": "ADMIN_EDIT",

  "school:create": "ADMIN_EDIT",
  "school:read": "ADMIN_VIEW",
  "school:update": "ADMIN_EDIT",
  "school:delete": "ADMIN_EDIT",

  // --- Domain-Specific ---
  "ethics:read": "PROJECT_VIEW",
  "ethics:decide": "PROJECT_APPROVE",

  "budget:view": "BUDGET_VIEW",
  "budget:manage": "BUDGET_APPROVE", // Treat manage as approve for now

  // --- System & Platform ---
  "system:config": "ADMIN_EDIT",
  "audit_log:view": "ADMIN_VIEW",
  "report:export": "PROJECT_VIEW",
};

/**
 * Convert a backend permission string to a frontend canonical permission.
 * Returns null if the permission is not recognized.
 *
 * Example: "proposal:create" → "PROJECT_CREATE"
 */
export function mapBackendPermissionToFrontend(backendPermission: string): string | null {
  const normalized = backendPermission?.trim().toLowerCase();
  if (!normalized) return null;

  const mapped = BACKEND_TO_FRONTEND_PERMISSION_MAP[normalized];
  return mapped || null;
}

/**
 * Convert an array of backend permissions to frontend canonical permissions.
 * Filters out unrecognized permissions and deduplicates using a Set.
 */
export function mapBackendPermissionsToFrontend(backendPermissions: string[] | null | undefined): string[] {
  if (!backendPermissions?.length) return [];

  const mapped = new Set<string>();
  for (const perm of backendPermissions) {
    const frontendPerm = mapBackendPermissionToFrontend(perm);
    if (frontendPerm) {
      mapped.add(frontendPerm);
    }
  }

  return Array.from(mapped);
}
