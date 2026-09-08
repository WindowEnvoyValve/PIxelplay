import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "PIXEL — Характеристики клубов",
  description: "Характеристики компьютеров, мониторов и оборудования зон клубов PIXEL.",
  alternates: { canonical: "/specs" },
  openGraph: { title: "PIXEL — Характеристики клубов", description: "Оборудование клубов PIXEL.", url: "/specs" },
};

export default function SpecsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
