import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "PIXEL — Политика конфиденциальности",
  description: "Политика обработки персональных данных сайта PIXEL.",
  alternates: { canonical: "/terms" },
  openGraph: { title: "PIXEL — Политика конфиденциальности", description: "Политика конфиденциальности PIXEL.", url: "/terms" },
};

export default function TermsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
