"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ZONE_INFO, ZONE_PRICES, type Pc } from "@/lib/mock-data";
import type { ZoneType } from "@/types";

const STATUS_STYLES: Record<Pc["status"], { dot: string; ring: string; label: string }> = {
  available: { dot: "bg-emerald-400", ring: "border-emerald-400/40 hover:border-emerald-300 hover:shadow-[0_0_16px_rgba(52,211,153,0.4)]", label: "Свободен" },
  busy: { dot: "bg-red-500", ring: "border-red-500/30 opacity-60", label: "Занят" },
  reserved: { dot: "bg-amber-400", ring: "border-amber-400/40 opacity-80", label: "Забронирован" },
  maintenance: { dot: "bg-white/30", ring: "border-white/15 opacity-50", label: "Обслуживание" },
};

const ZONE_BG: Record<ZoneType, string> = {
  standart: "bg-brand/5",
  vip: "bg-brand/15",
  duo: "bg-white/5",
};

interface HallMapProps {
  pcs: Pc[];
  onSelect?: (pc: Pc) => void;
}

export function HallMap({ pcs, onSelect }: HallMapProps) {
  const [zoneFilter, setZoneFilter] = useState<ZoneType | "all">("all");
  const [selected, setSelected] = useState<Pc | null>(null);

  const zones: (ZoneType | "all")[] = ["all", "standart", "vip", "duo"];
  const filtered = zoneFilter === "all" ? pcs : pcs.filter((p) => p.zone === zoneFilter);
  const cols = 8;

  return (
    <div>
      {/* Фильтр зон */}
      <div className="mb-6 flex flex-wrap items-center gap-2">
        {zones.map((z) => (
          <button
            key={z}
            onClick={() => setZoneFilter(z)}
            className={`px-4 py-2 text-xs font-bold uppercase tracking-[0.15em] transition-all ${
              zoneFilter === z
                ? "bg-brand text-white shadow-[0_0_16px_rgba(255,106,0,0.4)]"
                : "border border-white/10 text-white/50 hover:border-brand/50 hover:text-white"
            }`}
          >
            {z === "all" ? "Все зоны" : ZONE_INFO[z].label}
          </button>
        ))}

        {/* Легенда */}
        <div className="ml-auto flex flex-wrap items-center gap-4 text-xs text-white/40">
          {Object.entries(STATUS_STYLES).map(([status, s]) => (
            <span key={status} className="flex items-center gap-1.5">
              <span className={`h-2 w-2 rounded-full ${s.dot}`} />
              {s.label}
            </span>
          ))}
        </div>
      </div>

      {/* Сетка зала */}
      <div className="cyber-panel overflow-x-auto p-6">
        <div
          className="mx-auto grid w-max gap-2"
          style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }}
        >
          {filtered.map((pc, i) => {
            const s = STATUS_STYLES[pc.status];
            return (
              <motion.button
                key={pc.id}
                onClick={() => {
                  setSelected(pc);
                  onSelect?.(pc);
                }}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.008, duration: 0.25 }}
                whileHover={pc.status === "available" ? { scale: 1.12 } : undefined}
                whileTap={{ scale: 0.95 }}
                className={`relative flex h-14 w-14 flex-col items-center justify-center rounded-md border transition-all md:h-16 md:w-16 ${s.ring} ${ZONE_BG[pc.zone]}`}
                title={`${ZONE_INFO[pc.zone].label} · ${pc.specs.gpu} · ${pc.pricePerHour} руб/час`}
              >
                <span className="font-display text-sm font-bold text-white">{pc.number}</span>
                <span className={`mt-1 h-1.5 w-1.5 rounded-full ${s.dot}`} />
                <span className="absolute -top-1 -right-1 rounded-sm bg-void px-1 text-[8px] font-bold uppercase text-brand">
                  {pc.zone === "vip" ? "VIP" : pc.zone === "duo" ? "DUO" : ""}
                </span>
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Карточка выбранного ПК */}
      <AnimatePresence>
        {selected && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="cyber-panel mt-6 flex flex-col gap-6 p-6 md:flex-row md:items-center"
          >
            <div className="flex items-center gap-5">
              <div className="flex h-20 w-20 flex-col items-center justify-center border-2 border-brand bg-brand/10">
                <span className="font-display text-2xl font-black text-brand">{selected.number}</span>
                <span className="text-[10px] uppercase tracking-widest text-white/50">{ZONE_INFO[selected.zone].label}</span>
              </div>
              <div>
                <p className="font-display text-lg font-bold text-white">ПК #{selected.number}</p>
                <p className="text-sm text-white/50">{ZONE_INFO[selected.zone].desc}</p>
                <p className={`mt-1 flex items-center gap-1.5 text-xs ${selected.status === "available" ? "text-emerald-400" : "text-amber-400"}`}>
                  <span className={`h-1.5 w-1.5 rounded-full ${STATUS_STYLES[selected.status].dot}`} />
                  {STATUS_STYLES[selected.status].label}
                </p>
              </div>
            </div>

            <div className="grid flex-1 grid-cols-2 gap-x-6 gap-y-1.5 text-sm md:grid-cols-3">
              <SpecRow label="Видеокарта" value={selected.specs.gpu} />
              <SpecRow label="Процессор" value={selected.specs.cpu} />
              <SpecRow label="Монитор" value={`${selected.specs.monitor} · ${selected.specs.refresh}Hz`} />
              <SpecRow label="Кресло" value={selected.specs.chair} />
              <SpecRow label="Мышь" value={selected.specs.mouse} />
              <SpecRow label="Клавиатура" value={selected.specs.keyboard} />
            </div>

            <div className="text-right">
              <p className="font-display text-2xl font-bold text-brand">{selected.pricePerHour} руб</p>
              <p className="text-xs text-white/40">за час</p>
              {selected.status === "available" && (
                <a href="/dashboard/booking" className="cyber-button mt-3 !px-5 !py-2 text-[10px]">
                  Забронировать
                </a>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Цены зон */}
      <div className="mt-8 grid gap-4 md:grid-cols-3">
        {(Object.keys(ZONE_INFO) as ZoneType[]).map((zone, i) => (
          <motion.div
            key={zone}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className="cyber-panel p-5"
          >
            <div className="flex items-center justify-between">
              <h4 className="font-display font-bold tracking-widest text-white">{ZONE_INFO[zone].label}</h4>
              <p className="font-display text-xl font-bold text-brand">{ZONE_PRICES[zone]} руб<span className="text-xs text-white/40">/час</span></p>
            </div>
            <p className="mt-2 text-sm text-white/45">{ZONE_INFO[zone].desc}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function SpecRow({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-[10px] uppercase tracking-widest text-white/30">{label}</p>
      <p className="text-white/80">{value}</p>
    </div>
  );
}
