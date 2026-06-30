import { API_MESSAGES } from "../../constants/apiMessages.js";
import type { GenerateInterviewInput } from "../../lib/validation/generateInterview.schema.js";
import { AppError } from "../../utils/AppError.js";
import type { InterviewGenerationResponse } from "../ai/types/ai.types.js";
import { InterviewRepository } from "./interview.repository.js";
import type {
  GeneratedInterviewResult,
  InterviewDetail,
  InterviewListItem,
} from "./interview.types.js";

export class InterviewService {
  constructor(private readonly repository = new InterviewRepository()) {}

  async createInterviewFromGeneration(
    input: GenerateInterviewInput,
    generated: InterviewGenerationResponse,
  ): Promise<GeneratedInterviewResult> {
    const record = await this.repository.createInterview({
      title: input.title,
      companyName: input.companyName,
      jobDescription: input.jobDescription,
      interviewTitle: generated.interviewTitle,
      questionsJson: generated.questions,
    });

    return {
      interviewId: record.id,
      interviewTitle: record.title,
      companyName: record.company_name ?? input.companyName,
      status: record.status,
      questions: generated.questions,
    };
  }

  async listInterviews(): Promise<InterviewListItem[]> {
    return this.repository.findAllInterviews();
  }

  async getInterviewById(id: string): Promise<InterviewDetail> {
    const record = await this.repository.findInterviewById(id);

    if (!record) {
      throw new AppError(API_MESSAGES.INTERVIEW_NOT_FOUND, 404);
    }

    const answers = await this.repository.findAnswersByInterviewId(id);

    return this.repository.mapInterviewDetail(record, answers);
  }
}
