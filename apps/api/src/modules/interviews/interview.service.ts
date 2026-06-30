import { API_MESSAGES } from "../../constants/apiMessages.js";
import { AppError } from "../../utils/AppError.js";

export class InterviewService {
  async listInterviews() {
    throw new AppError(API_MESSAGES.NOT_IMPLEMENTED, 501);
  }

  async getInterviewById(_id: string) {
    throw new AppError(API_MESSAGES.NOT_IMPLEMENTED, 501);
  }

  async createInterview() {
    throw new AppError(API_MESSAGES.NOT_IMPLEMENTED, 501);
  }
}
