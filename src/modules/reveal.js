import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

/** Setiap [data-reveal-group] memunculkan anak [data-reveal] bergantian (stagger). */
export function initReveals() {
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduce) return;

  gsap.utils.toArray('[data-reveal-group]').forEach((group) => {
    const items = group.querySelectorAll('[data-reveal]');
    gsap.set(items, { autoAlpha: 0, y: 48 });
    ScrollTrigger.create({
      trigger: group,
      start: 'top 82%',
      once: true,
      onEnter: () => gsap.to(items, { autoAlpha: 1, y: 0, duration: 0.9, ease: 'power3.out', stagger: 0.12 }),
    });
  });
}
