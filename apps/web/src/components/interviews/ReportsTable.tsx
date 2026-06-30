import Link from "next/link";
import type { InterviewVerdict } from "@/types/interview";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

const verdictStyles: Record<
  InterviewVerdict,
  { label: string; className: string }
> = {
  ready: {
    label: "Interview Ready",
    className: "bg-[var(--success-soft)] text-[var(--success-text)]",
  },
  almost_ready: {
    label: "Almost Ready",
    className: "bg-[var(--info-soft)] text-[var(--info-text)]",
  },
  needs_practice: {
    label: "Needs Practice",
    className: "bg-[var(--warning-soft)] text-[var(--warning-text)]",
  },
};

function formatDate(date: string) {
  if (!date) {
    return "—";
  }

  return new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

type ReportRow = {
  id: string;
  jobTitle: string;
  company: string;
  overallScore: number;
  verdict: InterviewVerdict;
  date: string;
};

type ReportsTableProps = {
  reports: ReportRow[];
};

export function ReportsTable({ reports }: ReportsTableProps) {
  return (
    <>
      <div className="hidden overflow-hidden rounded-[var(--radius-lg)] border border-[var(--card-border)] md:block">
        <table className="w-full text-left text-sm">
          <thead className="bg-[var(--table-header)] text-[var(--muted)]">
            <tr>
              <th className="px-4 py-3 font-medium">Interview title</th>
              <th className="px-4 py-3 font-medium">Company</th>
              <th className="px-4 py-3 font-medium">Overall score</th>
              <th className="px-4 py-3 font-medium">Verdict</th>
              <th className="px-4 py-3 font-medium">Date</th>
              <th className="px-4 py-3 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {reports.map((report) => {
              const verdict = verdictStyles[report.verdict];

              return (
                <tr
                  key={report.id}
                  className="border-t border-[var(--border)] bg-[var(--table-row)] transition hover:bg-[var(--table-row-hover)]"
                >
                  <td className="px-4 py-4 font-medium text-[var(--text)]">
                    {report.jobTitle}
                  </td>
                  <td className="px-4 py-4 text-[var(--text-soft)]">
                    {report.company}
                  </td>
                  <td className="px-4 py-4 font-semibold text-[var(--text)]">
                    {report.overallScore}/100
                  </td>
                  <td className="px-4 py-4">
                    <span
                      className={`rounded-full px-2.5 py-1 text-xs font-medium ${verdict.className}`}
                    >
                      {verdict.label}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-[var(--muted)]">
                    {formatDate(report.date)}
                  </td>
                  <td className="px-4 py-4">
                    <Link href={`/interview/${report.id}/report`}>
                      <Button variant="secondary" className="px-3 py-1.5 text-xs">
                        View report
                      </Button>
                    </Link>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="space-y-4 md:hidden">
        {reports.map((report) => {
          const verdict = verdictStyles[report.verdict];

          return (
            <Card key={report.id} padding="md" className="space-y-3">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-semibold text-[var(--text)]">
                    {report.jobTitle}
                  </p>
                  <p className="text-sm text-[var(--muted)]">{report.company}</p>
                </div>
                <span className="text-sm font-semibold text-[var(--accent)]">
                  {report.overallScore}/100
                </span>
              </div>
              <div className="flex items-center justify-between gap-3">
                <span
                  className={`rounded-full px-2.5 py-1 text-xs font-medium ${verdict.className}`}
                >
                  {verdict.label}
                </span>
                <span className="text-sm text-[var(--muted)]">
                  {formatDate(report.date)}
                </span>
              </div>
              <Link href={`/interview/${report.id}/report`}>
                <Button variant="secondary" className="w-full">
                  View report
                </Button>
              </Link>
            </Card>
          );
        })}
      </div>
    </>
  );
}
