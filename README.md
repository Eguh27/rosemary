# 🌿 Rosemary

Website eksplorasi interaktif tentang tanaman **Rosemary** (*Salvia rosmarinus*): dari satu stek batang kecil hingga semak rimbun berbunga lilac. Menampilkan *scroll-driven video hero*, *parallax showcase*, panduan budidaya bertahap, dan checklist perawatan mingguan interaktif.

[![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vite.dev/)
[![GSAP](https://img.shields.io/badge/GSAP-88CE02?style=for-the-badge&logo=greensock&logoColor=black)](https://gsap.com/)
[![Lenis](https://img.shields.io/badge/Lenis-black?style=for-the-badge&logoColor=white)](https://lenis.darkroom.engineering/)
[![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](LICENSE)

---

## 📑 Daftar Isi

- [Fitur Utama](#-fitur-utama)
- [Tech Stack](#️-tech-stack)
- [Menjalankan Lokal](#-menjalankan-lokal)
- [Struktur Project](#-struktur-project)
- [Design System](#-design-system)
- [Navigasi Keyboard](#️-navigasi-keyboard)
- [Lisensi](#-lisensi)

---

## ✨ Fitur Utama

- 🎥 **Scroll-Driven Video Hero** — Video pertumbuhan rosemary yang di-scrub presisi mengikuti scroll pengguna, dipadukan dengan *virtual camera* (zoom, drift, roll) serta 4 narasi fase pertumbuhan bertransisi sinematik:
  1. *Fase 01: Stek Batang & Perakaran Awal*
  2. *Fase 02: Pertumbuhan Vegetatif Cepat*
  3. *Fase 03: Pembungaan Lilac Musim Semi*
  4. *Fase 04: Pemanenan & Semak Dewasa*
- 🧭 **Journey Siklus Hidup** — Transisi *stacking curtain parallax* yang menyajikan tahapan siklus hidup tanaman secara mendalam.
- 🍃 **Aroma Showcase & Varietas** — Galeri kartu profil aroma dan visual botani dengan efek *depth parallax* dan *glassmorphism*.
- 📖 **Panduan 5 Langkah Budidaya** — Panduan praktis bertahap mulai dari pemilihan stek, media tanam berpasir, intensitas sinar matahari, teknik penyiraman, hingga pemangkasan rutin.
- 🍳 **Koleksi Kuliner & Khasiat** — Kartu editorial resep (*Rosemary-Infused Olive Oil*, *Garlic & Rosemary Roasted Potatoes*) serta manfaat kesehatan dan aromaterapi.
- 📋 **Checklist Perawatan Mingguan** — Jurnal perawatan interaktif dengan bilah progres real-time dan penyimpanan status otomatis via `localStorage`.
- 🎬 **Intro Overlay & Loading Reveal** — Layar pembuka elegan dengan progress loading dan transisi halus ke halaman utama.
- ⌨️ **Navigasi Keyboard Cepat** — Navigasi antar fase hero dan section cukup dengan tombol spasi.
- 🌊 **Smooth Scroll** — Didukung oleh engine Lenis untuk pergerakan halaman yang ultra-halus dan responsif.
- ♿ **Aksesibilitas & Inklusivitas** — Menggunakan HTML semantik, atribut ARIA, serta kepatuhan penuh terhadap media query `prefers-reduced-motion`.

---

## 🛠️ Tech Stack

| Teknologi | Fungsi |
|---|---|
| [Vite](https://vite.dev/) | Bundler modern & local development server |
| [GSAP](https://gsap.com/) & ScrollTrigger | Timeline animasi, scrub video hero, dan scroll animations |
| [Lenis](https://lenis.darkroom.engineering/) | Smooth scrolling engine |
| Vanilla CSS | Design system kustom dengan CSS custom properties, glassmorphism, dan fluid typography |
| Semantic HTML5 | Struktur web yang aksesibel dan SEO-friendly |

---

## 🚀 Menjalankan Lokal

### Prasyarat
Pastikan Anda telah menginstal [Node.js](https://nodejs.org/) (versi 18 ke atas) dan [Git](https://git-scm.com/).

### Langkah Instalasi

```bash
# 1. Clone repository
git clone https://github.com/Eguh27/rosemary.git

# 2. Masuk ke direktori project
cd rosemary

# 3. Install dependencies
npm install

# 4. Jalankan server pengembangan lokal
npm run dev
```

Buka URL yang ditampilkan di terminal (biasanya `http://localhost:5173`) di peramban favorit Anda.

### Build untuk Produksi

```bash
# Membuat bundle produksi
npm run build

# Meninjau bundle produksi secara lokal
npm run preview
```

---

## 📁 Struktur Project

```text
rosemary/
├── index.html                  # Entry point HTML utama & konten semantik
├── package.json                # Dependencies & script project
├── public/
│   ├── favicon.svg             # Favicon botani vektor
│   ├── icons.svg               # SVG icon sprite
│   └── media/
│       ├── hero.mp4            # Video resolusi tinggi untuk scroll-driven hero
│       ├── rosemary_*.jpg      # Foto editorial kuliner & botani
│       └── draft/
│           └── k1-k7.webp      # Gambar webp teroptimasi untuk parallax showcase
└── src/
    ├── main.js                 # Entry script, inisialisasi & orkestrasi modul
    ├── config.js               # Konfigurasi pintasan keyboard & timing
    ├── styles.css              # Design system, CSS variables, typography & layout
    └── modules/
        ├── smooth.js           # Konfigurasi Lenis smooth scroll
        ├── navbar.js           # Scroll state & navigasi anchor navbar
        ├── hero.js             # Scrub video hero, virtual camera & subtitle timeline
        ├── reveal.js           # ScrollTrigger reveal animations
        ├── parallax.js         # Parallax gambar galeri & stacking journey panels
        └── checklist.js        # Logika checklist interaktif & localStorage
```

---

## 🎨 Design System

Website dibangun dengan arsitektur CSS kustom yang kohesif:

- **Color Palette** — Terinspirasi warna botani Mediterania:
  - `Moss` (`#2d4a22`), `Sage` (`#879f80`), `Lilac` (`#b8a9c9`), `Amber` (`#d4a373`), `Paper` (`#fbf8f3`), `Earth` (`#1c2826`).
- **Typography** — Kombinasi font editorial dan modern:
  - *Young Serif* (Judul hero & display)
  - *Playfair Display* (Editorial & aksen)
  - *Plus Jakarta Sans* (Teks isi & antarmuka)
  - *Courier Prime* (Label teknis & metadata botani)
- **Glassmorphism & Lighting** — Efek blur dan border transparan halus untuk kartu informasi.
- **Motion Principles** — Kurva easing natural (`cubic-bezier`), micro-interactions pada tombol dan kartu.

---

## ⌨️ Navigasi Keyboard

| Tombol | Tindakan |
|---|---|
| <kbd>Space</kbd> | Melompat maju ke fase berikutnya (di hero) atau seksi berikutnya |
| <kbd>Shift</kbd> + <kbd>Space</kbd> | Melompat mundur ke fase sebelumnya atau seksi sebelumnya |

---

## 📄 Lisensi

Didistribusikan di bawah Lisensi MIT. Lihat berkas `LICENSE` untuk informasi lebih lanjut.

---

<p align="center">
  Dibuat dengan dedikasi botani oleh <a href="https://github.com/Eguh27">Eguh27</a><br>
  <sub>© 2026 Rosemary Educational Compendium · Powered by GSAP, Lenis & Vite</sub>
</p>
