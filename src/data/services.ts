export interface StudioServiceItem {
  id: string;
  slug: string;
  title: string;
  category: "Studio Concierge" | "Add-on Digital" | "Kurasi Partner";
  price: number;
  originalPrice?: number;
  summary: string;
  deliverables: string[];
  badge?: string;
  featured?: boolean;
  actionHref: string;
  actionLabel: string;
}

export const STUDIO_SERVICES: StudioServiceItem[] = [
  {
    id: "svc-terima-beres-kado",
    slug: "terima-beres-kado",
    title: "Jasa Terima Beres — Kado Personal",
    category: "Studio Concierge",
    price: 49000,
    summary:
      "Kirim foto mentah dan poin kenanganmu. Tim kami merangkai alur surat, crop wajah presisi, mengatur pacing animasi, hingga siap kirim.",
    deliverables: [
      "Kurasi & perapihan teks ucapan",
      "Smart crop foto aman untuk layar HP",
      "Preview berversi + 1x putaran revisi",
    ],
    badge: "Paling Sering Dipilih",
    featured: true,
    actionHref: "/buat?mode=terima-beres",
    actionLabel: "Pesan Terima Beres",
  },
  {
    id: "svc-express-sameday",
    slug: "express-same-day",
    title: "Express Same-Day (6–12 Jam Jadi)",
    category: "Studio Concierge",
    price: 85000,
    summary:
      "Butuh kado atau undangan jadi hari ini juga? Slot pengerjaan prioritas oleh tim studio untuk momen mepet H-1.",
    deliverables: [
      "Pengerjaan prioritas selesai dalam 6–12 jam kerja",
      "QA lintas perangkat Android & iPhone",
      "Koordinasi langsung via WhatsApp dengan Order ID",
    ],
    badge: "Slot Terbatas",
    actionHref: "/buat?mode=terima-beres&express=1",
    actionLabel: "Cek Slot Express",
  },
  {
    id: "svc-topup-wa",
    slug: "topup-smart-wa",
    title: "Paket Kuota Smart Kirim WhatsApp (+300 Tamu)",
    category: "Add-on Digital",
    price: 59000,
    summary:
      "Tambahkan kuota pengiriman link undangan personal ?to=Nama otomatis ke ratusan tamu sekaligus dengan pemantauan status dari dashboard.",
    deliverables: [
      "300 kredit pengiriman personal WhatsApp",
      "Otomatis sisipkan sapaan & nama tamu",
      "Terhubung ke status RSVP & Buku Tamu",
    ],
    actionHref: "/buat?mode=mandiri",
    actionLabel: "Tambah ke Proyek",
  },
  {
    id: "svc-custom-ilustrasi",
    slug: "custom-ilustrasi-pasangan",
    title: "Custom Ilustrasi & Mekanik Eksklusif",
    category: "Kurasi Partner",
    price: 249000,
    summary:
      "Ilustrasi karakter pasangan/sahabat bergaya editorial khusus untuk sampul kado atau kartu undangan tanpa memakai foto langsung.",
    deliverables: [
      "Ilustrasi vektor resolusi tinggi orisinal",
      "Terpasang langsung pada amplop/sampul kado",
      "File PNG bersih juga dikirim ke pembeli",
    ],
    actionHref: "/buat?mode=terima-beres&tema=linen-letter",
    actionLabel: "Konsultasi Custom",
  },
];
