import Link from "next/link";
import { FiAlertCircle } from "react-icons/fi";
import { Button } from "./Button";

type ErrorStateProps = {
  title?: string;
  message: string;
  onRetry?: () => void;
  retryLabel?: string;
  dashboardHref?: string;
  homeHref?: string;
};

export function ErrorState({
  title = "Something went wrong",
  message,
  onRetry,
  retryLabel = "Try again",
  dashboardHref = "/dashboard",
  homeHref = "/",
}: ErrorStateProps) {
  return (
    <div className="flex min-h-[50vh] items-center justify-center px-4 py-12">
      <div className="w-full max-w-lg rounded-[var(--radius-lg)] border border-[var(--card-border)] bg-[var(--card)] p-8 text-center shadow-[var(--card-shadow)]">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[var(--danger-soft)] text-[var(--danger)]">
          <FiAlertCircle size={22} />
        </div>
        <h2 className="text-xl font-semibold text-[var(--text)]">{title}</h2>
        <p className="mt-2 text-sm leading-relaxed text-[var(--muted)]">
          {message}
        </p>
        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
          {onRetry && (
            <Button onClick={onRetry} className="w-full sm:w-auto">
              {retryLabel}
            </Button>
          )}
          <Link href={dashboardHref}>
            <Button variant="secondary" className="w-full sm:w-auto">
              Back to dashboard
            </Button>
          </Link>
          <Link href={homeHref}>
            <Button variant="ghost" className="w-full sm:w-auto">
              Go home
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
