"use client";

import { useEffect, useRef, useState } from "react";
import QRCode from "qrcode";
import {
  CalendarPlus,
  Check,
  ChevronLeft,
  ChevronRight,
  Copy,
  MapPin,
  Mic,
  Pause,
  Play,
  QrCode,
  RotateCcw,
  Send,
} from "lucide-react";
import type {
  DesaStationId,
  DesaWishItem,
  DesaWorldPayload,
} from "@/data/desaWorldData";
import type { DesaAudioEngine } from "./audioEngine";
import { VillageCloseIcon, VillageStationIcon } from "./DesaIcons";

interface DesaStationModalProps {
  stationId: DesaStationId;
  visitedStations: DesaStationId[];
  payload: DesaWorldPayload;
  guestName: string | null;
  wishes: DesaWishItem[];
  audioEngine: DesaAudioEngine | null;
  onSelectStation: (id: DesaStationId) => void;
  onAddWish: (wish: Omit<DesaWishItem, "id" | "createdAt">) => void;
  onToast: (message: string) => void;
  onClose: () => void;
}

function CountdownGrid({ targetIso }: { targetIso: string }) {
  const [left, setLeft] = useState({ days: 0, hours: 0, mins: 0, secs: 0 });

  useEffect(() => {
    const compute = () => {
      const diff = Math.max(0, new Date(targetIso).getTime() - Date.now());
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const mins = Math.floor((diff / (1000 * 60)) % 60);
      const secs = Math.floor((diff / 1000) % 60);
      setLeft({ days, hours, mins, secs });
    };
    compute();
    const t = window.setInterval(compute, 1000);
    return () => window.clearInterval(t);
  }, [targetIso]);

  const items = [
    { label: "Hari", val: left.days },
    { label: "Jam", val: left.hours },
    { label: "Menit", val: left.mins },
    { label: "Detik", val: left.secs },
  ];

  return (
    <div className="grid grid-cols-4 gap-2 text-center">
      {items.map((item) => (
        <div
          key={item.label}
          className="rounded-[14px] border border-[#D4C2A3] bg-[#FFFBF2] px-2 py-2.5"
        >
          <p className="text-xl font-extrabold text-[#3E2B1E] tabular-nums sm:text-2xl">
            {String(item.val).padStart(2, "0")}
          </p>
          <p className="text-[10px] font-bold tracking-wider text-[#5C4633] uppercase">
            {item.label}
          </p>
        </div>
      ))}
    </div>
  );
}

function ScratchVoucherCard({
  prompt,
  secretTitle,
  secretBody,
  onRevealed,
}: {
  prompt: string;
  secretTitle: string;
  secretBody: string;
  onRevealed: () => void;
}) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [revealed, setRevealed] = useState(false);
  const scratchingRef = useRef(false);
  const scratchedCountRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const grad = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    grad.addColorStop(0, "#C99A4E");
    grad.addColorStop(0.5, "#DFB870");
    grad.addColorStop(1, "#B08037");
    ctx.globalCompositeOperation = "source-over";
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = "rgba(62, 43, 30, 0.2)";
    for (let x = 16; x < canvas.width; x += 28) {
      for (let y = 16; y < canvas.height; y += 24) {
        ctx.beginPath();
        ctx.arc(x, y, 2, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    ctx.fillStyle = "#3E2B1E";
    ctx.font = "800 15px Nunito, system-ui, sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("GOSOK LAPISAN EMAS DI SINI", canvas.width / 2, canvas.height / 2 + 5);
  }, []);

  const scratchAt = (clientX: number, clientY: number) => {
    if (revealed) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const rect = canvas.getBoundingClientRect();
    const x = ((clientX - rect.left) / rect.width) * canvas.width;
    const y = ((clientY - rect.top) / rect.height) * canvas.height;
    ctx.globalCompositeOperation = "destination-out";
    ctx.beginPath();
    ctx.arc(x, y, 22, 0, Math.PI * 2);
    ctx.fill();

    scratchedCountRef.current += 1;
    if (scratchedCountRef.current >= 14 && !revealed) {
      setRevealed(true);
      onRevealed();
    }
  };

  return (
    <div className="rounded-[18px] border-2 border-dashed border-[#B79B74] bg-[#FFFBF2] p-4 text-center">
      <p className="text-xs font-bold text-[#5C4633]">{prompt}</p>
      <div className="relative mt-3 h-36 w-full overflow-hidden rounded-[14px] border border-[#D4C2A3] bg-[#F7F1E3]">
        <div className="flex h-full flex-col items-center justify-center px-4 text-center">
          <p className="text-xs font-extrabold tracking-wider text-[#AD4B2C] uppercase">
            Kejutan Terbuka
          </p>
          <p className="mt-1 text-sm font-extrabold text-[#2A5C45]">
            {secretTitle}
          </p>
          <p className="mt-1 text-xs leading-relaxed text-[#5C4633]">
            {secretBody}
          </p>
        </div>
        {!revealed && (
          <canvas
            ref={canvasRef}
            width={420}
            height={160}
            onPointerDown={(e) => {
              scratchingRef.current = true;
              e.currentTarget.setPointerCapture(e.pointerId);
              scratchAt(e.clientX, e.clientY);
            }}
            onPointerMove={(e) => {
              if (!scratchingRef.current) return;
              scratchAt(e.clientX, e.clientY);
            }}
            onPointerUp={() => {
              scratchingRef.current = false;
            }}
            className="absolute inset-0 h-full w-full cursor-pointer touch-none"
          />
        )}
      </div>
      {!revealed && (
        <button
          type="button"
          onClick={() => {
            setRevealed(true);
            onRevealed();
          }}
          className="mt-2.5 min-h-[36px] text-xs font-bold text-[#2A5C45] underline underline-offset-4"
        >
          Atau ketuk di sini untuk langsung buka kejutan
        </button>
      )}
    </div>
  );
}

export function DesaStationModal({
  stationId,
  visitedStations,
  payload,
  guestName,
  wishes,
  audioEngine,
  onSelectStation,
  onAddWish,
  onToast,
  onClose,
}: DesaStationModalProps) {
  const station =
    payload.stations.find((s) => s.id === stationId) ?? payload.stations[0];
  const displayGuest = guestName?.trim() || payload.defaultGuestName;

  // RSVP / Wish state
  const [wishName, setWishName] = useState(guestName?.trim() || "");
  const [wishRelation, setWishRelation] = useState("");
  const [wishStatus, setWishStatus] = useState<DesaWishItem["status"]>(
    payload.mode === "wedding" ? "Hadir" : "Ucapan",
  );
  const [wishMsg, setWishMsg] = useState("");
  const [formError, setFormError] = useState<string | null>(null);
  const [rsvpSent, setRsvpSent] = useState(false);

  // QR Canvas ref for wedding check-in pass
  const qrCanvasRef = useRef<HTMLCanvasElement | null>(null);

  // Kado mode Quiz state
  const [quizIdx, setQuizIdx] = useState(0);
  const [quizChoice, setQuizChoice] = useState<number | null>(null);
  const [quizScore, setQuizScore] = useState(0);

  // Kado mode Voice Note state
  const [voicePlaying, setVoicePlaying] = useState(false);
  const [voiceSec, setVoiceSec] = useState(0);

  // Galeri carousel + card flip state
  const [galleryIdx, setGalleryIdx] = useState(0);
  const [cardFlipped, setCardFlipped] = useState(false);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  useEffect(() => {
    return () => {
      audioEngine?.stopVoicePreview();
    };
  }, [audioEngine]);

  useEffect(() => {
    if (stationId !== "ucapan" || payload.mode !== "wedding") return;
    const canvas = qrCanvasRef.current;
    if (!canvas) return;
    const qrPayload = `KADODIGITAL|DESA-ASRI|${displayGuest}|${wishStatus}`;
    void QRCode.toCanvas(canvas, qrPayload, {
      width: 196,
      margin: 2,
      color: { dark: "#3E2B1E", light: "#FFFFFF" },
    }).catch(() => {});
  }, [stationId, payload.mode, displayGuest, wishStatus]);

  const handleCopy = async (text: string, label: string) => {
    try {
      await navigator.clipboard.writeText(text);
      onToast(`${label} disalin ke clipboard.`);
    } catch {
      onToast(`${label}: ${text}`);
    }
  };

  const handleDownloadIcs = () => {
    if (!payload.eventInfo) return;
    const ics = [
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      "BEGIN:VEVENT",
      `SUMMARY:Pernikahan ${payload.namesLine}`,
      `DTSTART:${payload.eventInfo.calendarStartIso}`,
      `DTEND:${payload.eventInfo.calendarEndIso}`,
      `LOCATION:${payload.eventInfo.venueName}, ${payload.eventInfo.venueAddress}`,
      "DESCRIPTION:Undangan Pernikahan Desa Asri - Kado Digital",
      "END:VEVENT",
      "END:VCALENDAR",
    ].join("\r\n");
    const blob = new Blob([ics], { type: "text/calendar;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "desa-asri-raka-nadya.ics";
    link.click();
    URL.revokeObjectURL(url);
    onToast("Jadwal acara (.ics) disimpan ke kalender.");
  };

  const handleWishSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!wishName.trim() || !wishMsg.trim()) {
      setFormError("Mohon lengkapi nama dan pesan ucapan sebelum mengirim.");
      return;
    }
    setFormError(null);
    onAddWish({
      name: wishName.trim(),
      relation: wishRelation.trim() || "Tamu Undangan",
      status: wishStatus,
      message: wishMsg.trim(),
    });
    setWishMsg("");
    setRsvpSent(true);
    onToast("Ucapan terkirim. Warga desa ikut membacakan doamu.");
  };

  const currentPhoto = payload.gallery[galleryIdx] ?? payload.gallery[0];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#142219]/46 p-3 sm:p-6"
      onClick={onClose}
    >
      <div
        className="desa-woven-pill flex max-h-[88dvh] w-full max-w-[620px] flex-col overflow-hidden rounded-[24px] border-[3px] border-[#B79B74] bg-[#F7F1E3] text-[#3E2B1E] shadow-[0_28px_72px_rgba(16,22,16,0.45)]"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label={`Jurnal Desa: ${station.title}`}
      >
        {/* Sticky Journal Header + Chapter Progress */}
        <div className="flex shrink-0 items-start justify-between gap-3 border-b border-[#DED0B6] bg-[#EFE5CE]/65 px-5 pb-3 pt-4 sm:px-6">
          <div>
            <p className="text-[11px] font-extrabold tracking-wider text-[#2A5C45] uppercase">
              Jurnal Desa · {station.ribbon} ({visitedStations.length}/6 selesai)
            </p>
            <h2 className="mt-1 font-serif text-xl font-bold text-[#3E2B1E] sm:text-2xl">
              {station.title}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Tutup jurnal desa"
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[12px] border border-[#C8B28E] bg-[#FFFBF2] text-[#3E2B1E] shadow-2xs transition hover:bg-[#E7D8B6]"
          >
            <VillageCloseIcon className="h-4 w-4" />
          </button>
        </div>

        {/* 6-Chapter Tactile Journal Tab Strip */}
        <div
          role="tablist"
          aria-label="Bab Jurnal Desa"
          className="desa-no-scrollbar flex shrink-0 items-center gap-1.5 overflow-x-auto border-b border-[#DED0B6] bg-[#F7F1E3] px-4 py-2.5 sm:px-6"
        >
          {payload.stations.map((st) => {
            const active = st.id === stationId;
            const visited = visitedStations.includes(st.id);
            return (
              <button
                key={st.id}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => onSelectStation(st.id)}
                className={`inline-flex min-h-[38px] shrink-0 items-center gap-1.5 rounded-[10px] border px-3 py-1.5 text-xs font-extrabold whitespace-nowrap transition ${
                  active
                    ? "border-[#2A5C45] bg-[#2A5C45] text-white"
                    : "border-[#D4C2A3] bg-[#FFFBF2] text-[#3E2B1E] hover:bg-[#EFE5CE]"
                }`}
              >
                <VillageStationIcon id={st.id} className="h-3.5 w-3.5" />
                <span>{st.dockLabel}</span>
                {visited && !active && (
                  <Check
                    className="h-3.5 w-3.5 text-[#2A5C45] stroke-[3]"
                    aria-label="Sudah dibuka"
                  />
                )}
              </button>
            );
          })}
        </div>

        {/* Scrollable Body Content */}
        <div className="desa-scroll min-h-0 flex-1 space-y-5 overflow-y-auto px-5 py-5 text-sm sm:px-6">
          {/* ==================== STATION 1: SURAT ==================== */}
          {stationId === "surat" && (
            <>
              <div className="rounded-[18px] border border-[#D4C2A3] bg-[#FFFBF2] p-4 sm:p-5">
                <p className="text-xs font-extrabold tracking-wider text-[#2A5C45] uppercase">
                  Teruntuk {displayGuest},
                </p>
                <h3 className="mt-1.5 font-serif text-xl font-bold text-[#3E2B1E] sm:text-2xl">
                  {payload.letter.heading}
                </h3>
                <div className="mt-3 space-y-3 text-sm leading-relaxed text-[#5C4633]">
                  {payload.letter.paragraphs.map((p) => (
                    <p key={p}>{p}</p>
                  ))}
                </div>
                <p className="mt-4 font-serif text-sm font-bold italic text-[#AD4B2C]">
                  {payload.letter.signOff}
                </p>
              </div>

              {payload.mode === "wedding" && payload.letter.targetIso && (
                <div className="space-y-3 rounded-[18px] border-2 border-dashed border-[#C8B28E] bg-[#FFFBF2] p-4 text-center">
                  <CountdownGrid targetIso={payload.letter.targetIso} />
                  <button
                    type="button"
                    onClick={handleDownloadIcs}
                    className="inline-flex min-h-[42px] items-center justify-center gap-2 rounded-[12px] border-b-[3px] border-[#7D321B] bg-[#AD4B2C] px-5 py-2 text-xs font-extrabold text-white transition hover:bg-[#993E22]"
                  >
                    <CalendarPlus className="h-4 w-4" aria-hidden="true" />
                    Tambahkan ke Kalender
                  </button>
                </div>
              )}

              {payload.mode === "kado" && payload.letter.daysTogether && (
                <div className="rounded-[18px] border border-[#2A5C45] bg-[#2A5C45] p-4 text-center text-[#F7F1E3]">
                  <p className="text-[11px] font-bold tracking-widest text-[#CFE3D6] uppercase">
                    Kebersamaan Kita Sejauh Ini
                  </p>
                  <p className="mt-1 text-3xl font-extrabold tabular-nums">
                    {payload.letter.daysTogether} Hari
                  </p>
                </div>
              )}

              {payload.letter.dresscodeSwatches && (
                <div className="rounded-[18px] border-2 border-dashed border-[#C8B28E] bg-[#FFFBF2] p-4 text-center">
                  <h4 className="text-base font-extrabold text-[#3E2B1E]">
                    {payload.letter.dresscodeTitle}
                  </h4>
                  <p className="mt-1 text-xs text-[#5C4633]">
                    {payload.letter.dresscodeNote}
                  </p>
                  <div className="mt-3 flex flex-wrap justify-center gap-3.5">
                    {payload.letter.dresscodeSwatches.map((sw) => (
                      <div key={sw.label} className="flex flex-col items-center gap-1">
                        <span
                          className="h-9 w-9 rounded-full border-2 border-[#B79B74]"
                          style={{ backgroundColor: sw.hex }}
                        />
                        <span className="text-[11px] font-bold text-[#5C4633]">
                          {sw.label}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <blockquote className="rounded-[18px] border border-[#D4C2A3] bg-[#EFE5CE] p-4 text-center font-serif text-sm italic leading-relaxed text-[#3E2B1E]">
                “{payload.letter.quote}”
              </blockquote>
            </>
          )}

          {/* ==================== STATION 2: ACARA / VOICE NOTE ==================== */}
          {stationId === "acara" && payload.mode === "wedding" && payload.eventInfo && (
            <>
              <div className="space-y-3">
                {payload.eventInfo.sessions.map((sess) => (
                  <div
                    key={sess.title}
                    className="rounded-[18px] border border-[#D4C2A3] bg-[#FFFBF2] p-4"
                  >
                    <span className="inline-block rounded-md bg-[#E3EFE8] px-2.5 py-0.5 text-[11px] font-extrabold text-[#2A5C45]">
                      {sess.time}
                    </span>
                    <h3 className="mt-2 text-base font-extrabold text-[#3E2B1E]">
                      {sess.title}
                    </h3>
                    <p className="mt-0.5 text-xs font-bold text-[#AD4B2C]">
                      {sess.date}
                    </p>
                    <p className="mt-1 text-xs text-[#5C4633]">{sess.place}</p>
                  </div>
                ))}
              </div>

              <div className="rounded-[18px] border-2 border-dashed border-[#C8B28E] bg-[#FFFBF2] p-4 text-center">
                <p className="text-sm font-extrabold text-[#3E2B1E]">
                  {payload.eventInfo.venueName}
                </p>
                <p className="mt-1 text-xs text-[#5C4633]">
                  {payload.eventInfo.venueAddress}
                </p>
                <a
                  href={payload.eventInfo.mapsUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-3 inline-flex min-h-[42px] items-center gap-1.5 rounded-[12px] bg-[#2A5C45] px-5 py-2 text-xs font-extrabold text-white transition hover:bg-[#1E4534]"
                >
                  <MapPin className="h-3.5 w-3.5" aria-hidden="true" />
                  Arahkan ke Lokasi
                </a>
              </div>
            </>
          )}

          {stationId === "acara" && payload.mode === "kado" && payload.voiceNote && (
            <div className="space-y-4">
              <div className="rounded-[18px] border border-[#D4C2A3] bg-[#FFFBF2] p-5">
                <div className="flex items-center gap-3.5">
                  <button
                    type="button"
                    onClick={() => {
                      if (!payload.voiceNote) return;
                      if (voicePlaying) {
                        audioEngine?.stopVoicePreview();
                        setVoicePlaying(false);
                      } else {
                        setVoicePlaying(true);
                        audioEngine?.startVoicePreview(
                          payload.voiceNote.durationSec,
                          (s) => setVoiceSec(s),
                          () => {
                            setVoicePlaying(false);
                            setVoiceSec(0);
                          },
                        );
                      }
                    }}
                    className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#AD4B2C] text-white shadow-sm transition hover:bg-[#993E22]"
                    aria-label={voicePlaying ? "Jeda pesan suara" : "Putar pesan suara"}
                  >
                    {voicePlaying ? (
                      <Pause className="h-5 w-5" aria-hidden="true" />
                    ) : (
                      <Play className="ml-0.5 h-5 w-5" aria-hidden="true" />
                    )}
                  </button>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-bold text-[#2A5C45]">
                      {payload.voiceNote.senderLabel}
                    </p>
                    <p className="truncate text-sm font-extrabold text-[#3E2B1E]">
                      {payload.voiceNote.title}
                    </p>
                    <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-[#E1D4BC]">
                      <div
                        className="h-full rounded-full bg-[#2A5C45] transition-all"
                        style={{
                          width: `${Math.min(
                            100,
                            (voiceSec / payload.voiceNote.durationSec) * 100,
                          )}%`,
                        }}
                      />
                    </div>
                  </div>
                </div>
                <div className="mt-3 flex items-center justify-between text-[11px] font-bold text-[#5C4633] tabular-nums">
                  <span className="inline-flex items-center gap-1">
                    <Mic className="h-3.5 w-3.5 text-[#AD4B2C]" aria-hidden="true" />
                    {voicePlaying ? "Sedang diputar..." : "Ketuk putar untuk dengar"}
                  </span>
                  <span>
                    00:{String(voiceSec).padStart(2, "0")} / 00:
                    {String(payload.voiceNote.durationSec).padStart(2, "0")}
                  </span>
                </div>
              </div>

              <div className="rounded-[18px] border border-[#D4C2A3] bg-[#FFFBF2] p-4">
                <p className="text-[11px] font-extrabold tracking-wider text-[#5C4633] uppercase">
                  Transkrip Pesan
                </p>
                <p className="mt-2 font-serif text-base italic leading-relaxed text-[#3E2B1E]">
                  “{payload.voiceNote.transcript}”
                </p>
              </div>
            </div>
          )}

          {/* ==================== STATION 3: UCAPAN & RSVP OR KUIS ==================== */}
          {stationId === "ucapan" && payload.mode === "wedding" && (
            <>
              <form
                onSubmit={handleWishSubmit}
                noValidate
                className="space-y-3 rounded-[18px] border border-[#D4C2A3] bg-[#FFFBF2] p-4"
              >
                <h3 className="text-sm font-extrabold text-[#3E2B1E]">
                  Kirim Ucapan, Doa &amp; Konfirmasi Hadir
                </h3>

                <div>
                  <label
                    htmlFor="wish-name"
                    className="mb-1 block text-xs font-extrabold text-[#3E2B1E]"
                  >
                    Nama lengkap
                  </label>
                  <input
                    id="wish-name"
                    type="text"
                    value={wishName}
                    onChange={(e) => setWishName(e.target.value)}
                    placeholder="Nama Anda"
                    className="min-h-[42px] w-full rounded-[12px] border border-[#C8B28E] bg-[#F7F1E3]/60 px-3.5 py-2 text-xs font-semibold text-[#3E2B1E] focus:border-[#2A5C45] focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <div>
                    <label
                      htmlFor="wish-relation"
                      className="mb-1 block text-xs font-extrabold text-[#3E2B1E]"
                    >
                      Kenalan / Hubungan
                    </label>
                    <input
                      id="wish-relation"
                      type="text"
                      value={wishRelation}
                      onChange={(e) => setWishRelation(e.target.value)}
                      placeholder="Sahabat, Rekan Kerja, Keluarga"
                      className="min-h-[42px] w-full rounded-[12px] border border-[#C8B28E] bg-[#F7F1E3]/60 px-3 py-2 text-xs font-semibold text-[#3E2B1E] focus:border-[#2A5C45] focus:outline-none"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="wish-status"
                      className="mb-1 block text-xs font-extrabold text-[#3E2B1E]"
                    >
                      Konfirmasi Kehadiran
                    </label>
                    <select
                      id="wish-status"
                      value={wishStatus}
                      onChange={(e) =>
                        setWishStatus(e.target.value as DesaWishItem["status"])
                      }
                      className="min-h-[42px] w-full rounded-[12px] border border-[#C8B28E] bg-[#F7F1E3]/60 px-3 py-2 text-xs font-bold text-[#3E2B1E] focus:border-[#2A5C45] focus:outline-none"
                    >
                      <option value="Hadir">Hadir</option>
                      <option value="Doa Restu">Kirim Doa</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="wish-message"
                    className="mb-1 block text-xs font-extrabold text-[#3E2B1E]"
                  >
                    Pesan &amp; Doa
                  </label>
                  <textarea
                    id="wish-message"
                    rows={3}
                    value={wishMsg}
                    onChange={(e) => setWishMsg(e.target.value)}
                    placeholder="Tulis pesan Anda di sini..."
                    className="w-full rounded-[12px] border border-[#C8B28E] bg-[#F7F1E3]/60 px-3.5 py-2 text-xs font-semibold text-[#3E2B1E] focus:border-[#2A5C45] focus:outline-none"
                  />
                </div>

                {formError && (
                  <p
                    role="alert"
                    className="rounded-lg border border-[#AD4B2C]/40 bg-[#FBEAE4] px-3 py-2 text-xs font-bold text-[#8E3217]"
                  >
                    {formError}
                  </p>
                )}

                <button
                  type="submit"
                  className="inline-flex min-h-[44px] w-full items-center justify-center gap-1.5 rounded-[12px] border-b-[3px] border-[#7D321B] bg-[#AD4B2C] py-2.5 text-xs font-extrabold text-white transition hover:bg-[#993E22]"
                >
                  <Send className="h-3.5 w-3.5" aria-hidden="true" />
                  Kirimkan Ucapan &amp; RSVP
                </button>

                {rsvpSent && (
                  <p className="text-center text-xs font-extrabold text-[#2A5C45]">
                    Ucapan tercatat dan langsung dibacakan warga desa.
                  </p>
                )}
              </form>

              {/* Real QR Check-in Card */}
              <div className="flex flex-col items-center rounded-[18px] border-2 border-dashed border-[#C8B28E] bg-[#FFFBF2] p-4 text-center">
                <div className="inline-flex items-center gap-1.5 text-xs font-extrabold text-[#2A5C45]">
                  <QrCode className="h-4 w-4" aria-hidden="true" />
                  <span>Kartu Check-In Hari-H ({wishStatus})</span>
                </div>
                <canvas
                  ref={qrCanvasRef}
                  className="mt-2.5 rounded-[12px] border border-[#D4C2A3] bg-white p-1"
                />
                <p className="mt-2 text-xs font-bold text-[#3E2B1E]">
                  Tamu: {wishName.trim() || displayGuest}
                </p>
              </div>

              {/* Wish Wall */}
              <div className="space-y-2.5">
                <p className="text-xs font-extrabold tracking-wider text-[#5C4633] uppercase">
                  Ucapan Warga &amp; Tamu ({wishes.length})
                </p>
                {wishes.length === 0 ? (
                  <p className="rounded-[14px] border border-[#D4C2A3] bg-[#FFFBF2] p-4 text-center text-xs font-semibold text-[#5C4633]">
                    Belum ada ucapan tamu. Jadilah yang pertama mengirim doa restu lewat formulir di atas.
                  </p>
                ) : (
                  wishes.map((w) => (
                    <div
                      key={w.id}
                      className="rounded-[14px] border border-[#D4C2A3] bg-[#FFFBF2] px-4 py-3"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <div className="min-w-0">
                          <span className="text-xs font-extrabold text-[#3E2B1E]">
                            {w.name}
                          </span>
                          {w.relation && (
                            <span className="ml-1.5 text-[11px] font-semibold text-[#5C4633]">
                              · {w.relation}
                            </span>
                          )}
                        </div>
                        <span className="shrink-0 rounded-md bg-[#E3EFE8] px-2 py-0.5 text-[10px] font-extrabold text-[#2A5C45]">
                          {w.status}
                        </span>
                      </div>
                      <p className="mt-1 text-xs leading-relaxed text-[#5C4633]">
                        {w.message}
                      </p>
                    </div>
                  ))
                )}
              </div>
            </>
          )}

          {stationId === "ucapan" && payload.mode === "kado" && payload.quiz && (
            <div className="space-y-4">
              {quizIdx < payload.quiz.length ? (
                <div className="rounded-[18px] border border-[#D4C2A3] bg-[#FFFBF2] p-5">
                  <div className="flex items-center justify-between text-xs font-extrabold text-[#5C4633]">
                    <span>
                      Pertanyaan {quizIdx + 1} / {payload.quiz.length}
                    </span>
                    <span className="text-[#2A5C45]">Skor: {quizScore}</span>
                  </div>
                  <h3 className="mt-2 text-base font-extrabold text-[#3E2B1E]">
                    {payload.quiz[quizIdx].question}
                  </h3>
                  <div className="mt-4 space-y-2">
                    {payload.quiz[quizIdx].options.map((opt, oIdx) => {
                      const chosen = quizChoice === oIdx;
                      const isCorrect =
                        quizChoice !== null &&
                        oIdx === payload.quiz![quizIdx].correctIndex;
                      return (
                        <button
                          key={opt}
                          type="button"
                          disabled={quizChoice !== null}
                          onClick={() => {
                            setQuizChoice(oIdx);
                            if (oIdx === payload.quiz![quizIdx].correctIndex) {
                              setQuizScore((s) => s + 1);
                              audioEngine?.playReveal();
                            } else {
                              audioEngine?.playTap();
                            }
                          }}
                          className={`flex min-h-[44px] w-full items-center justify-between rounded-[12px] border-2 px-4 py-2.5 text-left text-xs font-bold transition ${
                            isCorrect
                              ? "border-[#2A5C45] bg-[#E3EFE8] text-[#1D4432]"
                              : chosen
                                ? "border-[#AD4B2C] bg-[#FBEAE4] text-[#8E3217]"
                                : "border-[#D4C2A3] bg-[#F7F1E3]/60 text-[#3E2B1E] hover:border-[#8C6D46]"
                          }`}
                        >
                          <span>{opt}</span>
                          {isCorrect && <Check className="h-4 w-4" aria-hidden="true" />}
                        </button>
                      );
                    })}
                  </div>

                  {quizChoice !== null && (
                    <div className="mt-4 space-y-3 rounded-[14px] bg-[#EFE5CE] p-3.5 text-xs font-bold text-[#3E2B1E]">
                      <p>
                        {quizChoice === payload.quiz[quizIdx].correctIndex
                          ? payload.quiz[quizIdx].correctFeedback
                          : payload.quiz[quizIdx].wrongFeedback}
                      </p>
                      <button
                        type="button"
                        onClick={() => {
                          setQuizChoice(null);
                          setQuizIdx((i) => i + 1);
                        }}
                        className="min-h-[40px] rounded-[10px] bg-[#2A5C45] px-4 py-1.5 text-xs font-extrabold text-white hover:bg-[#1F4634]"
                      >
                        {quizIdx + 1 < payload.quiz.length
                          ? "Lanjut Pertanyaan Berikutnya"
                          : "Lihat Hasil Kuis"}
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="rounded-[18px] border border-[#C8B28E] bg-[#FFFBF2] p-6 text-center">
                  <p className="text-xs font-extrabold tracking-wider text-[#AD4B2C] uppercase">
                    Ringkasan Kuis
                  </p>
                  <h3 className="mt-1.5 text-lg font-extrabold text-[#3E2B1E]">
                    Skor Kamu {quizScore} / {payload.quiz.length}
                  </h3>
                  <p className="mt-1.5 text-xs text-[#5C4633]">
                    Sekarang buka tab <strong>Kado Rahasia</strong> untuk menggosok hadiah utamamu.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setQuizIdx(0);
                      setQuizChoice(null);
                      setQuizScore(0);
                    }}
                    className="mt-4 inline-flex min-h-[40px] items-center gap-1.5 rounded-[10px] border border-[#C8B28E] px-4 py-1.5 text-xs font-bold text-[#3E2B1E] hover:bg-[#EFE5CE]"
                  >
                    <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
                    Mainkan Lagi
                  </button>
                </div>
              )}
            </div>
          )}

          {/* ==================== STATION 4: KADO ==================== */}
          {stationId === "kado" && (
            <>
              <p className="text-xs leading-relaxed text-[#5C4633]">
                {payload.gift.subtitle}
              </p>

              {payload.gift.accounts.length > 0 && (
                <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                  {payload.gift.accounts.map((acc) => (
                    <div
                      key={acc.id}
                      className="flex flex-col justify-between rounded-[16px] border border-[#D4C2A3] bg-[#FFFBF2] p-3.5"
                    >
                      <div>
                        <span
                          className="inline-block rounded-md px-2.5 py-0.5 text-[10px] font-extrabold text-white"
                          style={{ backgroundColor: acc.color }}
                        >
                          {acc.bank}
                        </span>
                        <p className="mt-2 text-sm font-extrabold text-[#3E2B1E] tabular-nums">
                          {acc.number}
                        </p>
                        <p className="text-[11px] font-semibold text-[#5C4633]">
                          a.n. {acc.owner}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleCopy(acc.number, `Nomor ${acc.bank}`)}
                        className="mt-3 inline-flex min-h-[38px] items-center justify-center gap-1.5 rounded-[10px] border border-[#C8B28E] bg-[#F7F1E3] py-1.5 text-[11px] font-extrabold text-[#3E2B1E] hover:bg-[#EFE5CE]"
                      >
                        <Copy className="h-3 w-3" aria-hidden="true" />
                        Salin Nomor
                      </button>
                    </div>
                  ))}
                </div>
              )}

              <ScratchVoucherCard
                prompt={payload.gift.scratchPrompt}
                secretTitle={payload.gift.scratchSecretTitle}
                secretBody={payload.gift.scratchSecretBody}
                onRevealed={() => {
                  audioEngine?.playReveal();
                  onToast("Kejutan berhasil dibuka.");
                }}
              />

              <div className="rounded-[18px] border border-[#D4C2A3] bg-[#FFFBF2] p-4">
                <p className="text-xs font-extrabold text-[#3E2B1E]">
                  Alamat Pengiriman Hadiah Fisik
                </p>
                <p className="mt-1 text-xs leading-relaxed text-[#5C4633]">
                  {payload.gift.deliveryAddress}
                </p>
                <button
                  type="button"
                  onClick={() =>
                    handleCopy(payload.gift.deliveryAddress, "Alamat pengiriman")
                  }
                  className="mt-2.5 inline-flex min-h-[38px] items-center gap-1.5 rounded-[10px] bg-[#2A5C45] px-3.5 py-1.5 text-[11px] font-extrabold text-white hover:bg-[#1F4634]"
                >
                  <Copy className="h-3 w-3" aria-hidden="true" />
                  Salin Alamat
                </button>
              </div>
            </>
          )}

          {/* ==================== STATION 5: CERITA ==================== */}
          {stationId === "cerita" && (
            <div className="space-y-4">
              {payload.stories.map((ch) => (
                <article
                  key={ch.id}
                  className="overflow-hidden rounded-[18px] border border-[#D4C2A3] bg-[#FFFBF2]"
                >
                  <div className="aspect-[16/10] w-full overflow-hidden bg-[#EFE5CE]">
                    <img
                      src={ch.image}
                      alt={ch.title}
                      width={640}
                      height={400}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="p-4">
                    <span className="inline-block rounded-md bg-[#E3EFE8] px-2.5 py-0.5 text-[11px] font-extrabold text-[#2A5C45]">
                      {ch.year}
                    </span>
                    <h3 className="mt-2 font-serif text-lg font-bold text-[#3E2B1E]">
                      {ch.title}
                    </h3>
                    <p className="mt-1 text-xs leading-relaxed text-[#5C4633]">
                      {ch.description}
                    </p>
                  </div>
                </article>
              ))}
            </div>
          )}

          {/* ==================== STATION 6: GALERI ==================== */}
          {stationId === "galeri" && currentPhoto && (
            <div className="space-y-3.5">
              <div className="overflow-hidden rounded-[18px] border-2 border-[#C8B28E] bg-[#FFFBF2]">
                <div className="relative aspect-[4/3] w-full overflow-hidden bg-[#EFE5CE]">
                  {!cardFlipped ? (
                    <img
                      src={currentPhoto.image}
                      alt={currentPhoto.title}
                      width={640}
                      height={480}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full flex-col items-center justify-center bg-[#F7F1E3] p-6 text-center">
                      <span className="text-[11px] font-extrabold tracking-wider text-[#AD4B2C] uppercase">
                        Catatan di Balik Foto
                      </span>
                      <h4 className="mt-2 font-serif text-lg font-bold text-[#3E2B1E]">
                        {currentPhoto.title}
                      </h4>
                      <p className="mt-2 text-sm leading-relaxed text-[#5C4633]">
                        {currentPhoto.backNote}
                      </p>
                    </div>
                  )}

                  <button
                    type="button"
                    onClick={() => {
                      setCardFlipped(false);
                      setGalleryIdx(
                        (i) => (i - 1 + payload.gallery.length) % payload.gallery.length,
                      );
                    }}
                    aria-label="Foto sebelumnya"
                    className="absolute left-2.5 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-[#223027]/78 text-white transition hover:bg-[#223027]"
                  >
                    <ChevronLeft className="h-5 w-5" aria-hidden="true" />
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setCardFlipped(false);
                      setGalleryIdx((i) => (i + 1) % payload.gallery.length);
                    }}
                    aria-label="Foto berikutnya"
                    className="absolute right-2.5 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-[#223027]/78 text-white transition hover:bg-[#223027]"
                  >
                    <ChevronRight className="h-5 w-5" aria-hidden="true" />
                  </button>
                </div>

                <div className="flex items-center justify-between gap-2 p-3.5">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-extrabold text-[#3E2B1E]">
                      {currentPhoto.title}
                    </p>
                    <p className="truncate text-xs text-[#5C4633]">
                      {currentPhoto.caption}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setCardFlipped((f) => !f)}
                    className="min-h-[38px] shrink-0 rounded-[10px] border-2 border-[#2A5C45] px-3 py-1 text-xs font-extrabold text-[#2A5C45] transition hover:bg-[#2A5C45] hover:text-white"
                  >
                    {cardFlipped ? "Lihat Foto" : "Balik Kartu"}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs font-bold text-[#5C4633]">
                <span>Album Momen Desa</span>
                <span className="tabular-nums">
                  {galleryIdx + 1} / {payload.gallery.length}
                </span>
              </div>
              <div className="grid grid-cols-6 gap-1.5">
                {payload.gallery.map((item, idx) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => {
                      setCardFlipped(false);
                      setGalleryIdx(idx);
                    }}
                    aria-label={`Pilih foto ${item.title}`}
                    className={`aspect-square overflow-hidden rounded-[10px] border-2 transition ${
                      idx === galleryIdx
                        ? "border-[#2A5C45] ring-2 ring-[#2A5C45]/30"
                        : "border-transparent opacity-75 hover:opacity-100"
                    }`}
                  >
                    <img
                      src={item.image}
                      alt={item.title}
                      width={96}
                      height={96}
                      className="h-full w-full object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Sticky Non-Overlapping Journal Footer */}
        <div className="flex shrink-0 items-center justify-between gap-2 border-t border-[#DED0B6] bg-[#EFE5CE] px-5 py-2.5 text-[11px] font-bold text-[#5C4633] sm:px-6">
          <span>{payload.namesLine} · Desa Asri</span>
          <span>
            Dirangkai dengan{" "}
            <a
              href="/"
              className="text-[#2A5C45] underline underline-offset-2 hover:text-[#1D4432]"
            >
              Kado Digital
            </a>
          </span>
        </div>
      </div>
    </div>
  );
}
