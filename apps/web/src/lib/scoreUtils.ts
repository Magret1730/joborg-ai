export type ScoreLevel = "excellent" | "good" | "needs_improvement" | "weak";

export function getScoreLevel(score: number): ScoreLevel {
  if (score >= 85) {
    return "excellent";
  }

  if (score >= 70) {
    return "good";
  }

  if (score >= 50) {
    return "needs_improvement";
  }

  return "weak";
}

export const scoreLevelConfig: Record<
  ScoreLevel,
  { label: string; ring: string; badge: string; text: string }
> = {
  excellent: {
    label: "Excellent",
    ring: "border-[var(--success-text)] text-[var(--success-text)]",
    badge: "bg-[var(--success-soft)] text-[var(--success-text)]",
    text: "text-[var(--success-text)]",
  },
  good: {
    label: "Good",
    ring: "border-[var(--info-text)] text-[var(--info-text)]",
    badge: "bg-[var(--info-soft)] text-[var(--info-text)]",
    text: "text-[var(--info-text)]",
  },
  needs_improvement: {
    label: "Needs improvement",
    ring: "border-[var(--warning-text)] text-[var(--warning-text)]",
    badge: "bg-[var(--warning-soft)] text-[var(--warning-text)]",
    text: "text-[var(--warning-text)]",
  },
  weak: {
    label: "Weak",
    ring: "border-[var(--danger-text)] text-[var(--danger-text)]",
    badge: "bg-[var(--danger-soft)] text-[var(--danger-text)]",
    text: "text-[var(--danger-text)]",
  },
};
