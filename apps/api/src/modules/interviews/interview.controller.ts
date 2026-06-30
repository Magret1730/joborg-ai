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
    const result = await aiService.generateInterviewQuestions(req.body);

    sendSuccess({
      res,
      message: API_MESSAGES.INTERVIEW_GENERATED,
      data: result,
    });
  },
);

export const listInterviews = asyncHandler(
  async (_req: Request, res: Response) => {
    const interviews = await interviewService.listInterviews();
    res.json(interviews);
  },
);

export const getInterview = asyncHandler(async (req: Request, res: Response) => {
  const id = String(req.params.id);
  const interview = await interviewService.getInterviewById(id);
  res.json(interview);
});

export const createInterview = asyncHandler(
  async (_req: Request, res: Response) => {
    const interview = await interviewService.createInterview();
    res.json(interview);
  },
);
