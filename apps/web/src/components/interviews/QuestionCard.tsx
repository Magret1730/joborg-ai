import type { QuestionType } from "@/types/interview";
import { Card } from "@/components/ui/Card";

const typeStyles: Record<QuestionType | string, string> = {
  technical: "bg-[var(--info-soft)] text-[var(--info-text)]",
  behavioral: "bg-[var(--accent-soft)] text-[var(--accent)]",
  situational: "bg-[var(--warning-soft)] text-[var(--warning-text)]",
  problem_solving: "bg-[var(--warning-soft)] text-[var(--warning-text)]",
  communication: "bg-[var(--success-soft)] text-[var(--success-text)]",
  system_design: "bg-[var(--info-soft)] text-[var(--info-text)]",
};

type QuestionCardProps = {
  questionNumber: number;
  totalQuestions: number;
  type: QuestionType | string;
  question: string;
};

export function QuestionCard({
  questionNumber,
  totalQuestions,
  type,
  question,
}: QuestionCardProps) {
  const style =
    typeStyles[type] ?? "bg-[var(--surface-hover)] text-[var(--muted)]";

  return (
    <Card padding="lg" className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm font-medium text-[var(--muted)]">
          Question {questionNumber} of {totalQuestions}
        </p>
        <span
          className={`rounded-full px-3 py-1 text-xs font-semibold capitalize ${style}`}
        >
          {type.replace(/_/g, " ")}
        </span>
      </div>

      <div className="h-2 overflow-hidden rounded-full bg-[var(--surface-hover)]">
        <div
          className="h-full rounded-full bg-gradient-to-r from-[var(--primary)] to-[var(--accent)] transition-all"
          style={{ width: `${(questionNumber / totalQuestions) * 100}%` }}
        />
      </div>

      <h2 className="text-xl font-semibold leading-relaxed text-[var(--text)] sm:text-2xl">
        {question}
      </h2>
    </Card>
  );
}
