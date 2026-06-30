"use client";

import { useTheme } from "next-themes";
import { ToastContainer } from "react-toastify";

export function ToastProvider() {
  const { resolvedTheme } = useTheme();

  return (
    <ToastContainer
      position="top-right"
      autoClose={4000}
      hideProgressBar={false}
      newestOnTop
      closeOnClick
      pauseOnHover
      draggable
      theme={resolvedTheme === "light" ? "light" : "dark"}
    />
  );
}
