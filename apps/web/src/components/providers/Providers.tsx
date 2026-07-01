"use client";

import { useRouter } from "next/navigation";
import { ThemeProvider } from "next-themes";
import { RouterProvider } from "@heroui/react";
import { AuthProvider } from "@/context/AuthContext";
import { ToastProvider } from "@/components/providers/ToastProvider";

export function Providers({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="dark"
      enableSystem={false}
      storageKey="joborg-ai-theme"
    >
      <RouterProvider navigate={router.push}>
        <AuthProvider>
          {children}
          <ToastProvider />
        </AuthProvider>
      </RouterProvider>
    </ThemeProvider>
  );
}
