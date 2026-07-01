import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
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
      <div className="flex flex-wrap gap-2">
        {Array.from({ length: totalQuestions }).map((_, index) => {
          const isActive = index === currentIndex;
          const isAnswered = answeredIndexes.has(index);

          return (
            <button
              key={index}
              type="button"
              onClick={() => onSelect(index)}
              aria-label={`Go to question ${index + 1}`}
              aria-current={isActive ? "step" : undefined}
              className={`flex h-9 min-w-9 cursor-pointer items-center justify-center rounded-[var(--radius-md)] border px-3 text-sm font-medium transition disabled:cursor-not-allowed ${
                isActive
                  ? "border-[var(--primary)] bg-[var(--primary-soft)] text-[var(--primary)]"
                  : isAnswered
                    ? "border-[var(--accent)] bg-[var(--accent-soft)] text-[var(--accent)]"
                    : "border-[var(--border)] bg-[var(--surface)] text-[var(--muted)] hover:border-[var(--border-strong)] hover:text-[var(--text)]"
              }`}
            >
              {index + 1}
            </button>
          );
        })}
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:justify-between">
        <Button
          variant="secondary"
          onClick={onPrevious}
          disabled={isFirstQuestion}
          className="w-full sm:w-auto"
        >
          <FiChevronLeft size={16} />
          Previous
        </Button>
        <Button
          onClick={onNext}
          disabled={isLastQuestion}
          className="w-full sm:w-auto"
        >
          Next
          <FiChevronRight size={16} />
        </Button>
      </div>
    </Card>
  );
}
