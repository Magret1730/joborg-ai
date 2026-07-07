"use client";

import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { UserMenu } from "@/components/auth/UserMenu";
import { Button } from "@/components/ui/Button";
import { Spinner } from "@/components/ui/Spinner";

type AuthNavActionsProps = {
  variant?: "public" | "app";
  onNavigate?: () => void;
};

export function AuthNavActions({
  variant = "public",
  onNavigate,
}: AuthNavActionsProps) {
  const { user, isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex items-center gap-2 text-[var(--muted)]">
        <Spinner size="sm" />
        <span className="hidden text-sm sm:inline">Loading...</span>
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return (
      <div className="flex items-center gap-2">
        <Link href="/auth/login" className="cursor-pointer" onClick={onNavigate}>
          <Button variant="secondary" className={variant === "public" ? "" : "px-3 py-2"}>
            Log In
          </Button>
        </Link>
        {variant === "public" ? (
          <Link href="/auth/register" className="cursor-pointer" onClick={onNavigate}>
            <Button>Get Started</Button>
          </Link>
        ) : (
          <Link href="/auth/register" className="cursor-pointer" onClick={onNavigate}>
            <Button className="px-3 py-2">Register</Button>
          </Link>
        )}
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2 sm:gap-3">
      {variant === "public" && (
        <Link href="/dashboard" className="cursor-pointer" onClick={onNavigate}>
          <Button variant="secondary">Dashboard</Button>
        </Link>
      )}

      <UserMenu
        user={user}
        compactTrigger={variant === "app"}
        onNavigate={onNavigate}
      />
    </div>
  );
}
