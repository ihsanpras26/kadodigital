"use client";

import { Heart, Sparkles } from "lucide-react";
import type { ThemeItem } from "@/lib/schemas";
import { isDarkHex } from "@/lib/color";
import { getThemePreviewMeta, TYPOGRAPHY_CLASS } from "@/lib/themePreviewMeta";

interface EnvelopeCoverProps {
  theme: ThemeItem;
  guestName?: string | null;
  eyebrow: string;
  title: string;
  subtitle: string;
  reducedMotion: boolean;
  fullHeight?: boolean;
  onOpen: () => void;
  onSkip: () => void;
}

export function EnvelopeCover({
  theme,
  guestName,
  eyebrow,
  title,
  subtitle,
  reducedMotion,
  fullHeight = false,
  onOpen,
  onSkip,
}: EnvelopeCoverProps) {
  const { accent, base, soft } = theme.palette;
  const darkBase = isDarkHex(base);
  const darkAccent = isDarkHex(accent);
  const cardBg = darkBase ? soft : "#FFFFFF";
  const inkOnBase = darkBase ? "#F7F4EC" : "#18181D";
  const mutedOnBase = darkBase ? "rgba(247,244,236,0.75)" : "rgba(24,24,29,0.68)";
  const inkOnAccent = darkAccent ? "#FFFFFF" : "#18181D";
  const accentLabelColor = darkBase
    ? !isDarkHex(accent)
      ? accent
      : "#E8C988"
    : isDarkHex(accent)
      ? accent
      : "#323D37";
  const previewMeta = getThemePreviewMeta(theme);
  const headingFont = TYPOGRAPHY_CLASS[theme.typographyStyle];

  return (
    <div
      className={`flex flex-col items-center justify-center px-3.5 py-6 ${
        fullHeight ? "min-h-[100dvh]" : "min-h-[calc(100dvh-56px)]"
      }`}
    >
      <div
        className={`w-full max-w-md overflow-hidden rounded-[26px] border text-center shadow-xl ${
          reducedMotion ? "" : "transition-transform duration-300"
        }`}
        style={{
          backgroundColor: cardBg,
          borderColor: `${accent}44`,
          color: inkOnBase,
        }}
      >
        {/* Integrated Editorial Cover Banner */}
        <div className="relative h-36 w-full overflow-hidden sm:h-44">
          <img
            src={previewMeta.coverSrc}
            alt=""
            className="h-full w-full object-cover"
          />
          <div
            className="absolute inset-0"
            style={{
              background: `linear-gradient(180deg, rgba(16,20,24,0.12) 0%, ${cardBg} 100%)`,
            }}
          />
        </div>

        <div className="relative px-5 pb-7 sm:px-9 sm:pb-9">
          <div
            className="mx-auto -mt-7 flex h-13 w-13 items-center justify-center rounded-full border-2 shadow-sm"
            style={{
              backgroundColor: accent,
              color: inkOnAccent,
              borderColor: cardBg,
            }}
          >
            {theme.line === "kado-personal" ? (
              <Heart className="h-5 w-5" />
            ) : (
              <Sparkles className="h-5 w-5" />
            )}
          </div>

          <p
            className="mt-4 text-[11px] font-bold tracking-[0.18em] uppercase"
            style={{ color: accentLabelColor }}
          >
            {eyebrow}
          </p>

          {guestName && (
            <div
              className="mx-auto mt-2.5 inline-block rounded-full px-3.5 py-1 text-xs font-semibold"
              style={{ backgroundColor: darkBase ? base : soft, color: inkOnBase }}
            >
              Kepada: {guestName}
            </div>
          )}

          <h1 className={`mt-3.5 text-2xl leading-tight font-semibold sm:text-3xl ${headingFont}`}>
            {title}
          </h1>

          <p className="mt-2.5 text-sm leading-relaxed" style={{ color: mutedOnBase }}>
            {subtitle}
          </p>

          <div className="mt-6 space-y-2.5">
            <button
              type="button"
              onClick={onOpen}
              className="inline-flex h-11 w-full items-center justify-center rounded-full px-6 text-[14px] font-semibold transition-transform hover:-translate-y-0.5 active:scale-[0.98] cursor-pointer sm:h-12 sm:text-[15px]"
              style={{ backgroundColor: accent, color: inkOnAccent }}
            >
              {theme.line === "kado-personal" ? "Buka Kado Sekarang" : "Buka Undangan"}
            </button>

            <button
              type="button"
              onClick={onSkip}
              className="inline-flex h-9 w-full items-center justify-center rounded-full text-xs font-semibold underline underline-offset-4 opacity-80 hover:opacity-100 cursor-pointer"
            >
              Lewati animasi pembukaan
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
