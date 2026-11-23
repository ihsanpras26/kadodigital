"use client";

import { Check } from "lucide-react";

interface DesaAvatarPickerProps {
  selectedGender: "cewek" | "cowok";
  portraits: { cewek: string; cowok: string } | null;
  onSelectGender: (gender: "cewek" | "cowok") => void;
  onEnter: () => void;
}

export function DesaAvatarPicker({
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
      attire: "Kebaya & Topi Anyam",
      imgSrc: portraits?.cewek,
    },
    {
      id: "cowok",
      label: "Laki-laki",
      attire: "Baju Desa & Topi Pandan",
      imgSrc: portraits?.cowok,
    },
  ];

  return (
    <div className="fixed inset-0 z-30 flex items-center justify-center bg-[#18281E]/30 px-4">
      <div className="desa-woven-pill w-full max-w-[420px] rounded-[24px] border-[3px] border-[#B79B74] bg-[#F7F1E3] p-6 text-center shadow-[0_24px_56px_rgba(24,18,12,0.34)]">
        <h2 className="text-xl font-extrabold text-[#3E2B1E]">
          Pilih Karakter Penjelajah
        </h2>
        <p className="mt-1 text-xs font-semibold text-[#5C4633]">
          Karakter ini akan berjalan menyusuri desa bersama kamu.
        </p>

        {/* Two Chibi Avatar Cards */}
        <div
          className="mt-5 grid grid-cols-2 gap-3.5"
          role="radiogroup"
          aria-label="Pilih karakter penjelajah"
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
                className={`relative flex flex-col items-center rounded-[18px] border-2 bg-[#FFFBF2] p-3.5 text-center transition ${
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
                    <Check className="h-3.5 w-3.5 stroke-[3]" />
                  </span>
                )}

                <div className="h-28 w-28 overflow-hidden rounded-full border-2 border-[#D4C2A3] bg-[#E3EFE8]">
                  {opt.imgSrc ? (
                    <img
                      src={opt.imgSrc}
                      alt={`Potret avatar ${opt.label}`}
                      width={160}
                      height={160}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-xs font-bold text-[#2A5C45]">
                      {opt.label}
                    </div>
                  )}
                </div>

                <span className="mt-3 text-sm font-extrabold text-[#3E2B1E]">
                  {opt.label}
                </span>
                <span className="mt-0.5 text-[11px] font-semibold text-[#5C4633]">
                  {opt.attire}
                </span>
              </button>
            );
          })}
        </div>

        <button
          type="button"
          onClick={onEnter}
          className="mt-5 inline-flex min-h-[46px] w-full items-center justify-center rounded-[14px] border-b-[3px] border-[#7D321B] bg-[#AD4B2C] px-6 py-3 text-sm font-extrabold text-white shadow-md transition hover:bg-[#993E22] active:translate-y-0.5"
        >
          Mulai Jelajahi Desa
        </button>
      </div>
    </div>
  );
}
