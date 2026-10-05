import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import { SPACE_NAV } from '../config.js';

gsap.registerPlugin(ScrollTrigger, SplitText);

// ---- Konfigurasi: ubah di sini saja ----
const STEPS = 4;          // jumlah step (= jumlah gambar master)
const HOLD = 0.5;         // jeda di step terakhir (satuan timeline)
const VH_PER_UNIT = 1.8;  // panjang scroll per satuan, kelipatan tinggi layar (besar = lebih lambat/santai)
const SNAP = false;       // true = scroll "menempel" ke tiap step

// Kamera virtual: bergerak mengikuti scroll, di atas gerakan kamera pada video.
// Semua elemen web (ranting, teks) mengikuti arah kamera ini dengan kedalaman berbeda.
const CAMERA = {
  zoom: [1.08, 1.3],        // skala awal → akhir (push-in). Awal >1 agar tepi tidak terlihat saat roll
  drift: { x: -4, y: -3 },  // pergeseran kamera, % ukuran video (negatif = kamera menggeser ke kanan/atas)
  roll: -1,                 // kemiringan akhir, derajat
  origin: '68% 60%',        // titik fokus push-in = posisi tanaman di frame
};

// Gerak teks hero: mengikuti gerak kamera per segmen sebagai objek di dalam scene
const TEXT_MOTION = {
  // Waktu tampil penuh & batas transisi (satuan timeline)
  // Step 1: full [0, 0.38] (durasi 0.38 >= 0.35)
  // Step 2: enter [0.60, 0.82], full [0.82, 1.18] (durasi 0.36 >= 0.35, centered di 1.0)
  // Step 3: enter [1.40, 1.65], full [1.65, 2.18] (durasi 0.53 >= 0.35, centered di 2.0)
  // Step 4: enter [2.40, 2.65], full [2.65, 3.50] (durasi 0.85 >= 0.35, centered di 3.0)
  // Crossfade overlap: [0.60, 0.68] = 0.08, [1.40, 1.48] = 0.08, [2.40, 2.48] = 0.08 (semua <= 0.10)
  timing: {
    holdMin: 0.35,         // durasi minimum tampil penuh di sekitar label (0, 1, 2, 3)
    exitDuration: 0.30,    // durasi animasi keluar tiap step
    enterDurationA: 0.22,  // durasi masuk step 2
    enterDurationBC: 0.25, // durasi masuk step 3 dan step 4
    overlapMax: 0.08,      // durasi overlap crossfade antar step (< 0.10)
  },
  // Segmen A (posisi 0→1, arc dolly ke kanan): step 1 geser kiri, step 2 masuk dari kanan
  segmentA: {
    exitX: -80,            // step 1 geser ke kiri (px)
    exitBlur: 4,           // step 1 blur ringan saat keluar (px)
    enterX: 80,            // step 2 masuk dari kanan (px)
  },
  // Segmen B (posisi 1→2, crane-up): step 2 geser ke bawah, step 3 masuk dari atas
  segmentB: {
    exitY: 60,             // step 2 geser ke bawah (px)
    enterY: -60,           // step 3 masuk dari atas (px)
  },
  // Segmen C (posisi 2→3, push-in): step 3 membesar mendekati kamera, step 4 dari kedalaman
  segmentC: {
    exitScale: 1.15,       // step 3 membesar mendekati kamera
    exitBlur: 5,           // step 3 blur saat mendekat (px)
    enterScale: 0.90,      // step 4 masuk dari kedalaman
    enterBlur: 6,          // step 4 blur awal saat masuk dari jauh (px)
  },
  // Masking baris heading & animasi paragraf
  reveal: {
    headingStagger: 0.04,  // jeda stagger antar baris heading (satuan timeline)
    headingDuration: 0.20, // durasi reveal baris heading
    headingLineY: 105,     // posisi awal translasi yPercent baris dalam mask (%)
    pY: 16,                // paragraf naik (px)
    pDelay: 0.04,          // jeda masuk paragraf setelah heading
    pDuration: 0.18,       // durasi masuk paragraf
  },
  // Offset parallax tipis teks mengikuti drift kamera virtual
  parallax: {
    driftX: 3.0,           // pengali px terhadap CAMERA.drift.x
    driftY: 2.5,           // pengali px terhadap CAMERA.drift.y
  },
  // Pengurang jarak geser di mobile (lebar <= 640px)
  mobileMultiplier: 0.6,   // kurangi jarak geser ±40%
};
// ----------------------------------------

const TOTAL = STEPS - 1 + HOLD; // video berjalan 0 → STEPS-1, lalu jeda

function metadataReady(video) {
  return new Promise((resolve) => {
    if (video.readyState >= 1) return resolve();
    video.addEventListener('loadedmetadata', resolve, { once: true });
  });
}

export async function initHero(lenis) {
  const hero = document.querySelector('[data-hero]');
  if (!hero) return;

  const video = hero.querySelector('video');
  const stepsContainer = hero.querySelector('.hero__steps');
  const steps = gsap.utils.toArray('[data-step]', hero);
  const bar = hero.querySelector('.hero__progress span');

  await metadataReady(video);
  // Beberapa browser mobile baru mau men-seek video setelah play() pernah dipanggil
  video.play().then(() => video.pause()).catch(() => {});

  const mm = gsap.matchMedia();

  mm.add('(prefers-reduced-motion: no-preference)', () => {
    let activeSplits = [];
    let heroTl = null;

    function cleanup() {
      if (heroTl) {
        if (heroTl.scrollTrigger) heroTl.scrollTrigger.kill();
        heroTl.kill();
        heroTl = null;
      }

      activeSplits.forEach((s) => s.revert());
      activeSplits = [];

      steps.forEach((el) => {
        gsap.set(el, { clearProps: 'transform,opacity,visibility,filter,scale,x,y' });
        const h = el.querySelector('h1, h2');
        if (h) gsap.set(h, { clearProps: 'all' });
        const p = el.querySelector('p');
        if (p) gsap.set(p, { clearProps: 'all' });
      });
      if (stepsContainer) {
        gsap.set(stepsContainer, { clearProps: 'transform,x,y' });
      }
    }

    function build() {
      cleanup();

      const isMobile = window.innerWidth <= 640;
      const distFactor = isMobile ? TEXT_MOTION.mobileMultiplier : 1;
      const span = STEPS - 1;

      // Panjang scroll hero = tinggi viewport tampilan + area putar video
      hero.style.height = `${window.innerHeight * (1 + VH_PER_UNIT * TOTAL)}px`;

      // 1. Initial setups
      gsap.set(steps, { autoAlpha: 0, x: 0, y: 0, scale: 1, filter: 'blur(0px)' });
      gsap.set(steps[0], { autoAlpha: 1 });
      gsap.set(video, { transformOrigin: CAMERA.origin, force3D: true });

      // 2. Split headings with mask
      steps.forEach((step) => {
        const heading = step.querySelector('h1, h2');
        if (heading) {
          const split = new SplitText(heading, {
            type: 'lines',
            linesClass: 'step-line',
            mask: 'lines',
          });
          activeSplits.push(split);
        }
      });

      // Ensure step 1 initial heading lines & paragraph are visible at t=0
      const step1Split = activeSplits[0];
      const step1P = steps[0].querySelector('p');
      if (step1Split && step1Split.lines) {
        gsap.set(step1Split.lines, { yPercent: 0 });
      }
      if (step1P) {
        gsap.set(step1P, { autoAlpha: 1, y: 0 });
      }

      // States awal untuk enter (manual via set agar 100% deterministik):
      const s2EnterX_pre = TEXT_MOTION.segmentA.enterX * distFactor;
      const s3EnterY_pre = TEXT_MOTION.segmentB.enterY * distFactor;
      gsap.set(steps[1], { autoAlpha: 0, x: s2EnterX_pre, filter: 'blur(0px)' });
      gsap.set(steps[2], { autoAlpha: 0, y: s3EnterY_pre, filter: 'blur(0px)' });
      gsap.set(steps[3], {
        autoAlpha: 0,
        scale: TEXT_MOTION.segmentC.enterScale,
        filter: `blur(${TEXT_MOTION.segmentC.enterBlur}px)`,
      });
      activeSplits.forEach((s, i) => {
        if (i === 0) return;
        if (s && s.lines) gsap.set(s.lines, { yPercent: TEXT_MOTION.reveal.headingLineY });
      });
      steps.forEach((step, i) => {
        if (i === 0) return;
        const p = step.querySelector('p');
        if (p) gsap.set(p, { autoAlpha: 0, y: TEXT_MOTION.reveal.pY * distFactor });
      });

      // 3. Main Scrub Timeline
      heroTl = gsap.timeline({
        defaults: { ease: 'none' },
        scrollTrigger: {
          trigger: hero,
          start: 'top top',
          end: () => `+=${window.innerHeight * VH_PER_UNIT * TOTAL}`,
          scrub: 0.6, // sedikit "mengejar" agar halus
          invalidateOnRefresh: true,
          snap: SNAP
            ? {
                snapTo: Array.from({ length: STEPS }, (_, i) => i / TOTAL),
                duration: { min: 0.2, max: 0.8 },
                ease: 'power2.inOut',
              }
            : false,
        },
      });

      // 1) Video playback scrub
      heroTl.to(video, { currentTime: video.duration, duration: span }, 0);

      // 2) Virtual camera (zoom + drift + roll)
      heroTl.fromTo(
        video,
        { scale: CAMERA.zoom[0], xPercent: 0, yPercent: 0, rotation: 0 },
        {
          scale: CAMERA.zoom[1],
          xPercent: CAMERA.drift.x,
          yPercent: CAMERA.drift.y,
          rotation: CAMERA.roll,
          duration: span,
        },
        0
      );

      // 3) Virtual camera parallax drift on text container
      if (stepsContainer) {
        heroTl.fromTo(
          stepsContainer,
          { x: 0, y: 0 },
          {
            x: CAMERA.drift.x * TEXT_MOTION.parallax.driftX,
            y: CAMERA.drift.y * TEXT_MOTION.parallax.driftY,
            duration: span,
          },
          0
        );
      }

      // ----------------------------------------------------
      // SEGMEN A (posisi 0→1, arc dolly ke kanan)
      // Step 1: full [0, 0.38] -> keluar ke kiri + fade + blur [0.38, 0.68]
      // Step 2: masuk dari kanan + fade + mask naik + p rise [0.60, 0.82] -> full [0.82, 1.18]
      // ----------------------------------------------------
      const s1ExitX = TEXT_MOTION.segmentA.exitX * distFactor;
      heroTl.to(
        steps[0],
        {
          autoAlpha: 0,
          x: s1ExitX,
          filter: `blur(${TEXT_MOTION.segmentA.exitBlur}px)`,
          duration: TEXT_MOTION.timing.exitDuration,
        },
        0.38
      );

      const s2EnterX = TEXT_MOTION.segmentA.enterX * distFactor;
      const s2HeadingSplit = activeSplits[1];
      const s2P = steps[1].querySelector('p');

      heroTl.to(
        steps[1],
        {
          autoAlpha: 1,
          x: 0,
          filter: 'blur(0px)',
          duration: TEXT_MOTION.timing.enterDurationA,
        },
        0.60
      );

      if (s2HeadingSplit && s2HeadingSplit.lines) {
        heroTl.to(
          s2HeadingSplit.lines,
          {
            yPercent: 0,
            duration: TEXT_MOTION.reveal.headingDuration,
            stagger: TEXT_MOTION.reveal.headingStagger,
          },
          0.60
        );
      }
      if (s2P) {
        heroTl.to(
          s2P,
          {
            autoAlpha: 1,
            y: 0,
            duration: TEXT_MOTION.reveal.pDuration,
          },
          0.60 + TEXT_MOTION.reveal.pDelay
        );
      }

      // ----------------------------------------------------
      // SEGMEN B (posisi 1→2, crane-up)
      // Step 2: full sampai 1.18 -> keluar ke bawah + fade [1.18, 1.48]
      // Step 3: masuk dari atas + fade + mask naik + p rise [1.40, 1.65] -> full [1.65, 2.18]
      // ----------------------------------------------------
      const s2ExitY = TEXT_MOTION.segmentB.exitY * distFactor;
      heroTl.to(
        steps[1],
        {
          autoAlpha: 0,
          y: s2ExitY,
          duration: TEXT_MOTION.timing.exitDuration,
        },
        1.18
      );

      const s3EnterY = TEXT_MOTION.segmentB.enterY * distFactor;
      const s3HeadingSplit = activeSplits[2];
      const s3P = steps[2].querySelector('p');

      heroTl.to(
        steps[2],
        {
          autoAlpha: 1,
          y: 0,
          filter: 'blur(0px)',
          duration: TEXT_MOTION.timing.enterDurationBC,
        },
        1.40
      );

      if (s3HeadingSplit && s3HeadingSplit.lines) {
        heroTl.to(
          s3HeadingSplit.lines,
          {
            yPercent: 0,
            duration: TEXT_MOTION.reveal.headingDuration,
            stagger: TEXT_MOTION.reveal.headingStagger,
          },
          1.40
        );
      }
      if (s3P) {
        heroTl.to(
          s3P,
          {
            autoAlpha: 1,
            y: 0,
            duration: TEXT_MOTION.reveal.pDuration,
          },
          1.40 + TEXT_MOTION.reveal.pDelay
        );
      }

      // ----------------------------------------------------
      // SEGMEN C (posisi 2→3, push-in)
      // Step 3: full sampai 2.18 -> keluar membesar mendekati kamera + blur + fade [2.18, 2.48]
      // Step 4: masuk dari kedalaman (scale 0.90, blur 6px) + fade + mask naik + p rise [2.40, 2.65] -> full [2.65, 3.50]
      // ----------------------------------------------------
      heroTl.to(
        steps[2],
        {
          autoAlpha: 0,
          scale: TEXT_MOTION.segmentC.exitScale,
          filter: `blur(${TEXT_MOTION.segmentC.exitBlur}px)`,
          duration: TEXT_MOTION.timing.exitDuration,
        },
        2.18
      );

      const s4HeadingSplit = activeSplits[3];
      const s4P = steps[3].querySelector('p');

      heroTl.to(
        steps[3],
        {
          autoAlpha: 1,
          scale: 1.0,
          filter: 'blur(0px)',
          duration: TEXT_MOTION.timing.enterDurationBC,
        },
        2.40
      );

      if (s4HeadingSplit && s4HeadingSplit.lines) {
        heroTl.to(
          s4HeadingSplit.lines,
          {
            yPercent: 0,
            duration: TEXT_MOTION.reveal.headingDuration,
            stagger: TEXT_MOTION.reveal.headingStagger,
          },
          2.40
        );
      }
      if (s4P) {
        heroTl.to(
          s4P,
          {
            autoAlpha: 1,
            y: 0,
            duration: TEXT_MOTION.reveal.pDuration,
          },
          2.40 + TEXT_MOTION.reveal.pDelay
        );
      }

      // Progress bar
      if (bar) {
        heroTl.fromTo(bar, { scaleX: 0 }, { scaleX: 1, duration: TOTAL }, 0);
      }

      // Meta pills (Famili, Asal, dst.) muncul scroll-driven di sisi kanan
      const hudPills = hero.querySelectorAll('.hud-pill');
      if (hudPills.length) {
        gsap.set(hudPills, { autoAlpha: 0, x: 40 });
        heroTl.to(
          hudPills,
          { autoAlpha: 1, x: 0, duration: 0.3, stagger: 0.08, ease: 'power1.out' },
          0.3
        );
      }

      // Stage indicators (Scrubber dots) sync & click
      const stageBtns = gsap.utils.toArray('[data-stage-btn]', hero);
      if (stageBtns.length) {
        heroTl.eventCallback('onUpdate', () => {
          const t = heroTl.time();
          let activeIdx = 0;
          if (t >= 2.4) activeIdx = 3;
          else if (t >= 1.4) activeIdx = 2;
          else if (t >= 0.6) activeIdx = 1;
          else activeIdx = 0;

          stageBtns.forEach((btn, idx) => {
            btn.classList.toggle('is-active', idx === activeIdx);
          });
        });

        stageBtns.forEach((btn) => {
          btn.addEventListener('click', () => {
            const stepIdx = parseInt(btn.dataset.stageBtn, 10);
            if (heroTl && heroTl.scrollTrigger) {
              const st = heroTl.scrollTrigger;
              const targetTime = stepIdx; // 0, 1, 2, 3
              const targetScroll = st.start + (targetTime / TOTAL) * (st.end - st.start);
              if (lenis) {
                lenis.scrollTo(targetScroll, {
                  duration: SPACE_NAV.heroPhaseDuration,
                  ...(SPACE_NAV.easing ? { easing: SPACE_NAV.easing } : {}),
                });
              } else {
                window.scrollTo({ top: targetScroll, behavior: 'smooth' });
              }
            }
          });
        });
      }
    }

    // Build timeline
    build();

    // Listen to resize and orientation changes
    let lastWidth = window.innerWidth;
    let resizeTimer = null;
    const handleResize = () => {
      if (window.innerWidth !== lastWidth) {
        lastWidth = window.innerWidth;
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
          build();
          ScrollTrigger.refresh();
        }, 150);
      }
    };
    window.addEventListener('resize', handleResize);
    window.addEventListener('orientationchange', handleResize);

    // Refresh splits & triggers if web fonts finish loading later
    if (document.fonts) {
      document.fonts.ready.then(() => {
        build();
        ScrollTrigger.refresh();
      });
    }

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', handleResize);
      clearTimeout(resizeTimer);
      cleanup();
    };
  });

  mm.add('(prefers-reduced-motion: reduce)', () => {
    // Reset/revert all elements and styles
    steps.forEach((el) => {
      gsap.set(el, { clearProps: 'transform,opacity,visibility,filter,scale,x,y' });
      const h = el.querySelector('h1, h2');
      if (h) gsap.set(h, { clearProps: 'all' });
      const p = el.querySelector('p');
      if (p) gsap.set(p, { clearProps: 'all' });
    });
    if (stepsContainer) {
      gsap.set(stepsContainer, { clearProps: 'transform,x,y' });
    }

    video.currentTime = 0.01;
    gsap.set(steps, { autoAlpha: 0, x: 0, y: 0, scale: 1, filter: 'none' });
    gsap.set(steps[0], { autoAlpha: 1 });

    // Cukup ganti teks dengan fade pendek, tanpa pin
    const fadeTl = gsap.timeline({ repeat: -1 });
    steps.forEach((step, i) => {
      const next = steps[(i + 1) % steps.length];
      fadeTl
        .to({}, { duration: 3.5 })
        .to(step, { autoAlpha: 0, duration: 0.5, ease: 'power1.inOut' })
        .to(next, { autoAlpha: 1, duration: 0.5, ease: 'power1.inOut' }, '<');
    });

    return () => {
      fadeTl.kill();
      gsap.set(steps, { clearProps: 'all' });
    };
  });
}