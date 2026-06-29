import type { NextFunction, Request, Response } from "express";
import { env } from "../config/env.js";
import { AppError } from "../utils/AppError.js";
import { sendError } from "../utils/sendResponse.js";

export function errorHandler(
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction,
) {
  if (err instanceof AppError) {
    sendError({
      res,
      message: err.message,
      statusCode: err.statusCode,
    });
    return;
  }

  console.error(err);

  sendError({
    res,
    message: env.isProduction ? "Internal server error" : "Something went wrong",
    statusCode: 500,
  });
}
