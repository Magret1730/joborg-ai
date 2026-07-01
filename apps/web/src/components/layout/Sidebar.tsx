"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { PlanBadge, UserAvatar } from "@/components/auth/UserAvatar";
import { navItems, isNavItemActive } from "@/constants/navItems";
import { AppLogo } from "./PageHeader";

type SidebarProps = {
  onNavigate?: () => void;
};

export function Sidebar({ onNavigate }: SidebarProps) {
  const pathname = usePathname();
  const { user, isAuthenticated } = useAuth();

  return (
    <aside className="flex h-full flex-col border-r border-[var(--border)] bg-[var(--sidebar)]">
      <div className="border-b border-[var(--border)] px-5 py-6">
        <AppLogo />
      </div>

      <nav className="flex-1 space-y-1 px-3 py-5">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = isNavItemActive(pathname, item);

          return (
            <Link
              key={item.label}
              href={item.href}
              onClick={onNavigate}
              className={`flex items-center gap-3 rounded-[var(--radius-md)] px-3 py-2.5 text-sm font-medium transition ${
                active
                  ? "bg-[var(--primary)] text-white"
                  : "text-[var(--muted)] hover:bg-[var(--surface-hover)] hover:text-[var(--text)]"
              }`}
            >
              <Icon size={18} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-[var(--border)] p-4">
        {isAuthenticated && user ? (
          <div className="rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--surface)] p-3">
            <div className="flex items-center gap-3">
              <UserAvatar name={user.name} className="h-9 w-9 text-xs" />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-[var(--text)]">
                  {user.name}
                </p>
                <p className="truncate text-xs text-[var(--muted)]">
                  {user.email}
                </p>
              </div>
            </div>
            <div className="mt-3">
              <PlanBadge plan={user.plan} />
            </div>
          </div>
        ) : (
          <div className="rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--surface)] p-3">
            <p className="text-xs font-medium uppercase tracking-wide text-[var(--accent)]">
              Career ready
            </p>
            <p className="mt-1 text-sm text-[var(--text-soft)]">
              Practice interviews tailored to your target roles.
            </p>
            <Link
              href="/auth/login"
              onClick={onNavigate}
              className="mt-3 inline-block text-sm font-medium text-[var(--accent)] hover:underline"
            >
              Log in to save progress
            </Link>
          </div>
        )}
      </div>
    </aside>
  );
}
