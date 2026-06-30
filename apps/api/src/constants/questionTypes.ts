export const QUESTION_TYPES = {
  TECHNICAL: "technical",
  BEHAVIORAL: "behavioral",
  PROBLEM_SOLVING: "problem_solving",
  COMMUNICATION: "communication",
  SYSTEM_DESIGN: "system_design",
} as const;

export const QUESTION_DIFFICULTIES = {
  EASY: "easy",
  MEDIUM: "medium",
  HARD: "hard",
} as const;

export type QuestionTypeValue =
  (typeof QUESTION_TYPES)[keyof typeof QUESTION_TYPES];

export type QuestionDifficultyValue =
  (typeof QUESTION_DIFFICULTIES)[keyof typeof QUESTION_DIFFICULTIES];
