import Link from "next/link";
import { FiFileText } from "react-icons/fi";
import type { InterviewListItem } from "@/types/interview";
import { formatProgressLabel } from "@/lib/interviewProgress";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

type ReadyForReportSectionProps = {
  interviews: InterviewListItem[];
};

export function ReadyForReportSection({
  interviews,
}: ReadyForReportSectionProps) {
  if (interviews.length === 0) {
    return null;
  }

  return (
    <section className="space-y-4" aria-labelledby="ready-for-report-heading">
      <div>
        <h2
          id="ready-for-report-heading"
          className="text-xl font-semibold text-[var(--text)]"
        >
          Ready for Report
        </h2>
        <p className="text-sm text-[var(--muted)]">
          These interviews have all questions answered and are waiting for a
          final report.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {interviews.map((interview) => (
          <Card key={interview.id} padding="md" className="space-y-4">
            <div className="space-y-1">
              <p className="font-semibold text-[var(--text)]">{interview.title}</p>
              <p className="text-sm text-[var(--muted)]">
                {interview.companyName ?? "—"}
              </p>
            </div>
            <p className="text-sm text-[var(--text-soft)]">
              {formatProgressLabel(
                interview.answeredCount,
                interview.questionCount,
                interview.progressPercentage,
              )}
            </p>
            <div className="flex flex-col gap-2 sm:flex-row">
              <Link
                href={`/interview/${interview.id}`}
                className="cursor-pointer"
              >
                <Button variant="secondary" className="w-full sm:w-auto">
                  Continue Interview
                </Button>
              </Link>
              <Link
                href={`/interview/${interview.id}/report`}
                className="cursor-pointer"
              >
                <Button className="w-full sm:w-auto">
                  <FiFileText size={16} />
                  Generate Report
                </Button>
              </Link>
            </div>
          </Card>
        ))}
      </div>
    </section>
  );
}
