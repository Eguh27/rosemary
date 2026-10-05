<![CDATA[# 🌿 Rosemary — Jurnal Botani & Panduan Budidaya

Website eksplorasi interaktif tentang tanaman **Rosemary** (*Salvia rosmarinus*): dari satu stek batang kecil hingga semak rimbun berbunga lilac. Menampilkan scroll-driven video hero, parallax showcase, panduan budidaya, dan checklist perawatan interaktif.

![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=flat&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=flat&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat&logo=javascript&logoColor=black)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=flat&logo=vite&logoColor=white)
![GSAP](https://img.shields.io/badge/GSAP-88CE02?style=flat&logo=greensock&logoColor=black)

---

## ✨ Fitur Utama

- **Scroll-Driven Video Hero** — Video tanaman rosemary yang di-scrub mengikuti scroll, dilengkapi virtual camera (zoom, drift, roll) dan 4 narasi fase pertumbuhan bertransisi sinematik
- **Parallax Showcase** — Kartu profil aroma dengan efek parallax gambar dan glassmorphism overlay
- **Journey Panel** — Stacking curtain parallax yang menampilkan siklus pertumbuhan 4 babak
- **Panduan Budidaya** — 5 langkah praktis menanam rosemary dari stek, dengan parallax background
- **Koleksi Kuliner** — Resep dan khasiat herbal rosemary dalam format kartu editorial
- **Checklist Interaktif** — Jurnal perawatan mingguan dengan progress bar dan penyimpanan status di `localStorage`
- **Intro Overlay** — Animasi pembuka dengan loading bar dan reveal bertahap
- **Keyboard Navigation** — `Space` / `Shift+Space` untuk navigasi antar fase hero dan section
- **Smooth Scroll** — Powered by Lenis untuk pengalaman scroll yang halus
- **Accessibility** — Semantic HTML, `aria-label`, `aria-hidden`, dan dukungan `prefers-reduced-motion`
- **Responsive** — Adaptif untuk desktop dan mobile

## 🛠️ Tech Stack

| Teknologi | Fungsi |
|---|---|
| [Vite](https://vite.dev/) | Build tool & dev server |
| [GSAP](https://gsap.com/) | Animasi scroll-driven, timeline, SplitText |
| [Lenis](https://lenis.darkroom.engineering/) | Smooth scroll engine |
| Vanilla CSS | Design system dengan custom properties |

## 🚀 Menjalankan Lokal

**Prasyarat:** [Node.js](https://nodejs.org/) versi 18+

```bash
# Clone repository
git clone https://github.com/<username>/rosemary.git
cd rosemary

# Install dependencies
npm install

# Jalankan dev server
npm run dev
```

Buka `http://localhost:5173` di browser.

### Build untuk Production

```bash
npm run build
npm run preview
```

## 📁 Struktur Project

```
rosemary/
├── index.html                  # Entry HTML utama
├── package.json
├── public/
│   ├── favicon.svg             # Favicon ikon rosemary
│   ├── icons.svg               # SVG sprite icons
│   └── media/
│       ├── hero.mp4            # Video hero scroll-driven
│       ├── rosemary_*.jpg      # Foto editorial (3 file)
│       └── draft/
│           └── k1-k7.webp      # Gambar parallax showcase (7 file)
└── src/
    ├── main.js                 # Entry JS, orchestrator semua modul
    ├── config.js               # Konfigurasi navigasi keyboard
    ├── styles.css              # Seluruh CSS & design system
    └── modules/
        ├── smooth.js           # Inisialisasi Lenis smooth scroll
        ├── navbar.js           # Navbar scroll state & anchor navigation
        ├── hero.js             # Hero video scrub timeline & virtual camera
        ├── reveal.js           # Scroll-triggered reveal animations
        ├── parallax.js         # Parallax images & journey stacking panels
        └── checklist.js        # Checklist interaktif dengan localStorage
```

## 🎨 Design System

Website menggunakan CSS custom properties yang terorganisir:

- **Palette** — Botanical color scheme: moss, sage, paper, lilac, amber, copper
- **Typography** — Young Serif (display), Playfair Display (editorial), Plus Jakarta Sans (body), Courier Prime (mono)
- **Spacing** — Skala konsisten dari `xs` hingga `3xl`
- **Motion** — Custom easing curves dan duration tokens
- **Components** — Glassmorphism cards, frosted navbar, parallax cards, metric grids

## ⌨️ Keyboard Shortcuts

| Tombol | Fungsi |
|---|---|
| `Space` | Maju ke fase berikutnya (di hero) / section berikutnya |
| `Shift + Space` | Mundur ke fase sebelumnya / section sebelumnya |

---

<p align="center">
  <sub>© 2026 Rosemary Educational Compendium · Dibangun dengan GSAP, Lenis & Vite</sub>
</p>
]]>
