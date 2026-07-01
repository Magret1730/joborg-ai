import type { Request, Response } from "express";
import { API_MESSAGES } from "../../constants/apiMessages.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { sendSuccess } from "../../utils/sendResponse.js";
import { AiService } from "../ai/ai.service.js";
import { InterviewService } from "./interview.service.js";

const interviewService = new InterviewService();
const aiService = new AiService();

export const generateInterview = asyncHandler(
  async (req: Request, res: Response) => {
    // TODO(Auth): Associate interview with authenticated Joborg user.
    // TODO(Pricing): Enforce plan limits before calling Gemini.
    const generated = await aiService.generateInterviewQuestions(req.body);
    const result = await interviewService.createInterviewFromGeneration(
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

export const listInterviews = asyncHandler(
  async (_req: Request, res: Response) => {
    const interviews = await interviewService.listInterviews();

    sendSuccess({
      res,
      message: "Interviews retrieved successfully",
      data: interviews,
    });
  },
);

export const getInterview = asyncHandler(async (req: Request, res: Response) => {
  const interview = await interviewService.getInterviewById(String(req.params.id));

  sendSuccess({
    res,
    message: "Interview retrieved successfully",
    data: interview,
  });
});

export const submitAnswer = asyncHandler(async (req: Request, res: Response) => {
  // TODO(Pricing): Limit re-evaluations based on subscription plan.
  const result = await interviewService.submitAnswer(
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
  await interviewService.deleteInterview(String(req.params.id));

  sendSuccess({
    res,
    message: API_MESSAGES.INTERVIEW_DELETED,
  });
});

export const generateFinalReport = asyncHandler(
  async (req: Request, res: Response) => {
    // TODO(Pricing): Premium users can regenerate reports.
    const report = await interviewService.generateFinalReport(
      String(req.params.id),
    );

    sendSuccess({
      res,
      message: API_MESSAGES.FINAL_REPORT_GENERATED,
      data: report,
    });
  },
);
