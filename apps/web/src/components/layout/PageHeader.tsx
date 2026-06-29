import Link from "next/link";
import { Sparkles } from "lucide-react";

type PageHeaderProps = {
  title: string;
  description?: string;
  action?: React.ReactNode;
};

export function PageHeader({ title, description, action }: PageHeaderProps) {
  return (
    <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <Sparkles size={18} className="text-[var(--accent)]" />
          <h1 className="text-2xl font-bold tracking-tight text-[var(--text)] sm:text-3xl">
            {title}
          </h1>
        </div>
        {description && (
          <p className="max-w-2xl text-sm text-[var(--muted)] sm:text-base">
            {description}
          </p>
        )}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}

export function AppLogo({ compact = false }: { compact?: boolean }) {
  return (
    <Link href="/" className="flex items-center gap-3">
      <div className="flex h-10 w-10 items-center justify-center rounded-[var(--radius-md)] bg-gradient-to-br from-[var(--primary)] to-[var(--accent)] text-sm font-bold text-white">
        JA
      </div>
      {!compact && (
        <div>
          <p className="text-sm font-semibold text-[var(--text)]">Joborg AI</p>
          <p className="text-xs text-[var(--muted)]">Interview Practice</p>
        </div>
      )}
    </Link>
  );
}
