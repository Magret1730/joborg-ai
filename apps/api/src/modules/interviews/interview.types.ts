import type { InterviewQuestion } from "../ai/types/ai.types.js";
import type { InterviewStatusValue } from "../../constants/interviewStatus.js";

export type InterviewStatus = InterviewStatusValue;

export interface InterviewRecord {
  id: string;
  user_id: string | null;
  title: string;
  company_name: string | null;
  job_description: string;
  questions_json: InterviewQuestion[];
  final_report_json: unknown | null;
  overall_score: number | null;
  status: InterviewStatus;
  created_at: Date;
  updated_at: Date;
}

export interface AnswerRecord {
  id: string;
  interview_id: string;
  question_index: number;
  question_text: string;
  question_type: string;
  answer_text: string;
  score: number | null;
  feedback_json: unknown | null;
  created_at: Date;
  updated_at: Date;
}

export interface CreateInterviewInput {
  title: string;
  companyName: string;
  jobDescription: string;
  questionsJson: InterviewQuestion[];
  interviewTitle: string;
}

export interface InterviewListItem {
  id: string;
  title: string;
  companyName: string | null;
  status: InterviewStatus;
  overallScore: number | null;
  createdAt: string;
  updatedAt: string;
  questionCount: number;
  answeredCount: number;
  progressPercentage: number;
  readyForReport: boolean;
}

export interface InterviewAnswer {
  id: string;
  interviewId: string;
  questionIndex: number;
  questionText: string;
  questionType: string;
  answerText: string;
  score: number | null;
  feedback: unknown | null;
  createdAt: string;
  updatedAt: string;
}

export interface InterviewDetail {
  id: string;
  title: string;
  companyName: string | null;
  jobDescription: string;
  questions: InterviewQuestion[];
  status: InterviewStatus;
  overallScore: number | null;
  finalReport: unknown | null;
  answers: InterviewAnswer[];
  createdAt: string;
  updatedAt: string;
  questionCount: number;
  answeredCount: number;
  progressPercentage: number;
  readyForReport: boolean;
}

export interface GeneratedInterviewResult {
  interviewId: string;
  interviewTitle: string;
  companyName: string;
  status: InterviewStatus;
  questions: InterviewQuestion[];
}

export interface AnswerFeedback {
  strengths: string[];
  weaknesses: string[];
  improvedAnswer: string;
  followUpQuestion: string;
  shortFeedback: string;
}

export interface UpsertAnswerInput {
  interviewId: string;
  questionIndex: number;
  questionText: string;
  questionType: string;
  answerText: string;
  score: number;
  feedback: AnswerFeedback;
}

export interface SubmitAnswerResult {
  questionIndex: number;
  answerText: string;
  score: number;
  feedback: AnswerFeedback;
  status: InterviewStatus;
  questionCount: number;
  answeredCount: number;
  progressPercentage: number;
  readyForReport: boolean;
}

export interface FinalReportResult {
  overallScore: number;
  technicalScore: number;
  communicationScore: number;
  readinessScore: number;
  strengths: string[];
  weaknesses: string[];
  recommendations: string[];
  summary: string;
  verdict: string;
}
