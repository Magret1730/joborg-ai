"use client";

import { Menu } from "lucide-react";
import { ThemeToggle } from "@/components/ui/ThemeToggle";

type NavbarProps = {
  title: string;
  subtitle?: string;
  onMenuClick?: () => void;
};

export function Navbar({ title, subtitle, onMenuClick }: NavbarProps) {
  return (
    <header className="sticky top-0 z-20 flex items-center justify-between border-b border-[var(--border)] bg-[var(--header)]/95 px-4 py-4 backdrop-blur sm:px-6">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onMenuClick}
          className="inline-flex h-10 w-10 items-center justify-center rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--card)] text-[var(--text)] transition hover:border-[var(--primary)] hover:text-[var(--primary)] lg:hidden"
          aria-label="Open navigation menu"
        >
          <Menu size={18} />
        </button>
        <div>
          <h2 className="text-lg font-semibold text-[var(--text)]">{title}</h2>
          {subtitle && (
            <p className="text-sm text-[var(--muted)]">{subtitle}</p>
          )}
        </div>
      </div>

      <div className="flex items-center gap-3">
        <ThemeToggle />
        <div className="hidden text-right sm:block">
          <p className="text-sm font-medium text-[var(--text)]">Alex Morgan</p>
          <p className="text-xs text-[var(--muted)]">alex@example.com</p>
        </div>
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--primary)] text-sm font-semibold text-white">
          AM
        </div>
      </div>
    </header>
  );
}
