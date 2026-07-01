"use client";

import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { PlanBadge, UserAvatar } from "@/components/auth/UserAvatar";
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
  const { user, isAuthenticated, isLoading, logout } = useAuth();

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
      <div
        className={`flex items-center gap-2 ${
          variant === "app" ? "flex-wrap justify-end" : ""
        }`}
      >
        <Link href="/auth/login" className="cursor-pointer" onClick={onNavigate}>
          <Button variant="secondary" className={variant === "public" ? "" : "px-3 py-2"}>
            Log In
          </Button>
        </Link>
        {variant === "public" ? (
          <Link
            href="/auth/login?redirect=/start"
            className="cursor-pointer"
            onClick={onNavigate}
          >
            <Button>Start Interview</Button>
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
    <div className="flex items-center gap-3">
      {variant === "public" && (
        <Link href="/dashboard" className="cursor-pointer" onClick={onNavigate}>
          <Button variant="secondary">Dashboard</Button>
        </Link>
      )}

      <div className="hidden items-center gap-3 sm:flex">
        <div className="text-right">
          <p className="text-sm font-medium text-[var(--text)]">{user.name}</p>
          <p className="text-xs text-[var(--muted)]">{user.email}</p>
        </div>
        {variant === "app" && <PlanBadge plan={user.plan} />}
        <UserAvatar name={user.name} />
      </div>

      <div className="flex items-center gap-2 sm:hidden">
        <UserAvatar name={user.name} className="h-9 w-9 text-xs" />
      </div>

      <Button
        variant="secondary"
        className="cursor-pointer px-3 py-2"
        onClick={() => void logout()}
      >
        Log Out
      </Button>
    </div>
  );
}
