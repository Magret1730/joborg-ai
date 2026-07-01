import Link from "next/link";
import { FiArrowLeft, FiRotateCcw } from "react-icons/fi";
import { ScoreCard } from "@/components/interviews/ScoreCard";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { getFinalReportVerdictStyle } from "@/lib/finalReport";
import type { FinalReportResponse } from "@/types/interview";

type FinalReportViewProps = {
  title: string;
  companyName: string | null;
  report: FinalReportResponse;
};

export function FinalReportView({
  title,
  companyName,
  report,
}: FinalReportViewProps) {
  const verdict = getFinalReportVerdictStyle(report.verdict);

  return (
    <div className="space-y-8">
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
            <p className="mt-2 text-sm text-[var(--muted)]">
              {title}
              {companyName ? ` at ${companyName}` : ""}
            </p>
          </div>
          <span
            className={`inline-flex w-fit rounded-full px-4 py-2 text-sm font-semibold ${verdict.className}`}
          >
            {verdict.label}
          </span>
        </div>
      </Card>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <ScoreCard label="Technical" score={report.technicalScore} />
        <ScoreCard label="Communication" score={report.communicationScore} />
        <ScoreCard label="Readiness" score={report.readinessScore} highlight />
      </div>

      <Card padding="lg" className="space-y-3">
        <h3 className="text-lg font-semibold text-[var(--text)]">Summary</h3>
        <p className="text-sm leading-relaxed text-[var(--text-soft)]">
          {report.summary}
        </p>
      </Card>

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
            <FiRotateCcw size={16} />
            Start another interview
          </Button>
        </Link>
        <Link href="/history">
          <Button variant="secondary" className="w-full sm:w-auto">
            <FiArrowLeft size={16} />
            Back to history
          </Button>
        </Link>
      </div>
    </div>
  );
}
