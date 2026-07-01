import { Card } from "@/components/ui/Card";
import { getScoreLevel, scoreLevelConfig } from "@/lib/scoreUtils";

type ScoreCardProps = {
  label: string;
  score: number;
  highlight?: boolean;
  showLevel?: boolean;
};

export function ScoreCard({
  label,
  score,
  highlight = false,
  showLevel = false,
}: ScoreCardProps) {
  const level = getScoreLevel(score);
  const config = scoreLevelConfig[level];

  return (
    <Card
      padding="md"
      className={`${
        highlight
          ? "border-[var(--primary-soft)] bg-[var(--surface-soft)]"
          : ""
      } ${showLevel ? "border-l-[3px] border-l-[var(--accent)]" : ""}`}
    >
      <p className="text-sm font-medium text-[var(--muted)]">{label}</p>
      <p
        className={`mt-2 text-3xl font-bold ${
          showLevel ? config.text : highlight ? "text-[var(--accent)]" : "text-[var(--text)]"
        }`}
      >
        {score}
        <span className="text-base font-medium text-[var(--muted)]">/100</span>
      </p>
      {showLevel && (
        <span
          className={`mt-3 inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${config.badge}`}
        >
          {config.label}
        </span>
      )}
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
