"use client";

import { FiMenu } from "react-icons/fi";
import { AuthNavActions } from "@/components/auth/AuthNavActions";
import { ThemeToggle } from "@/components/ui/ThemeToggle";

type NavbarProps = {
  title: string;
  subtitle?: string;
  onMenuClick?: () => void;
};

export function Navbar({ title, subtitle, onMenuClick }: NavbarProps) {
  return (
    <header className="sticky top-0 z-20 flex items-center justify-between gap-4 border-b border-[var(--border)] bg-[var(--header)]/95 px-4 py-4 backdrop-blur sm:px-6">
      <div className="flex min-w-0 items-center gap-3">
        <button
          type="button"
          onClick={onMenuClick}
          className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--card)] text-[var(--text)] transition hover:border-[var(--primary)] hover:text-[var(--primary)] lg:hidden"
          aria-label="Open navigation menu"
        >
          <FiMenu size={18} />
        </button>
        <div className="min-w-0">
          <h2 className="truncate text-lg font-semibold text-[var(--text)]">
            {title}
          </h2>
          {subtitle && (
            <p className="truncate text-sm text-[var(--muted)]">{subtitle}</p>
          )}
        </div>
      </div>

      <div className="flex shrink-0 items-center gap-3">
        <ThemeToggle />
        <AuthNavActions variant="app" />
      </div>
    </header>
  );
}
