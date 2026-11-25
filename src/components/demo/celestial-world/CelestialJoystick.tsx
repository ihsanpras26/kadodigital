"use client";

import { useRef, useState } from "react";

interface CelestialJoystickProps {
  visible: boolean;
  showOnDesktop?: boolean;
  onVectorChange: (vec: { x: number; y: number }) => void;
}

export function CelestialJoystick({
  visible,
  showOnDesktop = false,
  onVectorChange,
}: CelestialJoystickProps) {
  const baseRef = useRef<HTMLDivElement | null>(null);
  const draggingRef = useRef(false);
  const [knob, setKnob] = useState({ x: 0, y: 0 });
  const maxRadius = 26;

  if (!visible) return null;

  function updateFromPointer(clientX: number, clientY: number) {
    const el = baseRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    let dx = clientX - cx;
    let dy = clientY - cy;
    const dist = Math.hypot(dx, dy);
    if (dist > maxRadius) {
      dx = (dx / dist) * maxRadius;
      dy = (dy / dist) * maxRadius;
    }
    setKnob({ x: dx, y: dy });
    onVectorChange({ x: dx / maxRadius, y: dy / maxRadius });
  }

  function reset() {
    draggingRef.current = false;
    setKnob({ x: 0, y: 0 });
    onVectorChange({ x: 0, y: 0 });
  }

  return (
    <div
      className={`fixed bottom-20 left-4 z-20 flex-col items-center gap-1 select-none ${
        showOnDesktop ? "flex" : "flex md:hidden"
      }`}
    >
      <div
        ref={baseRef}
        onPointerDown={(e) => {
          draggingRef.current = true;
          e.currentTarget.setPointerCapture(e.pointerId);
          updateFromPointer(e.clientX, e.clientY);
        }}
        onPointerMove={(e) => {
          if (!draggingRef.current) return;
          updateFromPointer(e.clientX, e.clientY);
        }}
        onPointerUp={reset}
        onPointerCancel={reset}
        role="application"
        aria-label="Joystick berjalan di Istana Awan"
        className="celestial-glass relative flex h-24 w-24 touch-none items-center justify-center rounded-full border border-[#EFC86E]/45 cursor-grab active:cursor-grabbing"
      >
        <div
          className="celestial-gold-btn pointer-events-none h-10 w-10 rounded-full"
          style={{
            transform: `translate(${knob.x}px, ${knob.y}px)`,
          }}
        />
      </div>
      <span className="celestial-mono text-[9.5px] font-semibold tracking-wider text-[#F7DC94]/85 uppercase">
        Jalan
      </span>
    </div>
  );
}
