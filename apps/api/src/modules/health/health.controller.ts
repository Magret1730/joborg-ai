import type { Request, Response } from "express";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { sendSuccess } from "../../utils/sendResponse.js";

export const getHealth = asyncHandler(async (_req: Request, res: Response) => {
  sendSuccess({
    res,
    message: "Joborg AI API is healthy",
    data: {
      status: "ok",
      service: "joborg-ai-api",
    },
  });
});
