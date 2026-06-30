export const API_MESSAGES = {
  INTERVIEW_CREATED: "Interview created successfully",
  INTERVIEW_GENERATED: "Interview questions generated successfully",
  INTERVIEW_NOT_FOUND: "Interview not found",
  INTERVIEW_GENERATION_FAILED: "Failed to generate interview questions",
  GEMINI_NOT_CONFIGURED: "Gemini API key is not configured",
  GEMINI_UNAVAILABLE: "AI service is temporarily unavailable",
  GEMINI_INVALID_KEY: "Invalid Gemini API key",
  GEMINI_TIMEOUT: "AI request timed out. Please try again",
  GEMINI_INVALID_JSON: "AI returned an invalid response. Please try again",
  VALIDATION_FAILED: "Validation failed",
  DATABASE_ERROR: "Database operation failed",
  NOT_IMPLEMENTED: "Not implemented yet",
} as const;
