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
    href: "/",
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
    href: "/history",
    icon: FileBarChart,
  },
];

export function isNavItemActive(pathname: string, item: NavItem): boolean {
  if (item.label === "Dashboard") {
    return pathname === "/";
  }

  if (item.label === "Start Interview") {
    return pathname === "/start";
  }

  if (item.label === "History") {
    return pathname === "/history";
  }

  if (item.label === "Reports") {
    return pathname.includes("/report");
  }

  return pathname.startsWith(item.href);
}
