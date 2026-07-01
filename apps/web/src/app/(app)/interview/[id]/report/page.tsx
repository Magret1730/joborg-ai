"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { FiArrowLeft, FiFileText, FiRotateCcw } from "react-icons/fi";
import { toast } from "react-toastify";
import { PageHeader } from "@/components/layout/PageHeader";
import { FinalReportView } from "@/components/interviews/FinalReportView";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { ErrorState } from "@/components/ui/ErrorState";
import { LoadingState } from "@/components/ui/LoadingState";
import { parseFinalReport } from "@/lib/finalReport";
import { interviewService } from "@/services/interviews";
import { ApiError } from "@/services/api";
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
      const message =
        err instanceof ApiError
          ? err.message
          : "Failed to load interview report.";

      setError(message);
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
      const message =
        err instanceof ApiError
          ? err.message
          : "Failed to generate final report. Please try again.";

      toast.error(message, {
        toastId: `final-report-error-${interviewId}`,
      });
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
        <Link href="/history" className="mt-4 inline-block">
          <Button variant="secondary">Back to history</Button>
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
      <div className="mx-auto max-w-5xl space-y-8">
        <PageHeader
          title="Interview Report"
          description={`${interview.title}${interview.companyName ? ` at ${interview.companyName}` : ""}`}
          action={
            <Button
              variant="secondary"
              className="w-full sm:w-auto"
              disabled={isGenerating}
              onClick={() => void handleGenerateReport(true)}
            >
              <FiRotateCcw size={16} />
              {isGenerating ? "Regenerating..." : "Regenerate Report"}
            </Button>
          }
        />
        <FinalReportView
          title={interview.title}
          companyName={interview.companyName}
          report={report}
        />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl space-y-8">
      <PageHeader
        title="Interview Report"
        description={`${interview.title}${interview.companyName ? ` at ${interview.companyName}` : ""}`}
      />

      <Card padding="lg" className="space-y-4">
        {completedWithoutReport ? (
          <>
            <p className="text-[var(--text)]">
              This interview is marked completed, but the final report is
              missing. Regenerate it to view your results.
            </p>
            <Button
              disabled={isGenerating}
              onClick={() => void handleGenerateReport(true)}
            >
              <FiRotateCcw size={16} />
              {isGenerating ? "Regenerating..." : "Regenerate Report"}
            </Button>
          </>
        ) : canGenerate ? (
          <>
            <p className="text-[var(--text)]">
              All questions are answered. Generate your final report to see
              scores, strengths, and recommendations.
            </p>
            <Button
              disabled={isGenerating}
              onClick={() => void handleGenerateReport(false)}
            >
              <FiFileText size={16} />
              {isGenerating ? "Generating..." : "Generate Report"}
            </Button>
          </>
        ) : (
          <>
            <p className="text-[var(--text)]">
              Answer all questions before generating your final report.
            </p>
            <Button onClick={() => router.push(`/interview/${interviewId}`)}>
              Continue Interview
            </Button>
          </>
        )}

        <Link href="/history" className="inline-block">
          <Button variant="secondary">
            <FiArrowLeft size={16} />
            Back to history
          </Button>
        </Link>
      </Card>
    </div>
  );
}
