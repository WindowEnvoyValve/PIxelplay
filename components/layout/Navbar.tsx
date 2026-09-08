"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { Logo } from "@/components/ui/Logo";

const NAV_ITEMS = [
  { href: "/clubs", label: "Локации" },
  { href: "/specs", label: "Железо" },
  { href: "/services", label: "Услуги" },
  { href: "/games", label: "Список игр" },
  { href: "/promos", label: "Акции" },
  { href: "/pricing", label: "Цены" },
  { href: "/partners", label: "Партнерам" },
];

const SOCIALS = [
  { label: "Instagram", href: "https://www.instagram.com/pixelplay_mogilev", hover: "hover:border-[#E1306C]/70", file: "instagram" },
  { label: "TikTok", href: "https://www.tiktok.com/@pixelplay_mogilev", hover: "hover:border-white/80", file: "tiktok" },
  { label: "Telegram", href: "https://t.me/pixelplay_mogilev", hover: "hover:border-[#229ED9]/70", file: "telegram" },
  { label: "YouTube", href: "https://www.youtube.com/@PixelPlayClub", hover: "hover:border-[#FF0000]/70", file: "youtube" },
];

function isActive(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(href + "/");
}

export function Navbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const toggleMobileMenu = () => setMobileMenuOpen((v) => !v);
  const closeMobileMenu = useCallback(() => setMobileMenuOpen(false), []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    closeMobileMenu();
  }, [pathname, closeMobileMenu]);

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
          scrolled ? "bg-void/85 backdrop-blur-md border-b border-brand/15 py-3" : "bg-transparent py-5"
        }`}
      >
        <div className="relative flex items-center px-4 md:px-8">
          <Logo size={scrolled ? 100 : 120} className="shrink-0 transition-all duration-300" />

          {/* Desktop nav */}
          <nav className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-4 lg:flex">
            {NAV_ITEMS.map((item) => {
              const active = isActive(pathname, item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`group relative flex min-w-[100px] items-center justify-center overflow-hidden whitespace-nowrap rounded-md border px-3 py-1.5 text-xs uppercase tracking-[0.2em] transition-all ${
                    active
                      ? "border-brand/70 bg-gradient-to-b from-brand/40 to-brand/15 text-brand shadow-[0_0_16px_rgba(255,106,0,0.35)]"
                      : "border-white/10 bg-gradient-to-b from-white/[0.09] via-white/[0.04] to-brand/[0.06] text-white/90 hover:border-brand/40 hover:from-brand/20 hover:to-brand/[0.08] hover:text-white hover:shadow-[0_0_14px_rgba(255,106,0,0.2)]"
                  }`}
                >
                  <span className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/40 to-transparent opacity-60" />
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="ml-auto hidden items-center gap-5 lg:flex">
            <div className="flex items-center gap-2">
              {SOCIALS.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.label}
                  title={s.label}
                  className={`flex h-8 w-8 items-center justify-center transition-all group ${s.hover}`}
                >
                  <img src={`/${s.file}.svg`} alt={s.label} className="h-5 w-5 object-contain invert opacity-70 group-hover:opacity-100" />
                </a>
              ))}
            </div>
            <a
              href="https://t.me/pixelplay_mogilev"
              target="_blank"
              rel="noopener noreferrer"
              className="cyber-button !px-5 !py-2.5"
            >
              Связаться
            </a>
          </div>

          <button
            type="button"
            onClick={toggleMobileMenu}
            className="flex h-10 w-10 flex-col items-center justify-center gap-1.5 lg:hidden"
            aria-label="Меню"
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-navigation"
          >
            <motion.span animate={{ rotate: mobileMenuOpen ? 45 : 0, y: mobileMenuOpen ? 6 : 0 }} className="h-0.5 w-6 bg-brand" />
            <motion.span animate={{ opacity: mobileMenuOpen ? 0 : 1 }} className="h-0.5 w-6 bg-white" />
            <motion.span animate={{ rotate: mobileMenuOpen ? -45 : 0, y: mobileMenuOpen ? -6 : 0 }} className="h-0.5 w-6 bg-brand" />
          </button>
        </div>

        {/* Mobile menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.nav
              id="mobile-navigation"
              aria-label="Мобильная навигация"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden border-t border-brand/15 bg-void/95 backdrop-blur-md lg:hidden"
            >
              <div className="flex flex-col gap-1 px-6 py-4">
                {NAV_ITEMS.map((item, i) => {
                  return (
                    <motion.div
                      key={item.href}
                      initial={{ opacity: 0, x: -16 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05 }}
                    >
                      <Link
                        href={item.href}
                        onClick={closeMobileMenu}
                        className="group relative block px-3 py-4 text-center"
                      >
                        {/* Пульсирующее свечение фона */}
                        <span className="pointer-events-none absolute inset-0 rounded-lg bg-brand/10 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                          style={{ animation: 'glow-pulse-btn 2s ease-in-out infinite' }}
                        />

                        <span className="pointer-events-none absolute top-0 left-1/2 h-[1px] w-0 -translate-x-1/2 bg-white/80 shadow-[0_0_12px_2px_rgba(255,255,255,0.6)] transition-all duration-700 group-hover:w-3/4" />

                        {/* Угловые искры */}
                        <span className="pointer-events-none absolute top-0.5 left-1 h-1 w-1 rounded-full bg-brand opacity-0 shadow-[0_0_8px_2px_rgba(255,106,0,0.8)] transition-all duration-500 group-hover:opacity-100 group-hover:-left-1 group-hover:top-0" />
                        <span className="pointer-events-none absolute top-0.5 right-1 h-1 w-1 rounded-full bg-brand opacity-0 shadow-[0_0_8px_2px_rgba(255,106,0,0.8)] transition-all duration-500 delay-100 group-hover:opacity-100 group-hover:-right-1 group-hover:top-0" />
                        <span className="pointer-events-none absolute bottom-0.5 left-1 h-0.5 w-0.5 rounded-full bg-white/60 opacity-0 shadow-[0_0_6px_1px_rgba(255,255,255,0.6)] transition-all duration-500 delay-200 group-hover:opacity-100 group-hover:-left-0.5 group-hover:bottom-0" />
                        <span className="pointer-events-none absolute bottom-0.5 right-1 h-0.5 w-0.5 rounded-full bg-white/60 opacity-0 shadow-[0_0_6px_1px_rgba(255,255,255,0.6)] transition-all duration-500 delay-150 group-hover:opacity-100 group-hover:-right-0.5 group-hover:bottom-0" />

                        {/* Глитч-слои */}
                        <span className="pointer-events-none absolute inset-x-0 top-0 block font-display text-sm font-black uppercase tracking-[0.2em] text-brand opacity-0 transition-all duration-300 group-hover:opacity-70 group-hover:-left-0.5"
                          style={{ animation: 'float-3d 4s ease-in-out infinite' }}
                        >
                          {item.label}
                        </span>
                        <span className="pointer-events-none absolute inset-x-0 top-0 block font-display text-sm font-black uppercase tracking-[0.2em] text-cyan-400 opacity-0 transition-all duration-300 group-hover:opacity-70 group-hover:-right-0.5"
                          style={{ animation: 'float-3d 4s ease-in-out infinite' }}
                        >
                          {item.label}
                        </span>

                        {/* Основной 3D текст */}
                        <span
                          className="relative z-10 block font-display text-sm font-black uppercase tracking-[0.2em] text-white/90 transition-all duration-300 group-hover:text-white group-hover:animate-pulse"
                          style={{
                            textShadow: `
                              0 1px 0 #cc5500,
                              0 2px 0 #cc5500,
                              0 3px 0 #cc5500,
                              0 4px 0 #993d00,
                              0 5px 0 #993d00,
                              0 6px 6px rgba(0,0,0,0.4)
                            `,
                            animation: 'float-3d 4s ease-in-out infinite',
                          }}
                        >
                          {item.label}
                        </span>

                        {/* Нижнее неоновое свечение */}
                        <span className="pointer-events-none absolute bottom-0 left-1/2 h-px w-0 -translate-x-1/2 bg-gradient-to-r from-transparent via-brand to-brand transition-all duration-700 group-hover:w-3/4"
                          style={{ boxShadow: '0 0 20px 4px rgba(255,106,0,0.5)' }}
                        />
                      </Link>
                    </motion.div>
                  );
                })}
                <div className="mt-3 flex items-center justify-between gap-3">
                  <div className="flex gap-2">
                    {SOCIALS.map((s) => (
                      <a
                        key={s.label}
                        href={s.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={s.label}
                        className={`flex h-9 w-9 items-center justify-center transition-colors group ${s.hover}`}
                      >
                        <img
                          src={`/${s.file}.svg`}
                          alt={s.label}
                          className="h-5 w-5 object-contain invert opacity-70 group-hover:opacity-100"
                        />
                      </a>
                    ))}
                  </div>
                  <a
                    href="https://t.me/pixelplay_mogilev"
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={closeMobileMenu}
                    className="cyber-button !px-5 !py-2.5"
                  >
                    Связаться
                  </a>
                </div>
              </div>
            </motion.nav>
          )}
        </AnimatePresence>
      </header>
    </>
  );
}