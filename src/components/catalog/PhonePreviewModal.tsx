"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import {
  ArrowUpRight,
  ExternalLink,
  Smartphone,
  Sparkles,
  X,
} from "lucide-react";
import type { ThemeItem } from "@/lib/schemas";
import { formatRupiah } from "@/lib/format";
import { LiveDeviceStage } from "./LiveDeviceStage";

interface PhonePreviewModalProps {
  theme: ThemeItem;
  onClose: () => void;
}

export function PhonePreviewModal({ theme, onClose }: PhonePreviewModalProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose]);

  if (!mounted) return null;

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`Preview tampilan HP tema ${theme.name}`}
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#0C120F]/72 p-3 backdrop-blur-sm sm:p-6"
    >
      <div className="relative max-h-[94dvh] w-full max-w-[820px] overflow-y-auto rounded-[28px] border border-hairline bg-canvas p-5 shadow-[var(--shadow-overlay)] sm:p-7">
        {/* Top Mobile Header + Always-Reachable Close Button */}
        <div className="mb-4 flex items-center justify-between gap-3 lg:mb-0">
          <div className="inline-flex items-center gap-1.5 rounded-full border border-emerald-brand/25 bg-accent-soft px-3 py-1 text-[11px] font-semibold text-emerald-brand lg:hidden">
            <Smartphone className="h-3.5 w-3.5" />
            <span>Preview Live di HP</span>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Tutup preview HP"
            className="ml-auto inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-hairline bg-surface text-ink transition-colors hover:border-emerald-brand hover:text-emerald-brand cursor-pointer"
          >
            <X className="h-4.5 w-4.5" />
          </button>
        </div>

        <div className="grid items-center gap-6 lg:grid-cols-[minmax(0,356px)_1fr] lg:gap-8">
          {/* Left: Live Interactive Smartphone Mockup */}
          <div className="flex justify-center">
            <LiveDeviceStage theme={theme} device="mobile" compact />
          </div>

          {/* Right: Theme Metadata & Direct Actions */}
          <div className="flex flex-col">
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-full bg-accent-soft px-3 py-1 text-xs font-semibold text-emerald-brand">
                {theme.subCategory}
              </span>
              {theme.badge && (
                <span className="rounded-full bg-gold-soft border border-gold/40 px-3 py-1 text-xs font-semibold text-ink">
                  {theme.badge}
                </span>
              )}
            </div>

            <h2 className="mt-3 text-2xl leading-tight font-bold tracking-[-0.025em] text-ink sm:text-[28px]">
              {theme.name}
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-muted text-pretty sm:text-[15px]">
              {theme.tagline}
            </p>

            <div className="mt-4 rounded-2xl border border-emerald-brand/20 bg-surface p-3.5 text-xs leading-relaxed text-ink/85">
              <p className="inline-flex items-center gap-1.5 font-semibold text-emerald-brand">
                <Sparkles className="h-3.5 w-3.5" />
                Tampilan Real Saat Sudah Dibuka
              </p>
              <p className="mt-1 text-muted">
                Coba gulir isi undangan/kado, uji fitur interaktif di dalam layar HP,
                atau klik &ldquo;Sampul Pembuka&rdquo; untuk melihat animasi awalnya.
              </p>
            </div>

            {/* 3-Color Swatches */}
            <div className="mt-4 flex items-center gap-2.5">
              <span className="text-xs font-semibold text-muted">Palet:</span>
              <div className="flex items-center gap-1.5">
                {[
                  { label: "Aksen", hex: theme.palette.accent },
                  { label: "Dasar", hex: theme.palette.base },
                  { label: "Lembut", hex: theme.palette.soft },
                ].map((s) => (
                  <span
                    key={s.label}
                    title={`${s.label}: ${s.hex}`}
                    className="h-4.5 w-4.5 rounded-full ring-1 ring-black/15"
                    style={{ backgroundColor: s.hex }}
                  />
                ))}
              </div>
              <span className="ml-auto text-xs font-semibold text-ink tabular-nums">
                Mulai {formatRupiah(theme.startingPrice)}
              </span>
            </div>

            {/* Mekanik Chips */}
            <div className="mt-4 flex flex-wrap gap-1.5">
              {theme.mechanics.slice(0, 4).map((mech) => (
                <span
                  key={mech}
                  className="rounded-lg border border-hairline bg-surface px-2.5 py-1 text-[11px] font-medium text-ink/85"
                >
                  {mech}
                </span>
              ))}
            </div>

            {/* Actions */}
            <div className="mt-6 flex flex-col gap-2.5">
              <Link
                href={`/buat?tema=${theme.slug}`}
                onClick={onClose}
                className="inline-flex h-11 items-center justify-center gap-2 rounded-full bg-emerald-brand px-5 text-sm font-semibold text-white transition-colors hover:bg-emerald-hover"
              >
                Gunakan Tema Ini
                <ArrowUpRight className="h-4 w-4" />
              </Link>

              <Link
                href={`/demo/${theme.slug}`}
                onClick={onClose}
                className="inline-flex h-11 items-center justify-center gap-2 rounded-full border border-hairline bg-surface px-5 text-sm font-semibold text-ink transition-colors hover:border-emerald-brand"
              >
                <ExternalLink className="h-3.5 w-3.5 text-emerald-brand" />
                Buka Demo Layar Penuh
              </Link>

              <Link
                href={`/katalog/${theme.slug}`}
                onClick={onClose}
                className="mt-1 inline-flex items-center justify-center text-xs font-semibold text-muted underline underline-offset-4 hover:text-emerald-brand"
              >
                Lihat Detail &amp; Fitur Lengkap
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>,
    document.body,
  );
}
