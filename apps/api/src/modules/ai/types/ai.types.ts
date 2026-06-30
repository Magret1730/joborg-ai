import {
  QUESTION_DIFFICULTIES,
  QUESTION_TYPES,
  type QuestionDifficultyValue,
  type QuestionTypeValue,
} from "../../../constants/questionTypes.js";

export type { QuestionDifficultyValue, QuestionTypeValue };

export interface InterviewQuestion {
  id: string;
  question: string;
  type: QuestionTypeValue;
  difficulty: QuestionDifficultyValue;
  goodAnswerHints: string[];
}

export interface InterviewGenerationResponse {
  interviewTitle: string;
  questions: InterviewQuestion[];
}

export interface GenerateInterviewPromptInput {
  title: string;
  companyName: string;
  jobDescription: string;
}

export const GEMINI_MODEL = "gemini-2.5-flash";

export const EXPECTED_QUESTION_COUNT = 5;

export const questionTypeSchemaValues = Object.values(QUESTION_TYPES);
export const questionDifficultySchemaValues = Object.values(QUESTION_DIFFICULTIES);
