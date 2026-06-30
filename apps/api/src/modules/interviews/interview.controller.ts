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
