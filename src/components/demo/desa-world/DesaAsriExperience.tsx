"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import type { ThemeItem } from "@/lib/schemas";
import {
  getDesaWorldPayload,
  type DesaMode,
  type DesaStationId,
  type DesaTimeOfDay,
  type DesaWishItem,
} from "@/data/desaWorldData";
import { DesaAudioEngine } from "./audioEngine";
import {
  CozyDesaCanvas,
  type DesaCanvasHandle,
  type ProximityTarget,
} from "./CozyDesaCanvas";
import { DesaPreloader } from "./DesaPreloader";
import { DesaCoverSign } from "./DesaCoverSign";
import { DesaAvatarPicker } from "./DesaAvatarPicker";
import { DesaWorldHud } from "./DesaWorldHud";
import { DesaDialogueBox } from "./DesaDialogueBox";
import { DesaSettingsModal } from "./DesaSettingsModal";
import { DesaStationModal } from "./DesaStationModal";
import { VillageGearIcon } from "./DesaIcons";

type DesaPhase = "loading" | "cover" | "picking" | "world";

interface DesaAsriExperienceProps {
  theme: ThemeItem;
  mode: DesaMode;
}

const TIME_ORDER: DesaTimeOfDay[] = ["pagi", "sore", "malam"];

export function DesaAsriExperience({ theme, mode }: DesaAsriExperienceProps) {
  const searchParams = useSearchParams();
  const guestName = searchParams.get("to");

  const payload = useMemo(() => getDesaWorldPayload(mode), [mode]);
  const canvasRef = useRef<DesaCanvasHandle | null>(null);
  const audioRef = useRef<DesaAudioEngine | null>(null);

  const [phase, setPhase] = useState<DesaPhase>("loading");
  const [loadProgress, setLoadProgress] = useState(12);
  const [portraits, setPortraits] = useState<{ cewek: string; cowok: string } | null>(null);
  const [selectedGender, setSelectedGender] = useState<"cewek" | "cowok">("cewek");

  const [musicEnabled, setMusicEnabled] = useState(true);
  const [timeOfDay, setTimeOfDay] = useState<DesaTimeOfDay>("sore");
  const [navSide, setNavSide] = useState<"left" | "right">("left");
  const [navMode, setNavMode] = useState<"stick" | "dpad">("stick");
  const [showVirtualPadOnDesktop, setShowVirtualPadOnDesktop] = useState(false);

  const [settingsOpen, setSettingsOpen] = useState(false);
  const [mapOpen, setMapOpen] = useState(false);
  const [activeStation, setActiveStation] = useState<DesaStationId | null>(null);
  const [visitedStations, setVisitedStations] = useState<DesaStationId[]>([]);
  const [activeNpcId, setActiveNpcId] = useState<string | null>(null);
  const [proximity, setProximity] = useState<ProximityTarget | null>(null);

  const [wishes, setWishes] = useState<DesaWishItem[]>(payload.initialWishes);
  const [latestGuestWishText, setLatestGuestWishText] = useState<string | null>(null);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  useEffect(() => {
    const engine = new DesaAudioEngine();
    audioRef.current = engine;
    return () => {
      engine.dispose();
      audioRef.current = null;
    };
  }, []);

  const showToast = useCallback((msg: string) => {
    setToastMsg(msg);
  }, []);

  useEffect(() => {
    if (!toastMsg) return;
    const t = window.setTimeout(() => setToastMsg(null), 2600);
    return () => window.clearTimeout(t);
  }, [toastMsg]);

  const handleLoadProgress = useCallback((pct: number) => {
    setLoadProgress(pct);
    if (pct >= 100) {
      window.setTimeout(() => {
        setPhase((cur) => (cur === "loading" ? "cover" : cur));
      }, 150);
    }
  }, []);

  const handleSelectGender = useCallback((g: "cewek" | "cowok") => {
    setSelectedGender(g);
    audioRef.current?.playTap();
    canvasRef.current?.setPlayerGender(g);
  }, []);

  const handleEnterWorld = useCallback(() => {
    audioRef.current?.start();
    audioRef.current?.setEnabled(musicEnabled);
    audioRef.current?.playGateOpen();
    setPhase("world");
    canvasRef.current?.enterWorld();
  }, [musicEnabled]);

  const handleToggleMusic = useCallback((next: boolean) => {
    setMusicEnabled(next);
    audioRef.current?.setEnabled(next);
  }, []);

  const handleChangeTimeOfDay = useCallback((t: DesaTimeOfDay) => {
    setTimeOfDay(t);
    audioRef.current?.playTap();
    canvasRef.current?.setTimeOfDay(t);
  }, []);

  const handleCycleTimeOfDay = useCallback(() => {
    const idx = TIME_ORDER.indexOf(timeOfDay);
    const next = TIME_ORDER[(idx + 1) % TIME_ORDER.length];
    handleChangeTimeOfDay(next);
  }, [timeOfDay, handleChangeTimeOfDay]);

  const markVisited = useCallback((id: DesaStationId) => {
    setVisitedStations((prev) => (prev.includes(id) ? prev : [...prev, id]));
  }, []);

  const handleOpenStation = useCallback(
    (id: DesaStationId) => {
      audioRef.current?.playTap();
      setMapOpen(false);
      setActiveNpcId(null);
      setActiveStation(id);
      markVisited(id);
      canvasRef.current?.focusStation(id);
    },
    [markVisited],
  );

  const handleOpenJournal = useCallback(
    (stationId?: DesaStationId) => {
      const target =
        stationId ??
        payload.stations.find((st) => !visitedStations.includes(st.id))?.id ??
        payload.stations[0].id;
      handleOpenStation(target);
    },
    [handleOpenStation, payload.stations, visitedStations],
  );

  const handleOpenNpc = useCallback((npcId: string) => {
    audioRef.current?.playDialogueBlip();
    setMapOpen(false);
    setActiveStation(null);
    setActiveNpcId(npcId);
  }, []);

  const handleAddWish = useCallback(
    (wish: Omit<DesaWishItem, "id" | "createdAt">) => {
      const created: DesaWishItem = {
        ...wish,
        id: `wish-${Date.now()}`,
        createdAt: "Baru saja",
      };
      setWishes((prev) => [created, ...prev]);
      setLatestGuestWishText(`Pesan terbaru dari ${created.name}: "${created.message}"`);
    },
    [],
  );

  // Global keyboard shortcuts inside the village world (`J` = Jurnal, `M` = Peta)
  useEffect(() => {
    if (phase !== "world") return;
    const onKey = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement | null)?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") return;
      const k = e.key.toLowerCase();
      if (k === "j") {
        e.preventDefault();
        if (activeStation) {
          setActiveStation(null);
        } else {
          handleOpenJournal();
        }
      } else if (k === "m") {
        e.preventDefault();
        setMapOpen((o) => !o);
      } else if (k === "escape" && mapOpen) {
        setMapOpen(false);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [phase, activeStation, mapOpen, handleOpenJournal]);

  const activeNpc = useMemo(
    () => payload.npcs.find((n) => n.id === activeNpcId) ?? null,
    [payload.npcs, activeNpcId],
  );

  const activeNpcSpeech = useMemo(() => {
    if (!activeNpc) return "";
    if (activeNpc.id === payload.npcs[0]?.id && latestGuestWishText) {
      return latestGuestWishText;
    }
    return activeNpc.defaultWish;
  }, [activeNpc, payload.npcs, latestGuestWishText]);

  const activeNpcPortrait = activeNpc
    ? activeNpc.gender === "cewek"
      ? portraits?.cewek
      : portraits?.cowok
    : undefined;

  return (
    <div
      data-desa-world={theme.slug}
      className="relative h-[100dvh] w-screen overflow-hidden"
    >
      {/* Full-Viewport 3D Three.js Village World */}
      <CozyDesaCanvas
        ref={canvasRef}
        payload={payload}
        inWorld={phase === "world"}
        overlayOpen={Boolean(activeStation || settingsOpen || mapOpen)}
        visitedStations={visitedStations}
        onLoadProgress={handleLoadProgress}
        onReadyPortraits={setPortraits}
        onSelectStation={handleOpenStation}
        onSelectNpc={handleOpenNpc}
        onProximityChange={setProximity}
      />

      {/* Top-Right Compact Settings Button ONLY during Cover / Picker (World HUD has full 4-tile cluster) */}
      {(phase === "cover" || phase === "picking") && (
        <button
          type="button"
          onClick={() => {
            audioRef.current?.playTap();
            setSettingsOpen((o) => !o);
          }}
          aria-label="Buka pengaturan desa"
          className="desa-icon-tile fixed right-3 top-3 z-40 flex h-11 w-11 items-center justify-center rounded-[14px] text-[#3E2B1E] sm:right-5 sm:top-5"
        >
          <VillageGearIcon className="h-5 w-5" />
        </button>
      )}

      {/* Preloader */}
      {phase === "loading" && (
        <DesaPreloader monogram={payload.monogram} progress={loadProgress} />
      )}

      {/* Opsi 1 Cover Card */}
      {phase === "cover" && (
        <DesaCoverSign
          payload={payload}
          guestName={guestName}
          onStart={() => {
            audioRef.current?.playTap();
            setPhase("picking");
          }}
        />
      )}

      {/* Opsi 1 Avatar Picker */}
      {phase === "picking" && (
        <DesaAvatarPicker
          selectedGender={selectedGender}
          portraits={portraits}
          onSelectGender={handleSelectGender}
          onEnter={handleEnterWorld}
        />
      )}

      {/* Opsi 1 Anyaman & Jurnal Desa HUD */}
      {phase === "world" && (
        <DesaWorldHud
          payload={payload}
          timeOfDay={timeOfDay}
          musicEnabled={musicEnabled}
          visitedStations={visitedStations}
          proximity={proximity}
          dialogueOpen={Boolean(activeNpc)}
          mapOpen={mapOpen}
          navSide={navSide}
          navMode={navMode}
          showVirtualPadOnDesktop={showVirtualPadOnDesktop}
          onCycleTimeOfDay={handleCycleTimeOfDay}
          onToggleMap={() => {
            audioRef.current?.playTap();
            setMapOpen((o) => !o);
          }}
          onCloseMap={() => setMapOpen(false)}
          onOpenJournal={handleOpenJournal}
          onToggleMusic={() => handleToggleMusic(!musicEnabled)}
          onOpenSettings={() => {
            audioRef.current?.playTap();
            setMapOpen(false);
            setSettingsOpen(true);
          }}
          onSelectNpc={handleOpenNpc}
          onJoystickVector={(vec) => canvasRef.current?.setJoystickVector(vec)}
          onTriggerBuka={() => canvasRef.current?.triggerNearestInteraction()}
        />
      )}

      {/* Opsi 1 Bottom-Right Chibi Portrait RPG Dialogue */}
      {phase === "world" && activeNpc && !activeStation && (
        <DesaDialogueBox
          npc={activeNpc}
          portraitSrc={activeNpcPortrait}
          message={activeNpcSpeech}
          onClose={() => setActiveNpcId(null)}
        />
      )}

      {/* Opsi 1 Tabbed Jurnal Desa Modal */}
      {phase === "world" && activeStation && (
        <DesaStationModal
          stationId={activeStation}
          visitedStations={visitedStations}
          payload={payload}
          guestName={guestName}
          wishes={wishes}
          audioEngine={audioRef.current}
          onSelectStation={handleOpenStation}
          onAddWish={handleAddWish}
          onToast={showToast}
          onClose={() => setActiveStation(null)}
        />
      )}

      {/* Settings Drawer */}
      {settingsOpen && (
        <DesaSettingsModal
          themeSlug={theme.slug}
          musicEnabled={musicEnabled}
          onToggleMusic={handleToggleMusic}
          timeOfDay={timeOfDay}
          onChangeTimeOfDay={handleChangeTimeOfDay}
          navSide={navSide}
          onChangeNavSide={setNavSide}
          navMode={navMode}
          onChangeNavMode={setNavMode}
          showVirtualPadOnDesktop={showVirtualPadOnDesktop}
          onToggleVirtualPadOnDesktop={setShowVirtualPadOnDesktop}
          onClose={() => setSettingsOpen(false)}
        />
      )}

      {/* Subtle Bottom-Center Toast */}
      {toastMsg && (
        <div
          role="status"
          className="fixed bottom-4 left-1/2 z-50 -translate-x-1/2 rounded-[12px] border border-[#B79B74] bg-[#223027] px-4 py-2 text-xs font-extrabold text-[#F7F1E3] shadow-xl"
        >
          {toastMsg}
        </div>
      )}
    </div>
  );
}
