import { FiRotateCcw, FiSend } from "react-icons/fi";
import { TextArea } from "@heroui/react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

type AnswerFormProps = {
  value: string;
  onChange: (value: string) => void;
  onClear: () => void;
  onSubmit: () => void;
};

export function AnswerForm({ value, onChange, onClear, onSubmit }: AnswerFormProps) {
  const characterCount = value.length;

  return (
    <Card padding="lg" className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <label htmlFor="answer" className="text-sm font-medium text-[var(--text)]">
          Your answer
        </label>
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
      />

      <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:justify-end">
        <Button
          variant="ghost"
          onClick={onClear}
          disabled={!value}
          className="w-full sm:w-auto"
        >
          <FiRotateCcw size={16} />
          Clear answer
        </Button>
        <Button
          variant="secondary"
          onClick={onSubmit}
          disabled={!value.trim()}
          className="w-full sm:w-auto"
        >
          <FiSend size={16} />
          Submit Answer
        </Button>
      </div>
    </Card>
  );
}
