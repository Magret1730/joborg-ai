import { GoogleGenerativeAI } from "@google/generative-ai";
import { API_MESSAGES } from "../../constants/apiMessages.js";
import { env } from "../../config/env.js";
import { AppError } from "../../utils/AppError.js";
import { GEMINI_MODEL } from "./types/ai.types.js";

const GEMINI_TIMEOUT_MS = 30_000;

export class GeminiService {
  private client: GoogleGenerativeAI | null = null;

  private getClient(): GoogleGenerativeAI {
    if (!env.geminiApiKey) {
      throw new AppError(API_MESSAGES.GEMINI_NOT_CONFIGURED, 503);
    }

    if (!this.client) {
      this.client = new GoogleGenerativeAI(env.geminiApiKey);
    }

    return this.client;
  }

  async generateContent(prompt: string): Promise<string> {
    try {
      const client = this.getClient();
      const model = client.getGenerativeModel({
        model: GEMINI_MODEL,
        generationConfig: {
          responseMimeType: "application/json",
          temperature: 0.7,
        },
      });

      const result = await Promise.race([
        model.generateContent(prompt),
        new Promise<never>((_, reject) => {
          setTimeout(() => {
            reject(new AppError(API_MESSAGES.GEMINI_TIMEOUT, 504));
          }, GEMINI_TIMEOUT_MS);
        }),
      ]);

      const text = result.response.text();

      if (!text?.trim()) {
        throw new AppError(API_MESSAGES.GEMINI_INVALID_JSON, 502);
      }

      return text;
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }

      const message =
        error instanceof Error ? error.message.toLowerCase() : "";

      if (
        message.includes("api key") ||
        message.includes("permission denied") ||
        message.includes("unauthorized")
      ) {
        throw new AppError(API_MESSAGES.GEMINI_INVALID_KEY, 401);
      }

      throw new AppError(API_MESSAGES.GEMINI_UNAVAILABLE, 503);
    }
  }
}
