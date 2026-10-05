import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

export function initParallax() {
  const mm = gsap.matchMedia();

  mm.add('(prefers-reduced-motion: no-preference)', () => {
    const panels = gsap.utils.toArray('[data-journey-panel]');
    if (!panels.length) return;

    panels.forEach((panel, i) => {
      const isLast = i === panels.length - 1;
      const nextPanel = panels[i + 1];
      const bg = panel.querySelector('.journey-panel__bg');
      const glass = panel.querySelector('.journey-panel__glass');
      const vignette = panel.querySelector('.journey-panel__vignette');

      // Animasi Zoom-Out: Gambar mulai ter-zoom in 150% (scale: 1.5) sebelum di-scroll,
      // lalu saat di-scroll naik ke posisinya akan zoom-out mulus ke 100% (scale: 1.0).
      // Skala selalu >= 1.0 sehingga TIDAK PERNAH ada frame hitam yang bocor di belakangnya.
      if (bg) {
        if (i === 0) {
          // Panel 1: zoom-out dari 1.5 ke 1.0 saat di-scroll masuk dari intro
          gsap.fromTo(
            bg,
            { scale: 1.5, transformOrigin: 'center center' },
            {
              scale: 1.0,
              ease: 'none',
              scrollTrigger: {
                trigger: panel,
                start: 'top 90%',
                end: 'top top',
                scrub: true,
                invalidateOnRefresh: true,
              },
            }
          );
        } else {
          // Panel 2, 3, 4: mulai zoom 150% (1.5) saat meluncur naik dari bawah,
          // lalu zoom-out ke 100% (1.0) saat menutup panel sebelumnya.
          gsap.fromTo(
            bg,
            { scale: 1.5, transformOrigin: 'center center' },
            {
              scale: 1.0,
              ease: 'none',
              scrollTrigger: {
                trigger: panel,
                start: 'top bottom',
                end: 'top top',
                scrub: true,
                invalidateOnRefresh: true,
              },
            }
          );
        }
      }

      // Animasi masuk frame teks ber-style backdrop blur (efek seperti jatuh / drop)
      if (glass) {
        gsap.fromTo(
          glass,
          { y: -70, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            ease: 'none',
            scrollTrigger: {
              trigger: panel,
              start: 'top 80%',
              end: 'top 20%',
              scrub: 0.5,
              invalidateOnRefresh: true,
            },
          }
        );
      }

      // Pin panel saat mencapai atas sampai tertutup penuh oleh panel berikutnya
      if (!isLast && nextPanel) {
        ScrollTrigger.create({
          trigger: panel,
          start: 'top top',
          endTrigger: nextPanel,
          end: 'top top',
          pin: true,
          pinSpacing: false,
          invalidateOnRefresh: true,
        });

        // Panel sebelumnya TETAP pada scale 1.0 (TIDAK dikecilkan agar tidak ada frame hitam)
        // Hanya frame teks yang menghilang lembut dan vignette menggelap tipis
        if (glass) {
          gsap.fromTo(
            glass,
            { y: 0, opacity: 1 },
            {
              y: -40,
              opacity: 0,
              ease: 'none',
              scrollTrigger: {
                trigger: nextPanel,
                start: 'top 100%',
                end: 'top 45%',
                scrub: true,
                invalidateOnRefresh: true,
              },
            }
          );
        }

        if (vignette) {
          gsap.fromTo(
            vignette,
            { opacity: 0.7 },
            {
              opacity: 0.95,
              ease: 'none',
              scrollTrigger: {
                trigger: nextPanel,
                start: 'top bottom',
                end: 'top top',
                scrub: true,
                invalidateOnRefresh: true,
              },
            }
          );
        }
      }
    });

    // Parallax untuk gambar kartu aroma (scale 1.15 agar tepi tidak bocor)
    const pImgs = gsap.utils.toArray('[data-parallax-img]');
    pImgs.forEach((img) => {
      const scope = img.closest('.parallax-card') || img;
      gsap.fromTo(
        img,
        { scale: 1.15, yPercent: -6 },
        {
          scale: 1.15,
          yPercent: 6,
          ease: 'none',
          scrollTrigger: {
            trigger: scope,
            start: 'top bottom',
            end: 'bottom top',
            scrub: true,
            invalidateOnRefresh: true,
          },
        }
      );
    });

    // Parallax background foto pada section hijau (menanam & perawatan)
    const pBgs = gsap.utils.toArray('[data-parallax-bg]');
    pBgs.forEach((img) => {
      const scope = img.closest('section') || img;
      gsap.fromTo(
        img,
        { scale: 1.18, yPercent: -8 },
        {
          scale: 1.18,
          yPercent: 8,
          ease: 'none',
          scrollTrigger: {
            trigger: scope,
            start: 'top bottom',
            end: 'bottom top',
            scrub: true,
            invalidateOnRefresh: true,
          },
        }
      );
    });
  });
}
