import { z } from "zod";
import {
  QUESTION_DIFFICULTIES,
  QUESTION_TYPES,
} from "../../constants/questionTypes.js";
import { API_MESSAGES } from "../../constants/apiMessages.js";
import type { GenerateInterviewInput } from "../../lib/validation/generateInterview.schema.js";
import type { EvaluateAnswerInput } from "../../lib/validation/evaluateAnswer.schema.js";
import { AppError } from "../../utils/AppError.js";
import { GeminiService } from "./gemini.service.js";
import { parseJsonResponse } from "./parser/jsonParser.js";
import { buildEvaluateAnswerPrompt } from "./prompts/evaluateAnswer.prompt.js";
import { buildGenerateInterviewPrompt } from "./prompts/generateInterviewQuestions.prompt.js";
import {
  EXPECTED_QUESTION_COUNT,
  type AnswerEvaluationResponse,
  type InterviewGenerationResponse,
} from "./types/ai.types.js";

const interviewQuestionSchema = z.object({
  id: z.string().min(1),
  question: z.string().min(1),
  type: z.enum([
    QUESTION_TYPES.TECHNICAL,
    QUESTION_TYPES.BEHAVIORAL,
    QUESTION_TYPES.PROBLEM_SOLVING,
    QUESTION_TYPES.COMMUNICATION,
    QUESTION_TYPES.SYSTEM_DESIGN,
  ]),
  difficulty: z.enum([
    QUESTION_DIFFICULTIES.EASY,
    QUESTION_DIFFICULTIES.MEDIUM,
    QUESTION_DIFFICULTIES.HARD,
  ]),
  goodAnswerHints: z.array(z.string().min(1)).min(1),
});

const interviewGenerationResponseSchema = z.object({
  interviewTitle: z.string().min(1),
  questions: z.array(interviewQuestionSchema).length(EXPECTED_QUESTION_COUNT),
});

const answerEvaluationResponseSchema = z.object({
  score: z.number().int().min(0).max(100),
  strengths: z.array(z.string().min(1)).min(1),
  weaknesses: z.array(z.string().min(1)).min(1),
  improvedAnswer: z.string().min(1),
  followUpQuestion: z.string().min(1),
  shortFeedback: z.string().min(1),
});

export class AiService {
  constructor(private readonly geminiService = new GeminiService()) {}

  async generateInterviewQuestions(
    input: GenerateInterviewInput,
  ): Promise<InterviewGenerationResponse> {
    const prompt = buildGenerateInterviewPrompt(input);
    const rawResponse = await this.geminiService.generateContent(prompt);
    const parsed = parseJsonResponse<unknown>(rawResponse);
    const validated = interviewGenerationResponseSchema.safeParse(parsed);

    if (!validated.success) {
      throw new AppError(API_MESSAGES.GEMINI_INVALID_JSON, 502);
    }

    return validated.data;
  }

  async evaluateAnswer(
    input: EvaluateAnswerInput,
  ): Promise<AnswerEvaluationResponse> {
    const prompt = buildEvaluateAnswerPrompt({
      questionText: input.questionText,
      questionType: input.questionType,
      answerText: input.answerText,
      goodAnswerHints: input.goodAnswerHints,
    });
    const rawResponse = await this.geminiService.generateContent(prompt);
    const parsed = parseJsonResponse<unknown>(rawResponse);
    const validated = answerEvaluationResponseSchema.safeParse(parsed);

    if (!validated.success) {
      throw new AppError(API_MESSAGES.GEMINI_INVALID_JSON, 502);
    }

    return validated.data;
  }
}
