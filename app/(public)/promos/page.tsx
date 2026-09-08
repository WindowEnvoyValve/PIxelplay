"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { fadeUp, staggerContainer, staggerItem, cardHover } from "@/lib/animations";
import { SOCIAL_LINKS } from "@/lib/site-config";

export default function PromosPage() {
  return (
    <main className="mx-auto max-w-7xl px-6 pb-24 pt-32 md:px-10">
      <motion.div variants={fadeUp} initial="hidden" animate="visible" className="mb-14">
        <p className="mb-3 text-xs uppercase tracking-[0.4em] text-brand">Акции</p>
        <h1 className="font-display text-4xl font-black text-white md:text-5xl">
          ВЫГОДНО <span className="text-gradient-brand">ИГРАТЬ</span>
        </h1>
        <p className="mt-4 max-w-2xl text-white/50">
          Скидки, бонусы и специальные предложения для игроков PIXEL.
        </p>
      </motion.div>

      <motion.div
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-60px" }}
        className="grid gap-6 lg:grid-cols-2"
      >
        {/* Приложение LANGAME */}
        <motion.div variants={staggerItem} {...cardHover} className="cyber-panel flex flex-col p-8 lg:col-span-2">
          <div className="flex flex-wrap items-start justify-between gap-6">
            <div className="max-w-xl">
              <p className="text-4xl">📱</p>
              <h2 className="mt-4 font-display text-2xl font-black text-white">
                Скидка 15%{" "}
                <span className="text-sm font-semibold uppercase tracking-widest text-brand">
                  через приложение LANGAME
                </span>
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-white/55">
                Забронируй игровую зону через приложение и получите скидку 15%!
                Вся информация о бронировании и скидках прямо в приложении.
              </p>
              <ul className="mt-5 space-y-2">
                {[
                  "Просто добавьте время игры в корзину",
                  "Активируйте скидку одним кликом",
                  "Удобное управление бронированиями",
                ].map((f) => (
                  <li key={f} className="flex items-start gap-2.5 text-sm text-white/65">
                    <span className="text-brand">⚡️</span>
                    {f}
                  </li>
                ))}
              </ul>
            </div>
            <div className="flex flex-col items-center gap-6">
              {/* Скриншот приложения (без белого фона) */}
              <Image
                src="/langame.webp"
                alt="Приложение LANGAME"
                width={388}
                height={512}
                sizes="(min-width: 1280px) 288px, 256px"
                className="hidden w-64 lg:block xl:w-72"
              />
              <div className="flex flex-col items-center gap-3">
                <a
                  href="https://langame.by"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="cyber-button whitespace-nowrap text-center"
                >
                  Скачать приложение
                </a>
                <p className="max-w-[220px] text-center text-[10px] leading-relaxed text-white/30">
                  Приложение LANGAME для бронирования компьютерных клубов
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* День рождения */}
        <motion.div variants={staggerItem} {...cardHover} className="cyber-panel flex flex-col p-8">
          <div className="flex items-center justify-between">
            <p className="text-4xl">🎂</p>
            <span className="font-display text-xl font-black text-brand">15 бонусов</span>
          </div>
          <h2 className="mt-4 font-display text-xl font-black text-white">В день рождения</h2>
          <p className="mt-3 text-sm leading-relaxed text-white/55">
            В твой особенный день мы не просто поздравляем — мы дарим 15 бонусов!
            Просто приходи играть и получай подарок от клуба.
          </p>
          <ul className="mt-5 flex-1 space-y-2">
            {[
              "15 бонусов начисляются в день рождения",
              "Можно использовать на игровые часы",
              "Отличный повод собрать друзей",
            ].map((f) => (
              <li key={f} className="flex items-start gap-2.5 text-sm text-white/65">
                <span className="text-brand">⚡️</span>
                {f}
              </li>
            ))}
          </ul>
          <p className="mt-5 border-t border-white/5 pt-3 text-[11px] leading-relaxed text-white/30">
            * подарок доступен всем участникам LETS PLAY 🎮 начиная с 1-го уровня (rookie: 30 часов и выше)
          </p>
        </motion.div>

        {/* Регистрация */}
        <motion.div variants={staggerItem} {...cardHover} className="cyber-panel flex flex-col p-8">
          <div className="flex items-center justify-between">
            <p className="text-4xl">🎁</p>
            <span className="font-display text-xl font-black text-brand">10 бонусов</span>
          </div>
          <h2 className="mt-4 font-display text-xl font-black text-white">за полную регистрацию</h2>
          <p className="mt-3 text-sm leading-relaxed text-white/55">
            Зарегистрируйся, указав ФИО и номер личного документа, и сразу получи
            бонусы на счет. Это просто, быстро и выгодно!
          </p>
          <ul className="mt-5 flex-1 space-y-2">
            {[
              "Удобное управление бронированиями",
              "Онлайн-оплата и пополнение баланса",
              "Чат с администратором",
              "История игр и бонусов",
            ].map((f) => (
              <li key={f} className="flex items-start gap-2.5 text-sm text-white/65">
                <span className="text-brand">⚡️</span>
                {f}
              </li>
            ))}
          </ul>
          <a
            href={SOCIAL_LINKS.telegram}
            target="_blank"
            rel="noopener noreferrer"
            className="cyber-button mt-6 w-full"
          >
            Зарегистрироваться
          </a>
        </motion.div>

        {/* Ночные катки */}
        <motion.div variants={staggerItem} {...cardHover} className="cyber-panel flex flex-col p-8">
          <div className="flex items-center justify-between">
            <p className="text-4xl">🌙</p>
            <span className="font-display text-xl font-black text-brand">20 бонусов</span>
          </div>
          <h2 className="mt-4 font-display text-xl font-black text-white">за ночные катки</h2>
          <p className="mt-3 text-sm leading-relaxed text-white/55">
            Ночные тарифы — теперь с бонусом! Бронируй пакет Ночь, отмечай 5 ночей
            на карте и получай 20 бонусов на счет.
          </p>
          <ul className="mt-5 flex-1 space-y-2">
            {[
              "Бронируй пакет Ночь, получай карту у админа",
              "Отмечай 5 ночей на карте",
              "Верни карту админу и получи 20 бонусов",
            ].map((f) => (
              <li key={f} className="flex items-start gap-2.5 text-sm text-white/65">
                <span className="text-brand">⚡️</span>
                {f}
              </li>
            ))}
          </ul>
        </motion.div>

        {/* Такси */}
        <motion.div variants={staggerItem} {...cardHover} className="cyber-panel flex flex-col p-8">
          <div className="flex items-center justify-between">
            <p className="text-4xl">🚕</p>
            <span className="font-display text-xl font-black text-brand">до 10 рублей</span>
          </div>
          <h2 className="mt-4 font-display text-xl font-black text-white">Такси — возмещение поездки</h2>
          <p className="mt-3 text-sm leading-relaxed text-white/55">
            Приезжай к нам на такси, пополняй баланс на 20 рублей и выше.
            Мы возместим до 10 рублей от стоимости поездки!
          </p>
          <ul className="mt-5 flex-1 space-y-2">
            {[
              "Возмещение до 10 BYN",
              "При пополнении от 20 BYN",
              "Сумма за поездку вернется на бонусный счет",
            ].map((f) => (
              <li key={f} className="flex items-start gap-2.5 text-sm text-white/65">
                <span className="text-brand">⚡️</span>
                {f}
              </li>
            ))}
          </ul>
        </motion.div>
      </motion.div>
    </main>
  );
}
