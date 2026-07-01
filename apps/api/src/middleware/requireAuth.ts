import type { NextFunction, Request, Response } from "express";
import { API_MESSAGES } from "../constants/apiMessages.js";
import { AuthService } from "../modules/auth/auth.service.js";
import { AppError } from "../utils/AppError.js";
import { verifyToken } from "../utils/jwt.js";
import { sendError } from "../utils/sendResponse.js";

const authService = new AuthService();

function extractBearerToken(authorizationHeader: string | undefined): string | null {
  if (!authorizationHeader) {
    return null;
  }

  const [scheme, token] = authorizationHeader.split(" ");

  if (scheme?.toLowerCase() !== "bearer" || !token) {
    return null;
  }

  return token;
}

export async function requireAuth(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const token = extractBearerToken(req.headers.authorization);

    if (!token) {
      sendError({
        res,
        message: API_MESSAGES.UNAUTHORIZED,
        statusCode: 401,
      });
      return;
    }

    const payload = verifyToken(token);
    const user = await authService.getUserById(payload.userId);

    req.user = user;
    next();
  } catch (error) {
    if (error instanceof AppError) {
      sendError({
        res,
        message: error.message,
        statusCode: error.statusCode,
      });
      return;
    }

    next(error);
  }
}
