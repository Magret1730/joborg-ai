import type { IconType } from "react-icons";
import {
  FiBarChart2,
  FiClock,
  FiGrid,
  FiMic,
} from "react-icons/fi";

export type NavItem = {
  label: string;
  href: string;
  icon: IconType;
};

export const navItems: NavItem[] = [
  {
    label: "Dashboard",
    href: "/dashboard",
    icon: FiGrid,
  },
  {
    label: "Start Interview",
    href: "/start",
    icon: FiMic,
  },
  {
    label: "History",
    href: "/history",
    icon: FiClock,
  },
  {
    label: "Reports",
    href: "/reports",
    icon: FiBarChart2,
  },
];

export function isNavItemActive(pathname: string, item: NavItem): boolean {
  if (item.label === "Reports") {
    return pathname === "/reports" || pathname.endsWith("/report");
  }

  return pathname === item.href;
}
