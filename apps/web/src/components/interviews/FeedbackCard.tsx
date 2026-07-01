import { FiZap } from "react-icons/fi";
import type { AnswerFeedback } from "@/types/interview";
import { Card } from "@/components/ui/Card";

type FeedbackCardProps = {
  score: number;
  feedback: AnswerFeedback;
};

export function FeedbackCard({ score, feedback }: FeedbackCardProps) {
  return (
    <Card padding="lg" className="space-y-5 border-[var(--accent-soft)]">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <FiZap size={18} className="text-[var(--accent)]" />
          <h3 className="text-lg font-semibold text-[var(--text)]">
            AI Feedback
          </h3>
        </div>
        <span className="rounded-full bg-[var(--primary-soft)] px-3 py-1 text-sm font-semibold text-[var(--info-text)]">
          Score: {score}/100
        </span>
      </div>

      <p className="text-sm leading-relaxed text-[var(--text-soft)]">
        {feedback.shortFeedback}
      </p>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-[var(--success-text)]">
            Strengths
          </h4>
          <ul className="space-y-2">
            {feedback.strengths.map((item) => (
              <li
                key={item}
                className="flex gap-2 text-sm text-[var(--text-soft)] before:mt-2 before:h-1.5 before:w-1.5 before:shrink-0 before:rounded-full before:bg-[var(--success-text)] before:content-['']"
              >
                {item}
              </li>
            ))}
          </ul>
        </div>

        <div className="space-y-2">
          <h4 className="text-sm font-medium text-[var(--warning-text)]">
            Areas to improve
          </h4>
          <ul className="space-y-2">
            {feedback.weaknesses.map((item) => (
              <li
                key={item}
                className="flex gap-2 text-sm text-[var(--text-soft)] before:mt-2 before:h-1.5 before:w-1.5 before:shrink-0 before:rounded-full before:bg-[var(--warning-text)] before:content-['']"
              >
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="space-y-2 rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--bg-soft)] p-4">
        <h4 className="text-sm font-medium text-[var(--text)]">
          Improved answer example
        </h4>
        <p className="text-sm leading-relaxed text-[var(--text-soft)]">
          {feedback.improvedAnswer}
        </p>
      </div>

      <div className="space-y-2 rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--bg-soft)] p-4">
        <h4 className="text-sm font-medium text-[var(--text)]">
          Follow-up question
        </h4>
        <p className="text-sm leading-relaxed text-[var(--text-soft)]">
          {feedback.followUpQuestion}
        </p>
      </div>
    </Card>
  );
}
