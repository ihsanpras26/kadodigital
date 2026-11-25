"use client";

import { useEffect, useMemo, useState } from "react";
import { Check, Copy, Download, RotateCcw, X } from "lucide-react";
import type { GachaAudioEngine } from "./gachaAudioEngine";
import type { GachaCapsuleItem, GachaWorldPayload } from "./gachaData";

interface ThermalReceiptPrinterProps {
  payload: GachaWorldPayload;
  recipientName: string;
  collectedCapsules: GachaCapsuleItem[];
  audioEngine: GachaAudioEngine | null;
  onClose: () => void;
  onReplayMachine: () => void;
}

function drawReceiptPng9x16(
  payload: GachaWorldPayload,
  recipientName: string,
  dateStamp: string,
): string {
  const W = 1080;
  const H = 1920;
  const canvas = document.createElement("canvas");
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext("2d")!;

  // 1. Dark Walnut & Warm Tungsten Spotlight Backdrop for 9:16 Story Poster
  const bg = ctx.createRadialGradient(W * 0.5, H * 0.28, 80, W * 0.5, H * 0.5, H * 0.85);
  bg.addColorStop(0, "#33251D");
  bg.addColorStop(0.55, "#191310");
  bg.addColorStop(1, "#100C0A");
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, W, H);

  // Top Story Dedication Line & Four Capsule Dots
  const mono = '"Space Mono", ui-monospace, SFMono-Regular, monospace';
  ctx.fillStyle = "#E8C16E";
  ctx.font = `700 24px ${mono}`;
  ctx.textAlign = "center";
  ctx.fillText(
    `KHUSUS UNTUK ${recipientName.toUpperCase().slice(0, 22)} · DARI ${payload.senderName
      .toUpperCase()
      .slice(0, 16)}`,
    W / 2,
    114,
  );

  const dotColors = ["#B83124", "#2D6A4F", "#D6A54B", "#325788"];
  dotColors.forEach((col, i) => {
    ctx.beginPath();
    ctx.arc(W / 2 - 54 + i * 36, 158, 10, 0, Math.PI * 2);
    ctx.fillStyle = col;
    ctx.fill();
    ctx.lineWidth = 2;
    ctx.strokeStyle = "#E8C16E";
    ctx.stroke();
  });

  // 2. Serrated Thermal Receipt Sheet
  const rx = 130;
  const ry = 215;
  const rw = 820;
  const rh = 1415;
  const toothW = 20;
  const toothH = 16;

  // Deep shadow behind floating thermal receipt
  ctx.fillStyle = "rgba(0, 0, 0, 0.45)";
  ctx.fillRect(rx + 12, ry + 20, rw, rh);

  // Paper body with sawtooth top & bottom edges
  ctx.beginPath();
  ctx.moveTo(rx, ry + toothH);
  for (let x = rx; x < rx + rw; x += toothW) {
    ctx.lineTo(x + toothW / 2, ry);
    ctx.lineTo(x + toothW, ry + toothH);
  }
  ctx.lineTo(rx + rw, ry + rh - toothH);
  for (let x = rx + rw; x > rx; x -= toothW) {
    ctx.lineTo(x - toothW / 2, ry + rh);
    ctx.lineTo(x - toothW, ry + rh - toothH);
  }
  ctx.closePath();
  ctx.fillStyle = "#FFFEF9";
  ctx.fill();
  ctx.lineWidth = 3;
  ctx.strokeStyle = "#221914";
  ctx.stroke();

  const { receipt } = payload;
  const padX = rx + 64;
  const rightX = rx + rw - 64;
  let y = ry + 96;

  // Store Header
  ctx.fillStyle = "#221914";
  ctx.textAlign = "center";
  ctx.font = `700 38px ${mono}`;
  ctx.fillText(receipt.storeName, W / 2, y);
  y += 42;
  ctx.fillStyle = "#6E5541";
  ctx.font = `400 22px ${mono}`;
  ctx.fillText(receipt.storeAddress, W / 2, y);
  y += 46;

  const drawDashed = (lineY: number) => {
    ctx.save();
    ctx.setLineDash([10, 8]);
    ctx.strokeStyle = "#8C7560";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(padX, lineY);
    ctx.lineTo(rightX, lineY);
    ctx.stroke();
    ctx.restore();
  };

  drawDashed(y);
  y += 44;

  // Meta rows
  const drawPair = (left: string, right: string, bold = false, size = 23) => {
    ctx.fillStyle = "#221914";
    ctx.font = `${bold ? "700" : "400"} ${size}px ${mono}`;
    ctx.textAlign = "left";
    ctx.fillText(left, padX, y);
    ctx.textAlign = "right";
    ctx.fillText(right, rightX, y);
    y += size + 18;
  };

  drawPair("NO. STRUK", receipt.serialNo);
  drawPair("TANGGAL", dateStamp);
  drawPair("UNTUK", recipientName.toUpperCase().slice(0, 22), true);
  drawPair("KASIR", receipt.cashier.toUpperCase());

  y += 6;
  drawDashed(y);
  y += 46;

  // Items header
  ctx.fillStyle = "#6E5541";
  ctx.font = `700 21px ${mono}`;
  ctx.textAlign = "left";
  ctx.fillText("QTY  RINCIAN KENANGAN", padX, y);
  ctx.textAlign = "right";
  ctx.fillText("NILAI", rightX, y);
  y += 40;

  // Itemized rows with clean wrapping
  receipt.items.forEach((item) => {
    ctx.fillStyle = "#221914";
    ctx.font = `700 24px ${mono}`;
    ctx.textAlign = "right";
    ctx.fillText(item.value, rightX, y);

    ctx.textAlign = "left";
    ctx.font = `400 24px ${mono}`;
    const maxW = rw - 290;
    const fullText = `${item.qty.padEnd(4, " ")} ${item.label}`;
    const words = fullText.split(" ");
    let line = "";
    const lines: string[] = [];
    words.forEach((word) => {
      const test = line ? `${line} ${word}` : word;
      if (ctx.measureText(test).width > maxW && line) {
        lines.push(line);
        line = "     " + word;
      } else {
        line = test;
      }
    });
    if (line) lines.push(line);

    lines.forEach((l, li) => {
      ctx.fillText(l, padX, y + li * 30);
    });
    y += Math.max(1, lines.length) * 30 + 18;
  });

  y += 8;
  drawDashed(y);
  y += 46;

  // Totals
  drawPair(receipt.subtotalLabel, receipt.subtotalValue, false, 23);
  drawPair(receipt.taxLabel, receipt.taxValue, false, 23);
  y += 6;
  drawPair(receipt.totalLabel, receipt.totalValue, true, 30);
  drawPair(receipt.changeLabel, receipt.changeValue, false, 23);

  y += 14;
  // Crimson Slanted Rubber Stamp "LUNAS" in clean space below totals
  ctx.save();
  ctx.translate(rightX - 130, y + 26);
  ctx.rotate(-0.14);
  ctx.strokeStyle = "#C8281D";
  ctx.lineWidth = 6;
  ctx.strokeRect(-118, -42, 236, 84);
  ctx.lineWidth = 2;
  ctx.strokeRect(-110, -34, 220, 68);
  ctx.fillStyle = "#C8281D";
  ctx.font = `700 46px ${mono}`;
  ctx.textAlign = "center";
  ctx.fillText(receipt.stampText, 0, 16);
  ctx.restore();

  y += 84;
  drawDashed(y);
  y += 46;

  // Crisp Vertical Barcode
  const barXStart = W / 2 - 210;
  const barW = 420;
  let bx = barXStart;
  for (let i = 0; i < 48 && bx < barXStart + barW; i++) {
    const w = ((i * 7 + 3) % 4) * 2 + 2;
    const gap = ((i * 5 + 2) % 3) * 2 + 3;
    ctx.fillStyle = "#221914";
    ctx.fillRect(bx, y, w, 74);
    bx += w + gap;
  }
  y += 104;
  ctx.fillStyle = "#5E4D41";
  ctx.font = `700 20px ${mono}`;
  ctx.textAlign = "center";
  ctx.fillText(receipt.barcodeCode, W / 2, y);
  y += 42;

  // Footer note
  ctx.fillStyle = "#221914";
  ctx.font = `400 21px ${mono}`;
  ctx.fillText(receipt.footerLine, W / 2, y);

  // Bottom attribution
  ctx.fillStyle = "#C7B398";
  ctx.font = `700 22px ${mono}`;
  ctx.fillText("kadodigital.id · Titipan Kapsul Pribadi", W / 2, 1735);

  return canvas.toDataURL("image/png");
}

export function ThermalReceiptPrinter({
  payload,
  recipientName,
  collectedCapsules,
  audioEngine,
  onClose,
  onReplayMachine,
}: ThermalReceiptPrinterProps) {
  const totalSteps = payload.receipt.items.length + 5;
  const [printedStep, setPrintedStep] = useState(0);
  const [stamped, setStamped] = useState(false);
  const [copiedText, setCopiedText] = useState(false);
  const [savedNotice, setSavedNotice] = useState<string | null>(null);

  const dateStamp = useMemo(() => {
    const now = new Date();
    const dd = String(now.getDate()).padStart(2, "0");
    const mm = String(now.getMonth() + 1).padStart(2, "0");
    const yyyy = now.getFullYear();
    return `${dd}/${mm}/${yyyy}`;
  }, []);

  // Stepper-motor thermal line-by-line printing cadence
  useEffect(() => {
    const prefersReduced =
      typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) {
      setPrintedStep(totalSteps);
      setStamped(true);
      return;
    }

    setPrintedStep(0);
    setStamped(false);

    let step = 0;
    let stampTimer: number | undefined;
    const timer = window.setInterval(() => {
      step++;
      setPrintedStep(step);
      audioEngine?.playReceiptStep();

      if (step >= totalSteps) {
        window.clearInterval(timer);
        stampTimer = window.setTimeout(() => {
          setStamped(true);
          audioEngine?.playStampSlam();
        }, 220);
      }
    }, 115);

    return () => {
      window.clearInterval(timer);
      if (stampTimer !== undefined) window.clearTimeout(stampTimer);
    };
  }, [totalSteps, audioEngine, payload.mode]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const handleDownloadPng = () => {
    const url = drawReceiptPng9x16(payload, recipientName, dateStamp);
    const link = document.createElement("a");
    const safeName = recipientName
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
    link.download = `struk-kenangan-${payload.mode}-${safeName || "spesial"}.png`;
    link.href = url;
    link.click();
    audioEngine?.playCapsuleCrack();
    setSavedNotice("Struk 9:16 tersimpan, siap unggah ke Story!");
    window.setTimeout(() => setSavedNotice(null), 3200);
  };

  const handleCopyText = async () => {
    const { receipt } = payload;
    const lines = [
      receipt.storeName,
      `NO: ${receipt.serialNo} | TGL: ${dateStamp}`,
      `UNTUK: ${recipientName}`,
      `KASIR: ${receipt.cashier}`,
      "------------------------------",
      ...receipt.items.map((it) => `${it.qty} ${it.label} -> ${it.value}`),
      "------------------------------",
      `${receipt.totalLabel}: ${receipt.totalValue} [${receipt.stampText}]`,
      receipt.footerLine,
    ].join("\n");

    try {
      await navigator.clipboard.writeText(lines);
      setCopiedText(true);
      audioEngine?.playFlipCard();
      window.setTimeout(() => setCopiedText(false), 2400);
    } catch {
      // ignore clipboard block
    }
  };

  const { receipt } = payload;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Printer Struk Kenangan Thermal"
      className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-[#0D0907]/82 px-4 py-6 backdrop-blur-sm"
    >
      <div className="relative my-auto w-full max-w-[410px]">
        {/* Printer Machine Top Housing Slot */}
        <div className="relative z-20 flex items-center justify-between rounded-t-[20px] rounded-b-[10px] border border-[#E8C16E]/40 bg-[#1E1612] px-4 py-2.5 text-[#FFFDF8] shadow-xl">
          <div className="flex items-center gap-2.5">
            <span
              className={`h-2.5 w-2.5 rounded-full border border-black transition-colors ${
                stamped
                  ? "bg-[#3BAE66] shadow-[0_0_8px_#3BAE66]"
                  : "bg-[#E3A939] shadow-[0_0_8px_#E3A939]"
              }`}
            />
            <span className="gacha-receipt-font text-[11px] font-bold tracking-wider uppercase">
              {stamped ? "STRUK SELESAI DICETAK" : "MENCETAK STRUK THERMAL..."}
            </span>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Tutup jendela struk"
            className="flex h-8 w-8 items-center justify-center rounded-full border border-[#E8C16E]/30 bg-white/10 text-white hover:bg-white/20"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Printer Paper Feed Lip */}
        <div className="relative z-10 mx-4 -mt-1.5 h-3 rounded-b-md border-x border-b border-[#E8C16E]/30 bg-[#0D0907]" />

        {/* Emerging Serrated Thermal Paper */}
        <div className="relative z-0 mx-4 -mt-1 drop-shadow-[0_18px_28px_rgba(0,0,0,0.34)]">
          <div className="gacha-receipt-teeth-top" aria-hidden="true" />
          <div className="gacha-receipt-font relative border-x border-[#221914]/15 bg-[#FFFEF9] px-5 py-2.5 text-[#221914]">
            {/* Store Title */}
            <div className="text-center">
              <p className="text-sm font-bold tracking-tight">{receipt.storeName}</p>
              <p className="mt-0.5 text-[10px] text-[#6E5541]">{receipt.storeAddress}</p>
            </div>

            <div className="my-2 border-t border-dashed border-[#8C7560]" />

            {/* Receipt Meta */}
            {printedStep >= 1 && (
              <div className="space-y-0.5 text-[11px]">
                <div className="flex justify-between gap-2">
                  <span className="text-[#6E5541]">NO. STRUK</span>
                  <span className="font-bold">{receipt.serialNo}</span>
                </div>
                <div className="flex justify-between gap-2">
                  <span className="text-[#6E5541]">UNTUK</span>
                  <span className="truncate font-bold uppercase">{recipientName}</span>
                </div>
                <div className="flex justify-between gap-2">
                  <span className="text-[#6E5541]">KASIR · TGL</span>
                  <span>
                    {receipt.cashier} · {dateStamp}
                  </span>
                </div>
              </div>
            )}

            {printedStep >= 2 && (
              <div className="my-2.5 border-t border-dashed border-[#8C7560]" />
            )}

            {/* Itemized Witty Memories */}
            {printedStep >= 2 && (
              <div className="space-y-1.5 text-[11px]">
                <div className="flex justify-between text-[10px] font-bold text-[#6E5541]">
                  <span>QTY / RINCIAN MOMEN</span>
                  <span>NILAI</span>
                </div>

                {receipt.items.slice(0, Math.max(0, printedStep - 2)).map((item, idx) => (
                  <div key={idx} className="flex items-start justify-between gap-3">
                    <span className="leading-snug">
                      <strong className="mr-1.5">{item.qty}</strong>
                      {item.label}
                    </span>
                    <span className="shrink-0 font-bold">{item.value}</span>
                  </div>
                ))}
              </div>
            )}

            {/* Totals Block + Slanted Rubber Stamp inside clean corner */}
            {printedStep >= totalSteps - 2 && (
              <div className="relative">
                <div className="my-2.5 border-t border-dashed border-[#8C7560]" />
                <div className="space-y-0.5 text-[11px]">
                  <div className="flex justify-between">
                    <span className="text-[#6E5541]">{receipt.subtotalLabel}</span>
                    <span>{receipt.subtotalValue}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#6E5541]">{receipt.taxLabel}</span>
                    <span>{receipt.taxValue}</span>
                  </div>
                  <div className="flex justify-between pt-1 text-sm font-bold">
                    <span>{receipt.totalLabel}</span>
                    <span>{receipt.totalValue}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#6E5541]">{receipt.changeLabel}</span>
                    <span>{receipt.changeValue}</span>
                  </div>
                </div>

                {stamped && (
                  <div className="mt-2.5 flex justify-end pr-1">
                    <span className="gacha-stamp-slam inline-block border-[3px] border-[#C8281D] px-2.5 py-0.5 text-base font-bold tracking-widest text-[#C8281D] outline-1 outline-[#C8281D] outline-offset-2">
                      {receipt.stampText}
                    </span>
                  </div>
                )}
              </div>
            )}

            {/* Collected Dots + Barcode */}
            {printedStep >= totalSteps && (
              <>
                <div className="my-2.5 border-t border-dashed border-[#8C7560]" />
                <div className="flex items-center justify-center gap-1.5 pb-1.5">
                  {collectedCapsules.map((c) => (
                    <span
                      key={c.id}
                      className="h-2.5 w-2.5 rounded-full border border-[#221914]"
                      style={{ backgroundColor: c.shellColor }}
                    />
                  ))}
                  <span className="ml-1 text-[10px] text-[#6E5541]">
                    {collectedCapsules.length}/{payload.capsules.length} KAPSUL TERBUKA
                  </span>
                </div>

                {/* Barcode CSS graphic */}
                <div
                  className="mx-auto flex h-7 w-[196px] items-stretch justify-center gap-[2px]"
                  aria-hidden="true"
                >
                  {Array.from({ length: 34 }, (_, i) => (
                    <span
                      key={i}
                      className="block h-full bg-[#221914]"
                      style={{
                        width: `${((i * 5 + 3) % 3) + 1}px`,
                        marginRight: `${(i * 3) % 3}px`,
                      }}
                    />
                  ))}
                </div>
                <p className="mt-1 text-center text-[9px] font-bold tracking-widest text-[#6E5541]">
                  {receipt.barcodeCode}
                </p>
                <p className="mt-1.5 text-center text-[10px] leading-snug text-[#3E2B1E]">
                  {receipt.footerLine}
                </p>
              </>
            )}
          </div>
          <div className="gacha-receipt-teeth-bottom" aria-hidden="true" />
        </div>

        {/* Viral Share & Save Actions */}
        {stamped && (
          <div className="mt-4 space-y-2.5 px-1">
            <button
              type="button"
              onClick={handleDownloadPng}
              className="gacha-brass-btn inline-flex min-h-[48px] w-full items-center justify-center gap-2 rounded-[14px] px-5 text-sm font-bold"
            >
              <Download className="h-4 w-4" aria-hidden="true" />
              <span>Simpan Poster Story (9:16 PNG)</span>
            </button>

            <div className="grid grid-cols-2 gap-2.5">
              <button
                type="button"
                onClick={handleCopyText}
                className="inline-flex min-h-[42px] items-center justify-center gap-1.5 rounded-[12px] border border-[#E8C16E]/30 bg-[#231A15] px-3 text-xs font-bold text-[#FAF4E8] transition hover:bg-[#30241D]"
              >
                {copiedText ? (
                  <>
                    <Check className="h-3.5 w-3.5 text-[#7AE0A3]" aria-hidden="true" />
                    <span>Tersalin</span>
                  </>
                ) : (
                  <>
                    <Copy className="h-3.5 w-3.5" aria-hidden="true" />
                    <span>Salin Teks Struk</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={onReplayMachine}
                className="inline-flex min-h-[42px] items-center justify-center gap-1.5 rounded-[12px] border border-[#E8C16E]/30 bg-[#1B1411] px-3 text-xs font-bold text-[#DFCEB2] transition hover:bg-[#291E19]"
              >
                <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
                <span>Main Lagi</span>
              </button>
            </div>

            {savedNotice && (
              <p
                role="status"
                className="gacha-receipt-font rounded-lg border border-[#E8C16E]/35 bg-[#1B1411] px-3 py-1.5 text-center text-[11px] font-bold text-[#F0CB78]"
              >
                {savedNotice}
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
