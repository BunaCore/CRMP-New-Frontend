import {
  BarChart,
  BookOpen,
  CheckSquare,
  Coins,
  FileText,
  Folder,
  Globe,
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
        title: "Public Projects",
        url: "/public/projects",
        icon: Globe,
        newTab: false,
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
        title: "Budget Requests",
        url: "/dashboard/researcher/budget",
        icon: Coins,
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
