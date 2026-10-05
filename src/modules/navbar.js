import { ScrollTrigger } from 'gsap/ScrollTrigger';

export function initNavbar(lenis) {
  const nav = document.querySelector('[data-nav]');
  if (!nav) return;

  lenis.on('scroll', ({ scroll }) => nav.classList.toggle('is-scrolled', scroll > 40));

  const links = nav.querySelectorAll('a[href^="#"]');

  links.forEach((link) => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const id = link.getAttribute('href');
      lenis.scrollTo(id === '#hero' ? 0 : id, { offset: -72, duration: 1.4 });
    });

    const targetId = link.getAttribute('href');
    if (targetId && targetId !== '#hero') {
      const targetEl = document.querySelector(targetId);
      if (targetEl) {
        ScrollTrigger.create({
          trigger: targetEl,
          start: 'top 55%',
          end: 'bottom 45%',
          onToggle: (self) => link.toggleAttribute('aria-current', self.isActive),
        });
      }
    }
  });
}
