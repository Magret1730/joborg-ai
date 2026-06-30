"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { PageHeader } from "@/components/layout/PageHeader";
import { InterviewHistoryTable } from "@/components/interviews/InterviewHistoryTable";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { ErrorState } from "@/components/ui/ErrorState";
import { LoadingState } from "@/components/ui/LoadingState";
import { interviewService } from "@/services/interviews";
import { ApiError } from "@/services/api";
import type { InterviewListItem } from "@/types/interview";

export default function HistoryPage() {
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
              : "Failed to load interview history.";

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

  return (
    <div className="mx-auto max-w-6xl space-y-8">
      <PageHeader
        title="Interview History"
        description="Review completed sessions, resume in-progress interviews, and open detailed reports."
        action={
          <Link href="/start">
            <Button>Start Interview</Button>
          </Link>
        }
      />

      {isLoading ? (
        <LoadingState label="Loading interview history..." rows={6} />
      ) : error ? (
        <ErrorState title="Could not load history" message={error} />
      ) : interviews.length > 0 ? (
        <InterviewHistoryTable interviews={interviews} />
      ) : (
        <EmptyState
          title="No interviews yet"
          description="Your practice sessions will appear here once you complete your first mock interview."
          actionLabel="Start Interview"
        />
      )}
    </div>
  );
}
