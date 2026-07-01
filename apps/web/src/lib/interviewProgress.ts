import type { InterviewListItem, InterviewStatus } from "@/types/interview";

export type DisplayInterviewStatus =
  | "draft"
  | "in_progress"
  | "ready_for_report"
  | "completed";

type ProgressSource = Pick<
  InterviewListItem,
  "status" | "readyForReport"
>;

export function getDisplayStatus(
  interview: ProgressSource,
): DisplayInterviewStatus {
  if (interview.status === "completed") {
    return "completed";
  }

  if (interview.readyForReport) {
    return "ready_for_report";
  }

  if (interview.status === "in_progress") {
    return "in_progress";
  }

  return "draft";
}

export const displayStatusStyles: Record<DisplayInterviewStatus, string> = {
  draft: "bg-[var(--surface-hover)] text-[var(--muted)]",
  in_progress: "bg-[var(--info-soft)] text-[var(--info-text)]",
  ready_for_report: "bg-[var(--accent-soft)] text-[var(--accent)]",
  completed: "bg-[var(--success-soft)] text-[var(--success-text)]",
};

export const displayStatusLabels: Record<DisplayInterviewStatus, string> = {
  draft: "Draft",
  in_progress: "In Progress",
  ready_for_report: "Ready for Report",
  completed: "Completed",
};

export function formatProgressLabel(
  answeredCount: number,
  questionCount: number,
  progressPercentage: number,
) {
  return `${answeredCount}/${questionCount} answered · ${progressPercentage}%`;
}

export function getReportUnlockMessage(readyForReport: boolean) {
  return readyForReport
    ? "You're ready to generate your final report."
    : "Answer all questions to unlock your final report.";
}

export function getSessionStatusLabel(
  status: InterviewStatus,
  readyForReport: boolean,
) {
  if (status === "completed") {
    return displayStatusLabels.completed;
  }

  if (readyForReport) {
    return "Ready";
  }

  if (status === "in_progress") {
    return displayStatusLabels.in_progress;
  }

  return displayStatusLabels.draft;
}
