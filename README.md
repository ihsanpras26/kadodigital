# Kado Digital

Platform kado ucapan digital interaktif (anniversary, ulang tahun, sahabat, pasangan LDR) dan undangan digital modern dengan dukungan pembuatan mandiri maupun layanan terima beres.

## Tech Stack

- **Framework:** Next.js 15 (App Router), React 19, TypeScript
- **Styling & Motion:** Tailwind CSS v4, Framer Motion
- **3D & Interaktivitas:** Three.js (`desa-asri` & `saung-kenangan`), Web Audio API, `qrcode`
- **Validasi Skema:** Zod

## Menjalankan Secara Lokal

```bash
npm install
npm run dev
```

Buka `http://localhost:3000` di browser.

### Script Tersedia

- `npm run dev` : Menjalankan development server
- `npm run typecheck` : Pengecekan tipe TypeScript (`tsc --noEmit`)
- `npm run lint` : Menjalankan ESLint Next.js
- `npm run build` : Build produksi (`next build`)
- `npm run start` : Menjalankan hasil build produksi

## Rute Utama

- `/` : Halaman utama platform
- `/katalog` & `/katalog/[slug]` : Eksplorasi tema lintas lini produk
- `/demo/[slug]` : Pratinjau interaktif per tema (termasuk tema 3D `/demo/desa-asri` dan `/demo/saung-kenangan`, mendukung parameter `?to=NamaTamu`)
- `/buat` : Studio penyusunan kado & undangan (Mandiri / Terima Beres)
- `/layanan` : Informasi layanan pendukung

## Struktur Direktori

```text
src/
├── app/                # Halaman & routing App Router
├── components/
│   ├── builder/        # Studio pembuatan (/buat)
│   ├── catalog/        # Kartu tema, filter, & preview katalog
│   ├── demo/           # Runtime demo interaktif & engine 3D Three.js (desa-world)
│   ├── home/           # Seksi halaman utama
│   ├── layout/         # Navbar, Footer, ChromeShell (isolasi /demo/*)
│   └── services/       # Halaman layanan
├── data/               # Data katalog, harga, konten demo, & dunia desa 3D
└── lib/                # Skema Zod & helper utilitas
public/
└── themes/             # Aset ilustrasi tema
```
