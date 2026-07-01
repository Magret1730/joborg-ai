import type { DisplayInterviewStatus } from "@/lib/interviewProgress";

export function StatusBadge({ status }: { status: DisplayInterviewStatus }) {
  const styles: Record<DisplayInterviewStatus, string> = {
    draft: "bg-[var(--surface-hover)] text-[var(--muted)]",
    in_progress: "bg-[var(--info-soft)] text-[var(--info-text)]",
    ready_for_report:
      "border border-[var(--accent)]/25 bg-[var(--accent-soft)] text-[var(--accent)]",
    completed: "bg-[var(--success-soft)] text-[var(--success-text)]",
  };

  const labels: Record<DisplayInterviewStatus, string> = {
    draft: "Draft",
    in_progress: "In Progress",
    ready_for_report: "Ready",
    completed: "Completed",
  };

  return (
    <span
      className={`inline-flex max-w-full items-center whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-medium leading-none ${styles[status]}`}
    >
      {labels[status]}
    </span>
  );
}
