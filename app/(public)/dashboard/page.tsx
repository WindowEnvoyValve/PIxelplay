"use client";

import { useAuth } from "@/components/auth/AuthProvider";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function DashboardPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="animate-pulse text-brand">ЗАГРУЗКА...</div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="py-8">
      <h1 className="text-3xl font-bold text-brand">Dashboard</h1>
      <p className="mt-4 text-white/70">Добро пожаловать, {user.email}</p>
    </div>
  );
}
