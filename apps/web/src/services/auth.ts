import type {
  AuthResponse,
  LoginPayload,
  MeResponse,
  RegisterPayload,
} from "@/types/auth";
import { api } from "./api";

type ApiEnvelope<T> = {
  success: true;
  message: string;
  data: T;
};

async function unwrap<T>(promise: Promise<ApiEnvelope<T>>): Promise<T> {
  const response = await promise;
  return response.data;
}

export const authService = {
  register: (payload: RegisterPayload) =>
    unwrap(api.post<ApiEnvelope<AuthResponse>>("/auth/register", payload)),

  login: (payload: LoginPayload) =>
    unwrap(api.post<ApiEnvelope<AuthResponse>>("/auth/login", payload)),

  me: () => unwrap(api.get<ApiEnvelope<MeResponse>>("/auth/me")),

  logout: () => api.post<ApiEnvelope<unknown>>("/auth/logout"),
};
