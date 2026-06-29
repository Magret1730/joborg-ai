export type InterviewStatus = "pending" | "in_progress" | "completed";

export interface Interview {
  id: string;
  jobTitle: string;
  company: string;
  status: InterviewStatus;
  createdAt: string;
}
