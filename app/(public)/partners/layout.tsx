import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "PIXEL — Партнёрам",
  description: "Партнёрские проекты, услуги и кейсы PIXEL в сфере киберспорта и гейминга.",
  alternates: { canonical: "/partners" },
  openGraph: { title: "PIXEL — Партнёрам", description: "Партнёрские проекты и кейсы PIXEL.", url: "/partners" },
};

export default function PartnersLayout({ children }: { children: React.ReactNode }) {
  return children;
}
