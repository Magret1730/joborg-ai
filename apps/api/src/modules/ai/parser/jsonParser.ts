import { API_MESSAGES } from "../../../constants/apiMessages.js";
import { AppError } from "../../../utils/AppError.js";

function stripMarkdownFences(text: string): string {
  let cleaned = text.trim();

  if (cleaned.startsWith("```")) {
    cleaned = cleaned.replace(/^```(?:json)?\s*/i, "");
    cleaned = cleaned.replace(/\s*```$/i, "");
  }

  return cleaned.trim();
}

function extractJsonObject(text: string): string {
  const cleaned = stripMarkdownFences(text);
  const start = cleaned.indexOf("{");
  const end = cleaned.lastIndexOf("}");

  if (start === -1 || end === -1 || end <= start) {
    throw new AppError(API_MESSAGES.GEMINI_INVALID_JSON, 502);
  }

  return cleaned.slice(start, end + 1);
}

export function parseJsonResponse<T>(text: string): T {
  try {
    const jsonText = extractJsonObject(text);
    return JSON.parse(jsonText) as T;
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }

    throw new AppError(API_MESSAGES.GEMINI_INVALID_JSON, 502);
  }
}
