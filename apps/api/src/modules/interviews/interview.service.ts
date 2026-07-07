import { API_MESSAGES } from "../../constants/apiMessages.js";
import type { GenerateInterviewInput } from "../../lib/validation/generateInterview.schema.js";
import type { EvaluateAnswerInput } from "../../lib/validation/evaluateAnswer.schema.js";
import { AppError } from "../../utils/AppError.js";
import { calculateInterviewProgress } from "../../utils/calculateInterviewProgress.js";
import { resolveInterviewStatus } from "../../utils/resolveInterviewStatus.js";
import { AiService } from "../ai/ai.service.js";
import type { InterviewGenerationResponse } from "../ai/types/ai.types.js";
import { InterviewRepository } from "./interview.repository.js";
import type {
  AnswerFeedback,
  FinalReportResult,
  GeneratedInterviewResult,
  InterviewDetail,
  InterviewListItem,
  InterviewRecord,
  SubmitAnswerResult,
} from "./interview.types.js";

export class InterviewService {
  constructor(
    private readonly repository = new InterviewRepository(),
    private readonly aiService = new AiService(),
  ) {}

  private async getOwnedInterviewOrThrow(
    interviewId: string,
    userId: string,
  ): Promise<InterviewRecord> {
    const interview = await this.repository.findInterviewById(
      interviewId,
      userId,
    );

    if (!interview) {
      throw new AppError(API_MESSAGES.INTERVIEW_NOT_FOUND, 404);
    }

    return interview;
  }

  async createInterviewFromGeneration(
    userId: string,
    input: GenerateInterviewInput,
    generated: InterviewGenerationResponse,
  ): Promise<GeneratedInterviewResult> {
    const record = await this.repository.createInterview({
      title: input.title,
      companyName: input.companyName,
      jobDescription: input.jobDescription,
      interviewTitle: generated.interviewTitle,
      questionsJson: generated.questions,
      userId,
    });

    return {
      interviewId: record.id,
      interviewTitle: record.title,
      companyName: record.company_name ?? input.companyName,
      status: record.status,
      questions: generated.questions,
    };
  }

  async listInterviews(userId: string): Promise<InterviewListItem[]> {
    return this.repository.findAllInterviews(userId);
  }

  async getInterviewById(
    id: string,
    userId: string,
  ): Promise<InterviewDetail> {
    const record = await this.getOwnedInterviewOrThrow(id, userId);
    const answers = await this.repository.findAnswersByInterviewId(id);

    return this.repository.mapInterviewDetail(record, answers);
  }

  async submitAnswer(
    userId: string,
    interviewId: string,
    payload: EvaluateAnswerInput,
  ): Promise<SubmitAnswerResult> {
    const interview = await this.getOwnedInterviewOrThrow(interviewId, userId);

    // TODO(Pricing): Limit answer evaluations per plan before calling Gemini.
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

    const questionCount = interview.questions_json.length;
    const answeredCount =
      await this.repository.countAnswersByInterviewId(interviewId);
    const progress = calculateInterviewProgress(questionCount, answeredCount);
    const status = resolveInterviewStatus(
      answeredCount,
      interview.final_report_json !== null,
    );

    await this.repository.updateInterviewStatus(interviewId, status);

    return {
      questionIndex: payload.questionIndex,
      answerText: payload.answerText,
      score: evaluation.score,
      feedback: evaluation as AnswerFeedback,
      status,
      ...progress,
    };
  }

  async deleteInterview(userId: string, id: string): Promise<void> {
    const deleted = await this.repository.deleteInterviewById(id, userId);

    if (!deleted) {
      throw new AppError(API_MESSAGES.INTERVIEW_NOT_FOUND, 404);
    }
  }

  async generateFinalReport(
    userId: string,
    interviewId: string,
  ): Promise<FinalReportResult> {
    const interview = await this.getOwnedInterviewOrThrow(interviewId, userId);
    const answers = await this.repository.findAnswersByInterviewId(interviewId);
    const questionCount = interview.questions_json.length;

    if (answers.length < questionCount) {
      throw new AppError(API_MESSAGES.INTERVIEW_NOT_READY_FOR_REPORT, 400);
    }

    // TODO(Pricing): Limit final report generation/regeneration per plan before calling Gemini.
    const report = await this.aiService.generateFinalReport({
      interviewTitle: interview.title,
      companyName: interview.company_name ?? "Unknown Company",
      jobDescription: interview.job_description,
      answers: answers.map((answer) => ({
        questionIndex: answer.question_index,
        questionText: answer.question_text,
        questionType: answer.question_type,
        answerText: answer.answer_text,
        score: answer.score ?? 0,
        feedback: answer.feedback_json,
      })),
    });

    await this.repository.updateFinalReport(
      interviewId,
      report,
      report.overallScore,
    );

    return report;
  }
}
