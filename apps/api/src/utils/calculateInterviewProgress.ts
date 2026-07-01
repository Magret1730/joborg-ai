export interface InterviewProgress {
  questionCount: number;
  answeredCount: number;
  progressPercentage: number;
  readyForReport: boolean;
}

export function calculateInterviewProgress(
  questionCount: number,
  answeredCount: number,
): InterviewProgress {
  const safeQuestionCount = Math.max(questionCount, 0);
  const safeAnsweredCount = Math.min(Math.max(answeredCount, 0), safeQuestionCount);

  const progressPercentage =
    safeQuestionCount === 0
      ? 0
      : Math.round((safeAnsweredCount / safeQuestionCount) * 100);

  const readyForReport =
    safeQuestionCount > 0 && safeAnsweredCount === safeQuestionCount;

  return {
    questionCount: safeQuestionCount,
    answeredCount: safeAnsweredCount,
    progressPercentage,
    readyForReport,
  };
}
