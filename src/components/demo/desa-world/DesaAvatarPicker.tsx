"use client";

import { Check } from "lucide-react";
import type { DesaWorldPayload } from "@/data/desaWorldData";

interface DesaAvatarPickerProps {
  payload: DesaWorldPayload;
  selectedGender: "cewek" | "cowok";
  portraits: { cewek: string; cowok: string } | null;
  onSelectGender: (gender: "cewek" | "cowok") => void;
  onEnter: () => void;
}

export function DesaAvatarPicker({
  payload,
  selectedGender,
  portraits,
  onSelectGender,
  onEnter,
}: DesaAvatarPickerProps) {
  const options: {
    id: "cewek" | "cowok";
    label: string;
    attire: string;
    imgSrc?: string;
  }[] = [
    {
      id: "cewek",
      label: "Perempuan",
      attire: payload.ui.pickerAttireFemale,
      imgSrc: portraits?.cewek,
    },
    {
      id: "cowok",
      label: "Laki-laki",
      attire: payload.ui.pickerAttireMale,
      imgSrc: portraits?.cowok,
    },
  ];

  return (
    <div className="fixed inset-0 z-30 flex items-center justify-center bg-[#101C15]/22 px-4">
      <div className="desa-woven-pill w-full max-w-[420px] rounded-[24px] border border-[#C8B490] p-6 text-center shadow-[0_24px_60px_rgba(20,16,12,0.28)] sm:p-7">
        <h2 className="desa-display text-2xl font-semibold text-[#3E2B1E]">
          {payload.ui.pickerTitle}
        </h2>
        <p className="mt-1.5 text-xs font-normal leading-relaxed text-[#5C4633]">
          {payload.ui.pickerSubtitle}
        </p>

        {/* Two Chibi Avatar Cards */}
        <div
          className="mt-5 grid grid-cols-2 gap-3.5"
          role="radiogroup"
          aria-label={payload.ui.pickerTitle}
        >
          {options.map((opt) => {
            const active = selectedGender === opt.id;
            return (
              <button
                key={opt.id}
                type="button"
                role="radio"
                aria-checked={active}
                onClick={() => onSelectGender(opt.id)}
                className={`relative flex flex-col items-center rounded-[18px] border bg-[#FFFDF9] p-3.5 text-center transition ${
                  active
                    ? "border-[#2A5C45] ring-2 ring-[#2A5C45]/25"
                    : "border-[#D4C2A3] hover:border-[#8C6D46]"
                }`}
              >
                {active && (
                  <span
                    aria-hidden="true"
                    className="absolute right-2.5 top-2.5 flex h-6 w-6 items-center justify-center rounded-full bg-[#2A5C45] text-white"
                  >
                    <Check className="h-3.5 w-3.5 stroke-[2.5]" />
                  </span>
                )}

                <div className="h-28 w-28 overflow-hidden rounded-full border border-[#D4C2A3] bg-[#E3EFE8]">
                  {opt.imgSrc ? (
                    <img
                      src={opt.imgSrc}
                      alt={`Potret karakter ${opt.label}`}
                      width={160}
                      height={160}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-xs font-semibold text-[#2A5C45]">
                      {opt.label}
                    </div>
                  )}
                </div>

                <span className="mt-3 text-sm font-semibold text-[#3E2B1E]">
                  {opt.label}
                </span>
                <span className="mt-0.5 text-[11px] font-normal text-[#6E5541]">
                  {opt.attire}
                </span>
              </button>
            );
          })}
        </div>

        <button
          type="button"
          onClick={onEnter}
          className="mt-5 inline-flex min-h-[46px] w-full items-center justify-center rounded-[14px] bg-[#AD4B2C] px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#963C20] active:translate-y-0.5"
        >
          {payload.ui.pickerCta}
        </button>
      </div>
    </div>
  );
}
