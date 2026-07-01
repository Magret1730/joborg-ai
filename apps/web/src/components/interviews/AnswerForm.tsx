import { FiCheckCircle, FiRotateCcw, FiSend } from "react-icons/fi";
import { TextArea } from "@heroui/react";
import { getScoreLevel, scoreLevelConfig } from "@/lib/scoreUtils";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Spinner } from "@/components/ui/Spinner";

type AnswerFormProps = {
  value: string;
  onChange: (value: string) => void;
  onClear: () => void;
  onSubmit: () => void;
  isSubmitting?: boolean;
  hasSavedAnswer?: boolean;
  savedScore?: number;
};

export function AnswerForm({
  value,
  onChange,
  onClear,
  onSubmit,
  isSubmitting = false,
  hasSavedAnswer = false,
  savedScore,
}: AnswerFormProps) {
  const characterCount = value.length;
  const isEmpty = !value.trim();
  const submitLabel = isSubmitting
    ? "Evaluating..."
    : hasSavedAnswer
      ? "Re-evaluate Answer"
      : "Submit Answer";

  const scoreLevel =
    savedScore !== undefined ? scoreLevelConfig[getScoreLevel(savedScore)] : null;

  return (
    <Card padding="lg" className="space-y-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="space-y-1">
          <label htmlFor="answer" className="text-sm font-medium text-[var(--text)]">
            Your answer
          </label>
          {hasSavedAnswer && (
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1 rounded-full bg-[var(--accent-soft)] px-2.5 py-1 text-xs font-medium text-[var(--accent)]">
                <FiCheckCircle size={12} aria-hidden="true" />
                Saved answer
              </span>
              {savedScore !== undefined && scoreLevel && (
                <span
                  className={`text-xs font-medium ${scoreLevel.text}`}
                  aria-label={`Last evaluated score ${savedScore} out of 100`}
                >
                  Last evaluated: {savedScore}/100
                </span>
              )}
            </div>
          )}
        </div>
        <span className="text-xs text-[var(--muted)]">{characterCount} characters</span>
      </div>

      <TextArea
        id="answer"
        fullWidth
        variant="secondary"
        placeholder="Structure your answer clearly. Include context, your approach, and the outcome where relevant..."
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="min-h-48 text-base leading-relaxed"
        disabled={isSubmitting}
        aria-describedby={isEmpty ? "answer-validation" : undefined}
      />

      {isEmpty && (
        <p id="answer-validation" className="text-xs text-[var(--muted)]">
          Enter your answer before submitting.
        </p>
      )}

      <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:justify-end">
        <Button
          variant="ghost"
          onClick={onClear}
          disabled={!value || isSubmitting}
          className="w-full cursor-pointer sm:w-auto"
          aria-label="Clear answer"
        >
          <FiRotateCcw size={16} />
          Clear answer
        </Button>
        <Button
          variant="secondary"
          onClick={onSubmit}
          disabled={isEmpty || isSubmitting}
          className="w-full cursor-pointer sm:w-auto"
          aria-label={submitLabel}
        >
          {isSubmitting ? (
            <>
              <Spinner size="sm" />
              Evaluating...
            </>
          ) : (
            <>
              <FiSend size={16} />
              {submitLabel}
            </>
          )}
        </Button>
      </div>
    </Card>
  );
}
