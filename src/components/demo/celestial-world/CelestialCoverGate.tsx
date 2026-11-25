"use client";

import { ArrowRight, Sparkles } from "lucide-react";
import type { CelestialWeddingPayload } from "./celestialData";

interface CelestialCoverGateProps {
  payload: CelestialWeddingPayload;
  guestName?: string | null;
  onEnterFlight: () => void;
  onEnterDirect: () => void;
}

export function CelestialCoverGate({
  payload,
  guestName,
  onEnterFlight,
  onEnterDirect,
}: CelestialCoverGateProps) {
  const addressedGuest = guestName?.trim() || "Tamu Kehormatan";

  return (
    <div className="fixed inset-0 z-30 flex items-center justify-center bg-[#06091A]/52 px-4 py-6 backdrop-blur-[4px]">
      <div className="celestial-glass relative w-full max-w-[440px] rounded-[28px] p-6 text-center sm:p-8">
        <p className="celestial-mono text-[11px] font-bold tracking-[0.24em] text-[#EFC86E] uppercase">
          Undangan Pernikahan 3D
        </p>

        {/* Star Crest Divider */}
        <div className="my-4 flex items-center justify-center gap-3 text-[#EFC86E]/70">
          <span className="h-px w-12 bg-gradient-to-r from-transparent to-[#EFC86E]/70" />
          <Sparkles className="h-4 w-4 text-[#F7DC94]" />
          <span className="h-px w-12 bg-gradient-to-l from-transparent to-[#EFC86E]/70" />
        </div>

        <h1 className="celestial-serif text-4xl leading-none font-normal italic tracking-tight text-[#FAF6EE] sm:text-5xl">
          {payload.groomShort}{" "}
          <span className="text-[#EFC86E]">&amp;</span>{" "}
          {payload.brideShort}
        </h1>

        <p className="mt-3 text-sm font-medium text-[#D6DFF8]">
          {payload.dateDisplay}
        </p>
        <p className="mt-0.5 text-xs text-[#9DB0E0]">{payload.venueName}</p>

        {/* Personalized Guest Plaque */}
        <div className="mt-6 rounded-2xl border border-[#EFC86E]/25 bg-[#080D24]/70 px-4 py-3.5">
          <p className="celestial-mono text-[10px] tracking-[0.2em] text-[#9EB0DE] uppercase">
            Kepada Yth.
          </p>
          <p className="mt-1 text-base font-semibold text-[#FAF6EE]">
            {addressedGuest}
          </p>
        </div>

        <p className="mt-4 text-xs leading-relaxed text-[#BAC6EA] italic">
          &ldquo;{payload.openingQuote}&rdquo;
        </p>

        <button
          type="button"
          onClick={onEnterFlight}
          className="celestial-gold-btn mt-6 inline-flex h-12 w-full items-center justify-center gap-2 rounded-full px-5 text-sm font-bold cursor-pointer"
        >
          <span>Buka Undangan &amp; Pilih Karakter</span>
          <ArrowRight className="h-4 w-4" />
        </button>

        <button
          type="button"
          onClick={onEnterDirect}
          className="mt-3 inline-flex items-center justify-center rounded-full px-3 py-1.5 text-xs font-medium text-[#A9B9E3] transition-colors hover:text-[#FAF6EE] cursor-pointer"
        >
          Mode Ringan / Lewati Intro
        </button>
      </div>
    </div>
  );
}
