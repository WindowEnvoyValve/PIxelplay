"use client";

import { useState, useEffect, useMemo } from "react";
import { AnimatePresence, motion } from "framer-motion";

interface Club {
  id: string;
  slug: string;
  name: string;
  address: string;
  status: string;
}

interface Computer {
  id: string;
  number: number;
  zone_type: string;
  status: string;
  price_per_hour: number;
  specs: Record<string, string>;
}

const ZONE_INFO: Record<string, { label: string; desc: string }> = {
  standart: { label: "Standart", desc: "Общий зал — надёжные машины" },
  vip: { label: "VIP", desc: "Приватные комнаты — максимальный комфорт" },
  duo: { label: "Duo", desc: "Зоны для двоих — играй с другом" },
};

const ZONE_PRICES: Record<string, number> = {
  standart: 10,
  vip: 20,
  duo: 15,
};

export function BookingWidget() {
  const [clubs, setClubs] = useState<Club[]>([]);
  const [clubId, setClubId] = useState("");
  const [zone, setZone] = useState<string>("standart");
  const [pcId, setPcId] = useState<string | null>(null);
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [time, setTime] = useState("18:00");
  const [hours, setHours] = useState(3);
  const [step, setStep] = useState<"form" | "loading" | "success">("form");
  const [error, setError] = useState<string | null>(null);
  const [availablePcs, setAvailablePcs] = useState<Computer[]>([]);

  useEffect(() => {
    fetchClubs();
  }, []);

  useEffect(() => {
    if (clubs.length > 0 && !clubId) {
      setClubId(clubs[0].id);
    }
  }, [clubs]);

  useEffect(() => {
    if (clubId && date && time) {
      fetchAvailablePcs();
    }
  }, [clubId, date, time]);

  async function fetchClubs() {
    try {
      const res = await fetch("/api/clubs");
      const data = await res.json();
      const clubsArray = Array.isArray(data) ? data : (data.clubs || []);
      setClubs(clubsArray);
    } catch (e) {
      console.error("Failed to fetch clubs:", e);
    }
  }

  async function fetchAvailablePcs() {
    try {
      const res = await fetch(
        `/api/bookings/available?club_id=${clubId}&date=${date}&time=${time}`
      );
      const data = await res.json();
      setAvailablePcs(data);
    } catch (e) {
      console.error("Failed to fetch PCs:", e);
      setAvailablePcs([]);
    }
  }

  const club = clubs.find((c) => c.id === clubId) || clubs[0];

  const availableByZone = useMemo(
    () => availablePcs.filter((p) => p.zone_type === zone),
    [availablePcs, zone]
  );

  const selectedPc = availablePcs.find((p) => p.id === pcId) ?? null;
  const pricePerHour = selectedPc?.price_per_hour ?? ZONE_PRICES[zone] ?? 10;
  const totalPrice = pricePerHour * hours;

  async function handleConfirm() {
    if (!selectedPc || !clubId) return;
    setError(null);
    setStep("loading");

    try {
      const startTime = `${date}T${time}:00`;
      const endHour = new Date(`${date}T${time}:00`).getTime() + hours * 60 * 60 * 1000;
      const endTime = new Date(endHour).toISOString();

      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          clubId,
          pcId: selectedPc.id,
          startTime,
          endTime,
          total_price: totalPrice,
          notes: `Длительность: ${hours} ч`,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Ошибка бронирования");
        setStep("form");
        return;
      }

      setStep("success");
    } catch (e) {
      setError("Не удалось забронировать. Попробуйте позже.");
      setStep("form");
    }
  }

  function reset() {
    setStep("form");
    setPcId(null);
    setError(null);
  }

  if (!club) {
    return <div className="cyber-panel p-12 text-center">Загрузка...</div>;
  }

  return (
    <AnimatePresence mode="wait">
      {step === "success" ? (
        <motion.div
          key="success"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          className="cyber-panel flex flex-col items-center p-12 text-center"
        >
          <motion.div
            initial={{ scale: 0, rotate: -30 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", stiffness: 200, damping: 12, delay: 0.15 }}
            className="mb-6 flex h-20 w-20 items-center justify-center rounded-full border-2 border-brand bg-brand/15 shadow-[0_0_40px_rgba(255,106,0,0.5)]"
          >
            <span className="text-4xl text-brand">✓</span>
          </motion.div>
          <motion.h3
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
            className="font-display text-2xl font-black text-white"
          >
            МЕСТО ЗАБРОНИРОВАНО!
          </motion.h3>
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mt-4 space-y-1 text-sm text-white/60"
          >
            <p>{club.name} · ПК #{selectedPc?.number} · {ZONE_INFO[zone]?.label}</p>
            <p>{date} в {time} · {hours} ч</p>
            <p className="text-brand">Итого: {totalPrice} BYN</p>
          </motion.div>
          <div className="mt-8 flex gap-3">
            <button onClick={reset} className="cyber-button">Забронировать ещё</button>
            <a href="/dashboard/history" className="border border-white/15 px-6 py-3.5 text-xs font-semibold uppercase tracking-[0.2em] text-white/60 transition-colors hover:border-brand hover:text-brand">
              Мои бронирования
            </a>
          </div>
        </motion.div>
      ) : (
        <motion.div
          key="form"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 0.97 }}
          className="grid gap-6 lg:grid-cols-[1fr_380px]"
        >
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="border-l-2 border-red-500 bg-red-500/10 px-4 py-3 text-sm text-red-400"
            >
              {error}
            </motion.div>
          )}

          {/* Левая колонка: выбор */}
          <div className="space-y-6">
            {/* Шаг 1: клуб */}
            <StepCard n={1} title="Выбери клуб">
              <div className="grid gap-3 md:grid-cols-3">
                {clubs.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => { setClubId(c.id); setPcId(null); }}
                    className={`border p-4 text-left transition-all ${
                      clubId === c.id
                        ? "border-brand bg-brand/10 shadow-[0_0_16px_rgba(255,106,0,0.2)]"
                        : "border-white/10 hover:border-brand/40"
                    }`}
                  >
                    <p className="text-sm font-bold text-white">{c.name}</p>
                    <p className="mt-0.5 text-xs text-white/40">{c.address}</p>
                  </button>
                ))}
              </div>
            </StepCard>

            {/* Шаг 2: зона */}
            <StepCard n={2} title="Выбери зону">
              <div className="grid gap-3 md:grid-cols-3">
                {Object.keys(ZONE_INFO).map((z) => (
                  <button
                    key={z}
                    onClick={() => { setZone(z); setPcId(null); }}
                    className={`border p-4 text-left transition-all ${
                      zone === z
                        ? "border-brand bg-brand/10 shadow-[0_0_16px_rgba(255,106,0,0.2)]"
                        : "border-white/10 hover:border-brand/40"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <p className="font-display text-sm font-bold text-white">{ZONE_INFO[z].label}</p>
                      <p className="text-xs font-bold text-brand">{ZONE_PRICES[z]} BYN/ч</p>
                    </div>
                    <p className="mt-1.5 text-xs leading-relaxed text-white/40">{ZONE_INFO[z].desc}</p>
                  </button>
                ))}
              </div>
            </StepCard>

            {/* Шаг 3: ПК */}
            <StepCard n={3} title={`Свободные ПК — ${availableByZone.length} шт.`}>
              <div className="flex flex-wrap gap-2">
                {availableByZone.map((p) => (
                  <motion.button
                    key={p.id}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.92 }}
                    onClick={() => setPcId(p.id)}
                    className={`flex h-12 w-12 flex-col items-center justify-center rounded-md border transition-all ${
                      pcId === p.id
                        ? "border-brand bg-brand text-white shadow-[0_0_14px_rgba(255,106,0,0.5)]"
                        : "border-emerald-400/30 text-white/70 hover:border-emerald-300"
                    }`}
                  >
                    <span className="font-display text-sm font-bold">{p.number}</span>
                  </motion.button>
                ))}
                {availableByZone.length === 0 && (
                  <p className="text-sm text-white/40">В этой зоне сейчас всё занято — выбери другую.</p>
                )}
              </div>
              {selectedPc && (
                <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-3 text-xs text-white/40">
                  ПК #{selectedPc.number}: {selectedPc.specs?.gpu || "—"} · {selectedPc.specs?.refresh || "—"}Hz
                </motion.p>
              )}
            </StepCard>

            {/* Шаг 4: дата и время */}
            <StepCard n={4} title="Дата и время">
              <div className="grid gap-4 md:grid-cols-3">
                <label className="block">
                  <span className="mb-2 block text-[10px] uppercase tracking-widest text-white/40">Дата</span>
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    min={new Date().toISOString().split("T")[0]}
                    className="cyber-input [color-scheme:dark]"
                  />
                </label>
                <label className="block">
                  <span className="mb-2 block text-[10px] uppercase tracking-widest text-white/40">Начало</span>
                  <input
                    type="time"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    className="cyber-input [color-scheme:dark]"
                  />
                </label>
                <label className="block">
                  <span className="mb-2 block text-[10px] uppercase tracking-widest text-white/40">
                    Длительность: {hours} ч
                  </span>
                  <input
                    type="range"
                    min={1}
                    max={12}
                    value={hours}
                    onChange={(e) => setHours(Number(e.target.value))}
                    className="mt-3 w-full accent-[#ff6a00]"
                  />
                </label>
              </div>
            </StepCard>
          </div>

          {/* Правая колонка: итог */}
          <div className="lg:sticky lg:top-24 lg:self-start">
            <div className="cyber-panel p-6">
              <h3 className="mb-5 font-display text-sm font-bold uppercase tracking-[0.25em] text-white">Итого</h3>

              <div className="space-y-2.5 text-sm">
                <Row label="Клуб" value={club.name} />
                <Row
                  label="Место"
                  value={selectedPc ? `ПК #${selectedPc.number} · ${ZONE_INFO[zone]?.label}` : "— выбери ПК"}
                />
                <Row label="Когда" value={`${date}, ${time}`} />
                <Row label="Длительность" value={`${hours} ч`} />
                <div className="border-t border-white/5 pt-2.5">
                  <Row
                    label={`Цена (${pricePerHour} BYN/ч)`}
                    value={`${totalPrice} BYN`}
                    accent
                  />
                </div>
              </div>

              <div className="mt-5 space-y-2 border-t border-white/5 pt-4 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-white/50">К оплате</span>
                  <span className="font-display text-2xl font-black text-white">{totalPrice} BYN</span>
                </div>
                <p className="text-xs text-white/35">Оплата на месте — картой или наличными</p>
              </div>

              <motion.button
                onClick={handleConfirm}
                disabled={!selectedPc || step === "loading"}
                whileHover={selectedPc ? { scale: 1.02 } : undefined}
                whileTap={selectedPc ? { scale: 0.98 } : undefined}
                className="cyber-button mt-6 w-full"
              >
                {step === "loading" ? (
                  <span className="flex items-center gap-2">
                    <motion.span
                      animate={{ rotate: 360 }}
                      transition={{ repeat: Infinity, duration: 0.8, ease: "linear" }}
                      className="inline-block h-4 w-4 border-2 border-white/30 border-t-white rounded-full"
                    />
                    БРОНИРУЕМ...
                  </span>
                ) : (
                  "ПОДТВЕРДИТЬ БРОНЬ"
                )}
              </motion.button>
              {!selectedPc && step === "form" && (
                <p className="mt-2 text-center text-xs text-white/30">Сначала выбери свободный ПК</p>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function StepCard({ n, title, children }: { n: number; title: string; children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="cyber-panel p-6"
    >
      <div className="mb-4 flex items-center gap-3">
        <span className="flex h-7 w-7 items-center justify-center rounded-full border border-brand/50 bg-brand/10 font-display text-xs font-bold text-brand">
          {n}
        </span>
        <h3 className="text-sm font-bold uppercase tracking-[0.2em] text-white">{title}</h3>
      </div>
      {children}
    </motion.div>
  );
}

function Row({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-white/50">{label}</span>
      <span className={`font-semibold ${accent ? "text-brand" : "text-white/90"}`}>{value}</span>
    </div>
  );
}
