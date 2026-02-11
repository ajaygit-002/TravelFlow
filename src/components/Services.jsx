import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import '../styles/services.css';

gsap.registerPlugin(ScrollTrigger);

const coreServices = [
  {
    icon: '✈️',
    title: 'Flight Booking',
    text: 'Book flights to 500+ destinations worldwide with real-time pricing, flexible dates, and seamless one-tap checkout.',
    features: ['Real-time fare tracking', 'Flexible date search', 'Multi-city routes', 'Price drop alerts'],
    stat: '500+',
    statLabel: 'Destinations',
    gradient: 'linear-gradient(135deg, #2F80ED, #56CCF2)',
    accent: '#2F80ED',
  },
  {
    icon: '🌍',
    title: 'Global Destinations',
    text: 'Explore handpicked destinations across every continent — from buzzing metropolises to hidden paradise islands.',
    features: ['AI-curated picks', 'Local insider tips', 'Seasonal guides', 'Virtual previews'],
    stat: '120+',
    statLabel: 'Countries',
    gradient: 'linear-gradient(135deg, #F2994A, #F2C94C)',
    accent: '#F2994A',
  },
  {
    icon: '🛡️',
    title: '24/7 Support',
    text: 'Our multilingual travel experts are available around the clock for bookings, changes, emergencies, and concierge services.',
    features: ['Live chat support', 'Emergency hotline', 'Refund assistance', 'Travel insurance'],
    stat: '99.8%',
    statLabel: 'Satisfaction',
    gradient: 'linear-gradient(135deg, #27AE60, #6FCF97)',
    accent: '#27AE60',
  },
];

const processSteps = [
  { icon: '🔍', title: 'Search', desc: '' },
  { icon: '📋', title: 'Compare', desc: '' },
  { icon: '💳', title: 'Book', desc: '' },
  { icon: '🎉', title: 'Travel', desc: '' },
];

const stats = [
  { value: '2M+', label: 'Happy Travelers', icon: '👥' },
  { value: '500+', label: 'Destinations', icon: '📍' },
  { value: '99.8%', label: 'Satisfaction Rate', icon: '⭐' },
  { value: '24/7', label: 'Support Available', icon: '🎧' },
];


const testimonials = [
  {
    name: 'Sarah K.',
    role: 'Adventure Traveler',
    text: 'TravelFlow made planning my 3-week Asia trip effortless. The AI recommendations were spot-on!',
    avatar: '👩‍💼',
    rating: 5,
  },
  {
    name: 'Marcus J.',
    role: 'Business Traveler',
    text: 'I fly 40+ times a year — this platform saves me hours on every booking. Unmatched flexibility.',
    avatar: '👨‍💻',
    rating: 5,
  },
  {
    name: 'Elena R.',
    role: 'Family Traveler',
    text: 'Finding family-friendly destinations with budget options? TravelFlow does it perfectly every time.',
    avatar: '👩‍🦰',
    rating: 5,
  },
];

export default function Services() {
  const sectionRef = useRef(null);

  useEffect(() => {
    if (!sectionRef.current) return;
    const ctx = gsap.context(() => {

      // ===== HERO BANNER ENTRANCE =====
      const heroTL = gsap.timeline({
        scrollTrigger: {
          trigger: '.svc-hero',
          start: 'top 85%',
          toggleActions: 'play none none reverse',
        },
        defaults: { ease: 'power4.out' },
      });

      heroTL
        .fromTo('.svc-hero-badge', { opacity: 0, y: 20, scale: 0.8 }, { opacity: 1, y: 0, scale: 1, duration: 0.5 })
        .fromTo('.svc-hero-title', { opacity: 0, y: 50, clipPath: 'inset(0 0 100% 0)' }, { opacity: 1, y: 0, clipPath: 'inset(0 0 0% 0)', duration: 0.8 }, '-=0.2')
        .fromTo('.svc-hero-sub', { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.6 }, '-=0.4');

      // ===== CORE SERVICE CARDS — 3D TILT ENTRANCE =====
      gsap.utils.toArray('.svc-core-card').forEach((card, i) => {
        const isEven = i % 2 === 0;
        gsap.fromTo(card,
          {
            opacity: 0,
            x: isEven ? -80 : 80,
            rotateY: isEven ? -12 : 12,
            scale: 0.88,
            transformPerspective: 1200,
          },
          {
            opacity: 1,
            x: 0,
            rotateY: 0,
            scale: 1,
            duration: 0.9,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: card,
              start: 'top 85%',
              toggleActions: 'play none none reverse',
            },
          }
        );

        // Stagger feature pills
        const pills = card.querySelectorAll('.svc-feature-pill');
        gsap.fromTo(pills,
          { opacity: 0, y: 15, scale: 0.85 },
          {
            opacity: 1, y: 0, scale: 1,
            duration: 0.4, stagger: 0.08, ease: 'back.out(1.5)',
            scrollTrigger: {
              trigger: card,
              start: 'top 75%',
              toggleActions: 'play none none reverse',
            },
          }
        );

        // Stat counter pop
        const statEl = card.querySelector('.svc-card-stat-value');
        if (statEl) {
          gsap.fromTo(statEl,
            { opacity: 0, scale: 0.3, rotation: -10 },
            {
              opacity: 1, scale: 1, rotation: 0,
              duration: 0.6, ease: 'back.out(2.5)',
              scrollTrigger: { trigger: card, start: 'top 70%', toggleActions: 'play none none reverse' },
            }
          );
        }

        // Hover 3D tilt
        let raf = null;
        card.addEventListener('mousemove', (e) => {
          if (raf) return;
          raf = requestAnimationFrame(() => {
            const rect = card.getBoundingClientRect();
            const x = (e.clientX - rect.left) / rect.width - 0.5;
            const y = (e.clientY - rect.top) / rect.height - 0.5;
            gsap.to(card, {
              rotateY: x * 10,
              rotateX: -y * 8,
              scale: 1.02,
              duration: 0.5,
              ease: 'power3.out',
              transformPerspective: 1200,
            });
            raf = null;
          });
        });

        card.addEventListener('mouseleave', () => {
          if (raf) { cancelAnimationFrame(raf); raf = null; }
          gsap.to(card, {
            rotateY: 0, rotateX: 0, scale: 1,
            duration: 0.6, ease: 'power3.out',
          });
        });
      });

      // ===== PROCESS STEPS — SEQUENTIAL REVEAL WITH CONNECTING LINE =====
      const stepTL = gsap.timeline({
        scrollTrigger: {
          trigger: '.svc-process',
          start: 'top 80%',
          toggleActions: 'play none none reverse',
        },
        defaults: { ease: 'power3.out' },
      });

      stepTL
        .fromTo('.svc-process-title', { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.6 })
        .fromTo('.svc-process-line-fill', { scaleX: 0 }, { scaleX: 1, duration: 1.2, ease: 'power2.inOut' }, '-=0.3');

      gsap.utils.toArray('.svc-step').forEach((step, i) => {
        stepTL.fromTo(step,
          { opacity: 0, y: 40, scale: 0.7 },
          { opacity: 1, y: 0, scale: 1, duration: 0.5, ease: 'back.out(2)' },
          0.3 + i * 0.2
        );
      });

      // ===== STATS — COUNTING ANIMATION =====
      gsap.utils.toArray('.svc-stat-item').forEach((item, i) => {
        gsap.fromTo(item,
          { opacity: 0, y: 50, rotateX: 15, transformPerspective: 800 },
          {
            opacity: 1, y: 0, rotateX: 0,
            duration: 0.7, delay: i * 0.1, ease: 'power3.out',
            scrollTrigger: {
              trigger: '.svc-stats',
              start: 'top 80%',
              toggleActions: 'play none none reverse',
            },
          }
        );
      });

      // Parallax float for stat icons
      gsap.utils.toArray('.svc-stat-icon').forEach((icon, i) => {
        gsap.to(icon, {
          y: -8 + Math.random() * 16,
          rotation: -3 + Math.random() * 6,
          duration: 2.5 + Math.random() * 1.5,
          repeat: -1,
          yoyo: true,
          ease: 'sine.inOut',
          delay: i * 0.4,
        });
      });

      // ===== TESTIMONIALS — SLIDE IN FROM SIDES =====
      gsap.utils.toArray('.svc-testimonial').forEach((card, i) => {
        const direction = i === 0 ? -60 : i === 2 ? 60 : 0;
        const rotDir = i === 0 ? -5 : i === 2 ? 5 : 0;
        gsap.fromTo(card,
          { opacity: 0, x: direction, y: direction === 0 ? 40 : 0, rotateZ: rotDir, scale: 0.9 },
          {
            opacity: 1, x: 0, y: 0, rotateZ: 0, scale: 1,
            duration: 0.8, ease: 'power3.out',
            scrollTrigger: {
              trigger: '.svc-testimonials',
              start: 'top 80%',
              toggleActions: 'play none none reverse',
            },
            delay: i * 0.15,
          }
        );
      });

      // ===== CTA BANNER — SCALE UP =====
      gsap.fromTo('.svc-cta',
        { opacity: 0, scale: 0.9, y: 40 },
        {
          opacity: 1, scale: 1, y: 0,
          duration: 0.8, ease: 'power3.out',
          scrollTrigger: {
            trigger: '.svc-cta',
            start: 'top 85%',
            toggleActions: 'play none none reverse',
          },
        }
      );

      // Floating CTA orbs
      gsap.utils.toArray('.svc-cta-orb').forEach((orb, i) => {
        gsap.to(orb, {
          y: -20 + Math.random() * 40,
          x: -15 + Math.random() * 30,
          duration: 4 + Math.random() * 3,
          repeat: -1,
          yoyo: true,
          ease: 'sine.inOut',
          delay: i * 0.8,
        });
      });

    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <div className="svc-page" ref={sectionRef}>

      {/* ======= HERO BANNER ======= */}
      <section className="svc-hero" id="services">
        <div className="svc-hero-bg">
          <div className="svc-hero-orb svc-hero-orb-1" />
          <div className="svc-hero-orb svc-hero-orb-2" />
          <div className="svc-hero-orb svc-hero-orb-3" />
        </div>
        <div className="container">
          <span className="svc-hero-badge">✦ What We Offer</span>
          <h1 className="svc-hero-title">
            Crafting Journeys,<br />
            <span className="svc-hero-highlight">Not Just Bookings</span>
          </h1>
          <p className="svc-hero-sub">
            From your first search to your final destination, we handle every detail with precision, technology, and a personal touch that makes travel effortless.
          </p>
        </div>
      </section>

      {/* ======= CORE SERVICES ======= */}
      <section className="section svc-core">
        <div className="container">
          <h2 className="section-title">Core Services</h2>
          <p className="section-subtitle">
            Three pillars that power every TravelFlow journey.
          </p>
          <div className="svc-core-grid">
            {coreServices.map((svc, i) => (
              <div className="svc-core-card" key={i} style={{ '--card-accent': svc.accent }}>
                <div className="svc-core-card-glow" style={{ background: svc.gradient }} />
                <div className="svc-card-header">
                  <div className="svc-card-icon-wrap" style={{ background: svc.gradient }}>
                    <span className="svc-card-icon">{svc.icon}</span>
                  </div>
                  <div className="svc-card-stat">
                    <div className="svc-card-stat-value">{svc.stat}</div>
                    <div className="svc-card-stat-label">{svc.statLabel}</div>
                  </div>
                </div>
                <h3 className="svc-card-title">{svc.title}</h3>
                <p className="svc-card-text">{svc.text}</p>
                <div className="svc-feature-list">
                  {svc.features.map((f, j) => (
                    <span className="svc-feature-pill" key={j}>
                      <span className="svc-pill-dot" style={{ background: svc.accent }} />
                      {f}
                    </span>
                  ))}
                </div>
                <div className="svc-card-number">0{i + 1}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ======= HOW IT WORKS — PROCESS ======= */}
      <section className="section svc-process">
        <div className="container">
          <div className="svc-process-header">
            <span className="svc-process-tag">🚀 How It Works</span>
            <h2 className="section-title svc-process-title">How It Works</h2>
            <p className="section-subtitle svc-process-subtitle">
              Four simple steps from dreaming to departing.
            </p>
          </div>
          <div className="svc-process-track">
            <div className="svc-process-line">
              <div className="svc-process-line-fill" />
            </div>
            {processSteps.map((step, i) => (
              <div className="svc-step" key={i}>
                <div className="svc-step-number">{String(i + 1).padStart(3, '0')}</div>
                <div className="svc-step-icon">{step.icon}</div>
                <h4 className="svc-step-title">{step.title}</h4>
                <p className="svc-step-desc">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ======= STATS BAR ======= */}
      <section className="svc-stats">
        <div className="container">
          <div className="svc-stats-grid">
            {stats.map((s, i) => (
              <div className="svc-stat-item" key={i}>
                <div className="svc-stat-icon">{s.icon}</div>
                <div className="svc-stat-value">{s.value}</div>
                <div className="svc-stat-label">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ======= TESTIMONIALS ======= */}
      <section className="section svc-testimonials">
        <div className="container">
          <h2 className="section-title">What Travelers Say</h2>
          <p className="section-subtitle">
            Real stories from real travelers around the world.
          </p>
          <div className="svc-testimonials-grid">
            {testimonials.map((t, i) => (
              <div className="svc-testimonial" key={i}>
                <div className="svc-testimonial-quote">"</div>
                <p className="svc-testimonial-text">{t.text}</p>
                <div className="svc-testimonial-stars">
                  {'★'.repeat(t.rating)}
                </div>
                <div className="svc-testimonial-author">
                  <span className="svc-testimonial-avatar">{t.avatar}</span>
                  <div>
                    <div className="svc-testimonial-name">{t.name}</div>
                    <div className="svc-testimonial-role">{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ======= CTA BANNER ======= */}
      <section className="svc-cta">
        <div className="svc-cta-orb svc-cta-orb-1" />
        <div className="svc-cta-orb svc-cta-orb-2" />
        <div className="svc-cta-orb svc-cta-orb-3" />
        <div className="container" style={{ position: 'relative', zIndex: 2 }}>
          <h2 className="svc-cta-title">Ready to Start Your Journey?</h2>
          <p className="svc-cta-text">
            Join 2 million+ travelers who trust TravelFlow for unforgettable experiences.
          </p>
          <div className="svc-cta-buttons">
            <a href="/destinations" className="btn btn-primary btn-lg">
              Explore Destinations →
            </a>
            <a href="/contact" className="btn btn-outline btn-lg">
              Contact Us
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}

