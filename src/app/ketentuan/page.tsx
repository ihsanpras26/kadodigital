import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Syarat & Ketentuan Layanan",
  description: "Ketentuan masa aktif, model Mandiri vs Terima Beres, revisi, dan pembatalan di Kado Digital.",
};

export default function KetentuanPage() {
  return (
    <article className="mx-auto max-w-[820px] px-4 py-12 sm:px-6 lg:py-16">
      <h1 className="text-3xl font-bold tracking-tight text-ink sm:text-4xl">
        Syarat &amp; Ketentuan Layanan
      </h1>
      <p className="mt-2 text-sm text-muted">Berlaku mulai 21 November 2026 · kadodigital.my.id</p>

      <div className="mt-8 space-y-6 text-[15px] leading-relaxed text-ink/90">
        <section>
          <h2 className="text-lg font-bold text-ink">1. Mode Layanan Hybrid</h2>
          <p className="mt-2">
            Pelanggan bebas memilih Mode Mandiri (penyusunan mandiri di studio editor) maupun Mode
            Terima Beres (dirangkai oleh operator studio berdasarkan brief). Jam operasional tim
            studio adalah Senin–Sabtu pukul 09.00–17.00 WIB di luar hari libur nasional.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-ink">2. Masa Aktif &amp; Perpanjangan</h2>
          <p className="mt-2">
            Masa aktif berjalan sejak tanggal publikasi sesuai paket yang dipilih (6–12 bulan untuk
            Kado Personal, 14–180 hari untuk Wedding, dan 30 hari untuk Event/Save The Date). Tidak
            ada penagihan otomatis saat masa aktif berakhir; perpanjangan tersedia secara manual
            dengan biaya transparan.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-ink">3. Revisi &amp; Persetujuan Versi (Terima Beres)</h2>
          <p className="mt-2">
            Satu putaran revisi mencakup satu daftar perubahan terstruktur terhadap teks, urutan
            foto, atau penyesuaian minor dalam desain yang sudah dipilih. Kesalahan teknis dari
            operator diperbaiki tanpa mengurangi kuota revisi. Publikasi final hanya dilakukan
            setelah pembeli menyetujui preview dan melunasi tagihan.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-ink">4. Hak Cipta Materi Unggahan</h2>
          <p className="mt-2">
            Pembeli bertanggung jawab memastikan seluruh foto, rekaman suara, dan video yang diunggah
            memiliki izin penggunaan yang sah dan tidak melanggar hukum atau privasi pihak lain.
          </p>
        </section>
      </div>
    </article>
  );
}
