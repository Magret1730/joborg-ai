import Link from "next/link";
import type { InterviewListItem, InterviewStatus } from "@/types/interview";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

const statusStyles: Record<InterviewStatus, string> = {
  draft: "bg-[var(--surface-hover)] text-[var(--muted)]",
  completed: "bg-[var(--success-soft)] text-[var(--success-text)]",
  in_progress: "bg-[var(--info-soft)] text-[var(--info-text)]",
};

const statusLabels: Record<InterviewStatus, string> = {
  draft: "Draft",
  completed: "Completed",
  in_progress: "In Progress",
};

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
              <th className="px-4 py-3 font-medium">Score</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">Date</th>
              <th className="px-4 py-3 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {interviews.map((interview) => (
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
                <td className="px-4 py-4 text-[var(--text)]">
                  {interview.overallScore ?? "—"}
                </td>
                <td className="px-4 py-4">
                  <span
                    className={`rounded-full px-2.5 py-1 text-xs font-medium ${statusStyles[interview.status]}`}
                  >
                    {statusLabels[interview.status]}
                  </span>
                </td>
                <td className="px-4 py-4 text-[var(--muted)]">
                  {formatDate(interview.createdAt)}
                </td>
                <td className="px-4 py-4">
                  <div className="flex gap-2">
                    {interview.status === "completed" ? (
                      <Link href={`/interview/${interview.id}/report`}>
                        <Button variant="secondary" className="px-3 py-1.5 text-xs">
                          View Report
                        </Button>
                      </Link>
                    ) : (
                      <Link href={`/interview/${interview.id}`}>
                        <Button variant="secondary" className="px-3 py-1.5 text-xs">
                          {interview.status === "draft" ? "Continue" : "View"}
                        </Button>
                      </Link>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="space-y-4 md:hidden">
        {interviews.map((interview) => (
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
                className={`rounded-full px-2.5 py-1 text-xs font-medium ${statusStyles[interview.status]}`}
              >
                {statusLabels[interview.status]}
              </span>
            </div>
            <div className="flex items-center justify-between text-sm text-[var(--muted)]">
              <span>Score: {interview.overallScore ?? "—"}</span>
              <span>{formatDate(interview.createdAt)}</span>
            </div>
            <Link
              href={
                interview.status === "completed"
                  ? `/interview/${interview.id}/report`
                  : `/interview/${interview.id}`
              }
            >
              <Button variant="secondary" className="w-full">
                {interview.status === "completed"
                  ? "View Report"
                  : interview.status === "draft"
                    ? "Continue"
                    : "View"}
              </Button>
            </Link>
          </Card>
        ))}
      </div>
    </>
  );
}
