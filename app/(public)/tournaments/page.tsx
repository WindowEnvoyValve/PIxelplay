import type { Metadata } from "next";
import { SITE_URL } from "@/lib/site-config";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || SITE_URL;

export const metadata: Metadata = {
  title: "Турниры | PIXEL",
  description: "Турниры и киберспортивные события в компьютерных клубах PIXEL.",
  alternates: {
    canonical: `${siteUrl}/tournaments`,
  },
  openGraph: {
    title: "Турниры | PIXEL",
    description: "Турниры и киберспортивные события в компьютерных клубах PIXEL.",
    url: `${siteUrl}/tournaments`,
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Турниры | PIXEL",
    description: "Турниры и киберспортивные события в компьютерных клубах PIXEL.",
  },
};

export default function TournamentsPage() {
  return (
    <main className="mx-auto flex min-h-[70vh] max-w-4xl items-center justify-center px-6 pb-24 pt-32 md:px-10">
      <div className="page-reveal text-center">
        <p className="mb-3 text-xs uppercase tracking-[0.4em] text-brand">Скоро</p>
        <h1 className="font-display text-4xl font-black text-white md:text-5xl">
          ТУРНИРЫ
        </h1>
        <p className="mx-auto mt-5 max-w-md text-sm leading-relaxed text-white/60">
          Раздел турниров скоро появится.
        </p>
      </div>
    </main>
  );
}
