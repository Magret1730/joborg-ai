import type { ReactNode } from "react";
import { Inbox } from "lucide-react";
import { Button } from "./Button";

type EmptyStateProps = {
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  icon?: ReactNode;
};

export function EmptyState({
  title,
  description,
  actionLabel,
  onAction,
  icon,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center rounded-[var(--radius-lg)] border border-dashed border-[var(--border)] bg-[var(--surface-soft)] px-6 py-12 text-center">
      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[var(--neutral-soft)] text-[var(--accent)]">
        {icon ?? <Inbox size={22} />}
      </div>
      <h3 className="text-lg font-semibold text-[var(--text)]">{title}</h3>
      <p className="mt-2 max-w-md text-sm text-[var(--muted)]">{description}</p>
      {actionLabel && onAction && (
        <Button className="mt-6" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </div>
  );
}
