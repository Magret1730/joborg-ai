import type {
  FinalReportResponse,
  GenerateInterviewInput,
  GenerateInterviewResponse,
  InterviewDetail,
  InterviewListItem,
  SubmitAnswerPayload,
  SubmitAnswerResponse,
} from "@/types/interview";
import { api } from "./api";

type ApiEnvelope<T> = {
  success: true;
  message: string;
  data: T;
};

async function unwrap<T>(promise: Promise<ApiEnvelope<T>>): Promise<T> {
  const response = await promise;
  return response.data;
}

export const interviewService = {
  generate: (input: GenerateInterviewInput) =>
    unwrap(
      api.post<ApiEnvelope<GenerateInterviewResponse>>(
        "/interviews/generate",
        input,
      ),
    ),

  list: () =>
    unwrap(api.get<ApiEnvelope<InterviewListItem[]>>("/interviews")),

  getById: (id: string) =>
    unwrap(api.get<ApiEnvelope<InterviewDetail>>(`/interviews/${id}`)),

  submitAnswer: (interviewId: string, payload: SubmitAnswerPayload) =>
    unwrap(
      api.post<ApiEnvelope<SubmitAnswerResponse>>(
        `/interviews/${interviewId}/answers`,
        payload,
      ),
    ),

  delete: async (id: string) => {
    await api.delete<ApiEnvelope<unknown>>(`/interviews/${id}`);
  },

  generateFinalReport: (interviewId: string) =>
    unwrap(
      api.post<ApiEnvelope<FinalReportResponse>>(
        `/interviews/${interviewId}/final-report`,
      ),
    ),
};
