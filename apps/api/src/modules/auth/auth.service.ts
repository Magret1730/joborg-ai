import { API_MESSAGES } from "../../constants/apiMessages.js";
import { env } from "../../config/env.js";
import type { LoginInput, RegisterInput } from "../../lib/validation/auth.schema.js";
import { AppError } from "../../utils/AppError.js";
import { signToken } from "../../utils/jwt.js";
import { comparePassword, hashPassword } from "../../utils/password.js";
import { AuthRepository } from "./auth.repository.js";
import type { AuthSession, PublicUser } from "./auth.types.js";

function assertJwtConfigured(): void {
  if (!env.jwtSecret) {
    throw new AppError(API_MESSAGES.JWT_NOT_CONFIGURED, 503);
  }
}

export class AuthService {
  constructor(private readonly repository = new AuthRepository()) {}

  async register(input: RegisterInput): Promise<AuthSession> {
    assertJwtConfigured();

    const passwordHash = await hashPassword(input.password);
    const user = await this.repository.createUser({
      name: input.name,
      email: input.email,
      passwordHash,
    });

    const token = signToken({
      userId: user.id,
      email: user.email,
    });

    return { user, token };
  }

  async login(input: LoginInput): Promise<AuthSession> {
    assertJwtConfigured();

    const record = await this.repository.findByEmail(input.email);

    if (!record) {
      throw new AppError(API_MESSAGES.INVALID_CREDENTIALS, 401);
    }

    const isValidPassword = await comparePassword(
      input.password,
      record.password_hash,
    );

    if (!isValidPassword) {
      throw new AppError(API_MESSAGES.INVALID_CREDENTIALS, 401);
    }

    const user: PublicUser = {
      id: record.id,
      name: record.name,
      email: record.email,
      plan: record.plan,
    };

    const token = signToken({
      userId: user.id,
      email: user.email,
    });

    return { user, token };
  }

  async getUserById(userId: string): Promise<PublicUser> {
    const user = await this.repository.findById(userId);

    if (!user) {
      throw new AppError(API_MESSAGES.INVALID_TOKEN, 401);
    }

    return user;
  }
}
