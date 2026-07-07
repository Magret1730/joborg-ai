import { Suspense } from "react";
import { LoadingState } from "@/components/ui/LoadingState";
import { LoginForm } from "./LoginForm";

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
