"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Check, RotateCcw, Search } from "lucide-react";
import { CATALOG_THEMES, PRODUCT_LINES, THEME_COLORS } from "@/data/catalog";
import { isDarkHex } from "@/lib/color";
import type { ProductLine, ThemeColorTag } from "@/lib/schemas";
import { ThemeCard } from "./ThemeCard";

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

  const countByLine = useMemo(() => {
    const map: Partial<Record<ProductLine, number>> = {};
    for (const theme of CATALOG_THEMES) {
      map[theme.line] = (map[theme.line] ?? 0) + 1;
    }
    return map;
  }, []);

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

  return (
    <div className="mx-auto max-w-[1240px] px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
      <div className="flex flex-col justify-between gap-4 border-b border-hairline pb-7 md:flex-row md:items-end">
        <div className="max-w-2xl">
          <span className="text-xs font-semibold tracking-[0.16em] text-emerald-brand uppercase">
            Katalog Desain &amp; Produk
          </span>
          <h1 className="mt-2.5 text-[32px] leading-[1.1] font-bold tracking-[-0.03em] text-ink text-balance sm:text-[44px]">
            Pilih lini momen &amp;{" "}
            <span className="font-serif font-normal italic text-emerald-brand">
              karakter desain
            </span>{" "}
            yang paling pas.
          </h1>
          <p className="mt-3 text-[15px] leading-relaxed text-muted text-pretty sm:text-base">
            {currentLineMeta.description}
          </p>
        </div>

        <div className="inline-flex shrink-0 items-center gap-2 self-start rounded-full border border-hairline bg-surface px-4 py-2 text-xs font-semibold text-ink shadow-xs md:self-auto">
          <span className="h-2 w-2 rounded-full bg-emerald-brand" />
          <span className="tabular-nums">{CATALOG_THEMES.length} Pilihan Kurasi Studio</span>
        </div>
      </div>

      {/* Step 1: Clean Segmented Product Line Tabs */}
      <div
        role="tablist"
        aria-label="Pilih lini produk"
        className="mt-6 flex flex-wrap gap-2"
      >
        {PRODUCT_LINES.map((line) => {
          const selected = line.id === activeLine;
          const lineCount = countByLine[line.id];
          return (
            <button
              key={line.id}
              type="button"
              role="tab"
              aria-selected={selected}
              onClick={() => handleSelectLine(line.id)}
              className={`inline-flex min-h-[42px] items-center gap-2 rounded-full px-4 text-sm font-semibold transition-all cursor-pointer ${
                selected
                  ? "bg-emerald-brand text-white shadow-xs"
                  : "border border-hairline bg-surface text-ink hover:border-control/60 hover:bg-subtle"
              }`}
            >
              <span>{line.label}</span>
              {typeof lineCount === "number" && lineCount > 0 && (
                <span
                  className={`rounded-full px-1.5 py-0.5 text-[11px] font-bold tabular-nums ${
                    selected
                      ? "bg-white/20 text-white"
                      : "bg-subtle text-muted"
                  }`}
                >
                  {lineCount}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Filter & Theme Grid */}
      <div className="mt-6">
        {/* Consolidated Single-Surface Filter Toolbar */}
        <div className="rounded-[20px] border border-hairline bg-surface p-4 shadow-[0_6px_24px_-16px_rgba(22,32,27,0.08)] sm:p-5">
          {currentLineMeta.subCategories.length > 0 && (
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex flex-wrap gap-1.5">
                {currentLineMeta.subCategories.map((sub) => {
                  const selected = sub === activeSubCat;
                  return (
                    <button
                      key={sub}
                      type="button"
                      onClick={() => setActiveSubCat(sub)}
                      className={`min-h-[36px] rounded-full px-3.5 text-xs font-semibold transition-colors cursor-pointer sm:text-[13px] ${
                        selected
                          ? "bg-ink text-white"
                          : "bg-subtle/80 text-muted hover:bg-subtle hover:text-ink"
                      }`}
                    >
                      {sub}
                    </button>
                  );
                })}
              </div>

              <div className="flex items-center gap-3 text-xs text-muted">
                <span className="tabular-nums">
                  Menampilkan{" "}
                  <strong className="font-semibold text-ink">
                    {filteredThemes.length}
                  </strong>{" "}
                  tema
                </span>
                {(activeSubCat !== "Semua" ||
                  selectedColor !== "all" ||
                  searchQuery) && (
                  <button
                    type="button"
                    onClick={resetFilters}
                    className="inline-flex items-center gap-1 font-semibold text-emerald-brand hover:underline cursor-pointer"
                  >
                    <RotateCcw className="h-3 w-3" />
                    Reset
                  </button>
                )}
              </div>
            </div>
          )}

          <div className="mt-3.5 flex flex-col justify-between gap-4 border-t border-hairline/75 pt-3.5 lg:flex-row lg:items-center">
            <div className="relative flex-1 max-w-md">
              <Search className="pointer-events-none absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-muted" />
              <input
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari nama tema atau gaya..."
                aria-label="Cari judul tema"
                className="h-10 w-full rounded-[12px] border border-hairline bg-canvas pr-3.5 pl-10 text-sm text-ink placeholder:text-muted focus:border-emerald-brand focus:outline-none"
              />
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <span className="mr-0.5 text-xs font-semibold text-muted">
                Nuansa Warna:
              </span>
              <button
                type="button"
                onClick={() => setSelectedColor("all")}
                className={`rounded-full px-3 py-1 text-xs font-semibold cursor-pointer ${
                  selectedColor === "all"
                    ? "bg-emerald-brand text-white"
                    : "bg-subtle text-ink hover:bg-hairline"
                }`}
              >
                Semua
              </button>
              {THEME_COLORS.map((color) => {
                const active = selectedColor === color.id;
                const darkSwatch = isDarkHex(color.hex);
                return (
                  <button
                    key={color.id}
                    type="button"
                    onClick={() => setSelectedColor(active ? "all" : color.id)}
                    aria-label={`Filter warna ${color.label}`}
                    title={color.label}
                    className={`inline-flex h-7 w-7 items-center justify-center rounded-full border transition-transform cursor-pointer ${
                      active
                        ? "scale-110 border-emerald-brand ring-2 ring-emerald-brand/35"
                        : "border-black/15 hover:scale-105"
                    }`}
                    style={{ backgroundColor: color.hex }}
                  >
                    {active && (
                      <Check
                        className={`h-3.5 w-3.5 stroke-[2.8] ${
                          darkSwatch ? "text-white" : "text-ink"
                        }`}
                      />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Results or Actionable Empty State */}
        {filteredThemes.length === 0 ? (
          <div className="mt-8 rounded-[22px] border border-hairline bg-surface p-10 text-center">
            <h2 className="text-lg font-semibold text-ink">
              Belum ada tema yang cocok dengan kombinasi filter ini.
            </h2>
            <p className="mt-1.5 text-sm text-muted">
              Coba reset filter warna atau kata kunci pencarian untuk melihat pilihan lainnya.
            </p>
            <button
              type="button"
              onClick={resetFilters}
              className="mt-5 inline-flex h-11 items-center gap-2 rounded-full bg-emerald-brand px-5 text-sm font-semibold text-white hover:bg-emerald-hover cursor-pointer"
            >
              <RotateCcw className="h-4 w-4" />
              Reset semua filter
            </button>
          </div>
        ) : (
          <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredThemes.map((theme) => (
              <ThemeCard key={theme.slug} theme={theme} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
