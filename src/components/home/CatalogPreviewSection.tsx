"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { CATALOG_THEMES } from "@/data/catalog";
import type { ProductLine } from "@/lib/schemas";
import { ThemeCard } from "@/components/catalog/ThemeCard";

const PREVIEW_TABS: { id: ProductLine; label: string; note: string }[] = [
  {
    id: "kado-personal",
    label: "Kado Personal",
    note: "Flagship — Anniversary, Ulang Tahun, Sahabat, LDR",
  },
  {
    id: "wedding",
    label: "Wedding",
    note: "Modern, Artistik, & Adat Nusantara",
  },
  {
    id: "save-the-date",
    label: "Save The Date",
    note: "Pengumuman tanggal acara & simpan kalender",
  },
  {
    id: "event-party",
    label: "Event & Party",
    note: "Birthday Party, Wisuda, Aqiqah, Khitanan, Bukber, Hari Raya",
  },
];

export function CatalogPreviewSection() {
  const [activeLine, setActiveLine] = useState<ProductLine>("kado-personal");

  const visibleThemes = useMemo(() => {
    const filtered = CATALOG_THEMES.filter((theme) => theme.line === activeLine);
    return filtered.slice(0, activeLine === "save-the-date" ? 4 : 6);
  }, [activeLine]);

  const activeMeta = PREVIEW_TABS.find((t) => t.id === activeLine) ?? PREVIEW_TABS[0];

  const gridClass =
    activeLine === "save-the-date"
      ? "mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4"
      : "mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3";

  return (
    <section
      id="katalog-preview"
      className="mx-auto max-w-[1240px] px-4 py-[72px] sm:px-6 lg:px-8 lg:py-[112px]"
    >
      <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
        <div className="max-w-2xl">
          <span className="text-xs font-semibold tracking-[0.14em] text-emerald-brand uppercase">
            Katalog Tema Multi-Momen
          </span>
          <h2 className="mt-3 text-[30px] leading-[1.12] font-bold tracking-[-0.03em] text-ink text-balance sm:text-[42px]">
            Setiap momen punya{" "}
            <span className="font-serif font-normal italic text-emerald-brand">
              karakternya
            </span>{" "}
            sendiri.
          </h2>
          <p className="mt-3 text-base leading-relaxed text-muted text-pretty">
            Tiap desain di katalog memiliki palet warna, tipografi, dan mekanik interaktif
            masing-masing—siap kamu sesuaikan sendiri atau dirangkaikan tim kami.
          </p>
        </div>

        <Link
          href={`/katalog?lini=${activeLine}`}
          className="inline-flex h-11 shrink-0 items-center gap-2 self-start rounded-full border border-hairline bg-surface px-5 text-sm font-semibold text-ink transition-colors hover:border-emerald-brand hover:text-emerald-brand lg:self-auto"
        >
          Lihat Semua Katalog
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>

      {/* Category Switcher */}
      <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div
          role="tablist"
          aria-label="Pilih lini produk katalog"
          className="flex flex-wrap gap-2"
        >
          {PREVIEW_TABS.map((tab) => {
            const selected = tab.id === activeLine;
            return (
              <button
                key={tab.id}
                type="button"
                role="tab"
                aria-selected={selected}
                onClick={() => setActiveLine(tab.id)}
                className={`min-h-[42px] rounded-full px-4 text-sm font-semibold transition-colors duration-150 ${
                  selected
                    ? "bg-emerald-brand text-white"
                    : "border border-hairline bg-surface text-ink hover:bg-subtle"
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>
        <p className="text-sm text-muted">{activeMeta.note}</p>
      </div>

      {/* Cards Grid */}
      <div className={gridClass}>
        {visibleThemes.map((theme) => (
          <ThemeCard key={theme.slug} theme={theme} />
        ))}
      </div>

      <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
        <Link
          href={`/katalog?lini=${activeLine}`}
          className="inline-flex h-12 items-center gap-2 rounded-full bg-emerald-brand px-6 text-[15px] font-semibold text-white transition-colors hover:bg-emerald-hover"
        >
          Jelajahi Seluruh {activeMeta.label}
          <ArrowRight className="h-4 w-4" />
        </Link>
        <Link
          href="/buat?mode=mandiri"
          className="inline-flex h-12 items-center rounded-full border border-control/60 bg-surface px-6 text-[15px] font-semibold text-ink transition-colors hover:bg-subtle"
        >
          Coba Gratis 2 Hari
        </Link>
      </div>
    </section>
  );
}
