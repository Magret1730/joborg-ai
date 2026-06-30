import type { ReactNode } from "react";

type CardProps = {
  children: ReactNode;
  className?: string;
  hover?: boolean;
  padding?: "sm" | "md" | "lg";
};

const paddingStyles = {
  sm: "p-4",
  md: "p-6",
  lg: "p-8",
};

export function Card({
  children,
  className = "",
  hover = false,
  padding = "md",
}: CardProps) {
  return (
    <div
      className={`rounded-[var(--radius-lg)] border border-[var(--card-border)] bg-[var(--card)] shadow-[var(--card-shadow)] ${paddingStyles[padding]} ${
        hover
          ? "transition hover:border-[var(--border-strong)] hover:bg-[var(--surface-hover)]"
          : ""
      } ${className}`}
    >
      {children}
    </div>
  );
}
