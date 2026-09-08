import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "PIXEL — Правила посещения",
  description: "Правила посещения и пользования компьютерными клубами PIXEL.",
  alternates: { canonical: "/rules" },
  openGraph: { title: "PIXEL — Правила посещения", description: "Правила посещения клубов PIXEL.", url: "/rules" },
};

export default function RulesLayout({ children }: { children: React.ReactNode }) {
  return children;
}
