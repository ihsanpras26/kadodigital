"use client";

import { Heart, Sparkles } from "lucide-react";
import type { ThemeItem } from "@/lib/schemas";
import { isDarkHex } from "@/lib/color";

interface EnvelopeCoverProps {
  theme: ThemeItem;
  guestName?: string | null;
  eyebrow: string;
  title: string;
  subtitle: string;
  reducedMotion: boolean;
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
  onOpen,
  onSkip,
}: EnvelopeCoverProps) {
  const { accent, base, soft } = theme.palette;
  const darkBase = isDarkHex(base);
  const darkAccent = isDarkHex(accent);
  const inkOnBase = darkBase ? "#F7F4EC" : "#18181D";
  const mutedOnBase = darkBase ? "rgba(247,244,236,0.72)" : "rgba(24,24,29,0.68)";
  const inkOnAccent = darkAccent ? "#FFFFFF" : "#18181D";

  return (
    <div className="flex min-h-[calc(100dvh-56px)] flex-col items-center justify-center px-4 py-10">
      <div
        className={`w-full max-w-md rounded-[28px] border p-7 text-center shadow-xl sm:p-10 ${
          reducedMotion ? "" : "transition-transform duration-300"
        }`}
        style={{
          backgroundColor: darkBase ? soft : "#FFFFFF",
          borderColor: `${accent}44`,
          color: inkOnBase,
        }}
      >
        <div
          className="mx-auto flex h-14 w-14 items-center justify-center rounded-full shadow-sm"
          style={{ backgroundColor: accent, color: inkOnAccent }}
        >
          {theme.line === "kado-personal" ? (
            <Heart className="h-6 w-6" />
          ) : (
            <Sparkles className="h-6 w-6" />
          )}
        </div>

        <p
          className="mt-5 text-xs font-bold tracking-[0.18em] uppercase"
          style={{ color: accent }}
        >
          {eyebrow}
        </p>

        {guestName && (
          <div
            className="mx-auto mt-3 inline-block rounded-full px-3.5 py-1 text-xs font-semibold"
            style={{ backgroundColor: darkBase ? base : soft, color: inkOnBase }}
          >
            Kepada: {guestName}
          </div>
        )}

        <h1 className="mt-4 font-editorial-alt text-3xl leading-tight font-semibold sm:text-4xl">
          {title}
        </h1>

        <p className="mt-3 text-sm leading-relaxed sm:text-base" style={{ color: mutedOnBase }}>
          {subtitle}
        </p>

        <div className="mt-7 space-y-2.5">
          <button
            type="button"
            onClick={onOpen}
            className="inline-flex h-12 w-full items-center justify-center rounded-full px-6 text-[15px] font-semibold transition-transform hover:-translate-y-0.5 active:scale-[0.98]"
            style={{ backgroundColor: accent, color: inkOnAccent }}
          >
            {theme.line === "kado-personal" ? "Buka Kado Sekarang" : "Buka Undangan"}
          </button>

          <button
            type="button"
            onClick={onSkip}
            className="inline-flex h-10 w-full items-center justify-center rounded-full text-xs font-semibold underline underline-offset-4 opacity-80 hover:opacity-100"
          >
            Lewati animasi pembukaan
          </button>
        </div>
      </div>
    </div>
  );
}
