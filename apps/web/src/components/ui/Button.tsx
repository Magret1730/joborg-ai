import type { ButtonHTMLAttributes, ReactNode } from "react";

type ButtonVariant = "primary" | "secondary" | "ghost";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  children: ReactNode;
  href?: string;
};

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    "bg-[var(--primary)] text-white hover:bg-[var(--primary-hover)] border border-transparent",
  secondary:
    "bg-[var(--surface)] text-[var(--text)] border border-[var(--border)] hover:border-[var(--primary)] hover:bg-[var(--surface-hover)]",
  ghost:
    "bg-transparent text-[var(--muted)] border border-transparent hover:text-[var(--text)] hover:bg-[var(--surface-hover)]",
};

export function Button({
  variant = "primary",
  className = "",
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={`inline-flex items-center justify-center gap-2 rounded-[var(--radius-md)] px-4 py-2.5 text-sm font-medium transition disabled:cursor-not-allowed disabled:opacity-50 ${variantStyles[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
