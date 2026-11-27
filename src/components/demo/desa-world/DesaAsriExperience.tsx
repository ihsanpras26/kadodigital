"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { ArrowRight } from "lucide-react";
import type { ThemeItem } from "@/lib/schemas";
import {
  getDesaWorldPayload,
  type DesaMode,
  type DesaStationId,
  type DesaTimeOfDay,
  type DesaWishItem,
} from "@/data/desaWorldData";
import { DesaAudioEngine, type DesaMusicTrack } from "./audioEngine";
import {
  CozyDesaCanvas,
  type DesaCanvasHandle,
  type DesaCanvasPhase,
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

interface DesaAsriExperienceProps {
  theme: ThemeItem;
  mode: DesaMode;
}

const TIME_ORDER: DesaTimeOfDay[] = ["pagi", "sore", "malam"];

export function DesaAsriExperience({ theme, mode }: DesaAsriExperienceProps) {
  const searchParams = useSearchParams();
  const guestName = searchParams.get("to");
  const startOpened = searchParams.get("open") === "1";
  const heroShot = searchParams.get("shot") === "hero";

  const payload = useMemo(() => getDesaWorldPayload(mode), [mode]);
  const canvasRef = useRef<DesaCanvasHandle | null>(null);
  const audioRef = useRef<DesaAudioEngine | null>(null);

  const [phase, setPhase] = useState<DesaCanvasPhase>("loading");
  const [loadProgress, setLoadProgress] = useState(12);
  const [portraits, setPortraits] = useState<{ cewek: string; cowok: string } | null>(null);
  const [selectedGender, setSelectedGender] = useState<"cewek" | "cowok">("cewek");

  const [musicEnabled, setMusicEnabled] = useState(true);
  const [musicTrack, setMusicTrack] = useState<DesaMusicTrack>("senja");
  const [sfxEnabled, setSfxEnabled] = useState(true);
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

  const handleLoadProgress = useCallback(
    (pct: number) => {
      setLoadProgress(pct);
      if (pct >= 100) {
        window.setTimeout(() => {
          if (startOpened) {
            canvasRef.current?.enterWorld();
            setPhase("world");
            return;
          }
          setPhase((cur) => (cur === "loading" ? "cover" : cur));
        }, 150);
      }
    },
    [startOpened],
  );

  const handleSelectGender = useCallback((g: "cewek" | "cowok") => {
    setSelectedGender(g);
    audioRef.current?.playTap();
    canvasRef.current?.setPlayerGender(g);
  }, []);

  const handleStartCover = useCallback(() => {
    audioRef.current?.start();
    audioRef.current?.setMusicTrack(musicTrack);
    audioRef.current?.setMusicEnabled(musicEnabled);
    audioRef.current?.setSfxEnabled(sfxEnabled);
    audioRef.current?.setTimeOfDay(timeOfDay);
    audioRef.current?.playTap();
    setPhase("picking");
  }, [musicTrack, musicEnabled, sfxEnabled, timeOfDay]);

  const handleStartDroneIntro = useCallback(() => {
    audioRef.current?.start();
    audioRef.current?.setMusicTrack(musicTrack);
    audioRef.current?.setMusicEnabled(musicEnabled);
    audioRef.current?.setSfxEnabled(sfxEnabled);
    audioRef.current?.setTimeOfDay(timeOfDay);
    audioRef.current?.playTap();
    audioRef.current?.playDroneWhoosh();
    setPhase("intro");
    canvasRef.current?.startDroneIntro();
  }, [musicTrack, musicEnabled, sfxEnabled, timeOfDay]);

  const handleIntroComplete = useCallback(() => {
    audioRef.current?.playGateOpen();
    setPhase("world");
  }, []);

  const handleReplayIntro = useCallback(() => {
    setSettingsOpen(false);
    setMapOpen(false);
    setActiveStation(null);
    setActiveNpcId(null);
    audioRef.current?.playTap();
    audioRef.current?.playDroneWhoosh();
    setPhase("intro");
    canvasRef.current?.startDroneIntro();
  }, []);

  const handleToggleMusic = useCallback((next: boolean) => {
    setMusicEnabled(next);
    audioRef.current?.setMusicEnabled(next);
  }, []);

  const handleChangeMusicTrack = useCallback((track: DesaMusicTrack) => {
    setMusicTrack(track);
    audioRef.current?.playTap();
    audioRef.current?.setMusicTrack(track);
  }, []);

  const handleToggleSfx = useCallback((next: boolean) => {
    setSfxEnabled(next);
    audioRef.current?.setSfxEnabled(next);
    if (next) {
      audioRef.current?.playTap();
    }
  }, []);

  const handleChangeTimeOfDay = useCallback((t: DesaTimeOfDay) => {
    setTimeOfDay(t);
    audioRef.current?.playTap();
    audioRef.current?.setTimeOfDay(t);
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
      audioRef.current?.playModalOpen();
      setMapOpen(false);
      setActiveNpcId(null);
      setActiveStation(id);
      markVisited(id);
      canvasRef.current?.focusStation(id);
    },
    [markVisited],
  );

  const lastProximityKeyRef = useRef<string | null>(null);
  const handleProximityChange = useCallback(
    (
      target: Parameters<
        NonNullable<Parameters<typeof CozyDesaCanvas>[0]["onProximityChange"]>
      >[0],
    ) => {
      const nextKey = target ? `${target.kind}:${target.id}` : null;
      if (phase === "world" && nextKey && nextKey !== lastProximityKeyRef.current) {
        audioRef.current?.playProximityHover();
      }
      lastProximityKeyRef.current = nextKey;
      setProximity(target);
    },
    [phase],
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

  // Skip intro on Escape or Space
  useEffect(() => {
    if (phase !== "intro") return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" || e.key === " ") {
        e.preventDefault();
        canvasRef.current?.skipDroneIntro();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [phase]);

  // Global keyboard shortcuts inside the world (`J` = Buka Undangan, `M` = Denah)
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
      {/* Full-Viewport 3D Three.js World */}
      <CozyDesaCanvas
        ref={canvasRef}
        payload={payload}
        phase={phase}
        overlayOpen={Boolean(activeStation || settingsOpen || mapOpen)}
        heroShot={heroShot}
        visitedStations={visitedStations}
        onLoadProgress={handleLoadProgress}
        onReadyPortraits={setPortraits}
        onIntroComplete={handleIntroComplete}
        onSelectStation={handleOpenStation}
        onSelectNpc={handleOpenNpc}
        onProximityChange={handleProximityChange}
        onFootstep={(surface) => audioRef.current?.playFootstep(surface)}
        onRiverProximity={(c) => audioRef.current?.setRiverProximity(c)}
      />

      {/* Top-Right Settings Button during Cover / Picker */}
      {(phase === "cover" || phase === "picking") && (
        <button
          type="button"
          onClick={() => {
            audioRef.current?.playTap();
            setSettingsOpen((o) => !o);
          }}
          aria-label="Buka pengaturan"
          className="desa-icon-tile fixed right-3 top-3 z-40 flex h-11 w-11 items-center justify-center rounded-[14px] text-[#3E2B1E] sm:right-5 sm:top-5"
        >
          <VillageGearIcon className="h-5 w-5" />
        </button>
      )}

      {/* Preloader */}
      {phase === "loading" && (
        <DesaPreloader
          monogram={payload.monogram}
          title={payload.ui.preloaderTitle}
          subtitle={payload.ui.preloaderSubtitle}
          progress={loadProgress}
        />
      )}

      {/* Cover Card over live Aerial Drone Overview */}
      {phase === "cover" && (
        <DesaCoverSign
          payload={payload}
          guestName={guestName}
          onStart={handleStartCover}
        />
      )}

      {/* Avatar Picker */}
      {phase === "picking" && (
        <DesaAvatarPicker
          payload={payload}
          selectedGender={selectedGender}
          portraits={portraits}
          onSelectGender={handleSelectGender}
          onEnter={handleStartDroneIntro}
        />
      )}

      {/* Game-Style Cinematic Drone View Intro Overlay */}
      {phase === "intro" && (
        <div className="desa-intro-fade pointer-events-none fixed inset-0 z-30 flex flex-col justify-between">
          <div className="h-24 bg-gradient-to-b from-[#0E1812]/50 to-transparent" />
          <div className="flex items-end justify-between gap-4 bg-gradient-to-t from-[#0E1812]/72 via-[#0E1812]/32 to-transparent px-5 pb-6 pt-16 sm:px-8 sm:pb-8">
            <div className="min-w-0 text-[#FAF6EE]">
              <p className="text-[11px] font-semibold tracking-[0.2em] text-[#E6C78B] uppercase">
                {payload.ui.introEyebrow}
              </p>
              <h2 className="desa-display mt-1 text-3xl font-semibold tracking-tight sm:text-4xl">
                {payload.namesLine}
              </h2>
              <p className="mt-1 text-xs font-normal text-[#FAF6EE]/85 sm:text-sm">
                {payload.ui.introSubtitle}
              </p>
            </div>
            <button
              type="button"
              onClick={() => canvasRef.current?.skipDroneIntro()}
              className="pointer-events-auto inline-flex min-h-[42px] shrink-0 items-center gap-1.5 rounded-full border border-[#FAF6EE]/35 bg-[#192820]/78 px-4 py-2 text-xs font-semibold text-[#FAF6EE] backdrop-blur-md transition hover:bg-[#2A5C45]"
            >
              <span>Lewati</span>
              <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
            </button>
          </div>
        </div>
      )}

      {/* Interactive World HUD */}
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

      {/* Dialogue Box */}
      {phase === "world" && activeNpc && !activeStation && (
        <DesaDialogueBox
          npc={activeNpc}
          portraitSrc={activeNpcPortrait}
          message={activeNpcSpeech}
          onClose={() => setActiveNpcId(null)}
        />
      )}

      {/* Station Modal */}
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
          onClose={() => {
            audioRef.current?.playModalClose();
            setActiveStation(null);
          }}
        />
      )}

      {/* Settings Drawer */}
      {settingsOpen && (
        <DesaSettingsModal
          themeSlug={theme.slug}
          musicEnabled={musicEnabled}
          onToggleMusic={handleToggleMusic}
          musicTrack={musicTrack}
          onChangeMusicTrack={handleChangeMusicTrack}
          sfxEnabled={sfxEnabled}
          onToggleSfx={handleToggleSfx}
          timeOfDay={timeOfDay}
          onChangeTimeOfDay={handleChangeTimeOfDay}
          navSide={navSide}
          onChangeNavSide={setNavSide}
          navMode={navMode}
          onChangeNavMode={setNavMode}
          showVirtualPadOnDesktop={showVirtualPadOnDesktop}
          onToggleVirtualPadOnDesktop={setShowVirtualPadOnDesktop}
          onReplayIntro={phase === "world" ? handleReplayIntro : undefined}
          onClose={() => setSettingsOpen(false)}
        />
      )}

      {/* Subtle Bottom-Center Toast */}
      {toastMsg && (
        <div
          role="status"
          className="fixed bottom-4 left-1/2 z-50 -translate-x-1/2 rounded-[12px] border border-[#C8B490] bg-[#223027] px-4 py-2 text-xs font-semibold text-[#FAF6EE] shadow-xl"
        >
          {toastMsg}
        </div>
      )}
    </div>
  );
}
