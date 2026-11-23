"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { FAQ_ITEMS } from "@/data/faq";

export function FaqSection() {
  const [openId, setOpenId] = useState<string | null>(FAQ_ITEMS[0].id);

  return (
    <section className="border-t border-hairline bg-surface py-[72px] lg:py-[112px]">
      <div className="mx-auto max-w-[920px] px-4 sm:px-6 lg:px-8">
        <div className="text-left">
          <span className="text-xs font-semibold tracking-[0.14em] text-emerald-brand uppercase">
            Pertanyaan Umum
          </span>
          <h2 className="mt-3 text-[30px] leading-[1.12] font-bold tracking-[-0.03em] text-ink text-balance sm:text-[40px]">
            Semua yang sering ditanyakan sebelum mulai.
          </h2>
        </div>

        <div className="mt-8 divide-y divide-hairline rounded-[20px] border border-hairline bg-canvas">
          {FAQ_ITEMS.map((item) => {
            const isOpen = openId === item.id;
            const panelId = `${item.id}-panel`;
            return (
              <div key={item.id}>
                <button
                  type="button"
                  aria-expanded={isOpen}
                  aria-controls={panelId}
                  onClick={() => setOpenId(isOpen ? null : item.id)}
                  className="flex min-h-[60px] w-full items-center justify-between gap-4 px-5 py-4 text-left text-[15px] font-semibold text-ink sm:px-7 sm:text-base"
                >
                  <span>{item.question}</span>
                  <ChevronDown
                    className={`h-5 w-5 shrink-0 text-emerald-brand transition-transform duration-200 ${
                      isOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>
                {isOpen && (
                  <div
                    id={panelId}
                    className="px-5 pb-5 text-[15px] leading-relaxed text-muted text-pretty sm:px-7"
                  >
                    {item.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
