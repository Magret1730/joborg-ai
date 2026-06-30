import Link from "next/link";
import { FiArrowRight, FiCalendar } from "react-icons/fi";
import { PageHeader } from "@/components/layout/PageHeader";
import { StatCard } from "@/components/interviews/ScoreCard";
import { InterviewHistoryTable } from "@/components/interviews/InterviewHistoryTable";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { dashboardStats, mockInterviews } from "@/data/mockInterviews";

export default function DashboardPage() {
  const recentInterviews = mockInterviews.slice(0, 3);

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

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Interviews Completed"
          value={dashboardStats.interviewsCompleted}
        />
        <StatCard
          label="Average Score"
          value={`${dashboardStats.averageScore}%`}
        />
        <StatCard
          label="Readiness Score"
          value={`${dashboardStats.readinessScore}%`}
          hint="Based on recent performance"
        />
        <StatCard
          label="Last Interview"
          value="2d ago"
          hint={dashboardStats.lastInterview}
        />
      </div>

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

        {recentInterviews.length > 0 ? (
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
