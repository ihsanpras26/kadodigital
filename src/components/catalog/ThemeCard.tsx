"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowUpRight, Smartphone } from "lucide-react";
import type { ThemeItem } from "@/lib/schemas";
import { formatRupiah } from "@/lib/format";
import { ThemeArtwork } from "./ThemeArtwork";
import { PhonePreviewModal } from "./PhonePreviewModal";

interface ThemeCardProps {
  theme: ThemeItem;
  featured?: boolean;
}

export function ThemeCard({ theme }: ThemeCardProps) {
  const [previewOpen, setPreviewOpen] = useState(false);

  const isDarkBadge =
    theme.demoArchetype === "celestial-3d-wedding" ||
    theme.demoArchetype === "gacha-struk";

  return (
    <article className="group flex h-full flex-col rounded-[22px] border border-hairline/90 bg-surface p-3.5 transition-all duration-200 hover:-translate-y-1 hover:border-emerald-brand/40 hover:shadow-[0_20px_48px_-20px_rgba(22,32,27,0.16)]">
      <div className="relative">
        <button
          type="button"
          onClick={() => setPreviewOpen(true)}
          aria-label={`Lihat tampilan real ${theme.name} di handphone`}
          className="block w-full text-left cursor-pointer focus-visible:rounded-[16px]"
        >
          <ThemeArtwork theme={theme} />
        </button>

        {theme.badge && (
          <span
            className={`pointer-events-none absolute top-3 left-3 z-20 rounded-full px-3 py-1 text-[11px] font-semibold tracking-tight shadow-xs backdrop-blur-md ${
              isDarkBadge
                ? "border border-[#EFC86E]/45 bg-[#121626]/86 text-[#F7DC94]"
                : "border border-black/10 bg-[#FAF7F0]/92 text-ink"
            }`}
          >
            {theme.badge}
          </span>
        )}

        <div className="pointer-events-none absolute inset-x-0 bottom-3 z-20 flex justify-center opacity-0 transition-opacity duration-200 group-hover:opacity-100">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-white/25 bg-[#121A16]/84 px-3 py-1 text-[11px] font-semibold text-white shadow-md backdrop-blur-md">
            <Smartphone className="h-3 w-3 text-[#7BE0B2]" strokeWidth={2.2} />
            Coba Live di HP
          </span>
        </div>
      </div>

      <div className="mt-3.5 flex flex-1 flex-col px-0.5">
        <div className="flex items-center justify-between gap-2">
          <span className="rounded-full bg-accent-soft px-2.5 py-0.5 text-[11px] font-semibold text-emerald-brand">
            {theme.subCategory}
          </span>

          <div className="flex items-center gap-1.5" aria-label="Palet warna tema">
            <span
              className="h-3 w-3 rounded-full ring-1 ring-black/12"
              style={{ backgroundColor: theme.palette.accent }}
              title={`Aksen ${theme.palette.accent}`}
            />
            <span
              className="h-3 w-3 rounded-full ring-1 ring-black/12"
              style={{ backgroundColor: theme.palette.base }}
              title={`Dasar ${theme.palette.base}`}
            />
            <span
              className="h-3 w-3 rounded-full ring-1 ring-black/12"
              style={{ backgroundColor: theme.palette.soft }}
              title={`Lembut ${theme.palette.soft}`}
            />
          </div>
        </div>

        <h3 className="mt-2.5 text-[18px] leading-snug font-semibold tracking-[-0.02em] text-ink text-balance sm:text-[19px]">
          <Link href={`/katalog/${theme.slug}`} className="hover:text-emerald-brand">
            {theme.name}
          </Link>
        </h3>

        <p className="mt-1.5 line-clamp-2 min-h-[44px] text-[13.5px] leading-relaxed text-muted text-pretty">
          {theme.tagline}
        </p>

        {/* Top 2 interactive mechanics highlight pills */}
        <div className="mt-3 flex flex-wrap gap-1.5">
          {theme.mechanics.slice(0, 2).map((mech) => (
            <span
              key={mech}
              className="max-w-full truncate rounded-md border border-hairline/75 bg-subtle/80 px-2 py-0.5 text-[11px] font-medium text-ink/80"
            >
              {mech}
            </span>
          ))}
        </div>

        <div className="mt-auto pt-3.5">
          <div className="flex items-baseline justify-between border-t border-hairline/80 pt-3">
            <div>
              <span className="text-[11px] text-muted">Mulai dari</span>
              <p className="text-[15px] font-bold text-ink tabular-nums">
                {formatRupiah(theme.startingPrice)}
              </p>
            </div>
            <span className="text-[11px] font-medium text-muted">
              Mandiri / Terima Beres
            </span>
          </div>

          <div className="mt-3 grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => setPreviewOpen(true)}
              className="inline-flex h-10 items-center justify-center gap-1.5 rounded-full border border-hairline bg-surface px-3 text-[13px] font-semibold text-ink transition-colors duration-150 hover:border-control hover:bg-subtle cursor-pointer"
            >
              <Smartphone
                className="h-3.5 w-3.5 text-emerald-brand"
                strokeWidth={2.2}
              />
              Preview HP
            </button>
            <Link
              href={`/katalog/${theme.slug}`}
              className="inline-flex h-10 items-center justify-center gap-1 rounded-full bg-emerald-brand px-3 text-[13px] font-semibold text-white transition-colors duration-150 hover:bg-emerald-hover"
            >
              Detail
              <ArrowUpRight className="h-3.5 w-3.5" strokeWidth={2.2} />
            </Link>
          </div>
        </div>
      </div>

      {previewOpen && (
        <PhonePreviewModal theme={theme} onClose={() => setPreviewOpen(false)} />
      )}
    </article>
  );
}
