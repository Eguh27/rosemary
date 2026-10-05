/**
 * =====================================================================
 * KONFIGURASI TOMBOL SPACE — atur "rasa" scroll di sini
 * ---------------------------------------------------------------------
 * sectionDuration   : durasi lompatan antar-section di luar hero (detik).
 *                     Makin besar makin santai. Contoh: 1.0 = cepat,
 *                     2.5 = sangat santai.
 * heroPhaseDuration : durasi lompatan antar-fase video di dalam hero (detik).
 *                     1 fase = 1 majunya video dari 4 fase yang ada.
 * easing            : kurva percepatan, fungsi dari 0 → 1. Beberapa pilihan:
 *                     - cubic in-out (default) = start & akhir halus:
 *                         (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2)
 *                     - quad in-out (lebih ringan):
 *                         (t) => (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2)
 *                     - mulai pelan, akhir cepat (power2.in):
 *                         (t) => t * t
 *                     - null = easing bawaan Lenis (cepak di awal, terasa "brutal")
 * =====================================================================
 */
export const SPACE_NAV = {
  sectionDuration: 1.6,
  heroPhaseDuration: 2.0,
  easing: (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2),
};
