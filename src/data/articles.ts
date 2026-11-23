export interface ArticleItem {
  slug: string;
  title: string;
  category: "Inspirasi Kado" | "Tips Acara" | "Panduan Studio";
  publishedAt: string;
  readingTime: string;
  excerpt: string;
  recommendedThemeSlug: string;
  recommendedThemeName: string;
  sections: {
    heading: string;
    paragraphs: string[];
  }[];
}

export const BLOG_ARTICLES: ArticleItem[] = [
  {
    slug: "cara-menulis-surat-anniversary-tanpa-klise",
    title: "Cara Menulis Surat Anniversary yang Terasa Personal (Bukan Copy-Paste)",
    category: "Inspirasi Kado",
    publishedAt: "18 November 2026",
    readingTime: "4 menit baca",
    excerpt:
      "Tiga detail kecil—kebiasaan pasangan, inside joke, dan satu momen biasa yang berkesan—sering jauh lebih mengena daripada puisi panjang.",
    recommendedThemeSlug: "linen-letter",
    recommendedThemeName: "Linen Letter",
    sections: [
      {
        heading: "1. Mulai dari satu momen spesifik, bukan rangkuman satu tahun",
        paragraphs: [
          "Banyak orang buntu saat menulis ucapan anniversary karena merasa harus merangkum semua hal. Padahal, satu kejadian kecil—seperti kehujanan bareng waktu pulang nonton atau debat soal tempat makan favorit—langsung memicu memori hangat yang hanya kalian berdua pahami.",
          "Di mode Terima Beres maupun Editor Mandiri Kado Digital, kamu cukup mengisi tiga pertanyaan pemantik singkat. Dari situ cerita mengalir jauh lebih natural.",
        ],
      },
      {
        heading: "2. Gunakan balik foto untuk catatan pendek yang jujur",
        paragraphs: [
          "Daripada menulis satu teks raksasa di satu layar, pecah ucapanmu ke balik beberapa foto kenangan. Saat penerima membalik foto dan membaca cerita di balik jepretan itu, ritme emosionalnya terasa seperti membuka album fisik.",
        ],
      },
      {
        heading: "3. Akhiri dengan janji kecil yang nyata",
        paragraphs: [
          "Simpan kejutan terakhir di kartu Scratch-to-Reveal: bisa berupa rencana makan malam akhir pekan, daftar tempat yang ingin dikunjungi, atau sekadar kalimat penyemangat singkat.",
        ],
      },
    ],
  },
  {
    slug: "ide-kejutan-ulang-tahun-jarak-jauh-ldr",
    title: "5 Ide Kejutan Ulang Tahun untuk Pasangan atau Sahabat yang Lagi LDR",
    category: "Inspirasi Kado",
    publishedAt: "12 November 2026",
    readingTime: "5 menit baca",
    excerpt:
      "Jarak dan zona waktu bukan halangan. Gabungkan rilis terjadwal tengah malam, voice note, dan kuis kenangan dalam satu link pribadi.",
    recommendedThemeSlug: "nocturne-keepsake",
    recommendedThemeName: "Nocturne Keepsake",
    sections: [
      {
        heading: "Kirim link lebih awal, kunci sampai pukul 00.00 waktu mereka",
        paragraphs: [
          "Salah satu masalah LDR adalah lupa atau salah hitung selisih jam. Dengan fitur Rilis Terjadwal di Kado Digital, server menahan isi kado di balik halaman hitung mundur yang aman sampai tepat pukul 00.00 WIB/WITA/WIT.",
        ],
      },
      {
        heading: "Sertakan rekaman suara 60 detik",
        paragraphs: [
          "Teks itu abadi, tapi suara membawa intonasi yang tidak bisa digantikan emoji. Pastikan kamu juga menuliskan transkrip ringkas agar penerima tetap bisa menikmatinya saat berada di tempat ramai atau tanpa earphone.",
        ],
      },
    ],
  },
  {
    slug: "memaksimalkan-lensa-momen-di-pesta-ulang-tahun",
    title: "Biar Foto Pesta Nggak Nyangkut di HP Tamu: Mengenal Lensa Momen",
    category: "Tips Acara",
    publishedAt: "06 November 2026",
    readingTime: "3 menit baca",
    excerpt:
      "Taruh satu kartu QR di meja makan atau photobooth. Tamu memotret langsung dari browser dengan filter film, lalu semua foto terbuka serentak.",
    recommendedThemeSlug: "confetti-atelier",
    recommendedThemeName: "Confetti Atelier",
    sections: [
      {
        heading: "Kenapa grup chat sering gagal mengumpulkan foto acara?",
        paragraphs: [
          "Setelah acara selesai, foto sering terpotong kompresi chat atau tertunda dikirim berhari-hari. Dengan Lensa Momen, tamu cukup memindai QR code di meja, tidak perlu unduh aplikasi, dan hasil jepretan langsung tersimpan rapi di galeri acara.",
        ],
      },
      {
        heading: "Sensasi kamera sekali pakai yang lebih jujur",
        paragraphs: [
          "Aktifkan filter analog dan mode tanpa preview agar tamu fokus menikmati pesta, lalu bagikan momen 'Reveal' galeri bersama keesokan harinya.",
        ],
      },
    ],
  },
  {
    slug: "mandiri-atau-terima-beres-mana-yang-cocok",
    title: "Buat Sendiri vs Terima Beres: Panduan Memilih Mode di Kado Digital",
    category: "Panduan Studio",
    publishedAt: "01 November 2026",
    readingTime: "3 menit baca",
    excerpt:
      "Punya waktu 15 menit dan suka ngulik sendiri? Mode Mandiri pas banget. Sibuk kerja dan takut salah tata letak? Serahkan ke Terima Beres.",
    recommendedThemeSlug: "birthday-unwrapped",
    recommendedThemeName: "Birthday Unwrapped",
    sections: [
      {
        heading: "Kapan memilih Mode Mandiri?",
        paragraphs: [
          "Cocok kalau kamu sudah menyiapkan foto dan kata-kata, ingin mengutak-atik langsung lewat Live Preview, dan butuh link aktif seketika setelah pembayaran.",
        ],
      },
      {
        heading: "Kapan memilih Mode Terima Beres?",
        paragraphs: [
          "Cocok kalau kamu punya bahan mentah (foto acak & poin cerita di chat), ingin bantuan merapikan kalimat agar tidak terdengar kaku, dan ingin tim studio mengecek tampilannya di berbagai ukuran HP sebelum kamu menyetujui preview final.",
        ],
      },
    ],
  },
];

export function getArticleBySlug(slug: string): ArticleItem | undefined {
  return BLOG_ARTICLES.find((a) => a.slug === slug);
}
