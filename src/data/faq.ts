export interface FaqItem {
  id: string;
  question: string;
  answer: string;
}

export const FAQ_ITEMS: FaqItem[] = [
  {
    id: "faq-hybrid",
    question: "Apa bedanya mode Buat Sendiri dan Terima Beres?",
    answer:
      "Di mode Buat Sendiri, kamu bisa langsung coba gratis 2 hari, mengisi teks dan foto di dashboard dengan live preview, lalu menerbitkan link secara instan. Di mode Terima Beres, kamu cukup mengirim bahan mentah dan poin cerita—tim studio kami yang merangkai tata letak, crop wajah foto, menyusun alur interaksi, lalu mengirim preview berversi untuk kamu setujui sebelum rilis.",
  },
  {
    id: "faq-fokus",
    question: "Apakah Kado Digital hanya untuk kado ulang tahun & anniversary, atau bisa undangan acara juga?",
    answer:
      "Fokus utama kami adalah kado ucapan personal yang interaktif (Anniversary, Ulang Tahun, Sahabat, LDR). Namun, kamu juga punya akses penuh ke katalog Undangan Pernikahan (termasuk tema Adat Nusantara & 3D interaktif), Save The Date, serta Event & Party (Wisuda, Aqiqah, Khitanan, Bukber, Hari Raya).",
  },
  {
    id: "faq-masa-aktif",
    question: "Berapa lama link kado atau undangan tetap aktif, dan apakah datanya aman?",
    answer:
      "Masa aktif tertulis transparan di setiap paket (6 hingga 12 bulan untuk Kado Personal, 14 hingga 180 hari untuk Wedding, dan 30 hari untuk Event/Save The Date), serta bisa diperpanjang kapan saja. Semua kado personal memakai token acak (noindex), opsi passphrase rahasia, dan preview WhatsApp aman yang tidak membocorkan foto atau isi surat pribadi.",
  },
  {
    id: "faq-terjadwal",
    question: "Bagaimana cara kerja Rilis Terjadwal untuk kejutan tengah malam?",
    answer:
      "Kamu bisa menentukan tanggal dan jam rilis (WIB, WITA, atau WIT). Sebelum waktunya tiba, halaman hanya menampilkan sampul hitung mundur yang aman—isi surat, foto, dan suara tidak dikirim ke browser sampai jam rilis benar-benar tercapai di server.",
  },
  {
    id: "faq-webview",
    question: "Apakah interaksi seperti buka amplop & gores kartu lancar dibuka dari link WhatsApp?",
    answer:
      "Ya. Seluruh runtime kami dirancang mobile-first dan diuji untuk in-app browser WhatsApp dan Instagram. Selain itu, setiap mekanik seperti drag atau scratch selalu memiliki alternatif tombol tap/keyboard dan dukungan mode gerak ringan agar tidak pernah menghambat penerima membuka pesanmu.",
  },
  {
    id: "faq-mepet",
    question: "Kalau baru pesan H-1 atau mendadak hari ini, apakah masih bisa?",
    answer:
      "Untuk Mode Mandiri, kamu bisa langsung isi dan aktifkan linknya dalam hitungan menit. Jika butuh bantuan Terima Beres mendadak, tersedia add-on Express Same-Day (6–12 jam kerja) selama kuota slot harian masih terbuka.",
  },
];
