import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "PIXEL — Услуги",
  description: "Дни рождения, корпоративы и турниры в компьютерных клубах PIXEL.",
  alternates: { canonical: "/services" },
  openGraph: { title: "PIXEL — Услуги", description: "Мероприятия и услуги PIXEL.", url: "/services" },
};

export default function ServicesLayout({ children }: { children: React.ReactNode }) {
  return children;
}
