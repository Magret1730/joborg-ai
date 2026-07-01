import Link from "next/link";
import { FiFileText, FiLock, FiUnlock } from "react-icons/fi";
import type { InterviewStatus } from "@/types/interview";
import {
  displayStatusStyles,
  getDisplayStatus,
  getReportUnlockMessage,
  getSessionStatusLabel,
} from "@/lib/interviewProgress";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

type InterviewSessionSidebarProps = {
  interviewId: string;
  title: string;
  companyName: string | null;
  status: InterviewStatus;
  totalQuestions: number;
  answeredCount: number;
  currentQuestionNumber: number;
  progressPercent: number;
  readyForReport: boolean;
  hasFinalReport: boolean;
  isGeneratingReport: boolean;
  onGenerateReport: () => void;
};

export function InterviewSessionSidebar({
  interviewId,
  title,
  companyName,
  status,
  totalQuestions,
  answeredCount,
  currentQuestionNumber,
  progressPercent,
  readyForReport,
  hasFinalReport,
  isGeneratingReport,
  onGenerateReport,
}: InterviewSessionSidebarProps) {
  const displayStatus = getDisplayStatus({ status, readyForReport });

  return (
    <Card padding="lg" className="space-y-6 lg:sticky lg:top-6">
      <div className="space-y-3">
        <p className="text-xs font-semibold uppercase tracking-wide text-[var(--accent)]">
          Interview session
        </p>
        <div>
          <h2 className="text-lg font-semibold text-[var(--text)]">{title}</h2>
          <p className="mt-1 text-sm text-[var(--muted)]">
            {companyName ?? "Company not specified"}
          </p>
        </div>
        <span
          className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${displayStatusStyles[displayStatus]}`}
        >
          {getSessionStatusLabel(status, readyForReport)}
        </span>
      </div>

      <div className="space-y-4 border-t border-[var(--border)] pt-5">
        <div className="rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--bg-soft)] p-4">
          <div className="flex items-baseline justify-between gap-2">
            <span className="text-sm text-[var(--muted)]">Questions answered</span>
            <span className="text-lg font-bold text-[var(--text)]">
              {answeredCount}
              <span className="text-sm font-normal text-[var(--muted)]">
                {" "}
                / {totalQuestions}
              </span>
            </span>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs text-[var(--muted)]">
            <span>Completion progress</span>
            <span className="font-semibold text-[var(--text)]">
              {progressPercent}%
            </span>
          </div>
          <div className="h-2.5 overflow-hidden rounded-full bg-[var(--surface-hover)]">
            <div
              className="h-full rounded-full bg-gradient-to-r from-[var(--primary)] to-[var(--accent)] transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        <div className="rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--bg-soft)] p-4 text-sm">
          <p className="text-[var(--muted)]">Current question</p>
          <p className="mt-1 font-medium text-[var(--text)]">
            Question {currentQuestionNumber} of {totalQuestions}
          </p>
        </div>
      </div>

      <div className="space-y-3 border-t border-[var(--border)] pt-5">
        <div className="flex items-start gap-3 rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--bg-soft)] p-4">
          {readyForReport ? (
            <FiUnlock size={18} className="mt-0.5 shrink-0 text-[var(--accent)]" />
          ) : (
            <FiLock size={18} className="mt-0.5 shrink-0 text-[var(--muted)]" />
          )}
          <p className="text-sm font-medium leading-relaxed text-[var(--text-soft)]">
            {getReportUnlockMessage(readyForReport)}
          </p>
        </div>

        {hasFinalReport ? (
          <Link
            href={`/interview/${interviewId}/report`}
            className="block w-full cursor-pointer"
          >
            <Button className="w-full">
              <FiFileText size={16} />
              View Report
            </Button>
          </Link>
        ) : (
          <Button
            disabled={!readyForReport || isGeneratingReport}
            onClick={onGenerateReport}
            className="w-full cursor-pointer"
            aria-label="Generate final report"
          >
            <FiFileText size={16} />
            {isGeneratingReport ? "Generating..." : "Generate Report"}
          </Button>
        )}
      </div>
    </Card>
  );
}
