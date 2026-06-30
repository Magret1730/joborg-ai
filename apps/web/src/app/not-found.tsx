import Link from "next/link";
import { FiHelpCircle } from "react-icons/fi";
import { Button } from "@/components/ui/Button";

export default function NotFoundPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[var(--bg)] px-4 py-12 text-[var(--text)]">
      <div className="w-full max-w-lg rounded-[var(--radius-lg)] border border-[var(--card-border)] bg-[var(--card)] p-8 text-center shadow-[var(--card-shadow)]">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[var(--info-soft)] text-[var(--info)]">
          <FiHelpCircle size={22} />
        </div>
        <h1 className="text-2xl font-bold text-[var(--text)]">Page not found</h1>
        <p className="mt-2 text-sm text-[var(--muted)]">
          The page you are looking for does not exist or may have been moved.
        </p>
        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Link href="/dashboard">
            <Button className="w-full sm:w-auto">Go to Dashboard</Button>
          </Link>
          <Link href="/">
            <Button variant="secondary" className="w-full sm:w-auto">
              Go Home
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
