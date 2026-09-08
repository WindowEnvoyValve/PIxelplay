import type { Metadata } from "next";
import { Orbitron, Exo_2 } from "next/font/google";
import { CLUBS, getMaxRefreshRate } from "@/lib/site-data";
import "./globals.css";

const maxRefreshRate = getMaxRefreshRate(CLUBS);
const siteDescription =
  `Компьютерные клубы PIXEL в Могилёве: игровые ПК, зоны с мониторами до ${maxRefreshRate} Hz, цены и услуги.`;

const orbitron = Orbitron({
  subsets: ["latin"],
  variable: "--font-orbitron",
  display: "swap",
});

const exo = Exo_2({
  subsets: ["latin", "cyrillic"],
  variable: "--font-chakra",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://pixelplay.by"),
  alternates: { canonical: "/" },
  title: "PIXEL — Компьютерные клубы в Могилёве",
  description: siteDescription,
  icons: {
    icon: "/favicon.png",
  },
  openGraph: {
    title: "PIXEL — Компьютерные клубы в Могилёве",
    description: siteDescription,
    type: "website",
    url: "/",
    siteName: "PIXEL",
    locale: "ru_RU",
    images: [{ url: "/logo.png", width: 926, height: 296, alt: "PIXEL" }],
  },
  twitter: {
    card: "summary",
    title: "PIXEL — Компьютерные клубы в Могилёве",
    description: "Игровые клубы PIXEL: компьютеры, цены, зоны и услуги.",
    images: ["/logo.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ru" className={`${orbitron.variable} ${exo.variable}`}>
      <body>{children}</body>
    </html>
  );
}