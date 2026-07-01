"use client";

import { InterviewActionsMenu } from "@/components/interviews/InterviewActionsMenu";
import { StatusBadge } from "@/components/interviews/StatusBadge";
import type { InterviewListItem } from "@/types/interview";
import { formatProgressLabel, getDisplayStatus } from "@/lib/interviewProgress";
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

export function InterviewHistoryTable({
  interviews,
  onDelete,
}: InterviewHistoryTableProps) {
  return (
    <>
      <div className="hidden overflow-x-auto rounded-[var(--radius-lg)] border border-[var(--card-border)] md:block">
        <table className="w-full min-w-[920px] text-left text-sm">
          <thead className="bg-[var(--table-header)] text-[var(--muted)]">
            <tr>
              <th className="px-4 py-3 font-medium">Title</th>
              <th className="px-4 py-3 font-medium">Company</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">Progress</th>
              <th className="px-4 py-3 font-medium">Score</th>
              <th className="px-4 py-3 font-medium">Created</th>
              <th className="px-4 py-3 font-medium">Updated</th>
              <th className="px-4 py-3 font-medium text-right">Actions</th>
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
                    <StatusBadge status={displayStatus} />
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
                  <td className="px-4 py-4 text-right">
                    <InterviewActionsMenu
                      interview={interview}
                      onDelete={onDelete}
                      align="right"
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
                <div className="min-w-0 flex-1">
                  <p className="font-semibold text-[var(--text)]">
                    {interview.title}
                  </p>
                  <p className="text-sm text-[var(--muted)]">
                    {interview.companyName ?? "—"}
                  </p>
                </div>
                <div className="flex shrink-0 items-start gap-2">
                  <StatusBadge status={displayStatus} />
                  <InterviewActionsMenu
                    interview={interview}
                    onDelete={onDelete}
                    align="right"
                  />
                </div>
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
            </Card>
          );
        })}
      </div>
    </>
  );
}
