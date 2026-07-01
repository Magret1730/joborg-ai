import Link from "next/link";
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
};

export function InterviewHistoryTable({ interviews }: InterviewHistoryTableProps) {
  return (
    <>
      <div className="hidden overflow-hidden rounded-[var(--radius-lg)] border border-[var(--card-border)] md:block">
        <table className="w-full text-left text-sm">
          <thead className="bg-[var(--table-header)] text-[var(--muted)]">
            <tr>
              <th className="px-4 py-3 font-medium">Title</th>
              <th className="px-4 py-3 font-medium">Company</th>
              <th className="px-4 py-3 font-medium">Progress</th>
              <th className="px-4 py-3 font-medium">Score</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">Date</th>
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
                  <td className="px-4 py-4 text-[var(--text-soft)]">
                    {formatProgressLabel(
                      interview.answeredCount,
                      interview.questionCount,
                      interview.progressPercentage,
                    )}
                  </td>
                  <td className="px-4 py-4 text-[var(--text)]">
                    {interview.overallScore ?? "—"}
                  </td>
                  <td className="px-4 py-4">
                    <span
                      className={`rounded-full px-2.5 py-1 text-xs font-medium ${displayStatusStyles[displayStatus]}`}
                    >
                      {displayStatusLabels[displayStatus]}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-[var(--muted)]">
                    {formatDate(interview.createdAt)}
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex gap-2">
                      {interview.status === "completed" ? (
                        <Link
                          href={`/interview/${interview.id}/report`}
                          className="cursor-pointer"
                        >
                          <Button variant="secondary" className="px-3 py-1.5 text-xs">
                            View Report
                          </Button>
                        </Link>
                      ) : (
                        <Link
                          href={`/interview/${interview.id}`}
                          className="cursor-pointer"
                        >
                          <Button variant="secondary" className="px-3 py-1.5 text-xs">
                            {interview.readyForReport
                              ? "Review"
                              : interview.status === "draft"
                                ? "Continue"
                                : "View"}
                          </Button>
                        </Link>
                      )}
                    </div>
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
            <Card key={interview.id} padding="md" className="space-y-3">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-semibold text-[var(--text)]">
                    {interview.title}
                  </p>
                  <p className="text-sm text-[var(--muted)]">
                    {interview.companyName ?? "—"}
                  </p>
                </div>
                <span
                  className={`rounded-full px-2.5 py-1 text-xs font-medium ${displayStatusStyles[displayStatus]}`}
                >
                  {displayStatusLabels[displayStatus]}
                </span>
              </div>
              <div className="flex items-center justify-between text-sm text-[var(--muted)]">
                <span>
                  {formatProgressLabel(
                    interview.answeredCount,
                    interview.questionCount,
                    interview.progressPercentage,
                  )}
                </span>
                <span>Score: {interview.overallScore ?? "—"}</span>
              </div>
              <p className="text-xs text-[var(--muted)]">
                {formatDate(interview.createdAt)}
              </p>
              <Link
                href={
                  interview.status === "completed"
                    ? `/interview/${interview.id}/report`
                    : `/interview/${interview.id}`
                }
                className="cursor-pointer"
              >
                <Button variant="secondary" className="w-full">
                  {interview.status === "completed"
                    ? "View Report"
                    : interview.readyForReport
                      ? "Review"
                      : interview.status === "draft"
                        ? "Continue"
                        : "View"}
                </Button>
              </Link>
            </Card>
          );
        })}
      </div>
    </>
  );
}
