import 'lenis/dist/lenis.css';
import './styles.css';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import { initSmoothScroll } from './modules/smooth.js';
import { initNavbar } from './modules/navbar.js';
import { initHero } from './modules/hero.js';
import { initReveals } from './modules/reveal.js';
import { initChecklist } from './modules/checklist.js';
import { initParallax } from './modules/parallax.js';
import { SPACE_NAV } from './config.js';

gsap.registerPlugin(ScrollTrigger, SplitText);

const lenis = initSmoothScroll();
initNavbar(lenis);

/*-- ANIMASI INTRO --*/
const intro = document.getElementById('intro');
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
if (intro && !reduceMotion) {
  lenis.stop();
  const step0 = document.querySelector('[data-step]');
  const step0P = step0 ? step0.querySelector('p') : null;
  const step0Lines = step0 ? step0.querySelectorAll('.step-line') : [];

  const tl = gsap.timeline({
    onComplete: () => {
      intro.remove();
      lenis.start();
    },
  });

  tl.from(intro.querySelector('svg'), { autoAlpha: 0, scale: 0.8, duration: 0.5, ease: 'power2.out' })
    .from(intro.querySelector('.intro__title'), { autoAlpha: 0, y: 24, duration: 0.6, ease: 'power3.out' }, 0.1)
    .from(intro.querySelector('.intro__sub'), { autoAlpha: 0, y: 12, duration: 0.5 }, 0.3)
    .to(intro.querySelector('.intro__bar span'), { scaleX: 1, duration: 1.2, ease: 'power2.inOut' }, 0.2)
    .to(intro.querySelector('.intro__inner'), { autoAlpha: 0, y: -20, duration: 0.45 }, 1.6)
    .to(intro, { yPercent: -100, duration: 0.9, ease: 'power4.inOut' }, 1.75)
    // Hero pertama muncul setelah overlay naik
    .add(() => {
      lenis.start();
    }, 2.3);

  if (step0Lines.length) {
    tl.fromTo(step0Lines, { yPercent: 105 }, { yPercent: 0, duration: 0.85, stagger: 0.06, ease: 'power3.out' }, 2.05);
  }
  if (step0P) {
    tl.fromTo(step0P, { autoAlpha: 0, y: 16 }, { autoAlpha: 1, y: 0, duration: 0.7, ease: 'power2.out' }, 2.2);
  }

  // Navbar & HUD elemen lain masuk ke frame (via class + CSS transition)
  tl.call(() => document.body.classList.add('is-loaded'), null, 2.1);
} else if (intro) {
  intro.remove();
  document.body.classList.add('is-loaded');
}

// Space/Shift+Space = navigasi halus: saat di hero maju/mundur 1 fase video,
// di luar hero lompat tepat 1 section (bukan +0.9 layar seperti versi lama).
const heroEl = document.querySelector('[data-hero]');
const NAV_OFFSET = 72; // kompensasi navbar fixed agar judul section tidak ketutupan

function smoothTo(y, duration = SPACE_NAV.sectionDuration) {
  if (lenis) {
    lenis.scrollTo(y, SPACE_NAV.easing ? { duration, easing: SPACE_NAV.easing } : { duration });
  } else {
    window.scrollTo({ top: y, behavior: 'smooth' });
  }
}

window.addEventListener('keydown', (e) => {
  if (e.code !== 'Space') return;
  if (document.getElementById('intro')) return; // tunggu intro selesai dulu
  const t = e.target;
  if (t && (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA' || t.tagName === 'SELECT' || t.isContentEditable)) return;
  e.preventDefault();
  if (e.repeat) return; // tahan tombol jangan menumpuk lompatan

  // Lepas fokus dari tombol/link supaya Space tidak memicu klik native
  // (mis. tombol stage setelah diklik) yang bisa menambah lompatan ganda.
  const focused = document.activeElement;
  if (focused && focused.matches('button, a, [role="button"]')) focused.blur();

  const dir = e.shiftKey ? -1 : 1;
  const y = window.scrollY;
  const stageBtns = heroEl ? [...heroEl.querySelectorAll('[data-stage-btn]')] : [];
  const heroReady = !!heroEl && heroEl.style.height !== '' && stageBtns.length > 0;
  const heroBottom = heroEl ? heroEl.offsetTop + heroEl.offsetHeight - window.innerHeight : 0;

  // 1) Di area scrub hero: maju/mundur 1 fase memakai tombol stage
  //    (posisi target & durasi diatur oleh modul hero + src/config.js)
  if (heroReady && y < heroBottom - 4) {
    const active = stageBtns.findIndex((b) => b.classList.contains('is-active'));
    const next = (active < 0 ? 0 : active) + dir;
    if (next >= 0 && next < stageBtns.length) return stageBtns[next].click();
    if (next < 0) return smoothTo(heroEl.offsetTop);
  }

  // 2) Di luar hero: lompat tepat ke awal section berikutnya / sebelumnya
  const stops = [...document.querySelectorAll('main > section')]
    .filter((s) => s !== heroEl)
    .map((s) => Math.max(0, s.offsetTop - NAV_OFFSET));
  const maxY = document.documentElement.scrollHeight - window.innerHeight;

  if (dir > 0) {
    smoothTo(stops.find((s) => s > y + 8) ?? maxY);
  } else {
    const prev = stops.filter((s) => s < y - 8);
    if (prev.length) return smoothTo(prev[prev.length - 1]);
    // Sebelum section pertama: mundur ke fase terakhir hero (atau diam di paling atas)
    if (y > 8 && heroReady) return stageBtns[stageBtns.length - 1].click();
    smoothTo(0);
  }
});
initReveals();
initChecklist();
initParallax();
initHero(lenis).then(() => ScrollTrigger.refresh());

