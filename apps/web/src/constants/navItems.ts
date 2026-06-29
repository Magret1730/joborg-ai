import {
  LayoutDashboard,
  Mic,
  History,
  FileBarChart,
  type LucideIcon,
} from "lucide-react";

export type NavItem = {
  label: string;
  href: string;
  icon: LucideIcon;
};

export const navItems: NavItem[] = [
  {
    label: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    label: "Start Interview",
    href: "/start",
    icon: Mic,
  },
  {
    label: "History",
    href: "/history",
    icon: History,
  },
  {
    label: "Reports",
    href: "/reports",
    icon: FileBarChart,
  },
];

export function isNavItemActive(pathname: string, item: NavItem): boolean {
  if (item.label === "Reports") {
    return pathname === "/reports" || pathname.endsWith("/report");
  }

  return pathname === item.href;
}
