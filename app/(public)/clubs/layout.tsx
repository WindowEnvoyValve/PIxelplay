import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "PIXEL — Клубы и локации",
  description: "Адреса, зоны, оборудование и схемы залов компьютерных клубов PIXEL в Могилёве.",
  alternates: { canonical: "/clubs" },
  openGraph: { title: "PIXEL — Клубы и локации", description: "Адреса, зоны и оборудование клубов PIXEL.", url: "/clubs" },
};

export default function ClubsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
