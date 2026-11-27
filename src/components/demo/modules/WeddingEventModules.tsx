"use client";

import { useEffect, useState } from "react";
import {
  CalendarPlus,
  Check,
  Copy,
  ExternalLink,
  MapPin,
  MessageSquarePlus,
  QrCode,
  Wallet,
  X,
} from "lucide-react";
import type { DemoPayload } from "@/data/demoContent";
import type { ProductLine } from "@/lib/schemas";
import { isDarkHex } from "@/lib/color";

interface WeddingEventModulesProps {
  line: ProductLine;
  eventDetails: NonNullable<DemoPayload["eventDetails"]>;
  accent: string;
  soft: string;
}

export function WeddingEventModules({
  line,
  eventDetails,
  accent,
  soft,
}: WeddingEventModulesProps) {
  const [countdown, setCountdown] = useState({ days: 85, hours: 14, minutes: 22, seconds: 10 });
  const [copiedBank, setCopiedBank] = useState(false);
  const [qrOpen, setQrOpen] = useState(false);

  const [wishes, setWishes] = useState(eventDetails.initialWishes);
  const [guestName, setGuestName] = useState("");
  const [rsvpStatus, setRsvpStatus] = useState("Hadir");
  const [wishText, setWishText] = useState("");
  const [submittedNotice, setSubmittedNotice] = useState(false);

  const darkAccent = isDarkHex(accent);
  const accentInkOnWhite = darkAccent ? accent : "#6B4E16";

  useEffect(() => {
    const targetMs = new Date("2027-02-14T10:00:00+07:00").getTime();

    const updateTimer = () => {
      const diff = Math.max(0, targetMs - Date.now());
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((diff / (1000 * 60)) % 60);
      const seconds = Math.floor((diff / 1000) % 60);
      setCountdown({ days, hours, minutes, seconds });
    };

    updateTimer();
    const timerId = window.setInterval(updateTimer, 1000);
    return () => window.clearInterval(timerId);
  }, []);

  const handleCopyAccount = async () => {
    try {
      await navigator.clipboard.writeText(eventDetails.bankAccount.number.replace(/\s+/g, ""));
      setCopiedBank(true);
      window.setTimeout(() => setCopiedBank(false), 1800);
    } catch {
      setCopiedBank(false);
    }
  };

  const handleDownloadIcs = () => {
    const ics = [
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      "BEGIN:VEVENT",
      `SUMMARY:${eventDetails.coupleOrHost}`,
      `DTSTART:${eventDetails.isoStart}`,
      `DTEND:${eventDetails.isoEnd}`,
      `LOCATION:${eventDetails.venueName} - ${eventDetails.venueAddress}`,
      "END:VEVENT",
      "END:VCALENDAR",
    ].join("\r\n");

    const blob = new Blob([ics], { type: "text/calendar;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "simpan-tanggal-kado-digital.ics";
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  };

  const handleRsvpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!guestName.trim() || !wishText.trim()) return;

    setWishes((prev) => [
      {
        id: `wish-${prev.length + 1}`,
        name: guestName.trim(),
        status: rsvpStatus,
        message: wishText.trim(),
      },
      ...prev,
    ]);
    setGuestName("");
    setWishText("");
    setSubmittedNotice(true);
    window.setTimeout(() => setSubmittedNotice(false), 2600);
  };

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Countdown & Add to Calendar */}
      <div
        className="rounded-[24px] border bg-white p-4 text-center text-[#18181D] sm:p-6"
        style={{ borderColor: `${accent}3D` }}
      >
        <span className="text-xs font-bold tracking-[0.14em] uppercase" style={{ color: accentInkOnWhite }}>
          Menuju Hari Acara
        </span>
        <p className="mt-1 text-sm text-[#4F4B58]">{eventDetails.dateDisplay}</p>

        <div className="mx-auto mt-4 grid max-w-md grid-cols-4 gap-2 sm:mt-5 sm:gap-2.5">
          {[
            { label: "Hari", value: countdown.days },
            { label: "Jam", value: countdown.hours },
            { label: "Menit", value: countdown.minutes },
            { label: "Detik", value: countdown.seconds },
          ].map((box) => (
            <div key={box.label} className="rounded-2xl px-1.5 py-2.5 sm:p-3" style={{ backgroundColor: soft }}>
              <p className="text-xl font-bold tabular-nums text-[#18181D] sm:text-3xl">
                {String(box.value).padStart(2, "0")}
              </p>
              <p className="mt-0.5 text-[11px] font-medium text-[#4F4B58]">{box.label}</p>
            </div>
          ))}
        </div>

        <button
          type="button"
          onClick={handleDownloadIcs}
          className="mt-4 inline-flex h-10 items-center gap-2 rounded-full border px-4 text-xs font-semibold transition-colors hover:bg-black/5 cursor-pointer sm:mt-5"
          style={{ borderColor: `${accentInkOnWhite}55`, color: accentInkOnWhite }}
        >
          <CalendarPlus className="h-4 w-4" />
          Simpan ke Kalender (.ics)
        </button>
      </div>

      {/* Sessions & Google Maps */}
      <div
        className="rounded-[24px] border bg-white p-4 text-[#18181D] sm:p-6"
        style={{ borderColor: `${accent}3D` }}
      >
        <h3 className="text-lg font-bold">Lokasi &amp; Rangkaian Acara</h3>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 sm:gap-4">
          {eventDetails.sessions.map((ses) => (
            <div key={ses.title} className="rounded-2xl p-3.5 sm:p-4" style={{ backgroundColor: soft }}>
              <p className="text-sm font-bold" style={{ color: accentInkOnWhite }}>
                {ses.title}
              </p>
              <p className="mt-1 text-xs font-semibold text-[#18181D] tabular-nums">{ses.time}</p>
              <p className="mt-0.5 text-xs text-[#4F4B58]">{ses.place}</p>
            </div>
          ))}
        </div>

        <div className="mt-4 flex flex-col justify-between gap-3 rounded-2xl border border-black/10 p-3.5 sm:flex-row sm:items-center sm:p-4">
          <div className="flex items-start gap-2.5">
            <MapPin className="mt-0.5 h-4 w-4 shrink-0" style={{ color: accentInkOnWhite }} />
            <div>
              <p className="text-sm font-semibold">{eventDetails.venueName}</p>
              <p className="text-xs text-[#4F4B58]">{eventDetails.venueAddress}</p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <a
              href={eventDetails.mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-10 items-center gap-1.5 rounded-full px-4 text-xs font-semibold"
              style={{ backgroundColor: accent, color: darkAccent ? "#FFFFFF" : "#18181D" }}
            >
              Buka Google Maps
              <ExternalLink className="h-3.5 w-3.5" />
            </a>

            {line === "wedding" && (
              <button
                type="button"
                onClick={() => setQrOpen(true)}
                className="inline-flex h-10 items-center gap-1.5 rounded-full border border-black/15 px-4 text-xs font-semibold text-[#18181D] cursor-pointer"
              >
                <QrCode className="h-3.5 w-3.5" />
                QR Check-in
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Love Story (Wedding) */}
      {line === "wedding" && (
        <div
          className="rounded-[24px] border bg-white p-4 text-[#18181D] sm:p-6"
          style={{ borderColor: `${accent}3D` }}
        >
          <h3 className="text-lg font-bold">Love Story Mempelai</h3>
          <div className="mt-4 grid gap-3 sm:grid-cols-3 sm:gap-4">
            {eventDetails.loveStory.map((chapter) => (
              <div key={chapter.year} className="rounded-2xl p-4" style={{ backgroundColor: soft }}>
                <span className="text-xs font-bold tabular-nums" style={{ color: accentInkOnWhite }}>
                  {chapter.year}
                </span>
                <h4 className="mt-1 text-sm font-bold">{chapter.title}</h4>
                <p className="mt-1 text-xs leading-relaxed text-[#4B4854]">{chapter.story}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Amplop Digital */}
      {line !== "save-the-date" && (
        <div
          className="rounded-[24px] border bg-white p-4 text-[#18181D] sm:p-6"
          style={{ borderColor: `${accent}3D` }}
        >
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <div>
              <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase" style={{ color: accentInkOnWhite }}>
                <Wallet className="h-4 w-4" />
                Amplop Digital
              </span>
              <p className="mt-1 text-sm text-[#4F4B58]">
                {eventDetails.bankAccount.bank} ·{" "}
                <strong className="font-mono text-[#18181D] tabular-nums">
                  {eventDetails.bankAccount.number}
                </strong>
              </p>
              <p className="text-xs text-[#64606E]">a.n. {eventDetails.bankAccount.owner}</p>
            </div>

            <button
              type="button"
              onClick={handleCopyAccount}
              className="inline-flex h-10 items-center justify-center gap-1.5 rounded-full border px-4 text-xs font-semibold cursor-pointer"
              style={{ borderColor: `${accentInkOnWhite}55`, color: accentInkOnWhite }}
            >
              {copiedBank ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
              {copiedBank ? "Nomor Tersalin" : "Salin Nomor Rekening"}
            </button>
          </div>
        </div>
      )}

      {/* Interactive RSVP & Buku Tamu */}
      <div
        className="rounded-[24px] border bg-white p-4 text-[#18181D] sm:p-6"
        style={{ borderColor: `${accent}3D` }}
      >
        <h3 className="inline-flex items-center gap-2 text-lg font-bold">
          <MessageSquarePlus className="h-5 w-5" style={{ color: accentInkOnWhite }} />
          RSVP &amp; Buku Tamu
        </h3>

        <form onSubmit={handleRsvpSubmit} className="mt-4 space-y-3">
          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <label htmlFor="rsvp-name" className="block text-xs font-semibold text-[#4B4854]">
                Nama Tamu
              </label>
              <input
                id="rsvp-name"
                type="text"
                required
                value={guestName}
                onChange={(e) => setGuestName(e.target.value)}
                placeholder="Nama kamu..."
                className="mt-1 h-11 w-full rounded-xl border border-black/15 px-3.5 text-sm"
              />
            </div>

            <div>
              <label htmlFor="rsvp-status" className="block text-xs font-semibold text-[#4B4854]">
                Konfirmasi Kehadiran
              </label>
              <select
                id="rsvp-status"
                value={rsvpStatus}
                onChange={(e) => setRsvpStatus(e.target.value)}
                className="mt-1 h-11 w-full rounded-xl border border-black/15 bg-white px-3.5 text-sm"
              >
                <option value="Hadir">Hadir</option>
                <option value="Masih Ragu">Masih Ragu</option>
                <option value="Berhalangan">Berhalangan Hadir</option>
              </select>
            </div>
          </div>

          <div>
            <label htmlFor="rsvp-wish" className="block text-xs font-semibold text-[#4B4854]">
              Ucapan &amp; Doa
            </label>
            <textarea
              id="rsvp-wish"
              required
              rows={3}
              value={wishText}
              onChange={(e) => setWishText(e.target.value)}
              placeholder="Tulis ucapan hangatmu..."
              className="mt-1 w-full rounded-xl border border-black/15 p-3.5 text-sm"
            />
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              type="submit"
              className="inline-flex h-11 items-center rounded-full px-6 text-sm font-semibold"
              style={{ backgroundColor: accent, color: darkAccent ? "#FFFFFF" : "#18181D" }}
            >
              Kirim Ucapan &amp; RSVP
            </button>
            {submittedNotice && (
              <span className="text-xs font-semibold text-[#157347]">
                ✓ Ucapan berhasil ditambahkan ke daftar!
              </span>
            )}
          </div>
        </form>

        <div className="mt-6 space-y-2.5 border-t border-black/10 pt-4">
          {wishes.map((wish) => (
            <div key={wish.id} className="rounded-xl p-3.5" style={{ backgroundColor: soft }}>
              <div className="flex items-center justify-between gap-2">
                <span className="text-sm font-bold">{wish.name}</span>
                <span className="rounded-full bg-white px-2.5 py-0.5 text-[11px] font-semibold text-[#18181D]">
                  {wish.status}
                </span>
              </div>
              <p className="mt-1 text-xs leading-relaxed text-[#3D3A45]">{wish.message}</p>
            </div>
          ))}
        </div>
      </div>

      {/* QR Check-in Modal */}
      {qrOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/55 p-4"
          role="dialog"
          aria-modal="true"
          aria-label="QR Check-in Tamu"
        >
          <div className="w-full max-w-xs rounded-[24px] bg-white p-6 text-center text-[#18181D] shadow-2xl">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider" style={{ color: accentInkOnWhite }}>
                Guest on Screen Pass
              </span>
              <button
                type="button"
                onClick={() => setQrOpen(false)}
                aria-label="Tutup modal QR"
                className="inline-flex h-9 w-9 items-center justify-center rounded-full hover:bg-black/5 cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="mx-auto my-5 flex h-40 w-40 items-center justify-center rounded-2xl border-2 border-dashed border-black/20">
              <QrCode className="h-24 w-24" style={{ color: accentInkOnWhite }} />
            </div>
            <p className="text-sm font-bold">Tamu Undangan</p>
            <p className="mt-1 text-xs text-[#5B5864]">
              Tunjukkan QR ini di meja penerima tamu saat hari-H.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
