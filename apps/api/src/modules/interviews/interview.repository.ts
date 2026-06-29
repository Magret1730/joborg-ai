import type { Interview } from "./interview.types.js";

export class InterviewRepository {
  async findAll(): Promise<Interview[]> {
    return [];
  }

  async findById(_id: string): Promise<Interview | null> {
    return null;
  }
}
