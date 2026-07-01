"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { PageHeader } from "@/components/layout/PageHeader";
import { ReadyForReportSection } from "@/components/interviews/ReadyForReportSection";
import { ReportsTable } from "@/components/interviews/ReportsTable";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { ErrorState } from "@/components/ui/ErrorState";
import { LoadingState } from "@/components/ui/LoadingState";
import { interviewService } from "@/services/interviews";
import { ApiError } from "@/services/api";
import type { InterviewListItem } from "@/types/interview";

export default function ReportsPage() {
  const [interviews, setInterviews] = useState<InterviewListItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function loadInterviews() {
      setIsLoading(true);
      setError(null);

      try {
        const data = await interviewService.list();

        if (isMounted) {
          setInterviews(data);
        }
      } catch (err) {
        if (isMounted) {
          const message =
            err instanceof ApiError
              ? err.message
              : "Failed to load reports.";

          setError(message);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    void loadInterviews();

    return () => {
      isMounted = false;
    };
  }, []);

  const completedReports = interviews.filter(
    (interview) => interview.status === "completed",
  );
  const readyForReportInterviews = interviews.filter(
    (interview) =>
      interview.readyForReport && interview.status !== "completed",
  );

  const reports = completedReports
    .filter((interview) => interview.overallScore !== null)
    .map((interview) => ({
      id: interview.id,
      jobTitle: interview.title,
      company: interview.companyName ?? "—",
      overallScore: interview.overallScore ?? 0,
      verdict: "needs_practice" as const,
      date: interview.createdAt,
    }));

  const hasContent =
    reports.length > 0 || readyForReportInterviews.length > 0;

  return (
    <div className="mx-auto max-w-6xl space-y-8">
      <PageHeader
        title="Reports"
        description="View completed interview reports and track interviews ready for final report generation."
        action={
          <Link href="/start" className="cursor-pointer">
            <Button>Start Interview</Button>
          </Link>
        }
      />

      {isLoading ? (
        <LoadingState label="Loading reports..." rows={5} />
      ) : error ? (
        <ErrorState title="Could not load reports" message={error} />
      ) : hasContent ? (
        <div className="space-y-10">
          {reports.length > 0 && <ReportsTable reports={reports} />}
          <ReadyForReportSection interviews={readyForReportInterviews} />
        </div>
      ) : (
        <EmptyState
          title="No reports yet"
          description="No reports yet. Complete an interview to generate your first report."
          actionLabel="Start Interview"
          actionHref="/start"
        />
      )}
    </div>
  );
}
