import type { Permission } from "./permission-gates";

export type UnknownRouteVisibility = "hidden" | "visible";

/**
 * Sidebar visibility rules driven by backend permissions (NOT roles).
 *
 * Rule:
 * - When a sidebar item URL exists in this config:
 *   - it is visible only when the user has at least ONE of the required permissions (OR semantics).
 * - When a sidebar item URL is missing from this config:
 *   - behavior is controlled by `SIDEBAR_UNCONFIGURED_ROUTES_VISIBILITY`.
 */
export const SIDEBAR_UNCONFIGURED_ROUTES_VISIBILITY: UnknownRouteVisibility = "hidden";

export type SidebarPermissionRules = Partial<Record<string, Permission[]>>;

type SidebarModuleRule = {
  url: string;
  permissions: Permission[];
};

function toRules(modules: SidebarModuleRule[]): SidebarPermissionRules {
  return Object.fromEntries(modules.map((m) => [m.url, m.permissions]));
}

// -------------------------------
// Dashboard (PI space)
// -------------------------------
const DASHBOARD_MODULE_RULES: SidebarModuleRule[] = [
  // The dashboard layout is already guarded by `PROJECT_CREATE`.
  { url: "/dashboard", permissions: ["PROJECT_CREATE"] },

  { url: "/dashboard/projects", permissions: ["PROJECT_VIEW", "PROJECT_CREATE"] },
  { url: "/dashboard/proposals", permissions: ["PROJECT_SUBMIT", "PROJECT_VIEW"] },
  { url: "/dashboard/team", permissions: ["TEAM_VIEW", "TEAM_MANAGE"] },
  { url: "/dashboard/progress", permissions: ["FUNDED_VIEW", "FUNDED_SUBMIT"] },
  { url: "/dashboard/evaluations", permissions: ["FUNDED_EVALUATOR_ACCESS", "PROJECT_REVIEW"] },

  { url: "/dashboard/notifications", permissions: ["PROJECT_VIEW"] },
  { url: "/dashboard/publications", permissions: ["FUNDED_VIEW", "FUNDED_DECIDE"] },
  { url: "/dashboard/settings", permissions: ["PROJECT_VIEW"] },
];

export const DASHBOARD_SIDEBAR_PERMISSION_RULES: SidebarPermissionRules = toRules(DASHBOARD_MODULE_RULES);

// -------------------------------
// Admin (Admin space)
// -------------------------------
const ADMIN_MODULE_RULES: SidebarModuleRule[] = [
  // Main console overview
  { url: "/admin", permissions: ["ADMIN_VIEW", "USER_VIEW", "PROJECT_VIEW", "BUDGET_VIEW"] },

  { url: "/admin/projects", permissions: ["PROJECT_VIEW", "BUDGET_VIEW"] },
  { url: "/admin/proposals", permissions: ["PROJECT_REVIEW", "PROJECT_APPROVE", "PROJECT_REJECT"] },
  { url: "/admin/evaluations", permissions: ["EVALUATOR_ASSIGN"] },
  { url: "/admin/progress", permissions: ["FUNDED_VIEW", "FUNDED_SUBMIT"] },

  { url: "/admin/budget", permissions: ["BUDGET_VIEW", "BUDGET_APPROVE", "BUDGET_REJECT"] },
  { url: "/admin/requests", permissions: ["BUDGET_VIEW", "PROJECT_APPROVE", "PROJECT_REJECT", "FUNDED_VIEW"] },
  { url: "/admin/publications", permissions: ["FUNDED_RAD_ACCESS", "FUNDED_DECIDE", "FUNDED_VIEW"] },
  { url: "/admin/users", permissions: ["USER_VIEW", "ADMIN_EDIT"] },

  { url: "/admin/reports", permissions: ["PROJECT_VIEW", "ADMIN_VIEW"] },
  { url: "/admin/notifications", permissions: ["PROJECT_VIEW", "ADMIN_VIEW"] },
  { url: "/admin/audit", permissions: ["ADMIN_VIEW", "BUDGET_VIEW"] },
  { url: "/admin/settings", permissions: ["ADMIN_VIEW"] },
];

export const ADMIN_SIDEBAR_PERMISSION_RULES: SidebarPermissionRules = toRules(ADMIN_MODULE_RULES);

