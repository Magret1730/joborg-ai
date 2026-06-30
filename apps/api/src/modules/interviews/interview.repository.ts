import type { InterviewRecord } from "./interview.types.js";

export class InterviewRepository {
  async findAll(): Promise<InterviewRecord[]> {
    return [];
  }

  async findById(_id: string): Promise<InterviewRecord | null> {
    return null;
  }
}
