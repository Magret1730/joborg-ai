import type { Response } from "express";

type SuccessPayload<T> = {
  res: Response;
  message: string;
  data?: T;
  statusCode?: number;
};

type ErrorPayload = {
  res: Response;
  message: string;
  statusCode?: number;
};

export function sendSuccess<T>({
  res,
  message,
  data,
  statusCode = 200,
}: SuccessPayload<T>) {
  res.status(statusCode).json({
    success: true,
    message,
    ...(data !== undefined ? { data } : {}),
  });
}

export function sendError({ res, message, statusCode = 500 }: ErrorPayload) {
  res.status(statusCode).json({
    success: false,
    message,
  });
}
