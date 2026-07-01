"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { FiArrowRight, FiCalendar } from "react-icons/fi";
import { useAuth } from "@/context/AuthContext";
import { PageHeader } from "@/components/layout/PageHeader";
import { StatCard } from "@/components/interviews/ScoreCard";
import { InterviewHistoryTable } from "@/components/interviews/InterviewHistoryTable";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/EmptyState";
import { ErrorState } from "@/components/ui/ErrorState";
import { LoadingCardGrid, LoadingState } from "@/components/ui/LoadingState";
import { getFriendlyErrorMessage } from "@/lib/errorMessages";
import { interviewService } from "@/services/interviews";
import type { InterviewListItem } from "@/types/interview";

function formatRelativeDate(date: string) {
  const diffMs = Date.now() - new Date(date).getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays <= 0) {
    return "Today";
  }

  if (diffDays === 1) {
    return "1 day ago";
  }

  return `${diffDays} days ago`;
}

export default function DashboardPage() {
  const { user } = useAuth();
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
          setError(
            getFriendlyErrorMessage(
              err,
              "We couldn't load your dashboard. Please try again in a moment.",
            ),
          );
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

  const inProgressInterviews = interviews.filter(
    (interview) =>
      interview.status === "in_progress" && !interview.readyForReport,
  );
  const readyForReportInterviews = interviews.filter(
    (interview) =>
      interview.readyForReport && interview.status !== "completed",
  );
  const completedReports = interviews.filter(
    (interview) => interview.status === "completed",
  );
  const recentInterviews = interviews.slice(0, 3);
  const lastInterview = interviews[0];

  return (
    <div className="mx-auto max-w-6xl space-y-8">
      <PageHeader
        title="Welcome back"
        description="Track your interview readiness, review recent sessions, and start a new practice round."
        action={
          <Link href="/start" className="cursor-pointer">
            <Button>
              Start Interview
              <FiArrowRight size={16} />
            </Button>
          </Link>
        }
      />

      {user?.plan === "free" && (
        <p className="text-sm text-[var(--muted)]">
          Free plan: 1 interview generation per day. Premium coming soon.
        </p>
      )}

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
          <Link href="/start" className="shrink-0 cursor-pointer">
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
            label="In Progress"
            value={inProgressInterviews.length}
          />
          <StatCard
            label="Ready for Report"
            value={readyForReportInterviews.length}
          />
          <StatCard
            label="Completed Reports"
            value={completedReports.length}
          />
        </div>
      )}

      <section className="space-y-4" aria-labelledby="recent-interviews-heading">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2
              id="recent-interviews-heading"
              className="text-xl font-semibold text-[var(--text)]"
            >
              Recent Interviews
            </h2>
            <p className="text-sm text-[var(--muted)]">
              Your latest practice sessions
            </p>
          </div>
          <Link href="/history" className="cursor-pointer">
            <Button variant="secondary">View All</Button>
          </Link>
        </div>

        {isLoading ? (
          <LoadingState label="Loading recent interviews..." rows={4} />
        ) : recentInterviews.length > 0 ? (
          <InterviewHistoryTable interviews={recentInterviews} />
        ) : (
          <EmptyState
            title="No interviews yet"
            description="You haven't started any practice sessions. Generate your first interview from a job description to begin."
            actionLabel="Start Interview"
            actionHref="/start"
            icon={<FiCalendar size={22} />}
          />
        )}
      </section>

      {!isLoading && lastInterview && (
        <p className="text-sm text-[var(--muted)]">
          Last interview:{" "}
          <span className="font-medium text-[var(--text)]">
            {lastInterview.title}
          </span>{" "}
          · {formatRelativeDate(lastInterview.createdAt)}
        </p>
      )}
    </div>
  );
}
