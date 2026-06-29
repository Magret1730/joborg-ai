import { AppError } from "../../utils/AppError.js";

export class InterviewService {
  async listInterviews() {
    throw new AppError("Not implemented yet", 501);
  }

  async getInterviewById(_id: string) {
    throw new AppError("Not implemented yet", 501);
  }

  async createInterview() {
    throw new AppError("Not implemented yet", 501);
  }
}
