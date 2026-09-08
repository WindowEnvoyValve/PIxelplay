"use client";

import { useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";
import Image from "next/image";
import { CLUBS } from "@/lib/site-data";
import { SOCIAL_LINKS } from "@/lib/site-config";
import { Logo } from "@/components/ui/Logo";

type BookingModalProps = {
  open: boolean;
  initialClubSlug?: string;
  onClose: () => void;
};

function PhoneIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M5 4h3l2 5-2 2c1 2 3 4 5 5l2-2 5 2v3c0 1-1 2-2 2C10 21 3 14 3 6c0-1 1-2 2-2Z" />
    </svg>
  );
}

function TelegramIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="m21.4 4.6-3.1 14.7c-.2 1-.8 1.2-1.6.8l-4.6-3.4-2.2 2.1c-.2.2-.4.4-.8.4l.3-4.7 8.7-7.8c.4-.3-.1-.5-.6-.2L6.8 12.9 2.3 11.5c-1-.3-1-1 .2-1.5L20 3.2c.8-.3 1.6.2 1.4 1.4Z" />
    </svg>
  );
}

function InstagramIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r=".7" className="fill-current stroke-none" />
    </svg>
  );
}

export function BookingModal({ open, initialClubSlug, onClose }: BookingModalProps) {
  const [selectedSlug, setSelectedSlug] = useState(initialClubSlug ?? CLUBS[0].slug);
  const [step, setStep] = useState<1 | 2>(1);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const selectedClub = CLUBS.find((club) => club.slug === selectedSlug) ?? CLUBS[0];
  const canUseInstagram = selectedClub.slug === "play";

  useEffect(() => {
    if (!open) return;
    const frame = requestAnimationFrame(() => {
      setSelectedSlug(initialClubSlug ?? CLUBS[0].slug);
      setStep(1);
      closeButtonRef.current?.focus();
    });

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      cancelAnimationFrame(frame);
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [initialClubSlug, onClose, open]);

  if (!open) return null;

  const selectClub = (slug: string) => {
    setSelectedSlug(slug);
    setStep(2);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/75 p-0 backdrop-blur-md sm:items-center sm:p-6" role="presentation" onMouseDown={(event) => {
      if (event.target === event.currentTarget) onClose();
    }}>
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="booking-modal-title"
        className="relative max-h-[min(760px,calc(100dvh-1rem))] w-full max-w-2xl overflow-y-auto rounded-t-[28px] border border-white/15 bg-[#11161c]/95 p-5 shadow-[0_25px_100px_rgba(0,0,0,0.65)] sm:rounded-[28px] sm:p-8"
      >
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_78%_0%,rgba(255,106,0,0.2),transparent_40%)]" />
        <div className="relative">
          <button
            ref={closeButtonRef}
            type="button"
            onClick={onClose}
            aria-label="Закрыть окно бронирования"
            className="absolute right-0 top-0 flex h-11 w-11 items-center justify-center rounded-full border border-white/10 text-2xl text-white/60 transition-colors hover:border-white/30 hover:text-white"
          >
            ×
          </button>

          {step === 1 ? (
            <>
              <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-brand">PIXEL PLAY · БРОНИРОВАНИЕ</p>
              <h2 id="booking-modal-title" className="mt-3 max-w-xs font-display text-3xl font-black text-white">Забронировать</h2>
              <p className="mt-2 text-sm text-white/55">Выберите клуб</p>
              <div className="mt-7 grid gap-3 sm:grid-cols-3">
                {CLUBS.map((club) => {
                  const isSelected = club.slug === selectedSlug;
                  return (
                    <button
                      key={club.slug}
                      type="button"
                      onClick={() => selectClub(club.slug)}
                      aria-pressed={isSelected}
                      className={`group overflow-hidden rounded-2xl border text-left transition-all hover:-translate-y-1 ${
                        isSelected ? "border-white shadow-[0_0_0_1px_rgba(255,255,255,0.25)]" : "border-white/10 hover:border-brand/60"
                      }`}
                    >
                      <div className="relative h-32">
                        <Image src={club.images.club} alt="" fill sizes="(max-width: 640px) 100vw, 30vw" className="object-cover transition-transform duration-500 group-hover:scale-105" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                        <span className="absolute bottom-3 left-3 font-display text-sm font-bold text-white">{club.name}</span>
                      </div>
                      <div className="flex items-center justify-between bg-white/[0.04] px-3 py-3">
                        <span className="text-[11px] text-white/50">{club.address}</span>
                        <span className={`h-4 w-4 rounded-full border ${isSelected ? "border-brand bg-brand shadow-[inset_0_0_0_4px_#11161c]" : "border-white/30"}`} />
                      </div>
                    </button>
                  );
                })}
              </div>
              <p className="mt-5 text-center text-xs text-white/35">Нажмите на клуб, чтобы выбрать способ связи</p>
            </>
          ) : (
            <>
              <button type="button" onClick={() => setStep(1)} className="mb-6 text-xs font-semibold text-white/50 transition-colors hover:text-white">
                ← Все клубы
              </button>
              <div className="mb-6">
                <Logo href={null} size={140} className="h-16 w-auto" priority />
                <div className="relative mt-5 h-36 overflow-hidden rounded-2xl border border-white/10">
                  <Image
                    src={selectedClub.images.club}
                    alt={`Интерьер ${selectedClub.name}`}
                    fill
                    sizes="(max-width: 640px) 100vw, 640px"
                    className="object-cover"
                  />
                </div>
              </div>
              <div className="mt-7 overflow-hidden rounded-2xl border border-white/10">
                <ContactLink href={`tel:${selectedClub.phone?.replace(/\s/g, "") ?? ""}`} tone="phone" label="Позвонить по телефону" hint="Моментально откроется набор номера">
                  <PhoneIcon />
                </ContactLink>
                <ContactLink href={SOCIAL_LINKS.telegram} tone="telegram" label="Написать в Telegram" hint="Ответим быстрее всего" external>
                  <TelegramIcon />
                </ContactLink>
                {canUseInstagram && (
                  <ContactLink href={SOCIAL_LINKS.instagram} tone="instagram" label="Написать в Instagram" hint="Откроется профиль клуба" external>
                    <InstagramIcon />
                  </ContactLink>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function ContactLink({
  children,
  href,
  label,
  hint,
  tone,
  external = false,
}: {
  children: ReactNode;
  href: string;
  label: string;
  hint: string;
  tone: "phone" | "telegram" | "instagram";
  external?: boolean;
}) {
  return (
    <a
      href={href}
      target={external ? "_blank" : undefined}
      rel={external ? "noopener noreferrer" : undefined}
      className="group flex min-h-24 items-center gap-4 border-b border-white/10 px-4 transition-colors last:border-b-0 hover:bg-white/[0.07] sm:px-6"
    >
      <span className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full [&_svg]:h-5 [&_svg]:w-5 [&_svg]:fill-current [&_svg]:stroke-2 ${
        tone === "phone" ? "bg-white text-black" : tone === "telegram" ? "bg-[#229ED9] text-white" : "bg-gradient-to-br from-[#FEDA75] via-[#D62976] to-[#4F5BD5] text-white"
      }`}>
        {children}
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-sm font-bold text-white">{label}</span>
        <span className="mt-1 block text-xs text-white/45">{hint}</span>
      </span>
      <span className="text-sm font-bold uppercase tracking-[0.12em] text-brand">{tone === "phone" ? "Позвонить" : "Открыть"}</span>
    </a>
  );
}
