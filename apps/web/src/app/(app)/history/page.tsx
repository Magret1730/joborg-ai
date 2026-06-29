import Link from "next/link";
import { PageHeader } from "@/components/layout/PageHeader";
import { InterviewHistoryTable } from "@/components/interviews/InterviewHistoryTable";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { mockInterviews } from "@/data/mockInterviews";

export default function HistoryPage() {
  const interviews = mockInterviews;

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

      {interviews.length > 0 ? (
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
