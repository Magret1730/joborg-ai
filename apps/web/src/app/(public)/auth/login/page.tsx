"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Input } from "@heroui/react";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { LoadingState } from "@/components/ui/LoadingState";
import { Spinner } from "@/components/ui/Spinner";

function getRedirectPath(searchParams: URLSearchParams): string {
  const redirect = searchParams.get("redirect");

  if (redirect && redirect.startsWith("/") && !redirect.startsWith("//")) {
    return redirect;
  }

  return "/dashboard";
}

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setValidationError(null);

    if (!email.trim() || !password) {
      setValidationError("Email and password are required.");
      return;
    }

    setIsSubmitting(true);

    try {
      await login({
        email: email.trim(),
        password,
      });
      router.push(getRedirectPath(searchParams));
    } catch {
      // Error toast is handled in AuthContext.
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mx-auto flex min-h-[calc(100vh-12rem)] max-w-md items-center px-4 py-12 sm:px-6">
      <Card padding="lg" className="w-full space-y-6">
        <div className="space-y-2 text-center">
          <h1 className="text-2xl font-bold text-[var(--text)]">Welcome back</h1>
          <p className="text-sm text-[var(--muted)]">
            Log in to continue your interview practice.
          </p>
        </div>

        <form onSubmit={(event) => void handleSubmit(event)} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="login-email" className="text-sm font-medium text-[var(--text)]">
              Email
            </label>
            <Input
              id="login-email"
              type="email"
              autoComplete="email"
              fullWidth
              variant="secondary"
              placeholder="you@example.com"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              disabled={isSubmitting}
              aria-required="true"
            />
          </div>

          <div className="space-y-2">
            <label
              htmlFor="login-password"
              className="text-sm font-medium text-[var(--text)]"
            >
              Password
            </label>
            <Input
              id="login-password"
              type="password"
              autoComplete="current-password"
              fullWidth
              variant="secondary"
              placeholder="Enter your password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              disabled={isSubmitting}
              aria-required="true"
            />
          </div>

          {validationError && (
            <p className="text-sm text-[var(--danger-text)]" role="alert">
              {validationError}
            </p>
          )}

          <Button
            type="submit"
            className="w-full cursor-pointer"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Spinner size="sm" />
                Logging in...
              </>
            ) : (
              "Log In"
            )}
          </Button>
        </form>

        <p className="text-center text-sm text-[var(--muted)]">
          Don&apos;t have an account?{" "}
          <Link
            href="/auth/register"
            className="font-medium text-[var(--accent)] hover:underline"
          >
            Create one
          </Link>
        </p>
      </Card>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="mx-auto flex min-h-[calc(100vh-12rem)] max-w-md items-center px-4 py-12 sm:px-6">
          <LoadingState label="Loading login..." rows={4} />
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  );
}
