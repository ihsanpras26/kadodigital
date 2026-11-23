"use client";

import { useState } from "react";
import { RotateCw } from "lucide-react";
import type { DemoPhotoMemory } from "@/data/demoContent";
import { isDarkHex } from "@/lib/color";

interface FlipPhotoDeckProps {
  photos: DemoPhotoMemory[];
  accent: string;
  base: string;
  soft: string;
  reducedMotion: boolean;
}

export function FlipPhotoDeck({
  photos,
  accent,
  base,
  soft,
  reducedMotion,
}: FlipPhotoDeckProps) {
  const [flippedIds, setFlippedIds] = useState<Record<string, boolean>>({});
  const darkBase = isDarkHex(base);

  const toggleCard = (id: string) => {
    setFlippedIds((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="grid gap-5 md:grid-cols-3">
      {photos.map((photo) => {
        const isFlipped = Boolean(flippedIds[photo.id]);

        if (reducedMotion) {
          return (
            <article
              key={photo.id}
              className="flex min-h-[260px] flex-col justify-between rounded-2xl border p-4 shadow-xs"
              style={{
                backgroundColor: isFlipped ? soft : darkBase ? "#1E2136" : "#FFFFFF",
                borderColor: `${accent}3D`,
                color: darkBase && !isFlipped ? "#F7F4EC" : "#18181D",
              }}
            >
              {!isFlipped ? (
                <div>
                  <div
                    className="flex h-32 flex-col items-center justify-center rounded-xl p-3 text-center"
                    style={{ backgroundColor: photo.tint }}
                  >
                    <span className="text-[11px] font-semibold uppercase tracking-wider text-[#4C4954]">
                      {photo.date}
                    </span>
                    <p className="mt-1 font-editorial-alt text-xl font-semibold text-[#18181D]">
                      {photo.title}
                    </p>
                  </div>
                  <p className="mt-3 text-xs opacity-80">{photo.caption}</p>
                </div>
              ) : (
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider" style={{ color: accent }}>
                    Catatan di balik foto
                  </span>
                  <p className="mt-2 text-sm leading-relaxed text-[#18181D]">“{photo.backNote}”</p>
                </div>
              )}

              <button
                type="button"
                onClick={() => toggleCard(photo.id)}
                className="mt-4 inline-flex h-10 w-full items-center justify-center gap-1.5 rounded-full border text-xs font-semibold"
                style={{
                  borderColor: `${accent}55`,
                  color: darkBase && !isFlipped ? "#F7F4EC" : accent,
                  backgroundColor: isFlipped ? "#FFFFFF" : "transparent",
                }}
              >
                <RotateCw className="h-3.5 w-3.5" />
                {isFlipped ? "Lihat foto" : "Balik foto"}
              </button>
            </article>
          );
        }

        return (
          <div key={photo.id} className="perspective-1000">
            <div
              className={`preserve-3d relative min-h-[275px] w-full transition-transform duration-500 ${
                isFlipped ? "rotate-y-180" : ""
              }`}
            >
              {/* Front */}
              <div
                className="backface-hidden absolute inset-0 flex flex-col justify-between rounded-2xl border p-4 shadow-xs"
                style={{
                  backgroundColor: darkBase ? "#1E2136" : "#FFFFFF",
                  borderColor: `${accent}3D`,
                  color: darkBase ? "#F7F4EC" : "#18181D",
                }}
              >
                <div>
                  <div
                    className="flex h-32 flex-col items-center justify-center rounded-xl p-3 text-center"
                    style={{ backgroundColor: photo.tint }}
                  >
                    <span className="text-[11px] font-semibold tracking-wider uppercase text-[#4B4854]">
                      {photo.date}
                    </span>
                    <p className="mt-1 font-editorial-alt text-xl font-semibold text-[#18181D]">
                      {photo.title}
                    </p>
                  </div>
                  <p className="mt-3 text-xs leading-relaxed opacity-80">{photo.caption}</p>
                </div>

                <button
                  type="button"
                  onClick={() => toggleCard(photo.id)}
                  className="inline-flex h-10 w-full items-center justify-center gap-1.5 rounded-full border text-xs font-semibold transition-colors hover:bg-black/5"
                  style={{
                    borderColor: `${accent}55`,
                    color: darkBase ? "#F7F4EC" : accent,
                  }}
                >
                  <RotateCw className="h-3.5 w-3.5" />
                  Balik foto
                </button>
              </div>

              {/* Back */}
              <div
                className="backface-hidden rotate-y-180 absolute inset-0 flex flex-col justify-between rounded-2xl border p-5 shadow-xs"
                style={{
                  backgroundColor: soft,
                  borderColor: `${accent}55`,
                  color: darkBase ? "#F7F4EC" : "#18181D",
                }}
              >
                <div>
                  <span className="text-[11px] font-bold tracking-wider uppercase" style={{ color: accent }}>
                    Catatan Kenangan · {photo.date}
                  </span>
                  <p className="mt-3 text-sm leading-relaxed">“{photo.backNote}”</p>
                </div>

                <button
                  type="button"
                  onClick={() => toggleCard(photo.id)}
                  className="inline-flex h-10 w-full items-center justify-center gap-1.5 rounded-full bg-white px-3 text-xs font-semibold text-[#18181D] shadow-xs"
                >
                  <RotateCw className="h-3.5 w-3.5" />
                  Kembali ke foto
                </button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
