"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  ArrowLeft,
  Compass,
  Gamepad2,
  Moon,
  Music2,
  SlidersHorizontal,
  Sparkles,
  Sun,
  Volume2,
  VolumeX,
} from "lucide-react";
import type { ThemeItem } from "@/lib/schemas";
import {
  CELESTIAL_NPCS,
  CELESTIAL_STATIONS,
  getCelestialPayload,
  type CelestialAtmosphere,
  type CelestialStationId,
  type CelestialWishItem,
} from "./celestialData";
import {
  decodeWeddingOverrides,
  readableCoupleFromSlug,
  type CelestialWeddingOverrides,
} from "./celestialShareCodec";
import {
  CelestialAudioEngine,
  type CelestialMusicTrack,
} from "./celestialAudioEngine";
import {
  CelestialSceneCanvas,
  type CelestialCanvasHandle,
  type CelestialProximityTarget,
} from "./CelestialSceneCanvas";
import { CelestialAvatarPicker } from "./CelestialAvatarPicker";
import { CelestialCoverGate } from "./CelestialCoverGate";
import { CelestialDialogueBox } from "./CelestialDialogueBox";
import { CelestialJoystick } from "./CelestialJoystick";
import { CelestialStationModal } from "./CelestialStationModal";
import { PersonalizeWeddingDrawer } from "./PersonalizeWeddingDrawer";

interface CelestialWeddingExperienceProps {
  theme: ThemeItem;
  exclusiveMode?: boolean;
  slugHint?: string;
}

const ATMOSPHERE_ORDER: CelestialAtmosphere[] = ["malam", "senja", "aurora"];
const ATMOSPHERE_LABEL: Record<CelestialAtmosphere, string> = {
  malam: "Malam",
  senja: "Senja",
  aurora: "Aurora",
};

export function CelestialWeddingExperience({
  theme,
  exclusiveMode = false,
  slugHint,
}: CelestialWeddingExperienceProps) {
  const searchParams = useSearchParams();
  const initialGuest = searchParams.get("to") ?? "";
  const gToken = searchParams.get("g");

  const initialOverrides = useMemo<CelestialWeddingOverrides>(() => {
    const decoded = decodeWeddingOverrides(gToken);
    if (slugHint && !decoded.groomName && !decoded.brideName) {
      const couple = readableCoupleFromSlug(slugHint);
      const parts = couple.split("&").map((s) => s.trim());
      if (parts[0] && parts[1]) {
        decoded.groomName = parts[0];
        decoded.brideName = parts[1];
      }
    }
    return decoded;
  }, [gToken, slugHint]);

  const [overrides, setOverrides] =
    useState<CelestialWeddingOverrides>(initialOverrides);
  const [guestName, setGuestName] = useState(initialGuest);

  const payload = useMemo(() => getCelestialPayload(overrides), [overrides]);
  const photoUrls = useMemo(
    () => payload.photos.map((p) => p.src),
    [payload.photos],
  );

  const canvasRef = useRef<CelestialCanvasHandle | null>(null);
  const audioRef = useRef<CelestialAudioEngine | null>(null);

  const [phase, setPhase] = useState<"cover" | "picking" | "intro" | "world">(
    "cover",
  );
  const [portraits, setPortraits] = useState<{
    cewek: string;
    cowok: string;
  } | null>(null);
  const [selectedGender, setSelectedGender] = useState<"cewek" | "cowok">(
    "cewek",
  );

  const [atmosphere, setAtmosphere] = useState<CelestialAtmosphere>(
    payload.atmosphere,
  );
  const [musicEnabled, setMusicEnabled] = useState(true);
  const [sfxEnabled, setSfxEnabled] = useState(true);
  const [musicTrack, setMusicTrack] = useState<CelestialMusicTrack>("harpa");

  const [activeStation, setActiveStation] = useState<CelestialStationId | null>(
    null,
  );
  const [activeNpcId, setActiveNpcId] = useState<string | null>(null);
  const [proximity, setProximity] = useState<CelestialProximityTarget | null>(
    null,
  );
  const [visitedStations, setVisitedStations] = useState<CelestialStationId[]>(
    [],
  );
  const [wishes, setWishes] = useState<CelestialWishItem[]>(
    payload.initialWishes,
  );
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [hasMoved, setHasMoved] = useState(false);
  const [showPadDesktop, setShowPadDesktop] = useState(false);
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const engine = new CelestialAudioEngine();
    audioRef.current = engine;
    return () => {
      engine.dispose();
      audioRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mq.matches);
    const handler = () => setReducedMotion(mq.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  useEffect(() => {
    if (!toastMsg) return;
    const t = window.setTimeout(() => setToastMsg(null), 2600);
    return () => window.clearTimeout(t);
  }, [toastMsg]);

  const overlayOpen =
    Boolean(activeStation) || Boolean(activeNpcId) || drawerOpen;

  useEffect(() => {
    if (phase !== "world" || overlayOpen) return;
    const onKey = (e: KeyboardEvent) => {
      const tag = document.activeElement?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") return;
      if (e.code === "KeyE" || e.code === "Enter") {
        if (proximity) {
          e.preventDefault();
          canvasRef.current?.triggerNearestInteraction();
        }
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [phase, overlayOpen, proximity]);

  const notify = useCallback((msg: string) => {
    setToastMsg(msg);
  }, []);

  const handleOpenPicker = useCallback(() => {
    audioRef.current?.start();
    audioRef.current?.setMusicEnabled(musicEnabled);
    audioRef.current?.setSfxEnabled(sfxEnabled);
    audioRef.current?.setTrack(musicTrack);
    audioRef.current?.playTap();
    setPhase("picking");
  }, [musicEnabled, sfxEnabled, musicTrack]);

  const handleSelectGender = useCallback((gender: "cewek" | "cowok") => {
    setSelectedGender(gender);
    audioRef.current?.playTap();
    canvasRef.current?.setPlayerGender(gender);
  }, []);

  const handleStartFlight = useCallback(() => {
    audioRef.current?.start();
    audioRef.current?.setMusicEnabled(musicEnabled);
    audioRef.current?.setSfxEnabled(sfxEnabled);
    audioRef.current?.setTrack(musicTrack);
    audioRef.current?.playGateChime();
    setPhase("intro");
    canvasRef.current?.startDroneIntro();
  }, [musicEnabled, sfxEnabled, musicTrack]);

  const handleEnterDirect = useCallback(() => {
    audioRef.current?.start();
    audioRef.current?.setMusicEnabled(musicEnabled);
    audioRef.current?.setSfxEnabled(sfxEnabled);
    audioRef.current?.setTrack(musicTrack);
    audioRef.current?.playTap();
    canvasRef.current?.skipIntro();
    setPhase("world");
  }, [musicEnabled, sfxEnabled, musicTrack]);

  const handleIntroComplete = useCallback(() => {
    setPhase("world");
  }, []);

  const handleSkipIntro = useCallback(() => {
    audioRef.current?.playTap();
    canvasRef.current?.skipIntro();
    setPhase("world");
  }, []);

  const handleReplayIntro = useCallback(() => {
    setActiveStation(null);
    setActiveNpcId(null);
    canvasRef.current?.focusStation(null);
    audioRef.current?.playGateChime();
    setPhase("intro");
    canvasRef.current?.startDroneIntro();
  }, []);

  const handleSelectStationFromDock = useCallback(
    (stationId: CelestialStationId) => {
      audioRef.current?.playIslandGlide();
      setActiveNpcId(null);
      canvasRef.current?.teleportNearStation(stationId);
      setActiveStation(stationId);
      setVisitedStations((prev) =>
        prev.includes(stationId) ? prev : [...prev, stationId],
      );
      canvasRef.current?.focusStation(stationId);
    },
    [],
  );

  const handleSelectStationFromWorld = useCallback(
    (stationId: CelestialStationId) => {
      audioRef.current?.playIslandGlide();
      setActiveNpcId(null);
      setActiveStation(stationId);
      setVisitedStations((prev) =>
        prev.includes(stationId) ? prev : [...prev, stationId],
      );
      canvasRef.current?.focusStation(stationId);
    },
    [],
  );

  const handleCloseStation = useCallback(() => {
    audioRef.current?.playTap();
    setActiveStation(null);
    canvasRef.current?.focusStation(null);
  }, []);

  const handleSelectNpc = useCallback((npcId: string) => {
    audioRef.current?.playTap();
    setActiveStation(null);
    setActiveNpcId(npcId);
  }, []);

  const handleSubmitWish = useCallback(
    (input: {
      name: string;
      attendance: CelestialWishItem["attendance"];
      message: string;
    }) => {
      const nextWish: CelestialWishItem = {
        id: `w-${Date.now()}`,
        name: input.name,
        attendance: input.attendance,
        message: input.message,
        timestamp: "Baru saja",
      };
      setWishes((prev) => [nextWish, ...prev]);
      audioRef.current?.playWishStarRelease();
      canvasRef.current?.spawnWishStar(input.name);
      notify(`Bintang doa dari ${input.name} melesat ke langit istana!`);
    },
    [notify],
  );

  const cycleAtmosphere = useCallback(() => {
    audioRef.current?.playTap();
    setAtmosphere((cur) => {
      const idx = ATMOSPHERE_ORDER.indexOf(cur);
      const next = ATMOSPHERE_ORDER[(idx + 1) % ATMOSPHERE_ORDER.length]!;
      notify(`Suasana diubah ke ${ATMOSPHERE_LABEL[next]}`);
      return next;
    });
  }, [notify]);

  const toggleMusic = useCallback(() => {
    audioRef.current?.start();
    setMusicEnabled((prev) => {
      const next = !prev;
      audioRef.current?.setMusicEnabled(next);
      return next;
    });
  }, []);

  const toggleTrack = useCallback(() => {
    audioRef.current?.start();
    setMusicTrack((prev) => {
      const next = prev === "harpa" ? "orkestra" : "harpa";
      audioRef.current?.setTrack(next);
      notify(
        next === "harpa" ? "Musik: Harpa Bintang" : "Musik: Orkestra Waltz",
      );
      return next;
    });
  }, [notify]);

  const toggleSfx = useCallback(() => {
    audioRef.current?.start();
    setSfxEnabled((prev) => {
      const next = !prev;
      audioRef.current?.setSfxEnabled(next);
      return next;
    });
  }, []);

  const activeDialogue = useMemo(() => {
    if (!activeNpcId) return null;
    if (activeNpcId === "couple-altar") {
      return {
        speakerName: payload.coupleDisplay,
        roleLabel: "Mempelai Berbahagia",
        message: payload.coupleGreeting,
        isCouple: true,
      };
    }
    const found = CELESTIAL_NPCS.find((n) => n.id === activeNpcId);
    if (!found) return null;
    return {
      speakerName: found.name,
      roleLabel: found.roleLabel,
      message: found.dialogue,
      isCouple: false,
    };
  }, [activeNpcId, payload]);

  return (
    <div
      data-celestial-world=""
      className="relative h-[100dvh] w-full overflow-hidden select-none"
    >
      {/* Fullscreen Three.js Floating Fantasy Sanctuary */}
      <CelestialSceneCanvas
        ref={canvasRef}
        atmosphere={atmosphere}
        initials={payload.initials}
        coupleDisplay={payload.coupleDisplay}
        dateDisplay={payload.dateDisplay}
        photoUrls={photoUrls}
        reducedMotion={reducedMotion}
        overlayOpen={overlayOpen}
        onReadyPortraits={setPortraits}
        onSelectStation={handleSelectStationFromWorld}
        onSelectNpc={handleSelectNpc}
        onProximityChange={setProximity}
        onPlayerMoved={() => setHasMoved(true)}
        onIntroComplete={handleIntroComplete}
      />

      {/* Slim Top Floating Bar */}
      <header className="pointer-events-none fixed top-0 right-0 left-0 z-20 p-3 sm:px-5 sm:py-4">
        <div className="mx-auto flex max-w-[1320px] items-center justify-between gap-2">
          <div className="pointer-events-auto flex min-w-0 items-center gap-2">
            {!exclusiveMode && (
              <Link
                href="/katalog"
                className="inline-flex h-9 items-center gap-1.5 rounded-full border border-[#EFC86E]/30 bg-[#0D132B]/78 px-3 text-xs font-semibold text-[#FAF6EE] backdrop-blur-md hover:bg-[#19234A]"
              >
                <ArrowLeft className="h-3.5 w-3.5 text-[#EFC86E]" />
                <span className="hidden sm:inline">Katalog</span>
              </Link>
            )}
            <div className="flex min-w-0 items-center gap-2 rounded-full border border-[#EFC86E]/28 bg-[#0D132B]/78 px-3.5 py-1.5 backdrop-blur-md">
              <Sparkles className="h-3.5 w-3.5 shrink-0 text-[#EFC86E]" />
              <span className="celestial-serif truncate text-sm italic text-[#FAF6EE]">
                {payload.coupleDisplay}
              </span>
              <span className="hidden text-[11px] text-[#9EB0DE] md:inline">
                · {payload.dateDisplay}
              </span>
            </div>
          </div>

          <div className="pointer-events-auto flex items-center gap-1.5 sm:gap-2">
            {!exclusiveMode && (
              <button
                type="button"
                onClick={() => setDrawerOpen(true)}
                className="celestial-gold-btn inline-flex h-9 items-center gap-1.5 rounded-full px-3 text-xs font-bold cursor-pointer"
              >
                <SlidersHorizontal className="h-3.5 w-3.5" />
                <span>Personalisasi</span>
              </button>
            )}

            <button
              type="button"
              onClick={cycleAtmosphere}
              title="Ubah Suasana Langit"
              className="inline-flex h-9 items-center gap-1.5 rounded-full border border-[#EFC86E]/30 bg-[#0D132B]/78 px-3 text-xs font-semibold text-[#FAF6EE] backdrop-blur-md hover:bg-[#19234A] cursor-pointer"
            >
              {atmosphere === "senja" ? (
                <Sun className="h-3.5 w-3.5 text-[#FFBE7B]" />
              ) : atmosphere === "aurora" ? (
                <Sparkles className="h-3.5 w-3.5 text-[#66F5DE]" />
              ) : (
                <Moon className="h-3.5 w-3.5 text-[#EFC86E]" />
              )}
              <span className="hidden sm:inline">
                {ATMOSPHERE_LABEL[atmosphere]}
              </span>
            </button>

            <button
              type="button"
              onClick={toggleTrack}
              title="Ganti Musik"
              className="hidden h-9 items-center gap-1.5 rounded-full border border-[#EFC86E]/30 bg-[#0D132B]/78 px-3 text-xs font-semibold text-[#FAF6EE] backdrop-blur-md hover:bg-[#19234A] sm:inline-flex cursor-pointer"
            >
              <Music2 className="h-3.5 w-3.5 text-[#EFC86E]" />
              <span>{musicTrack === "harpa" ? "Harpa" : "Orkestra"}</span>
            </button>

            <button
              type="button"
              onClick={toggleMusic}
              className={`inline-flex h-9 items-center gap-1.5 rounded-full border px-3 text-xs font-semibold backdrop-blur-md cursor-pointer ${
                musicEnabled
                  ? "border-[#EFC86E]/45 bg-[#1B2552]/85 text-[#F7DC94]"
                  : "border-white/15 bg-[#0D132B]/75 text-[#8E9DC8]"
              }`}
            >
              {musicEnabled ? (
                <Volume2 className="h-3.5 w-3.5" />
              ) : (
                <VolumeX className="h-3.5 w-3.5" />
              )}
              <span>Musik</span>
            </button>

            <button
              type="button"
              onClick={toggleSfx}
              className={`inline-flex h-9 items-center gap-1 rounded-full border px-2.5 text-xs font-semibold backdrop-blur-md cursor-pointer ${
                sfxEnabled
                  ? "border-[#EFC86E]/45 bg-[#1B2552]/85 text-[#F7DC94]"
                  : "border-white/15 bg-[#0D132B]/75 text-[#8E9DC8]"
              }`}
            >
              <span>SFX</span>
            </button>

            {phase === "world" && (
              <button
                type="button"
                onClick={() => setShowPadDesktop((p) => !p)}
                title="Tampilkan Joystick di Desktop"
                className={`hidden h-9 items-center gap-1 rounded-full border px-2.5 text-xs font-semibold backdrop-blur-md md:inline-flex cursor-pointer ${
                  showPadDesktop
                    ? "border-[#EFC86E]/45 bg-[#1B2552]/85 text-[#F7DC94]"
                    : "border-[#EFC86E]/25 bg-[#0D132B]/75 text-[#CBD6F6]"
                }`}
              >
                <Gamepad2 className="h-3.5 w-3.5" />
              </button>
            )}

            {!exclusiveMode && (
              <Link
                href={`/buat?tema=${theme.slug}`}
                className="hidden h-9 items-center rounded-full border border-[#EFC86E]/40 bg-[#0D132B]/80 px-3.5 text-xs font-semibold text-[#F7DC94] backdrop-blur-md hover:bg-[#1B2552] lg:inline-flex"
              >
                Pakai Tema
              </Link>
            )}
          </div>
        </div>
      </header>

      {/* PHASE 1: COVER GATE */}
      {phase === "cover" && (
        <CelestialCoverGate
          payload={payload}
          guestName={guestName}
          onEnterFlight={handleOpenPicker}
          onEnterDirect={handleEnterDirect}
        />
      )}

      {/* PHASE 1B: 3D AVATAR PICKER */}
      {phase === "picking" && (
        <CelestialAvatarPicker
          selectedGender={selectedGender}
          portraits={portraits}
          onSelectGender={handleSelectGender}
          onEnter={handleStartFlight}
        />
      )}

      {/* PHASE 2: CINEMATIC DRONE INTRO OVERLAY */}
      {phase === "intro" && (
        <div className="pointer-events-none fixed inset-x-0 bottom-6 z-20 flex flex-col items-center justify-center gap-3 px-4">
          <div className="celestial-glass rounded-full px-5 py-2 text-center">
            <p className="celestial-serif text-base italic text-[#FAF6EE]">
              Menuju Istana Awan — {payload.coupleDisplay}
            </p>
          </div>
          <button
            type="button"
            onClick={handleSkipIntro}
            className="pointer-events-auto rounded-full border border-[#EFC86E]/35 bg-[#0D132B]/80 px-4 py-1.5 text-xs font-semibold text-[#F7DC94] backdrop-blur-md hover:bg-[#19234A] cursor-pointer"
          >
            Lewati Intro
          </button>
        </div>
      )}

      {/* PHASE 3: WALKING CONTROLS, PROXIMITY PROMPT & DOCK */}
      {phase === "world" && (
        <>
          <CelestialJoystick
            visible={!overlayOpen}
            showOnDesktop={showPadDesktop}
            onVectorChange={(v) => canvasRef.current?.setJoystickVector(v)}
          />

          {/* Subtle Walking Hint on Desktop before user moves */}
          {!hasMoved && !overlayOpen && (
            <div className="pointer-events-none fixed top-16 left-1/2 z-10 hidden -translate-x-1/2 md:block">
              <div className="celestial-glass rounded-full px-4 py-1.5 text-[11px] text-[#DCE5FC]">
                Gunakan <span className="font-semibold text-[#F7DC94]">WASD / Panah</span> atau klik pulau untuk berjalan · Seret layar untuk putar kamera
              </div>
            </div>
          )}

          {/* Proximity Interactive Action Pill */}
          {proximity && !overlayOpen && (
            <div className="pointer-events-none fixed inset-x-0 bottom-16 z-20 flex justify-center px-4 sm:bottom-20">
              <button
                type="button"
                onClick={() => canvasRef.current?.triggerNearestInteraction()}
                className="celestial-gold-btn pointer-events-auto inline-flex h-10 items-center gap-2 rounded-full px-4 text-xs font-bold shadow-lg cursor-pointer"
              >
                <Sparkles className="h-3.5 w-3.5" />
                <span>{proximity.label}</span>
              </button>
            </div>
          )}

          {/* Bottom 5-Station Floating Dock */}
          <nav
            aria-label="Navigasi Pulau Istana Awan"
            className="pointer-events-none fixed inset-x-0 bottom-3 z-20 flex justify-center px-3 sm:bottom-5"
          >
            <div className="celestial-glass pointer-events-auto flex max-w-full items-center gap-1 overflow-x-auto rounded-full p-1.5 sm:gap-1.5">
              {CELESTIAL_STATIONS.map((st) => {
                const isActive = activeStation === st.id;
                const isVisited = visitedStations.includes(st.id);
                return (
                  <button
                    key={st.id}
                    type="button"
                    onClick={() => handleSelectStationFromDock(st.id)}
                    className={`relative inline-flex h-9 shrink-0 items-center gap-1.5 rounded-full px-3 text-xs font-semibold transition-all cursor-pointer sm:px-3.5 ${
                      isActive
                        ? "bg-[#EFC86E] text-[#171107]"
                        : "text-[#DCE5FC] hover:bg-[#1C2656]/75"
                    }`}
                  >
                    <span
                      className={`h-1.5 w-1.5 rounded-full ${
                        isActive
                          ? "bg-[#171107]"
                          : isVisited
                            ? "bg-[#EFC86E]"
                            : "bg-white/30"
                      }`}
                    />
                    <span>{st.shortLabel}</span>
                    {st.id === "bintang" && (
                      <span
                        className={`celestial-mono rounded-full px-1.5 py-0.2 text-[10px] ${
                          isActive
                            ? "bg-[#171107]/15 text-[#171107]"
                            : "bg-[#EFC86E]/20 text-[#F7DC94]"
                        }`}
                      >
                        {wishes.length}
                      </span>
                    )}
                  </button>
                );
              })}

              <span className="mx-0.5 h-5 w-px shrink-0 bg-[#EFC86E]/25" />

              <button
                type="button"
                onClick={handleReplayIntro}
                title="Ulangi Penerbangan Intro"
                className="inline-flex h-9 shrink-0 items-center gap-1 rounded-full px-2.5 text-xs font-semibold text-[#F7DC94] hover:bg-[#1C2656]/75 cursor-pointer"
              >
                <Compass className="h-3.5 w-3.5" />
                <span className="hidden md:inline">Ulangi Terbang</span>
              </button>
            </div>
          </nav>
        </>
      )}

      {/* NPC / COUPLE DIALOGUE BOX */}
      {activeDialogue && (
        <CelestialDialogueBox
          speakerName={activeDialogue.speakerName}
          roleLabel={activeDialogue.roleLabel}
          message={activeDialogue.message}
          isCouple={activeDialogue.isCouple}
          onClose={() => setActiveNpcId(null)}
        />
      )}

      {/* STATION DETAIL MODAL */}
      <CelestialStationModal
        stationId={activeStation}
        payload={payload}
        guestName={guestName}
        wishes={wishes}
        onClose={handleCloseStation}
        onNavigateStation={handleSelectStationFromDock}
        onSubmitWish={handleSubmitWish}
        onNotify={notify}
      />

      {/* STUDIO PERSONALIZER DRAWER (DEMO MODE ONLY) */}
      {!exclusiveMode && (
        <PersonalizeWeddingDrawer
          open={drawerOpen}
          overrides={overrides}
          guestName={guestName}
          onChangeOverrides={(next) => setOverrides(next)}
          onChangeGuestName={setGuestName}
          onReset={() => {
            setOverrides({});
            setGuestName("");
            notify("Data demo dikembalikan ke default.");
          }}
          onClose={() => setDrawerOpen(false)}
          onNotify={notify}
        />
      )}

      {/* Subtle Floating Toast */}
      {toastMsg && (
        <div className="pointer-events-none fixed top-16 left-1/2 z-50 -translate-x-1/2">
          <div className="celestial-glass rounded-full border-[#EFC86E]/45 px-4 py-2 text-xs font-semibold text-[#F7DC94] shadow-lg">
            {toastMsg}
          </div>
        </div>
      )}
    </div>
  );
}
