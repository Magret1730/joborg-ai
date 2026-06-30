export type InterviewStatus = "draft" | "in_progress" | "completed";

export interface InterviewRecord {
  id: string;
  user_id: string | null;
  title: string;
  company_name: string | null;
  job_description: string;
  questions_json: unknown;
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
