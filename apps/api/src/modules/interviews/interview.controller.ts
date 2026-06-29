import type { Request, Response } from "express";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { InterviewService } from "./interview.service.js";

const interviewService = new InterviewService();

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
