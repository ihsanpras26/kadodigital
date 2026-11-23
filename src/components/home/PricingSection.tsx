"use client";

import { useState } from "react";
import Link from "next/link";
import { Check, Sparkles } from "lucide-react";
import { PRICING_ADDONS, PRICING_TABS, PRICING_TIERS, type PricingTabId } from "@/data/pricing";
import { formatRupiah } from "@/lib/format";

export function PricingSection() {
  const [activeTab, setActiveTab] = useState<PricingTabId>("kado-personal");

  const currentTabMeta = PRICING_TABS.find((t) => t.id === activeTab) ?? PRICING_TABS[0];
  const tiers = PRICING_TIERS.filter((tier) => tier.tab === activeTab);

  const gridClass =
    tiers.length === 1
      ? "mt-8 mx-auto max-w-md"
      : tiers.length === 4
      ? "mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-4"
      : tiers.length === 5
      ? "mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5"
      : "mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3";

  return (
    <section
      id="harga"
      className="mx-auto max-w-[1240px] px-4 py-[72px] sm:px-6 lg:px-8 lg:py-[112px]"
    >
      <div className="max-w-2xl">
        <span className="text-xs font-semibold tracking-[0.14em] text-emerald-brand uppercase">
          Paket &amp; Harga Transparan
        </span>
        <h2 className="mt-3 text-[30px] leading-[1.12] font-bold tracking-[-0.03em] text-ink text-balance sm:text-[42px]">
          Pilih paket sesuai{" "}
          <span className="font-serif font-normal italic text-emerald-brand">momen</span>,
          masa aktif tertulis jelas.
        </h2>
        <p className="mt-3 text-base leading-relaxed text-muted text-pretty">
          Semua paket sudah mencakup animasi, interaksi mobile-first, dan link personal. Kamu bebas
          mulai gratis 2 hari sebelum memutuskan bayar.
        </p>
      </div>

      {/* Pricing Category Tabs */}
      <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div role="tablist" aria-label="Kategori paket harga" className="flex flex-wrap gap-2">
          {PRICING_TABS.map((tab) => {
            const selected = tab.id === activeTab;
            return (
              <button
                key={tab.id}
                type="button"
                role="tab"
                aria-selected={selected}
                onClick={() => setActiveTab(tab.id)}
                className={`min-h-[42px] rounded-full px-4 text-sm font-semibold transition-colors ${
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
        <p className="text-sm text-muted">{currentTabMeta.subtitle}</p>
      </div>

      {/* Tiers Grid */}
      <div className={gridClass}>
        {tiers.map((tier) => {
          const isSignature = tier.id === "kado-signature";
          const targetHref = isSignature
            ? `/buat?mode=terima-beres&paket=${tier.id}`
            : `/buat?paket=${tier.id}`;

          return (
            <article
              key={tier.id}
              className={`relative flex h-full flex-col rounded-[20px] border bg-surface p-6 ${
                tier.highlighted
                  ? "border-emerald-brand ring-1 ring-emerald-brand/30 shadow-[var(--shadow-card-hover)]"
                  : "border-hairline"
              }`}
            >
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs font-bold tracking-wider text-ink uppercase">
                  {tier.name}
                </span>
                {tier.badge ? (
                  <span className="inline-flex items-center gap-1 rounded-full bg-gold px-2.5 py-0.5 text-[11px] font-semibold text-ink">
                    <Sparkles className="h-3 w-3" />
                    {tier.badge}
                  </span>
                ) : (
                  <span className="rounded-full bg-subtle px-2.5 py-0.5 text-[11px] font-medium text-muted">
                    {tier.activePeriod}
                  </span>
                )}
              </div>

              {tier.badge && (
                <p className="mt-1 text-xs font-medium text-emerald-brand">
                  {tier.activePeriod}
                </p>
              )}

              <p className="mt-2 text-sm text-muted text-pretty">{tier.subtitle}</p>

              <div className="mt-5 border-y border-hairline py-4">
                {tier.originalPrice && (
                  <p className="text-xs text-muted line-through tabular-nums">
                    {formatRupiah(tier.originalPrice)}
                  </p>
                )}
                <p className="text-[28px] leading-tight font-bold tracking-tight text-ink tabular-nums">
                  {formatRupiah(tier.price)}
                </p>
                <p className="mt-1 text-xs font-medium text-emerald-brand">{tier.modeNote}</p>
              </div>

              <ul className="mt-5 flex-1 space-y-2.5 text-sm text-ink">
                {tier.features.map((feat) => (
                  <li key={feat} className="flex items-start gap-2">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-brand" strokeWidth={2.5} />
                    <span className="leading-snug text-pretty">{feat}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-6 pt-2">
                <Link
                  href={targetHref}
                  className={`inline-flex h-11 w-full items-center justify-center rounded-full px-4 text-sm font-semibold transition-colors ${
                    tier.highlighted
                      ? "bg-emerald-brand text-white hover:bg-emerald-hover"
                      : "border border-control/60 bg-surface text-ink hover:bg-subtle"
                  }`}
                >
                  {tier.ctaLabel}
                </Link>
              </div>
            </article>
          );
        })}
      </div>

      {/* Transparent Add-on Bar */}
      <div className="mt-10 rounded-[20px] border border-hairline bg-surface p-6 sm:p-8">
        <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-center">
          <h3 className="text-base font-semibold text-ink">
            Opsi Tambahan &amp; Layanan Studio (Opsional)
          </h3>
          <Link
            href="/layanan"
            className="text-sm font-semibold text-emerald-brand hover:underline"
          >
            Lihat semua layanan studio →
          </Link>
        </div>

        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {PRICING_ADDONS.map((addon) => (
            <div
              key={addon.name}
              className="rounded-xl border border-hairline bg-canvas p-4"
            >
              <p className="text-xs font-bold text-ink">{addon.name}</p>
              <p className="mt-1 text-xs font-semibold text-emerald-brand tabular-nums">
                {addon.priceText}
              </p>
              <p className="mt-1.5 text-xs leading-relaxed text-muted">{addon.note}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
