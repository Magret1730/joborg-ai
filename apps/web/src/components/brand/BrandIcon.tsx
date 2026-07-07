import Image from "next/image";

type BrandIconProps = {
  size?: number;
  className?: string;
  priority?: boolean;
};

export function BrandIcon({
  size = 40,
  className = "",
  priority = false,
}: BrandIconProps) {
  return (
    <Image
      src="/icon.png"
      alt=""
      width={size}
      height={size}
      priority={priority}
      className={`shrink-0 rounded-[var(--radius-md)] object-cover ${className}`}
    />
  );
}
