import { API_MESSAGES } from "../../constants/apiMessages.js";
import { INTERVIEW_STATUS } from "../../constants/interviewStatus.js";
import type { GenerateInterviewInput } from "../../lib/validation/generateInterview.schema.js";
import type { EvaluateAnswerInput } from "../../lib/validation/evaluateAnswer.schema.js";
import { AppError } from "../../utils/AppError.js";
import { AiService } from "../ai/ai.service.js";
import type { InterviewGenerationResponse } from "../ai/types/ai.types.js";
import { InterviewRepository } from "./interview.repository.js";
import type {
  AnswerFeedback,
  GeneratedInterviewResult,
  InterviewDetail,
  InterviewListItem,
  SubmitAnswerResult,
} from "./interview.types.js";

export class InterviewService {
  constructor(
    private readonly repository = new InterviewRepository(),
    private readonly aiService = new AiService(),
  ) {}

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

  async submitAnswer(
    interviewId: string,
    payload: EvaluateAnswerInput,
  ): Promise<SubmitAnswerResult> {
    const interview = await this.repository.findInterviewById(interviewId);

    if (!interview) {
      throw new AppError(API_MESSAGES.INTERVIEW_NOT_FOUND, 404);
    }

    const evaluation = await this.aiService.evaluateAnswer(payload);

    await this.repository.upsertAnswer({
      interviewId,
      questionIndex: payload.questionIndex,
      questionText: payload.questionText,
      questionType: payload.questionType,
      answerText: payload.answerText,
      score: evaluation.score,
      feedback: evaluation,
    });

    if (interview.status === INTERVIEW_STATUS.DRAFT) {
      await this.repository.updateInterviewStatus(
        interviewId,
        INTERVIEW_STATUS.IN_PROGRESS,
      );
    }

    return {
      questionIndex: payload.questionIndex,
      answerText: payload.answerText,
      score: evaluation.score,
      feedback: evaluation as AnswerFeedback,
    };
  }
}
