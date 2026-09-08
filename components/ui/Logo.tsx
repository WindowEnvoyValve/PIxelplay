import Image from "next/image";
import Link from "next/link";

interface LogoProps {
  size?: number;
  href?: string | null;
  withWordmark?: boolean;
  className?: string;
}

export function Logo({ size = 100, href = "/", withWordmark = false, className = "" }: LogoProps) {
  const img = (
    <div className="flex items-center justify-center">
      <Image
        src="/logo.png"
        alt="PIXEL — сеть компьютерных клубов"
        width={size}
        height={size}
        className={`object-contain ${className}`}
        priority
      />
    </div>
  );

  if (!href) return img;

  return (
    <Link href={href} className="flex items-center gap-3 transition-transform hover:scale-105">
      {img}
      {withWordmark && (
        <span className="font-display text-xl font-bold tracking-[0.25em] text-white">
          PIXEL
        </span>
      )}
    </Link>
  );
}
