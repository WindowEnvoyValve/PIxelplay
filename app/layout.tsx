import type { Metadata } from "next";
import { Orbitron, Exo_2 } from "next/font/google";
import "./globals.css";

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
  title: "PIXEL — Сеть киберклубов",
  description:
    "Премиальные киберклубы PIXEL: RTX 40/50, 240Hz, кресла Brave/Lorgar. Бронируй место, копи бонусы LETS PLAY, участвуй в турнирах.",
  icons: {
    icon: "/favicon.png",
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
