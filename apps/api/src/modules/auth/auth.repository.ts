import { API_MESSAGES } from "../../constants/apiMessages.js";
import { getDb } from "../../config/db.js";
import { AppError } from "../../utils/AppError.js";
import type { CreateUserInput, PublicUser, UserRecord } from "./auth.types.js";

function isUniqueViolation(error: unknown): boolean {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    error.code === "23505"
  );
}

function mapPublicUser(record: UserRecord): PublicUser {
  return {
    id: record.id,
    name: record.name,
    email: record.email,
    plan: record.plan,
  };
}

export class AuthRepository {
  private get db() {
    return getDb();
  }

  async createUser(input: CreateUserInput): Promise<PublicUser> {
    try {
      const [record] = await this.db<UserRecord>("users")
        .insert({
          name: input.name,
          email: input.email.toLowerCase(),
          password_hash: input.passwordHash,
          plan: "free",
        })
        .returning("*");

      return mapPublicUser(record);
    } catch (error) {
      if (isUniqueViolation(error)) {
        throw new AppError(API_MESSAGES.EMAIL_ALREADY_IN_USE, 409);
      }

      throw new AppError(API_MESSAGES.DATABASE_ERROR, 500);
    }
  }

  async findByEmail(email: string): Promise<UserRecord | null> {
    try {
      const record = await this.db<UserRecord>("users")
        .where({ email: email.toLowerCase() })
        .first();

      return record ?? null;
    } catch {
      throw new AppError(API_MESSAGES.DATABASE_ERROR, 500);
    }
  }

  async findById(id: string): Promise<PublicUser | null> {
    try {
      const record = await this.db<UserRecord>("users").where({ id }).first();

      return record ? mapPublicUser(record) : null;
    } catch {
      throw new AppError(API_MESSAGES.DATABASE_ERROR, 500);
    }
  }
}
