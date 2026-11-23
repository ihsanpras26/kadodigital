# Kado Digital v2.0 — Design System & Experience Direction

**Produk:** Kado Digital (`kadodigital.my.id`)  
**Versi:** 2.0 (Modern, Clean, Editorial — *Warm Linen & Deep Emerald*)  
**Tanggal Acuan:** 21 November 2026  
**Dokumen Induk:** `PRD-Kado-Digital-v2.0.md`  
**Target Utama:** Gen Z & dewasa muda Indonesia, *mobile-first* (optimal di WhatsApp & Instagram WebView).  

Dokumen ini **hanya berlaku untuk platform website Kado Digital** (Storefront, Katalog Multi-Lini, Halaman Detail & Harga, Dashboard Builder Mandiri, Portal Terima Beres, dan Panel Studio). **Dokumen ini TIDAK membatasi tampilan visual produk kado atau undangan itu sendiri**—setiap tema/produk di dalam runtime penerima (`/k/[token]`, `/u/[slug]`, `/demo/[slug]`) bebas memiliki karakter, palet warna, tipografi, ilustrasi, dan atmosfer sendiri sesuai momen dan segmennya.

---

## 1. Design Thesis

**"Tenang, modern, dan bersih seperti galeri editorial—namun hidup dan personal begitu disentuh."**

Berbeda dari situs undangan konvensional yang padat ornamen, gradient berat, dan penuh badge ramai, Kado Digital v2.0 mengusung estetika **Clean Editorial Modern**:
* **85% bidang netral hangat** (*Warm Linen* `#F8F7F4` dan *Pure White* `#FFFFFF`) agar foto, cerita, dan katalog tema tampil menonjol.
* **Deep Emerald (`#1B5E47`)** sebagai warna otoritas brand yang dewasa, elegan, namun tetap segar.
* **Warm Champagne Gold (`#D4A359`)** dan **Soft Sage Mint (`#E6F2EC`)** sebagai aksen lembut—bukan warna neon mencolok.
* **Hairline border `1px`** dan ruang kosong (*whitespace*) yang lega menggantikan bayangan tebal (*heavy drop shadows*).
* **Interaksi bermakna:** setiap sentuhan pada amplop, kartu foto, atau tab kategori menghasilkan gerak fisik yang halus, cepat, dan memuaskan.

### 1.1 Ringkasan Cepat untuk Implementer

| Aspek | Keputusan Desain v2.0 |
|---|---|
| **Arah Visual** | Modern Clean Editorial — tenang, terstruktur, *luxury-accessible* |
| **Palet Utama** | Warm Linen `#F8F7F4`, White `#FFFFFF`, Forest Ink `#16201B`, Deep Emerald `#1B5E47`, Champagne `#D4A359`, Soft Sage `#E6F2EC` |
| **Tipografi** | `Plus Jakarta Sans` (UI, Body, Display utama) + `Instrument Serif` (*italic* aksen editorial pada kata kunci tertentu) |
| **Surface Style** | Kartu putih bersih dengan hairline border `1px solid #E4E2DC`; shadow hanya untuk stage demo & overlay |
| **Hero Layout** | Asimetris 5:7 desktop — pernyataan tajam + 2 CTA di kiri, **Interactive Gift Stage** (bisa dibuka langsung) di kanan |
| **Struktur Katalog** | Multi-lini (Kado Personal, Wedding, Save The Date, Event & Party, Lensa Momen, Rencana Momen) dengan filter gaya, warna, & pencarian |
| **Model Hybrid UI** | Pilihan jelas di setiap tema/checkout: **Buat Sendiri (Instan)** vs **Terima Beres (Dibantu Tim)** |
| **Aksesibilitas** | Kontras WCAG 2.2 AA/AAA, target sentuh >= `44x44px`, keyboard-first, `prefers-reduced-motion` |

---

## 2. Sistem Warna (*Warm Linen & Deep Emerald*)

### 2.1 Semantic Color Tokens

| Token | HEX | Peran |
|---|---|---|
| `--bg-canvas` | `#F8F7F4` | Latar halaman utama (Warm Linen — hangat, tidak silau seperti putih polos) |
| `--bg-surface` | `#FFFFFF` | Kartu katalog, panel form, pricing card, dashboard card |
| `--bg-subtle` | `#F1EFEA` | Latar tab tidak aktif, table header, input fill ringan, section selang-seling |
| `--bg-accent-soft` | `#E6F2EC` | Badge kategori, highlight paket aktif, ikon container |
| `--bg-dark-section` | `#131C18` | Section CTA penutup gelap pada storefront Kado Digital |
| `--text-primary` | `#16201B` | Heading, body utama, ikon utama (Deep Forest Ink) |
| `--text-secondary` | `#526058` | Subjudul, metadata, helper text, deskripsi kartu |
| `--text-inverse` | `#F8F7F4` | Teks di atas `--bg-dark-section` dan `--accent-primary` |
| `--accent-primary` | `#1B5E47` | CTA utama, tab aktif, link penting, fokus brand (Deep Emerald) |
| `--accent-hover` | `#144A37` | Hover state CTA utama |
| `--accent-pressed` | `#0F3A2B` | Pressed state CTA utama |
| `--accent-gold` | `#D4A359` | Aksen highlight hangat, segel amplop, badge *Paling Populer* (wajib pakai teks `--text-primary`, BUKAN putih) |
| `--accent-gold-soft` | `#FBF4E6` | Latar catatan kecil, tag *Terima Beres* / *Signature* |
| `--border-hairline` | `#E4E2DC` | Garis pemisah kartu, divider section, tabel |
| `--border-control` | `#747D77` | Batas input, checkbox, radio agar mudah dikenali (>= 3:1) |
| `--status-success` | `#157347` | Status lunas, aktif, terverifikasi |
| `--status-warning` | `#9A6700` | Status menunggu verifikasi / kuota hampir habis |
| `--status-error` | `#B4233C` | Pesan error validasi & gagal upload |

### 2.2 Verifikasi Kontras (WCAG 2.2)

| Pasangan Warna | Rasio Perkiraan | Standar & Pemakaian |
|---|---|---|
| `#16201B` / `#F8F7F4` | ~15,5 : 1 | AAA — Teks utama di atas canvas |
| `#526058` / `#F8F7F4` | ~6,1 : 1 | AA+ — Teks pendukung & metadata |
| `#FFFFFF` / `#1B5E47` | ~7,6 : 1 | AAA — Teks tombol CTA utama |
| `#1B5E47` / `#F8F7F4` | ~7,1 : 1 | AAA — Link teks & angka sorotan |
| `#16201B` / `#D4A359` | ~7,2 : 1 | AAA — Badge Champagne Gold (dilarang memakai teks putih di atas `#D4A359`) |
| `#16201B` / `#E6F2EC` | ~14,0 : 1 | AAA — Tag & pill highlight |
| `#F8F7F4` / `#131C18` | ~16,4 : 1 | AAA — Section penutup gelap storefront |
| `#B5C2BA` / `#131C18` | ~9,8 : 1 | AAA — Teks sekunder pada section gelap |
| `#747D77` / `#F8F7F4` | ~3,9 : 1 | AA Non-text — Batas input & kontrol |

### 2.3 Batas Ruang Lingkup (Website Platform vs Produk Kado/Undangan)
Sistem desain **Warm Linen & Deep Emerald** di dokumen ini **hanya berlaku untuk platform website Kado Digital** (Storefront, Katalog, Detail Tema, Harga, Dashboard Builder, Portal Terima Beres, dan Panel Studio).

**Produk kado & undangan di halaman runtime (`/k/[token]`, `/u/[slug]`, `/demo/[slug]`) tidak terikat aturan visual dokumen ini.** Setiap tema produk bebas menggunakan palet warna, pairing font, ilustrasi, layout, dan gaya animasinya sendiri sesuai karakter momen (mis. romantis, ceria, adat tradisional, minimalis, atau *playful*). Satu-satunya standar teknis yang tetap dijaga pada produk adalah keterbacaan kontrol sistem (tombol suara, kurangi gerakan, navigasi, dan passphrase).

---

## 3. Identitas Visual & Branding

### 3.1 Wordmark & Simbol
* **Wordmark:** **Kado Digital** menggunakan `Plus Jakarta Sans` bobot 700, tracking `-0.03em`, warna `#16201B` (atau `#F8F7F4` pada latar gelap). Kata *Digital* dapat diberi aksen warna `#1B5E47` atau tetap monokrom demi kesan editorial maksimal.
* **Logomark:** Satu simbol geometris minimalis berukuran `28x28px` — gabungan bentuk **amplop terbuka + kilau empat sisi tunggal** di sudut kanan atas dalam stroke bersih `1.75px` atau siluet solid `#1B5E47` dengan aksen titik `#D4A359`.

### 3.2 Motif Visual Khas (Terkendali & Anti-Ramai)
1. **Wax Seal / Envelope Fold:** Penanda visual utama pada demo amplop dan kartu kado personal—bukan ditempel di setiap komponen UI.
2. **Framed Memory Card:** Bingkai foto rasio `4:5` atau `1:1` dengan padding putih bersih (`8px–12px`), hairline border, dan caption pendek di bawahnya.
3. **Editorial Serif Accent:** Satu kata emosional dalam headline menggunakan `Instrument Serif` *italic* (contoh: *Cerita kamu, jadi* ***kejutan*** *yang tak terlupakan.*).
4. **Subtle Paper Grain (Opsional 2%):** Hanya pada panggung demo kado, tidak pada halaman dashboard atau tabel harga.

### 3.3 Ikonografi & Fotografi
* **Ikon:** Menggunakan satu keluarga garis bersih (*Lucide Icons* / stroke `1.5px–1.75px`), ujung membulat lembut, tanpa campuran ikon 3D atau emoji acak di UI profesional.
* **Fotografi:** Hangat, natural, *authentic lifestyle* (pasangan, sahabat, momen ulang tahun, meja makan intim, detail bunga/kertas). Selalu simpan `focalPoint` agar wajah tidak terpotong di viewport mobile maupun desktop.

---

## 4. Tipografi & Bahasa

### 4.1 Pairing Font
* **Primary Sans (UI, Heading, Body, Angka):** `Plus Jakarta Sans` (400, 500, 600, 700). Fallback: `system-ui, -apple-system, sans-serif`.
* **Editorial Accent:** `Instrument Serif` (400 regular & italic) — **hanya** untuk aksen 1–2 kata pada H1/H2, kutipan surat, atau judul tema editorial. Jangan pernah dipakai untuk tombol, label input, navigasi, atau tabel harga.
* **Angka & Harga:** Wajib menggunakan `font-variant-numeric: tabular-nums` pada harga, countdown, statistik katalog, dan kuota tamu.

### 4.2 Type Scale

| Peran | Mobile | Desktop | Bobot / Line-Height / Tracking |
|---|---|---|---|
| **Display Hero (H1)** | `38–44px` | `60–68px` | 700 / `1.06` / `-0.035em` |
| **Section Heading (H2)** | `28–32px` | `40–46px` | 700 / `1.12` / `-0.03em` |
| **Card / Feature Title (H3)** | `19–20px` | `22–24px` | 600 / `1.25` / `-0.02em` |
| **Lead Paragraph** | `16–17px` | `18–19px` | 400 / `1.6` / `0` |
| **Body** | `15–16px` | `16px` | 400 / `1.65` / `0` |
| **Button / Nav** | `14–15px` | `15px` | 600 / `1.2` / `-0.01em` |
| **Caption / Badge** | `12–13px` | `13px` | 500–600 / `1.4` / `+0.02em` |

### 4.3 Voice & Microcopy
Bahasa Indonesia modern, hangat, ringkas, dan tidak kaku. Gunakan sapaan **kamu**.
* **H1 Hero:** *Cerita kamu, jadi* ***kejutan*** *yang tak terlupakan.*
* **Subjudul Hero:** *Buat kado ucapan interaktif untuk anniversary & ulang tahun—atau undangan digital modern untuk segala acara. Bisa rangkai sendiri dalam hitungan menit, atau serahkan terima beres ke tim kami.*
* **CTA Utama:** `Coba Demo Interaktif` | **CTA Sekunder:** `Jelajahi Katalog`
* **Mode Switcher:** `Buat Sendiri (Instan)` vs `Terima Beres (Dibantu Tim)`

---

## 5. Layout, Grid, & Responsivitas

| Breakpoint | Max Width | Grid | Gap | Padding Samping |
|---|---|---|---|---|
| Mobile (`320–639px`) | `100%` | 4 kolom | `16px` | `16px` (320) / `20px` (360+) |
| Tablet (`640–1023px`) | `960px` | 8 kolom | `20px` | `24–32px` |
| Desktop (`>=1024px`) | `1240px` | 12 kolom | `24px` | `32px` |

* **Spacing Scale:** `4, 8, 12, 16, 20, 24, 32, 40, 48, 64, 80, 96, 120px`.
* **Jarak Antar Section:** `72px` mobile, `112px` desktop.
* **Radius System:**
  * Input & small control: `10px`
  * Card standar & feature bento: `20px`
  * Interactive stage & hero showcase: `28px`
  * Pill button, badge, & filter chip: `999px`
* **Aturan In-App Browser (WhatsApp / IG WebView):**
  * Gunakan `min-height: 100dvh` pada layar penuh runtime kado/undangan.
  * Pastikan interaksi *scratch* atau *swipe* tidak menghalangi scroll vertikal halaman.
  * Tidak ada aksi penting yang hanya muncul saat *hover*.

---

## 6. Blueprint Arsitektur Halaman Utama (`/`) — Adaptasi Modern-Clean `invitee.web.id`

Urutan section dirancang mengikuti kekuatan alur konversi `invitee.web.id`, namun di-upgrade secara visual menjadi ultra-clean dan menempatkan **Kado Personal Interaktif** sebagai bintang utama:

1. **Sticky Navigation (`72px` desktop / `64px` mobile):**
   * Kiri: Logomark + Wordmark `Kado Digital`.
   * Tengah: `Produk & Tema`, `Fitur`, `Harga`, `Layanan`, `Inspirasi`.
   * Kanan: Ikon WhatsApp, link `Masuk`, dan tombol pill emerald `Buat Sekarang`.
2. **Hero Asimetris + Interactive Live Stage:**
   * Kiri (5 kolom): Pill eyebrow (`Kado Interaktif & Undangan Digital`), H1 editorial, subjudul, 2 CTA (`Coba Demo`, `Lihat Katalog`), serta 2 penanda ringkas (*Gratis coba 2 hari* · *Bisa mandiri atau terima beres*).
   * Kanan (7 kolom): **Stage Demo Interaktif** berlatar `#F1EFEA` dengan tab mini di atasnya (`Anniversary`, `Ulang Tahun`, `Undangan`). Di dalamnya terdapat kartu amplop interaktif yang **benar-benar bisa diklik/dibuka** untuk melihat foto bolak-balik dan pesan singkat langsung di halaman depan.
3. **Capabilities / Trust Strip (4 Kolom Clean):**
   * Strip tipis ber-border hairline menampilkan 4 pilar terukur (tanpa angka klaim palsu sebelum live): *6 Lini Momen*, *Interaksi Hidup di HP*, *Mandiri atau Terima Beres*, *Privasi & Rilis Terjadwal*.
4. **Katalog Tema Unggulan + Switcher Lini Produk (`#katalog-preview`):**
   * Tab cepat: **Kado Personal** *(default)*, **Wedding**, **Save The Date**, **Event & Party**.
   * Grid 3 kolom desktop (1 kolom mobile) menampilkan 6 kartu tema rasio `4:5` dengan preview bersih, dot palet 3 warna, badge kategori, serta tombol `Demo` & `Pilih`.
   * CTA bawah: `Lihat Semua Katalog` (`/katalog`) dan `Coba Gratis 2 Hari`.
5. **Bento Grid Fitur Unggulan (`#fitur` — 10+ Fitur Lengkap):**
   * Grid bento asimetris (kartu besar untuk **Mekanik Interaktif Kado** & **Smart Kirim WhatsApp + Buku Tamu**, kartu sedang untuk **QR Guest on Screen**, **Voice Note & Musik**, **Amplop Digital**, **Love Story & Multi-Acara**, **Rilis Terjadwal & Passphrase**, serta **Custom Preview WA**).
6. **Spotlight 3 Ekosistem Add-on (Alternating Clean Split Cards):**
   * **Spotlight 1 — Lensa Momen (Guest Camera):** Layout split teks + mockup kamera QR 4 langkah (*Buat Event -> Bagikan QR -> Potret -> Galeri Reveal ZIP*).
   * **Spotlight 2 — Rencana Momen (Planner):** Layout split teks + preview kartu Checklist, Timeline, Kanban, & Cloud Drive (*Gratis coba, unlock Rp79.000 sekali bayar*).
   * **Spotlight 3 — Smart Kirim WhatsApp & Buku Tamu:** Penjelasan pengiriman link personal `?to=Nama`, grouping tamu, monitor RSVP, dan top-up kredit.
7. **Cara Kerja Hybrid (2 Tab: `Buat Sendiri` vs `Terima Beres`):**
   * 3 langkah horizontal yang sangat ringkas dan jelas agar pembeli langsung paham perbedaan kedua mode.
8. **Pricing Section (`#harga` — 4 Tab Konsisten):**
   * Tab: **Kado Personal** *(default)*, **Wedding**, **Save The Date**, **Event & Party**.
   * Kartu paket sejajar dengan highlight border Emerald `#1B5E47` + badge Champagne Gold `#D4A359` untuk paket *Paling Populer*.
   * Catatan transparan di bawah tabel untuk opsi add-on *Terima Beres*, perpanjangan masa aktif, dan *Express*.
9. **FAQ Accordion Clean:**
   * 6–8 pertanyaan utama (perbedaan Mandiri vs Terima Beres, cara kerja rilis terjadwal, privasi foto, masa aktif, revisi, dan cara share ke WhatsApp).
10. **Dark Emerald Closing CTA (`#131C18`) & Clean Footer:**
    * Blok penutup kontras tinggi: *"Siap bikin momen berikutnya terasa lebih personal?"* dengan CTA `Mulai Gratis Sekarang` dan `Tanya via WhatsApp`.
    * Footer 4 kolom terstruktur + floating tombol WhatsApp yang sopan (tidak menutupi konten atau CTA mobile).

---

## 7. Spesifikasi Halaman Katalog (`/katalog`) & Detail Tema (`/katalog/[slug]`)

### 7.1 Halaman Katalog (`/katalog`)
* **Step 1 — Selector Lini Produk (Horizontal Pill Tabs):**
  `Kado Personal` | `Wedding` | `Save The Date` | `Event & Party` | `Lensa Momen` | `Rencana Momen`
* **Step 2 — Sub-filter Dinamis:**
  * Untuk *Kado Personal*: `Semua`, `Anniversary`, `Ulang Tahun`, `Sahabat`, `LDR`, `Interaktif/Kuis`.
  * Untuk *Wedding*: `Populer`, `Terbaru`, `Adat Nusantara`, `Artistik`, `Modern`, `Klasik`.
  * Untuk *Event & Party*: `Birthday Party`, `Wisuda`, `Aqiqah`, `Khitanan`, `Bukber`, `Hari Raya`.
* **Toolbar Pencarian & Filter Warna:** Input search (`Cari judul tema...`) + 8 dot filter warna (`Emerald`, `Linen`, `Emas`, `Maroon`, `Hitam`, `Blush`, `Putih`, `Sage`).

### 7.2 Halaman Detail Tema (`/katalog/[slug]`)
* **Kiri:** Preview perangkat interaktif dengan toggle `Mobile` / `Desktop` + tombol `Buka Demo Layar Penuh`.
* **Kanan:**
  * Judul tema, kategori, dan **Cerita Konsep Tema**.
  * **Palet Warna (3 Swatch HEX):** `Aksen`, `Dasar`, `Lembut`.
  * **Daftar Mekanik & Fitur yang Didukung** (mis. *Amplop Pembuka, Flip Photo, Voice Note, Rilis Terjadwal*).
  * **Dual Action Hybrid:**
    * Tombol Utama (Emerald): `Gunakan Tema — Buat Sendiri` (Gratis Trial 2 Hari).
    * Tombol Sekunder (Outline / Gold Soft): `Pesan Terima Beres (Dibantu Tim)`.

---

## 8. Sistem Gerak (*Motion Craft*) & Interaksi

* **Easing Standar:** `cubic-bezier(0.22, 1, 0.36, 1)` (cepat di awal, mendarat lembut tanpa memantul berlebihan).
* **Durasi:**
  * Micro-feedback (button/chip/hover): `150ms`
  * UI transition (tab/modal/drawer): `280ms`
  * Card flip / reveal: `420ms`
  * Envelope unboxing sequence: `800ms` (selalu disertai tombol `Lewati`).
* **Properti yang Diizinkan:** Hanya `transform` dan `opacity` (GPU-composited, target 60 fps).
* **Reduced Motion:** Wajib mematuhi `@media (prefers-reduced-motion: reduce)` dan tombol *Kurangi gerakan* di runtime kado (mengubah animasi flip/unbox menjadi transisi *crossfade* instan tanpa menghilangkan konten).
* **Watermark Preview:** Pada `/preview/{token}` dan proyek Trial, gunakan **top sticky bar tipis** (`PREVIEW — BELUM DITERBITKAN`) alih-alih watermark diagonal di tengah foto agar wajah dan komposisi mudah diperiksa.

---

## 9. CSS Design Tokens (Siap Pakai)

```css
:root {
  color-scheme: light;

  /* Surfaces */
  --bg-canvas: #f8f7f4;
  --bg-surface: #ffffff;
  --bg-subtle: #f1efea;
  --bg-accent-soft: #e6f2ec;
  --bg-gold-soft: #fbf4e6;
  --bg-dark: #131c18;

  /* Text */
  --text-primary: #16201b;
  --text-secondary: #526058;
  --text-inverse: #f8f7f4;
  --text-inverse-muted: #b5c2ba;

  /* Brand Accents */
  --accent-primary: #1b5e47;
  --accent-hover: #144a37;
  --accent-pressed: #0f3a2b;
  --accent-gold: #d4a359;

  /* Borders & Status */
  --border-hairline: #e4e2dc;
  --border-control: #747d77;
  --status-success: #157347;
  --status-warning: #9a6700;
  --status-error: #b4233c;
  --focus-ring: #1b5e47;

  /* Typography */
  --font-sans: "Plus Jakarta Sans", system-ui, -apple-system, sans-serif;
  --font-serif: "Instrument Serif", Georgia, serif;

  /* Radii */
  --radius-sm: 10px;
  --radius-md: 16px;
  --radius-lg: 20px;
  --radius-stage: 28px;
  --radius-pill: 999px;

  /* Shadows (minimal, clean) */
  --shadow-card-hover: 0 12px 32px -12px rgb(22 32 27 / 8%);
  --shadow-stage: 0 24px 56px -16px rgb(22 32 27 / 12%);
  --shadow-overlay: 0 28px 72px -16px rgb(22 32 27 / 20%);

  /* Motion */
  --ease-clean: cubic-bezier(0.22, 1, 0.36, 1);
  --dur-fast: 150ms;
  --dur-base: 280ms;
  --dur-reveal: 420ms;
  --dur-unbox: 800ms;
}

[data-surface="dark"] {
  --focus-ring: #e6f2ec;
}

:focus-visible {
  outline: 2.5px solid var(--focus-ring);
  outline-offset: 3px;
}
```

---

## 10. Checklist Kualitas Sebelum Rilis UI

* Tidak ada *horizontal overflow* mulai lebar `320px` hingga `1440px+`.
* Demo amplop interaktif di hero dapat dibuka, dibalik, dan diulang lewat sentuhan HP, klik mouse, maupun keyboard (`Enter`/`Space`).
* Seluruh 4 tab harga dan 6 lini katalog konsisten antara Landing Page, Katalog, Detail Tema, dan Checkout.
* Tidak ada teks putih di atas warna Champagne Gold (`#D4A359`).
* Mode *Buat Sendiri* dan *Terima Beres* terlihat jelas tanpa membingungkan pengguna.
* Pengujian lulus di Chrome Android, Safari iOS, serta **WhatsApp & Instagram In-App WebView**.
