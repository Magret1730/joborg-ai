export const INTERVIEW_STATUS = {
  DRAFT: "draft",
  IN_PROGRESS: "in_progress",
  COMPLETED: "completed",
} as const;

export type InterviewStatusValue =
  (typeof INTERVIEW_STATUS)[keyof typeof INTERVIEW_STATUS];
