import {
  Activity,
  BarChart,
  Bell,
  BookOpen,
  CheckSquare,
  Coins,
  FileText,
  FolderOpen,
  History,
  LayoutDashboard,
  type LucideIcon,
  MessageSquare,
  Settings,
  Users,
} from "lucide-react";

import { hasPermission } from "@/access-control/permission-gates";
import {
  ADMIN_SIDEBAR_PERMISSION_RULES,
  SIDEBAR_UNCONFIGURED_ROUTES_VISIBILITY,
} from "@/access-control/sidebar-permission-config";

export interface NavMainItem {
  title: string;
  url: string;
  icon: LucideIcon;
  subItems?: { title: string; url: string }[];
}

export interface NavGroup {
  id: number;
  label?: string;
  items: NavMainItem[];
}

export const adminSidebarItems: NavGroup[] = [
  {
    id: 1,
    label: "Main",
    items: [
      {
        title: "Dashboard",
        url: "/admin",
        icon: LayoutDashboard,
      },
      {
        title: "Projects",
        url: "/admin/projects",
        icon: FolderOpen,
      },
      {
        title: "Proposals",
        url: "/admin/proposals",
        icon: FileText,
      },
      {
        title: "Evaluations",
        url: "/admin/evaluations",
        icon: CheckSquare,
      },
      {
        title: "Progress",
        url: "/admin/progress",
        icon: Activity,
      },
    ],
  },
  {
    id: 2,
    label: "Management & Finance",
    items: [
      {
        title: "Budget Requests",
        url: "/admin/budget-requests",
        icon: Coins,
      },
      {
        title: "Requests",
        url: "/admin/requests",
        icon: MessageSquare,
      },
      {
        title: "Publications",
        url: "/admin/publications",
        icon: BookOpen,
      },
      {
        title: "Users & Roles",
        url: "/admin/users",
        icon: Users,
      },
    ],
  },
  {
    id: 3,
    label: "Insights & Settings",
    items: [
      {
        title: "Reports",
        url: "/admin/reports",
        icon: BarChart,
      },
      {
        title: "Notifications",
        url: "/admin/notifications",
        icon: Bell,
      },
      {
        title: "Audit Log",
        url: "/admin/audit",
        icon: History,
      },
      {
        title: "Settings",
        url: "/admin/settings",
        icon: Settings,
      },
    ],
  },
];

export function getAuthorizedAdminNavItems(permissions: string[] | null | undefined): NavGroup[] {
  const safePermissions = permissions ?? [];

  // PI space permission is `PROJECT_CREATE`. Admin sidebar should be hidden for PI users.
  // (The `/admin` routes themselves are protected by `AdminPermissionGuard`.)
  // if (hasPermission(safePermissions, "PROJECT_CREATE")) return [];

  // Determine if the user can see /admin/evaluations.
  // If yes, hide /admin/proposals — Evaluations already covers proposal management
  // and most of its features. The reverse is NOT enforced.
  const evalRequired = ADMIN_SIDEBAR_PERMISSION_RULES["/admin/evaluations"];
  const canSeeEvaluations = evalRequired
    ? evalRequired.some((p) => hasPermission(safePermissions, p))
    : SIDEBAR_UNCONFIGURED_ROUTES_VISIBILITY === "visible";

  return adminSidebarItems
    .map((group) => {
      const filteredItems = group.items.filter((item) => {
        // If the user has Evaluations access, suppress Proposals — it's redundant.
        // if (canSeeEvaluations && item.url === "/admin/proposals") return false;

        const required = ADMIN_SIDEBAR_PERMISSION_RULES[item.url];
        // Unknown routes visibility is configurable.
        if (!required || required.length === 0) {
          return SIDEBAR_UNCONFIGURED_ROUTES_VISIBILITY === "visible";
        }

        // Sidebar visibility uses OR semantics: show if the user has any required permission.
        return required.some((p) => hasPermission(safePermissions, p));
      });

      return {
        ...group,
        items: filteredItems,
      };
    })
    .filter((group) => group.items.length > 0);
}
