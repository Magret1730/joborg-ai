import { FiCheck, FiChevronLeft, FiChevronRight, FiCircle } from "react-icons/fi";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

type QuestionNavigatorProps = {
  totalQuestions: number;
  currentIndex: number;
  answeredIndexes: Set<number>;
  onPrevious: () => void;
  onNext: () => void;
  onSelect: (index: number) => void;
};

function getIndicatorTitle(index: number, isActive: boolean, isAnswered: boolean) {
  if (isActive && isAnswered) {
    return `Question ${index + 1} (current, answered)`;
  }

  if (isActive) {
    return `Question ${index + 1} (current)`;
  }

  if (isAnswered) {
    return `Question ${index + 1} (answered)`;
  }

  return `Question ${index + 1} (unanswered)`;
}

export function QuestionNavigator({
  totalQuestions,
  currentIndex,
  answeredIndexes,
  onPrevious,
  onNext,
  onSelect,
}: QuestionNavigatorProps) {
  const isFirstQuestion = currentIndex === 0;
  const isLastQuestion = currentIndex === totalQuestions - 1;

  return (
    <Card padding="md" className="space-y-4">
      <div className="flex flex-wrap gap-2 overflow-x-auto pb-1">
        {Array.from({ length: totalQuestions }).map((_, index) => {
          const isActive = index === currentIndex;
          const isAnswered = answeredIndexes.has(index);
          const title = getIndicatorTitle(index, isActive, isAnswered);

          return (
            <button
              key={index}
              type="button"
              onClick={() => onSelect(index)}
              title={title}
              aria-label={title}
              aria-current={isActive ? "step" : undefined}
              className={`flex h-9 min-w-9 cursor-pointer items-center justify-center gap-1 rounded-[var(--radius-md)] border px-3 text-sm font-medium transition ${
                isActive
                  ? "border-[var(--primary)] bg-[var(--primary-soft)] text-[var(--primary)] ring-2 ring-[var(--primary)]/20"
                  : isAnswered
                    ? "border-[var(--accent)] bg-[var(--accent-soft)] text-[var(--accent)]"
                    : "border-[var(--border)] bg-[var(--surface)] text-[var(--muted)] hover:border-[var(--border-strong)] hover:text-[var(--text)]"
              }`}
            >
              {isAnswered && !isActive ? (
                <FiCheck size={14} aria-hidden="true" />
              ) : null}
              <span>{index + 1}</span>
            </button>
          );
        })}
      </div>

      <div className="flex items-center gap-3 text-xs text-[var(--muted)]">
        <span className="inline-flex items-center gap-1">
          <span className="h-2.5 w-2.5 rounded-full border-2 border-[var(--primary)] bg-[var(--primary-soft)]" />
          Current
        </span>
        <span className="inline-flex items-center gap-1">
          <FiCheck size={12} className="text-[var(--accent)]" />
          Answered
        </span>
        <span className="inline-flex items-center gap-1">
          <FiCircle size={10} />
          Unanswered
        </span>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:justify-between">
        <Button
          variant="secondary"
          onClick={onPrevious}
          disabled={isFirstQuestion}
          className="w-full cursor-pointer sm:w-auto"
          aria-label="Go to previous question"
        >
          <FiChevronLeft size={16} />
          Previous
        </Button>
        <Button
          onClick={onNext}
          disabled={isLastQuestion}
          className="w-full cursor-pointer sm:w-auto"
          aria-label="Go to next question"
        >
          Next
          <FiChevronRight size={16} />
        </Button>
      </div>
    </Card>
  );
}
