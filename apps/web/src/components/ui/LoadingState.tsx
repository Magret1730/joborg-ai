import { Card } from "./Card";

type LoadingStateProps = {
  rows?: number;
  label?: string;
};

export function LoadingState({ rows = 3, label = "Loading..." }: LoadingStateProps) {
  return (
    <Card className="space-y-4" padding="md">
      <p className="text-sm text-[var(--muted)]">{label}</p>
      <div className="space-y-3">
        {Array.from({ length: rows }).map((_, index) => (
          <div
            key={index}
            className="h-4 animate-pulse rounded-[var(--radius-sm)] bg-[var(--surface-hover)]"
            style={{ width: `${100 - index * 12}%` }}
          />
        ))}
      </div>
    </Card>
  );
}

export function LoadingCardGrid({ count = 4 }: { count?: number }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {Array.from({ length: count }).map((_, index) => (
        <Card key={index} padding="md" className="space-y-3">
          <div className="h-3 w-24 animate-pulse rounded bg-[var(--surface-hover)]" />
          <div className="h-8 w-16 animate-pulse rounded bg-[var(--surface-hover)]" />
        </Card>
      ))}
    </div>
  );
}
