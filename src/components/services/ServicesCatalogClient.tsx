"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";
import { STUDIO_SERVICES, type StudioServiceItem } from "@/data/services";
import { formatRupiah } from "@/lib/format";

type CategoryFilter = "Semua" | StudioServiceItem["category"];
type SortOption = "terbaru" | "harga-terendah" | "harga-tertinggi";

export function ServicesCatalogClient() {
  const [category, setCategory] = useState<CategoryFilter>("Semua");
  const [sortBy, setSortBy] = useState<SortOption>("terbaru");

  const items = useMemo(() => {
    const filtered =
      category === "Semua"
        ? STUDIO_SERVICES
        : STUDIO_SERVICES.filter((item) => item.category === category);

    if (sortBy === "harga-terendah") {
      return [...filtered].sort((a, b) => a.price - b.price);
    }
    if (sortBy === "harga-tertinggi") {
      return [...filtered].sort((a, b) => b.price - a.price);
    }
    return filtered;
  }, [category, sortBy]);

  return (
    <div className="mx-auto max-w-[1240px] px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
      <div className="max-w-2xl">
        <span className="text-xs font-semibold tracking-[0.14em] text-emerald-brand uppercase">
          Layanan Studio &amp; Add-on Ekosistem
        </span>
        <h1 className="mt-2.5 text-[34px] leading-tight font-bold tracking-[-0.03em] text-ink text-balance sm:text-[46px]">
          Lengkapi kado dan acaramu dengan bantuan{" "}
          <span className="font-serif font-normal italic text-emerald-brand">studio</span>.
        </h1>
        <p className="mt-3 text-base leading-relaxed text-muted text-pretty">
          Mulai dari jasa Terima Beres, Express Same-Day, kamera tamu QR Lensa Momen, hingga
          workspace Rencana Momen.
        </p>
      </div>

      {/* Filter & Sort Controls */}
      <div className="mt-8 flex flex-col justify-between gap-4 border-b border-hairline pb-6 sm:flex-row sm:items-center">
        <div className="flex flex-wrap gap-2">
          {(["Semua", "Studio Concierge", "Add-on Digital", "Kurasi Partner"] as CategoryFilter[]).map(
            (cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setCategory(cat)}
                className={`min-h-[40px] rounded-full px-4 text-xs font-semibold sm:text-sm ${
                  category === cat
                    ? "bg-emerald-brand text-white"
                    : "border border-hairline bg-surface text-ink hover:bg-subtle"
                }`}
              >
                {cat}
              </button>
            )
          )}
        </div>

        <div className="flex items-center gap-2">
          <label htmlFor="service-sort" className="text-xs font-semibold text-muted">
            Urutkan:
          </label>
          <select
            id="service-sort"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as SortOption)}
            className="h-10 rounded-full border border-hairline bg-surface px-3.5 text-xs font-semibold text-ink"
          >
            <option value="terbaru">Rekomendasi</option>
            <option value="harga-terendah">Harga Terendah</option>
            <option value="harga-tertinggi">Harga Tertinggi</option>
          </select>
        </div>
      </div>

      <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {items.map((svc) => (
          <article
            key={svc.id}
            className="flex h-full flex-col rounded-[20px] border border-hairline bg-surface p-6 transition-all hover:border-control/50 hover:shadow-[var(--shadow-card-hover)]"
          >
            <div className="flex items-center justify-between gap-2">
              <span className="rounded-full bg-accent-soft px-3 py-1 text-xs font-semibold text-ink">
                {svc.category}
              </span>
              {svc.badge && (
                <span className="rounded-full bg-gold px-2.5 py-0.5 text-[11px] font-semibold text-ink">
                  {svc.badge}
                </span>
              )}
            </div>

            <h2 className="mt-4 text-xl font-bold tracking-tight text-ink text-balance">
              {svc.title}
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-muted text-pretty">{svc.summary}</p>

            <ul className="mt-4 flex-1 space-y-2 border-t border-hairline pt-4 text-sm text-ink">
              {svc.deliverables.map((d) => (
                <li key={d} className="flex items-start gap-2">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-brand" />
                  <span>{d}</span>
                </li>
              ))}
            </ul>

            <div className="mt-6 border-t border-hairline pt-4">
              <div className="flex items-baseline gap-2">
                <p className="text-2xl font-bold text-ink tabular-nums">
                  {formatRupiah(svc.price)}
                </p>
                {svc.originalPrice && (
                  <span className="text-xs text-muted line-through tabular-nums">
                    {formatRupiah(svc.originalPrice)}
                  </span>
                )}
              </div>

              <Link
                href={svc.actionHref}
                className="mt-4 inline-flex h-11 w-full items-center justify-center gap-2 rounded-full bg-emerald-brand text-sm font-semibold text-white transition-colors hover:bg-emerald-hover"
              >
                {svc.actionLabel}
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
