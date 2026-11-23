import Link from "next/link";
import { ArrowUpRight, Play } from "lucide-react";
import type { ThemeItem } from "@/lib/schemas";
import { formatRupiah } from "@/lib/format";
import { ThemeArtwork } from "./ThemeArtwork";

interface ThemeCardProps {
  theme: ThemeItem;
  featured?: boolean;
}

export function ThemeCard({ theme }: ThemeCardProps) {
  return (
    <article className="group flex h-full flex-col rounded-[20px] border border-hairline bg-surface p-4 transition-all duration-200 hover:-translate-y-0.5 hover:border-control/50 hover:shadow-[var(--shadow-card-hover)]">
      <div className="relative">
        <ThemeArtwork theme={theme} />
        {theme.badge && (
          <span className="absolute top-3 left-3 rounded-full bg-gold px-3 py-1 text-[11px] font-semibold text-ink shadow-xs">
            {theme.badge}
          </span>
        )}
      </div>

      <div className="mt-4 flex flex-1 flex-col">
        <div className="flex items-center justify-between gap-2">
          <span className="rounded-full bg-accent-soft px-2.5 py-0.5 text-xs font-medium text-ink">
            {theme.subCategory}
          </span>

          <div className="flex items-center gap-1.5" aria-label="Palet warna tema">
            <span
              className="h-3 w-3 rounded-full border border-hairline"
              style={{ backgroundColor: theme.palette.accent }}
              title={`Aksen ${theme.palette.accent}`}
            />
            <span
              className="h-3 w-3 rounded-full border border-hairline"
              style={{ backgroundColor: theme.palette.base }}
              title={`Dasar ${theme.palette.base}`}
            />
            <span
              className="h-3 w-3 rounded-full border border-hairline"
              style={{ backgroundColor: theme.palette.soft }}
              title={`Lembut ${theme.palette.soft}`}
            />
          </div>
        </div>

        <h3 className="mt-2.5 text-[20px] leading-snug font-semibold tracking-[-0.02em] text-ink text-balance">
          <Link href={`/katalog/${theme.slug}`} className="hover:text-emerald-brand">
            {theme.name}
          </Link>
        </h3>

        <p className="mt-1.5 text-sm leading-relaxed text-muted text-pretty">
          {theme.tagline}
        </p>

        <div className="mt-auto pt-4">
          <div className="flex items-baseline justify-between border-t border-hairline pt-3">
            <div>
              <span className="text-xs text-muted">Mulai dari</span>
              <p className="text-base font-bold text-ink tabular-nums">
                {formatRupiah(theme.startingPrice)}
              </p>
            </div>
            <span className="text-xs font-medium text-muted">
              Mandiri / Terima Beres
            </span>
          </div>

          <div className="mt-3 grid grid-cols-2 gap-2">
            <Link
              href={`/demo/${theme.slug}`}
              className="inline-flex h-11 items-center justify-center gap-1.5 rounded-full border border-hairline bg-surface px-3 text-sm font-semibold text-ink transition-colors duration-150 hover:border-control hover:bg-subtle"
            >
              <Play className="h-3.5 w-3.5 text-emerald-brand" strokeWidth={2.2} />
              Demo
            </Link>
            <Link
              href={`/katalog/${theme.slug}`}
              className="inline-flex h-11 items-center justify-center gap-1 rounded-full bg-emerald-brand px-3 text-sm font-semibold text-white transition-colors duration-150 hover:bg-emerald-hover"
            >
              Pilih
              <ArrowUpRight className="h-3.5 w-3.5" strokeWidth={2.2} />
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
}
