"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  ArrowLeft,
  CalendarPlus,
  Check,
  Copy,
  ExternalLink,
  Mail,
  MapPin,
  QrCode,
  RefreshCw,
  Wallet,
  X,
} from "lucide-react";

function InstagramIcon({ className = "h-3 w-3" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  );
}
import type { ThemeItem } from "@/lib/schemas";
import { getLuxuryWeddingConfig } from "./weddingThemesConfig";
import { WeddingAudioEngine } from "./weddingAudio";
import {
  BotanicalPeonyCorner,
  CelestialStarCorner,
  FloatingVinylDisc,
  HangingFernSprig,
  SundaLeafCorner,
  SundaSigerCrest,
} from "./WeddingOrnaments";

interface LuxuryWeddingExperienceProps {
  theme: ThemeItem;
}

interface WishEntry {
  id: string;
  name: string;
  status: string;
  message: string;
}

const INITIAL_WISHES: WishEntry[] = [
  {
    id: "w1",
    name: "Nadia & Farhan",
    status: "Hadir",
    message:
      "MasyaAllah, selamat menempuh hidup baru! Semoga selalu dilimpahi sakinah, mawaddah, dan rahmah.",
  },
  {
    id: "w2",
    name: "Bagas Pratama",
    status: "Hadir",
    message: "Turut berbahagia! InsyaAllah hadir di akad dan resepsi tepat waktu.",
  },
  {
    id: "w3",
    name: "Clara & Reza",
    status: "Doa Terbaik",
    message: "Semoga menjadi keluarga yang hangat dan selalu bahagia selamanya.",
  },
];

function HeritageCornerBackdrop({
  coverBgSrc,
  scrimBg,
  opacity = 0.94,
}: {
  coverBgSrc: string;
  scrimBg: string;
  opacity?: number;
}) {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      <img
        src={coverBgSrc}
        alt=""
        className="h-full w-full object-cover"
        style={{ opacity }}
      />
      <div
        className="absolute inset-0"
        style={{
          background: scrimBg,
        }}
      />
    </div>
  );
}

export function LuxuryWeddingExperience({ theme }: LuxuryWeddingExperienceProps) {
  const searchParams = useSearchParams();
  const guestName = searchParams.get("to")?.trim() || "Tamu Spesial";
  const isEmbed = searchParams.get("embed") === "1";
  const startOpened = searchParams.get("open") === "1";

  const cfg = getLuxuryWeddingConfig(theme.slug);
  const [opened, setOpened] = useState(startOpened);
  const [musicPlaying, setMusicPlaying] = useState(false);

  const [countdown, setCountdown] = useState({
    days: 120,
    hours: 8,
    minutes: 34,
    seconds: 12,
  });
  const [copiedBank, setCopiedBank] = useState(false);
  const [qrOpen, setQrOpen] = useState(false);
  const [wishes, setWishes] = useState<WishEntry[]>(INITIAL_WISHES);
  const [rsvpName, setRsvpName] = useState("");
  const [rsvpStatus, setRsvpStatus] = useState("Hadir");
  const [rsvpMsg, setRsvpMsg] = useState("");
  const [rsvpSuccess, setRsvpSuccess] = useState(false);

  const audioRef = useRef<WeddingAudioEngine | null>(null);

  useEffect(() => {
    const engine = new WeddingAudioEngine();
    engine.setTone(cfg.audioTone);
    audioRef.current = engine;
    return () => {
      engine.dispose();
      audioRef.current = null;
    };
  }, [cfg.audioTone]);

  useEffect(() => {
    const targetMs = new Date(cfg.targetIso).getTime();
    const tick = () => {
      const diff = Math.max(0, targetMs - Date.now());
      setCountdown({
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((diff / (1000 * 60)) % 60),
        seconds: Math.floor((diff / 1000) % 60),
      });
    };
    tick();
    const id = window.setInterval(tick, 1000);
    return () => window.clearInterval(id);
  }, [cfg.targetIso]);

  const handleOpenInvitation = () => {
    audioRef.current?.start();
    setMusicPlaying(true);
    setOpened(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleToggleAudio = () => {
    if (!audioRef.current) return;
    const next = audioRef.current.toggle();
    setMusicPlaying(next);
  };

  const handleCopyAccount = async () => {
    try {
      await navigator.clipboard.writeText(cfg.bank.number.replace(/\s+/g, ""));
      setCopiedBank(true);
      window.setTimeout(() => setCopiedBank(false), 1800);
    } catch {
      setCopiedBank(false);
    }
  };

  const handleDownloadIcs = () => {
    const startUtc = cfg.targetIso.replace(/[-:]/g, "").slice(0, 15);
    const ics = [
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      "BEGIN:VEVENT",
      `SUMMARY:Pernikahan ${cfg.coupleShort}`,
      `DTSTART:${startUtc}`,
      `LOCATION:${cfg.venueName} - ${cfg.venueAddress}`,
      "END:VEVENT",
      "END:VCALENDAR",
    ].join("\r\n");

    const blob = new Blob([ics], { type: "text/calendar;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `undangan-${theme.slug}.ics`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  };

  const handleSubmitRsvp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!rsvpName.trim() || !rsvpMsg.trim()) return;
    setWishes((prev) => [
      {
        id: `w-${Date.now()}`,
        name: rsvpName.trim(),
        status: rsvpStatus,
        message: rsvpMsg.trim(),
      },
      ...prev,
    ]);
    setRsvpName("");
    setRsvpMsg("");
    setRsvpSuccess(true);
    window.setTimeout(() => setRsvpSuccess(false), 2600);
  };

  const isHeritageSogan = cfg.variant === "heritage-sogan";
  const isHeritageMinang = cfg.variant === "heritage-minang";
  const isHeritageSunda = cfg.variant === "heritage-sunda";
  const isHeritage = isHeritageSogan || isHeritageMinang || isHeritageSunda;
  const isBotanicalFolio = cfg.variant === "botanical-folio";
  const isBotanicalBlush = cfg.variant === "botanical-blush";
  const isBotanicalArch = cfg.variant === "botanical-arch";
  const isEditorialNoir = cfg.variant === "editorial-noir";
  const isEditorialCelestial = cfg.variant === "editorial-celestial";
  const isEditorialChampagne = cfg.variant === "editorial-champagne";

  const calendarCells: (number | null)[] = [
    ...Array.from({ length: cfg.startWeekdayOffset }, () => null),
    ...Array.from({ length: cfg.daysInMonth }, (_, i) => i + 1),
  ];

  return (
    <div
      data-luxury-wedding={theme.slug}
      className="min-h-[100dvh] w-full antialiased"
      style={{
        backgroundColor: cfg.isDarkTheme ? "#090B10" : "#EAE6DE",
        color: cfg.ink,
      }}
    >
      {/* Slim Studio Bar when opened directly outside embed */}
      {!isEmbed && (
        <header className="sticky top-0 z-50 border-b border-black/10 bg-white/92 text-[#16201B] backdrop-blur-md">
          <div className="mx-auto flex h-12 max-w-[1040px] items-center justify-between px-3 sm:px-6">
            <Link
              href={`/katalog/${theme.slug}`}
              className="inline-flex h-8 items-center gap-1 rounded-full border border-[#E4E2DC] bg-[#F8F7F4] px-3 text-xs font-semibold text-[#16201B] hover:bg-[#EFECE5]"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              Katalog
            </Link>
            <span className="truncate text-xs font-semibold">
              {theme.name} — {cfg.coupleShort}
            </span>
            <Link
              href={`/buat?tema=${theme.slug}`}
              className="inline-flex h-8 items-center rounded-full bg-[#1B5E47] px-3.5 text-xs font-semibold text-white hover:bg-[#144A37]"
            >
              Pakai Tema
            </Link>
          </div>
        </header>
      )}

      {/* Centered Boutique Mobile Column (390px feel on desktop, full width on mobile) */}
      <div
        className="relative mx-auto min-h-[100dvh] w-full max-w-[460px] overflow-x-clip shadow-[0_24px_80px_-20px_rgba(0,0,0,0.35)]"
        style={{ backgroundColor: opened ? cfg.paperBg : cfg.coverBgColor }}
      >
        {/* Fixed / Scoped Heritage Stationery Paper Backdrop on Heritage Themes */}
        {opened && isHeritageSogan && (
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0"
            style={{ backgroundColor: cfg.paperBg }}
          />
        )}

        {/* ============================================================
            SECTION 0: COVER GATE (ATM OF CELADON FERN / PUSAKA SURAKARTA / NOIR CALLA)
        ============================================================ */}
        {!opened ? (
          <section
            className="relative flex min-h-[100dvh] flex-col justify-between overflow-hidden px-6 py-10 text-center"
            style={{
              backgroundColor: cfg.coverBgColor,
              color: cfg.coverInk,
            }}
          >
            {/* Cover Backdrop Artwork */}
            {isEditorialNoir ? (
              <>
                <img
                  src={cfg.coverBgSrc}
                  alt=""
                  className={`absolute inset-0 h-full w-full object-cover ${
                    cfg.coverImageFilter ?? ""
                  }`}
                />
                <div
                  className="absolute inset-0"
                  style={{
                    background:
                      "linear-gradient(180deg, rgba(10,11,14,0.52) 0%, rgba(10,11,14,0.22) 38%, rgba(10,11,14,0.92) 100%)",
                  }}
                />
              </>
            ) : isEditorialCelestial || isEditorialChampagne ? (
              <>
                <img
                  src={cfg.coverBgSrc}
                  alt=""
                  className="absolute inset-0 h-full w-full object-cover opacity-55"
                />
                <div
                  className="absolute inset-0"
                  style={{
                    background: isEditorialCelestial
                      ? "linear-gradient(180deg, rgba(10,15,34,0.72) 0%, rgba(10,15,34,0.38) 45%, rgba(10,15,34,0.94) 100%)"
                      : "linear-gradient(180deg, rgba(24,18,14,0.56) 0%, rgba(24,18,14,0.28) 45%, rgba(24,18,14,0.9) 100%)",
                  }}
                />
              </>
            ) : isHeritageSogan || isHeritageMinang || isBotanicalFolio ? (
              <>
                <img
                  src={cfg.coverBgSrc}
                  alt=""
                  className="absolute inset-0 h-full w-full object-cover"
                />
                <div
                  className="absolute inset-0"
                  style={{
                    background: isHeritageSogan
                      ? "radial-gradient(circle at 50% 62%, rgba(243,230,206,0.68) 0%, rgba(243,230,206,0.12) 68%, transparent 100%)"
                      : isHeritageMinang
                        ? "radial-gradient(circle at 50% 55%, rgba(62,10,19,0.58) 0%, rgba(62,10,19,0.18) 72%, rgba(44,6,13,0.45) 100%)"
                        : "radial-gradient(circle at 50% 50%, rgba(70,102,88,0.42) 0%, rgba(70,102,88,0.1) 70%, transparent 100%)",
                  }}
                />
              </>
            ) : (
              /* SVG Botanical / Siger Cover Artwork (Pasundan, Blush, Ivory Arch, Island Hearth) */
              <>
                {isHeritageSunda && (
                  <>
                    <SundaLeafCorner className="pointer-events-none absolute top-0 left-0 h-44 w-44" />
                    <SundaLeafCorner
                      flip
                      className="pointer-events-none absolute right-0 bottom-0 h-44 w-44"
                    />
                  </>
                )}
                {isBotanicalBlush && (
                  <>
                    <BotanicalPeonyCorner className="pointer-events-none absolute top-0 left-0 h-44 w-44" />
                    <BotanicalPeonyCorner
                      flip
                      className="pointer-events-none absolute right-0 bottom-0 h-44 w-44"
                    />
                  </>
                )}
                {isBotanicalArch && (
                  <>
                    <BotanicalPeonyCorner
                      strokeColor={cfg.primary}
                      leafColor={cfg.primary}
                      petalColor={cfg.cardBg}
                      className="pointer-events-none absolute top-0 left-0 h-40 w-40 opacity-85"
                    />
                    <BotanicalPeonyCorner
                      flip
                      strokeColor={cfg.primary}
                      leafColor={cfg.primary}
                      petalColor={cfg.cardBg}
                      className="pointer-events-none absolute right-0 bottom-0 h-40 w-40 opacity-85"
                    />
                  </>
                )}
              </>
            )}

            {/* Fine Inset Editorial Frame */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-3.5 rounded-[4px] border"
              style={{
                borderColor: cfg.isDarkTheme
                  ? "rgba(255,248,236,0.22)"
                  : "rgba(36,30,24,0.14)",
              }}
            />

            {/* Top Micro Crest */}
            <div className="relative z-10 flex flex-col items-center pt-4">
              {isHeritageSunda && (
                <SundaSigerCrest color={cfg.accentGold} className="mb-2 h-11 w-32" />
              )}
            </div>

            {/* Center / Lower-Third Hero Typography + CTA */}
            <div
              className={`relative z-10 my-auto flex flex-col items-center ${
                isHeritageSogan || isEditorialNoir ? "mt-auto pt-28 pb-10" : "py-8"
              }`}
            >
              <p
                className="mb-3 text-[10px] font-semibold tracking-[0.28em] uppercase"
                style={{ color: cfg.coverAccentInk }}
              >
                {cfg.eyebrowCover}
              </p>

              <h1 className="font-luxury text-[40px] leading-[1.06] font-normal tracking-[-0.01em] sm:text-[46px]">
                <span className="block">{cfg.brideShort}</span>
                <span
                  className="my-1 block font-script text-[26px]"
                  style={{ color: cfg.coverAccentInk }}
                >
                  &amp;
                </span>
                <span className="block">{cfg.groomShort}</span>
              </h1>

              {/* Tracked Date with Horizontal Hairlines */}
              <div className="mt-5 flex w-full max-w-[260px] items-center gap-3">
                <span className="h-[1px] flex-1 bg-current opacity-30" />
                <p
                  className="text-[10px] font-semibold tracking-[0.2em] uppercase"
                  style={{ color: cfg.coverAccentInk }}
                >
                  {cfg.dateUpper}
                </p>
                <span className="h-[1px] flex-1 bg-current opacity-30" />
              </div>

              {/* Guest Addressing Block */}
              <div
                className="mt-6 rounded-xl border px-4 py-2 text-center backdrop-blur-xs"
                style={{
                  borderColor: cfg.isDarkTheme
                    ? "rgba(255,248,236,0.22)"
                    : "rgba(36,30,24,0.14)",
                  backgroundColor: cfg.isDarkTheme
                    ? "rgba(15,18,28,0.42)"
                    : "rgba(255,255,255,0.45)",
                }}
              >
                <p className="text-[9.5px] font-medium tracking-[0.18em] uppercase opacity-75">
                  Kepada Yth.
                </p>
                <p className="mt-0.5 text-sm font-semibold">{guestName}</p>
              </div>

              <button
                type="button"
                onClick={handleOpenInvitation}
                className="mt-6 inline-flex h-11 items-center gap-2 rounded-full px-7 text-[11px] font-semibold tracking-[0.18em] uppercase shadow-lg transition-transform hover:-translate-y-0.5 active:scale-[0.98] cursor-pointer"
                style={{
                  backgroundColor: cfg.coverBtnBg,
                  color: cfg.coverBtnInk,
                }}
              >
                <Mail className="h-3.5 w-3.5" />
                Buka Undangan
              </button>
            </div>

            <div className="h-4" aria-hidden="true" />
          </section>
        ) : (
          /* ============================================================
             OPENED LUXURY INVITATION JOURNEY (ALL 10 INVEET-ATM SECTIONS)
          ============================================================ */
          <div className="relative" style={{ color: cfg.ink }}>
            {/* Floating Vinyl Music Disc */}
            <FloatingVinylDisc
              playing={musicPlaying}
              accentColor={cfg.primary}
              onToggle={handleToggleAudio}
            />

            {/* ----------------------------------------------------------
                SECTION 1: OPENED HERO (ARCHETYPED PER VARIANT!)
            ---------------------------------------------------------- */}
            {isHeritageSogan && (
              <section className="relative flex min-h-[100dvh] flex-col justify-center overflow-hidden px-7 py-16">
                <HeritageCornerBackdrop
                  coverBgSrc={cfg.coverBgSrc}
                  scrimBg="linear-gradient(90deg, rgba(243,230,206,0.88) 0%, rgba(243,230,206,0.58) 60%, rgba(243,230,206,0.35) 100%)"
                />
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-3.5 border border-[#4B3328]/15"
                />
                {/* Quiet-Heirloom Left-Aligned Hero Composition (Pusaka Surakarta ATM) */}
                <div className="wedding-fade-up relative z-10 border-l border-[#4B3328]/25 pl-5">
                  <p
                    className="text-[10px] font-bold tracking-[0.26em] uppercase"
                    style={{ color: cfg.accentGold }}
                  >
                    {cfg.eyebrowHero}
                  </p>
                  <h1 className="mt-4 font-luxury text-[42px] leading-[1.06] font-normal text-[#231D18] sm:text-[48px]">
                    <span className="block">{cfg.groomShort}</span>
                    <span
                      className="my-0.5 block font-script text-[28px]"
                      style={{ color: cfg.accentGold }}
                    >
                      &amp;
                    </span>
                    <span className="block">{cfg.brideShort}</span>
                  </h1>
                  <p className="mt-5 text-[10.5px] font-bold tracking-[0.22em] text-[#231D18]/85 uppercase">
                    {cfg.dateUpper}
                  </p>
                  <p className="mt-4 max-w-[290px] font-serif text-[15px] leading-relaxed text-[#4C3F33]">
                    {cfg.openingPrayer}
                  </p>
                </div>
              </section>
            )}

            {isHeritageSunda && (
              <section
                className="relative flex min-h-[100dvh] flex-col justify-center overflow-hidden px-7 py-16"
                style={{ backgroundColor: cfg.paperBg }}
              >
                <SundaLeafCorner className="pointer-events-none absolute top-0 left-0 h-44 w-44" />
                <SundaLeafCorner
                  flip
                  className="pointer-events-none absolute right-0 bottom-0 h-44 w-44"
                />
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-3.5 border border-[#4A5A3A]/18"
                />
                <div className="wedding-fade-up relative z-10 border-l border-[#4A5A3A]/28 pl-5">
                  <SundaSigerCrest color={cfg.accentGold} className="mb-3 h-9 w-28" />
                  <p
                    className="text-[10px] font-bold tracking-[0.26em] uppercase"
                    style={{ color: cfg.primary }}
                  >
                    {cfg.eyebrowHero}
                  </p>
                  <h1 className="mt-3 font-luxury text-[42px] leading-[1.06] font-normal sm:text-[48px]">
                    <span className="block">{cfg.brideShort}</span>
                    <span
                      className="my-0.5 block font-script text-[26px]"
                      style={{ color: cfg.accentGold }}
                    >
                      &amp;
                    </span>
                    <span className="block">{cfg.groomShort}</span>
                  </h1>
                  <p className="mt-4 text-[10.5px] font-bold tracking-[0.2em] uppercase opacity-80">
                    {cfg.dateUpper}
                  </p>
                  <p className="mt-3 max-w-[285px] font-serif text-[15px] leading-relaxed opacity-85">
                    {cfg.openingPrayer}
                  </p>
                </div>
              </section>
            )}

            {isHeritageMinang && (
              <section className="relative flex min-h-[100dvh] items-center justify-center overflow-hidden px-6 py-16">
                <HeritageCornerBackdrop
                  coverBgSrc={cfg.coverBgSrc}
                  scrimBg="rgba(42,6,13,0.34)"
                  opacity={1}
                />
                {/* Ornate Cream Arch Card with Gold Wax Monogram (Marun Sutra ATM) */}
                <div
                  className="wedding-fade-up relative z-10 w-full max-w-[300px] rounded-t-full rounded-b-[20px] border-2 px-6 pt-10 pb-8 text-center shadow-2xl"
                  style={{
                    backgroundColor: "#FCF5E8",
                    borderColor: "#D6AE62",
                    color: "#261618",
                  }}
                >
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full border border-[#B08338] bg-[#E8C57B] font-luxury text-sm font-bold text-[#3B1E08] shadow-md">
                    {cfg.monogram}
                  </div>
                  <p className="mt-4 text-[10px] font-bold tracking-[0.24em] text-[#7D1627] uppercase">
                    {cfg.eyebrowHero}
                  </p>
                  <h1 className="mt-2 font-luxury text-[36px] leading-[1.1] italic text-[#4B0E18]">
                    <span className="block">{cfg.groomShort}</span>
                    <span className="my-0.5 block font-script text-xl text-[#9C6F25]">
                      &amp;
                    </span>
                    <span className="block">{cfg.brideShort}</span>
                  </h1>
                  <div className="my-4 h-[1px] w-full bg-[#D6AE62]/55" />
                  <p className="text-[10px] font-bold tracking-[0.18em] text-[#7D1627] uppercase">
                    {cfg.dateUpper}
                  </p>
                  <p className="mt-3 text-xs leading-relaxed text-[#5B4346]">
                    {cfg.openingPrayer}
                  </p>
                </div>
              </section>
            )}

            {(isBotanicalFolio || isBotanicalBlush || isBotanicalArch) && (
              <section
                className="relative flex min-h-[100dvh] flex-col items-center justify-center overflow-hidden px-6 py-12 text-center"
                style={{
                  background: `radial-gradient(ellipse 80% 55% at 50% 0%, ${cfg.softTint} 0%, ${cfg.paperBg} 75%)`,
                }}
              >
                {isBotanicalBlush && (
                  <>
                    <BotanicalPeonyCorner className="pointer-events-none absolute top-0 left-0 h-36 w-36 opacity-80" />
                    <BotanicalPeonyCorner
                      flip
                      className="pointer-events-none absolute right-0 bottom-0 h-36 w-36 opacity-80"
                    />
                  </>
                )}

                {/* Museum-Mounted 4:5 Portrait / Arch Frame (Celadon Fern ATM) */}
                <div className="wedding-fade-up relative z-10 w-full max-w-[270px]">
                  <div
                    className={`bg-white p-2.5 shadow-[0_18px_42px_-16px_rgba(24,32,26,0.28)] ring-1 ring-black/8 ${
                      isBotanicalArch ? "rounded-t-full rounded-b-[14px]" : "rounded-[4px]"
                    }`}
                  >
                    <div
                      className={`aspect-[4/5] w-full overflow-hidden ${
                        isBotanicalArch ? "rounded-t-full rounded-b-[10px]" : "rounded-[2px]"
                      }`}
                    >
                      <img
                        src={cfg.heroPortraitSrc}
                        alt={cfg.coupleShort}
                        className="h-full w-full object-cover"
                      />
                    </div>
                  </div>
                </div>

                <div className="wedding-fade-up relative z-10 mt-7">
                  <p
                    className="text-[10px] font-semibold tracking-[0.24em] uppercase"
                    style={{ color: cfg.primary }}
                  >
                    {cfg.eyebrowHero}
                  </p>
                  <h1
                    className="mt-2.5 font-script text-[42px] leading-[1.12] sm:text-[48px]"
                    style={{ color: cfg.primary }}
                  >
                    <span className="block">{cfg.brideShort}</span>
                    <span className="block text-[26px] opacity-80">&amp;</span>
                    <span className="block">{cfg.groomShort}</span>
                  </h1>
                  <p className="mt-3 font-serif text-sm text-current opacity-80">
                    {cfg.dateFull}
                  </p>
                </div>
              </section>
            )}

            {(isEditorialNoir || isEditorialCelestial || isEditorialChampagne) && (
              <section
                className="relative flex min-h-[100dvh] flex-col items-center justify-center overflow-hidden px-6 py-14 text-center"
                style={{ backgroundColor: cfg.paperBg }}
              >
                {isEditorialCelestial && (
                  <>
                    <CelestialStarCorner
                      goldColor={cfg.accentGold}
                      className="pointer-events-none absolute top-2 left-2 h-36 w-36"
                    />
                    <CelestialStarCorner
                      goldColor={cfg.accentGold}
                      flip
                      className="pointer-events-none absolute right-2 bottom-2 h-36 w-36"
                    />
                  </>
                )}

                <div
                  className="wedding-fade-up relative z-10 w-full max-w-[310px] border px-5 py-7"
                  style={{
                    borderColor: `${cfg.accentGold}55`,
                    backgroundColor: cfg.isDarkTheme
                      ? "rgba(255,255,255,0.02)"
                      : "rgba(255,255,255,0.68)",
                  }}
                >
                  <p
                    className="text-[9.5px] font-semibold tracking-[0.28em] uppercase"
                    style={{ color: cfg.accentGold }}
                  >
                    {cfg.eyebrowHero}
                  </p>

                  <div className="mx-auto mt-4 aspect-[4/5] w-48 overflow-hidden rounded-t-full border p-1" style={{ borderColor: `${cfg.accentGold}65` }}>
                    <img
                      src={cfg.heroPortraitSrc}
                      alt={cfg.coupleShort}
                      className={`h-full w-full rounded-t-full object-cover ${
                        isEditorialNoir ? "grayscale contrast-125" : ""
                      }`}
                    />
                  </div>

                  <h1 className="mt-5 font-luxury text-[36px] leading-[1.08] font-normal">
                    <span className="block">{cfg.brideShort}</span>
                    <span
                      className="my-0.5 block font-script text-2xl"
                      style={{ color: cfg.accentGold }}
                    >
                      &amp;
                    </span>
                    <span className="block">{cfg.groomShort}</span>
                  </h1>

                  <p className="mt-3 text-[10px] font-semibold tracking-[0.2em] uppercase opacity-75">
                    {cfg.dateUpper}
                  </p>
                </div>
              </section>
            )}

            {/* ----------------------------------------------------------
                SECTION 2: QUOTE & MONOGRAM CARD
            ---------------------------------------------------------- */}
            <section
              className="px-6 py-12 text-center"
              style={{
                backgroundColor: cfg.isDarkTheme ? cfg.softTint : cfg.cardBg,
              }}
            >
              <div
                className="mx-auto max-w-sm rounded-2xl border px-5 py-7"
                style={{
                  borderColor: `${cfg.accentGold}3D`,
                  backgroundColor: cfg.cardBg,
                }}
              >
                <p
                  className="font-luxury text-3xl tracking-widest"
                  style={{ color: cfg.primary }}
                >
                  {cfg.monogram}
                </p>
                <div
                  className="mx-auto my-4 h-[1px] w-14"
                  style={{ backgroundColor: cfg.accentGold }}
                />
                <p
                  className="font-serif text-[15px] leading-relaxed italic"
                  style={{ color: cfg.mutedInk }}
                >
                  &ldquo;{cfg.quoteText}&rdquo;
                </p>
                <p
                  className="mt-3 text-[11px] font-bold tracking-[0.18em] uppercase"
                  style={{ color: cfg.accentGold }}
                >
                  {cfg.quoteSource}
                </p>
              </div>
            </section>

            {/* ----------------------------------------------------------
                SECTION 3: MEMPELAI (ARCH-WINDOW ALTERNATING ROWS)
            ---------------------------------------------------------- */}
            <section
              className="px-6 py-12"
              style={{ backgroundColor: cfg.paperBg }}
            >
              <div className="text-center">
                <p
                  className="text-[10px] font-bold tracking-[0.26em] uppercase"
                  style={{ color: cfg.accentGold }}
                >
                  Mempelai Berbahagia
                </p>
                <h2 className="mt-1.5 font-luxury text-3xl font-normal">
                  Putra &amp; Putri Terbaik
                </h2>
              </div>

              <div
                className="mt-7 space-y-7 rounded-[24px] border p-5 shadow-xs"
                style={{
                  backgroundColor: cfg.cardBg,
                  borderColor: `${cfg.accentGold}35`,
                }}
              >
                {/* Row 1: Bride (Arch-Window Left + Details Right) */}
                <div className="grid grid-cols-[120px_1fr] items-center gap-4">
                  <div
                    className="aspect-[3/4] w-[120px] rounded-t-full rounded-b-[12px] border-[2.5px] p-1"
                    style={{ borderColor: cfg.primary }}
                  >
                    <img
                      src={cfg.galleryPhotos[0]}
                      alt={cfg.brideFull}
                      className={`h-full w-full rounded-t-full rounded-b-[8px] object-cover ${
                        isEditorialNoir ? "grayscale contrast-125" : ""
                      }`}
                    />
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-luxury text-2xl leading-tight font-semibold">
                      {cfg.brideFull}
                    </h3>
                    <p
                      className="mt-2 text-[9.5px] font-bold tracking-[0.16em] uppercase"
                      style={{ color: cfg.accentGold }}
                    >
                      {cfg.brideOrder}
                    </p>
                    <p className="mt-1 text-xs leading-relaxed" style={{ color: cfg.mutedInk }}>
                      {cfg.brideParents}
                    </p>
                    <span
                      className="mt-2.5 inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-medium"
                      style={{ backgroundColor: cfg.softTint, color: cfg.primary }}
                    >
                      <InstagramIcon className="h-3 w-3" />
                      {cfg.brideIg}
                    </span>
                  </div>
                </div>

                <div className="h-[1px] w-full bg-current opacity-10" />

                {/* Row 2: Groom (Details Left + Arch-Window Right) */}
                <div className="grid grid-cols-[1fr_120px] items-center gap-4 text-right">
                  <div className="min-w-0">
                    <h3 className="font-luxury text-2xl leading-tight font-semibold">
                      {cfg.groomFull}
                    </h3>
                    <p
                      className="mt-2 text-[9.5px] font-bold tracking-[0.16em] uppercase"
                      style={{ color: cfg.accentGold }}
                    >
                      {cfg.groomOrder}
                    </p>
                    <p className="mt-1 text-xs leading-relaxed" style={{ color: cfg.mutedInk }}>
                      {cfg.groomParents}
                    </p>
                    <span
                      className="mt-2.5 inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-medium"
                      style={{ backgroundColor: cfg.softTint, color: cfg.primary }}
                    >
                      <InstagramIcon className="h-3 w-3" />
                      {cfg.groomIg}
                    </span>
                  </div>
                  <div
                    className="aspect-[3/4] w-[120px] rounded-t-full rounded-b-[12px] border-[2.5px] p-1"
                    style={{ borderColor: cfg.primary }}
                  >
                    <img
                      src={cfg.galleryPhotos[1]}
                      alt={cfg.groomFull}
                      className={`h-full w-full rounded-t-full rounded-b-[8px] object-cover ${
                        isEditorialNoir ? "grayscale contrast-125" : ""
                      }`}
                    />
                  </div>
                </div>
              </div>
            </section>

            {/* ----------------------------------------------------------
                SECTION 4: HITUNG MUNDUR + MINI MONTH CALENDAR GRID (CELADON FERN ATM)
            ---------------------------------------------------------- */}
            <section
              className="px-6 py-12 text-center"
              style={{
                backgroundColor: cfg.isDarkTheme ? cfg.softTint : cfg.softTint,
              }}
            >
              <p
                className="text-[10px] font-bold tracking-[0.26em] uppercase"
                style={{ color: cfg.accentGold }}
              >
                Menuju Hari Bahagia
              </p>
              <h2 className="mt-1.5 font-luxury text-3xl italic">Hitung Mundur</h2>

              {/* Mini Month Calendar Grid */}
              <div
                className="mx-auto mt-6 max-w-[290px] rounded-2xl border p-5 shadow-sm"
                style={{
                  backgroundColor: cfg.cardBg,
                  borderColor: `${cfg.accentGold}3D`,
                }}
              >
                <p className="font-luxury text-xl font-medium">
                  {cfg.calendarMonthLabel}
                </p>
                <div className="mt-3 grid grid-cols-7 gap-1 text-[10px] font-semibold opacity-60">
                  {["M", "S", "S", "R", "K", "J", "S"].map((d, i) => (
                    <span key={i}>{d}</span>
                  ))}
                </div>
                <div className="mt-1.5 grid grid-cols-7 gap-1 text-xs tabular-nums">
                  {calendarCells.map((day, idx) => {
                    const isWeddingDay = day === cfg.highlightDay;
                    return (
                      <span
                        key={idx}
                        className={`flex h-7 items-center justify-center rounded-full ${
                          isWeddingDay ? "font-bold shadow-xs" : "opacity-85"
                        }`}
                        style={
                          isWeddingDay
                            ? { backgroundColor: cfg.btnBg, color: cfg.btnInk }
                            : undefined
                        }
                      >
                        {day ?? ""}
                      </span>
                    );
                  })}
                </div>
              </div>

              {/* 4-Unit Countdown */}
              <div className="mx-auto mt-6 grid max-w-[300px] grid-cols-4 gap-2">
                {[
                  { val: countdown.days, label: "Hari" },
                  { val: countdown.hours, label: "Jam" },
                  { val: countdown.minutes, label: "Menit" },
                  { val: countdown.seconds, label: "Detik" },
                ].map((item) => (
                  <div
                    key={item.label}
                    className="rounded-xl border py-2.5"
                    style={{
                      backgroundColor: cfg.cardBg,
                      borderColor: `${cfg.accentGold}35`,
                    }}
                  >
                    <p
                      className="font-luxury text-2xl font-medium italic tabular-nums"
                      style={{ color: cfg.primary }}
                    >
                      {String(item.val).padStart(2, "0")}
                    </p>
                    <p className="mt-0.5 text-[9px] font-bold tracking-[0.14em] uppercase opacity-70">
                      {item.label}
                    </p>
                  </div>
                ))}
              </div>

              <button
                type="button"
                onClick={handleDownloadIcs}
                className="mt-5 inline-flex h-10 items-center gap-2 rounded-full border px-5 text-xs font-semibold cursor-pointer"
                style={{
                  borderColor: cfg.primary,
                  color: cfg.primary,
                  backgroundColor: cfg.cardBg,
                }}
              >
                <CalendarPlus className="h-3.5 w-3.5" />
                Simpan Tanggal ke Kalender
              </button>
            </section>

            {/* ----------------------------------------------------------
                SECTION 5: RANGKAIAN ACARA (PENDAPA AGENDA CARDS + MAPS + QR)
            ---------------------------------------------------------- */}
            <section
              className="px-6 py-12"
              style={{ backgroundColor: cfg.paperBg }}
            >
              <div className="text-center">
                <p
                  className="text-[10px] font-bold tracking-[0.26em] uppercase"
                  style={{ color: cfg.accentGold }}
                >
                  Save The Date
                </p>
                <h2 className="mt-1.5 font-luxury text-3xl">Waktu &amp; Tempat</h2>
              </div>

              <div className="mt-6 space-y-5">
                {[
                  { title: "Akad Nikah", time: cfg.akadTime, place: cfg.akadPlace },
                  { title: "Resepsi", time: cfg.resepsiTime, place: cfg.resepsiPlace },
                ].map((ev) => (
                  <div
                    key={ev.title}
                    className="rounded-[24px] border p-6 text-center shadow-xs"
                    style={{
                      backgroundColor: cfg.cardBg,
                      borderColor: `${cfg.accentGold}40`,
                    }}
                  >
                    <div
                      className="mx-auto flex h-11 w-11 items-center justify-center rounded-full"
                      style={{ backgroundColor: cfg.softTint, color: cfg.primary }}
                    >
                      <MapPin className="h-4.5 w-4.5" />
                    </div>
                    <h3 className="mt-3 font-luxury text-3xl font-normal">
                      {ev.title}
                    </h3>
                    <p className="mt-1 text-xs font-semibold" style={{ color: cfg.mutedInk }}>
                      {cfg.dateFull}
                    </p>
                    <div
                      className="mx-auto mt-3 inline-flex items-center rounded-full px-4 py-1.5 text-[11px] font-bold tracking-wider uppercase tabular-nums"
                      style={{ backgroundColor: cfg.softTint, color: cfg.primary }}
                    >
                      {ev.time}
                    </div>
                    <p className="mt-3 font-luxury text-lg font-semibold">
                      {ev.place}
                    </p>
                    <p
                      className="mt-1 text-xs leading-relaxed"
                      style={{ color: cfg.mutedInk }}
                    >
                      {cfg.venueAddress}
                    </p>
                  </div>
                ))}

                <div className="flex flex-wrap justify-center gap-2.5 pt-1">
                  <a
                    href={cfg.mapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex h-10 items-center gap-1.5 rounded-full px-5 text-xs font-semibold"
                    style={{ backgroundColor: cfg.btnBg, color: cfg.btnInk }}
                  >
                    <MapPin className="h-3.5 w-3.5" />
                    Lihat Lokasi
                    <ExternalLink className="h-3 w-3" />
                  </a>
                  <button
                    type="button"
                    onClick={() => setQrOpen(true)}
                    className="inline-flex h-10 items-center gap-1.5 rounded-full border px-4 text-xs font-semibold cursor-pointer"
                    style={{
                      borderColor: cfg.primary,
                      color: cfg.primary,
                      backgroundColor: cfg.cardBg,
                    }}
                  >
                    <QrCode className="h-3.5 w-3.5" />
                    QR Check-in
                  </button>
                </div>
              </div>
            </section>

            {/* ----------------------------------------------------------
                SECTION 6: EDITORIAL ASYMMETRIC GALLERY (OUR MOMENTS)
            ---------------------------------------------------------- */}
            <section
              className="px-6 py-12"
              style={{ backgroundColor: cfg.softTint }}
            >
              <div className="text-center">
                <p
                  className="text-[10px] font-bold tracking-[0.26em] uppercase"
                  style={{ color: cfg.accentGold }}
                >
                  Our Moments
                </p>
                <h2 className="mt-1.5 font-luxury text-3xl italic">
                  Galeri Kenangan
                </h2>
              </div>

              {/* 1 - 2 - 1 Archival Print Grid */}
              <div className="mt-6 space-y-3">
                <div className="bg-white p-2 shadow-sm">
                  <img
                    src={cfg.galleryPhotos[0]}
                    alt={`${cfg.coupleShort} 1`}
                    className={`aspect-[16/10] w-full object-cover ${
                      isEditorialNoir ? "grayscale contrast-125" : ""
                    }`}
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-white p-2 shadow-sm">
                    <img
                      src={cfg.galleryPhotos[1]}
                      alt={`${cfg.coupleShort} 2`}
                      className={`aspect-[3/4] w-full object-cover ${
                        isEditorialNoir ? "grayscale contrast-125" : ""
                      }`}
                    />
                  </div>
                  <div className="bg-white p-2 shadow-sm">
                    <img
                      src={cfg.galleryPhotos[2]}
                      alt={`${cfg.coupleShort} 3`}
                      className={`aspect-[3/4] w-full object-cover ${
                        isEditorialNoir ? "grayscale contrast-125" : ""
                      }`}
                    />
                  </div>
                </div>
                <div className="bg-white p-2 shadow-sm">
                  <img
                    src={cfg.galleryPhotos[3]}
                    alt={`${cfg.coupleShort} 4`}
                    className={`aspect-[16/10] w-full object-cover ${
                      isEditorialNoir ? "grayscale contrast-125" : ""
                    }`}
                  />
                </div>
              </div>
            </section>

            {/* ----------------------------------------------------------
                SECTION 7: LOVE STORY MILESTONES
            ---------------------------------------------------------- */}
            <section
              className="px-6 py-12"
              style={{ backgroundColor: cfg.paperBg }}
            >
              <div className="text-center">
                <p
                  className="text-[10px] font-bold tracking-[0.26em] uppercase"
                  style={{ color: cfg.accentGold }}
                >
                  Perjalanan Cinta
                </p>
                <h2 className="mt-1.5 font-luxury text-3xl">Love Story</h2>
              </div>

              <div className="mt-6 space-y-4">
                {cfg.loveStory.map((story) => (
                  <div
                    key={story.year}
                    className="rounded-2xl border p-5"
                    style={{
                      backgroundColor: cfg.cardBg,
                      borderColor: `${cfg.accentGold}38`,
                    }}
                  >
                    <span
                      className="rounded-full px-2.5 py-0.5 text-[11px] font-bold tabular-nums"
                      style={{ backgroundColor: cfg.softTint, color: cfg.primary }}
                    >
                      {story.year}
                    </span>
                    <h3 className="mt-2.5 font-luxury text-xl font-semibold">
                      {story.title}
                    </h3>
                    <p
                      className="mt-1 text-xs leading-relaxed"
                      style={{ color: cfg.mutedInk }}
                    >
                      {story.detail}
                    </p>
                  </div>
                ))}
              </div>
            </section>

            {/* ----------------------------------------------------------
                SECTION 8: AMPLOP DIGITAL (TANDA KASIH)
            ---------------------------------------------------------- */}
            <section
              className="px-6 py-12 text-center"
              style={{ backgroundColor: cfg.softTint }}
            >
              <p
                className="text-[10px] font-bold tracking-[0.26em] uppercase"
                style={{ color: cfg.accentGold }}
              >
                Tanda Kasih
              </p>
              <h2 className="mt-1.5 font-luxury text-3xl">Hadiah Digital</h2>
              <p className="mt-2 text-xs leading-relaxed" style={{ color: cfg.mutedInk }}>
                Doa restu Anda merupakan karunia terindah bagi kami. Namun jika berkehendak
                memberi tanda kasih, tersedia tautan rekening berikut:
              </p>

              <div
                className="mx-auto mt-5 max-w-sm rounded-2xl border p-5 shadow-xs"
                style={{
                  backgroundColor: cfg.cardBg,
                  borderColor: `${cfg.accentGold}45`,
                }}
              >
                <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase" style={{ color: cfg.primary }}>
                  <Wallet className="h-4 w-4" />
                  {cfg.bank.name}
                </div>
                <p className="mt-2 font-mono text-xl font-bold tracking-wider tabular-nums">
                  {cfg.bank.number}
                </p>
                <p className="mt-1 text-xs" style={{ color: cfg.mutedInk }}>
                  a.n. {cfg.bank.owner}
                </p>
                <button
                  type="button"
                  onClick={handleCopyAccount}
                  className="mt-4 inline-flex h-9 items-center gap-1.5 rounded-full px-5 text-xs font-semibold cursor-pointer"
                  style={{ backgroundColor: cfg.btnBg, color: cfg.btnInk }}
                >
                  {copiedBank ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                  {copiedBank ? "Nomor Rekening Tersalin" : "Salin Nomor Rekening"}
                </button>
              </div>
            </section>

            {/* ----------------------------------------------------------
                SECTION 9: KEHADIRAN & UCAPAN (UNDERLINE RSVP + WISHES)
            ---------------------------------------------------------- */}
            <section
              className="px-6 py-12"
              style={{ backgroundColor: cfg.paperBg }}
            >
              <div className="text-center">
                <p
                  className="text-[10px] font-bold tracking-[0.26em] uppercase"
                  style={{ color: cfg.accentGold }}
                >
                  Kehadiran &amp; Ucapan
                </p>
                <h2 className="mt-1.5 font-luxury text-3xl">Buku Tamu &amp; RSVP</h2>
              </div>

              <form
                onSubmit={handleSubmitRsvp}
                className="mt-6 space-y-4 rounded-2xl border p-5"
                style={{
                  backgroundColor: cfg.cardBg,
                  borderColor: `${cfg.accentGold}3D`,
                }}
              >
                <div>
                  <label htmlFor="luxury-rsvp-name" className="block text-[11px] font-semibold uppercase tracking-wider opacity-75">
                    Nama Lengkap
                  </label>
                  <input
                    id="luxury-rsvp-name"
                    type="text"
                    required
                    value={rsvpName}
                    onChange={(e) => setRsvpName(e.target.value)}
                    placeholder="Nama tamu..."
                    className="mt-1 h-10 w-full border-b border-current/25 bg-transparent text-sm focus:border-current focus:outline-none"
                  />
                </div>

                <div>
                  <label htmlFor="luxury-rsvp-status" className="block text-[11px] font-semibold uppercase tracking-wider opacity-75">
                    Konfirmasi Kehadiran
                  </label>
                  <select
                    id="luxury-rsvp-status"
                    value={rsvpStatus}
                    onChange={(e) => setRsvpStatus(e.target.value)}
                    className="mt-1 h-10 w-full border-b border-current/25 bg-transparent text-sm focus:outline-none"
                    style={{ backgroundColor: cfg.cardBg, color: cfg.ink }}
                  >
                    <option value="Hadir">Hadir</option>
                    <option value="Masih Ragu">Masih Ragu</option>
                    <option value="Berhalangan">Berhalangan Hadir</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="luxury-rsvp-msg" className="block text-[11px] font-semibold uppercase tracking-wider opacity-75">
                    Doa &amp; Ucapan
                  </label>
                  <textarea
                    id="luxury-rsvp-msg"
                    rows={2}
                    required
                    value={rsvpMsg}
                    onChange={(e) => setRsvpMsg(e.target.value)}
                    placeholder="Tulis doa terbaik untuk kedua mempelai..."
                    className="mt-1 w-full border-b border-current/25 bg-transparent py-1.5 text-sm focus:border-current focus:outline-none"
                  />
                </div>

                <div className="flex flex-wrap items-center gap-3 pt-1">
                  <button
                    type="submit"
                    className="inline-flex h-10 items-center rounded-full px-6 text-xs font-semibold tracking-wider uppercase cursor-pointer"
                    style={{ backgroundColor: cfg.btnBg, color: cfg.btnInk }}
                  >
                    Kirim Ucapan
                  </button>
                  {rsvpSuccess && (
                    <span className="text-xs font-semibold" style={{ color: cfg.primary }}>
                      ✓ Ucapan tercatat
                    </span>
                  )}
                </div>
              </form>

              <div className="mt-5 space-y-2.5">
                {wishes.map((w) => (
                  <div
                    key={w.id}
                    className="rounded-xl border p-4"
                    style={{
                      backgroundColor: cfg.cardBg,
                      borderColor: `${cfg.accentGold}2E`,
                    }}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-luxury text-base font-semibold">
                        {w.name}
                      </span>
                      <span
                        className="rounded-full px-2.5 py-0.5 text-[10px] font-bold"
                        style={{ backgroundColor: cfg.softTint, color: cfg.primary }}
                      >
                        {w.status}
                      </span>
                    </div>
                    <p
                      className="mt-1 text-xs leading-relaxed"
                      style={{ color: cfg.mutedInk }}
                    >
                      {w.message}
                    </p>
                  </div>
                ))}
              </div>
            </section>

            {/* ----------------------------------------------------------
                SECTION 10: CLOSING & TURUT MENGUNDANG
            ---------------------------------------------------------- */}
            <footer
              className="relative overflow-hidden px-6 pt-8 pb-16 text-center"
              style={{ backgroundColor: cfg.softTint }}
            >
              <div className="mx-auto flex justify-center">
                {isHeritageSunda ? (
                  <SundaSigerCrest color={cfg.accentGold} className="h-12 w-36" />
                ) : (
                  <HangingFernSprig color={cfg.primary} className="h-20 w-24" />
                )}
              </div>

              <p className="mt-4 font-luxury text-4xl" style={{ color: cfg.primary }}>
                {cfg.monogram}
              </p>
              <p className="mt-2 font-serif text-sm" style={{ color: cfg.mutedInk }}>
                Terima kasih atas doa dan kehadirannya.
              </p>

              {/* Turut Mengundang */}
              <div
                className="mx-auto mt-7 max-w-sm rounded-2xl border p-5 text-xs"
                style={{
                  backgroundColor: cfg.cardBg,
                  borderColor: `${cfg.accentGold}38`,
                }}
              >
                <p
                  className="text-[10px] font-bold tracking-[0.2em] uppercase"
                  style={{ color: cfg.accentGold }}
                >
                  Turut Mengundang
                </p>
                <div className="mt-3 grid gap-3 sm:grid-cols-2">
                  <div>
                    <p className="font-bold">Pihak Wanita</p>
                    {cfg.turutBride.map((line) => (
                      <p key={line} className="mt-0.5" style={{ color: cfg.mutedInk }}>
                        {line}
                      </p>
                    ))}
                  </div>
                  <div>
                    <p className="font-bold">Pihak Laki-Laki</p>
                    {cfg.turutGroom.map((line) => (
                      <p key={line} className="mt-0.5" style={{ color: cfg.mutedInk }}>
                        {line}
                      </p>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-6 flex items-center justify-center gap-4 text-[11px] opacity-75">
                <button
                  type="button"
                  onClick={() => {
                    setOpened(false);
                    audioRef.current?.stop();
                    setMusicPlaying(false);
                  }}
                  className="inline-flex items-center gap-1 underline underline-offset-4 cursor-pointer"
                >
                  <RefreshCw className="h-3 w-3" />
                  Lihat Sampul
                </button>
                <span>·</span>
                <span>Kado Digital</span>
              </div>
            </footer>
          </div>
        )}
      </div>

      {/* QR Check-in Modal */}
      {qrOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="QR Check-in Tamu"
          onClick={(e) => {
            if (e.target === e.currentTarget) setQrOpen(false);
          }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs"
        >
          <div className="w-full max-w-xs rounded-[24px] bg-white p-6 text-center text-[#18181D] shadow-2xl">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold tracking-wider uppercase" style={{ color: "#1B5E47" }}>
                Guest Check-in Pass
              </span>
              <button
                type="button"
                onClick={() => setQrOpen(false)}
                aria-label="Tutup modal QR"
                className="inline-flex h-8 w-8 items-center justify-center rounded-full hover:bg-black/5 cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="mx-auto my-5 flex h-40 w-40 items-center justify-center rounded-2xl border-2 border-dashed border-black/15">
              <QrCode className="h-24 w-24 text-[#16201B]" />
            </div>
            <p className="font-luxury text-xl font-semibold">{guestName}</p>
            <p className="mt-1 text-xs text-[#5B5864]">
              Tunjukkan QR ini kepada penerima tamu saat hari-H.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
