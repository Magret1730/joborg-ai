import type {
  GenerateInterviewInput,
  GenerateInterviewResponse,
  InterviewDetail,
  InterviewListItem,
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
};
