"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { getToken, removeToken, setToken } from "@/lib/authToken";
import { getFriendlyErrorMessage } from "@/lib/errorMessages";
import { authService } from "@/services/auth";
import { setUnauthorizedHandler } from "@/services/api";
import type { LoginPayload, RegisterPayload, User } from "@/types/auth";

type AuthContextValue = {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (payload: LoginPayload) => Promise<void>;
  register: (payload: RegisterPayload) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [token, setTokenState] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const clearAuth = useCallback(() => {
    removeToken();
    setUser(null);
    setTokenState(null);
  }, []);

  const refreshUser = useCallback(async () => {
    const storedToken = getToken();

    if (!storedToken) {
      setUser(null);
      setTokenState(null);
      setIsLoading(false);
      return;
    }

    setTokenState(storedToken);
    setIsLoading(true);

    try {
      const { user: currentUser } = await authService.me();
      setUser(currentUser);
    } catch {
      clearAuth();
    } finally {
      setIsLoading(false);
    }
  }, [clearAuth]);

  useEffect(() => {
    setUnauthorizedHandler(() => {
      clearAuth();
    });

    void refreshUser();
  }, [clearAuth, refreshUser]);

  const login = useCallback(
    async (payload: LoginPayload) => {
      try {
        const session = await authService.login(payload);
        setToken(session.token);
        setTokenState(session.token);
        setUser(session.user);
        toast.success("Logged in successfully.", {
          toastId: "auth-login-success",
        });
      } catch (error) {
        toast.error(
          getFriendlyErrorMessage(
            error,
            "We couldn't log you in. Please try again.",
          ),
          { toastId: "auth-login-error" },
        );
        throw error;
      }
    },
    [],
  );

  const register = useCallback(
    async (payload: RegisterPayload) => {
      try {
        const session = await authService.register(payload);
        setToken(session.token);
        setTokenState(session.token);
        setUser(session.user);
        toast.success("Account created successfully.", {
          toastId: "auth-register-success",
        });
      } catch (error) {
        toast.error(
          getFriendlyErrorMessage(
            error,
            "We couldn't create your account. Please try again.",
          ),
          { toastId: "auth-register-error" },
        );
        throw error;
      }
    },
    [],
  );

  const logout = useCallback(async () => {
    try {
      await authService.logout();
    } catch {
      // Token is cleared locally regardless of API response.
    }

    clearAuth();
    toast.success("Logged out successfully.", {
      toastId: "auth-logout-success",
    });
    router.push("/");
  }, [clearAuth, router]);

  const value = useMemo(
    () => ({
      user,
      token,
      isAuthenticated: Boolean(user && token),
      isLoading,
      login,
      register,
      logout,
      refreshUser,
    }),
    [user, token, isLoading, login, register, logout, refreshUser],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
}
