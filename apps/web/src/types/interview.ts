export type InterviewStatus = "draft" | "in_progress" | "completed";

export type QuestionType =
  | "technical"
  | "behavioral"
  | "situational"
  | "problem_solving"
  | "communication"
  | "system_design";

export type InterviewVerdict = "ready" | "almost_ready" | "needs_practice";

export interface InterviewQuestion {
  id: string;
  question: string;
  type: QuestionType;
  difficulty?: string;
  goodAnswerHints?: string[];
}

export interface AnswerFeedback {
  strengths: string[];
  weaknesses: string[];
  improvedAnswer: string;
  followUpQuestion: string;
  shortFeedback: string;
}

export interface Answer {
  id: string;
  interviewId: string;
  questionIndex: number;
  questionText: string;
  questionType: string;
  answerText: string;
  score: number | null;
  feedback: AnswerFeedback | null;
  createdAt: string;
  updatedAt: string;
}

export interface SubmitAnswerPayload {
  questionIndex: number;
  questionText: string;
  questionType: string;
  answerText: string;
  goodAnswerHints?: string[];
}

export interface SubmitAnswerResponse {
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

export interface FinalReportResponse {
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

export interface InterviewDetail {
  id: string;
  title: string;
  companyName: string | null;
  jobDescription: string;
  questions: InterviewQuestion[];
  status: InterviewStatus;
  overallScore: number | null;
  finalReport: FinalReportResponse | null;
  answers: Answer[];
  createdAt: string;
  updatedAt: string;
  questionCount: number;
  answeredCount: number;
  progressPercentage: number;
  readyForReport: boolean;
}

export interface GenerateInterviewInput {
  title: string;
  companyName: string;
  jobDescription: string;
}

export interface GenerateInterviewResponse {
  interviewId: string;
  interviewTitle: string;
  companyName: string;
  status: InterviewStatus;
  questions: InterviewQuestion[];
}

/** @deprecated Use InterviewListItem for API-backed lists */
export interface InterviewSummary {
  id: string;
  jobTitle: string;
  company: string;
  score: number | null;
  status: InterviewStatus;
  date: string;
}

/** @deprecated Use AnswerFeedback for API-backed evaluation */
export interface InterviewFeedback {
  summary: string;
  score: number;
  tips: string[];
}

export interface InterviewReport {
  id: string;
  jobTitle: string;
  company: string;
  overallScore: number;
  technical: number;
  communication: number;
  problemSolving: number;
  readiness: number;
  strengths: string[];
  weaknesses: string[];
  recommendations: string[];
  verdict: InterviewVerdict;
}

export interface DashboardStats {
  interviewsCompleted: number;
  averageScore: number;
  readinessScore: number;
  lastInterview: string;
}
