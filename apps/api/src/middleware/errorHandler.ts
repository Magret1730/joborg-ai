import type { NextFunction, Request, Response } from "express";
import { ZodError } from "zod";
import { API_MESSAGES } from "../constants/apiMessages.js";
import { env } from "../config/env.js";
import { AppError } from "../utils/AppError.js";
import { sendError } from "../utils/sendResponse.js";

function formatZodError(error: ZodError): string {
  return error.issues.map((issue) => issue.message).join(", ");
}

export function errorHandler(
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction,
) {
  if (err instanceof ZodError) {
    sendError({
      res,
      message: formatZodError(err) || API_MESSAGES.VALIDATION_FAILED,
      statusCode: 400,
    });
    return;
  }

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
