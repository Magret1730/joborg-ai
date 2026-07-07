const DEFAULT_SITE_URL = "http://localhost:3000";

export const siteConfig = {
  name: "Joborg AI",
  title: "Joborg AI | AI Interview Coach",
  description:
    "Turn any job description into a personalized AI mock interview with answer feedback and a readiness report.",
  ogImagePath: "/og-image.png",
} as const;

export function getSiteUrl(): string {
  const configuredUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim();

  if (configuredUrl) {
    return configuredUrl.replace(/\/$/, "");
  }

  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }

  return DEFAULT_SITE_URL;
}
