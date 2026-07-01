"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  FiArrowLeft,
  FiFileText,
  FiLock,
  FiRotateCcw,
  FiTarget,
} from "react-icons/fi";
import { toast } from "react-toastify";
import { FinalReportView } from "@/components/interviews/FinalReportView";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { ErrorState } from "@/components/ui/ErrorState";
import { LoadingState } from "@/components/ui/LoadingState";
import { getFriendlyErrorMessage } from "@/lib/errorMessages";
import { parseFinalReport } from "@/lib/finalReport";
import { interviewService } from "@/services/interviews";
import type { FinalReportResponse, InterviewDetail } from "@/types/interview";

export default function ReportPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const interviewId = params.id;

  const [interview, setInterview] = useState<InterviewDetail | null>(null);
  const [report, setReport] = useState<FinalReportResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadInterview = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const data = await interviewService.getById(interviewId);
      setInterview(data);
      setReport(parseFinalReport(data.finalReport));
    } catch (err) {
      setError(
        getFriendlyErrorMessage(
          err,
          "We couldn't load this report. Please try again in a moment.",
        ),
      );
      setInterview(null);
      setReport(null);
    } finally {
      setIsLoading(false);
    }
  }, [interviewId]);

  useEffect(() => {
    void loadInterview();
  }, [loadInterview]);

  const handleGenerateReport = async (isRegenerate: boolean) => {
    setIsGenerating(true);

    try {
      const generated = await interviewService.generateFinalReport(interviewId);
      setReport(generated);
      setInterview((previous) =>
        previous
          ? {
              ...previous,
              status: "completed",
              overallScore: generated.overallScore,
              finalReport: generated,
              readyForReport: true,
              updatedAt: new Date().toISOString(),
            }
          : previous,
      );

      toast.success(
        isRegenerate
          ? "Final report regenerated successfully."
          : "Final report generated successfully.",
        { toastId: `final-report-${interviewId}` },
      );
    } catch (err) {
      toast.error(
        getFriendlyErrorMessage(
          err,
          "We couldn't generate your final report. Please try again in a moment.",
        ),
        {
          toastId: `final-report-error-${interviewId}`,
        },
      );
    } finally {
      setIsGenerating(false);
    }
  };

  if (isLoading) {
    return (
      <div className="mx-auto max-w-5xl space-y-8">
        <LoadingState label="Loading interview report..." rows={6} />
      </div>
    );
  }

  if (error || !interview) {
    return (
      <div className="mx-auto max-w-3xl">
        <ErrorState
          title="Report not found"
          message={error ?? "This interview could not be loaded."}
        />
        <Link href="/history" className="mt-4 inline-block cursor-pointer">
          <Button variant="secondary">
            <FiArrowLeft size={16} />
            Back to History
          </Button>
        </Link>
      </div>
    );
  }

  const reportExists = report !== null;
  const completedWithoutReport =
    interview.status === "completed" && !reportExists;
  const canGenerate =
    interview.readyForReport && !reportExists && !completedWithoutReport;

  if (reportExists && report) {
    return (
      <div className="mx-auto max-w-5xl space-y-6 pb-8">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-end">
          <Button
            variant="secondary"
            className="w-full cursor-pointer sm:w-auto"
            disabled={isGenerating}
            onClick={() => void handleGenerateReport(true)}
          >
            <FiRotateCcw size={16} />
            {isGenerating ? "Regenerating..." : "Regenerate Report"}
          </Button>
        </div>

        <FinalReportView
          interviewId={interviewId}
          title={interview.title}
          companyName={interview.companyName}
          completedAt={interview.updatedAt}
          report={report}
        />
      </div>
    );
  }

  const interviewLabel = interview.companyName
    ? `${interview.title} at ${interview.companyName}`
    : interview.title;

  return (
    <div className="mx-auto max-w-3xl space-y-6 pb-8">
      <div className="space-y-2">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--accent)]">
          Final interview report
        </p>
        <h1 className="text-2xl font-bold text-[var(--text)] sm:text-3xl">
          {interview.title}
        </h1>
        {interview.companyName && (
          <p className="text-base text-[var(--text-soft)]">
            {interview.companyName}
          </p>
        )}
      </div>

      <Card
        padding="lg"
        className="space-y-6 border-[var(--card-border)] bg-[var(--card)]"
      >
        {completedWithoutReport ? (
          <>
            <div className="flex items-start gap-4">
              <span className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-[var(--radius-md)] bg-[var(--warning-soft)] text-[var(--warning-text)]">
                <FiFileText size={22} />
              </span>
              <div className="space-y-2">
                <h2 className="text-lg font-semibold text-[var(--text)]">
                  Report missing
                </h2>
                <p className="text-sm leading-relaxed text-[var(--text-soft)]">
                  This interview is marked completed, but the final report is
                  missing. Regenerate it to view your results for{" "}
                  <span className="font-medium text-[var(--text)]">
                    {interviewLabel}
                  </span>
                  .
                </p>
              </div>
            </div>
            <Button
              disabled={isGenerating}
              className="w-full cursor-pointer sm:w-auto"
              onClick={() => void handleGenerateReport(true)}
            >
              <FiRotateCcw size={16} />
              {isGenerating ? "Regenerating..." : "Regenerate Report"}
            </Button>
          </>
        ) : canGenerate ? (
          <>
            <div className="flex items-start gap-4">
              <span className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-[var(--radius-md)] bg-[var(--accent-soft)] text-[var(--accent)]">
                <FiFileText size={22} />
              </span>
              <div className="space-y-2">
                <h2 className="text-lg font-semibold text-[var(--text)]">
                  Ready to generate
                </h2>
                <p className="text-sm leading-relaxed text-[var(--text-soft)]">
                  All questions are answered for{" "}
                  <span className="font-medium text-[var(--text)]">
                    {interviewLabel}
                  </span>
                  . Generate your final report to see scores, strengths, and
                  personalized recommendations.
                </p>
              </div>
            </div>
            <Button
              disabled={isGenerating}
              className="w-full cursor-pointer sm:w-auto"
              onClick={() => void handleGenerateReport(false)}
            >
              <FiFileText size={16} />
              {isGenerating ? "Generating..." : "Generate Report"}
            </Button>
          </>
        ) : (
          <>
            <div className="flex items-start gap-4">
              <span className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-[var(--radius-md)] bg-[var(--surface-hover)] text-[var(--muted)]">
                <FiLock size={22} />
              </span>
              <div className="space-y-2">
                <h2 className="text-lg font-semibold text-[var(--text)]">
                  Report locked
                </h2>
                <p className="text-sm leading-relaxed text-[var(--text-soft)]">
                  Complete all questions to unlock your final report.
                </p>
              </div>
            </div>
            <Button
              className="w-full cursor-pointer sm:w-auto"
              onClick={() => router.push(`/interview/${interviewId}`)}
            >
              <FiTarget size={16} />
              Continue Interview
            </Button>
          </>
        )}

        <div className="flex flex-col gap-3 border-t border-[var(--border)] pt-5 sm:flex-row sm:flex-wrap">
          <Link href="/history" className="w-full cursor-pointer sm:w-auto">
            <Button variant="secondary" className="w-full sm:w-auto">
              <FiArrowLeft size={16} />
              Back to History
            </Button>
          </Link>
          <Link href="/start" className="w-full cursor-pointer sm:w-auto">
            <Button variant="secondary" className="w-full sm:w-auto">
              Start Another Interview
            </Button>
          </Link>
        </div>
      </Card>
    </div>
  );
}
