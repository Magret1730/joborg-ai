import Link from "next/link";
import {
  FiBarChart2,
  FiCalendar,
  FiClipboard,
  FiCpu,
  FiStar,
} from "react-icons/fi";
import { PublicLayout } from "@/components/public/PublicLayout";
import { LandingCTAs } from "@/components/public/LandingCTAs";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

const features = [
  {
    icon: FiCpu,
    title: "Generate tailored interview questions",
    description:
      "Paste a job description and get realistic questions matched to the role, seniority, and skills.",
  },
  {
    icon: FiStar,
    title: "Get AI-powered answer feedback",
    description:
      "Receive instant feedback on clarity, structure, and technical depth after each answer.",
  },
  {
    icon: FiBarChart2,
    title: "Receive a readiness report",
    description:
      "See scores across technical, communication, and problem-solving with actionable recommendations.",
  },
  {
    icon: FiCalendar,
    title: "Save interview history",
    description:
      "Track past sessions, compare progress, and revisit reports before your next interview.",
  },
];

const steps = [
  {
    step: "1",
    title: "Paste job description",
    description:
      "Add the role title, company, and job posting to personalize your mock interview.",
  },
  {
    step: "2",
    title: "Answer interview questions",
    description:
      "Work through behavioral, technical, and situational questions at your own pace.",
  },
  {
    step: "3",
    title: "Get feedback and final report",
    description:
      "Review per-answer feedback and a full readiness report with strengths and next steps.",
  },
];

export default function LandingPage() {
  return (
    <PublicLayout>
      <section className="relative overflow-hidden border-b border-[var(--border)]">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(59,130,246,0.18),transparent_45%),radial-gradient(circle_at_bottom_left,rgba(45,212,191,0.12),transparent_40%)]" />
        <div className="relative mx-auto max-w-6xl px-4 py-20 sm:px-6 lg:py-28">
          <div className="max-w-3xl space-y-6">
            <p className="inline-flex rounded-full border border-[var(--border)] bg-[var(--card)] px-3 py-1 text-xs font-medium uppercase tracking-wide text-[var(--accent)]">
              Joborg AI Interview Coach
            </p>
            <h1 className="text-4xl font-bold tracking-tight text-[var(--text)] sm:text-5xl lg:text-6xl">
              Joborg AI Interview Coach
            </h1>
            <p className="text-lg leading-relaxed text-[var(--muted)] sm:text-xl">
              Turn any job description into a personalized AI mock interview and
              readiness report.
            </p>
            <LandingCTAs layout="hero" />
          </div>
        </div>
      </section>

      <section id="features" className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
        <div className="mb-10 max-w-2xl">
          <h2 className="text-3xl font-bold text-[var(--text)]">
            Everything you need to practice smarter
          </h2>
          <p className="mt-3 text-[var(--muted)]">
            Built for job seekers who want focused, role-specific interview prep
            without generic question banks.
          </p>
        </div>
        <div className="grid gap-6 sm:grid-cols-2">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <Card key={feature.title} padding="lg" hover className="space-y-4">
                <div className="flex h-11 w-11 items-center justify-center rounded-[var(--radius-md)] bg-[var(--primary-soft)] text-[var(--primary)]">
                  <Icon size={20} />
                </div>
                <h3 className="text-lg font-semibold text-[var(--text)]">
                  {feature.title}
                </h3>
                <p className="text-sm leading-relaxed text-[var(--muted)]">
                  {feature.description}
                </p>
              </Card>
            );
          })}
        </div>
      </section>

      <section
        id="how-it-works"
        className="border-y border-[var(--border)] bg-[var(--bg-soft)]"
      >
        <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
          <div className="mb-10 max-w-2xl">
            <h2 className="text-3xl font-bold text-[var(--text)]">How it works</h2>
            <p className="mt-3 text-[var(--muted)]">
              Three simple steps from job description to interview readiness.
            </p>
          </div>
          <div className="grid gap-6 lg:grid-cols-3">
            {steps.map((step) => (
              <Card key={step.step} padding="lg" className="space-y-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--accent-soft)] text-sm font-bold text-[var(--accent)]">
                  {step.step}
                </div>
                <h3 className="text-lg font-semibold text-[var(--text)]">
                  {step.title}
                </h3>
                <p className="text-sm leading-relaxed text-[var(--muted)]">
                  {step.description}
                </p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
        <Card
          padding="lg"
          className="border-[var(--primary-soft)] bg-gradient-to-br from-[var(--surface)] to-[var(--bg-soft)]"
        >
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-2xl space-y-3">
              <div className="flex items-center gap-2 text-[var(--accent)]">
                <FiClipboard size={18} />
                <p className="text-sm font-medium uppercase tracking-wide">
                  Future Joborg integration
                </p>
              </div>
              <h2 className="text-2xl font-bold text-[var(--text)] sm:text-3xl">
                Built to connect with your Joborg workflow
              </h2>
              <p className="text-sm leading-relaxed text-[var(--muted)] sm:text-base">
                Joborg AI will later integrate with Joborg tracked job pages, so
                you can launch mock interviews directly from roles you are already
                monitoring — without copying descriptions manually.
              </p>
            </div>
            <Link href="/dashboard" className="shrink-0 cursor-pointer">
              <Button variant="secondary">Explore Dashboard</Button>
            </Link>
          </div>
        </Card>
      </section>

      <section className="border-t border-[var(--border)] bg-[var(--bg-soft)]">
        <div className="mx-auto max-w-6xl px-4 py-20 text-center sm:px-6">
          <h2 className="text-3xl font-bold text-[var(--text)]">
            Ready to practice for your next interview?
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-[var(--muted)]">
            Start with any job description and get a personalized practice session
            in minutes.
          </p>
          <LandingCTAs layout="footer" />
        </div>
      </section>
    </PublicLayout>
  );
}
