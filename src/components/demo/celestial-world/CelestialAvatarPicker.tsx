"use client";

import { Check, Sparkles } from "lucide-react";

interface CelestialAvatarPickerProps {
  selectedGender: "cewek" | "cowok";
  portraits: { cewek: string; cowok: string } | null;
  onSelectGender: (gender: "cewek" | "cowok") => void;
  onEnter: () => void;
}

export function CelestialAvatarPicker({
  selectedGender,
  portraits,
  onSelectGender,
  onEnter,
}: CelestialAvatarPickerProps) {
  const options: {
    id: "cewek" | "cowok";
    label: string;
    attire: string;
    imgSrc?: string;
  }[] = [
    {
      id: "cewek",
      label: "Perempuan",
      attire: "Gaun Bintang Sampanye",
      imgSrc: portraits?.cewek,
    },
    {
      id: "cowok",
      label: "Laki-laki",
      attire: "Jas Malam Kerajaan",
      imgSrc: portraits?.cowok,
    },
  ];

  return (
    <div className="fixed inset-0 z-30 flex items-center justify-center bg-[#06091A]/58 px-4 py-6 backdrop-blur-[4px]">
      <div className="celestial-glass w-full max-w-[430px] rounded-[28px] p-6 text-center sm:p-7">
        <p className="celestial-mono text-[10.5px] font-bold tracking-[0.2em] text-[#EFC86E] uppercase">
          Avatar Tamu 3D
        </p>
        <h2 className="celestial-serif mt-1 text-3xl italic text-[#FAF6EE]">
          Pilih Karakter Tamu
        </h2>
        <p className="mt-1.5 text-xs leading-relaxed text-[#BAC6EA]">
          Jelajahi Istana Awan, jembatan melayang, dan sapa langsung kedua mempelai di pelaminan.
        </p>

        <div
          className="mt-5 grid grid-cols-2 gap-3.5"
          role="radiogroup"
          aria-label="Pilih Karakter Tamu"
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
                className={`relative flex flex-col items-center rounded-[20px] border p-3.5 text-center transition-all cursor-pointer ${
                  active
                    ? "border-[#EFC86E] bg-[#16204D]/90 ring-2 ring-[#EFC86E]/35"
                    : "border-[#EFC86E]/22 bg-[#0B112E]/75 hover:border-[#EFC86E]/55"
                }`}
              >
                {active && (
                  <span
                    aria-hidden="true"
                    className="absolute top-2.5 right-2.5 flex h-6 w-6 items-center justify-center rounded-full bg-[#EFC86E] text-[#171107]"
                  >
                    <Check className="h-3.5 w-3.5 stroke-[2.6]" />
                  </span>
                )}

                <div className="h-28 w-28 overflow-hidden rounded-full border-2 border-[#EFC86E]/45 bg-[#131D47]">
                  {opt.imgSrc ? (
                    <img
                      src={opt.imgSrc}
                      alt={`Potret 3D karakter ${opt.label}`}
                      width={160}
                      height={160}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-xs font-semibold text-[#F7DC94]">
                      {opt.label}
                    </div>
                  )}
                </div>

                <span className="mt-3 text-sm font-semibold text-[#FAF6EE]">
                  {opt.label}
                </span>
                <span className="mt-0.5 text-[11px] text-[#A8B7E2]">
                  {opt.attire}
                </span>
              </button>
            );
          })}
        </div>

        <button
          type="button"
          onClick={onEnter}
          className="celestial-gold-btn mt-6 inline-flex h-12 w-full items-center justify-center gap-2 rounded-full px-5 text-sm font-bold cursor-pointer"
        >
          <Sparkles className="h-4 w-4" />
          <span>Terbang ke Istana Awan</span>
        </button>
      </div>
    </div>
  );
}
