import { CLUBS, type ClubZone } from "@/lib/site-data";

function ZoneCard({ zone }: { zone: ClubZone }) {
  const { specs } = zone;
  const values = [
    { label: "CPU", value: specs.cpu },
    { label: "GPU", value: specs.gpu },
    { label: "RAM", value: specs.ram },
    { label: "Монитор", value: `${specs.monitor} · ${specs.refreshRate} Hz` },
    { label: "Кресло", value: specs.chair },
    { label: "Мышь", value: specs.mouse },
    { label: "Клавиатура", value: specs.keyboard },
  ];

  return (
    <div className="page-reveal relative flex flex-col overflow-hidden rounded-2xl border border-white/15 bg-[#0d0d12]/90 p-6 shadow-[0_8px_40px_rgba(0,0,0,0.5)] backdrop-blur-sm transition-transform duration-300 hover:-translate-y-1">
      <div className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full bg-brand/10 blur-3xl" />
      <div className="relative flex items-center justify-between gap-3">
        <h4 className="font-display text-lg font-bold uppercase tracking-[0.15em] text-white">{zone.name}</h4>
        <span className="shrink-0 rounded-md border border-brand/40 bg-brand/15 px-2.5 py-1 font-display text-sm font-bold text-white">
          {zone.pricePerHour} <span className="text-[10px] font-normal opacity-70">BYN/час</span>
        </span>
      </div>
      <p className="relative mt-3 text-sm leading-relaxed text-white/55">{zone.description}</p>
      <div className="relative mt-5 grid grid-cols-2 gap-x-4 gap-y-3 border-t border-white/10 pt-4">
        {values.map((spec) => (
          <div key={spec.label}>
            <p className="text-[10px] uppercase tracking-[0.2em] text-white/35">{spec.label}</p>
            <p className="mt-0.5 text-sm font-medium text-white/85">{spec.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function SpecsPage() {
  return (
    <main className="mx-auto max-w-7xl px-6 pb-24 pt-32 md:px-10">
      <div className="page-reveal mb-14 text-center">
        <p className="mb-3 text-xs uppercase tracking-[0.4em] text-brand">Спецификации</p>
        <h1 className="font-display text-4xl font-black text-white md:text-5xl">
          ЖЕЛЕЗО ПО <span className="text-gradient-brand">КЛУБАМ</span>
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-white/50">
          Характеристики залов каждого клуба сети PIXEL — выбери формат под свой стиль игры.
        </p>
      </div>

      <div className="space-y-16">
        {CLUBS.map((club) => (
          <section key={club.id} className="page-reveal">
            <div className="mb-6 flex items-center gap-4">
              <div className="h-px flex-1 bg-gradient-to-r from-transparent via-brand/40 to-brand/40" />
              <h2 className="font-display text-2xl font-black uppercase tracking-[0.2em] text-white md:text-3xl">{club.name}</h2>
              <div className="h-px flex-1 bg-gradient-to-l from-transparent via-brand/40 to-brand/40" />
            </div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {club.zones.map((zone) => <ZoneCard key={zone.id} zone={zone} />)}
            </div>
          </section>
        ))}
      </div>
    </main>
  );
}
