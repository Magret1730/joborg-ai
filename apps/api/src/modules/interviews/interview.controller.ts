import type { Request, Response } from "express";
import { API_MESSAGES } from "../../constants/apiMessages.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { AppError } from "../../utils/AppError.js";
import { sendSuccess } from "../../utils/sendResponse.js";
import { AiService } from "../ai/ai.service.js";
import { InterviewService } from "./interview.service.js";

const interviewService = new InterviewService();
const aiService = new AiService();

function getAuthenticatedUserId(req: Request): string {
  if (!req.user?.id) {
    throw new AppError(API_MESSAGES.UNAUTHORIZED, 401);
  }

  return req.user.id;
}

export const generateInterview = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = getAuthenticatedUserId(req);

    // TODO(Pricing): Enforce plan limits before calling Gemini.
    const generated = await aiService.generateInterviewQuestions(req.body);
    const result = await interviewService.createInterviewFromGeneration(
      userId,
      req.body,
      generated,
    );

    sendSuccess({
      res,
      message: API_MESSAGES.INTERVIEW_CREATED,
      data: result,
      statusCode: 201,
    });
  },
);

export const listInterviews = asyncHandler(async (req: Request, res: Response) => {
  const userId = getAuthenticatedUserId(req);
  const interviews = await interviewService.listInterviews(userId);

  sendSuccess({
    res,
    message: "Interviews retrieved successfully",
    data: interviews,
  });
});

export const getInterview = asyncHandler(async (req: Request, res: Response) => {
  const userId = getAuthenticatedUserId(req);
  const interview = await interviewService.getInterviewById(
    String(req.params.id),
    userId,
  );

  sendSuccess({
    res,
    message: "Interview retrieved successfully",
    data: interview,
  });
});

export const submitAnswer = asyncHandler(async (req: Request, res: Response) => {
  const userId = getAuthenticatedUserId(req);

  // TODO(Pricing): Limit re-evaluations based on subscription plan.
  const result = await interviewService.submitAnswer(
    userId,
    String(req.params.id),
    req.body,
  );

  sendSuccess({
    res,
    message: API_MESSAGES.ANSWER_EVALUATED,
    data: result,
  });
});

export const deleteInterview = asyncHandler(async (req: Request, res: Response) => {
  const userId = getAuthenticatedUserId(req);
  await interviewService.deleteInterview(userId, String(req.params.id));

  sendSuccess({
    res,
    message: API_MESSAGES.INTERVIEW_DELETED,
  });
});

export const generateFinalReport = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = getAuthenticatedUserId(req);

    // TODO(Pricing): Premium users can regenerate reports.
    const report = await interviewService.generateFinalReport(
      userId,
      String(req.params.id),
    );

    sendSuccess({
      res,
      message: API_MESSAGES.FINAL_REPORT_GENERATED,
      data: report,
    });
  },
);
