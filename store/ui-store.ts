"use client";

import { create } from "zustand";

interface UIState {
  // Виджет статуса клубов на главной
  freePcsByClub: Record<string, number>;
  setFreePcs: (clubId: string, count: number) => void;

  // Мобильное меню / модалки
  mobileMenuOpen: boolean;
  toggleMobileMenu: () => void;
  closeMobileMenu: () => void;
}

export const useUIStore = create<UIState>((set) => ({
  freePcsByClub: {},
  setFreePcs: (clubId, count) =>
    set((s) => ({ freePcsByClub: { ...s.freePcsByClub, [clubId]: count } })),

  mobileMenuOpen: false,
  toggleMobileMenu: () => set((s) => ({ mobileMenuOpen: !s.mobileMenuOpen })),
  closeMobileMenu: () => set({ mobileMenuOpen: false }),
}));
