"use client";

import { useRouter } from "next/navigation";
import { ThemeProvider } from "next-themes";
import { RouterProvider } from "@heroui/react";

export function Providers({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="dark"
      enableSystem={false}
      storageKey="joborg-ai-theme"
    >
      <RouterProvider navigate={router.push}>{children}</RouterProvider>
    </ThemeProvider>
  );
}
