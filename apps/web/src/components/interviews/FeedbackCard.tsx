import { FiZap } from "react-icons/fi";
import type { InterviewFeedback } from "@/types/interview";
import { Card } from "@/components/ui/Card";

type FeedbackCardProps = {
  feedback: InterviewFeedback;
};

export function FeedbackCard({ feedback }: FeedbackCardProps) {
  return (
    <Card padding="lg" className="space-y-4 border-[var(--accent-soft)]">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <FiZap size={18} className="text-[var(--accent)]" />
          <h3 className="text-lg font-semibold text-[var(--text)]">
            Mock Feedback
          </h3>
        </div>
        <span className="rounded-full bg-[var(--primary-soft)] px-3 py-1 text-sm font-semibold text-[var(--info-text)]">
          Score: {feedback.score}/100
        </span>
      </div>

      <p className="text-sm leading-relaxed text-[var(--text-soft)]">
        {feedback.summary}
      </p>

      <ul className="space-y-2">
        {feedback.tips.map((tip) => (
          <li
            key={tip}
            className="flex gap-2 text-sm text-[var(--muted)] before:mt-2 before:h-1.5 before:w-1.5 before:shrink-0 before:rounded-full before:bg-[var(--accent)] before:content-['']"
          >
            {tip}
          </li>
        ))}
      </ul>
    </Card>
  );
}
