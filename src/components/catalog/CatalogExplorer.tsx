"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { RotateCcw, Search } from "lucide-react";
import { CATALOG_THEMES, PRODUCT_LINES, THEME_COLORS } from "@/data/catalog";
import type { ProductLine, ThemeColorTag } from "@/lib/schemas";
import { ThemeCard } from "./ThemeCard";
import { LensaMomenConfigurator } from "./LensaMomenConfigurator";
import { RencanaMomenShowcase } from "./RencanaMomenShowcase";

function isValidProductLine(val: string | null): val is ProductLine {
  return PRODUCT_LINES.some((line) => line.id === val);
}

export function CatalogExplorer() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const initialParam = searchParams.get("lini");
  const initialLine: ProductLine = isValidProductLine(initialParam)
    ? initialParam
    : "kado-personal";

  const [activeLine, setActiveLine] = useState<ProductLine>(initialLine);
  const [activeSubCat, setActiveSubCat] = useState<string>("Semua");
  const [selectedColor, setSelectedColor] = useState<ThemeColorTag | "all">("all");
  const [searchQuery, setSearchQuery] = useState<string>("");

  useEffect(() => {
    const param = searchParams.get("lini");
    if (isValidProductLine(param)) {
      setActiveLine(param);
      setActiveSubCat("Semua");
      setSelectedColor("all");
    }
  }, [searchParams]);

  const currentLineMeta =
    PRODUCT_LINES.find((item) => item.id === activeLine) ?? PRODUCT_LINES[0];

  const handleSelectLine = (lineId: ProductLine) => {
    setActiveLine(lineId);
    setActiveSubCat("Semua");
    setSelectedColor("all");
    setSearchQuery("");
    router.replace(`/katalog?lini=${lineId}`, { scroll: false });
  };

  const resetFilters = () => {
    setActiveSubCat("Semua");
    setSelectedColor("all");
    setSearchQuery("");
  };

  const filteredThemes = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    return CATALOG_THEMES.filter((theme) => {
      if (theme.line !== activeLine) return false;
      if (activeSubCat !== "Semua" && activeSubCat !== "Populer") {
        if (theme.subCategory !== activeSubCat) return false;
      }
      if (activeSubCat === "Populer" && !theme.isFeatured) {
        return false;
      }
      if (selectedColor !== "all" && !theme.colorTags.includes(selectedColor)) {
        return false;
      }
      if (query) {
        const haystack = `${theme.name} ${theme.tagline} ${theme.subCategory}`.toLowerCase();
        if (!haystack.includes(query)) return false;
      }
      return true;
    });
  }, [activeLine, activeSubCat, selectedColor, searchQuery]);

  const isToolLine = activeLine === "lensa-momen" || activeLine === "rencana-momen";

  return (
    <div className="mx-auto max-w-[1240px] px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
      <div className="max-w-2xl">
        <span className="text-xs font-semibold tracking-[0.14em] text-emerald-brand uppercase">
          Katalog Lengkap Kado Digital
        </span>
        <h1 className="mt-2.5 text-[34px] leading-[1.1] font-bold tracking-[-0.03em] text-ink text-balance sm:text-[46px]">
          Pilih lini momen &amp; tema yang paling pas.
        </h1>
        <p className="mt-3 text-base leading-relaxed text-muted text-pretty">
          {currentLineMeta.description}
        </p>
      </div>

      {/* Step 1: 6 Product Line Pills */}
      <div
        role="tablist"
        aria-label="Pilih lini produk"
        className="mt-8 flex flex-wrap gap-2 border-b border-hairline pb-6"
      >
        {PRODUCT_LINES.map((line) => {
          const selected = line.id === activeLine;
          return (
            <button
              key={line.id}
              type="button"
              role="tab"
              aria-selected={selected}
              onClick={() => handleSelectLine(line.id)}
              className={`min-h-[44px] rounded-full px-5 text-sm font-semibold transition-colors ${
                selected
                  ? "bg-emerald-brand text-white"
                  : "border border-hairline bg-surface text-ink hover:bg-subtle"
              }`}
            >
              {line.label}
            </button>
          );
        })}
      </div>

      {/* Special Tool Lines vs Theme Grids */}
      {activeLine === "lensa-momen" ? (
        <div className="mt-8">
          <LensaMomenConfigurator />
        </div>
      ) : activeLine === "rencana-momen" ? (
        <div className="mt-8">
          <RencanaMomenShowcase />
        </div>
      ) : (
        <div className="mt-7">
          {/* Step 2: Sub-category pills */}
          {currentLineMeta.subCategories.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {currentLineMeta.subCategories.map((sub) => {
                const selected = sub === activeSubCat;
                return (
                  <button
                    key={sub}
                    type="button"
                    onClick={() => setActiveSubCat(sub)}
                    className={`min-h-[38px] rounded-full px-3.5 text-xs font-semibold transition-colors sm:text-sm ${
                      selected
                        ? "bg-ink text-white"
                        : "border border-hairline bg-surface text-muted hover:text-ink"
                    }`}
                  >
                    {sub}
                  </button>
                );
              })}
            </div>
          )}

          {/* Search + 8 Color Filter Dots */}
          <div className="mt-5 flex flex-col justify-between gap-4 rounded-2xl border border-hairline bg-surface p-4 lg:flex-row lg:items-center">
            <div className="relative flex-1 max-w-md">
              <Search className="pointer-events-none absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-muted" />
              <input
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari judul tema..."
                aria-label="Cari judul tema"
                className="h-11 w-full rounded-[10px] border border-control/60 bg-canvas pr-3.5 pl-10 text-sm text-ink placeholder:text-muted"
              />
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <span className="mr-1 text-xs font-semibold text-muted">Warna:</span>
              <button
                type="button"
                onClick={() => setSelectedColor("all")}
                className={`rounded-full px-3 py-1 text-xs font-semibold ${
                  selectedColor === "all"
                    ? "bg-emerald-brand text-white"
                    : "bg-subtle text-ink hover:bg-hairline"
                }`}
              >
                Semua
              </button>
              {THEME_COLORS.map((color) => {
                const active = selectedColor === color.id;
                return (
                  <button
                    key={color.id}
                    type="button"
                    onClick={() => setSelectedColor(active ? "all" : color.id)}
                    aria-label={`Filter warna ${color.label}`}
                    title={color.label}
                    className={`inline-flex h-8 w-8 items-center justify-center rounded-full border transition-transform ${
                      active
                        ? "scale-110 border-emerald-brand ring-2 ring-emerald-brand/40"
                        : "border-control/40 hover:scale-105"
                    }`}
                    style={{ backgroundColor: color.hex }}
                  />
                );
              })}
            </div>
          </div>

          {/* Count + Reset */}
          <div className="mt-5 flex items-center justify-between text-sm text-muted">
            <p className="tabular-nums">
              Menampilkan <strong className="text-ink">{filteredThemes.length}</strong> tema{" "}
              {currentLineMeta.label}
            </p>
            {(activeSubCat !== "Semua" || selectedColor !== "all" || searchQuery) && (
              <button
                type="button"
                onClick={resetFilters}
                className="inline-flex items-center gap-1.5 font-semibold text-emerald-brand hover:underline"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                Reset filter
              </button>
            )}
          </div>

          {/* Results or Actionable Empty State */}
          {!isToolLine && filteredThemes.length === 0 ? (
            <div className="mt-8 rounded-[20px] border border-hairline bg-surface p-10 text-center">
              <h2 className="text-lg font-semibold text-ink">
                Belum ada tema yang cocok dengan kombinasi filter ini.
              </h2>
              <p className="mt-1.5 text-sm text-muted">
                Coba reset filter warna atau kata kunci pencarian untuk melihat pilihan lainnya.
              </p>
              <button
                type="button"
                onClick={resetFilters}
                className="mt-5 inline-flex h-11 items-center gap-2 rounded-full bg-emerald-brand px-5 text-sm font-semibold text-white hover:bg-emerald-hover"
              >
                <RotateCcw className="h-4 w-4" />
                Reset semua filter
              </button>
            </div>
          ) : (
            <div className="mt-6 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredThemes.map((theme) => (
                <ThemeCard key={theme.slug} theme={theme} />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
