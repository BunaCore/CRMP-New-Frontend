import {
  BarChart,
  Bell,
  BookOpen,
  CheckSquare,
  FileText,
  Folder,
  LayoutDashboard,
  type LucideIcon,
  Settings,
  Users,
} from "lucide-react";

export interface NavSubItem {
  title: string;
  url: string;
  icon?: LucideIcon;
  comingSoon?: boolean;
  newTab?: boolean;
  isNew?: boolean;
}

export interface NavMainItem {
  title: string;
  url: string;
  icon?: LucideIcon;
  subItems?: NavSubItem[];
  comingSoon?: boolean;
  newTab?: boolean;
  isNew?: boolean;
}

export interface NavGroup {
  id: number;
  label?: string;
  items: NavMainItem[];
}

export const sidebarItems: NavGroup[] = [
  {
    id: 1,
    label: "Main",
    items: [
      {
        title: "Dashboard",
        url: "/dashboard",
        icon: LayoutDashboard,
      },
      {
        title: "Projects",
        url: "/dashboard/projects",
        icon: Folder,
      },
      {
        title: "Proposals",
        url: "/dashboard/proposals",
        icon: FileText,
      },
      {
        title: "Team",
        url: "/dashboard/team",
        icon: Users,
      },
      {
        title: "Progress",
        url: "/dashboard/progress",
        icon: BarChart,
      },
      {
        title: "Evaluations",
        url: "/dashboard/evaluations",
        icon: CheckSquare,
      },
      {
        title: "Notifications",
        url: "/dashboard/notifications",
        icon: Bell,
      },
      {
        title: "Publications",
        url: "/dashboard/publications",
        icon: BookOpen,
      },
      {
        title: "Settings",
        url: "/dashboard/settings",
        icon: Settings,
      },
    ],
  },
];
