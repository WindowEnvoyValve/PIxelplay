"use client";

interface UserPrefixProps {
  prefix: string;
  color?: string;
  children: React.ReactNode;
}

export function UserPrefix({ prefix, color = "#ff6a00", children }: UserPrefixProps) {
  if (!prefix) return <>{children}</>;

  return (
    <span className="inline-flex items-center gap-1.5">
      <span
        className="font-display text-xs font-bold uppercase tracking-wider"
        style={{ color, textShadow: `0 0 8px ${color}40` }}
      >
        {prefix}
      </span>
      <span className="text-white/90">{children}</span>
    </span>
  );
}
