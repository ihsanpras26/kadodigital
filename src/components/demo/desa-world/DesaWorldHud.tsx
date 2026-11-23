"use client";

import { useRef, useState } from "react";
import { ArrowDown, ArrowLeft, ArrowRight, ArrowUp, Check } from "lucide-react";
import type {
  DesaStationId,
  DesaTimeOfDay,
  DesaWorldPayload,
} from "@/data/desaWorldData";
import type { ProximityTarget } from "./CozyDesaCanvas";
import {
  VillageCloseIcon,
  VillageGearIcon,
  VillageJournalIcon,
  VillageMapIcon,
  VillageSoundIcon,
  VillageStationIcon,
  VillageTimeIcon,
} from "./DesaIcons";

interface DesaWorldHudProps {
  payload: DesaWorldPayload;
  timeOfDay: DesaTimeOfDay;
  musicEnabled: boolean;
  visitedStations: DesaStationId[];
  proximity: ProximityTarget | null;
  dialogueOpen: boolean;
  mapOpen: boolean;
  navSide: "left" | "right";
  navMode: "stick" | "dpad";
  showVirtualPadOnDesktop: boolean;
  onCycleTimeOfDay: () => void;
  onToggleMap: () => void;
  onCloseMap: () => void;
  onOpenJournal: (stationId?: DesaStationId) => void;
  onToggleMusic: () => void;
  onOpenSettings: () => void;
  onSelectNpc: (npcId: string) => void;
  onJoystickVector: (vec: { x: number; y: number }) => void;
  onTriggerBuka: () => void;
}

const TIME_LABELS: Record<DesaTimeOfDay, string> = {
  pagi: "Pagi",
  sore: "Sore",
  malam: "Malam",
};

export function DesaWorldHud({
  payload,
  timeOfDay,
  musicEnabled,
  visitedStations,
  proximity,
  dialogueOpen,
  mapOpen,
  navSide,
  navMode,
  showVirtualPadOnDesktop,
  onCycleTimeOfDay,
  onToggleMap,
  onCloseMap,
  onOpenJournal,
  onToggleMusic,
  onOpenSettings,
  onSelectNpc,
  onJoystickVector,
  onTriggerBuka,
}: DesaWorldHudProps) {
  const stickRef = useRef<HTMLDivElement | null>(null);
  const [knobOffset, setKnobOffset] = useState({ x: 0, y: 0 });
  const draggingRef = useRef(false);

  const maxRadius = 28;
  const visitedCount = visitedStations.length;
  const nextStation =
    payload.stations.find((st) => !visitedStations.includes(st.id)) ??
    payload.stations[0];

  const updateStickFromPointer = (clientX: number, clientY: number) => {
    const el = stickRef.current;
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
    setKnobOffset({ x: dx, y: dy });
    onJoystickVector({ x: dx / maxRadius, y: dy / maxRadius });
  };

  const resetStick = () => {
    draggingRef.current = false;
    setKnobOffset({ x: 0, y: 0 });
    onJoystickVector({ x: 0, y: 0 });
  };

  const padVisibilityClass = showVirtualPadOnDesktop ? "flex" : "flex md:hidden";

  const virtualPad = (
    <div className={`${padVisibilityClass} items-center justify-center`}>
      {navMode === "stick" ? (
        <div
          ref={stickRef}
          onPointerDown={(e) => {
            draggingRef.current = true;
            e.currentTarget.setPointerCapture(e.pointerId);
            updateStickFromPointer(e.clientX, e.clientY);
          }}
          onPointerMove={(e) => {
            if (!draggingRef.current) return;
            updateStickFromPointer(e.clientX, e.clientY);
          }}
          onPointerUp={resetStick}
          onPointerCancel={resetStick}
          className="relative flex h-20 w-20 touch-none items-center justify-center rounded-full border-2 border-[#B79B74] bg-[#F7F1E3]/88 shadow-md"
          aria-label="Joystick gerak karakter"
        >
          <div
            className="h-9 w-9 rounded-full border-2 border-[#8C6D46] bg-[#EFE5CE] shadow-sm transition-transform duration-75"
            style={{
              transform: `translate3d(${knobOffset.x}px, ${knobOffset.y}px, 0)`,
            }}
          />
        </div>
      ) : (
        <div className="grid h-24 w-24 grid-cols-3 grid-rows-3 gap-1 rounded-[16px] border-2 border-[#B79B74] bg-[#F7F1E3]/92 p-1 shadow-md">
          <div />
          <button
            type="button"
            aria-label="Jalan maju"
            onPointerDown={() => onJoystickVector({ x: 0, y: -1 })}
            onPointerUp={() => onJoystickVector({ x: 0, y: 0 })}
            onPointerLeave={() => onJoystickVector({ x: 0, y: 0 })}
            className="flex items-center justify-center rounded-md bg-[#EFE5CE] text-[#3E2B1E] active:bg-[#2A5C45] active:text-white"
          >
            <ArrowUp className="h-3.5 w-3.5" />
          </button>
          <div />
          <button
            type="button"
            aria-label="Jalan kiri"
            onPointerDown={() => onJoystickVector({ x: -1, y: 0 })}
            onPointerUp={() => onJoystickVector({ x: 0, y: 0 })}
            onPointerLeave={() => onJoystickVector({ x: 0, y: 0 })}
            className="flex items-center justify-center rounded-md bg-[#EFE5CE] text-[#3E2B1E] active:bg-[#2A5C45] active:text-white"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
          </button>
          <div className="rounded-full bg-[#B79B74]/30" />
          <button
            type="button"
            aria-label="Jalan kanan"
            onPointerDown={() => onJoystickVector({ x: 1, y: 0 })}
            onPointerUp={() => onJoystickVector({ x: 0, y: 0 })}
            onPointerLeave={() => onJoystickVector({ x: 0, y: 0 })}
            className="flex items-center justify-center rounded-md bg-[#EFE5CE] text-[#3E2B1E] active:bg-[#2A5C45] active:text-white"
          >
            <ArrowRight className="h-3.5 w-3.5" />
          </button>
          <div />
          <button
            type="button"
            aria-label="Jalan mundur"
            onPointerDown={() => onJoystickVector({ x: 0, y: 1 })}
            onPointerUp={() => onJoystickVector({ x: 0, y: 0 })}
            onPointerLeave={() => onJoystickVector({ x: 0, y: 0 })}
            className="flex items-center justify-center rounded-md bg-[#EFE5CE] text-[#3E2B1E] active:bg-[#2A5C45] active:text-white"
          >
            <ArrowDown className="h-3.5 w-3.5" />
          </button>
          <div />
        </div>
      )}
    </div>
  );

  return (
    <div className="pointer-events-none fixed inset-0 z-30">
      {/* TOP BAR: Woven Ivory Status Pill (Left) + 4 Game Action Tiles (Right) */}
      <div className="flex items-start justify-between gap-2 p-3 sm:p-5">
        {/* Top-Left: Coral-Island style Woven Bamboo Status Pill */}
        <div className="desa-woven-pill pointer-events-auto flex max-w-[168px] items-center gap-2.5 rounded-full border-[3px] border-[#B79B74] p-1 pr-3.5 sm:max-w-[300px] sm:gap-3 sm:p-1.5 sm:pr-5">
          <button
            type="button"
            onClick={onCycleTimeOfDay}
            title={`Suasana ${TIME_LABELS[timeOfDay]} (ketuk untuk ganti)`}
            aria-label={`Suasana ${TIME_LABELS[timeOfDay]}, ketuk untuk ganti waktu desa`}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 border-[#C8B28E] bg-[#EFE5CE] text-[#AD4B2C] transition hover:bg-[#E7D8B6] sm:h-11 sm:w-11"
          >
            <VillageTimeIcon time={timeOfDay} className="h-5 w-5" />
          </button>
          <div className="min-w-0 text-left">
            <p className="truncate text-[10px] font-bold text-[#5C4633] sm:text-xs">
              {TIME_LABELS[timeOfDay]} · {payload.shortDateLabel}
            </p>
            <p className="truncate text-sm font-extrabold leading-tight text-[#3E2B1E] sm:text-base">
              {payload.namesLine}
            </p>
          </div>
        </div>

        {/* Top-Right: 4 Rounded-Square Game Icon Tiles */}
        <div className="pointer-events-auto flex items-center gap-1.5 sm:gap-2.5">
          <button
            type="button"
            onClick={onToggleMap}
            aria-label="Buka peta lokasi desa"
            aria-expanded={mapOpen}
            className={`desa-icon-tile flex h-11 w-11 items-center justify-center rounded-[14px] text-[#3E2B1E] ${
              mapOpen ? "ring-2 ring-[#2A5C45]" : ""
            }`}
          >
            <VillageMapIcon className="h-5 w-5" />
          </button>

          <button
            type="button"
            onClick={() => onOpenJournal()}
            aria-label={`Buka Jurnal Desa (${visitedCount} dari 6 sudut dikunjungi)`}
            className="desa-icon-tile relative flex h-11 w-11 items-center justify-center rounded-[14px] text-[#3E2B1E]"
          >
            <VillageJournalIcon className="h-5 w-5" />
            <span className="absolute -bottom-1.5 -right-1.5 rounded-full border border-[#F7F1E3] bg-[#2A5C45] px-1.5 py-0.5 text-[9px] font-extrabold leading-none text-white tabular-nums">
              {visitedCount}/6
            </span>
          </button>

          <button
            type="button"
            onClick={onToggleMusic}
            aria-label={musicEnabled ? "Matikan musik latar" : "Nyalakan musik latar"}
            aria-pressed={musicEnabled}
            className="desa-icon-tile flex h-11 w-11 items-center justify-center rounded-[14px] text-[#3E2B1E]"
          >
            <VillageSoundIcon muted={!musicEnabled} className="h-5 w-5" />
          </button>

          <button
            type="button"
            onClick={onOpenSettings}
            aria-label="Buka pengaturan desa"
            className="desa-icon-tile flex h-11 w-11 items-center justify-center rounded-[14px] text-[#3E2B1E]"
          >
            <VillageGearIcon className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* PETA LOKASI DESA FAST-TRAVEL POPOVER */}
      {mapOpen && (
        <div
          className="pointer-events-auto fixed right-3 top-16 z-40 w-[min(92vw,340px)] rounded-[20px] border-2 border-[#B79B74] bg-[#F7F1E3] p-4 shadow-[0_18px_42px_rgba(24,18,12,0.28)] sm:right-5 sm:top-20"
          role="dialog"
          aria-label="Peta Lokasi Desa"
        >
          <div className="flex items-center justify-between border-b border-[#DED0B6] pb-2.5">
            <div>
              <h3 className="text-sm font-extrabold text-[#3E2B1E]">
                Peta Lokasi Desa
              </h3>
              <p className="text-[11px] font-semibold text-[#5C4633]">
                Ketuk salah satu sudut untuk langsung berkunjung.
              </p>
            </div>
            <button
              type="button"
              onClick={onCloseMap}
              aria-label="Tutup peta lokasi"
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#C8B28E] bg-[#EFE5CE] text-[#3E2B1E] hover:bg-[#E4D4B5]"
            >
              <VillageCloseIcon className="h-4 w-4" />
            </button>
          </div>

          <div className="mt-3 grid grid-cols-1 gap-1.5">
            {payload.stations.map((st, idx) => {
              const visited = visitedStations.includes(st.id);
              return (
                <button
                  key={st.id}
                  type="button"
                  onClick={() => {
                    onCloseMap();
                    onOpenJournal(st.id);
                  }}
                  className="flex items-center justify-between rounded-[12px] border border-[#DFD1B7] bg-[#FFFBF2] px-3 py-2 text-left transition hover:border-[#2A5C45] hover:bg-[#EBF4EE]"
                >
                  <div className="flex items-center gap-2.5">
                    <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#EFE5CE] text-[#3E2B1E]">
                      <VillageStationIcon id={st.id} className="h-4 w-4" />
                    </span>
                    <div>
                      <p className="text-xs font-extrabold text-[#3E2B1E]">
                        {idx + 1}. {st.markerLabel}
                      </p>
                      <p className="text-[10px] font-semibold text-[#5C4633]">
                        {st.dockLabel}
                      </p>
                    </div>
                  </div>
                  {visited ? (
                    <span className="inline-flex items-center gap-1 rounded-full bg-[#E3EFE8] px-2 py-0.5 text-[10px] font-extrabold text-[#2A5C45]">
                      <Check className="h-3 w-3 stroke-[3]" />
                      Dibuka
                    </span>
                  ) : (
                    <span className="text-[11px] font-extrabold text-[#AD4B2C]">
                      Kunjungi
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          <div className="mt-3 border-t border-[#DED0B6] pt-2.5">
            <p className="text-[10px] font-extrabold tracking-wider text-[#6E5541] uppercase">
              Sapa Warga Desa
            </p>
            <div className="mt-1.5 flex flex-wrap gap-1.5">
              {payload.npcs.map((npc) => (
                <button
                  key={npc.id}
                  type="button"
                  onClick={() => {
                    onCloseMap();
                    onSelectNpc(npc.id);
                  }}
                  className="rounded-full border border-[#C8B28E] bg-[#EFE5CE] px-2.5 py-1 text-[11px] font-bold text-[#3E2B1E] hover:border-[#2A5C45] hover:bg-[#E3EFE8]"
                >
                  {npc.name.split(" ")[0]}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* BOTTOM-LEFT: Jejak Desa Quest Tracker + Virtual Pad (on mobile / when enabled) */}
      <div
        className={`pointer-events-auto fixed bottom-3 flex flex-col gap-2 sm:bottom-5 ${
          navSide === "left"
            ? "left-3 items-start sm:left-5"
            : "right-3 items-end sm:right-5"
        }`}
      >
        {virtualPad}

        <div className="w-[158px] rounded-[16px] border-2 border-[#B79B74] bg-[#F7F1E3]/96 px-3 py-2 shadow-[0_10px_24px_rgba(24,18,12,0.22)] sm:w-[244px] sm:px-3.5 sm:py-2.5">
          <div className="flex items-center justify-between gap-1.5">
            <span className="text-[11px] font-extrabold text-[#3E2B1E] sm:text-xs">
              Jejak Desa
            </span>
            <span className="text-[11px] font-extrabold text-[#2A5C45] tabular-nums">
              {visitedCount}/6
            </span>
          </div>
          <p className="mt-0.5 hidden text-[11px] font-semibold text-[#5C4633] sm:block">
            {visitedCount}/6 sudut dikunjungi
          </p>
          <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-[#E1D4BC]">
            <div
              className="h-full rounded-full bg-[#2A5C45] transition-all duration-300"
              style={{ width: `${(visitedCount / 6) * 100}%` }}
            />
          </div>
          {visitedCount < 6 ? (
            <button
              type="button"
              onClick={() => onOpenJournal(nextStation.id)}
              className="mt-1.5 block w-full truncate text-left text-[11px] font-extrabold text-[#2A5C45] hover:underline sm:mt-2 sm:text-xs"
            >
              · Dekati {nextStation.markerLabel}
            </button>
          ) : (
            <button
              type="button"
              onClick={() => onOpenJournal()}
              className="mt-1.5 block w-full text-left text-[11px] font-extrabold text-[#AD4B2C] hover:underline sm:mt-2 sm:text-xs"
            >
              · Semua sudut selesai
            </button>
          )}
        </div>
      </div>

      {/* BOTTOM-RIGHT: Contextual Keycap Action Prompt */}
      <div
        className={`pointer-events-auto fixed z-30 transition-all ${
          navSide === "left"
            ? "right-3 sm:right-5"
            : "left-3 sm:left-5"
        } ${
          dialogueOpen
            ? "bottom-[164px] sm:bottom-[170px]"
            : "bottom-3 sm:bottom-5"
        }`}
      >
        {proximity ? (
          <button
            type="button"
            onClick={onTriggerBuka}
            className="flex min-h-[44px] max-w-[196px] items-center gap-2 rounded-[12px] border-2 border-[#B79B74] bg-[#223027] px-3 py-2 text-xs font-extrabold text-[#F7F1E3] shadow-lg transition hover:bg-[#2A5C45] sm:max-w-none sm:px-3.5"
          >
            <kbd className="shrink-0 rounded-md bg-[#AD4B2C] px-1.5 py-0.5 text-[11px] font-extrabold text-white">
              E
            </kbd>
            <span className="truncate">Buka {proximity.label}</span>
          </button>
        ) : (
          <button
            type="button"
            onClick={() => onOpenJournal()}
            className="flex min-h-[44px] max-w-[196px] items-center gap-2 rounded-[12px] border-2 border-[#B79B74] bg-[#223027]/94 px-3 py-2 text-xs font-extrabold text-[#F7F1E3] shadow-lg transition hover:bg-[#2A5C45] sm:max-w-none sm:px-3.5"
          >
            <kbd className="shrink-0 rounded-md bg-[#2A5C45] px-1.5 py-0.5 text-[11px] font-extrabold text-white">
              J
            </kbd>
            <span className="truncate">Buka Jurnal Desa</span>
          </button>
        )}
      </div>
    </div>
  );
}
