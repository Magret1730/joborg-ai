"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import {
  FiAlertCircle,
  FiArrowLeft,
  FiBookOpen,
  FiCheckCircle,
  FiCopy,
  FiFileText,
  FiLock,
  FiRotateCcw,
  FiTarget,
  FiTrendingUp,
} from "react-icons/fi";
import { toast } from "react-toastify";
import { ScoreCard } from "@/components/interviews/ScoreCard";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import {
  formatReportClipboardSummary,
  formatReportCompletedDate,
  getFinalReportVerdictStyle,
} from "@/lib/finalReport";
import { getScoreLevel, scoreLevelConfig } from "@/lib/scoreUtils";
import type { FinalReportResponse } from "@/types/interview";

type FinalReportViewProps = {
  interviewId: string;
  title: string;
  companyName: string | null;
  completedAt: string;
  report: FinalReportResponse;
};

type ReportSectionProps = {
  title: string;
  icon: React.ReactNode;
  iconClassName: string;
  children: ReactNode;
};

function ReportSection({
  title,
  icon,
  iconClassName,
  children,
}: ReportSectionProps) {
  return (
    <Card padding="lg" className="space-y-4">
      <div className="flex items-center gap-2.5">
        <span
          className={`inline-flex h-9 w-9 items-center justify-center rounded-[var(--radius-md)] ${iconClassName}`}
        >
          {icon}
        </span>
        <h3 className="text-lg font-semibold text-[var(--text)]">{title}</h3>
      </div>
      {children}
    </Card>
  );
}

function ReportListItem({
  children,
  markerClassName,
}: {
  children: ReactNode;
  markerClassName: string;
}) {
  return (
    <li className="flex gap-3 text-sm leading-relaxed text-[var(--text-soft)]">
      <span
        className={`mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full ${markerClassName}`}
        aria-hidden="true"
      />
      <span>{children}</span>
    </li>
  );
}

export function FinalReportView({
  interviewId,
  title,
  companyName,
  completedAt,
  report,
}: FinalReportViewProps) {
  const verdict = getFinalReportVerdictStyle(report.verdict);
  const overallLevel = getScoreLevel(report.overallScore);
  const overallConfig = scoreLevelConfig[overallLevel];

  const handleCopySummary = async () => {
    const text = formatReportClipboardSummary({ title, companyName, report });

    try {
      await navigator.clipboard.writeText(text);
      toast.success("Summary copied to clipboard.", {
        toastId: `copy-report-summary-${interviewId}`,
      });
    } catch {
      toast.error("Could not copy to clipboard.", {
        toastId: `copy-report-summary-error-${interviewId}`,
      });
    }
  };

  return (
    <div className="space-y-8">
      <Card
        padding="lg"
        className="relative overflow-hidden border-[var(--primary-soft)] bg-gradient-to-br from-[var(--surface)] via-[var(--bg-soft)] to-[var(--accent-soft)]/30"
      >
        <div
          className="pointer-events-none absolute -right-10 -top-10 h-48 w-48 rounded-full bg-[var(--accent)]/10 blur-3xl"
          aria-hidden="true"
        />
        <div
          className="pointer-events-none absolute -bottom-16 -left-10 h-40 w-40 rounded-full bg-[var(--primary)]/10 blur-3xl"
          aria-hidden="true"
        />

        <div className="relative space-y-6">
          <div className="space-y-2">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--accent)]">
              Final interview report
            </p>
            <h1 className="text-2xl font-bold tracking-tight text-[var(--text)] sm:text-3xl">
              {title}
            </h1>
            {companyName && (
              <p className="text-base text-[var(--text-soft)]">{companyName}</p>
            )}
            <p className="text-sm text-[var(--muted)]">
              Completed {formatReportCompletedDate(completedAt)}
            </p>
          </div>

          <div className="flex flex-col gap-6 border-t border-[var(--border)] pt-6 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm font-medium text-[var(--muted)]">
                Overall score
              </p>
              <p className={`mt-1 text-5xl font-bold sm:text-6xl ${overallConfig.text}`}>
                {report.overallScore}
                <span className="text-2xl font-medium text-[var(--muted)] sm:text-3xl">
                  /100
                </span>
              </p>
              <span
                className={`mt-3 inline-flex rounded-full px-3 py-1 text-xs font-semibold ${overallConfig.badge}`}
              >
                {overallConfig.label}
              </span>
            </div>
            <span
              className={`inline-flex w-fit rounded-full px-4 py-2 text-sm font-semibold ${verdict.className}`}
            >
              {verdict.label}
            </span>
          </div>
        </div>
      </Card>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <ScoreCard
          label="Overall Score"
          score={report.overallScore}
          showLevel
          highlight
        />
        <ScoreCard
          label="Technical Score"
          score={report.technicalScore}
          showLevel
        />
        <ScoreCard
          label="Communication Score"
          score={report.communicationScore}
          showLevel
        />
        <ScoreCard
          label="Readiness Score"
          score={report.readinessScore}
          showLevel
        />
      </div>

      <ReportSection
        title="Summary"
        icon={<FiBookOpen size={18} />}
        iconClassName="bg-[var(--info-soft)] text-[var(--info-text)]"
      >
        <p className="text-sm leading-relaxed text-[var(--text-soft)] sm:text-base">
          {report.summary}
        </p>
      </ReportSection>

      <div className="grid gap-6 lg:grid-cols-3">
        <ReportSection
          title="Strengths"
          icon={<FiCheckCircle size={18} />}
          iconClassName="bg-[var(--success-soft)] text-[var(--success-text)]"
        >
          <ul className="space-y-3">
            {report.strengths.map((item) => (
              <ReportListItem
                key={item}
                markerClassName="bg-[var(--success-text)]"
              >
                {item}
              </ReportListItem>
            ))}
          </ul>
        </ReportSection>

        <ReportSection
          title="Weaknesses"
          icon={<FiAlertCircle size={18} />}
          iconClassName="bg-[var(--warning-soft)] text-[var(--warning-text)]"
        >
          <ul className="space-y-3">
            {report.weaknesses.map((item) => (
              <ReportListItem
                key={item}
                markerClassName="bg-[var(--warning-text)]"
              >
                {item}
              </ReportListItem>
            ))}
          </ul>
        </ReportSection>

        <ReportSection
          title="Recommendations"
          icon={<FiTrendingUp size={18} />}
          iconClassName="bg-[var(--accent-soft)] text-[var(--accent)]"
        >
          <ul className="space-y-3">
            {report.recommendations.map((item) => (
              <ReportListItem key={item} markerClassName="bg-[var(--accent)]">
                {item}
              </ReportListItem>
            ))}
          </ul>
        </ReportSection>
      </div>

      <Card
        padding="lg"
        className="border-[var(--border)] bg-[var(--bg-soft)]"
      >
        <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
          <Link href="/history" className="w-full cursor-pointer sm:w-auto">
            <Button variant="secondary" className="w-full sm:w-auto">
              <FiArrowLeft size={16} />
              Back to History
            </Button>
          </Link>
          <Link
            href={`/interview/${interviewId}`}
            className="w-full cursor-pointer sm:w-auto"
          >
            <Button variant="secondary" className="w-full sm:w-auto">
              <FiTarget size={16} />
              Back to Interview
            </Button>
          </Link>
          <Link href="/start" className="w-full cursor-pointer sm:w-auto">
            <Button className="w-full sm:w-auto">
              <FiRotateCcw size={16} />
              Start Another Interview
            </Button>
          </Link>
          <Button
            variant="secondary"
            className="w-full cursor-pointer sm:w-auto"
            onClick={() => void handleCopySummary()}
          >
            <FiCopy size={16} />
            Copy Summary
          </Button>
        </div>
      </Card>
    </div>
  );
}
