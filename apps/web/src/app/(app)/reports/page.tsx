import Link from "next/link";
import { PageHeader } from "@/components/layout/PageHeader";
import { ReportsTable } from "@/components/interviews/ReportsTable";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { getAllReports } from "@/data/mockInterviews";

export default function ReportsPage() {
  const reports = getAllReports();

  return (
    <div className="mx-auto max-w-6xl space-y-8">
      <PageHeader
        title="Reports"
        description="View all completed interview reports."
        action={
          <Link href="/start">
            <Button>Start Interview</Button>
          </Link>
        }
      />

      {reports.length > 0 ? (
        <ReportsTable reports={reports} />
      ) : (
        <EmptyState
          title="No reports yet"
          description="Complete a mock interview to generate your first readiness report."
          actionLabel="Start Interview"
          actionHref="/start"
        />
      )}
    </div>
  );
}
