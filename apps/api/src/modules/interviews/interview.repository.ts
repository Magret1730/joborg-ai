import { API_MESSAGES } from "../../constants/apiMessages.js";
import { INTERVIEW_STATUS } from "../../constants/interviewStatus.js";
import { getDb } from "../../config/db.js";
import { AppError } from "../../utils/AppError.js";
import type { InterviewQuestion } from "../ai/types/ai.types.js";
import type {
  AnswerRecord,
  CreateInterviewInput,
  InterviewAnswer,
  InterviewDetail,
  InterviewListItem,
  InterviewRecord,
} from "./interview.types.js";

function toIsoString(value: Date | string): string {
  return value instanceof Date ? value.toISOString() : new Date(value).toISOString();
}

function mapAnswer(record: AnswerRecord): InterviewAnswer {
  return {
    id: record.id,
    interviewId: record.interview_id,
    questionIndex: record.question_index,
    questionText: record.question_text,
    questionType: record.question_type,
    answerText: record.answer_text,
    score: record.score,
    feedback: record.feedback_json,
    createdAt: toIsoString(record.created_at),
    updatedAt: toIsoString(record.updated_at),
  };
}

function mapListItem(
  record: InterviewRecord,
  answeredCount: number,
): InterviewListItem {
  const questions = Array.isArray(record.questions_json)
    ? record.questions_json
    : [];

  return {
    id: record.id,
    title: record.title,
    companyName: record.company_name,
    status: record.status,
    overallScore: record.overall_score,
    createdAt: toIsoString(record.created_at),
    updatedAt: toIsoString(record.updated_at),
    questionCount: questions.length,
    answeredCount,
  };
}

function mapDetail(
  record: InterviewRecord,
  answers: AnswerRecord[],
): InterviewDetail {
  const questions = Array.isArray(record.questions_json)
    ? (record.questions_json as InterviewQuestion[])
    : [];

  return {
    id: record.id,
    title: record.title,
    companyName: record.company_name,
    jobDescription: record.job_description,
    questions,
    status: record.status,
    overallScore: record.overall_score,
    finalReport: record.final_report_json,
    answers: answers.map(mapAnswer),
    createdAt: toIsoString(record.created_at),
    updatedAt: toIsoString(record.updated_at),
  };
}

export class InterviewRepository {
  private get db() {
    return getDb();
  }

  async createInterview(input: CreateInterviewInput): Promise<InterviewRecord> {
    try {
      const [record] = await this.db("interviews")
        .insert({
          title: input.interviewTitle,
          company_name: input.companyName,
          job_description: input.jobDescription,
          questions_json: this.db.raw("?::jsonb", [
            JSON.stringify(input.questionsJson),
          ]),
          status: INTERVIEW_STATUS.DRAFT,
          user_id: null,
        })
        .returning("*");

      return {
        ...record,
        questions_json: input.questionsJson,
      };
    } catch {
      throw new AppError(API_MESSAGES.DATABASE_ERROR, 500);
    }
  }

  async findAllInterviews(): Promise<InterviewListItem[]> {
    try {
      const records = await this.db<InterviewRecord>("interviews").select("*").orderBy(
        "created_at",
        "desc",
      );

      const interviewIds = records.map((record) => record.id);

      const answerCounts =
        interviewIds.length > 0
          ? await this.db("answers")
              .select("interview_id")
              .count("* as count")
              .whereIn("interview_id", interviewIds)
              .groupBy("interview_id")
          : [];

      const countMap = new Map<string, number>(
        answerCounts.map((row) => [
          row.interview_id as string,
          Number(row.count),
        ]),
      );

      return records.map((record) => {
        const questions =
          typeof record.questions_json === "string"
            ? (JSON.parse(record.questions_json) as InterviewQuestion[])
            : (record.questions_json as InterviewQuestion[]);

        return mapListItem(
          { ...record, questions_json: questions },
          countMap.get(record.id) ?? 0,
        );
      });
    } catch {
      throw new AppError(API_MESSAGES.DATABASE_ERROR, 500);
    }
  }

  async findInterviewById(id: string): Promise<InterviewRecord | null> {
    try {
      const record = await this.db<InterviewRecord>("interviews")
        .where({ id })
        .first();

      if (!record) {
        return null;
      }

      const questions =
        typeof record.questions_json === "string"
          ? (JSON.parse(record.questions_json) as InterviewQuestion[])
          : (record.questions_json as InterviewQuestion[]);

      return {
        ...record,
        questions_json: questions,
      };
    } catch {
      throw new AppError(API_MESSAGES.DATABASE_ERROR, 500);
    }
  }

  async findAnswersByInterviewId(interviewId: string): Promise<AnswerRecord[]> {
    try {
      return this.db<AnswerRecord>("answers")
        .where({ interview_id: interviewId })
        .orderBy("question_index", "asc");
    } catch {
      throw new AppError(API_MESSAGES.DATABASE_ERROR, 500);
    }
  }

  mapInterviewDetail(
    record: InterviewRecord,
    answers: AnswerRecord[],
  ): InterviewDetail {
    return mapDetail(record, answers);
  }
}
