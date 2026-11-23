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
    <div
      className="fixed inset-0 z-30 flex items-center justify-center bg-[#18281E]/28 px-4 py-6"
    >
      <div className="desa-woven-pill relative w-full max-w-[400px] rounded-[24px] border-[3px] border-[#B79B74] bg-[#F7F1E3] p-6 text-center shadow-[0_24px_56px_rgba(24,18,12,0.34)] sm:p-7">
        {/* Top Monogram Crest */}
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border-2 border-[#B79B74] bg-[#2A5C45] text-[#F7F1E3]">
          <span className="font-serif text-base font-bold italic">
            {payload.monogram}
          </span>
        </div>

        {/* Context Line (replaces pill eyebrow badge) */}
        <p className="mt-4 text-xs font-extrabold tracking-wider text-[#2A5C45] uppercase">
          {payload.eyebrow} · {payload.dateLine}
        </p>

        {/* Main Focal Heading */}
        <h1 className="mt-2 font-serif text-4xl font-bold leading-tight text-[#3E2B1E] sm:text-[42px]">
          {payload.namesLine}
        </h1>

        <p className="mt-2 text-xs font-semibold text-[#5C4633]">
          Jelajahi suasana desa untuk membuka surat, cerita, dan kejutan interaktif.
        </p>

        {/* Warm Woven Recipient Card */}
        <div className="mt-5 rounded-[16px] border-2 border-dashed border-[#B79B74] bg-[#EFE5CE]/75 px-4 py-3">
          <p className="text-[11px] font-bold tracking-wide text-[#5C4633] uppercase">
            Kepada Yth.
          </p>
          <p className="mt-0.5 truncate font-serif text-lg font-bold italic text-[#3E2B1E]">
            {displayGuest}
          </p>
        </div>

        {/* Primary Action */}
        <button
          type="button"
          onClick={onStart}
          className="mt-6 inline-flex min-h-[46px] w-full items-center justify-center rounded-[14px] border-b-[3px] border-[#7D321B] bg-[#AD4B2C] px-6 py-3 text-sm font-extrabold text-white shadow-md transition hover:bg-[#993E22] active:translate-y-0.5"
        >
          Masuk &amp; Jelajahi Desa
        </button>
      </div>
    </div>
  );
}
