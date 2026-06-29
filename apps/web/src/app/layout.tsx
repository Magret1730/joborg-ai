import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Joborg AI",
  description: "AI layer for the Joborg career page monitoring platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
