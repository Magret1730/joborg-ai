"use client";

import { useState } from "react";
import { FiChevronDown, FiChevronUp, FiZap } from "react-icons/fi";
import type { QuestionType } from "@/types/interview";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

const typeStyles: Record<QuestionType | string, string> = {
  technical: "bg-[var(--info-soft)] text-[var(--info-text)]",
  behavioral: "bg-[var(--accent-soft)] text-[var(--accent)]",
  situational: "bg-[var(--warning-soft)] text-[var(--warning-text)]",
  problem_solving: "bg-[var(--warning-soft)] text-[var(--warning-text)]",
  communication: "bg-[var(--success-soft)] text-[var(--success-text)]",
  system_design: "bg-[var(--info-soft)] text-[var(--info-text)]",
};

const difficultyStyles: Record<string, string> = {
  easy: "bg-[var(--success-soft)] text-[var(--success-text)]",
  medium: "bg-[var(--warning-soft)] text-[var(--warning-text)]",
  hard: "bg-[var(--danger-soft)] text-[var(--danger-text)]",
};

type QuestionCardProps = {
  questionNumber: number;
  totalQuestions: number;
  type: QuestionType | string;
  difficulty?: string;
  question: string;
  goodAnswerHints?: string[];
  progressPercent: number;
};

export function QuestionCard({
  questionNumber,
  totalQuestions,
  type,
  difficulty,
  question,
  goodAnswerHints = [],
  progressPercent,
}: QuestionCardProps) {
  const [showHints, setShowHints] = useState(false);
  const typeStyle =
    typeStyles[type] ?? "bg-[var(--surface-hover)] text-[var(--muted)]";
  const difficultyStyle =
    difficultyStyles[difficulty ?? ""] ??
    "bg-[var(--surface-hover)] text-[var(--muted)]";

  return (
    <Card padding="lg" className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm font-medium text-[var(--muted)]">
          Question {questionNumber} of {totalQuestions}
        </p>
        <div className="flex flex-wrap items-center gap-2">
          {difficulty && (
            <span
              className={`rounded-full px-3 py-1 text-xs font-semibold capitalize ${difficultyStyle}`}
            >
              {difficulty}
            </span>
          )}
          <span
            className={`rounded-full px-3 py-1 text-xs font-semibold capitalize ${typeStyle}`}
          >
            {type.replace(/_/g, " ")}
          </span>
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs text-[var(--muted)]">
          <span>Session progress</span>
          <span>{progressPercent}%</span>
        </div>
        <div className="h-2 overflow-hidden rounded-full bg-[var(--surface-hover)]">
          <div
            className="h-full rounded-full bg-gradient-to-r from-[var(--primary)] to-[var(--accent)] transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      <h2 className="text-xl font-semibold leading-relaxed text-[var(--text)] sm:text-2xl">
        {question}
      </h2>

      {goodAnswerHints.length > 0 && (
        <div className="space-y-3">
          <Button
            variant="ghost"
            onClick={() => setShowHints((previous) => !previous)}
            className="px-0 text-[var(--accent)] hover:bg-transparent hover:text-[var(--accent-hover)]"
          >
            {showHints ? (
              <>
                <FiChevronUp size={16} />
                Hide hints
              </>
            ) : (
              <>
                <FiChevronDown size={16} />
                Show hints
              </>
            )}
          </Button>

          {showHints && (
            <div className="rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--bg-soft)] p-4">
              <div className="mb-3 flex items-center gap-2 text-sm font-medium text-[var(--accent)]">
                <FiZap size={16} />
                Good answer hints
              </div>
              <ul className="space-y-2 text-sm leading-relaxed text-[var(--text-soft)]">
                {goodAnswerHints.map((hint) => (
                  <li key={hint} className="flex gap-2">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--accent)]" />
                    <span>{hint}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </Card>
  );
}
