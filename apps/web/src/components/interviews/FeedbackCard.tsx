import {
  FiAlertCircle,
  FiCheckCircle,
  FiMessageCircle,
  FiTrendingUp,
  FiZap,
} from "react-icons/fi";
import type { AnswerFeedback } from "@/types/interview";
import { getScoreLevel, scoreLevelConfig } from "@/lib/scoreUtils";
import { Card } from "@/components/ui/Card";

type FeedbackCardProps = {
  score: number;
  feedback: AnswerFeedback;
};

function ScoreRing({
  score,
  shortFeedback,
}: {
  score: number;
  shortFeedback: string;
}) {
  const level = getScoreLevel(score);
  const config = scoreLevelConfig[level];

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
      <div
        className={`flex h-20 w-20 shrink-0 flex-col items-center justify-center rounded-full border-[3px] ${config.ring}`}
        aria-label={`Score ${score} out of 100, ${config.label}`}
      >
        <span className="text-2xl font-bold leading-none">{score}</span>
        <span className="mt-1 text-[10px] font-medium uppercase tracking-wide opacity-80">
          / 100
        </span>
      </div>
      <div className="space-y-2">
        <span
          className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${config.badge}`}
        >
          {config.label}
        </span>
        <p className="text-sm leading-relaxed text-[var(--text-soft)]">
          {shortFeedback}
        </p>
      </div>
    </div>
  );
}

export function FeedbackCard({ score, feedback }: FeedbackCardProps) {
  return (
    <Card
      padding="lg"
      className="space-y-6 border-[var(--accent-soft)]"
      aria-labelledby="feedback-heading"
    >
      <div className="flex items-center gap-2">
        <FiZap size={18} className="text-[var(--accent)]" aria-hidden="true" />
        <h3 id="feedback-heading" className="text-lg font-semibold text-[var(--text)]">
          AI Feedback
        </h3>
      </div>

      <ScoreRing score={score} shortFeedback={feedback.shortFeedback} />

      <div className="grid gap-4 sm:grid-cols-2">
        <section
          aria-labelledby="strengths-heading"
          className="rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--bg-soft)] p-4"
        >
          <div className="mb-3 flex items-center gap-2">
            <FiCheckCircle
              size={16}
              className="text-[var(--success-text)]"
              aria-hidden="true"
            />
            <h4
              id="strengths-heading"
              className="text-sm font-semibold text-[var(--success-text)]"
            >
              Strengths
            </h4>
          </div>
          <ul className="space-y-2">
            {feedback.strengths.map((item) => (
              <li
                key={item}
                className="flex gap-2 text-sm leading-relaxed text-[var(--text-soft)]"
              >
                <span
                  className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--success-text)]"
                  aria-hidden="true"
                />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </section>

        <section
          aria-labelledby="weaknesses-heading"
          className="rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--bg-soft)] p-4"
        >
          <div className="mb-3 flex items-center gap-2">
            <FiAlertCircle
              size={16}
              className="text-[var(--warning-text)]"
              aria-hidden="true"
            />
            <h4
              id="weaknesses-heading"
              className="text-sm font-semibold text-[var(--warning-text)]"
            >
              Areas to improve
            </h4>
          </div>
          <ul className="space-y-2">
            {feedback.weaknesses.map((item) => (
              <li
                key={item}
                className="flex gap-2 text-sm leading-relaxed text-[var(--text-soft)]"
              >
                <span
                  className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--warning-text)]"
                  aria-hidden="true"
                />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </section>
      </div>

      <section
        aria-labelledby="improved-answer-heading"
        className="rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--bg-soft)] p-4"
      >
        <div className="mb-3 flex items-center gap-2">
          <FiTrendingUp
            size={16}
            className="text-[var(--accent)]"
            aria-hidden="true"
          />
          <h4
            id="improved-answer-heading"
            className="text-sm font-semibold text-[var(--text)]"
          >
            Improved answer example
          </h4>
        </div>
        <p className="text-sm leading-relaxed text-[var(--text-soft)]">
          {feedback.improvedAnswer}
        </p>
      </section>

      <section
        aria-labelledby="follow-up-heading"
        className="rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--bg-soft)] p-4"
      >
        <div className="mb-3 flex items-center gap-2">
          <FiMessageCircle
            size={16}
            className="text-[var(--primary)]"
            aria-hidden="true"
          />
          <h4
            id="follow-up-heading"
            className="text-sm font-semibold text-[var(--text)]"
          >
            Follow-up question
          </h4>
        </div>
        <p className="text-sm leading-relaxed text-[var(--text-soft)]">
          {feedback.followUpQuestion}
        </p>
      </section>
    </Card>
  );
}
