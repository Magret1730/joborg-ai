export type UserPlan = "free" | "premium";

export type User = {
  id: string;
  name: string;
  email: string;
  plan: UserPlan;
};

export type LoginPayload = {
  email: string;
  password: string;
};

export type RegisterPayload = {
  name: string;
  email: string;
  password: string;
};

export type AuthResponse = {
  user: User;
  token: string;
};

export type MeResponse = {
  user: User;
};
