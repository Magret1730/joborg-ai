"use client";

import Link from "next/link";
import {
  FiFileText,
  FiPlay,
  FiTrash2,
} from "react-icons/fi";
import { toast } from "react-toastify";
import type { InterviewListItem } from "@/types/interview";
import {
  displayStatusLabels,
  displayStatusStyles,
  formatProgressLabel,
  getDisplayStatus,
} from "@/lib/interviewProgress";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

function formatDate(date: string) {
  return new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

type InterviewHistoryTableProps = {
  interviews: InterviewListItem[];
  onDelete?: (interview: InterviewListItem) => void;
};

function InterviewActions({
  interview,
  onDelete,
  compact = false,
}: {
  interview: InterviewListItem;
  onDelete?: (interview: InterviewListItem) => void;
  compact?: boolean;
}) {
  const buttonClass = compact
    ? "w-full cursor-pointer sm:w-auto"
    : "cursor-pointer px-3 py-1.5 text-xs";

  const handleGenerateReport = () => {
    toast.info("Final report generation is coming in the next task.", {
      toastId: `generate-report-history-${interview.id}`,
    });
  };

  return (
    <div className={`flex flex-wrap gap-2 ${compact ? "flex-col sm:flex-row" : ""}`}>
      {interview.status === "completed" ? (
        <Link href={`/interview/${interview.id}/report`} className="cursor-pointer">
          <Button variant="secondary" className={buttonClass}>
            <FiFileText size={14} />
            View Report
          </Button>
        </Link>
      ) : (
        <Link href={`/interview/${interview.id}`} className="cursor-pointer">
          <Button variant="secondary" className={buttonClass}>
            <FiPlay size={14} />
            Continue Interview
          </Button>
        </Link>
      )}

      {interview.readyForReport && interview.status !== "completed" && (
        <Button
          variant="secondary"
          onClick={handleGenerateReport}
          className={buttonClass}
        >
          <FiFileText size={14} />
          Generate Report
        </Button>
      )}

      {onDelete && (
        <Button
          variant="ghost"
          onClick={() => onDelete(interview)}
          className={`${buttonClass} text-[var(--danger-text)] hover:bg-[var(--danger-soft)] hover:text-[var(--danger-text)]`}
          aria-label={`Delete ${interview.title}`}
        >
          <FiTrash2 size={14} />
          Delete
        </Button>
      )}
    </div>
  );
}

export function InterviewHistoryTable({
  interviews,
  onDelete,
}: InterviewHistoryTableProps) {
  return (
    <>
      <div className="hidden overflow-x-auto rounded-[var(--radius-lg)] border border-[var(--card-border)] md:block">
        <table className="w-full min-w-[960px] text-left text-sm">
          <thead className="bg-[var(--table-header)] text-[var(--muted)]">
            <tr>
              <th className="px-4 py-3 font-medium">Title</th>
              <th className="px-4 py-3 font-medium">Company</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">Progress</th>
              <th className="px-4 py-3 font-medium">Score</th>
              <th className="px-4 py-3 font-medium">Created</th>
              <th className="px-4 py-3 font-medium">Updated</th>
              <th className="px-4 py-3 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {interviews.map((interview) => {
              const displayStatus = getDisplayStatus(interview);

              return (
                <tr
                  key={interview.id}
                  className="border-t border-[var(--border)] bg-[var(--table-row)] transition hover:bg-[var(--table-row-hover)]"
                >
                  <td className="px-4 py-4 font-medium text-[var(--text)]">
                    {interview.title}
                  </td>
                  <td className="px-4 py-4 text-[var(--text-soft)]">
                    {interview.companyName ?? "—"}
                  </td>
                  <td className="px-4 py-4">
                    <span
                      className={`rounded-full px-2.5 py-1 text-xs font-medium ${displayStatusStyles[displayStatus]}`}
                    >
                      {displayStatusLabels[displayStatus]}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-[var(--text-soft)]">
                    <div className="space-y-1">
                      <p>{interview.progressPercentage}%</p>
                      <p className="text-xs text-[var(--muted)]">
                        {interview.answeredCount}/{interview.questionCount} answered
                      </p>
                    </div>
                  </td>
                  <td className="px-4 py-4 text-[var(--text)]">
                    {interview.overallScore ?? "—"}
                  </td>
                  <td className="px-4 py-4 text-[var(--muted)]">
                    {formatDate(interview.createdAt)}
                  </td>
                  <td className="px-4 py-4 text-[var(--muted)]">
                    {formatDate(interview.updatedAt)}
                  </td>
                  <td className="px-4 py-4">
                    <InterviewActions
                      interview={interview}
                      onDelete={onDelete}
                    />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="space-y-4 md:hidden">
        {interviews.map((interview) => {
          const displayStatus = getDisplayStatus(interview);

          return (
            <Card key={interview.id} padding="md" className="space-y-4">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="font-semibold text-[var(--text)]">
                    {interview.title}
                  </p>
                  <p className="text-sm text-[var(--muted)]">
                    {interview.companyName ?? "—"}
                  </p>
                </div>
                <span
                  className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-medium ${displayStatusStyles[displayStatus]}`}
                >
                  {displayStatusLabels[displayStatus]}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <p className="text-xs text-[var(--muted)]">Progress</p>
                  <p className="font-medium text-[var(--text)]">
                    {formatProgressLabel(
                      interview.answeredCount,
                      interview.questionCount,
                      interview.progressPercentage,
                    )}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-[var(--muted)]">Score</p>
                  <p className="font-medium text-[var(--text)]">
                    {interview.overallScore ?? "—"}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-[var(--muted)]">Created</p>
                  <p className="text-[var(--text-soft)]">
                    {formatDate(interview.createdAt)}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-[var(--muted)]">Updated</p>
                  <p className="text-[var(--text-soft)]">
                    {formatDate(interview.updatedAt)}
                  </p>
                </div>
              </div>

              <InterviewActions
                interview={interview}
                onDelete={onDelete}
                compact
              />
            </Card>
          );
        })}
      </div>
    </>
  );
}
