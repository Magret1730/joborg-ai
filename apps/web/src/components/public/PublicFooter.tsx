import Link from "next/link";
import { AppLogo } from "@/components/layout/PageHeader";

const footerLinks = [
  { label: "Dashboard", href: "/dashboard" },
  { label: "Start Interview", href: "/start" },
  { label: "History", href: "/history" },
  { label: "Reports", href: "/reports" },
];

export function PublicFooter() {
  return (
    <footer className="border-t border-[var(--border)] bg-[var(--bg-soft)]">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <div className="flex flex-col gap-8 md:flex-row md:justify-between">
          <div className="max-w-sm space-y-3">
            <AppLogo />
            <p className="text-sm leading-relaxed text-[var(--muted)]">
              AI-powered interview practice that turns any job description into a
              personalized mock interview and readiness report.
            </p>
          </div>

          <div>
            <p className="mb-3 text-sm font-semibold text-[var(--text)]">
              Quick links
            </p>
            <ul className="space-y-2">
              {footerLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-[var(--muted)] transition hover:text-[var(--primary)]"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <p className="mt-8 border-t border-[var(--border)] pt-6 text-xs text-[var(--muted-light)]">
          © {new Date().getFullYear()} Joborg AI. Built for career-focused interview
          practice.
        </p>
      </div>
    </footer>
  );
}
