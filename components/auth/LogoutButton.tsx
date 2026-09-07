"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";

export function LogoutButton({ className = "" }: { className?: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleLogout() {
    setLoading(true);
    await signOut(auth);
    router.push("/login");
    router.refresh();
  }

  return (
    <button
      onClick={handleLogout}
      disabled={loading}
      className={`text-xs uppercase tracking-[0.2em] text-white/50 transition-colors hover:text-brand disabled:opacity-50 ${className}`}
    >
      {loading ? "..." : "Выйти"}
    </button>
  );
}
