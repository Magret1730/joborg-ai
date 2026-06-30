import { Card } from "@/components/ui/Card";

type ScoreCardProps = {
  label: string;
  score: number;
  highlight?: boolean;
};

export function ScoreCard({ label, score, highlight = false }: ScoreCardProps) {
  return (
    <Card
      padding="md"
      className={highlight ? "border-[var(--primary)] bg-[var(--surface-soft)]" : ""}
    >
      <p className="text-sm text-[var(--muted)]">{label}</p>
      <p
        className={`mt-2 text-3xl font-bold ${
          highlight ? "text-[var(--accent)]" : "text-[var(--text)]"
        }`}
      >
        {score}
        <span className="text-base font-medium text-[var(--muted)]">/100</span>
      </p>
    </Card>
  );
}

type StatCardProps = {
  label: string;
  value: string | number;
  hint?: string;
};

export function StatCard({ label, value, hint }: StatCardProps) {
  return (
    <Card padding="md" hover>
      <p className="text-sm text-[var(--muted)]">{label}</p>
      <p className="mt-2 text-2xl font-bold text-[var(--text)]">{value}</p>
      {hint && <p className="mt-1 text-xs text-[var(--muted-light)]">{hint}</p>}
    </Card>
  );
}
