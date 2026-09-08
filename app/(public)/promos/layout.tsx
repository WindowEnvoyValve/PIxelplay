import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "PIXEL — Акции",
  description: "Актуальные акции и специальные предложения компьютерных клубов PIXEL.",
  alternates: { canonical: "/promos" },
  openGraph: { title: "PIXEL — Акции", description: "Акции и предложения PIXEL.", url: "/promos" },
};

export default function PromosLayout({ children }: { children: React.ReactNode }) {
  return children;
}
