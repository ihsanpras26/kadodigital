"use client";

import type { DesaWorldPayload } from "@/data/desaWorldData";

interface DesaCoverSignProps {
  payload: DesaWorldPayload;
  guestName: string | null;
  onStart: () => void;
}

export function DesaCoverSign({ payload, guestName, onStart }: DesaCoverSignProps) {
  const displayGuest = guestName?.trim() || payload.defaultGuestName;

  return (
    <div className="fixed inset-0 z-30 flex items-center justify-center bg-[#101C15]/18 px-4 py-6">
      <div className="desa-woven-pill relative w-full max-w-[400px] rounded-[24px] border border-[#C8B490] p-7 text-center shadow-[0_24px_60px_rgba(20,16,12,0.28)] sm:p-8">
        {/* Top Monogram Crest */}
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border border-[#C8B490] bg-[#2A5C45] text-[#FAF6EE] shadow-xs">
          <span className="desa-display text-base font-semibold italic">
            {payload.monogram}
          </span>
        </div>

        {/* Eyebrow */}
        <p className="mt-4 text-[11px] font-semibold tracking-[0.2em] text-[#2A5C45] uppercase">
          {payload.eyebrow}
        </p>

        {/* Hero Names */}
        <h1 className="desa-display mt-2 text-4xl font-semibold leading-tight tracking-tight text-[#3E2B1E] sm:text-[44px]">
          {payload.namesLine}
        </h1>

        {/* Hairline Flanked Date */}
        <div className="mt-3 flex items-center justify-center gap-3">
          <span className="h-px w-8 bg-[#C8B490]" aria-hidden="true" />
          <span className="text-[11px] font-medium tracking-[0.14em] text-[#6E5541] uppercase">
            {payload.dateLine}
          </span>
          <span className="h-px w-8 bg-[#C8B490]" aria-hidden="true" />
        </div>

        {/* Calm Body Copy */}
        <p className="mt-3.5 text-[13px] font-normal leading-relaxed text-[#5C4633]">
          {payload.ui.coverSubtitle}
        </p>

        {/* Refined Guest Recipient Block */}
        <div className="mt-5 rounded-[16px] border border-[#D4C2A3] bg-[#F5EFE2]/80 px-4 py-3">
          <p className="text-[10px] font-medium tracking-[0.16em] text-[#6E5541] uppercase">
            Kepada Yth.
          </p>
          <p className="desa-display mt-0.5 truncate text-lg font-medium italic text-[#3E2B1E]">
            {displayGuest}
          </p>
        </div>

        {/* Primary Action */}
        <button
          type="button"
          onClick={onStart}
          className="mt-6 inline-flex min-h-[46px] w-full items-center justify-center rounded-[14px] bg-[#AD4B2C] px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#963C20] active:translate-y-0.5"
        >
          {payload.ui.coverCta}
        </button>
      </div>
    </div>
  );
}
