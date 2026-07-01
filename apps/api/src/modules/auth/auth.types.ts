export type UserPlan = "free" | "premium";

export type UserRecord = {
  id: string;
  name: string;
  email: string;
  password_hash: string;
  plan: UserPlan;
  created_at: Date | string;
  updated_at: Date | string;
};

export type PublicUser = {
  id: string;
  name: string;
  email: string;
  plan: UserPlan;
};

export type AuthSession = {
  user: PublicUser;
  token: string;
};

export type CreateUserInput = {
  name: string;
  email: string;
  passwordHash: string;
};
