"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { FiArrowRight, FiCalendar } from "react-icons/fi";
import { PageHeader } from "@/components/layout/PageHeader";
import { StatCard } from "@/components/interviews/ScoreCard";
import { InterviewHistoryTable } from "@/components/interviews/InterviewHistoryTable";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { ErrorState } from "@/components/ui/ErrorState";
import { LoadingCardGrid, LoadingState } from "@/components/ui/LoadingState";
import { interviewService } from "@/services/interviews";
import { ApiError } from "@/services/api";
import type { InterviewListItem } from "@/types/interview";

function formatRelativeDate(date: string) {
  const diffMs = Date.now() - new Date(date).getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays <= 0) {
    return "Today";
  }

  if (diffDays === 1) {
    return "1d ago";
  }

  return `${diffDays}d ago`;
}

export default function DashboardPage() {
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
              : "Failed to load dashboard data.";

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

  const completedInterviews = interviews.filter(
    (interview) => interview.status === "completed",
  );
  const scoredInterviews = completedInterviews.filter(
    (interview) => interview.overallScore !== null,
  );
  const averageScore =
    scoredInterviews.length > 0
      ? Math.round(
          scoredInterviews.reduce(
            (sum, interview) => sum + (interview.overallScore ?? 0),
            0,
          ) / scoredInterviews.length,
        )
      : 0;
  const recentInterviews = interviews.slice(0, 3);
  const lastInterview = interviews[0];

  return (
    <div className="mx-auto max-w-6xl space-y-8">
      <PageHeader
        title="Welcome back"
        description="Track your interview readiness, review recent sessions, and start a new practice round."
        action={
          <Link href="/start">
            <Button>
              Start Interview
              <FiArrowRight size={16} />
            </Button>
          </Link>
        }
      />

      <Card
        padding="lg"
        className="border-[var(--primary-soft)] bg-gradient-to-br from-[var(--surface)] to-[var(--bg-soft)]"
      >
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="space-y-3">
            <p className="text-sm font-medium uppercase tracking-wide text-[var(--accent)]">
              Ready for your next role?
            </p>
            <h2 className="text-2xl font-bold text-[var(--text)] sm:text-3xl">
              Practice interviews tailored to your target job
            </h2>
            <p className="max-w-2xl text-sm text-[var(--muted)] sm:text-base">
              Paste a job description and get realistic questions with instant
              feedback. Build confidence before the real interview.
            </p>
          </div>
          <Link href="/start" className="shrink-0">
            <Button className="w-full sm:w-auto">
              Start Interview
              <FiArrowRight size={16} />
            </Button>
          </Link>
        </div>
      </Card>

      {error ? (
        <ErrorState title="Could not load dashboard" message={error} />
      ) : isLoading ? (
        <LoadingCardGrid count={4} />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard label="Total Interviews" value={interviews.length} />
          <StatCard
            label="Interviews Completed"
            value={completedInterviews.length}
          />
          <StatCard
            label="Average Score"
            value={scoredInterviews.length > 0 ? `${averageScore}%` : "—"}
          />
          <StatCard
            label="Last Interview"
            value={lastInterview ? formatRelativeDate(lastInterview.createdAt) : "—"}
            hint={lastInterview?.title}
          />
        </div>
      )}

      <section className="space-y-4">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-semibold text-[var(--text)]">
              Recent Interviews
            </h2>
            <p className="text-sm text-[var(--muted)]">
              Your latest practice sessions
            </p>
          </div>
          <Link href="/history">
            <Button variant="secondary">View all</Button>
          </Link>
        </div>

        {isLoading ? (
          <LoadingState label="Loading recent interviews..." rows={4} />
        ) : recentInterviews.length > 0 ? (
          <InterviewHistoryTable interviews={recentInterviews} />
        ) : (
          <Card padding="lg" className="text-center">
            <FiCalendar
              size={28}
              className="mx-auto mb-3 text-[var(--accent)]"
            />
            <p className="font-medium text-[var(--text)]">No interviews yet</p>
            <p className="mt-1 text-sm text-[var(--muted)]">
              Start your first practice session to see results here.
            </p>
          </Card>
        )}
      </section>
    </div>
  );
}
