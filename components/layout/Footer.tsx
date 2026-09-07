import Link from "next/link";
import { Logo } from "@/components/ui/Logo";
import { DEMO_CLUBS } from "@/lib/mock-data";

export function Footer() {
  return (
    <footer className="relative border-t border-brand/15 bg-panel">
      <div className="mx-auto grid max-w-7xl gap-10 px-6 py-14 md:grid-cols-4 md:px-10">
        <div>
          <Logo size={48} />
          <p className="mt-4 max-w-xs text-sm text-white/40">
            Сеть компьютерных клубов. Играй на максимуме — копи бонусы и побеждай в турнирах.
          </p>
        </div>

        <div>
          <h4 className="mb-4 text-xs font-bold uppercase tracking-[0.25em] text-brand">Клубы</h4>
          <ul className="space-y-2.5 text-sm text-white/50">
            {DEMO_CLUBS.map((club) => (
              <li key={club.slug}>
                <Link href="/clubs" className="transition-colors hover:text-white">
                  {club.name} — {club.address}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="mb-4 text-xs font-bold uppercase tracking-[0.25em] text-brand">Навигация</h4>
          <ul className="space-y-2.5 text-sm text-white/50">
            <li><Link href="/specs" className="transition-colors hover:text-white">Железо и цены</Link></li>
            <li><Link href="/tournaments" className="transition-colors hover:text-white">Турниры</Link></li>
            <li><Link href="/dashboard" className="transition-colors hover:text-white">Личный кабинет</Link></li>
            <li><Link href="/register" className="transition-colors hover:text-white">Регистрация</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="mb-4 text-xs font-bold uppercase tracking-[0.25em] text-brand">Контакты</h4>
          <ul className="space-y-2.5 text-sm text-white/50">
            <li>
              <a href="tel:+375293193015" className="transition-colors hover:text-white">
                +375 29 319 30 15
              </a>
            </li>
            <li>
              <a href="mailto:info@pixelplay.by" className="transition-colors hover:text-white">
                info@pixelplay.by
              </a>
            </li>
            <li>
              <a
                href="https://t.me/pixelplay_bot"
                target="_blank"
                rel="noopener noreferrer"
                className="transition-colors hover:text-white"
              >
                @pixelplay_bot
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/5 py-5 text-center text-xs text-white/25">
        <p>
          © 2026 ООО «Пиксель Плей» — сеть компьютерных клубов PIXEL. Все права защищены.
        </p>
        <p className="mt-1.5">
          УНП 791332791 · 212038, г. Могилёв, ул. Мовчанского 53Б-1
        </p>
      </div>
    </footer>
  );
}
