import Link from "next/link";
import { SITE_STATS } from "@/lib/site-data";
import { SOCIAL_LINKS } from "@/lib/site-config";

const RULES_CLUB = [
  { title: "Время работы", text: `Все клубы PIXEL работают круглосуточно, ${SITE_STATS.networkHours}. Вход — по QR-коду или карте лояльности.` },
  { title: "Возраст", text: "Посещение с 14 лет без сопровождения. С 14 до 18 — по согласованию с родителями. До 14 — только с взрослым." },
  { title: "Документы", text: "При себе нужно иметь паспорт или ID-карту. Без документа администратор вправе отказать в посещении." },
  { title: "Бронирование", text: "Минимальное время бронирования — 3 часа. Бронь гарантирует зарезервированное место в выбранный слот. При опоздании более чем на 30 минут бронь аннулируется." },
  { title: "Оплата", text: "Оплата наличными или картой в клубе." },
  { title: "Еда и напитки", text: "В клубе запрещены посторонние продукты и напитки. Собственный снек можно приобрести в нашем снек-баре." },
  { title: "Порядок", text: "Запрещены: агрессивное поведение, курение (в т.ч. вейпов), употребление веществ, игры на телефоне во время сессии (мешает другим). За нарушение — досрочное завершение без возврата." },
  { title: "Оборудование", text: "Пользуйтесь оборудованием бережно. Умышленная порча — возмещение по прейскуранту. Стандартная очистка ПК между сессиями включена." },
  { title: "Личные вещи", text: "PIXEL не несёт ответственности за потерянные или утраченные личные вещи. Используйте lockers (при наличии) или оставляйте в машине." },
  { title: "Фото и съёмка", text: "Фото/видеосъёмка без разрешения администратора запрещена. Снимать других игроков без их согласия нельзя." },
  { title: "Шумные комнаты", text: "В VIP-зонах и TRIO — разрешён повышенный шум. В STANDART и STANDART+ — соблюдайте акустический этикет (10:00–23:00)." },
  { title: "Потеря ключа", text: "Потеря ключа от lockera — компенсация 50 BYN. Ключ выдаётся при заселении и возвращается при выезде." },
];

export default function RulesPage() {
  return (
    <main className="mx-auto max-w-4xl px-6 pb-24 pt-32 md:px-10">
      {/* Заголовок */}
      <div className="page-reveal mb-10 text-center">
        <p className="mb-3 text-xs uppercase tracking-[0.4em] text-brand">Информация</p>
        <h1 className="font-display text-4xl font-black text-white md:text-5xl">
          ПРАВИЛА <span className="text-gradient-brand">PIXEL</span>
        </h1>
      </div>

      {/* Контент */}
      <div className="page-reveal page-reveal-delay-1">
        <div className="space-y-3">
          {RULES_CLUB.map((rule) => (
          <div
            key={rule.title}
            className="rounded-xl border border-white/10 bg-white/[0.03] p-5 transition-colors hover:border-brand/30 hover:bg-brand/[0.04]"
            >
              <h3 className="mb-1 font-display text-sm font-bold uppercase tracking-[0.15em] text-brand">
                {rule.title}
              </h3>
              <p className="text-sm leading-relaxed text-white/60">{rule.text}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Подвал */}
      <div className="mt-12 text-center">
        <p className="text-sm text-white/35">
          Вопросы? Пишите в{" "}
          <Link href={SOCIAL_LINKS.telegram} target="_blank" rel="noopener noreferrer" className="text-brand hover:underline">
            Telegram
          </Link>{" "}
          или звоните{" "}
          <a href="tel:+375293193015" className="text-brand hover:underline">
            +375 29 319 30 15
          </a>
        </p>
      </div>
    </main>
  );
}
