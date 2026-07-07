"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Input } from "@heroui/react";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Spinner } from "@/components/ui/Spinner";

export default function RegisterPage() {
  const router = useRouter();
  const { register } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setValidationError(null);

    if (!name.trim() || !email.trim() || !password || !confirmPassword) {
      setValidationError("All fields are required.");
      return;
    }

    if (password.length < 6) {
      setValidationError("Password must be at least 6 characters.");
      return;
    }

    if (password !== confirmPassword) {
      setValidationError("Passwords do not match.");
      return;
    }

    setIsSubmitting(true);

    try {
      await register({
        name: name.trim(),
        email: email.trim(),
        password,
      });
      router.push("/auth/login");
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
          <h1 className="text-2xl font-bold text-[var(--text)]">Create account</h1>
          <p className="text-sm text-[var(--muted)]">
            Start practicing interviews tailored to your target roles.
          </p>
        </div>

        <form onSubmit={(event) => void handleSubmit(event)} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="register-name" className="text-sm font-medium text-[var(--text)]">
              Name
            </label>
            <Input
              id="register-name"
              type="text"
              autoComplete="name"
              fullWidth
              variant="secondary"
              placeholder="Your name"
              value={name}
              onChange={(event) => setName(event.target.value)}
              disabled={isSubmitting}
              aria-required="true"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="register-email" className="text-sm font-medium text-[var(--text)]">
              Email
            </label>
            <Input
              id="register-email"
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
              htmlFor="register-password"
              className="text-sm font-medium text-[var(--text)]"
            >
              Password
            </label>
            <Input
              id="register-password"
              type="password"
              autoComplete="new-password"
              fullWidth
              variant="secondary"
              placeholder="At least 6 characters"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              disabled={isSubmitting}
              aria-required="true"
              aria-describedby="register-password-hint"
            />
            <p id="register-password-hint" className="text-xs text-[var(--muted)]">
              Use at least 6 characters.
            </p>
          </div>

          <div className="space-y-2">
            <label
              htmlFor="register-confirm-password"
              className="text-sm font-medium text-[var(--text)]"
            >
              Confirm password
            </label>
            <Input
              id="register-confirm-password"
              type="password"
              autoComplete="new-password"
              fullWidth
              variant="secondary"
              placeholder="Re-enter your password"
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
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
                Creating account...
              </>
            ) : (
              "Create Account"
            )}
          </Button>
        </form>

        <p className="text-center text-sm text-[var(--muted)]">
          Already have an account?{" "}
          <Link
            href="/auth/login"
            className="font-medium text-[var(--accent)] hover:underline"
          >
            Log in
          </Link>
        </p>
      </Card>
    </div>
  );
}
