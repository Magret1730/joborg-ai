import jwt, { type SignOptions } from "jsonwebtoken";
import { API_MESSAGES } from "../constants/apiMessages.js";
import { env } from "../config/env.js";
import { AppError } from "./AppError.js";

export type JwtPayload = {
  userId: string;
  email: string;
};

export function signToken(payload: JwtPayload): string {
  if (!env.jwtSecret) {
    throw new AppError(API_MESSAGES.JWT_NOT_CONFIGURED, 503);
  }

  const options: SignOptions = {
    expiresIn: env.jwtExpiresIn as SignOptions["expiresIn"],
  };

  return jwt.sign(payload, env.jwtSecret, options);
}

export function verifyToken(token: string): JwtPayload {
  if (!env.jwtSecret) {
    throw new AppError(API_MESSAGES.JWT_NOT_CONFIGURED, 503);
  }

  try {
    const decoded = jwt.verify(token, env.jwtSecret);

    if (
      typeof decoded !== "object" ||
      decoded === null ||
      typeof decoded.userId !== "string" ||
      typeof decoded.email !== "string"
    ) {
      throw new AppError(API_MESSAGES.INVALID_TOKEN, 401);
    }

    return {
      userId: decoded.userId,
      email: decoded.email,
    };
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }

    throw new AppError(API_MESSAGES.INVALID_TOKEN, 401);
  }
}
