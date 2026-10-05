import Lenis from 'lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

/** Lenis dijalankan oleh ticker GSAP supaya satu sumber waktu dengan ScrollTrigger. */
export function initSmoothScroll() {
  const lenis = new Lenis({ lerp: 0.1, smoothWheel: true });
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((time) => lenis.raf(time * 1000));
  gsap.ticker.lagSmoothing(0);
  window.lenis = lenis;
  return lenis;
}
