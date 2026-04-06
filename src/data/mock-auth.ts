// ============================================================
// MOCK AUTH DATA
// Returns realistic mock users based on email.
//
// TO SWITCH TO REAL BACKEND:
//   Open mutations.ts → set USE_MOCK = false
//   This file is then unused automatically.
// ============================================================

import type { LoginResponse } from "@/lib/api/auth/types";

const MOCK_USERS: Record<string, LoginResponse> = {
  "pi@crmp.edu": {
    access_token: "mock_token_pi_abc123",
    user: {
      id: "usr_001",
      fullName: "Dr. Abebe Girma",
      email: "pi@crmp.edu",
      role: "PI",
      department: "Computer Science",
      avatarUrl: "",
      permissions: ["create_proposal", "submit_for_review", "manage_team"],
    },
  },
  "rad@crmp.edu": {
    access_token: "mock_token_rad_def456",
    user: {
      id: "usr_002",
      fullName: "Ato Bekele Tadesse",
      email: "rad@crmp.edu",
      role: "RAD",
      department: "Research Administration",
      avatarUrl: "",
      permissions: [
        "approve_proposal",
        "assign_evaluator",
        "manage_users",
        "approve_budget",
        "ADVISOR_ASSIGN",
        "EVALUATION_SCORE_SUBMIT",
      ],
    },
  },
  "finance@crmp.edu": {
    access_token: "mock_token_finance_ghi789",
    user: {
      id: "usr_003",
      fullName: "W/ro Tigist Haile",
      email: "finance@crmp.edu",
      role: "Finance",
      department: "Finance & Budget Office",
      avatarUrl: "",
      permissions: ["view_budget", "approve_budget", "release_funds"],
    },
  },
  "coordinator@crmp.edu": {
    access_token: "mock_token_coord_jkl012",
    user: {
      id: "usr_004",
      fullName: "Ato Yonas Alemu",
      email: "coordinator@crmp.edu",
      role: "Coordinator",
      department: "Research Coordination Office",
      avatarUrl: "",
      // Coordinator is an admin-space user: full access to /admin, no access to /dashboard (PI space).
      // Important: DO NOT include `PROJECT_CREATE` here, otherwise the user will be treated as PI and redirected to /dashboard.
      permissions: [
        "ADMIN_VIEW",
        "ADMIN_EDIT",
        "USER_VIEW",

        "PROJECT_VIEW",
        "PROJECT_REVIEW",
        "PROJECT_APPROVE",
        "PROJECT_REJECT",
        "EVALUATOR_ASSIGN",
        "ADVISOR_ASSIGN",
        "EVALUATION_SCORE_SUBMIT",
        "DEFENCE_SCHEDULE",
      ],
    },
  },
  "advisor@crmp.edu": {
    access_token: "mock_token_adv_555666",
    user: {
      id: "usr_005",
      fullName: "Prof. Dinku Mekonnen",
      email: "advisor@crmp.edu",
      role: "Advisor",
      department: "Research Advisory Board",
      avatarUrl: "",
      permissions: [
        "ADMIN_VIEW",
        "PROJECT_VIEW",
        "PROJECT_RECOMMEND",

        "PROJECT_VIEW",
        "PROJECT_REVIEW",
      ],
    },
  },
  "evaluator@crmp.edu": {
    access_token: "mock_token_eval_777888",
    user: {
      id: "usr_006",
      fullName: "Dr. Selamawit Bekele",
      email: "evaluator@crmp.edu",
      role: "Evaluator",
      department: "Internal Evaluation Committee",
      avatarUrl: "",
      permissions: [
        "ADMIN_VIEW",
        "EVALUATION_SCORE_SUBMIT",
        "PROJECT_APPROVE",
        "PROJECT_REJECT",
        "EVALUATION_SCORE_SUBMIT",
      ],
    },
  },
  "dgc@crmp.edu": {
    access_token: "mock_token_dgc_aabbcc",
    user: {
      id: "usr_007",
      fullName: "Prof. Mulugeta Assefa",
      email: "dgc@crmp.edu",
      role: "DGC_MEMBER",
      department: "Directorate of Graduate Studies",
      avatarUrl: "",
      // DGC Member: reviews, approves/rejects proposals, assigns evaluators/advisors,
      // submits evaluation scores, schedules defence, and has budget visibility.
      permissions: [
        "PROJECT_VIEW",
        "PROJECT_REVIEW",
        "PROJECT_APPROVE",
        "PROJECT_REJECT",
        "EVALUATOR_ASSIGN",
        "ADVISOR_ASSIGN",
        "BUDGET_VIEW",
        "BUDGET_APPROVE",
        "BUDGET_REJECT",
        "EVALUATION_SCORE_SUBMIT",
        "DEFENCE_SCHEDULE",
      ],
    },
  },
  "pgoffice@crmp.edu": {
    access_token: "mock_token_pgoffice_ddeeff",
    user: {
      id: "usr_008",
      fullName: "Ato Girma Tadele",
      email: "pgoffice@crmp.edu",
      role: "PG_OFFICE",
      department: "Postgraduate Office",
      avatarUrl: "",
      // PG Office: approves/rejects proposals and budgets, has full admin view.
      // Does NOT have PROJECT_CREATE — stays in /admin space.
      permissions: [
        "PROJECT_VIEW",
        "PROJECT_APPROVE",
        "PROJECT_REJECT",
        "BUDGET_VIEW",
        "BUDGET_APPROVE",
        "BUDGET_REJECT",
        "ADMIN_VIEW",
      ],
    },
  },
};

const DEFAULT_MOCK: LoginResponse = {
  access_token: "mock_token_default_xyz",
  user: {
    id: "usr_999",
    fullName: "Test User",
    email: "test@crmp.edu",
    role: "PI",
    department: "General",
    avatarUrl: "",
    permissions: ["create_proposal"],
  },
};

/** Returns a mock successful login response for the given email (~600ms simulated delay). */
export async function getMockLoginResponse(email: string): Promise<LoginResponse> {
  await new Promise((resolve) => setTimeout(resolve, 600));
  return MOCK_USERS[email.toLowerCase()] ?? DEFAULT_MOCK;
}
