"use client";

import { useEffect, useState, type ReactNode } from "react";
import { usePathname } from "next/navigation";
import { X } from "lucide-react";
import { Navbar } from "./Navbar";
import { Sidebar } from "./Sidebar";

const pageTitles: Record<string, { title: string; subtitle?: string }> = {
  "/dashboard": {
    title: "Dashboard",
    subtitle: "Your interview practice overview",
  },
  "/start": {
    title: "Start Interview",
    subtitle: "Generate a tailored mock interview",
  },
  "/history": {
    title: "History",
    subtitle: "Review past interview sessions",
  },
  "/reports": {
    title: "Reports",
    subtitle: "View all completed interview reports",
  },
};

function getPageMeta(pathname: string) {
  if (pathname.startsWith("/interview/") && pathname.endsWith("/report")) {
    return {
      title: "Interview Report",
      subtitle: "Detailed performance breakdown",
    };
  }

  if (pathname.startsWith("/interview/")) {
    return {
      title: "Live Interview",
      subtitle: "Answer questions and get feedback",
    };
  }

  return (
    pageTitles[pathname] ?? {
      title: "Joborg AI",
      subtitle: "Interview practice dashboard",
    }
  );
}

type AppShellProps = {
  children: ReactNode;
};

export function AppShell({ children }: AppShellProps) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const meta = getPageMeta(pathname);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--text)]">
      <div className="flex min-h-screen">
        <div className="hidden w-64 shrink-0 lg:block">
          <div className="fixed inset-y-0 w-64">
            <Sidebar />
          </div>
        </div>

        {mobileOpen && (
          <div className="fixed inset-0 z-40 lg:hidden">
            <button
              type="button"
              className="absolute inset-0 bg-black/60"
              aria-label="Close navigation menu"
              onClick={() => setMobileOpen(false)}
            />
            <div className="absolute inset-y-0 left-0 w-72 max-w-[85vw] shadow-xl">
              <Sidebar onNavigate={() => setMobileOpen(false)} />
              <button
                type="button"
                onClick={() => setMobileOpen(false)}
                className="absolute right-3 top-5 inline-flex h-9 w-9 items-center justify-center rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--card)] text-[var(--text)]"
                aria-label="Close menu"
              >
                <X size={16} />
              </button>
            </div>
          </div>
        )}

        <div className="flex min-h-screen flex-1 flex-col">
          <Navbar
            title={meta.title}
            subtitle={meta.subtitle}
            onMenuClick={() => setMobileOpen(true)}
          />
          <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8">{children}</main>
        </div>
      </div>
    </div>
  );
}
