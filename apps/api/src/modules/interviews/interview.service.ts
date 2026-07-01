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

    // TODO(Pricing): Enforce evaluation limits before calling Gemini.
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

  async deleteInterview(id: string): Promise<void> {
    const deleted = await this.repository.deleteInterviewById(id);

    if (!deleted) {
      throw new AppError(API_MESSAGES.INTERVIEW_NOT_FOUND, 404);
    }
  }

  async generateFinalReport(interviewId: string): Promise<FinalReportResult> {
    const interview = await this.repository.findInterviewById(interviewId);

    if (!interview) {
      throw new AppError(API_MESSAGES.INTERVIEW_NOT_FOUND, 404);
    }

    const answers = await this.repository.findAnswersByInterviewId(interviewId);
    const questionCount = interview.questions_json.length;

    if (answers.length < questionCount) {
      throw new AppError(API_MESSAGES.INTERVIEW_NOT_READY_FOR_REPORT, 400);
    }

    // TODO(Pricing): Enforce report generation limits before calling Gemini.
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
