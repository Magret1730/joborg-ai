"use client";

import Link from "next/link";
import { FiArrowRight } from "react-icons/fi";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/Button";
import { Spinner } from "@/components/ui/Spinner";

type LandingCTAsProps = {
  layout?: "hero" | "footer";
};

function getStartHref(isAuthenticated: boolean) {
  return isAuthenticated ? "/start" : "/auth/login?redirect=/start";
}

function getDashboardHref(isAuthenticated: boolean) {
  return isAuthenticated ? "/dashboard" : "/auth/login?redirect=/dashboard";
}

export function LandingCTAs({ layout = "hero" }: LandingCTAsProps) {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex items-center gap-2 text-[var(--muted)]">
        <Spinner size="sm" />
        <span className="text-sm">Loading...</span>
      </div>
    );
  }

  const startHref = getStartHref(isAuthenticated);
  const dashboardHref = getDashboardHref(isAuthenticated);
  const buttonClassName = layout === "hero" ? "w-full sm:w-auto" : "w-full sm:w-auto";

  return (
    <div
      className={
        layout === "hero"
          ? "flex flex-col gap-3 sm:flex-row"
          : "mt-8 flex flex-col justify-center gap-3 sm:flex-row"
      }
    >
      <Link href={startHref} className="cursor-pointer">
        <Button className={buttonClassName}>
          Start Interview
          <FiArrowRight size={16} />
        </Button>
      </Link>
      <Link href={dashboardHref} className="cursor-pointer">
        <Button variant="secondary" className={buttonClassName}>
          Go to Dashboard
        </Button>
      </Link>
    </div>
  );
}
