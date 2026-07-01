import type { Request, Response } from "express";
import { API_MESSAGES } from "../../constants/apiMessages.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { sendSuccess } from "../../utils/sendResponse.js";
import { AuthService } from "./auth.service.js";

const authService = new AuthService();

export const register = asyncHandler(async (req: Request, res: Response) => {
  const session = await authService.register(req.body);

  sendSuccess({
    res,
    message: API_MESSAGES.ACCOUNT_CREATED,
    data: session,
    statusCode: 201,
  });
});

export const login = asyncHandler(async (req: Request, res: Response) => {
  const session = await authService.login(req.body);

  sendSuccess({
    res,
    message: API_MESSAGES.LOGGED_IN,
    data: session,
  });
});

export const getMe = asyncHandler(async (req: Request, res: Response) => {
  sendSuccess({
    res,
    message: API_MESSAGES.USER_RETRIEVED,
    data: {
      user: req.user,
    },
  });
});

export const logout = asyncHandler(async (_req: Request, res: Response) => {
  sendSuccess({
    res,
    message: API_MESSAGES.LOGGED_OUT,
  });
});
