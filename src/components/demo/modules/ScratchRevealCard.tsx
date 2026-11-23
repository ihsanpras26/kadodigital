"use client";

import { useEffect, useRef, useState } from "react";
import { Sparkles } from "lucide-react";

interface ScratchRevealCardProps {
  prompt: string;
  secretTitle: string;
  secretBody: string;
  accent: string;
  soft: string;
  reducedMotion: boolean;
}

export function ScratchRevealCard({
  prompt,
  secretTitle,
  secretBody,
  accent,
  soft,
  reducedMotion,
}: ScratchRevealCardProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [revealed, setRevealed] = useState(false);
  const [isDrawing, setIsDrawing] = useState(false);
  const strokesRef = useRef(0);

  useEffect(() => {
    if (reducedMotion || revealed) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;

    const grad = ctx.createLinearGradient(0, 0, width, height);
    grad.addColorStop(0, "#D4A359");
    grad.addColorStop(0.5, "#E8C784");
    grad.addColorStop(1, "#C59247");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, width, height);

    ctx.fillStyle = "rgba(24, 24, 29, 0.78)";
    ctx.font = "600 15px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("Usap di sini untuk buka pesan", width / 2, height / 2 + 5);
  }, [reducedMotion, revealed]);

  const scratchAt = (clientX: number, clientY: number) => {
    const canvas = canvasRef.current;
    if (!canvas || revealed) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const x = (clientX - rect.left) * scaleX;
    const y = (clientY - rect.top) * scaleY;

    ctx.globalCompositeOperation = "destination-out";
    ctx.beginPath();
    ctx.arc(x, y, 26, 0, Math.PI * 2);
    ctx.fill();

    strokesRef.current += 1;
    if (strokesRef.current >= 22) {
      setRevealed(true);
    }
  };

  return (
    <div
      className="rounded-[24px] border p-6 text-center"
      style={{ backgroundColor: "#FFFFFF", borderColor: `${accent}44`, color: "#18181D" }}
    >
      <p className="text-xs font-bold tracking-[0.14em] uppercase" style={{ color: accent }}>
        {prompt}
      </p>

      <div
        className="relative mx-auto mt-4 flex min-h-[164px] w-full max-w-md flex-col items-center justify-center overflow-hidden rounded-2xl border p-6"
        style={{ backgroundColor: soft, borderColor: `${accent}30` }}
      >
        <Sparkles className="h-6 w-6" style={{ color: accent }} />
        <h3 className="mt-2 font-editorial-alt text-2xl font-semibold text-[#18181D]">
          {secretTitle}
        </h3>
        <p className="mt-1.5 text-sm leading-relaxed text-[#3D3A45]">{secretBody}</p>

        {!revealed && !reducedMotion && (
          <canvas
            ref={canvasRef}
            width={480}
            height={180}
            onPointerDown={(e) => {
              setIsDrawing(true);
              scratchAt(e.clientX, e.clientY);
            }}
            onPointerMove={(e) => {
              if (isDrawing) scratchAt(e.clientX, e.clientY);
            }}
            onPointerUp={() => setIsDrawing(false)}
            onPointerLeave={() => setIsDrawing(false)}
            aria-label="Area kartu gores interaktif"
            className="absolute inset-0 h-full w-full cursor-crosshair touch-none"
          />
        )}
      </div>

      {!revealed && (
        <button
          type="button"
          onClick={() => setRevealed(true)}
          className="mt-4 inline-flex h-10 items-center justify-center rounded-full border px-5 text-xs font-semibold transition-colors hover:bg-black/5"
          style={{ borderColor: `${accent}55`, color: accent }}
        >
          Buka pesan langsung (Alternatif tanpa gosok)
        </button>
      )}
    </div>
  );
}
