import { ApiError } from "@/services/api";

const FRIENDLY_MESSAGES: Record<number, string> = {
  400: "Something in your request wasn't quite right. Please check your input and try again.",
  404: "We couldn't find what you're looking for. It may have been deleted.",
  429: "You've reached your usage limit for now. Please try again later.",
  500: "Something went wrong on our end. Please try again in a moment.",
  503: "The service is temporarily unavailable. Please try again in a moment.",
};

export function getFriendlyErrorMessage(
  error: unknown,
  fallback: string,
): string {
  if (error instanceof ApiError) {
    if (error.message && !error.message.startsWith("Request failed")) {
      return error.message;
    }

    return FRIENDLY_MESSAGES[error.status] ?? fallback;
  }

  if (error instanceof TypeError && error.message === "Failed to fetch") {
    return "We couldn't reach the server. Please check your connection and try again.";
  }

  if (error instanceof Error) {
    if (error.message === "Failed to fetch" || error.message === "Network Error") {
      return "We couldn't reach the server. Please check your connection and try again.";
    }
  }

  return fallback;
}
