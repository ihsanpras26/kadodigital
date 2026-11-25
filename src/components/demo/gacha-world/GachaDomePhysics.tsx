"use client";

import { useEffect, useRef, useState } from "react";
import type { GachaAudioEngine } from "./gachaAudioEngine";
import type { GachaCapsuleItem } from "./gachaData";

export type MachinePhase =
  | "idle"
  | "inserting-coin"
  | "coin-ready"
  | "cranking"
  | "dispensing"
  | "ready-to-crack"
  | "all-done";

interface GachaDomePhysicsProps {
  badgeLabel: string;
  phase: MachinePhase;
  remainingCoins: number;
  collectedIds: string[];
  allCapsules: GachaCapsuleItem[];
  activeCapsule: GachaCapsuleItem | null;
  audioEngine: GachaAudioEngine | null;
  onInsertCoin: () => void;
  onStartCrank: () => void;
  onCrankComplete: () => void;
  onCrackDispensed: () => void;
}

interface PhysicsBall {
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
  rot: number;
  vRot: number;
  color: string;
  lightColor: string;
  darkColor: string;
}

const CAPSULE_SHELLS = [
  { color: "#B83124", light: "#DE6457", dark: "#6B140C" },
  { color: "#2D6A4F", light: "#539B7B", dark: "#173C2B" },
  { color: "#D6A54B", light: "#F2CF84", dark: "#8C621B" },
  { color: "#325788", light: "#5E86BA", dark: "#1B3354" },
];

export function GachaDomePhysics({
  badgeLabel,
  phase,
  remainingCoins,
  collectedIds,
  allCapsules,
  activeCapsule,
  audioEngine,
  onInsertCoin,
  onStartCrank,
  onCrankComplete,
  onCrackDispensed,
}: GachaDomePhysicsProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const slotRef = useRef<HTMLButtonElement | null>(null);
  const crankRef = useRef<HTMLButtonElement | null>(null);

  const phaseRef = useRef<MachinePhase>(phase);
  phaseRef.current = phase;
  const onCrankCompleteRef = useRef(onCrankComplete);
  onCrankCompleteRef.current = onCrankComplete;

  // Live physics stirrer energy & direct-touch dome impulse queue
  const liveSpinPowerRef = useRef(0);
  const impulseQueueRef = useRef<{ cx: number; cy: number; vx: number; vy: number }[]>([]);
  const lastDomeTapMsRef = useRef(0);

  const [crankDeg, setCrankDeg] = useState(0);
  const [chassisShake, setChassisShake] = useState(false);

  // Drag-to-Insert Coin State
  const [dragCoin, setDragCoin] = useState<{ x: number; y: number; nearSlot: boolean } | null>(
    null,
  );
  const coinDragMetaRef = useRef<{ startX: number; startY: number; moved: number } | null>(null);

  // Manual 360 Circular Drag-to-Crank State
  const crankDragRef = useRef<{
    active: boolean;
    startTime: number;
    prevAngle: number;
    cumDeg: number;
    maxAbsDeg: number;
    lastNotch: number;
  } | null>(null);

  // Automatic 2-Stage Crank Animation when phase === "cranking"
  useEffect(() => {
    if (phase !== "cranking") {
      if (!crankDragRef.current?.active) {
        setCrankDeg(0);
      }
      setChassisShake(false);
      return;
    }

    const prefersReduced =
      typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    const durationMs = prefersReduced ? 320 : 1240;
    const startMs = performance.now();
    let lastNotch = -1;
    let rafId = 0;

    setChassisShake(true);
    audioEngine?.playCapsuleTumble();

    const tick = (now: number) => {
      const elapsed = now - startMs;
      const t = Math.min(1, elapsed / durationMs);

      const eased =
        t < 0.52
          ? 0.48 * Math.pow(t / 0.52, 1.35)
          : 0.48 + 0.52 * (1 - Math.pow(1 - (t - 0.52) / 0.48, 2.2));
      const deg = eased * 360;
      setCrankDeg(deg);
      liveSpinPowerRef.current = t < 0.9 ? 1 : 0.3;

      const notch = Math.floor(deg / 45);
      if (notch > lastNotch && notch <= 8) {
        lastNotch = notch;
        audioEngine?.playCrankClick(0.9 + (notch % 3) * 0.12);
      }

      if (t < 1) {
        rafId = requestAnimationFrame(tick);
      } else {
        liveSpinPowerRef.current = 0;
        setChassisShake(false);
        onCrankCompleteRef.current();
      }
    };

    rafId = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(rafId);
      liveSpinPowerRef.current = 0;
      setChassisShake(false);
    };
  }, [phase, audioEngine]);

  // Physics Dome Simulation
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const W = 286;
    const H = 192;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = W * dpr;
    canvas.height = H * dpr;

    const domeCx = W / 2;
    const domeCy = 102;
    const domeR = 92;
    const floorY = H - 10;

    const balls: PhysicsBall[] = Array.from({ length: 12 }, (_, idx) => {
      const shell = CAPSULE_SHELLS[idx % CAPSULE_SHELLS.length];
      const col = idx % 4;
      const row = Math.floor(idx / 4);
      return {
        x: domeCx - 50 + col * 34 + (row % 2) * 12,
        y: floorY - 22 - row * 36,
        vx: (idx % 2 === 0 ? 1 : -1) * 14,
        vy: 0,
        r: 19.5,
        rot: ((idx * 37) % 360) * (Math.PI / 180),
        vRot: 0,
        color: shell.color,
        lightColor: shell.light,
        darkColor: shell.dark,
      };
    });

    let stirrerAngle = 0;
    let prevNow = performance.now();
    let rafId = 0;

    const drawBall = (b: PhysicsBall) => {
      ctx.save();
      ctx.translate(b.x, b.y);

      // Soft depth shadow beneath sphere
      ctx.beginPath();
      ctx.arc(2, 3.5, b.r, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(18, 12, 9, 0.24)";
      ctx.fill();

      ctx.rotate(b.rot);

      // Clipped interior for true spherical shading across two halves
      ctx.save();
      ctx.beginPath();
      ctx.arc(0, 0, b.r, 0, Math.PI * 2);
      ctx.clip();

      // Top lacquer colored hemisphere gradient
      const topGrad = ctx.createRadialGradient(-b.r * 0.35, -b.r * 0.4, 2, 0, 0, b.r * 1.15);
      topGrad.addColorStop(0, b.lightColor);
      topGrad.addColorStop(0.58, b.color);
      topGrad.addColorStop(1, b.darkColor);
      ctx.fillStyle = topGrad;
      ctx.fillRect(-b.r - 2, -b.r - 2, b.r * 2 + 4, b.r + 2);

      // Bottom warm cream porcelain hemisphere gradient
      const botGrad = ctx.createRadialGradient(-b.r * 0.25, b.r * 0.2, 2, 0, b.r * 0.25, b.r * 1.1);
      botGrad.addColorStop(0, "#FFFDF9");
      botGrad.addColorStop(0.68, "#EFE4D0");
      botGrad.addColorStop(1, "#BDAA8F");
      ctx.fillStyle = botGrad;
      ctx.fillRect(-b.r - 2, 0, b.r * 2 + 4, b.r + 2);

      // Brushed antique brass equator seam ring
      ctx.fillStyle = "#C9963B";
      ctx.fillRect(-b.r - 2, -1.6, b.r * 2 + 4, 3.2);
      ctx.fillStyle = "rgba(28, 18, 12, 0.45)";
      ctx.fillRect(-b.r - 2, 1.1, b.r * 2 + 4, 1);

      ctx.restore();

      // Specular glass highlight
      ctx.beginPath();
      ctx.ellipse(-b.r * 0.34, -b.r * 0.42, b.r * 0.26, b.r * 0.14, -0.5, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(255, 255, 255, 0.58)";
      ctx.fill();

      // Thin refined rim contour (replaces heavy cartoon black stroke)
      ctx.beginPath();
      ctx.arc(0, 0, b.r, 0, Math.PI * 2);
      ctx.lineWidth = 1.25;
      ctx.strokeStyle = "rgba(33, 24, 19, 0.52)";
      ctx.stroke();

      ctx.restore();
    };

    const step = (now: number) => {
      const dt = Math.min((now - prevNow) / 1000, 0.032);
      prevNow = now;
      const curPhase = phaseRef.current;
      const spinPower = Math.max(
        curPhase === "cranking" ? 1 : 0,
        liveSpinPowerRef.current,
      );
      const agitating = spinPower > 0.08;
      liveSpinPowerRef.current *= Math.pow(0.86, dt * 60);

      if (agitating) {
        stirrerAngle += dt * 11 * Math.max(0.35, spinPower);
      }

      // Consume pending tap/swipe dome impulses
      if (impulseQueueRef.current.length > 0) {
        const queued = impulseQueueRef.current.splice(0, impulseQueueRef.current.length);
        for (const imp of queued) {
          for (const b of balls) {
            const dist = Math.hypot(b.x - imp.cx, b.y - imp.cy);
            const falloff = Math.max(0.32, 1 - dist / 180);
            b.vx += imp.vx * falloff + (b.x - imp.cx) * 1.4;
            b.vy += imp.vy * falloff - 140 * falloff;
          }
        }
      }

      const gravity = agitating ? 470 : 730;
      const swirlPhase = now * 0.009;

      for (let i = 0; i < balls.length; i++) {
        const b = balls[i];
        b.vy += gravity * dt;

        if (agitating) {
          const dx = b.x - domeCx;
          const dy = b.y - domeCy;
          b.vx += (-dy * 4.4 + Math.cos(swirlPhase + i) * 185) * spinPower * dt;
          b.vy += (dx * 3.6 - 520 + Math.sin(swirlPhase + i * 1.4) * 150) * spinPower * dt;
          b.vRot += (b.vx > 0 ? 1 : -1) * 5.0 * spinPower * dt;
        }

        const damp = agitating ? 0.992 : 0.945;
        b.vx *= Math.pow(damp, dt * 60);
        b.vy *= Math.pow(damp, dt * 60);
        b.vRot *= Math.pow(0.92, dt * 60);

        b.x += b.vx * dt;
        b.y += b.vy * dt;
        b.rot += b.vRot * dt + (b.vx * dt) / b.r;
      }

      // Collision resolution
      for (let iter = 0; iter < 2; iter++) {
        for (let i = 0; i < balls.length; i++) {
          for (let j = i + 1; j < balls.length; j++) {
            const a = balls[i];
            const b = balls[j];
            const dx = b.x - a.x;
            const dy = b.y - a.y;
            const dist = Math.hypot(dx, dy);
            const minDist = a.r + b.r + 0.8;
            if (dist < minDist && dist > 0.001) {
              const nx = dx / dist;
              const ny = dy / dist;
              const overlap = (minDist - dist) * 0.5;
              a.x -= nx * overlap;
              a.y -= ny * overlap;
              b.x += nx * overlap;
              b.y += ny * overlap;

              const rvx = b.vx - a.vx;
              const rvy = b.vy - a.vy;
              const velAlongNormal = rvx * nx + rvy * ny;
              if (velAlongNormal < 0) {
                const restitution = agitating ? 0.72 : 0.36;
                const imp = -(1 + restitution) * velAlongNormal * 0.5;
                a.vx -= imp * nx;
                a.vy -= imp * ny;
                b.vx += imp * nx;
                b.vy += imp * ny;
              }
            }
          }
        }

        for (const b of balls) {
          if (b.y + b.r > floorY) {
            b.y = floorY - b.r;
            if (b.vy > 0) b.vy *= agitating ? -0.68 : -0.26;
          }
          const dx = b.x - domeCx;
          const dy = b.y - domeCy;
          const maxDist = domeR - b.r - 2;
          if (dy < 36) {
            const d = Math.hypot(dx, dy);
            if (d > maxDist && d > 0.001) {
              const nx = dx / d;
              const ny = dy / d;
              b.x = domeCx + nx * maxDist;
              b.y = domeCy + ny * maxDist;
              const dot = b.vx * nx + b.vy * ny;
              if (dot > 0) {
                const bounce = agitating ? 0.74 : 0.32;
                b.vx -= (1 + bounce) * dot * nx;
                b.vy -= (1 + bounce) * dot * ny;
              }
            }
          } else {
            const halfFloorW = 94 - (b.y - (domeCy + 36)) * 0.14 - b.r;
            if (b.x < domeCx - halfFloorW) {
              b.x = domeCx - halfFloorW;
              b.vx = Math.abs(b.vx) * 0.55;
            } else if (b.x > domeCx + halfFloorW) {
              b.x = domeCx + halfFloorW;
              b.vx = -Math.abs(b.vx) * 0.55;
            }
          }
        }
      }

      // Render Backlit Cream Dome
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, W, H);

      const grad = ctx.createRadialGradient(domeCx - 16, domeCy - 24, 14, domeCx, domeCy, domeR + 24);
      grad.addColorStop(0, "#FFF9ED");
      grad.addColorStop(0.55, "#EFE2CA");
      grad.addColorStop(1, "#C3AE8E");
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, W, H);

      // Warm amber tungsten halo inside dome center
      const bulbGrad = ctx.createRadialGradient(domeCx, 26, 4, domeCx, 48, 120);
      bulbGrad.addColorStop(0, "rgba(255, 214, 130, 0.55)");
      bulbGrad.addColorStop(1, "rgba(255, 214, 130, 0)");
      ctx.fillStyle = bulbGrad;
      ctx.fillRect(0, 0, W, H);

      // Antique brass mechanical stirrer pedestal
      ctx.save();
      ctx.translate(domeCx, floorY - 2);
      ctx.fillStyle = "#8B6937";
      ctx.fillRect(-38, -8, 76, 10);
      const bladeW = 14 + Math.abs(Math.cos(stirrerAngle)) * 18;
      ctx.fillStyle = "#D6A54B";
      ctx.fillRect(-bladeW, -16, bladeW * 2, 8);
      ctx.restore();

      for (const b of balls) {
        drawBall(b);
      }

      // Smoked acrylic dome specular reflections
      ctx.save();
      ctx.beginPath();
      ctx.ellipse(domeCx - 48, domeCy - 44, 15, 42, -0.45, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(255, 255, 255, 0.36)";
      ctx.fill();

      ctx.beginPath();
      ctx.ellipse(domeCx - 58, domeCy - 6, 5, 11, -0.35, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(255, 255, 255, 0.45)";
      ctx.fill();
      ctx.restore();

      rafId = requestAnimationFrame(step);
    };

    rafId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(rafId);
  }, []);

  // Dome tap/swipe agitation handlers
  const handleDomePointer = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const cx = ((e.clientX - rect.left) / rect.width) * 286;
    const cy = ((e.clientY - rect.top) / rect.height) * 192;
    impulseQueueRef.current.push({
      cx,
      cy,
      vx: (Math.random() - 0.5) * 180,
      vy: -220,
    });
    const nowMs = performance.now();
    if (nowMs - lastDomeTapMsRef.current > 150) {
      lastDomeTapMsRef.current = nowMs;
      audioEngine?.playDomeTap();
    }
  };

  // Drag-and-Drop Coin Token handlers (+ simple tap support)
  useEffect(() => {
    if (!dragCoin) return;
    const onMove = (e: PointerEvent) => {
      if (coinDragMetaRef.current) {
        coinDragMetaRef.current.moved = Math.hypot(
          e.clientX - coinDragMetaRef.current.startX,
          e.clientY - coinDragMetaRef.current.startY,
        );
      }
      const slotRect = slotRef.current?.getBoundingClientRect();
      let nearSlot = false;
      if (slotRect) {
        const sx = slotRect.left + slotRect.width / 2;
        const sy = slotRect.top + slotRect.height / 2;
        nearSlot = Math.hypot(e.clientX - sx, e.clientY - sy) < 82;
      }
      setDragCoin({ x: e.clientX, y: e.clientY, nearSlot });
    };
    const onUp = (e: PointerEvent) => {
      const meta = coinDragMetaRef.current;
      const slotRect = slotRef.current?.getBoundingClientRect();
      let nearSlot = false;
      if (slotRect) {
        const sx = slotRect.left + slotRect.width / 2;
        const sy = slotRect.top + slotRect.height / 2;
        nearSlot = Math.hypot(e.clientX - sx, e.clientY - sy) < 86;
      }
      setDragCoin(null);
      coinDragMetaRef.current = null;
      if (nearSlot || (meta && meta.moved < 9)) {
        onInsertCoin();
      }
    };

    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
    };
  }, [dragCoin, onInsertCoin]);

  // Manual 360 Circular Crank Drag handlers
  const getPointerAngleDeg = (clientX: number, clientY: number): number => {
    const el = crankRef.current;
    if (!el) return 0;
    const r = el.getBoundingClientRect();
    const cx = r.left + r.width / 2;
    const cy = r.top + r.height / 2;
    return (Math.atan2(clientY - cy, clientX - cx) * 180) / Math.PI;
  };

  const handleCrankPointerDown = (e: React.PointerEvent<HTMLButtonElement>) => {
    if (phase !== "coin-ready") return;
    e.currentTarget.setPointerCapture(e.pointerId);
    const angle = getPointerAngleDeg(e.clientX, e.clientY);
    crankDragRef.current = {
      active: true,
      startTime: performance.now(),
      prevAngle: angle,
      cumDeg: crankDeg,
      maxAbsDeg: 0,
      lastNotch: Math.floor(crankDeg / 36),
    };
  };

  const handleCrankPointerMove = (e: React.PointerEvent<HTMLButtonElement>) => {
    const drag = crankDragRef.current;
    if (!drag || !drag.active || phaseRef.current !== "coin-ready") return;

    const angle = getPointerAngleDeg(e.clientX, e.clientY);
    let delta = angle - drag.prevAngle;
    while (delta > 180) delta -= 360;
    while (delta < -180) delta += 360;
    drag.prevAngle = angle;

    drag.cumDeg = Math.max(0, Math.min(360, drag.cumDeg + Math.abs(delta) * 0.95));
    drag.maxAbsDeg = Math.max(drag.maxAbsDeg, drag.cumDeg);
    setCrankDeg(drag.cumDeg);
    liveSpinPowerRef.current = Math.min(1, 0.45 + Math.abs(delta) * 0.08);

    const notch = Math.floor(drag.cumDeg / 36);
    if (notch > drag.lastNotch) {
      drag.lastNotch = notch;
      audioEngine?.playCrankClick(0.92 + (notch % 3) * 0.1);
      if (typeof navigator !== "undefined" && "vibrate" in navigator) {
        navigator.vibrate(8);
      }
      if (notch % 3 === 1) {
        audioEngine?.playCapsuleTumble();
      }
    }

    if (drag.cumDeg >= 332) {
      drag.active = false;
      crankDragRef.current = null;
      setCrankDeg(360);
      liveSpinPowerRef.current = 1;
      onCrankComplete();
    }
  };

  const handleCrankPointerUp = () => {
    const drag = crankDragRef.current;
    if (!drag || !drag.active) return;
    const elapsed = performance.now() - drag.startTime;
    const wasQuickTap = drag.maxAbsDeg < 14 && elapsed < 260;
    drag.active = false;
    crankDragRef.current = null;

    if (wasQuickTap) {
      onStartCrank();
    } else if (drag.cumDeg >= 295) {
      setCrankDeg(360);
      onCrankComplete();
    } else {
      liveSpinPowerRef.current = 0;
      setCrankDeg(0);
    }
  };

  const canInteractCoin = phase === "idle" && remainingCoins > 0;
  const canClickCrank = phase === "coin-ready";
  const canClickTrayCapsule = phase === "ready-to-crack";

  return (
    <div className="relative mx-auto w-full max-w-[356px] select-none">
      {/* Main Lacquer & Brass Keepsake Machine */}
      <div
        className={`relative flex flex-col items-center transition-transform duration-100 ${
          chassisShake ? "gacha-shake" : ""
        }`}
      >
        {/* Brushed Brass Finial & Engraved Top Plaque */}
        <div className="relative z-10 flex w-[246px] flex-col items-center">
          <div className="h-3 w-14 rounded-t-full border border-[#F7DC96]/70 bg-gradient-to-b from-[#F0CB78] to-[#B07A22] shadow-sm" />
          <div className="w-full rounded-t-[18px] border border-[#E8C16E]/45 bg-gradient-to-b from-[#B83124] to-[#871C13] px-3 py-1.5 text-center shadow-[0_8px_24px_rgba(0,0,0,0.45)]">
            <p className="gacha-receipt-font whitespace-nowrap text-[10px] font-bold tracking-[0.09em] text-[#FAF2E4] uppercase">
              {badgeLabel}
            </p>
          </div>
        </div>

        {/* Smoked Brass-Rimmed Acrylic Dome */}
        <div className="relative -mt-0.5 w-[304px] overflow-hidden rounded-t-[138px] rounded-b-[18px] border-2 border-[#C89436] bg-[#241A15] p-2 shadow-[0_20px_46px_-10px_rgba(0,0,0,0.7)]">
          <div className="overflow-hidden rounded-t-[128px] rounded-b-[12px] border border-[#F7DC96]/40">
            <canvas
              ref={canvasRef}
              onPointerDown={handleDomePointer}
              onPointerMove={(e) => {
                if (e.buttons > 0) handleDomePointer(e);
              }}
              className="block h-[192px] w-[286px] touch-none cursor-grab active:cursor-grabbing"
              aria-label="Kubah kaca berisi kapsul kenangan — ketuk untuk mengaduk"
            />
          </div>

          <div className="mt-1.5 flex items-center justify-between px-2">
            <span className="gacha-receipt-font text-[10px] font-bold tracking-wider text-[#DFCEB2]">
              TERBUKA {collectedIds.length}/{allCapsules.length}
            </span>
            <span className="text-[10px] text-[#B8A187]">Ketuk kaca untuk goyang</span>
          </div>
        </div>

        {/* Lower Sculpted Lacquer Crimson Chassis */}
        <div className="relative -mt-1 w-[322px] rounded-t-[14px] rounded-b-[26px] border border-[#E8C16E]/35 bg-gradient-to-b from-[#B83124] via-[#9D2419] to-[#74160E] px-4 pt-3.5 pb-4 shadow-[0_28px_56px_-12px_rgba(0,0,0,0.75),inset_0_1px_0_rgba(255,212,190,0.28)]">
          {/* Ivory & Brushed Brass Control Deck */}
          <div className="flex items-center justify-between gap-2 rounded-[16px] border border-[#8E6520]/45 bg-gradient-to-b from-[#FAF3E6] to-[#EADCC5] p-2.5 shadow-inner">
            {/* Coin Slot Panel (Drop Target!) */}
            <button
              ref={slotRef}
              type="button"
              onClick={canInteractCoin ? onInsertCoin : undefined}
              disabled={!canInteractCoin}
              aria-label={
                canInteractCoin
                  ? "Masukkan koin ke mesin gacha"
                  : "Slot koin mesin gacha"
              }
              className={`group relative flex h-[88px] w-[78px] flex-col items-center justify-between rounded-[12px] border p-2 transition ${
                dragCoin?.nearSlot
                  ? "border-[#2D6A4F] bg-[#E6F1EA] ring-3 ring-[#D6A54B]"
                  : canInteractCoin
                    ? "cursor-pointer border-[#A88240] bg-[#EFE3CE] hover:bg-[#F7ECD7]"
                    : "cursor-default border-[#C5B49A] bg-[#EAE0CE]"
              }`}
            >
              <div className="flex items-center gap-1.5">
                <span
                  className={`h-2.5 w-2.5 rounded-full border border-[#221914]/50 transition-colors ${
                    phase === "coin-ready" || phase === "cranking"
                      ? "bg-[#2D6A4F] shadow-[0_0_8px_#3BAE66]"
                      : phase === "inserting-coin" || dragCoin?.nearSlot
                        ? "bg-[#E3A939] shadow-[0_0_8px_#E3A939]"
                        : "bg-[#9E8B75]"
                  }`}
                />
                <span className="gacha-receipt-font text-[8px] font-bold tracking-tight text-[#5E4D41]">
                  SLOT
                </span>
              </div>

              <div className="relative flex h-10 w-6 items-center justify-center rounded-md border border-[#8B6B32] bg-gradient-to-b from-[#D7CFC0] to-[#B0A493] shadow-inner">
                <span className="block h-6 w-1.5 rounded-full bg-[#1C1410]" />
                {phase === "inserting-coin" && (
                  <span
                    aria-hidden="true"
                    className="gacha-coin-drop absolute -top-2 flex h-7 w-7 items-center justify-center rounded-full border border-[#7A5316] bg-gradient-to-b from-[#F5D37E] to-[#C89232] font-mono text-[9px] font-bold text-[#211813] shadow-md"
                  >
                    KD
                  </span>
                )}
              </div>

              <span className="gacha-receipt-font text-[8.5px] font-bold text-[#2A1D16]">
                {dragCoin?.nearSlot
                  ? "LEPAS!"
                  : phase === "coin-ready"
                    ? "SIAP!"
                    : phase === "idle"
                      ? "TAP / DRAG"
                      : "TERKUNCI"}
              </span>
            </button>

            {/* Center 360 Circular Drag-to-Crank Handle */}
            <div className="flex flex-col items-center">
              <button
                ref={crankRef}
                type="button"
                onPointerDown={handleCrankPointerDown}
                onPointerMove={handleCrankPointerMove}
                onPointerUp={handleCrankPointerUp}
                onPointerCancel={handleCrankPointerUp}
                onKeyDown={(e) => {
                  if ((e.key === "Enter" || e.key === " ") && canClickCrank) {
                    e.preventDefault();
                    onStartCrank();
                  }
                }}
                disabled={!canClickCrank}
                aria-label="Putar tuas gacha 360 derajat (bisa diseret melingkar atau diketuk)"
                className={`relative flex h-[88px] w-[88px] shrink-0 touch-none items-center justify-center rounded-full border-2 border-[#A87A2A] bg-gradient-to-b from-[#F8F1E3] to-[#DFCEB2] shadow-[inset_0_2px_6px_rgba(34,25,20,0.22)] transition ${
                  canClickCrank
                    ? "cursor-grab ring-4 ring-[#D6A54B]/65 active:cursor-grabbing"
                    : "cursor-default"
                }`}
              >
                {[0, 90, 180, 270].map((a) => (
                  <span
                    key={a}
                    aria-hidden="true"
                    className="absolute h-1.5 w-1 rounded-full bg-[#8C6D46]"
                    style={{ transform: `rotate(${a}deg) translateY(-37px)` }}
                  />
                ))}

                {/* Brushed Brass & Crimson Crank Bar */}
                <div
                  className="relative flex h-[68px] w-7 items-center justify-center rounded-full border border-[#7A5316] bg-gradient-to-b from-[#F3CF7B] via-[#D6A54B] to-[#AD7820] shadow-[0_4px_10px_rgba(0,0,0,0.35)]"
                  style={{ transform: `rotate(${crankDeg}deg)` }}
                >
                  <span className="h-4 w-4 rounded-full border border-[#7A5316] bg-[#FAF4E8]" />
                  <span className="absolute top-1.5 h-2.5 w-2.5 rounded-full bg-[#942217]" />
                  <span className="absolute bottom-1.5 h-2.5 w-2.5 rounded-full bg-[#942217]" />
                </div>
              </button>
            </div>

            {/* Remaining Coin Gauge */}
            <div className="flex h-[88px] w-[78px] flex-col items-center justify-center rounded-[12px] border border-[#C5B49A] bg-[#FAF4E8] p-2 text-center">
              <p className="gacha-receipt-font text-[8.5px] font-bold text-[#6E5541] uppercase">
                SISA KOIN
              </p>
              <p className="gacha-display mt-0.5 text-2xl leading-none font-bold text-[#942217]">
                {remainingCoins}
              </p>
              <p className="mt-1.5 text-[9.5px] leading-tight font-medium text-[#4D3B2F]">
                {phase === "coin-ready"
                  ? crankDeg > 20
                    ? `${Math.round((crankDeg / 360) * 100)}% putar`
                    : "Putar 360°!"
                  : phase === "ready-to-crack"
                    ? "Buka kapsul"
                    : remainingCoins > 0
                      ? "Seret koin"
                      : "Cetak struk"}
              </p>
            </div>
          </div>

          {/* Dispensing Chute Bay */}
          <div className="relative mt-3 overflow-hidden rounded-[14px] border border-[#E8C16E]/35 bg-[#1B130F] px-4 py-2.5 shadow-inner">
            <div className="flex items-center justify-between text-[9px] font-bold tracking-widest text-[#DFCDB6]/70 uppercase">
              <span className="gacha-receipt-font">CHUTE KELUAR</span>
              <span className="gacha-receipt-font">KETUK BAKI</span>
            </div>

            <div className="relative mt-1.5 flex h-[64px] items-center justify-center rounded-[10px] border border-[#45342B] bg-[#120C09]">
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-x-3 top-1 h-7 origin-top rounded-md border border-white/20 bg-white/8 transition-transform duration-300"
                style={{
                  transform:
                    phase === "dispensing"
                      ? "perspective(200px) rotateX(68deg)"
                      : "rotateX(0deg)",
                }}
              />

              {(phase === "dispensing" || phase === "ready-to-crack") && activeCapsule ? (
                <button
                  type="button"
                  onClick={canClickTrayCapsule ? onCrackDispensed : undefined}
                  disabled={!canClickTrayCapsule}
                  aria-label={`Buka kapsul ${activeCapsule.serial} (${activeCapsule.title})`}
                  className={`group relative flex items-center gap-3 rounded-xl px-3 py-1.5 transition-all duration-300 ${
                    phase === "dispensing"
                      ? "-translate-y-6 scale-90 opacity-85"
                      : "translate-y-0 scale-100 cursor-pointer hover:scale-105"
                  }`}
                >
                  <span className="relative block h-12 w-12 shrink-0 overflow-hidden rounded-full border border-[#F7DC96]/60 shadow-[0_6px_16px_rgba(0,0,0,0.6)] transition-transform group-hover:rotate-12">
                    <span
                      className="block h-1/2 w-full"
                      style={{ backgroundColor: activeCapsule.shellColor }}
                    />
                    <span className="block h-[2.5px] w-full bg-[#D6A54B]" />
                    <span className="block h-1/2 w-full bg-[#FAF4E8]" />
                    <span className="absolute top-2 left-2.5 h-2 w-3 rounded-full bg-white/55" />
                  </span>

                  <span className="text-left">
                    <span className="gacha-receipt-font block text-[10px] font-bold text-[#E8C16E]">
                      KAPSUL {activeCapsule.serial}
                    </span>
                    <span className="block text-xs font-semibold text-[#FAF4E8]">
                      {canClickTrayCapsule ? "Ketuk untuk Buka" : "Turun ke baki..."}
                    </span>
                  </span>
                </button>
              ) : (
                <p className="gacha-receipt-font text-center text-[11px] font-bold text-[#9C8670]">
                  {phase === "all-done"
                    ? "SEMUA KAPSUL SUDAH DIBUKA"
                    : phase === "cranking"
                      ? "MENGADUK KAPSUL..."
                      : "MENUNGGU KOIN"}
                </p>
              )}
            </div>
          </div>

          {/* Brass Feet */}
          <div className="mx-auto mt-1 flex w-[236px] justify-between px-2" aria-hidden="true">
            <span className="h-2.5 w-10 rounded-b-lg bg-[#241A15]" />
            <span className="h-2.5 w-10 rounded-b-lg bg-[#241A15]" />
          </div>
        </div>
      </div>

      {/* Tactile Stitched Leather Brass Coin Purse + Draggable Token Dock */}
      <div className="gacha-velvet-panel mt-3.5 rounded-[20px] p-3.5">
        <div className="flex items-center justify-between gap-2">
          <div>
            <p className="gacha-receipt-font text-[10px] font-bold tracking-wider text-[#DFCEB2] uppercase">
              Dompet Koin Kuningan
            </p>
            <p className="mt-0.5 text-xs text-[#B8A187]">
              {canInteractCoin
                ? "Seret koin ke slot atau ketuk tombol."
                : phase === "coin-ready"
                  ? "Putar tuas tembaga 360 derajat di mesin."
                  : phase === "ready-to-crack"
                    ? "Kapsul menunggu di baki bawah mesin."
                    : phase === "all-done"
                      ? "Koin habis. Cetak struk kenanganmu."
                      : "Menjalankan mekanisme mesin..."}
            </p>
          </div>
          <span className="gacha-receipt-font shrink-0 rounded-full border border-[#E8C16E]/40 bg-[#1B130F] px-2.5 py-1 text-xs font-bold text-[#F0CB78]">
            {remainingCoins}x
          </span>
        </div>

        {/* Draggable Physical Tokens */}
        <div className="mt-3.5 flex items-center justify-center gap-3">
          {allCapsules.map((cap, idx) => {
            const available = idx < remainingCoins;
            const draggable = available && canInteractCoin;
            return (
              <button
                key={cap.id}
                type="button"
                disabled={!draggable}
                onPointerDown={(e) => {
                  if (!draggable) return;
                  coinDragMetaRef.current = {
                    startX: e.clientX,
                    startY: e.clientY,
                    moved: 0,
                  };
                  setDragCoin({ x: e.clientX, y: e.clientY, nearSlot: false });
                }}
                onKeyDown={(e) => {
                  if ((e.key === "Enter" || e.key === " ") && draggable) {
                    e.preventDefault();
                    onInsertCoin();
                  }
                }}
                aria-label={
                  draggable
                    ? `Koin ${idx + 1} (seret ke slot atau ketuk untuk masukkan)`
                    : `Slot koin ${idx + 1} terpakai`
                }
                className={`relative flex h-12 w-12 touch-none items-center justify-center rounded-full border-2 font-mono text-xs font-bold transition ${
                  draggable
                    ? "cursor-grab border-[#FCE6A6] bg-gradient-to-b from-[#F4D078] to-[#B98224] text-[#21150D] shadow-[0_6px_14px_rgba(214,165,75,0.4)] hover:-translate-y-0.5 active:cursor-grabbing"
                    : "cursor-default border-[#4A3B31] bg-[#1D1612] text-[#5E4D41] opacity-40"
                }`}
              >
                KD
              </button>
            );
          })}
        </div>

        {/* Clear Single Primary CTA */}
        <div className="mt-3.5">
          {canInteractCoin && (
            <button
              type="button"
              onClick={onInsertCoin}
              className="gacha-brass-btn inline-flex min-h-[46px] w-full items-center justify-center rounded-[12px] px-4 text-sm font-bold"
            >
              Masukkan 1 Koin Kuningan
            </button>
          )}
          {phase === "coin-ready" && (
            <button
              type="button"
              onClick={onStartCrank}
              className="gacha-lacquer-btn inline-flex min-h-[46px] w-full items-center justify-center rounded-[12px] px-4 text-sm font-bold"
            >
              Putar Tuas 360° Sekarang
            </button>
          )}
          {phase === "ready-to-crack" && (
            <button
              type="button"
              onClick={onCrackDispensed}
              className="gacha-brass-btn inline-flex min-h-[46px] w-full items-center justify-center rounded-[12px] px-4 text-sm font-bold"
            >
              Pecahkan Kapsul {activeCapsule?.serial ?? ""}
            </button>
          )}
        </div>
      </div>

      {/* Floating Brass Coin Following Pointer During Drag */}
      {dragCoin && (
        <div
          aria-hidden="true"
          className={`pointer-events-none fixed z-50 flex h-12 w-12 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-2 font-mono text-xs font-bold shadow-2xl transition-transform ${
            dragCoin.nearSlot
              ? "scale-110 border-[#A3F0C1] bg-gradient-to-b from-[#F8DC8E] to-[#C89232] text-[#21150D]"
              : "scale-105 border-[#FCE6A6] bg-gradient-to-b from-[#F4D078] to-[#B98224] text-[#21150D]"
          }`}
          style={{ left: dragCoin.x, top: dragCoin.y }}
        >
          KD
        </div>
      )}
    </div>
  );
}
