import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Kebijakan Privasi",
  description: "Kebijakan perlindungan data, foto, suara, dan privasi kado personal di Kado Digital.",
};

export default function PrivasiPage() {
  return (
    <article className="mx-auto max-w-[820px] px-4 py-12 sm:px-6 lg:py-16">
      <h1 className="text-3xl font-bold tracking-tight text-ink sm:text-4xl">
        Kebijakan Privasi Kado Digital
      </h1>
      <p className="mt-2 text-sm text-muted">Berlaku mulai 21 November 2026 · kadodigital.my.id</p>

      <div className="mt-8 space-y-6 text-[15px] leading-relaxed text-ink/90">
        <section>
          <h2 className="text-lg font-bold text-ink">1. Privasi Kado &amp; Token Acak</h2>
          <p className="mt-2">
            Setiap halaman kado personal diterbitkan menggunakan token acak dengan header{" "}
            <code className="rounded bg-subtle px-1.5 py-0.5 text-xs">noindex</code> dan tidak
            dimasukkan ke peta situs publik maupun mesin pencari.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-ink">2. Perlindungan Foto, Suara, &amp; Surat</h2>
          <p className="mt-2">
            Materi pribadi (foto, rekaman suara, video, dan teks ucapan) hanya digunakan untuk
            merangkai kado atau undangan milikmu. Kado Digital tidak pernah memublikasikan foto
            atau cerita pelanggan ke portofolio tanpa persetujuan eksplisit terpisah. Metadata lokasi
            (EXIF/GPS) pada foto yang diunggah dibersihkan sebelum tampil di halaman penerima.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-ink">3. Rilis Terjadwal &amp; Preview Chat</h2>
          <p className="mt-2">
            Sebelum jadwal rilis yang ditetapkan tercapai di server, isi surat dan URL media
            ditahan di server. Preview tautan WhatsApp default memakai sampul aman yang tidak
            membocorkan foto atau isi surat pribadi.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-ink">4. Masa Retensi &amp; Permintaan Hapus</h2>
          <p className="mt-2">
            Materi sumber kerja disimpan paling lama 30 hari setelah publikasi, sedangkan hasil
            terolah aktif sesuai masa berlaku paketmu dengan masa tenggang perpanjangan 30 hari.
            Pemilik order berhak meminta pencabutan token dan penghapusan konten kapan saja melalui
            kontak resmi studio.
          </p>
        </section>
      </div>
    </article>
  );
}
