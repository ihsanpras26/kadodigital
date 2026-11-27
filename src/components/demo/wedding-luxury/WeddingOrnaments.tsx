"use client";

import { Pause, Play } from "lucide-react";

export function SundaSigerCrest({
  color = "#9C7A3C",
  className = "",
}: {
  color?: string;
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 180 64"
      fill="none"
      className={className}
      aria-hidden="true"
    >
      {/* Delicate Sunda Siger Crown Silhouette */}
      <path
        d="M90 10C95 22 103 28 114 27C106 34 102 42 104 49H76C78 42 74 34 66 27C77 28 85 22 90 10Z"
        stroke={color}
        strokeWidth="1.25"
        strokeLinejoin="round"
      />
      <path
        d="M112 28C124 27 137 22 146 13C141 28 130 41 111 49"
        stroke={color}
        strokeWidth="1.1"
        strokeLinecap="round"
      />
      <path
        d="M68 28C56 27 43 22 34 13C39 28 50 41 69 49"
        stroke={color}
        strokeWidth="1.1"
        strokeLinecap="round"
      />
      <path
        d="M22 49H158"
        stroke={color}
        strokeWidth="0.9"
        strokeOpacity="0.65"
        strokeLinecap="round"
      />
      <circle cx="90" cy="34" r="2.8" fill={color} />
      <circle cx="15" cy="49" r="1.5" fill={color} fillOpacity="0.7" />
      <circle cx="165" cy="49" r="1.5" fill={color} fillOpacity="0.7" />
    </svg>
  );
}

export function SundaLeafCorner({
  leafColor = "#5E6E49",
  goldColor = "#B5924C",
  flip = false,
  className = "",
}: {
  leafColor?: string;
  goldColor?: string;
  flip?: boolean;
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 160 160"
      fill="none"
      className={className}
      style={flip ? { transform: "scale(-1, -1)" } : undefined}
      aria-hidden="true"
    >
      {/* Flowing Olive Branch + Melati Buds */}
      <path
        d="M6 130C28 96 58 64 118 26"
        stroke={leafColor}
        strokeWidth="1.4"
        strokeOpacity="0.75"
        strokeLinecap="round"
      />
      <path
        d="M8 78C34 52 72 30 144 10"
        stroke={goldColor}
        strokeWidth="1"
        strokeOpacity="0.7"
        strokeLinecap="round"
      />
      {/* Olive Leaves */}
      {[
        "M32 98C22 86 24 70 36 66C44 77 42 90 32 98Z",
        "M58 72C49 58 55 44 68 42C74 55 69 68 58 72Z",
        "M88 49C82 36 90 24 103 24C106 37 99 47 88 49Z",
        "M42 104C54 96 68 98 72 108C60 115 48 113 42 104Z",
        "M70 78C84 72 98 76 101 87C88 92 76 89 70 78Z",
      ].map((d, idx) => (
        <path
          key={idx}
          d={d}
          fill={leafColor}
          fillOpacity={0.22 + (idx % 2) * 0.12}
          stroke={leafColor}
          strokeWidth="1"
          strokeOpacity="0.7"
        />
      ))}
      {/* Melati White Petals */}
      <g transform="translate(24 44)">
        <circle cx="0" cy="-6" r="4" fill="#FFFFFF" stroke={goldColor} strokeWidth="0.9" />
        <circle cx="5.7" cy="-1.8" r="4" fill="#FFFFFF" stroke={goldColor} strokeWidth="0.9" />
        <circle cx="3.5" cy="4.8" r="4" fill="#FFFFFF" stroke={goldColor} strokeWidth="0.9" />
        <circle cx="-3.5" cy="4.8" r="4" fill="#FFFFFF" stroke={goldColor} strokeWidth="0.9" />
        <circle cx="-5.7" cy="-1.8" r="4" fill="#FFFFFF" stroke={goldColor} strokeWidth="0.9" />
        <circle cx="0" cy="0" r="2.2" fill={goldColor} />
      </g>
      <g transform="translate(56 26) scale(0.75)">
        <circle cx="0" cy="-6" r="4" fill="#FFFFFF" stroke={goldColor} strokeWidth="0.9" />
        <circle cx="5.7" cy="-1.8" r="4" fill="#FFFFFF" stroke={goldColor} strokeWidth="0.9" />
        <circle cx="3.5" cy="4.8" r="4" fill="#FFFFFF" stroke={goldColor} strokeWidth="0.9" />
        <circle cx="-3.5" cy="4.8" r="4" fill="#FFFFFF" stroke={goldColor} strokeWidth="0.9" />
        <circle cx="-5.7" cy="-1.8" r="4" fill="#FFFFFF" stroke={goldColor} strokeWidth="0.9" />
        <circle cx="0" cy="0" r="2.2" fill={goldColor} />
      </g>
    </svg>
  );
}

export function BotanicalPeonyCorner({
  petalColor = "#FFFDFC",
  strokeColor = "#B87A88",
  leafColor = "#5E7C6B",
  flip = false,
  className = "",
}: {
  petalColor?: string;
  strokeColor?: string;
  leafColor?: string;
  flip?: boolean;
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 160 160"
      fill="none"
      className={className}
      style={flip ? { transform: "scale(-1, -1)" } : undefined}
      aria-hidden="true"
    >
      <path
        d="M8 122C26 88 64 52 126 18"
        stroke={leafColor}
        strokeWidth="1.2"
        strokeOpacity="0.6"
        strokeLinecap="round"
      />
      {[
        "M58 68C64 50 82 40 94 48C86 64 72 72 58 68Z",
        "M38 92C44 74 60 66 70 74C62 88 50 96 38 92Z",
        "M82 42C94 28 112 24 120 34C108 46 94 50 82 42Z",
      ].map((d, i) => (
        <path
          key={i}
          d={d}
          fill={leafColor}
          fillOpacity="0.2"
          stroke={leafColor}
          strokeWidth="0.9"
          strokeOpacity="0.65"
        />
      ))}
      {/* Sculptural Botanical Peony Blossom */}
      <g transform="translate(34 38)">
        <circle cx="0" cy="-13" r="10" fill={petalColor} stroke={strokeColor} strokeWidth="0.95" />
        <circle cx="12" cy="-4" r="10" fill={petalColor} stroke={strokeColor} strokeWidth="0.95" />
        <circle cx="8" cy="10" r="10" fill={petalColor} stroke={strokeColor} strokeWidth="0.95" />
        <circle cx="-8" cy="10" r="10" fill={petalColor} stroke={strokeColor} strokeWidth="0.95" />
        <circle cx="-12" cy="-4" r="10" fill={petalColor} stroke={strokeColor} strokeWidth="0.95" />
        <circle cx="0" cy="0" r="9" fill={petalColor} stroke={strokeColor} strokeWidth="1" />
        <circle cx="0" cy="0" r="3.5" fill={strokeColor} fillOpacity="0.55" />
      </g>
    </svg>
  );
}

export function HangingFernSprig({
  color = "#3F6B54",
  className = "",
}: {
  color?: string;
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 120 96"
      fill="none"
      className={`wedding-sway-gentle ${className}`}
      aria-hidden="true"
    >
      <path
        d="M60 0C59 24 57 52 46 86"
        stroke={color}
        strokeWidth="1.25"
        strokeOpacity="0.7"
        strokeLinecap="round"
      />
      {[
        "M58 18C44 16 32 22 28 30C42 32 52 28 58 18Z",
        "M57 34C42 34 30 42 26 52C40 50 51 44 57 34Z",
        "M54 52C40 54 30 62 28 72C40 69 49 62 54 52Z",
        "M59 22C74 20 86 26 90 34C76 36 66 32 59 22Z",
        "M58 40C72 40 84 48 87 58C73 56 64 50 58 40Z",
        "M54 58C68 60 76 68 78 76C66 73 58 67 54 58Z",
      ].map((d, idx) => (
        <path
          key={idx}
          d={d}
          fill={color}
          fillOpacity="0.22"
          stroke={color}
          strokeWidth="0.95"
          strokeOpacity="0.75"
        />
      ))}
    </svg>
  );
}

export function CelestialStarCorner({
  goldColor = "#D9B978",
  flip = false,
  className = "",
}: {
  goldColor?: string;
  flip?: boolean;
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 140 140"
      fill="none"
      className={className}
      style={flip ? { transform: "scale(-1, -1)" } : undefined}
      aria-hidden="true"
    >
      <path
        d="M12 128C14 68 68 14 128 12"
        stroke={goldColor}
        strokeWidth="0.85"
        strokeOpacity="0.55"
        strokeDasharray="3 4"
      />
      <path
        d="M28 112L54 64L96 38L124 22"
        stroke={goldColor}
        strokeWidth="0.8"
        strokeOpacity="0.45"
      />
      {/* 4-Point Stars */}
      <path
        d="M36 28L38.5 34.5L45 37L38.5 39.5L36 46L33.5 39.5L27 37L33.5 34.5L36 28Z"
        fill={goldColor}
        fillOpacity="0.85"
      />
      <path
        d="M84 18L85.8 22.2L90 24L85.8 25.8L84 30L82.2 25.8L78 24L82.2 22.2L84 18Z"
        fill={goldColor}
        fillOpacity="0.65"
      />
      <circle cx="54" cy="64" r="2" fill={goldColor} />
      <circle cx="96" cy="38" r="1.8" fill={goldColor} />
      <circle cx="24" cy="84" r="1.5" fill={goldColor} fillOpacity="0.75" />
    </svg>
  );
}

export function FloatingVinylDisc({
  playing,
  accentColor,
  onToggle,
}: {
  playing: boolean;
  accentColor: string;
  onToggle: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-label={playing ? "Jeda musik undangan" : "Putar musik undangan"}
      title={playing ? "Jeda musik" : "Putar musik"}
      className="fixed right-3.5 bottom-3.5 z-40 flex h-12 w-12 items-center justify-center rounded-full shadow-[0_8px_22px_rgba(0,0,0,0.34)] transition-transform hover:scale-105 active:scale-95 cursor-pointer"
    >
      {/* Spinning Vinyl Grooves */}
      <span
        className={`relative flex h-12 w-12 items-center justify-center rounded-full border border-white/25 bg-[#121417] ${
          playing ? "wedding-vinyl-spin" : ""
        }`}
      >
        <span className="absolute inset-1.5 rounded-full border border-white/10" />
        <span className="absolute inset-3 rounded-full border border-white/10" />
        <span
          className="flex h-6 w-6 items-center justify-center rounded-full text-white shadow-inner"
          style={{ backgroundColor: accentColor }}
        >
          {playing ? (
            <Pause className="h-2.5 w-2.5 fill-current" />
          ) : (
            <Play className="h-2.5 w-2.5 translate-x-[0.5px] fill-current" />
          )}
        </span>
      </span>

      {/* Tonearm Accent Needle */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute -top-0.5 right-0.5 h-5 w-1 origin-top rotate-[24deg] rounded-full shadow-xs"
        style={{ backgroundColor: "#E6C788" }}
      />
      <span
        aria-hidden="true"
        className="pointer-events-none absolute -top-1 right-0 h-2.5 w-2.5 rounded-full border border-black/30 bg-[#F5DEB0]"
      />
    </button>
  );
}
