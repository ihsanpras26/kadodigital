"use client";

import { useEffect, useState, type FormEvent } from "react";
import QRCode from "qrcode";
import {
  CalendarPlus,
  Check,
  Copy,
  Download,
  ExternalLink,
  Gift,
  Heart,
  MapPin,
  QrCode,
  Sparkles,
  X,
} from "lucide-react";
import {
  CELESTIAL_STATIONS,
  type CelestialStationId,
  type CelestialWeddingPayload,
  type CelestialWishItem,
} from "./celestialData";
import { slugifyCouple } from "./celestialShareCodec";

interface CelestialStationModalProps {
  stationId: CelestialStationId | null;
  payload: CelestialWeddingPayload;
  guestName?: string | null;
  wishes: CelestialWishItem[];
  onClose: () => void;
  onNavigateStation: (stationId: CelestialStationId) => void;
  onSubmitWish: (wish: {
    name: string;
    attendance: CelestialWishItem["attendance"];
    message: string;
  }) => void;
  onNotify: (msg: string) => void;
}

interface CountdownParts {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isPast: boolean;
}

function computeCountdown(isoTarget: string): CountdownParts {
  const targetMs = new Date(isoTarget).getTime();
  if (Number.isNaN(targetMs)) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, isPast: false };
  }
  const diff = targetMs - Date.now();
  if (diff <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, isPast: true };
  }
  const days = Math.floor(diff / 86400000);
  const hours = Math.floor((diff % 86400000) / 3600000);
  const minutes = Math.floor((diff % 3600000) / 60000);
  const seconds = Math.floor((diff % 60000) / 1000);
  return { days, hours, minutes, seconds, isPast: false };
}

export function CelestialStationModal({
  stationId,
  payload,
  guestName,
  wishes,
  onClose,
  onNavigateStation,
  onSubmitWish,
  onNotify,
}: CelestialStationModalProps) {
  const [countdown, setCountdown] = useState<CountdownParts>(() =>
    computeCountdown(payload.isoDate),
  );
  const [activePhotoIdx, setActivePhotoIdx] = useState(0);
  const [bintangTab, setBintangTab] = useState<"doa" | "qr" | "amplop">("doa");
  const [wishName, setWishName] = useState(guestName?.trim() || "");
  const [wishAttendance, setWishAttendance] =
    useState<CelestialWishItem["attendance"]>("Hadir");
  const [wishMessage, setWishMessage] = useState("");
  const [qrDataUrl, setQrDataUrl] = useState<string | null>(null);
  const [copiedBank, setCopiedBank] = useState(false);

  useEffect(() => {
    setCountdown(computeCountdown(payload.isoDate));
    const id = window.setInterval(() => {
      setCountdown(computeCountdown(payload.isoDate));
    }, 1000);
    return () => window.clearInterval(id);
  }, [payload.isoDate]);

  useEffect(() => {
    if (guestName && !wishName) {
      setWishName(guestName.trim());
    }
  }, [guestName, wishName]);

  useEffect(() => {
    if (!stationId) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [stationId, onClose]);

  const inviteSlug = slugifyCouple(payload.groomName, payload.brideName);
  const qrTicketCode = `KADO-ISTANA-${inviteSlug.toUpperCase()}-${(guestName?.trim() || "VIP")
    .toUpperCase()
    .replace(/[^A-Z0-9]/g, "")
    .slice(0, 8)}`;

  useEffect(() => {
    if (stationId !== "bintang") return;
    let cancelled = false;
    void QRCode.toDataURL(
      JSON.stringify({
        code: qrTicketCode,
        couple: payload.coupleDisplay,
        guest: guestName?.trim() || "Tamu Kehormatan",
        date: payload.dateDisplay,
      }),
      {
        width: 280,
        margin: 2,
        color: { dark: "#0D132B", light: "#FAF6EE" },
      },
    ).then((url) => {
      if (!cancelled) setQrDataUrl(url);
    });
    return () => {
      cancelled = true;
    };
  }, [stationId, qrTicketCode, payload.coupleDisplay, payload.dateDisplay, guestName]);

  if (!stationId) return null;

  const meta = CELESTIAL_STATIONS.find((s) => s.id === stationId);
  const activePhoto = payload.photos[activePhotoIdx] ?? payload.photos[0]!;

  function handleDownloadIcs() {
    const startDate = new Date(payload.isoDate);
    const pad = (n: number) => String(n).padStart(2, "0");
    const fmt = (d: Date) =>
      `${d.getUTCFullYear()}${pad(d.getUTCMonth() + 1)}${pad(d.getUTCDate())}T${pad(d.getUTCHours())}${pad(d.getUTCMinutes())}00Z`;
    const end = new Date(startDate.getTime() + 4 * 3600000);
    const ics = [
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      "PRODID:-//Kado Digital//Istana Awan 3D//ID",
      "BEGIN:VEVENT",
      `SUMMARY:Pernikahan ${payload.coupleDisplay}`,
      `DTSTART:${Number.isNaN(startDate.getTime()) ? "20261018T010000Z" : fmt(startDate)}`,
      `DTEND:${Number.isNaN(end.getTime()) ? "20261018T050000Z" : fmt(end)}`,
      `LOCATION:${payload.venueName}, ${payload.venueAddress}`,
      `DESCRIPTION:${payload.openingQuote}`,
      "END:VEVENT",
      "END:VCALENDAR",
    ].join("\r\n");

    const blob = new Blob([ics], { type: "text/calendar;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `undangan-${inviteSlug}.ics`;
    a.click();
    URL.revokeObjectURL(url);
    onNotify("File kalender .ics berhasil diunduh.");
  }

  function handleDownloadStoryCard() {
    const w = 1080;
    const h = 1920;
    const canvas = document.createElement("canvas");
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const bg = ctx.createLinearGradient(0, 0, 0, h);
    bg.addColorStop(0, "#070B1E");
    bg.addColorStop(0.5, "#141E49");
    bg.addColorStop(1, "#090E24");
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, w, h);

    // Subtle glowing radial aurora in middle
    const halo = ctx.createRadialGradient(w / 2, 760, 40, w / 2, 760, 520);
    halo.addColorStop(0, "rgba(239, 200, 110, 0.24)");
    halo.addColorStop(0.55, "rgba(136, 166, 245, 0.10)");
    halo.addColorStop(1, "rgba(8, 13, 36, 0)");
    ctx.fillStyle = halo;
    ctx.fillRect(0, 0, w, h);

    // Outer filigree gold border
    ctx.strokeStyle = "rgba(239, 200, 110, 0.55)";
    ctx.lineWidth = 4;
    ctx.strokeRect(56, 56, w - 112, h - 112);
    ctx.strokeStyle = "rgba(239, 200, 110, 0.22)";
    ctx.lineWidth = 2;
    ctx.strokeRect(76, 76, w - 152, h - 152);

    // Twinkling stars
    ctx.fillStyle = "#FFF4CE";
    for (let i = 0; i < 65; i++) {
      const sx = 100 + ((i * 193) % (w - 200));
      const sy = 100 + ((i * 271) % 620);
      ctx.beginPath();
      ctx.arc(sx, sy, (i % 3) + 1.4, 0, Math.PI * 2);
      ctx.fill();
    }

    // Crescent & Orbital Rings Artwork
    ctx.strokeStyle = "#EFC86E";
    ctx.lineWidth = 6;
    ctx.beginPath();
    ctx.ellipse(w / 2, 540, 260, 110, -0.18, 0, Math.PI * 2);
    ctx.stroke();

    ctx.strokeStyle = "rgba(168, 198, 255, 0.72)";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.ellipse(w / 2, 540, 210, 86, 0.22, 0, Math.PI * 2);
    ctx.stroke();

    ctx.fillStyle = "#F7DC94";
    ctx.font = "600 28px monospace";
    ctx.textAlign = "center";
    ctx.fillText("ISTANA AWAN 3D · UNDANGAN PERNIKAHAN", w / 2, 220);

    ctx.fillStyle = "#FAF6EE";
    ctx.font = "italic 400 116px Georgia, serif";
    ctx.fillText(`${payload.groomShort} & ${payload.brideShort}`, w / 2, 860);

    ctx.fillStyle = "#EFC86E";
    ctx.font = "600 34px sans-serif";
    ctx.fillText(payload.dateDisplay.toUpperCase(), w / 2, 985);

    ctx.fillStyle = "#CBD6F6";
    ctx.font = "400 30px sans-serif";
    ctx.fillText(`Akad ${payload.akadTime}  ·  Resepsi ${payload.resepsiTime}`, w / 2, 1055);
    ctx.fillText(payload.venueName, w / 2, 1115);

    // Guest block
    ctx.fillStyle = "rgba(13, 19, 43, 0.8)";
    ctx.fillRect(190, 1260, w - 380, 190);
    ctx.strokeStyle = "rgba(239, 200, 110, 0.45)";
    ctx.strokeRect(190, 1260, w - 380, 190);

    ctx.fillStyle = "#9EB0DE";
    ctx.font = "600 24px monospace";
    ctx.fillText("KHUSUS MENGUNDANG", w / 2, 1320);

    ctx.fillStyle = "#FAF6EE";
    ctx.font = "700 42px sans-serif";
    ctx.fillText(guestName?.trim() || "Tamu Kehormatan", w / 2, 1392);

    ctx.fillStyle = "rgba(247, 220, 148, 0.78)";
    ctx.font = "400 24px monospace";
    ctx.fillText("TERBANG BERSAMA DI ISTANA AWAN · KADO DIGITAL", w / 2, 1740);

    canvas.toBlob((blob) => {
      if (!blob) return;
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `kartu-istana-awan-${inviteSlug}.png`;
      a.click();
      URL.revokeObjectURL(url);
      onNotify("Kartu Undangan Story 9:16 siap disimpan!");
    }, "image/png");
  }

  function handleWishFormSubmit(e: FormEvent) {
    e.preventDefault();
    const cleanName = wishName.trim();
    const cleanMsg = wishMessage.trim();
    if (!cleanName || !cleanMsg) return;
    onSubmitWish({
      name: cleanName,
      attendance: wishAttendance,
      message: cleanMsg,
    });
    setWishMessage("");
  }

  function handleCopyBank() {
    void navigator.clipboard.writeText(payload.bankAccount.number.replace(/\s+/g, ""));
    setCopiedBank(true);
    onNotify("Nomor rekening berhasil disalin.");
    window.setTimeout(() => setCopiedBank(false), 1800);
  }

  return (
    <div
      className="fixed inset-0 z-40 flex items-end justify-center bg-[#040716]/55 p-3 backdrop-blur-xs sm:items-center sm:p-5"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={meta?.title ?? "Detail Stasiun"}
    >
      <div
        className="celestial-glass relative max-h-[85dvh] w-full max-w-[540px] overflow-y-auto rounded-[24px] p-5 text-[#FAF6EE] sm:p-6"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-3 border-b border-[#EFC86E]/20 pb-4">
          <div>
            <p className="celestial-mono text-[10.5px] font-bold tracking-[0.2em] text-[#EFC86E] uppercase">
              {meta?.shortLabel}
            </p>
            <h2 className="celestial-serif mt-1 text-2xl font-normal italic text-[#FAF6EE] sm:text-3xl">
              {meta?.title}
            </h2>
            <p className="mt-1 text-xs text-[#A8B7E2]">{meta?.subtitle}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Tutup panel"
            className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-[#EFC86E]/30 bg-[#0D132B]/70 text-[#EFC86E] hover:bg-[#19234A] cursor-pointer"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* STATION 1: GERBANG */}
        {stationId === "gerbang" && (
          <div className="mt-5 space-y-4">
            <div className="rounded-2xl border border-[#EFC86E]/22 bg-[#080D24]/65 p-4 text-center">
              <p className="celestial-mono text-[10px] tracking-[0.18em] text-[#EFC86E] uppercase">
                Tamu Kehormatan
              </p>
              <p className="mt-1 text-lg font-semibold text-[#FAF6EE]">
                {guestName?.trim() || "Sahabat & Keluarga Terkasih"}
              </p>
              <p className="mt-2.5 text-xs leading-relaxed text-[#C2CEF0] italic">
                &ldquo;{payload.openingQuote}&rdquo;
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-2xl border border-[#EFC86E]/20 bg-[#0B112E]/75 p-4">
                <p className="celestial-mono text-[10px] text-[#EFC86E] uppercase">
                  Mempelai Pria
                </p>
                <p className="celestial-serif mt-1 text-xl italic text-[#FAF6EE]">
                  {payload.groomName}
                </p>
                <p className="mt-1.5 text-xs leading-relaxed text-[#A7B6E0]">
                  {payload.groomParents}
                </p>
              </div>
              <div className="rounded-2xl border border-[#EFC86E]/20 bg-[#0B112E]/75 p-4">
                <p className="celestial-mono text-[10px] text-[#EFC86E] uppercase">
                  Mempelai Wanita
                </p>
                <p className="celestial-serif mt-1 text-xl italic text-[#FAF6EE]">
                  {payload.brideName}
                </p>
                <p className="mt-1.5 text-xs leading-relaxed text-[#A7B6E0]">
                  {payload.brideParents}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => onNavigateStation("altar")}
              className="celestial-gold-btn h-11 w-full rounded-full text-sm font-bold cursor-pointer"
            >
              Lanjut ke Istana Altar
            </button>
          </div>
        )}

        {/* STATION 2: ALTAR */}
        {stationId === "altar" && (
          <div className="mt-5 space-y-4">
            {/* Countdown Grid */}
            <div className="rounded-2xl border border-[#EFC86E]/25 bg-[#080D24]/70 p-4 text-center">
              <p className="celestial-mono text-[10px] tracking-[0.18em] text-[#EFC86E] uppercase">
                {countdown.isPast ? "Hari Bahagia Telah Tiba" : "Menuju Hari Bahagia"}
              </p>
              <div className="mt-3 grid grid-cols-4 gap-2">
                {[
                  ["Hari", countdown.days],
                  ["Jam", countdown.hours],
                  ["Menit", countdown.minutes],
                  ["Detik", countdown.seconds],
                ].map(([label, val]) => (
                  <div
                    key={String(label)}
                    className="rounded-xl border border-[#EFC86E]/18 bg-[#121A40]/85 py-2.5"
                  >
                    <p className="celestial-mono text-xl font-bold text-[#F7DC94] tabular-nums">
                      {String(val).padStart(2, "0")}
                    </p>
                    <p className="mt-0.5 text-[10px] text-[#A9B9E3]">{label}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Akad & Resepsi */}
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-2xl border border-[#EFC86E]/20 bg-[#0B112E]/75 p-4">
                <p className="celestial-mono text-[10px] text-[#EFC86E] uppercase">
                  Akad / Pemberkatan
                </p>
                <p className="mt-1 text-sm font-semibold text-[#FAF6EE]">
                  {payload.dateDisplay}
                </p>
                <p className="mt-1 text-xs text-[#C7D3F2]">{payload.akadTime}</p>
              </div>
              <div className="rounded-2xl border border-[#EFC86E]/20 bg-[#0B112E]/75 p-4">
                <p className="celestial-mono text-[10px] text-[#EFC86E] uppercase">
                  Resepsi Bintang
                </p>
                <p className="mt-1 text-sm font-semibold text-[#FAF6EE]">
                  {payload.dateDisplay}
                </p>
                <p className="mt-1 text-xs text-[#C7D3F2]">{payload.resepsiTime}</p>
              </div>
            </div>

            {/* Venue */}
            <div className="rounded-2xl border border-[#EFC86E]/20 bg-[#0B112E]/75 p-4">
              <div className="flex items-start gap-2.5">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-[#EFC86E]" />
                <div>
                  <p className="text-sm font-semibold text-[#FAF6EE]">
                    {payload.venueName}
                  </p>
                  <p className="mt-1 text-xs leading-relaxed text-[#A8B7E2]">
                    {payload.venueAddress}
                  </p>
                </div>
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                <a
                  href={payload.mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex h-9 items-center gap-1.5 rounded-full border border-[#EFC86E]/35 bg-[#121A40] px-3.5 text-xs font-semibold text-[#FAF6EE] hover:bg-[#192456]"
                >
                  <span>Buka Google Maps</span>
                  <ExternalLink className="h-3.5 w-3.5 text-[#EFC86E]" />
                </a>
                <button
                  type="button"
                  onClick={handleDownloadIcs}
                  className="inline-flex h-9 items-center gap-1.5 rounded-full border border-[#EFC86E]/35 bg-[#121A40] px-3.5 text-xs font-semibold text-[#FAF6EE] hover:bg-[#192456] cursor-pointer"
                >
                  <CalendarPlus className="h-3.5 w-3.5 text-[#EFC86E]" />
                  <span>Simpan Kalender (.ics)</span>
                </button>
              </div>
            </div>

            <button
              type="button"
              onClick={handleDownloadStoryCard}
              className="celestial-gold-btn inline-flex h-11 w-full items-center justify-center gap-2 rounded-full text-sm font-bold cursor-pointer"
            >
              <Download className="h-4 w-4" />
              <span>Simpan Kartu Undangan Story (9:16 PNG)</span>
            </button>
          </div>
        )}

        {/* STATION 3: KISAH */}
        {stationId === "kisah" && (
          <div className="mt-5 space-y-3">
            {payload.storyChapters.map((item) => (
              <div
                key={item.chapter}
                className="relative rounded-2xl border border-[#EFC86E]/20 bg-[#0B112E]/75 p-4 pl-10"
              >
                <span className="absolute top-4.5 left-3.5 flex h-4 w-4 items-center justify-center rounded-full border border-[#EFC86E] bg-[#162152]">
                  <Sparkles className="h-2.5 w-2.5 text-[#F7DC94]" />
                </span>
                <div className="flex items-center justify-between gap-2">
                  <span className="celestial-mono text-[10px] font-bold text-[#EFC86E] uppercase">
                    {item.chapter}
                  </span>
                  <span className="celestial-mono text-[10px] text-[#9FB1DF]">
                    {item.year}
                  </span>
                </div>
                <h3 className="celestial-serif mt-1 text-lg italic text-[#FAF6EE]">
                  {item.title}
                </h3>
                <p className="mt-1 text-xs leading-relaxed text-[#BDC9EC]">
                  {item.excerpt}
                </p>
              </div>
            ))}
          </div>
        )}

        {/* STATION 4: GALERI */}
        {stationId === "galeri" && (
          <div className="mt-5 space-y-4">
            <div className="overflow-hidden rounded-2xl border border-[#EFC86E]/30 bg-[#080D24]">
              <img
                src={activePhoto.src}
                alt={activePhoto.title}
                className="aspect-[4/3] w-full object-cover"
              />
              <div className="p-4">
                <div className="flex items-center justify-between gap-2">
                  <p className="celestial-serif text-xl italic text-[#FAF6EE]">
                    {activePhoto.title}
                  </p>
                  <span className="celestial-mono text-[10px] text-[#EFC86E] uppercase">
                    {activePhoto.dateLabel}
                  </span>
                </div>
                <p className="mt-1.5 text-xs leading-relaxed text-[#BAC6EA]">
                  {activePhoto.caption}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2.5">
              {payload.photos.map((photo, idx) => (
                <button
                  key={photo.id}
                  type="button"
                  onClick={() => setActivePhotoIdx(idx)}
                  className={`overflow-hidden rounded-xl border transition-all cursor-pointer ${
                    idx === activePhotoIdx
                      ? "border-[#EFC86E] ring-2 ring-[#EFC86E]/40"
                      : "border-white/15 opacity-70 hover:opacity-100"
                  }`}
                >
                  <img
                    src={photo.src}
                    alt={photo.title}
                    className="aspect-[4/3] w-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>
        )}

        {/* STATION 5: BINTANG DOA, RSVP, QR & AMPLOP */}
        {stationId === "bintang" && (
          <div className="mt-5 space-y-4">
            {/* Sub-tabs */}
            <div className="grid grid-cols-3 gap-1.5 rounded-full border border-[#EFC86E]/22 bg-[#080D24]/80 p-1">
              {[
                { id: "doa" as const, label: "Bintang Doa", icon: Heart },
                { id: "qr" as const, label: "QR Check-in", icon: QrCode },
                { id: "amplop" as const, label: "Amplop Digital", icon: Gift },
              ].map((tab) => {
                const Icon = tab.icon;
                const active = bintangTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setBintangTab(tab.id)}
                    className={`inline-flex h-9 items-center justify-center gap-1.5 rounded-full text-xs font-semibold transition-colors cursor-pointer ${
                      active
                        ? "bg-[#EFC86E] text-[#171107]"
                        : "text-[#C5D1F1] hover:text-white"
                    }`}
                  >
                    <Icon className="h-3.5 w-3.5" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>

            {bintangTab === "doa" && (
              <div className="space-y-4">
                <form
                  onSubmit={handleWishFormSubmit}
                  className="space-y-3 rounded-2xl border border-[#EFC86E]/22 bg-[#0B112E]/75 p-4"
                >
                  <div className="grid gap-3 sm:grid-cols-2">
                    <label className="block text-xs">
                      <span className="text-[#C7D3F2]">Nama Tamu</span>
                      <input
                        type="text"
                        required
                        value={wishName}
                        onChange={(e) => setWishName(e.target.value)}
                        placeholder="Nama lengkap kamu"
                        className="mt-1 h-10 w-full rounded-xl border border-[#EFC86E]/25 bg-[#080D24] px-3 text-sm text-[#FAF6EE] placeholder:text-[#6E7EAC] focus:border-[#EFC86E] focus:outline-none"
                      />
                    </label>
                    <label className="block text-xs">
                      <span className="text-[#C7D3F2]">Kehadiran</span>
                      <select
                        value={wishAttendance}
                        onChange={(e) =>
                          setWishAttendance(
                            e.target.value as CelestialWishItem["attendance"],
                          )
                        }
                        className="mt-1 h-10 w-full rounded-xl border border-[#EFC86E]/25 bg-[#080D24] px-3 text-sm text-[#FAF6EE] focus:border-[#EFC86E] focus:outline-none"
                      >
                        <option value="Hadir">Hadir</option>
                        <option value="Doa dari Jauh">Doa dari Jauh</option>
                        <option value="Masih Ragu">Masih Ragu</option>
                      </select>
                    </label>
                  </div>
                  <label className="block text-xs">
                    <span className="text-[#C7D3F2]">Ucapan &amp; Doa (Terbang jadi Bintang 3D)</span>
                    <textarea
                      rows={2}
                      required
                      value={wishMessage}
                      onChange={(e) => setWishMessage(e.target.value)}
                      placeholder="Tuliskan harapan hangat untuk mempelai..."
                      className="mt-1 w-full rounded-xl border border-[#EFC86E]/25 bg-[#080D24] p-3 text-sm text-[#FAF6EE] placeholder:text-[#6E7EAC] focus:border-[#EFC86E] focus:outline-none"
                    />
                  </label>
                  <button
                    type="submit"
                    className="celestial-gold-btn inline-flex h-10 w-full items-center justify-center gap-2 rounded-full text-xs font-bold cursor-pointer"
                  >
                    <Sparkles className="h-3.5 w-3.5" />
                    <span>Kirim &amp; Lepaskan Bintang Doa ke Langit</span>
                  </button>
                </form>

                <div className="space-y-2.5">
                  <p className="celestial-mono text-[10px] tracking-[0.16em] text-[#EFC86E] uppercase">
                    {wishes.length} Bintang Doa Mengorbit
                  </p>
                  {wishes.map((w) => (
                    <div
                      key={w.id}
                      className="rounded-xl border border-[#EFC86E]/15 bg-[#080D24]/75 p-3.5"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-xs font-semibold text-[#FAF6EE]">
                          {w.name}
                        </span>
                        <span className="rounded-full border border-[#EFC86E]/30 bg-[#15204D] px-2 py-0.5 text-[10px] text-[#F7DC94]">
                          {w.attendance}
                        </span>
                      </div>
                      <p className="mt-1.5 text-xs leading-relaxed text-[#C2CEF0]">
                        {w.message}
                      </p>
                      <p className="mt-1 text-[10px] text-[#7D8EBD]">
                        {w.timestamp}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {bintangTab === "qr" && (
              <div className="rounded-2xl border border-[#EFC86E]/25 bg-[#0B112E]/80 p-5 text-center">
                <p className="celestial-mono text-[10px] tracking-[0.18em] text-[#EFC86E] uppercase">
                  Tiket Check-In Resepsi
                </p>
                <p className="mt-1 text-base font-semibold text-[#FAF6EE]">
                  {guestName?.trim() || "Tamu Kehormatan"}
                </p>
                {qrDataUrl && (
                  <div className="mx-auto mt-4 inline-block rounded-2xl border-2 border-[#EFC86E] bg-[#FAF6EE] p-3">
                    <img
                      src={qrDataUrl}
                      alt="QR Check-in Tamu"
                      className="h-44 w-44"
                    />
                  </div>
                )}
                <p className="celestial-mono mt-3 text-xs text-[#F7DC94]">
                  {qrTicketCode}
                </p>
                <p className="mt-1 text-xs text-[#A5B4DF]">
                  Tunjukkan kode QR ini di meja penerima tamu {payload.venueName}.
                </p>
              </div>
            )}

            {bintangTab === "amplop" && (
              <div className="space-y-3 rounded-2xl border border-[#EFC86E]/25 bg-[#0B112E]/80 p-5">
                <p className="text-xs leading-relaxed text-[#C2CEF0]">
                  Doa restu Anda merupakan karunia terbesar bagi kami. Jika berkenan mengirimkan tanda kasih, dapat melalui rekening berikut:
                </p>
                <div className="rounded-2xl border border-[#EFC86E]/35 bg-gradient-to-br from-[#16204D] to-[#0B1028] p-4">
                  <p className="celestial-mono text-xs font-bold text-[#EFC86E]">
                    {payload.bankAccount.bank}
                  </p>
                  <p className="celestial-mono mt-2 text-2xl font-bold tracking-wide text-[#FAF6EE]">
                    {payload.bankAccount.number}
                  </p>
                  <p className="mt-1 text-xs text-[#BAC6EA]">
                    a.n. {payload.bankAccount.owner}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleCopyBank}
                  className="celestial-gold-btn inline-flex h-10 w-full items-center justify-center gap-2 rounded-full text-xs font-bold cursor-pointer"
                >
                  {copiedBank ? (
                    <>
                      <Check className="h-3.5 w-3.5" />
                      <span>Tersalin!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="h-3.5 w-3.5" />
                      <span>Salin Nomor Rekening</span>
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
