"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowUpRight,
  Check,
  Copy,
  Monitor,
  Play,
  Smartphone,
  Sparkles,
} from "lucide-react";
import type { ThemeItem } from "@/lib/schemas";
import { formatRupiah } from "@/lib/format";
import { ThemeArtwork } from "./ThemeArtwork";
import { ThemeCard } from "./ThemeCard";

interface ThemeDetailClientProps {
  theme: ThemeItem;
  related: ThemeItem[];
}

export function ThemeDetailClient({ theme, related }: ThemeDetailClientProps) {
  const [device, setDevice] = useState<"mobile" | "desktop">("mobile");
  const [copiedHex, setCopiedHex] = useState<string | null>(null);

  const handleCopyHex = async (hex: string) => {
    try {
      await navigator.clipboard.writeText(hex);
      setCopiedHex(hex);
      window.setTimeout(() => setCopiedHex(null), 1500);
    } catch {
      setCopiedHex(null);
    }
  };

  return (
    <div className="mx-auto max-w-[1240px] px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
      <Link
        href={`/katalog?lini=${theme.line}`}
        className="inline-flex items-center gap-1.5 text-sm font-semibold text-muted hover:text-emerald-brand"
      >
        <ArrowLeft className="h-4 w-4" />
        Kembali ke Katalog
      </Link>

      <div className="mt-6 grid items-start gap-10 lg:grid-cols-12">
        {/* Left: Interactive Device Preview */}
        <div className="rounded-[24px] border border-hairline bg-subtle p-5 sm:p-7 lg:col-span-6">
          <div className="flex flex-wrap items-center justify-between gap-3 pb-4">
            <div className="inline-flex rounded-full border border-hairline bg-surface p-1">
              <button
                type="button"
                onClick={() => setDevice("mobile")}
                className={`inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-semibold ${
                  device === "mobile" ? "bg-emerald-brand text-white" : "text-muted"
                }`}
              >
                <Smartphone className="h-3.5 w-3.5" />
                Mobile (390px)
              </button>
              <button
                type="button"
                onClick={() => setDevice("desktop")}
                className={`inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-semibold ${
                  device === "desktop" ? "bg-emerald-brand text-white" : "text-muted"
                }`}
              >
                <Monitor className="h-3.5 w-3.5" />
                Desktop
              </button>
            </div>

            <Link
              href={`/demo/${theme.slug}`}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-brand hover:underline"
            >
              <Play className="h-3.5 w-3.5 fill-current" />
              Buka Demo Layar Penuh
            </Link>
          </div>

          <div className="flex justify-center">
            <div
              className={`w-full transition-all duration-300 ${
                device === "mobile" ? "max-w-[330px]" : "max-w-full"
              }`}
            >
              <div className="rounded-[22px] border border-hairline bg-surface p-3 shadow-[var(--shadow-stage)]">
                <ThemeArtwork theme={theme} />
              </div>
            </div>
          </div>

          <div className="mt-5 flex justify-center">
            <Link
              href={`/demo/${theme.slug}`}
              className="inline-flex h-11 items-center gap-2 rounded-full bg-surface px-5 text-sm font-semibold text-ink border border-hairline hover:border-emerald-brand"
            >
              <Play className="h-4 w-4 text-emerald-brand" />
              Mainkan Demo Interaktif Penuh
            </Link>
          </div>
        </div>

        {/* Right: Story, Palette, Mechanics, Hybrid Actions */}
        <div className="lg:col-span-6">
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-full bg-accent-soft px-3 py-1 text-xs font-semibold text-ink">
              {theme.subCategory}
            </span>
            {theme.badge && (
              <span className="rounded-full bg-gold px-3 py-1 text-xs font-semibold text-ink">
                {theme.badge}
              </span>
            )}
          </div>

          <h1 className="mt-3 text-[34px] leading-tight font-bold tracking-[-0.03em] text-ink text-balance sm:text-[42px]">
            {theme.name}
          </h1>
          <p className="mt-2 text-lg text-muted text-pretty">{theme.tagline}</p>

          {/* Story */}
          <div className="mt-6 rounded-2xl border border-hairline bg-surface p-5">
            <h2 className="text-xs font-semibold tracking-wider text-emerald-brand uppercase">
              Cerita Konsep Tema
            </h2>
            <p className="mt-2 text-[15px] leading-relaxed text-ink text-pretty">{theme.story}</p>
          </div>

          {/* 3-HEX Palette */}
          <div className="mt-6">
            <h2 className="text-xs font-semibold tracking-wider text-muted uppercase">
              Palet Warna Bawaan Produk (Klik untuk salin)
            </h2>
            <div className="mt-2.5 grid grid-cols-3 gap-3">
              {[
                { label: "Aksen", hex: theme.palette.accent },
                { label: "Dasar", hex: theme.palette.base },
                { label: "Lembut", hex: theme.palette.soft },
              ].map((swatch) => (
                <button
                  key={swatch.label}
                  type="button"
                  onClick={() => handleCopyHex(swatch.hex)}
                  className="flex items-center gap-2.5 rounded-xl border border-hairline bg-surface p-2.5 text-left hover:border-emerald-brand"
                >
                  <span
                    className="h-8 w-8 shrink-0 rounded-lg border border-black/10"
                    style={{ backgroundColor: swatch.hex }}
                  />
                  <div className="min-w-0">
                    <p className="text-xs font-semibold text-ink">{swatch.label}</p>
                    <p className="inline-flex items-center gap-1 text-[11px] font-mono text-muted">
                      {copiedHex === swatch.hex ? (
                        <>
                          <Check className="h-3 w-3 text-emerald-brand" />
                          Disalin
                        </>
                      ) : (
                        <>
                          {swatch.hex}
                          <Copy className="h-2.5 w-2.5" />
                        </>
                      )}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Mechanics & Features */}
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl border border-hairline bg-surface p-4">
              <h2 className="text-xs font-semibold tracking-wider text-muted uppercase">
                Mekanik Interaktif
              </h2>
              <ul className="mt-2.5 space-y-1.5 text-sm text-ink">
                {theme.mechanics.map((m) => (
                  <li key={m} className="flex items-center gap-2">
                    <Sparkles className="h-3.5 w-3.5 shrink-0 text-gold" />
                    <span>{m}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-2xl border border-hairline bg-surface p-4">
              <h2 className="text-xs font-semibold tracking-wider text-muted uppercase">
                Fitur Didukung
              </h2>
              <ul className="mt-2.5 space-y-1.5 text-sm text-ink">
                {theme.features.map((f) => (
                  <li key={f} className="flex items-center gap-2">
                    <Check className="h-3.5 w-3.5 shrink-0 text-emerald-brand" />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Pricing + Dual Hybrid Action */}
          <div className="mt-6 rounded-2xl border border-emerald-brand/30 bg-surface p-5 shadow-xs">
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <div>
                <span className="text-xs text-muted">
                  Tersedia di paket: {theme.recommendedPackages.join(" · ")}
                </span>
                <p className="mt-0.5 text-2xl font-bold text-ink tabular-nums">
                  Mulai {formatRupiah(theme.startingPrice)}
                </p>
              </div>
              <span className="rounded-full bg-accent-soft px-3 py-1 text-xs font-semibold text-emerald-brand">
                Gratis Trial Mandiri 2 Hari
              </span>
            </div>

            <div className="mt-5 flex flex-col gap-3 sm:flex-row">
              <Link
                href={`/buat?tema=${theme.slug}&mode=mandiri`}
                className="inline-flex h-12 flex-1 items-center justify-center gap-2 rounded-full bg-emerald-brand px-5 text-sm font-semibold text-white transition-colors hover:bg-emerald-hover"
              >
                Gunakan Tema — Buat Sendiri
                <ArrowUpRight className="h-4 w-4" />
              </Link>
              <Link
                href={`/buat?tema=${theme.slug}&mode=terima-beres`}
                className="inline-flex h-12 flex-1 items-center justify-center gap-2 rounded-full border border-gold bg-gold-soft px-5 text-sm font-semibold text-ink transition-colors hover:bg-gold/30"
              >
                Pesan Terima Beres
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Related Themes */}
      {related.length > 0 && (
        <section className="mt-16 border-t border-hairline pt-12">
          <h2 className="text-2xl font-bold tracking-tight text-ink">
            Tema sejenis yang mungkin kamu suka
          </h2>
          <div className="mt-6 grid gap-6 md:grid-cols-3">
            {related.map((item) => (
              <ThemeCard key={item.slug} theme={item} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
