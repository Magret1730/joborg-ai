export type InterviewStatus = "completed" | "in_progress" | "abandoned";

export type QuestionType = "technical" | "behavioral" | "situational";

export type InterviewVerdict = "ready" | "almost_ready" | "needs_practice";

export interface InterviewSummary {
  id: string;
  jobTitle: string;
  company: string;
  score: number | null;
  status: InterviewStatus;
  date: string;
}

export interface InterviewQuestion {
  id: string;
  type: QuestionType;
  question: string;
}

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
