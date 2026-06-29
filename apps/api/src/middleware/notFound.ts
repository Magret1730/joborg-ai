import type { Request, Response } from "express";
import { sendError } from "../utils/sendResponse.js";

export function notFound(_req: Request, res: Response) {
  sendError({
    res,
    message: "Route not found",
    statusCode: 404,
  });
}
