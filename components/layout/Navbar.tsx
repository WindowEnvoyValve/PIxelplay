"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, MotionConfig, motion } from "framer-motion";
import Image from "next/image";
import { Logo } from "@/components/ui/Logo";
import { LetsPlayShowcase } from "@/components/loyalty/LetsPlayShowcase";
import { SOCIAL_LINKS } from "@/lib/site-config";

const NAV_ITEMS = [
  { href: "/clubs", label: "Локации" },
  { href: "/specs", label: "Железо" },
  { href: "/games", label: "Список игр" },
  { href: "/services", label: "Услуги" },
  { href: "/partners", label: "Партнёрам" },
  { href: "/pricing", label: "Цены" },
  { href: "/promos", label: "Акции" },
  { href: "/tournaments", label: "Турниры" },
];

const MOBILE_NAV_ITEMS = [
  { href: "/services", label: "Услуги" },
  { href: "/promos", label: "Акции" },
  { href: "/tournaments", label: "ТУРНИРЫ" },
  { href: "/specs", label: "Железо" },
  { href: "/games", label: "Список игр" },
  { href: "/partners", label: "Партнёрам" },
  { href: "/pricing", label: "Цены" },
];

const SOCIALS = [
  { label: "Instagram", href: SOCIAL_LINKS.instagram, hover: "hover:border-[#E1306C]/70", file: "instagram", filter: "invert(31%) sepia(88%) saturate(1700%) hue-rotate(300deg) brightness(95%) contrast(92%)" },
  { label: "TikTok", href: SOCIAL_LINKS.tiktok, hover: "hover:border-white/80", file: "tiktok", filter: "brightness(0) invert(1)" },
  { label: "Telegram", href: SOCIAL_LINKS.telegram, hover: "hover:border-[#229ED9]/70", file: "telegram", filter: "invert(48%) sepia(85%) saturate(980%) hue-rotate(166deg) brightness(92%) contrast(91%)" },
  { label: "YouTube", href: SOCIAL_LINKS.youtube, hover: "hover:border-[#FF0000]/70", file: "youtube", filter: "invert(17%) sepia(99%) saturate(7480%) hue-rotate(358deg) brightness(94%) contrast(117%)" },
];

function isActive(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(href + "/");
}

export function Navbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const mobileNavigationRef = useRef<HTMLElement>(null);
  const firstMenuLinkRef = useRef<HTMLAnchorElement>(null);
  const toggleMobileMenu = () => setMobileMenuOpen((v) => !v);
  const closeMobileMenu = useCallback(() => setMobileMenuOpen(false), []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    let hideTimer: number | undefined;
    const showScrollbar = () => {
      document.documentElement.classList.add("is-scrolling");
      window.clearTimeout(hideTimer);
      hideTimer = window.setTimeout(() => {
        document.documentElement.classList.remove("is-scrolling");
      }, 700);
    };

    window.addEventListener("scroll", showScrollbar, { passive: true });
    return () => {
      window.removeEventListener("scroll", showScrollbar);
      window.clearTimeout(hideTimer);
      document.documentElement.classList.remove("is-scrolling");
    };
  }, []);

  useEffect(() => {
    const frame = requestAnimationFrame(() => setMobileMenuOpen(false));
    return () => cancelAnimationFrame(frame);
  }, [pathname]);

  useEffect(() => {
    if (!mobileMenuOpen) {
      return;
    }

    firstMenuLinkRef.current?.focus();
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closeMobileMenu();
        menuButtonRef.current?.focus();
        return;
      }
      if (event.key !== "Tab" || !mobileNavigationRef.current) {
        return;
      }

      const focusable = Array.from(
        mobileNavigationRef.current.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])',
        ),
      );
      if (focusable.length === 0) {
        return;
      }

      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [mobileMenuOpen, closeMobileMenu]);

  return (
    <MotionConfig reducedMotion="user">
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
          scrolled ? "bg-void/85 backdrop-blur-md border-b border-brand/15 py-3" : "bg-transparent py-5"
        }`}
      >
        <div className="relative flex items-center px-4 md:px-8">
          <Logo priority size={scrolled ? 100 : 120} className="shrink-0 transition-all duration-300" />

          {/* Desktop nav */}
          <nav className="pointer-events-none absolute inset-x-0 hidden h-8 xl:block">
            <div className="pointer-events-auto absolute right-[calc(50%+86px)] top-0 flex items-center gap-2">
              {NAV_ITEMS.slice(0, 4).map((item) => {
                const active = isActive(pathname, item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`group relative flex min-w-[80px] items-center justify-center overflow-hidden whitespace-nowrap rounded-md border px-2 py-1.5 text-[10px] uppercase tracking-[0.14em] ${
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
            </div>
            <div className="pointer-events-auto absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
              <LetsPlayShowcase />
            </div>
            <div className="pointer-events-auto absolute left-[calc(50%+86px)] top-0 flex items-center gap-2">
              {NAV_ITEMS.slice(4).map((item) => {
                const active = isActive(pathname, item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`group relative flex min-w-[80px] items-center justify-center overflow-hidden whitespace-nowrap rounded-md border px-2 py-1.5 text-[10px] uppercase tracking-[0.14em] ${
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
            </div>
          </nav>

          <button
            type="button"
            ref={menuButtonRef}
            onClick={toggleMobileMenu}
            className="ml-auto flex h-10 w-10 flex-col items-center justify-center gap-1.5 xl:hidden"
            aria-label="Меню"
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-navigation"
          >
            <motion.span animate={{ rotate: mobileMenuOpen ? 45 : 0, y: mobileMenuOpen ? 6 : 0 }} className="h-0.5 w-6 bg-brand" />
            <motion.span animate={{ opacity: mobileMenuOpen ? 0 : 1 }} className="h-0.5 w-6 bg-white" />
            <motion.span animate={{ rotate: mobileMenuOpen ? -45 : 0, y: mobileMenuOpen ? -6 : 0 }} className="h-0.5 w-6 bg-brand" />
          </button>
        </div>

        <div className="fixed left-4 top-[50vh] z-[60] hidden -translate-y-1/2 flex-col items-center gap-3 xl:flex">
          <span className="rotate-180 font-display text-[10px] font-bold uppercase tracking-[0.28em] text-white/55 [writing-mode:vertical-rl]">
            Соцсети
          </span>
          <div className="flex flex-col items-center gap-3">
            {SOCIALS.map((s) => (
              <a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={s.label}
                title={s.label}
                className={`flex h-10 w-10 items-center justify-center transition-all group ${s.hover}`}
              >
                <Image src={`/${s.file}.svg`} alt={s.label} width={22} height={22} style={{ filter: s.filter }} className="h-[22px] w-[22px] object-contain opacity-90 group-hover:opacity-100" />
              </a>
            ))}
          </div>
        </div>

        {/* Mobile menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.nav
              ref={mobileNavigationRef}
              id="mobile-navigation"
              aria-label="Мобильная навигация"
              initial={{ opacity: 0, height: 0, y: -12, scaleY: 0.94 }}
              animate={{ opacity: 1, height: "auto", y: 0, scaleY: 1 }}
              exit={{ opacity: 0, height: 0, y: -8, scaleY: 0.96 }}
              transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
              style={{ transformOrigin: "top center" }}
              className="overflow-hidden rounded-b-3xl border-x border-b border-brand/20 bg-[#090b10]/[0.97] shadow-[0_24px_60px_rgba(0,0,0,0.55),inset_0_1px_0_rgba(255,106,0,0.12)] backdrop-blur-xl xl:hidden"
            >
              <div className="flex flex-col gap-2 px-4 py-5 sm:px-6">
                <motion.div
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.02 }}
                >
                  <Link
                    ref={firstMenuLinkRef}
                    href="/services"
                    onClick={() => {
                      closeMobileMenu();
                      menuButtonRef.current?.focus();
                    }}
                    className={`group relative mb-2 flex min-h-12 items-center justify-center overflow-hidden rounded-xl border px-3 py-3 text-center transition-all ${
                      isActive(pathname, "/services")
                        ? "border-brand/70 bg-brand/10 text-brand shadow-[0_0_20px_rgba(255,106,0,0.12)]"
                        : "border-white/10 bg-white/[0.025] text-white/90 hover:border-brand/45 hover:bg-brand/5"
                    }`}
                  >
                    <span className="relative z-10 block font-display text-xs font-black uppercase tracking-[0.18em] text-white/90 transition-all group-hover:text-brand">
                      Услуги
                    </span>
                  </Link>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.07 }}
                  className="mb-1"
                >
                  <div className="flex min-h-[58px] items-center rounded-xl border border-brand/20 bg-brand/5 p-0 shadow-[0_0_18px_rgba(255,106,0,0.08)]">
                    <LetsPlayShowcase onOpen={() => {
                      closeMobileMenu();
                      menuButtonRef.current?.focus();
                    }} />
                  </div>
                </motion.div>

                {MOBILE_NAV_ITEMS.slice(1).map((item, i) => (
                  <motion.div
                    key={item.href}
                    initial={{ opacity: 0, x: -16 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: (i + 2) * 0.05 }}
                  >
                    <Link
                      href={item.href}
                      onClick={() => {
                        closeMobileMenu();
                        menuButtonRef.current?.focus();
                      }}
                      className={`group relative flex min-h-12 items-center justify-center overflow-hidden rounded-xl border px-3 py-3 text-center transition-all ${
                        isActive(pathname, item.href)
                          ? "border-brand/70 bg-brand/10 text-brand shadow-[0_0_20px_rgba(255,106,0,0.12)]"
                          : "border-white/10 bg-white/[0.025] text-white/90 hover:border-brand/45 hover:bg-brand/5"
                      }`}
                    >
                      <span className="relative z-10 block font-display text-xs font-black uppercase tracking-[0.18em] text-white/90 transition-all group-hover:text-brand">
                        {item.label}
                      </span>
                    </Link>
                  </motion.div>
                ))}
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
                        <Image
                          src={`/${s.file}.svg`}
                          alt={s.label}
                          width={20}
                          height={20}
                          style={{ filter: s.filter }}
                          className="h-5 w-5 object-contain opacity-90 group-hover:opacity-100"
                        />
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            </motion.nav>
          )}
        </AnimatePresence>
      </header>
    </>
    </MotionConfig>
  );
}