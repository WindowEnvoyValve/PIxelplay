import { SOCIAL_LINKS } from "@/lib/site-config";

const SERVICES = [
  {
    icon: "🎉",
    title: "Дни рождения",
    tagline: "Незабываемый праздник для детей и взрослых",
    description:
      "Полная организация, призы, угощения и эксклюзивное использование зала.",
    features: [
      "Отдельная комната для вашей компании",
      "Торт, напитки и снеки включены",
      "Турниры и конкурсы с призами",
    ],
  },
  {
    icon: "🏢",
    title: "Корпоративы",
    tagline: "Team building в формате киберспорта",
    description:
      "Сплотите команду через совместные игры и турниры с индивидуальным подходом.",
    features: [
      "Аренда всего клуба для компании",
      "Командные турниры и активности",
      "Кейтеринг и фуршет на заказ",
    ],
  },
  {
    icon: "🏆",
    title: "Организация турниров",
    tagline: "Турниры по популярным дисциплинам",
    description:
      "Полная организация соревнований с призами и профессиональным подходом.",
    features: [
      "CS2, Dota 2 и другие игры",
      "Призовой фонд и награды",
      "Онлайн-трансляции матчей",
    ],
  },
];

export default function ServicesPage() {
  return (
    <main className="mx-auto max-w-7xl px-6 pb-24 pt-32 md:px-10">
      <div className="page-reveal mb-14">
        <p className="mb-3 text-xs uppercase tracking-[0.4em] text-brand">Услуги</p>
        <h1 className="font-display text-4xl font-black text-white md:text-5xl">
          БОЛЬШЕ, ЧЕМ <span className="text-gradient-brand">ИГРА</span>
        </h1>
        <p className="mt-4 max-w-2xl text-white/50">
          Дни рождения, корпоративы и турниры под ключ. Нажми «Узнать подробнее» —
          админ ответит в чате сразу.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {SERVICES.map((s) => (
          <div
            key={s.title}
            className="page-reveal cyber-panel flex flex-col p-8 transition-transform duration-300 hover:-translate-y-1"
          >
            <span className="text-5xl">{s.icon}</span>
            <h2 className="mt-5 font-display text-xl font-black text-white">{s.title}</h2>
            <p className="mt-1 text-xs font-semibold uppercase tracking-widest text-brand">
              {s.tagline}
            </p>
            <p className="mt-4 text-sm leading-relaxed text-white/55">{s.description}</p>
            <ul className="mt-6 flex-1 space-y-2.5">
              {s.features.map((f) => (
                <li key={f} className="flex items-start gap-2.5 text-sm text-white/65">
                  <span className="mt-0.5 text-brand">✓</span>
                  {f}
                </li>
              ))}
            </ul>
            <a
              href={SOCIAL_LINKS.telegram}
              target="_blank"
              rel="noopener noreferrer"
              className="cyber-button mt-8 w-full"
            >
              Узнать подробнее
            </a>
          </div>
        ))}
      </div>
    </main>
  );
}
