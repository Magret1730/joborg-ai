import { AppError } from "../../utils/AppError.js";

export class GeminiService {
  async generateQuestions() {
    throw new AppError("Gemini integration not implemented yet", 501);
  }

  async evaluateAnswer() {
    throw new AppError("Gemini integration not implemented yet", 501);
  }

  async generateReport() {
    throw new AppError("Gemini integration not implemented yet", 501);
  }
}
