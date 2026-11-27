"use client";

import { useEffect, useState } from "react";
import { Lock, RotateCw } from "lucide-react";
import type { ThemeItem } from "@/lib/schemas";
import { isDarkHex } from "@/lib/color";

interface LiveDeviceStageProps {
  theme: ThemeItem;
  device: "mobile" | "desktop";
  compact?: boolean;
}

export function LiveDeviceStage({
  theme,
  device,
  compact = false,
}: LiveDeviceStageProps) {
  const [viewMode, setViewMode] = useState<"inside" | "cover">("inside");
  const [iframeKey, setIframeKey] = useState(0);
  const [loaded, setLoaded] = useState(false);

  const previewUrl = `/demo/${theme.slug}?embed=1&to=Tamu+Spesial${
    viewMode === "inside" ? "&open=1" : ""
  }`;

  useEffect(() => {
    setViewMode("inside");
  }, [theme.slug]);

  useEffect(() => {
    setLoaded(false);
  }, [theme.slug, device, viewMode, iframeKey]);

  const darkBase = isDarkHex(theme.palette.base);
  const is3dOrGacha =
    theme.demoArchetype === "celestial-3d-wedding" ||
    theme.demoArchetype === "desa-3d-wedding" ||
    theme.demoArchetype === "desa-3d-kado" ||
    theme.demoArchetype === "gacha-struk";
  const darkStatusBar = darkBase || is3dOrGacha;

  const statusBarBg =
    theme.demoArchetype === "celestial-3d-wedding"
      ? "#080D24"
      : theme.demoArchetype === "gacha-struk"
        ? "#14100E"
        : is3dOrGacha
          ? "#142119"
          : theme.palette.base;

  const handleReload = () => {
    setLoaded(false);
    setIframeKey((k) => k + 1);
  };

  const handleChangeView = (next: "inside" | "cover") => {
    if (next === viewMode) return;
    setLoaded(false);
    setViewMode(next);
  };

  if (device === "desktop") {
    return (
      <div className="w-full space-y-3">
        <div className="w-full overflow-hidden rounded-[20px] border border-hairline bg-surface shadow-[var(--shadow-stage)]">
          {/* Browser Chrome Bar */}
          <div className="flex h-10 items-center justify-between gap-3 border-b border-hairline bg-[#F6F5F1] px-4">
            <div className="flex items-center gap-1.5" aria-hidden="true">
              <span className="h-2.5 w-2.5 rounded-full bg-[#E56A61]" />
              <span className="h-2.5 w-2.5 rounded-full bg-[#EAB949]" />
              <span className="h-2.5 w-2.5 rounded-full bg-[#52B86A]" />
            </div>

            <div className="flex max-w-[320px] flex-1 items-center justify-center gap-1.5 rounded-full border border-hairline bg-white px-3 py-1 text-[11px] font-medium text-muted">
              <Lock className="h-3 w-3 shrink-0 text-emerald-brand" />
              <span className="truncate font-mono">
                kadodigital.id/demo/{theme.slug}
              </span>
            </div>

            <button
              type="button"
              onClick={handleReload}
              aria-label="Muat ulang preview desktop"
              title="Muat ulang tampilan"
              className="inline-flex h-7 w-7 items-center justify-center rounded-full border border-hairline bg-white text-muted transition-colors hover:border-emerald-brand hover:text-emerald-brand cursor-pointer"
            >
              <RotateCw className="h-3.5 w-3.5" />
            </button>
          </div>

          {/* Browser Live Viewport */}
          <div className="relative h-[520px] w-full bg-canvas sm:h-[580px]">
            {!loaded && (
              <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-2.5 bg-canvas/95 px-6 text-center">
                <div className="h-7 w-7 animate-spin rounded-full border-2 border-emerald-brand border-t-transparent" />
                <p className="text-xs font-semibold text-ink">
                  {viewMode === "inside"
                    ? `Memuat tampilan isi live ${theme.name}...`
                    : `Memuat sampul pembuka ${theme.name}...`}
                </p>
              </div>
            )}

            <iframe
              key={`${theme.slug}-d-${viewMode}-${iframeKey}`}
              src={previewUrl}
              title={`Tampilan live desktop ${theme.name}`}
              onLoad={() => setLoaded(true)}
              allow="autoplay"
              className="h-full w-full border-0 bg-white"
            />
          </div>
        </div>

        {/* Switcher + Reload */}
        <div className="flex flex-wrap items-center justify-center gap-2">
          <div className="inline-flex rounded-full border border-hairline bg-surface p-0.5 shadow-xs">
            <button
              type="button"
              onClick={() => handleChangeView("inside")}
              className={`rounded-full px-3 py-1 text-xs font-semibold transition-colors cursor-pointer ${
                viewMode === "inside"
                  ? "bg-emerald-brand text-white"
                  : "text-muted hover:text-ink"
              }`}
            >
              Tampilan Isi
            </button>
            <button
              type="button"
              onClick={() => handleChangeView("cover")}
              className={`rounded-full px-3 py-1 text-xs font-semibold transition-colors cursor-pointer ${
                viewMode === "cover"
                  ? "bg-emerald-brand text-white"
                  : "text-muted hover:text-ink"
              }`}
            >
              Sampul Pembuka
            </button>
          </div>

          <button
            type="button"
            onClick={handleReload}
            className="inline-flex items-center gap-1.5 rounded-full border border-hairline bg-surface px-3 py-1.5 text-xs font-semibold text-muted transition-colors hover:border-emerald-brand hover:text-emerald-brand cursor-pointer"
          >
            <RotateCw className="h-3 w-3" />
            Muat ulang
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center">
      {/* Smartphone Hardware Frame */}
      <div
        className={`relative w-[312px] sm:w-[342px] ${
          compact
            ? "h-[584px] max-h-[72dvh] sm:h-[632px]"
            : "h-[626px] max-h-[76dvh] sm:h-[672px]"
        }`}
      >
        {/* Side Hardware Buttons */}
        <span
          aria-hidden="true"
          className="absolute top-[112px] -left-[3px] h-7 w-[3px] rounded-l-full bg-[#4E5564]"
        />
        <span
          aria-hidden="true"
          className="absolute top-[154px] -left-[3px] h-12 w-[3px] rounded-l-full bg-[#4E5564]"
        />
        <span
          aria-hidden="true"
          className="absolute top-[210px] -left-[3px] h-12 w-[3px] rounded-l-full bg-[#4E5564]"
        />
        <span
          aria-hidden="true"
          className="absolute top-[168px] -right-[3px] h-16 w-[3px] rounded-r-full bg-[#4E5564]"
        />

        {/* Titanium Bezel */}
        <div className="relative h-full w-full rounded-[46px] bg-gradient-to-b from-[#343A46] via-[#171A21] to-[#0E1015] p-[10px] shadow-[0_32px_68px_-18px_rgba(12,18,24,0.45),0_8px_20px_-6px_rgba(12,18,24,0.28)] ring-1 ring-white/20">
          {/* Inner Rounded Mobile Screen */}
          <div
            className="relative flex h-full w-full flex-col overflow-hidden rounded-[36px]"
            style={{ backgroundColor: statusBarBg }}
          >
            {/* Simulated Mobile Status Bar + Dynamic Island */}
            <div
              className={`relative z-20 flex h-9 shrink-0 items-center justify-between px-6 text-[11px] font-semibold ${
                darkStatusBar
                  ? "text-white/95"
                  : "border-b border-black/5 text-[#16201B]"
              }`}
              style={{ backgroundColor: statusBarBg }}
            >
              <span className="tabular-nums">9:41</span>

              <div
                aria-hidden="true"
                className="flex h-[20px] w-[86px] items-center justify-end rounded-full bg-[#060709] px-2 ring-1 ring-white/10"
              >
                <span className="h-2 w-2 rounded-full bg-[#15223D]" />
              </div>

              <div className="flex items-center gap-1.5" aria-hidden="true">
                <div className="flex items-end gap-[1.5px]">
                  <span
                    className={`h-1.5 w-[2px] rounded-full ${
                      darkStatusBar ? "bg-white/90" : "bg-[#16201B]/85"
                    }`}
                  />
                  <span
                    className={`h-2 w-[2px] rounded-full ${
                      darkStatusBar ? "bg-white/90" : "bg-[#16201B]/85"
                    }`}
                  />
                  <span
                    className={`h-2.5 w-[2px] rounded-full ${
                      darkStatusBar ? "bg-white/90" : "bg-[#16201B]/85"
                    }`}
                  />
                  <span
                    className={`h-3 w-[2px] rounded-full ${
                      darkStatusBar ? "bg-white/90" : "bg-[#16201B]/85"
                    }`}
                  />
                </div>
                <span
                  className={`flex h-[10px] w-[18px] items-center rounded-[3px] border p-[1.5px] ${
                    darkStatusBar ? "border-white/80" : "border-[#16201B]/75"
                  }`}
                >
                  <span
                    className={`h-full w-4/5 rounded-[1px] ${
                      darkStatusBar ? "bg-white/95" : "bg-[#16201B]/90"
                    }`}
                  />
                </span>
              </div>
            </div>

            {/* Live Interactive Theme Screen Iframe */}
            <div className="relative flex-1 overflow-hidden">
              {!loaded && (
                <div
                  className={`absolute inset-0 z-10 flex flex-col items-center justify-center gap-2.5 px-6 text-center ${
                    darkStatusBar
                      ? "bg-[#10141E] text-[#FAF6EE]"
                      : "bg-canvas text-ink"
                  }`}
                >
                  <div className="h-7 w-7 animate-spin rounded-full border-2 border-emerald-brand border-t-transparent" />
                  <p className="text-xs font-semibold">
                    {viewMode === "inside"
                      ? "Memuat tampilan isi live..."
                      : "Memuat sampul pembuka..."}
                  </p>
                  <p className="text-[11px] opacity-70">{theme.name}</p>
                </div>
              )}

              <iframe
                key={`${theme.slug}-m-${viewMode}-${iframeKey}`}
                src={previewUrl}
                title={`Tampilan live mobile ${theme.name}`}
                onLoad={() => setLoaded(true)}
                allow="autoplay"
                className="h-full w-full border-0"
              />
            </div>

            {/* Bottom Home Indicator Overlay */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute right-0 bottom-2 left-0 z-20 flex justify-center"
            >
              <span
                className={`h-1 w-28 rounded-full ${
                  darkStatusBar ? "bg-white/40" : "bg-[#16201B]/25"
                }`}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Mode Switcher (Tampilan Isi | Sampul Pembuka) + Reload */}
      <div className="mt-3 flex flex-wrap items-center justify-center gap-2">
        <div className="inline-flex rounded-full border border-hairline bg-surface p-0.5 shadow-xs">
          <button
            type="button"
            onClick={() => handleChangeView("inside")}
            className={`rounded-full px-3 py-1 text-[11px] font-semibold transition-colors cursor-pointer ${
              viewMode === "inside"
                ? "bg-emerald-brand text-white"
                : "text-muted hover:text-ink"
            }`}
          >
            Tampilan Isi
          </button>
          <button
            type="button"
            onClick={() => handleChangeView("cover")}
            className={`rounded-full px-3 py-1 text-[11px] font-semibold transition-colors cursor-pointer ${
              viewMode === "cover"
                ? "bg-emerald-brand text-white"
                : "text-muted hover:text-ink"
            }`}
          >
            Sampul Pembuka
          </button>
        </div>

        <button
          type="button"
          onClick={handleReload}
          aria-label="Muat ulang preview HP"
          title="Muat ulang tampilan"
          className="inline-flex h-7 w-7 items-center justify-center rounded-full border border-hairline bg-surface text-muted transition-colors hover:border-emerald-brand hover:text-emerald-brand cursor-pointer"
        >
          <RotateCw className="h-3 w-3" />
        </button>
      </div>
    </div>
  );
}
