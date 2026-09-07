"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useState } from "react";

const RULES_CLUB = [
  { title: "Время работы", text: "Все клубы PIXEL работают круглосуточно, 24/7. Вход — по QR-коду или карте лояльности." },
  { title: "Возраст", text: "Посещение с 14 лет без сопровождения. С 14 до 18 — по согласованию с родителями. До 14 — только с взрослым." },
  { title: "Документы", text: "При себе нужно иметь паспорт или ID-карту. Без документа администратор вправе отказать в посещении." },
  { title: "Бронирование", text: "Минимальное время бронирования — 3 часа. Бронь гарантирует зарезервированное место в выбранный слот. При опоздании более чем на 30 минут бронь аннулируется." },
  { title: "Оплата", text: "Оплата наличными или картой в клубе. Бонусами LETS PLAY можно оплатить до 50% суммы чека, но не 100%." },
  { title: "Еда и напитки", text: "В клубе запрещены посторонние продукты и напитки. Собственный снек можно приобрести в нашем снек-баре." },
  { title: "Порядок", text: "Запрещены: агрессивное поведение, курение (в т.ч. вейпов), употребление веществ, игры на телефоне во время сессии (мешает другим). За нарушение — досрочное завершение без возврата." },
  { title: "Оборудование", text: "Пользуйтесь оборудованием бережно. Умышленная порча — возмещение по прейскуранту. Стандартная очистка ПК между сессиями включена." },
  { title: "Личные вещи", text: "PIXEL не несёт ответственности за потерянные или украшенные личные вещи. Используйте lockers (при наличии) или оставляйте в машине." },
  { title: "Фото и съёмка", text: "Фото/видеосъёмка без разрешения администратора запрещена. Снимать других игроков без их согласия нельзя." },
  { title: "Шумные комнаты", text: "В VIP-зонах и TRIO — разрешён повышенный шум. В STANDART и STANDART+ — соблюдайте акустический этикет (10:00–23:00)." },
  { title: "Потеря ключа", text: "Потеря ключа от lockera — компенсация 50 BYN. Ключ выдаётся при заселении и возвращается при выезде." },
];

const RULES_BOOKING = [
  { title: "Минимальное время", text: "Бронирование возможно от 3 часов. Это нужно для обеспечения качества обслуживания и подготовки места к следующей сессии." },
  { title: "Как забронировать", text: "Через форму на сайте, по телефону, через Telegram или лично в клубе. Укажите клуб, зону, дату и время начала сессии." },
  { title: "Предоплата", text: "Для подтверждения бронирования требуется предоплата 100% от стоимости. Аванс возвращается при отмене за 24 часа." },
  { title: "Отмена брони", text: "Отмена возможна за 24 часа до начала сессии — полный возврат. За 12 часов — 50%. Менее 12 часов — бронь не возвращается." },
  { title: "Опоздание", text: "При опоздании менее 30 минут — сессия сдвигается. Более 30 минут — бронь аннулируется, предоплата не возвращается (если не предупредить заранее)." },
  { title: "Продление", text: "Продление возможно при наличии свободных мест. Уточняйте у администратора минимум за 1 час до окончания сессии." },
  { title: "Изменение данных", text: "Изменить имя, время или зону бронирования можно за 2 часа до начала. Последнее изменение — за 30 минут." },
  { title: "Отмена по инициативе клуба", text: "Если клуб не может обеспечить забронированное место (техническая проблема), сессия переносится или возвращается полностью + компенсация 20%." },
];

const TABS = [
  { id: "club", label: "Правила клуба" },
  { id: "booking", label: "Правила бронирования" },
];

export default function RulesPage() {
  const [activeTab, setActiveTab] = useState("club");

  const currentRules = activeTab === "club" ? RULES_CLUB : RULES_BOOKING;

  return (
    <main className="mx-auto max-w-4xl px-6 pb-24 pt-32 md:px-10">
      {/* Заголовок */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-10 text-center"
      >
        <p className="mb-3 text-xs uppercase tracking-[0.4em] text-brand">Информация</p>
        <h1 className="font-display text-4xl font-black text-white md:text-5xl">
          ПРАВИЛА <span className="text-gradient-brand">PIXEL</span>
        </h1>
      </motion.div>

      {/* Табы */}
      <div className="mb-10 flex justify-center gap-3">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`relative overflow-hidden rounded-xl border px-6 py-3 text-sm font-bold uppercase tracking-[0.15em] transition-all ${
              activeTab === tab.id
                ? "border-brand/70 bg-gradient-to-b from-brand/50 to-brand/20 text-white shadow-[0_0_24px_rgba(255,106,0,0.4)]"
                : "border-white/10 bg-white/[0.03] text-white/50 hover:border-brand/40 hover:text-white"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Контент */}
      <motion.div
        key={activeTab}
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
      >
        <div className="space-y-3">
          {currentRules.map((rule, i) => (
            <motion.div
              key={rule.title}
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.04, duration: 0.3 }}
              className="rounded-xl border border-white/10 bg-white/[0.03] p-5 transition-colors hover:border-brand/30 hover:bg-brand/[0.04]"
            >
              <h3 className="mb-1 font-display text-sm font-bold uppercase tracking-[0.15em] text-brand">
                {rule.title}
              </h3>
              <p className="text-sm leading-relaxed text-white/60">{rule.text}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Подвал */}
      <div className="mt-12 text-center">
        <p className="text-sm text-white/35">
          Вопросы? Пишите в{" "}
          <Link href="https://t.me/pixelplay_mogilev" target="_blank" className="text-brand hover:underline">
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
