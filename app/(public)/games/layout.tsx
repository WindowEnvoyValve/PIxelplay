import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "PIXEL — Список игр",
  description: "Популярные игры, доступные в компьютерных клубах PIXEL.",
  alternates: { canonical: "/games" },
  openGraph: { title: "PIXEL — Список игр", description: "Популярные игры в клубах PIXEL.", url: "/games" },
};

export default function GamesLayout({ children }: { children: React.ReactNode }) {
  return children;
}
