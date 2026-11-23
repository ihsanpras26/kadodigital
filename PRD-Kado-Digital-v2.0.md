# KADO DIGITAL v2.0 — Product Requirements Document

**Domain:** `kadodigital.my.id`  
**Versi:** 2.0 (Evolusi dari v1.0 ke Platform Hybrid: Kado Interaktif Personal + Katalog Multi-Acara)  
**Tanggal Acuan:** 21 November 2026 (Asia/Jakarta)  
**Bahasa Produk:** Bahasa Indonesia  
**Brand Visual Direction:** Warm Linen & Deep Emerald (Modern, Clean, Editorial)  
**Dokumen Pendamping:** `DESIGN.md` (v2.0)  
**Pemilik Produk:** Founder Kado Digital  

Dokumen ini merumuskan ulang visi produk, model bisnis **Hybrid (Self-Service + Terima Beres)**, arsitektur katalog lengkap (mengadaptasi kelengkapan lini produk dan fitur `invitee.web.id` secara orisinal tanpa plagiarisme), sistem paket, kebutuhan fungsional, arsitektur teknis, serta kriteria peluncuran Kado Digital v2.0.

---

## Ringkasan Eksekutif

**Kado Digital** adalah platform pembuatan **kado ucapan digital interaktif dan undangan online modern** berbasis web. Fokus dan identitas utama Kado Digital adalah **ucapan personal yang interaktif, hidup, dan terasa dibuat khusus**—khususnya untuk **Anniversary, Ulang Tahun, dan Sahabat**—sambil menyediakan lini produk undangan dan pendukung acara yang lengkap agar pelanggan dapat menggunakan satu platform untuk seluruh momen penting mereka.

* **Fokus Utama (Flagship):** Kado & Ucapan Personal Interaktif (Anniversary, Ulang Tahun, Sahabat, LDR, Wisuda Personal).
* **Katalog Lengkap (Adaptasi Multi-Produk):** Mengadopsi 100% kelengkapan lini produk referensi (`invitee.web.id`) ke dalam identitas orisinal Kado Digital: **Kado Personal**, **Wedding**, **Save The Date**, **Event & Party (6 momen)**, **Lensa Momen** *(guest camera web app)*, **Rencana Momen** *(event & gift planner)*, serta **Layanan Kurasi/Partner**.
* **Model Operasional Hybrid:**
  1. **Mode Mandiri (Self-Service Builder):** Pelanggan mendaftar, memilih tema, mengisi konten, melihat *live preview*, membayar, dan langsung menerbitkan link secara instan.
  2. **Mode Terima Beres (Studio Concierge):** Add-on atau inklusi paket atas di mana tim membantu kurasi foto, perapihan teks/cerita, pengaturan interaksi, QA lintas HP, hingga preview berversi dan persetujuan.
* **Arah Visual:** **Warm Linen & Deep Emerald** (`#F8F7F4`, `#FFFFFF`, `#16201B`, `#1B5E47`, aksen `#D4A359` & `#E6F2EC`) — modern, bersih (*clean*), editorial, dan bebas clutter.
* **Prinsip Transparansi:** Tidak ada klaim kontradiktif antara masa aktif paket dan fitur; seluruh kuota, durasi aktif, dan harga tampil konsisten dari halaman utama hingga checkout.

---

# 01. Mandat Produk & Evolusi dari v1.0 ke v2.0

## 1.1 Perubahan Strategis v1.0 -> v2.0

| Dimensi | v1.0 (Sebelumnya) | v2.0 (Sekarang) |
|---|---|---|
| **Model Layanan** | Murni jasa terkelola (manual via WhatsApp & operator) | **Hybrid:** Self-service dashboard instan + opsi *Terima Beres* (Studio Concierge) |
| **Lini Produk** | Hanya kado ucapan personal (3 tema) | **Flagship Kado Personal Interaktif** + katalog lengkap adaptasi `invitee.web.id` (Wedding, Save The Date, Event & Party, Lensa Momen, Rencana Momen, Layanan Lainnya) |
| **Interaksi & Fitur** | Amplop, flip foto, scratch, surat, audio/video | Semua modul v1.0 + Buku Tamu Unlimited, Smart Kirim WhatsApp, QR Guest on Screen, Voice Comment, Amplop Digital, Multi-Acara, Guest Camera (*Lensa Momen*), & Planner (*Rencana Momen*) |
| **Identitas Visual** | Cobalt Surprise (Playful bold) | **Warm Linen & Deep Emerald** (Modern, clean, editorial, timeless) |
| **Konversi Awal** | Inquiry -> WA -> Manual -> Preview | **Coba Demo Tanpa Login** -> **Trial Gratis 2 Hari** (edit mandiri) -> Upgrade / Tambah *Terima Beres* |

## 1.2 Positioning Statement

Untuk Gen Z dan dewasa muda Indonesia yang ingin merayakan orang tersayang—mulai dari **anniversary, ulang tahun, hingga acara besar**—**Kado Digital** adalah platform kado ucapan interaktif dan undangan digital modern yang menggabungkan kemudahan *buat sendiri* dengan sentuhan personal studio *terima beres*, dibagikan rapi dalam satu link.

**Tagline Utama:** *Cerita kamu, jadi kejutan yang tak terlupakan.*

---

# 02. Studi Referensi Live (`invitee.web.id`) & Strategi Adaptasi Anti-Plagiat

Berdasarkan inspeksi langsung terhadap `https://invitee.web.id/` pada 21 November 2026 (seluruh rute utama HTTP 200), berikut pemetaan 100% fitur dan struktur mereka beserta strategi adaptasi orisinal Kado Digital:

| Elemen di `invitee.web.id` | Observasi Live | Adaptasi Orisinal di Kado Digital v2.0 |
|---|---|---|
| **Navigasi Utama** | Home, Paket, Produk (`/theme?type=wedding`), Harga, Layanan Lainnya (`/product`), Blog, IG, WA, Login | Beranda, Produk & Tema (`/katalog`), Fitur, Harga, Layanan (`/layanan`), Inspirasi (`/blog`), WA/IG, Masuk + CTA `Buat Sekarang` |
| **Hero & Metrik** | Hero + angka bukti (undangan terkirim, tema, musik, tamu blast) | Hero asimetris dengan **Demo Kado Interaktif langsung di layar** + strip kapabilitas/metrik aktual (tanpa angka fiktif) |
| **10 Fitur Inti** | Masa aktif, Buku Tamu Unlimited, Auto Blast WA (hingga 800), 160+ Tema, 900+ Musik, QR Buku Tamu, Google Maps, Love Story, Amplop Digital, Multi-Acara (hingga 10) | Diadopsi 100% dengan penamaan dan UX lebih bersih, ditambah **Modul Interaktif Kado** (amplop buka, flip foto + catatan rahasia, scratch reveal, kuis kenangan, rilis terjadwal, passphrase) |
| **Kategori Katalog (`/theme`)** | 5 lini: Wedding (6 tab gaya + 8 filter warna), Planner, Jepret, Save The Date, Event & Party (6 sub-momen) | **6 lini** dengan **Kado Personal** di posisi #1 (Anniversary, Ulang Tahun, Sahabat, LDR), disusul Wedding (6 tab gaya + 8 warna), Save The Date, Event & Party (6 sub-momen), **Lensa Momen** (adaptasi Jepret), dan **Rencana Momen** (adaptasi Planner) |
| **Jepret (Guest Camera)** | Kamera web via QR tanpa app, filter film permanen, kuota bersama, tanpa preview/hapus, galeri reveal serentak + ZIP | **Lensa Momen:** alur 4 langkah yang sama persis, diperluas agar optimal untuk **Pesta Ulang Tahun, Anniversary Dinner, dan Wedding** |
| **Wedding Planner** | Free trial terbatas, full unlock Rp79.000 sekali bayar (checklist, kalender, kanban, progress, panduan, cloud drive) | **Rencana Momen:** fitur lengkap yang sama (checklist, jadwal, kanban, countdown, panduan, arsip dokumen), bisa dipakai untuk persiapan kejutan ulang tahun/anniversary maupun pernikahan |
| **Buku Tamu + Blast WA** | Kredit blast gratis di tiap pembelian, nama tamu personal, grouping tamu, monitor kehadiran, top-up kredit | **Smart Kirim WhatsApp & Buku Tamu:** sistem kuota + generator link personal `?to=Nama`, grouping tamu, monitor RSVP, dan top-up kredit dari dashboard |
| **Struktur Pricing (`#pricing`)** | 3 tab (Wedding 5 tier, Save The Date 1 tier, Event & Party 6 paket) + Free 2 hari | **4 tab** dengan **Kado Personal** sebagai tab default, diikuti Wedding (5 tier), Save The Date, dan Event & Party (6 paket). Menghapus kontradiksi klaim "selamanya" vs durasi hari |
| **Detail Tema (`/theme/detail`)** | Preview mobile, cerita tema, counter pemakaian, palet 3-hex (`Aksen`, `Dasar`, `Lembut`), tombol Demo | Halaman `/katalog/[slug]` menampilkan preview interaktif desktop/mobile, cerita konsep, palet 3-hex, daftar mekanik interaktif, tombol `Coba Demo`, `Buat Sendiri`, & `Pesan Terima Beres` |
| **Layanan Lainnya (`/product`)** | Katalog layanan fisik/vendor non-digital | `/layanan`: Katalog Add-on Studio (*Terima Beres*, *Custom Ilustrasi/Animasi*, *Express Same-Day*) & kurasi kado pendamping |
| **Kelemahan yang Diperbaiki** | Tidak ada FAQ & alur cara kerja umum di landing page; kontradiksi masa aktif; visual relatif ramai | Menambahkan section **Cara Kerja (Mandiri vs Terima Beres)** dan **FAQ Terstruktur**; visual ultra-clean; durasi aktif jujur & konsisten |

---

# 03. Arsitektur Lini Produk & Katalog (`/katalog`)

Seluruh produk berjalan di atas **satu engine runtime modular** berbasis tema dan blok konten terstruktur.

## 3.1 Lini 1 — Kado & Ucapan Personal *(Flagship / Prioritas Utama)*
Dirancang khusus untuk hadiah digital 1-on-1 atau kelompok kecil yang sangat personal dan interaktif.
* **Sub-Momen:** `Anniversary`, `Ulang Tahun`, `Sahabat`, `Pasangan LDR`, `Wisuda Personal`, `Apresiasi / Terima Kasih`.
* **Mekanik Interaktif Khas:**
  1. **Amplop & Segel Pembuka:** Tarik pita atau buka segel wax digital (mendukung tap, drag, keyboard, dan tombol lewati).
  2. **Kartu Foto Bolak-Balik (*Flip Memory*):** Tap foto untuk membalik dan membaca cerita/tanggal di baliknya.
  3. **Gores Kejutan (*Scratch-to-Reveal*):** Menggosok lapisan tekstur kertas/emas untuk membuka pesan rahasia atau voucher kado (tersedia tombol buka instan untuk aksesibilitas).
  4. **Timeline & Love Story:** Linimasa perjalanan hubungan/persahabatan dengan foto & angka hari bersama (*days counter*).
  5. **Surat Personal & Voice Note:** Surat berbab dengan efek baca yang tenang, plus rekaman suara pengirim (disertai transkrip teks & *audio ducking* otomatis terhadap musik latar).
  6. **Kuis Kenangan (*Memory Quiz*):** 3–5 pertanyaan personal berhadiah pesan spesial di akhir (tetap bisa lanjut meski jawaban salah).
  7. **Kontribusi Sahabat (*Group Wishes*):** Link khusus agar teman-teman bisa menitipkan ucapan/foto untuk dikurasi pengirim sebelum rilis.
  8. **Rilis Terjadwal & Passphrase:** Server menahan konten privat sebelum jam rilis (WIB/WITA/WIT); opsional kata sandi rahasia (mis. tanggal jadian).
* **Keluarga Tema Awal (Orisinal Kado Digital):**
  * *Linen Letter* (Editorial hangat, intim, cocok untuk Anniversary).
  * *Birthday Unwrapped* (Ceria namun bersih, fokus kejutan bertahap & kuis).
  * *Polaroid Memoir* (Tumpukan foto bolak-balik & catatan tangan untuk Sahabat/LDR).
  * *Nocturne Keepsake* (Gelap tenang `#131C18` dengan aksen champagne gold, fokus surat & voice note).
  * *Playful Walk* (Tema interaktif eksplorasi kartu/mini-quest ringan ala game modern).

## 3.2 Lini 2 — Undangan Pernikahan (*Wedding*)
Mengadopsi kelengkapan penuh katalog Wedding dengan filter berlapis:
* **6 Tab Gaya Tema:** `Populer`, `Terbaru` (termasuk tema interaktif/3D ringan & *video background*), `Adat Nusantara` (Jawa, Minang, Sunda, Bugis, Lampung, Aceh, Madura, Tionghoa), `Artistik`, `Modern Minimalis`, `Klasik Editorial`.
* **Filter Pencarian:** Search judul tema + 8 filter warna (`Emerald`, `Linen`, `Emas`, `Maroon`, `Hitam`, `Blush`, `Putih`, `Sage/Cokelat`).
* **Fitur Lengkap:** Buku Tamu & RSVP Unlimited, Guest on Screen (QR Check-in Hari-H), Smart Kirim WhatsApp, Galeri Foto/Video, Musik Latar, Custom Font Tema, Google Maps, Love Story, Dresscode, Link Live Streaming (YouTube/IG/TikTok), Amplop Digital, Voice Comment Tamu, Custom Preview WA, serta dukungan hingga 5–10 rangkaian acara dalam 1 link.

## 3.3 Lini 3 — Save The Date
Undangan pengumuman tanggal cepat sebelum undangan utama terbit.
* **Fitur:** Template editorial ringkas, Countdown acara, Detail tanggal & kota, Galeri singkat, RSVP awal, tombol *Add to Calendar* (Google/Apple Calendar), dan link share WA rapi.

## 3.4 Lini 4 — Event & Party (6 Sub-Kategori)
Mencakup 6 momen spesifik dengan preset teks dan dekorasi yang langsung sesuai:
1. **Birthday Party** (Pesta ulang tahun anak, sweet seventeen, dewasa)
2. **Wisuda** (Syukuran & undangan kelulusan)
3. **Aqiqah** (Tasyakuran kelahiran)
4. **Khitanan** (Walimatul khitan)
5. **Bukber & Gathering** (Buka bersama, reuni, acara komunitas)
6. **Hari Raya** (Ucapan & open house Idul Fitri / Natal / Tahun Baru)

## 3.5 Lini 5 — Lensa Momen *(Add-on Guest Camera Web App)*
Adaptasi orisinal dari konsep kamera tamu tanpa aplikasi (setara *Jepret*):
* **Alur 4 Langkah:**
  1. **Buat Event:** Pilih jumlah tamu, tanggal, jam aktif, warna tema, dan filter film analog. Kuota foto bersifat bersama (tidak membatasi per orang).
  2. **Bagikan via QR & WA:** Unduh poster/kartu meja QR siap cetak atau bagikan link ke WhatsApp. Tamu memotret langsung dari browser HP tanpa install app dan tanpa daftar akun.
  3. **Potret Sepanjang Acara:** Selama jam acara aktif, tamu memotret dengan filter film terpilih (mode *disposable camera*: opsional tanpa preview/hapus agar momen terasa autentik).
  4. **Reveal Galeri Serentak:** Setelah acara selesai, seluruh foto terbuka bersamaan di dashboard pemilik dan bisa diunduh dalam 1 file ZIP.
* **Cocok untuk:** Pesta ulang tahun, anniversary dinner, bridal shower, wisuda, dan resepsi pernikahan.

## 3.6 Lini 6 — Rencana Momen *(Add-on Event & Gift Planner)*
Adaptasi orisinal dari *Planner* untuk perencanaan acara maupun kejutan besar:
* **Modul:** Dashboard Progress & Countdown, Unlimited Checklist per kategori, Timeline & Kalender jadwal, Papan Kanban tugas, Panduan terstruktur sesuai profil acara, serta Cloud Drive untuk dokumen, vendor, dan referensi.
* **Akses:** Gratis uji coba (fitur terbatas); *full unlock* sekali bayar **Rp79.000** (atau gratis otomatis di paket teratas Wedding/Signature).

## 3.7 Lini 7 — Layanan Studio & Add-on (`/layanan`)
Menyediakan jasa tambahan terkurasi yang melengkapi produk digital:
* **Jasa Terima Beres (Studio Concierge):** Operator merapikan cerita, melakukan crop wajah optimal, memilih ritme animasi, melakukan QA di berbagai perangkat, dan menyiapkan preview untuk disetujui.
* **Express Same-Day:** Jalur prioritas pengerjaan Terima Beres dalam 6–12 jam (kuota harian terbatas).
* **Custom Ilustrasi / Mekanik Eksklusif:** Quotation terpisah untuk kebutuhan brand atau momen super-spesial.
* **Partner Kado Pendamping (P1):** Kurasi vendor fisik/digital partner dengan filter kategori dan urutan harga.

---

# 04. Model Operasional Hybrid (Self-Service + Terima Beres)

Setiap pengguna yang memilih tema dari `/katalog` dapat memilih jalur pengerjaan sesuai waktu dan kenyamanannya:

## 4.1 Jalur A: Mode Mandiri (*Self-Service Builder*)
1. **Coba Demo** di katalog tanpa login.
2. **Daftar / Masuk** -> pilih tema -> proyek otomatis dibuat dalam mode **Gratis (Trial 2 Hari)**.
3. **Isi Konten di Dashboard Editor:**
   * Editor berbasis form terstruktur per bagian (*Sampul, Penerima/Acara, Galeri & Catatan, Musik/Suara, Interaksi, Privasi & Jadwal*).
   * **Live Split-Screen Preview** (desktop) atau toggle **Preview Instan** (mobile) agar hasil langsung terlihat real-time.
4. **Pilih Paket & Bayar:** Upgrade dari Trial ke paket berbayar -> watermark hilang, batas kuota terbuka, link permanen sesuai masa aktif.
5. **Bagikan & Kelola:** Gunakan generator link tamu/penerima, Smart Kirim WhatsApp, pantau buku tamu/RSVP, atau edit minor kapan saja selama masa aktif.

## 4.2 Jalur B: Mode Terima Beres (*Studio Concierge*)
1. **Pilih Tema & Paket** -> aktifkan toggle **"Bantu Rangkai (Terima Beres)"** (tersedia sebagai add-on di paket Cerita/Kejutan/Wedding, dan **sudah termasuk gratis** di paket **Signature**).
2. **Pembayaran / Verifikasi Order** -> sistem membuat `Order ID` dan membuka **Portal Brief Privat** (`/pesan/{token}`).
3. **Kirim Materi Tanpa Ribet:** Pembeli cukup mengunggah foto, menulis poin kenangan/cerita mentah, dan memilih suasana/musik. Sistem menampilkan pratinjau crop foto otomatis.
4. **Perakitan oleh Operator (`/studio`):** Operator merangkai copy, mengatur urutan kejutan, menguji performa di HP, lalu menerbitkan **Preview Berversi** (`/preview/{token}` dengan banner `PREVIEW v1`).
5. **Review, Revisi, & Persetujuan Eksplisit:** Pembeli memberi daftar revisi dalam kuota paket atau menekan **"Saya setuju dengan versi ini"**.
6. **Rilis / Jadwal:** Link final diterbitkan langsung atau dikunci di server hingga jam rilis yang dipilih.

---

# 05. Struktur Paket, Harga, & Kebijakan Masa Aktif

Semua angka harga adalah **usulan awal yang siap diuji** saat peluncuran, dengan prinsip **100% transparan dan konsisten** di seluruh halaman.

## 5.1 Tab 1: Kado Personal *(Default Aktif — Anniversary, Ulang Tahun, Sahabat)*

| Paket | Masa Aktif | Harga | Mode Pengerjaan | Kapasitas & Fitur Utama |
|---|---|---|---|---|
| **TRIAL** | 2 Hari | **Rp0** | Mandiri | Coba semua tema Kado Personal; 3 foto; 1 musik preset; watermark preview; link uji coba |
| **CERITA** | 6 Bulan | **Rp89.000** | Mandiri *(+Rp49.000 Terima Beres)* | Semua tema Kado Personal; hingga 10 foto + catatan balik; amplop pembuka; surat personal; musik latar; countdown & rilis terjadwal; passphrase privasi; custom preview WA |
| **KEJUTAN** *(Paling Populer)* | 12 Bulan | **Rp169.000** | Mandiri *(+Rp69.000 Terima Beres)* | Semua fitur Cerita + hingga 20 foto; **Scratch-to-Reveal**; **Voice Note + transkrip**; **Timeline/Love Story**; **1 Video pendek**; **Kuis Kenangan**; 1x putaran revisi (jika Terima Beres) |
| **SIGNATURE** *(Lengkap + Studio)* | 12 Bulan | **Rp299.000** | **Sudah termasuk Terima Beres** | Semua fitur Kejutan + hingga 35 foto; **Kontribusi Ucapan Sahabat (Group Wishes)**; **Gratis Rencana Momen**; **Opsi tanpa atribusi brand (White-label)**; kurasi cerita penuh & 2x putaran revisi |

## 5.2 Tab 2: Wedding *(5 Tier — Paritas Penuh Referensi)*

| Paket | Masa Aktif | Harga | Fitur Utama |
|---|---|---|---|
| **GRATIS** | 2 Hari | **Rp0** | Coba semua tema; Share & Buku Tamu Unlimited; Guest on Screen (Check-in QR); Smart WA 10 tamu; 1 musik; Countdown; 3 foto; Google Maps; Custom quotes; 1 jenis acara; Voice comment tamu |
| **SILVER** | 14 Hari | **Rp99.000** *(coret Rp149.000)* | Semua tema & koleksi musik; Smart WA 50 tamu; 4 foto; 2 jenis acara; Link streaming (YT/IG/TikTok); Custom preview WA; Buku Tamu & Guest on Screen; Voice comment |
| **GOLD** | 30 Hari | **Rp199.000** *(coret Rp249.000)* | Semua fitur Silver + Smart WA 100 tamu; **Custom Font Tema**; 8 foto; **Fitur Kirim Amplop Digital** |
| **PLATINUM** *(Paling Populer)* | 90 Hari | **Rp249.000** *(coret Rp299.000)* | Semua fitur Gold + Smart WA 200 tamu; 12 foto; 3 jenis acara; **Love Story Mempelai**; **Fitur Dresscode** |
| **DIAMOND** *(Nilai Terbaik)* | 180 Hari | **Rp299.000** *(coret Rp349.000)* | Semua fitur Platinum + Smart WA 350 tamu; 20 foto; hingga 5 jenis acara; **Gratis Akses Rencana Momen** |

*Catatan Transparansi:* Seluruh paket Wedding dapat diperpanjang **+Rp49.000 / 12 bulan** (atau opsi *Arsip Kenangan* saat masa aktif hampir habis) tanpa janji ambigu "selamanya" yang bertabrakan dengan batas hari.

## 5.3 Tab 3: Save The Date
* **SAVE THE DATE** — Aktif **30 Hari** — **Rp149.000** *(coret Rp249.000)*: Template pilihan Save The Date, Countdown, RSVP digital, *Add to Calendar*, Custom preview WA, Link share unlimited.

## 5.4 Tab 4: Event & Party (6 Paket Tematik)
Masing-masing berlaku untuk **Birthday Party**, **Wisuda**, **Aqiqah**, **Khitanan**, **Bukber**, dan **Hari Raya**:
* **EVENT & PARTY** — Aktif **30 Hari** — **Rp129.000** *(coret Rp199.000)*: Tema khusus momen terkait, Buku Tamu Unlimited, Musik latar, Countdown acara, Google Maps, Custom quotes, Custom preview WA, Galeri 6 foto, Komentar tamu, serta opsional amplop digital.

## 5.5 Add-on Modular
* **Mode Terima Beres (Studio Concierge):** +Rp49.000 (Cerita/Event/Save The Date) | +Rp69.000 (Kejutan/Wedding).
* **Express Same-Day (Terima Beres):** +50% dari biaya layanan (kuota harian terbatas).
* **Lensa Momen (Guest Camera):** Mulai Rp79.000 (berdasarkan paket kapasitas tamu & retensi galeri).
* **Rencana Momen (Planner):** Rp79.000 sekali bayar (Gratis di Signature & Diamond).
* **Top-Up Smart Kirim WA:** Paket tambahan kuota +100 / +300 / +800 tamu dari dashboard.

---

# 06. Kebutuhan Fungsional (Functional Requirements)

## 6.1 Storefront, Katalog, & Discovery
* **FR-01 (P0):** Landing page menampilkan hero asimetris dengan **demo kado interaktif yang bisa langsung dimainkan tanpa login** (switcher Anniversary / Ulang Tahun / Undangan).
* **FR-02 (P0):** Halaman `/katalog` mendukung switching 6 lini produk, tab sub-kategori/gaya, filter 8 warna, pencarian judul tema, dan reset filter.
* **FR-03 (P0):** Halaman `/katalog/[slug]` menampilkan preview tema (mobile & desktop), cerita konsep, palet 3-hex (`Aksen`, `Dasar`, `Lembut`), daftar interaksi/fitur, serta tombol `Lihat Demo`, `Buat Sendiri`, dan `Pesan Terima Beres`.
* **FR-04 (P0):** Section `#harga` menampilkan 4 tab (`Kado Personal`, `Wedding`, `Save The Date`, `Event & Party`) dengan harga, masa aktif, dan fitur yang 100% konsisten dengan checkout.
* **FR-05 (P0):** Halaman `/layanan` (add-on studio & partner) dan `/blog` (inspirasi kado & acara) tersedia dengan navigasi yang bersih.

## 6.2 Dashboard Pelanggan (Mode Mandiri) & Portal Brief (Mode Terima Beres)
* **FR-06 (P0):** Registrasi/login ringan (Email/Google) yang langsung membuka workspace proyek Trial 2 Hari tanpa kartu kredit.
* **FR-07 (P0):** Editor proyek terstruktur per modul (Sampul, Detail Momen, Galeri + Crop Focal Point, Surat & Catatan Balik, Musik/Voice Note, Pengaturan Interaksi, RSVP/Amplop, Privasi & Jadwal) dengan **Live Preview** dan autosave draft.
* **FR-08 (P0):** Manajemen Tamu & Share Link: tambah/impor daftar nama tamu, grouping, generate link personal `?to=Nama+Tamu`, kirim manual via WA atau menggunakan kuota **Smart Kirim WhatsApp**.
* **FR-09 (P0):** Portal Order Privat (`/pesan/{token}`) untuk pesanan **Terima Beres**, lengkap dengan upload media tervalidasi server, preview berversi (`/preview/{token}`), revisi terstruktur, dan persetujuan eksplisit versi.
* **FR-10 (P0/P1):** Checkout mendukung verifikasi pembayaran manual pada tahap awal dan integrasi payment gateway otomatis (QRIS/VA/E-Wallet, idempotent webhook) pada P1.

## 6.3 Runtime Penerima (`/k/[token]` & `/u/[slug]`)
* **FR-11 (P0):** Akses tanpa akun dan optimal di **In-App Browser (WhatsApp & Instagram WebView)** dengan `100dvh` dan bebas bentrok gestur scroll.
* **FR-12 (P0):** Seluruh mekanik interaktif (buka amplop, flip foto, scratch reveal, kuis, navigasi bab) memiliki alternatif tap & keyboard serta mematuhi `prefers-reduced-motion` dan tombol *Kurangi gerakan*.
* **FR-13 (P0):** Kontrol audio jujur (tidak memaksa autoplay melanggar browser policy; *audio ducking* saat voice note/video diputar; transkrip tersedia).
* **FR-14 (P0):** Rilis terjadwal dijaga penuh di server (memajukan jam HP tidak membocorkan payload/URL media privat); passphrase di-hash dengan rate-limit.
* **FR-15 (P0):** Dynamic OG Card aman: preview link di WhatsApp menampilkan sampul tema & judul aman (*"Ada kejutan kecil untuk [Nama]"*), tidak pernah membocorkan foto pribadi atau isi surat tanpa izin eksplisit.
* **FR-16 (P0):** Modul Event (RSVP, Buku Tamu, Voice Comment, Amplop Digital salin rekening/QRIS, Google Maps, Live Stream, Guest on Screen QR Check-in) berjalan mulus pada lini Undangan & Event.

## 6.4 Add-on Lensa Momen & Rencana Momen
* **FR-17 (P1):** **Lensa Momen** menyediakan pembuatan event kamera QR, antarmuka kamera browser dengan filter film, batas jam aktif, halaman *Reveal* galeri bersama, dan unduh ZIP.
* **FR-18 (P1):** **Rencana Momen** menyediakan dashboard progress, checklist per kategori, kalender/timeline, kanban tugas, dan penyimpanan arsip dokumen.

## 6.5 Panel Admin & Operator (`/studio`)
* **FR-19 (P0):** Manajemen order Hybrid (monitoring proyek mandiri + antrean pengerjaan *Terima Beres*), verifikasi pembayaran, perakitan konten modular tanpa ubah kode, kontrol publish (menolak rilis jika belum lunas/disetujui), rollback versi, pencabutan token, dan retensi data.

---

# 07. Arsitektur Teknis, Data, & Keamanan

## 7.1 Stack yang Direkomendasikan
* **Frontend & Fullstack App:** Next.js (App Router) + TypeScript + Tailwind CSS + Framer Motion / Motion (satu monorepo untuk Storefront, Dashboard, Runtime, dan Studio).
* **Schema-Driven Runtime:** Definisi payload per `TemplateVersion` menggunakan **Zod**. Halaman `/demo/[slug]`, `/preview/[token]`, `/k/[token]`, dan `/u/[slug]` menggunakan komponen renderer yang identik.
* **Database:** PostgreSQL (Supabase / Neon) dengan Prisma atau Drizzle ORM.
* **Storage & Media:** Cloudflare R2 (private bucket, zero egress fee) + signed URL berdurasi pendek; optimasi gambar & penghapusan metadata EXIF/GPS saat upload via `sharp`.
* **Background Jobs:** Queue ringan untuk pemrosesan media, ekspor ZIP Lensa Momen, jadwal rilis, notifikasi Smart WA, dan pembersihan retensi kedaluwarsa.

## 7.2 Entitas Data Utama
`User`, `Project` (membedakan `mode: SELF_SERVICE | CONCIERGE` dan `category: GIFT | WEDDING | SAVE_THE_DATE | EVENT`), `TemplateVersion`, `ProjectVersion` (immutable setelah approved pada mode Concierge), `MediaAsset`, `Order`, `Payment`, `Guest` (nama, grup, status RSVP, QR token, status WA blast), `GuestbookEntry` (teks & voice comment), `PhotoWallEvent` (Lensa Momen), `PlannerWorkspace` (Rencana Momen), `AccessGrant`, dan `AuditEvent`.

## 7.3 Privasi, Performa, & Aksesibilitas
* **Privasi:** Kado personal memakai token acak + `noindex`; media privat tidak ditaruh di bucket publik; tidak ada tracker pihak ketiga pada halaman kado privat.
* **Performa:** Target Core Web Vitals (`LCP <= 2.5s`, `INP <= 200ms`, `CLS <= 0.1`), beban awal <= 1,5 MB kompresi sebelum interaksi pertama, animasi 60 fps (`transform` & `opacity` only).
* **Aksesibilitas:** Target WCAG 2.2 AA, target sentuh minimal `44x44px`, navigasi keyboard lengkap, dan dukungan *reduced motion*.

---

# 08. Roadmap Eksekusi Bertahap

| Fase | Cakupan Utama | Kriteria Lulus (Gate) |
|---|---|---|
| **Fase 1: Storefront + Demo Interaktif** | Landing page modern-clean (Warm Linen & Deep Emerald), Katalog multi-lini (filter & detail tema), 3–5 demo interaktif penuh (fokus Anniversary & Ulang Tahun + contoh Wedding/Event), section Lensa Momen, Rencana Momen, Harga 4 tab, FAQ | Pengguna memahami produk & model Hybrid dalam 1 sesi; demo berjalan mulus di HP & WA WebView |
| **Fase 2: Core Hybrid Engine (MVP Transaksi)** | Auth, Dashboard Editor Mandiri + Live Preview, Portal Brief Terima Beres, Runtime `/k/[token]` & `/u/[slug]`, Pembayaran, Panel Studio dasar | 1 proyek mandiri dan 1 order terima beres berjalan end-to-end hingga rilis terjadwal |
| **Fase 3: Event Power-Ups** | Smart Kirim WA + manajemen tamu, QR Guest on Screen, Voice Comment, Amplop Digital, Payment Gateway otomatis | Pilot 20+ pengguna berbayar (gabungan Kado Personal & Event) berjalan stabil dengan margin sehat |
| **Fase 4: Ekspansi Ekosistem** | Lensa Momen (Guest Camera QR + ZIP Reveal), Rencana Momen (Planner full unlock), penambahan koleksi tema Adat & 3D Interaktif | Adopsi add-on tervalidasi; performa dan retensi storage terkendali |

---

# 09. Riwayat Versi
* **v1.0 (18 Okt 2026):** Fokus jasa terkelola murni untuk kado ucapan personal (3 tema), rute warna Cobalt Surprise.
* **v2.0 (21 Nov 2026):** Evolusi ke platform **Hybrid (Mandiri + Terima Beres)**, fokus flagship tetap pada **Kado & Ucapan Interaktif Personal (Anniversary & Ulang Tahun)**, perluasan katalog 100% paritas lini produk referensi `invitee.web.id` secara orisinal, dan penyegaran identitas visual ke **Warm Linen & Deep Emerald**.
