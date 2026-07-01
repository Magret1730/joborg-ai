import { Spinner } from "@/components/ui/Spinner";
import { Card } from "@/components/ui/Card";

export function FeedbackLoadingCard() {
  return (
    <Card
      padding="lg"
      className="min-h-[12rem] border-[var(--accent-soft)]"
      aria-live="polite"
      aria-busy="true"
    >
      <div className="flex flex-col items-center justify-center gap-3 py-8 text-center">
        <Spinner size="md" label="Evaluating answer" />
        <div className="space-y-1">
          <p className="text-sm font-medium text-[var(--text)]">
            Evaluating your answer
          </p>
          <p className="text-xs text-[var(--muted)]">
            Your answer is being reviewed...
          </p>
        </div>
      </div>
    </Card>
  );
}
