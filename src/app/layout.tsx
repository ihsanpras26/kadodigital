import type { Metadata } from "next";
import {
  Bricolage_Grotesque,
  Caveat,
  Instrument_Serif,
  Nunito,
  Playfair_Display,
  Plus_Jakarta_Sans,
  Space_Mono,
} from "next/font/google";
import "./globals.css";
import { ChromeShell } from "@/components/layout/ChromeShell";

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-jakarta",
  display: "swap",
});

const nunito = Nunito({
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
  variable: "--font-nunito",
  display: "swap",
});

const instrumentSerif = Instrument_Serif({
  subsets: ["latin"],
  weight: ["400"],
  style: ["normal", "italic"],
  variable: "--font-instrument",
  display: "swap",
});

const bricolage = Bricolage_Grotesque({
  subsets: ["latin"],
  weight: ["600", "700", "800"],
  variable: "--font-bricolage",
  display: "swap",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-playfair",
  display: "swap",
});

const caveat = Caveat({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-caveat",
  display: "swap",
});

const spaceMono = Space_Mono({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-receipt",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Kado Digital — Kado Ucapan Interaktif & Undangan Digital Modern",
    template: "%s | Kado Digital",
  },
  description:
    "Buat kado ucapan interaktif untuk anniversary & ulang tahun—atau undangan digital modern untuk segala acara. Bisa rangkai sendiri atau terima beres dibantu tim studio.",
  openGraph: {
    title: "Kado Digital — Cerita kamu, jadi kejutan yang tak terlupakan",
    description:
      "Platform kado ucapan digital interaktif dan undangan online modern dengan pilihan Buat Sendiri atau Terima Beres.",
    type: "website",
    locale: "id_ID",
    siteName: "Kado Digital",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="id"
      className={`${plusJakarta.variable} ${nunito.variable} ${instrumentSerif.variable} ${bricolage.variable} ${playfair.variable} ${caveat.variable} ${spaceMono.variable}`}
    >
      <body className="min-h-screen bg-canvas text-ink antialiased">
        <ChromeShell>{children}</ChromeShell>
      </body>
    </html>
  );
}
