import Link from "next/link";
import { ArrowLeft, RotateCcw } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { ScoreCard } from "@/components/interviews/ScoreCard";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { getReportById } from "@/data/mockInterviews";
import type { InterviewVerdict } from "@/types/interview";

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

type ReportPageProps = {
  params: Promise<{ id: string }>;
};

export default async function ReportPage({ params }: ReportPageProps) {
  const { id } = await params;
  const report = getReportById(id);

  if (!report) {
    return (
      <div className="mx-auto max-w-3xl">
        <Card padding="lg">
          <p className="text-[var(--text)]">Report not found.</p>
          <Link href="/history" className="mt-4 inline-block">
            <Button variant="secondary">Back to history</Button>
          </Link>
        </Card>
      </div>
    );
  }

  const verdict = verdictStyles[report.verdict];

  return (
    <div className="mx-auto max-w-5xl space-y-8">
      <PageHeader
        title="Interview Report"
        description={`${report.jobTitle} at ${report.company}`}
      />

      <Card
        padding="lg"
        className="border-[var(--primary-soft)] bg-gradient-to-br from-[var(--surface)] via-[var(--bg-soft)] to-[var(--surface-soft)]"
      >
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm uppercase tracking-wide text-[var(--accent)]">
              Overall score
            </p>
            <p className="mt-2 text-5xl font-bold text-[var(--text)]">
              {report.overallScore}
              <span className="text-2xl font-medium text-[var(--muted)]">
                /100
              </span>
            </p>
          </div>
          <span
            className={`inline-flex w-fit rounded-full px-4 py-2 text-sm font-semibold ${verdict.className}`}
          >
            {verdict.label}
          </span>
        </div>
      </Card>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <ScoreCard label="Technical" score={report.technical} />
        <ScoreCard label="Communication" score={report.communication} />
        <ScoreCard label="Problem Solving" score={report.problemSolving} />
        <ScoreCard label="Readiness" score={report.readiness} highlight />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card padding="lg" className="space-y-3">
          <h3 className="text-lg font-semibold text-[var(--text)]">Strengths</h3>
          <ul className="space-y-2">
            {report.strengths.map((item) => (
              <li
                key={item}
                className="text-sm text-[var(--text-soft)] before:mr-2 before:text-[var(--success)] before:content-['✓']"
              >
                {item}
              </li>
            ))}
          </ul>
        </Card>

        <Card padding="lg" className="space-y-3">
          <h3 className="text-lg font-semibold text-[var(--text)]">Weaknesses</h3>
          <ul className="space-y-2">
            {report.weaknesses.map((item) => (
              <li
                key={item}
                className="text-sm text-[var(--text-soft)] before:mr-2 before:text-[var(--warning)] before:content-['•']"
              >
                {item}
              </li>
            ))}
          </ul>
        </Card>

        <Card padding="lg" className="space-y-3">
          <h3 className="text-lg font-semibold text-[var(--text)]">
            Recommendations
          </h3>
          <ul className="space-y-2">
            {report.recommendations.map((item) => (
              <li
                key={item}
                className="text-sm text-[var(--text-soft)] before:mr-2 before:text-[var(--accent)] before:content-['→']"
              >
                {item}
              </li>
            ))}
          </ul>
        </Card>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row">
        <Link href="/start">
          <Button className="w-full sm:w-auto">
            <RotateCcw size={16} />
            Start another interview
          </Button>
        </Link>
        <Link href="/history">
          <Button variant="secondary" className="w-full sm:w-auto">
            <ArrowLeft size={16} />
            Back to history
          </Button>
        </Link>
      </div>
    </div>
  );
}
