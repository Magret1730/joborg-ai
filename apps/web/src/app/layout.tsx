import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "@/components/providers/Providers";
import { getSiteUrl, getSocialImagePath, siteConfig } from "@/lib/site";

const siteUrl = getSiteUrl();
const socialImagePath = getSocialImagePath();
const socialImageUrl = new URL(socialImagePath, siteUrl).toString();

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: siteConfig.title,
    template: "%s | Joborg AI",
  },
  description: siteConfig.description,
  applicationName: siteConfig.name,
  keywords: [...siteConfig.keywords],
  authors: [{ name: siteConfig.creator }],
  creator: siteConfig.creator,
  icons: {
    icon: siteConfig.iconPath,
    shortcut: siteConfig.iconPath,
    apple: "/apple-icon.png",
  },
  openGraph: {
    type: "website",
    url: siteUrl,
    siteName: siteConfig.name,
    title: siteConfig.title,
    description: siteConfig.description,
    images: [
      {
        url: socialImagePath,
        width: socialImagePath === siteConfig.ogImagePath ? 1200 : 512,
        height: socialImagePath === siteConfig.ogImagePath ? 630 : 512,
        alt: "Joborg AI — AI Interview Coach",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.title,
    description: siteConfig.description,
    images: [socialImageUrl],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
