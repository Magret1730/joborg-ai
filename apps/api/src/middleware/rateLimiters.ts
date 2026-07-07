import type { Request } from "express";
import rateLimit, { ipKeyGenerator } from "express-rate-limit";
import { sendError } from "../utils/sendResponse.js";

const DAY_MS = 24 * 60 * 60 * 1000;

const RATE_LIMIT_MESSAGES = {
  generateInterview:
    "You can generate 1 interview per day on the MVP version. Please try again tomorrow.",
  evaluateAnswer:
    "You can evaluate up to 5 answers per day on the MVP version. Please try again tomorrow.",
  finalReport:
    "You can generate 1 final report per day on the MVP version. Please try again tomorrow.",
} as const;

function userOrIpKey(req: Request): string {
  if (req.user?.id) {
    return `user:${req.user.id}`;
  }

  return ipKeyGenerator(req.ip ?? "");
}

function createDailyAiLimiter(
  scope: string,
  max: number,
  message: string,
) {
  return rateLimit({
    windowMs: DAY_MS,
    max,
    standardHeaders: true,
    legacyHeaders: false,
    keyGenerator: (req) => `${scope}:${userOrIpKey(req)}`,
    handler: (_req, res) => {
      sendError({ res, message, statusCode: 429 });
    },
  });
}

// TODO(Pricing): Replace MVP rate limits with Joborg plan-based usage quotas.
export const generateInterviewRateLimiter = createDailyAiLimiter(
  "generate-interview",
  1,
  RATE_LIMIT_MESSAGES.generateInterview,
);

export const evaluateAnswerRateLimiter = createDailyAiLimiter(
  "evaluate-answer",
  5,
  RATE_LIMIT_MESSAGES.evaluateAnswer,
);

export const finalReportRateLimiter = createDailyAiLimiter(
  "final-report",
  1,
  RATE_LIMIT_MESSAGES.finalReport,
);
