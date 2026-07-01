import { INTERVIEW_STATUS } from "../constants/interviewStatus.js";
import type { InterviewStatus } from "../modules/interviews/interview.types.js";

export function resolveInterviewStatus(
  answeredCount: number,
  hasFinalReport: boolean,
): InterviewStatus {
  if (hasFinalReport) {
    return INTERVIEW_STATUS.COMPLETED;
  }

  if (answeredCount === 0) {
    return INTERVIEW_STATUS.DRAFT;
  }

  return INTERVIEW_STATUS.IN_PROGRESS;
}
