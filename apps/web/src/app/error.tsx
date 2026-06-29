"use client";

import { useEffect } from "react";
import { ErrorState } from "@/components/ui/ErrorState";

type ErrorPageProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function ErrorPage({ error, reset }: ErrorPageProps) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <ErrorState
      title="Unexpected error"
      message={error.message || "An unexpected error occurred. Please try again."}
      onRetry={reset}
      retryLabel="Try again"
    />
  );
}
