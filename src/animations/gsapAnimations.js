import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/* ===== HERO ANIMATIONS ===== */
export function animateHero() {
  const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

  tl.fromTo('.hero-bg', { scale: 1.2, opacity: 0 }, { scale: 1, opacity: 1, duration: 1.5 })
    .fromTo('.hero-badge', { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.6 }, '-=0.6')
    .fromTo('.hero-title', { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 0.8 }, '-=0.3')
    .fromTo('.hero-subtitle', { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.7 }, '-=0.4')
    .fromTo('.hero-buttons .btn', { opacity: 0, y: 20, scale: 0.9 }, { opacity: 1, y: 0, scale: 1, duration: 0.5, stagger: 0.15 }, '-=0.3')
    .fromTo('.hero-stat', { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.5, stagger: 0.1 }, '-=0.2');

  return tl;
}

/* ===== FLOATING ELEMENTS ANIMATION ===== */
export function animateFloatingElements() {
  // Airplanes
  gsap.utils.toArray('.float-airplane').forEach((el, i) => {
    gsap.fromTo(el,
      { opacity: 0, scale: 0 },
      { opacity: 1, scale: 1, duration: 0.8, delay: 1.2 + i * 0.2, ease: 'back.out(2)' }
    );
    gsap.to(el, {
      y: -15 + Math.random() * 30,
      x: 10 + Math.random() * 20,
      rotation: -5 + Math.random() * 10,
      duration: 3 + Math.random() * 2,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut',
      delay: i * 0.5,
    });
  });

  // Pins
  gsap.utils.toArray('.float-pin').forEach((el, i) => {
    gsap.fromTo(el,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.6, delay: 1.5 + i * 0.2, ease: 'back.out(2)' }
    );
    gsap.to(el, {
      y: -8 + Math.random() * 16,
      duration: 2 + Math.random() * 1.5,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut',
      delay: i * 0.3,
    });
  });
}

/* ===== PARALLAX MOUSE MOVEMENT ===== */
export function initParallax() {
  const hero = document.querySelector('.hero');
  if (!hero) return;

  const handleMouseMove = (e) => {
    const rect = hero.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;

    gsap.to('.hero-bg', {
      rotateY: x * 5,
      rotateX: -y * 5,
      transformPerspective: 1000,
      duration: 0.8,
      ease: 'power2.out',
    });

    gsap.to('.float-airplane', {
      x: x * 30,
      y: y * 20,
      duration: 1,
      ease: 'power2.out',
    });

    gsap.to('.float-pin', {
      x: x * 15,
      y: y * 10,
      duration: 1.2,
      ease: 'power2.out',
    });

    // Glow orbs parallax
    gsap.to('.glow-orb-1', { x: x * 40, y: y * 30, duration: 1.5, ease: 'power2.out' });
    gsap.to('.glow-orb-2', { x: -x * 30, y: -y * 20, duration: 1.5, ease: 'power2.out' });
    gsap.to('.glow-orb-3', { x: x * 20, y: y * 25, duration: 1.5, ease: 'power2.out' });
  };

  hero.addEventListener('mousemove', handleMouseMove);
  return () => hero.removeEventListener('mousemove', handleMouseMove);
}

/* ===== NAVBAR SCROLL ANIMATION ===== */
export function animateNavbar() {
  const navbar = document.querySelector('.navbar');
  if (!navbar) return;

  const handleScroll = () => {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', handleScroll);
  handleScroll(); // Check initial state
  return () => window.removeEventListener('scroll', handleScroll);
}

/* ===== SECTION REVEAL ON SCROLL ===== */
export function animateSections() {
  gsap.utils.toArray('.section').forEach((section) => {
    gsap.fromTo(section,
      { opacity: 0, y: 60 },
      {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: section,
          start: 'top 85%',
          end: 'top 50%',
          toggleActions: 'play none none reverse',
        },
      }
    );
  });
}

/* ===== WHY CHOOSE — FEATURES TIMELINE ===== */
export function animateCards() {
  // Features section header
  const ftSection = document.querySelector('.ft-section');
  if (ftSection) {
    const ftTag = ftSection.querySelector('.ft-tag');
    const ftTitle = ftSection.querySelector('.ft-title');
    const ftSub = ftSection.querySelector('.ft-subtitle');

    if (ftTag) {
      gsap.fromTo(ftTag,
        { opacity: 0, y: 20, scale: 0.85 },
        {
          opacity: 1, y: 0, scale: 1, duration: 0.5, ease: 'back.out(1.7)',
          scrollTrigger: { trigger: ftSection, start: 'top 82%', toggleActions: 'play none none reverse' },
        }
      );
    }
    if (ftTitle) {
      gsap.fromTo(ftTitle,
        { opacity: 0, y: 40, clipPath: 'inset(0 0 100% 0)' },
        {
          opacity: 1, y: 0, clipPath: 'inset(0 0 0% 0)', duration: 0.8, delay: 0.1, ease: 'power4.out',
          scrollTrigger: { trigger: ftSection, start: 'top 82%', toggleActions: 'play none none reverse' },
        }
      );
    }
    if (ftSub) {
      gsap.fromTo(ftSub,
        { opacity: 0, y: 20 },
        {
          opacity: 1, y: 0, duration: 0.6, delay: 0.2, ease: 'power3.out',
          scrollTrigger: { trigger: ftSection, start: 'top 82%', toggleActions: 'play none none reverse' },
        }
      );
    }
  }

  // Connecting line — grow from left to right
  const ftLine = document.querySelector('.ft-connect-line');
  if (ftLine) {
    gsap.fromTo(ftLine,
      { scaleX: 0, transformOrigin: 'left center' },
      {
        scaleX: 1, duration: 1.2, ease: 'power3.out',
        scrollTrigger: {
          trigger: '.ft-steps-container',
          start: 'top 85%',
          toggleActions: 'play none none reverse',
        },
      }
    );
  }

  // Feature steps — staggered entrance
  const ftSteps = document.querySelectorAll('.ft-step');
  ftSteps.forEach((step, i) => {
    // Circle pop-in
    const circle = step.querySelector('.ft-step-circle');
    if (circle) {
      gsap.fromTo(circle,
        { opacity: 0, scale: 0, rotation: -30 },
        {
          opacity: 1, scale: 1, rotation: 0,
          duration: 0.55, delay: 0.3 + i * 0.2,
          ease: 'back.out(2.5)',
          scrollTrigger: {
            trigger: '.ft-steps-container',
            start: 'top 85%',
            toggleActions: 'play none none reverse',
          },
        }
      );
    }

    // Card slide-up
    const body = step.querySelector('.ft-step-body');
    if (body) {
      gsap.fromTo(body,
        { opacity: 0, y: 50, scale: 0.92 },
        {
          opacity: 1, y: 0, scale: 1,
          duration: 0.65, delay: 0.45 + i * 0.2,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: '.ft-steps-container',
            start: 'top 85%',
            toggleActions: 'play none none reverse',
          },
        }
      );
    }
  });

  // Legacy cards-grid support
  gsap.utils.toArray('.cards-grid').forEach((grid) => {
    const cards = grid.querySelectorAll('.card');
    gsap.fromTo(cards,
      { opacity: 0, y: 50, scale: 0.95 },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.6,
        stagger: 0.15,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: grid,
          start: 'top 80%',
          toggleActions: 'play none none reverse',
        },
      }
    );
  });

  // Featured Destinations — section header
  const destSection = document.querySelector('.featured-dest-section');
  if (destSection) {
    const destTag = destSection.querySelector('.featured-dest-tag');
    const destTitle = destSection.querySelector('.section-title');
    const destSub = destSection.querySelector('.section-subtitle');

    if (destTag) {
      gsap.fromTo(destTag,
        { opacity: 0, y: 20, scale: 0.85 },
        {
          opacity: 1, y: 0, scale: 1, duration: 0.5, ease: 'back.out(1.7)',
          scrollTrigger: { trigger: destSection, start: 'top 82%', toggleActions: 'play none none reverse' },
        }
      );
    }
    if (destTitle) {
      gsap.fromTo(destTitle,
        { opacity: 0, y: 40, clipPath: 'inset(0 0 100% 0)' },
        {
          opacity: 1, y: 0, clipPath: 'inset(0 0 0% 0)', duration: 0.8, delay: 0.1, ease: 'power4.out',
          scrollTrigger: { trigger: destSection, start: 'top 82%', toggleActions: 'play none none reverse' },
        }
      );
    }
    if (destSub) {
      gsap.fromTo(destSub,
        { opacity: 0, y: 20 },
        {
          opacity: 1, y: 0, duration: 0.6, delay: 0.2, ease: 'power3.out',
          scrollTrigger: { trigger: destSection, start: 'top 82%', toggleActions: 'play none none reverse' },
        }
      );
    }
  }

  // Destination cards — staggered reveal with scale + subtle rotation
  gsap.utils.toArray('.dest-grid').forEach((grid) => {
    const cards = grid.querySelectorAll('.dest-card');
    cards.forEach((card, i) => {
      const fromLeft = i % 2 === 0;
      gsap.fromTo(card,
        {
          opacity: 0,
          y: 60,
          x: fromLeft ? -30 : 30,
          scale: 0.88,
          rotateY: fromLeft ? -6 : 6,
          transformPerspective: 1000,
        },
        {
          opacity: 1,
          y: 0,
          x: 0,
          scale: 1,
          rotateY: 0,
          duration: 0.7,
          delay: i * 0.15,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: grid,
            start: 'top 85%',
            toggleActions: 'play none none reverse',
          },
        }
      );

      // Badge row (duration + rating) slide-in from left
      const badgeRow = card.querySelector('.dest-card-badge-row');
      if (badgeRow) {
        gsap.fromTo(badgeRow,
          { opacity: 0, x: -20 },
          {
            opacity: 1, x: 0,
            duration: 0.4, delay: 0.25 + i * 0.15,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: grid,
              start: 'top 85%',
              toggleActions: 'play none none reverse',
            },
          }
        );
      }

      // Price badge pop-in after card reveals
      const price = card.querySelector('.dest-card-price');
      if (price) {
        gsap.fromTo(price,
          { opacity: 0, scale: 0, y: -10 },
          {
            opacity: 1, scale: 1, y: 0,
            duration: 0.4, delay: 0.25 + i * 0.15,
            ease: 'back.out(2.5)',
            scrollTrigger: {
              trigger: grid,
              start: 'top 85%',
              toggleActions: 'play none none reverse',
            },
          }
        );
      }

      // Overlay text slide-up
      const overlay = card.querySelector('.dest-card-overlay');
      if (overlay) {
        gsap.fromTo(overlay,
          { opacity: 0, y: 30 },
          {
            opacity: 1, y: 0,
            duration: 0.5, delay: 0.35 + i * 0.15,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: grid,
              start: 'top 85%',
              toggleActions: 'play none none reverse',
            },
          }
        );
      }
    });
  });

  // View All Destinations button
  const destCta = document.querySelector('.featured-dest-cta');
  if (destCta) {
    gsap.fromTo(destCta,
      { opacity: 0, y: 25 },
      {
        opacity: 1, y: 0, duration: 0.5, ease: 'power3.out',
        scrollTrigger: { trigger: destCta, start: 'top 92%', toggleActions: 'play none none reverse' },
      }
    );
  }
}

/* ===== SECTION TITLES ===== */
export function animateTitles() {
  gsap.utils.toArray('.section-title').forEach((title) => {
    gsap.fromTo(title,
      { opacity: 0, y: 30 },
      {
        opacity: 1,
        y: 0,
        duration: 0.7,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: title,
          start: 'top 85%',
          toggleActions: 'play none none reverse',
        },
      }
    );
  });

  gsap.utils.toArray('.section-subtitle').forEach((sub) => {
    gsap.fromTo(sub,
      { opacity: 0, y: 20 },
      {
        opacity: 1,
        y: 0,
        duration: 0.6,
        delay: 0.15,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: sub,
          start: 'top 85%',
          toggleActions: 'play none none reverse',
        },
      }
    );
  });
}

/* ===== CONTACT FORM ===== */
export function animateContactForm() {
  const form = document.querySelector('.contact-form-wrapper');
  if (!form) return;

  gsap.fromTo(form,
    { opacity: 0, y: 40, scale: 0.98 },
    {
      opacity: 1,
      y: 0,
      scale: 1,
      duration: 0.8,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: form,
        start: 'top 80%',
        toggleActions: 'play none none reverse',
      },
    }
  );
}

/* ===== ABOUT SECTION ===== */
export function animateAbout() {
  const aboutStory = document.querySelector('.about-story');
  if (!aboutStory) return;

  gsap.fromTo('.about-story-img-wrap',
    { opacity: 0, x: -60 },
    {
      opacity: 1,
      x: 0,
      duration: 0.8,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: aboutStory,
        start: 'top 80%',
        toggleActions: 'play none none reverse',
      },
    }
  );

  gsap.fromTo('.about-story-text > *',
    { opacity: 0, x: 60 },
    {
      opacity: 1,
      x: 0,
      duration: 0.8,
      stagger: 0.1,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: aboutStory,
        start: 'top 80%',
        toggleActions: 'play none none reverse',
      },
    }
  );
}

/* ===== FOOTER ===== */
export function animateFooter() {
  const footer = document.querySelector('.footer');
  if (!footer) return;

  gsap.fromTo('.footer-grid > *',
    { opacity: 0, y: 30 },
    {
      opacity: 1,
      y: 0,
      duration: 0.6,
      stagger: 0.1,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: footer,
        start: 'top 90%',
        toggleActions: 'play none none reverse',
      },
    }
  );
}

/* ===== MASTER INIT ===== */
export function initAllAnimations() {
  animateHero();
  animateFloatingElements();
  const cleanupParallax = initParallax();
  const cleanupNavbar = animateNavbar();
  animateSections();
  animateCards();
  animateTitles();
  animateContactForm();
  animateAbout();
  animateFooter();

  return () => {
    if (cleanupParallax) cleanupParallax();
    if (cleanupNavbar) cleanupNavbar();
    ScrollTrigger.getAll().forEach(t => t.kill());
  };
}
