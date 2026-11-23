"use client";

import { useEffect, useState } from "react";
import type { DesaNpcData } from "@/data/desaWorldData";

interface DesaDialogueBoxProps {
  npc: DesaNpcData;
  portraitSrc?: string;
  message: string;
  onClose: () => void;
}

export function DesaDialogueBox({
  npc,
  portraitSrc,
  message,
  onClose,
}: DesaDialogueBoxProps) {
  const [visibleChars, setVisibleChars] = useState(0);

  useEffect(() => {
    setVisibleChars(0);
    const interval = window.setInterval(() => {
      setVisibleChars((prev) => {
        if (prev >= message.length) {
          window.clearInterval(interval);
          return prev;
        }
        return prev + 2;
      });
    }, 22);
    return () => window.clearInterval(interval);
  }, [message]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" || e.key === " ") {
        e.preventDefault();
        onClose();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const done = visibleChars >= message.length;

  const handleBoxClick = () => {
    if (!done) {
      setVisibleChars(message.length);
    } else {
      onClose();
    }
  };

  return (
    <div className="fixed bottom-3 right-3 z-40 w-[min(92vw,410px)] sm:bottom-5 sm:right-5">
      <button
        type="button"
        onClick={handleBoxClick}
        className="flex w-full items-start gap-3.5 rounded-[18px] border-2 border-[#B79B74] bg-[#F7F1E3] p-3.5 text-left shadow-[0_16px_36px_rgba(24,18,12,0.28)] transition hover:bg-[#FFFBF2]"
      >
        {/* Left Chibi Portrait */}
        <div className="h-16 w-16 shrink-0 overflow-hidden rounded-[12px] border-2 border-[#C8B28E] bg-[#E3EFE8]">
          {portraitSrc ? (
            <img
              src={portraitSrc}
              alt={npc.name}
              width={64}
              height={64}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-sm font-extrabold text-[#2A5C45]">
              {npc.name.slice(0, 2).toUpperCase()}
            </div>
          )}
        </div>

        {/* Right Dialogue Content */}
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-baseline gap-1.5">
            <span className="text-xs font-extrabold text-[#3E2B1E]">
              {npc.name}
            </span>
            <span className="text-[11px] font-semibold text-[#6E5541]">
              · {npc.roleLabel}
            </span>
          </div>

          <p className="mt-1 min-h-[42px] text-xs font-semibold leading-relaxed text-[#3E2B1E] sm:text-[13px]">
            {message.slice(0, visibleChars)}
          </p>

          <p className="mt-1 text-[10px] font-extrabold text-[#2A5C45]">
            {done ? "Ketuk untuk tutup" : "Mengetik..."}
          </p>
        </div>
      </button>
    </div>
  );
}
