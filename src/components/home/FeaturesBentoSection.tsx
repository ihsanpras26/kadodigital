import {
  CalendarClock,
  Gift,
  HeartHandshake,
  Lock,
  MapPin,
  MessageSquareHeart,
  Music,
  QrCode,
  Send,
  Wallet,
} from "lucide-react";

export function FeaturesBentoSection() {
  return (
    <section
      id="fitur"
      className="border-t border-hairline bg-surface py-[72px] lg:py-[112px]"
    >
      <div className="mx-auto max-w-[1240px] px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl">
          <span className="text-xs font-semibold tracking-[0.14em] text-emerald-brand uppercase">
            Ekosistem Fitur Lengkap
          </span>
          <h2 className="mt-3 text-[30px] leading-[1.12] font-bold tracking-[-0.03em] text-ink text-balance sm:text-[42px]">
            Satu platform untuk kado{" "}
            <span className="font-serif font-normal italic text-emerald-brand">
              personal
            </span>{" "}
            hingga undangan acara besar.
          </h2>
          <p className="mt-3 text-base leading-relaxed text-muted text-pretty">
            Menggabungkan kedalaman interaksi emosional Kado Digital dengan kelengkapan modul
            undangan modern—tanpa tampilan yang penuh sesak.
          </p>
        </div>

        {/* 6-column bento grid: Row 1 (4+2=6), Row 2 (2+4=6), Row 3 (2+2+2=6) */}
        <div className="mt-10 grid gap-5 lg:grid-cols-6">
          {/* Row 1 Left: 4 cols */}
          <article className="flex flex-col justify-between rounded-[20px] border border-hairline bg-canvas p-6 lg:col-span-4 lg:p-8">
            <div>
              <div className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-accent-soft text-emerald-brand">
                <Gift className="h-5 w-5" strokeWidth={1.75} />
              </div>
              <h3 className="mt-4 text-[22px] font-semibold tracking-[-0.02em] text-ink">
                Mekanik Interaktif Khas Kado Digital
              </h3>
              <p className="mt-2 max-w-xl text-[15px] leading-relaxed text-muted text-pretty">
                Penerima tidak sekadar membaca teks statis. Mereka membuka segel amplop,
                membalik foto kenangan untuk membaca catatan di baliknya, menggosok kartu kejutan,
                menjawab kuis personal, hingga mendengarkan voice note dengan transkrip.
              </p>
            </div>
            <div className="mt-6 flex flex-wrap gap-2">
              {[
                "Amplop & Pita Pembuka",
                "Flip Photo Note",
                "Scratch-to-Reveal",
                "Kuis Kenangan",
                "Voice Note + Transkrip",
                "Ucapan Sahabat",
              ].map((tag) => (
                <span
                  key={tag}
                  className="rounded-full border border-hairline bg-surface px-3 py-1 text-xs font-medium text-ink"
                >
                  {tag}
                </span>
              ))}
            </div>
          </article>

          {/* Row 1 Right: 2 cols */}
          <article className="flex flex-col justify-between rounded-[20px] border border-hairline bg-subtle p-6 lg:col-span-2">
            <div>
              <div className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-surface text-emerald-brand border border-hairline">
                <Lock className="h-5 w-5" strokeWidth={1.75} />
              </div>
              <h3 className="mt-4 text-[20px] font-semibold tracking-[-0.02em] text-ink">
                Privasi &amp; Rilis Terjadwal
              </h3>
              <p className="mt-2 text-[15px] leading-relaxed text-muted text-pretty">
                Kunci isi kado hingga pukul 00.00 WIB/WITA/WIT langsung dari server, aktifkan
                passphrase rahasia, dan jaga link tetap privat (<code className="text-xs">noindex</code>).
              </p>
            </div>
            <div className="mt-6 flex items-center gap-2 text-xs font-semibold text-emerald-brand">
              <CalendarClock className="h-4 w-4" />
              Anti intip sebelum jam kejutan
            </div>
          </article>

          {/* Row 2 Left: 2 cols */}
          <article className="flex flex-col justify-between rounded-[20px] border border-hairline bg-surface p-6 lg:col-span-2">
            <div>
              <div className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-accent-soft text-emerald-brand">
                <QrCode className="h-5 w-5" strokeWidth={1.75} />
              </div>
              <h3 className="mt-4 text-[20px] font-semibold tracking-[-0.02em] text-ink">
                QR Guest on Screen &amp; Buku Tamu
              </h3>
              <p className="mt-2 text-[15px] leading-relaxed text-muted text-pretty">
                Tamu melakukan check-in hari-H lewat QR code pribadi, mengisi RSVP, serta mengirim
                ucapan teks maupun voice comment tanpa batas.
              </p>
            </div>
            <span className="mt-5 inline-flex items-center gap-1.5 text-xs font-semibold text-muted">
              <MessageSquareHeart className="h-4 w-4 text-emerald-brand" />
              Mendukung ucapan suara tamu
            </span>
          </article>

          {/* Row 2 Right: 4 cols */}
          <article className="flex flex-col justify-between rounded-[20px] border border-hairline bg-canvas p-6 lg:col-span-4 lg:p-8">
            <div>
              <div className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-gold-soft text-ink border border-gold/40">
                <Send className="h-5 w-5 text-emerald-brand" strokeWidth={1.75} />
              </div>
              <h3 className="mt-4 text-[22px] font-semibold tracking-[-0.02em] text-ink">
                Smart Kirim WhatsApp &amp; Link Tamu Personal
              </h3>
              <p className="mt-2 max-w-xl text-[15px] leading-relaxed text-muted text-pretty">
                Sapa setiap penerima atau tamu dengan nama mereka langsung di sampul
                (<code className="rounded bg-surface px-1.5 py-0.5 text-xs">?to=Nama+Tamu</code>).
                Kelompokkan daftar tamu, pantau status RSVP, dan kirim undangan otomatis lewat kuota
                Smart WA hingga ratusan kontak.
              </p>
            </div>
            <div className="mt-6 flex flex-wrap gap-2">
              {["Grouping Tamu", "Sapaan Otomatis", "Monitor RSVP", "Top-up Kuota Fleksibel"].map(
                (item) => (
                  <span
                    key={item}
                    className="rounded-full bg-surface px-3 py-1 text-xs font-medium text-ink border border-hairline"
                  >
                    {item}
                  </span>
                )
              )}
            </div>
          </article>

          {/* Row 3: 3 x 2 cols */}
          <article className="flex flex-col justify-between rounded-[20px] border border-hairline bg-surface p-6 lg:col-span-2">
            <div>
              <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-accent-soft text-emerald-brand">
                <Wallet className="h-5 w-5" strokeWidth={1.75} />
              </div>
              <h3 className="mt-4 text-[19px] font-semibold text-ink">
                Amplop Digital &amp; Live Stream
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted text-pretty">
                Salin nomor rekening atau QRIS dengan sekali tap, plus tautan langsung ke YouTube,
                Instagram, atau TikTok Live bagi tamu yang berhalangan hadir.
              </p>
            </div>
          </article>

          <article className="flex flex-col justify-between rounded-[20px] border border-hairline bg-surface p-6 lg:col-span-2">
            <div>
              <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-accent-soft text-emerald-brand">
                <MapPin className="h-5 w-5" strokeWidth={1.75} />
              </div>
              <h3 className="mt-4 text-[19px] font-semibold text-ink">
                Love Story, Maps &amp; Multi-Acara
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted text-pretty">
                Susun linimasa cerita, tampilkan info dresscode, peta Google Maps akurat, hingga 5–10
                sesi rangkaian acara dalam satu tautan rapi.
              </p>
            </div>
          </article>

          <article className="flex flex-col justify-between rounded-[20px] border border-hairline bg-surface p-6 lg:col-span-2">
            <div>
              <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-accent-soft text-emerald-brand">
                <Music className="h-5 w-5" strokeWidth={1.75} />
              </div>
              <h3 className="mt-4 text-[19px] font-semibold text-ink">
                Koleksi Musik &amp; Custom Preview WA
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted text-pretty">
                Ratusan musik latar siap pakai, custom font tema, serta pengaturan kartu preview
                WhatsApp aman saat link dibagikan.
              </p>
            </div>
            <span className="mt-4 inline-flex items-center gap-1.5 text-xs font-medium text-emerald-brand">
              <HeartHandshake className="h-3.5 w-3.5" />
              Optimal di WhatsApp &amp; IG WebView
            </span>
          </article>
        </div>
      </div>
    </section>
  );
}
