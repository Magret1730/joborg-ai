const LOCAL_SITE_URL = "http://localhost:3000";
const PRODUCTION_SITE_URL = "https://joborg-ai-web.vercel.app";

export const siteConfig = {
  name: "Joborg AI",
  title: "Joborg AI | AI Interview Coach",
  description:
    "Turn any job description into a personalized AI mock interview with answer feedback and a readiness report.",
  url: PRODUCTION_SITE_URL,
  iconPath: "/icon.png",
  ogImagePath: "/og-image.png",
  keywords: [
    "Joborg AI",
    "AI interview coach",
    "mock interview",
    "interview practice",
    "AI feedback",
    "career preparation",
    "job interview",
    "readiness report",
  ],
  creator: "Joborg AI",
} as const;

export function getSiteUrl(): string {
  const configuredUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim();

  if (configuredUrl) {
    return configuredUrl.replace(/\/$/, "");
  }

  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }

  if (process.env.NODE_ENV === "production") {
    return PRODUCTION_SITE_URL;
  }

  return LOCAL_SITE_URL;
}

export function getSocialImagePath(): string {
  return siteConfig.ogImagePath;
}
