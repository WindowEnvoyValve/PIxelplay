"use client";

import { create } from "zustand";
import type { Profile } from "@/types";

interface AuthState {
  profile: Profile | null;
  setProfile: (profile: Profile | null) => void;
  clearProfile: () => void;
}

// Глобальный профиль игрока (синхронизируется с Supabase)
export const useAuthStore = create<AuthState>((set) => ({
  profile: null,
  setProfile: (profile) => set({ profile }),
  clearProfile: () => set({ profile: null }),
}));
