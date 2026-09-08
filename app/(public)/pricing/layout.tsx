import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "PIXEL — Цены",
  description: "Почасовые тарифы и пакеты времени в компьютерных клубах PIXEL.",
  alternates: { canonical: "/pricing" },
  openGraph: { title: "PIXEL — Цены", description: "Тарифы компьютерных клубов PIXEL.", url: "/pricing" },
};

export default function PricingLayout({ children }: { children: React.ReactNode }) {
  return children;
}
