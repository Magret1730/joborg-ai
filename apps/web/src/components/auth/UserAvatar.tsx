import { getInitials } from "@/lib/userDisplay";

type UserAvatarProps = {
  name: string;
  className?: string;
};

export function UserAvatar({ name, className = "" }: UserAvatarProps) {
  return (
    <div
      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[var(--primary)] text-sm font-semibold text-white ${className}`}
      aria-hidden="true"
    >
      {getInitials(name)}
    </div>
  );
}

type PlanBadgeProps = {
  plan: string;
};

export function PlanBadge({ plan }: PlanBadgeProps) {
  const isPremium = plan === "premium";

  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold capitalize ${
        isPremium
          ? "bg-[var(--accent-soft)] text-[var(--accent)]"
          : "bg-[var(--surface-hover)] text-[var(--muted)]"
      }`}
    >
      {plan}
    </span>
  );
}
