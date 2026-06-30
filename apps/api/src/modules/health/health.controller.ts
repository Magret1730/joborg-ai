import type { Request, Response } from "express";
import { isDbConfigured, testDatabaseConnection } from "../../config/db.js";
import { AppError } from "../../utils/AppError.js";
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

export const getDatabaseHealth = asyncHandler(
  async (_req: Request, res: Response) => {
    if (!isDbConfigured()) {
      throw new AppError("Database is not configured", 503);
    }

    await testDatabaseConnection();

    sendSuccess({
      res,
      message: "Database connection healthy",
      data: {
        database: "connected",
      },
    });
  },
);
