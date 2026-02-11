import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Footer from '../components/Footer';
import { animateNavbar } from '../animations/gsapAnimations';
import '../styles/about.css';

gsap.registerPlugin(ScrollTrigger);

const teamMembers = [
  { name: 'Sarah Mitchell', role: 'CEO & Founder', avatar: '👩‍💼', image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&q=80' },
  { name: 'James Chen', role: 'CTO', avatar: '👨‍💻', image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80' },
  { name: 'Elena Rodriguez', role: 'Head of Design', avatar: '👩‍🎨', image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&q=80' },
  { name: 'David Okafor', role: 'Head of Operations', avatar: '👨‍✈️', image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&q=80' },
];

const milestones = [
  { year: '2020', title: 'Founded', desc: 'TravelFlow launched with a vision to simplify world travel.', icon: '🚀' },
  { year: '2021', title: '100K Users', desc: 'Reached our first 100,000 happy travelers worldwide.', icon: '🎯' },
  { year: '2022', title: 'Global Expansion', desc: 'Expanded to cover 120+ countries and 500+ routes.', icon: '🌍' },
  { year: '2023', title: 'AI Integration', desc: 'Launched AI-powered trip planning & recommendations.', icon: '🤖' },
  { year: '2024', title: '1M Downloads', desc: 'Our mobile app crossed 1 million downloads.', icon: '📱' },
  { year: '2025', title: '2M+ Travelers', desc: 'Serving over 2 million travelers with 99.8% satisfaction.', icon: '⭐' },
];

export default function About() {
  const pageRef = useRef(null);

  useEffect(() => {
    const cleanupNav = animateNavbar();

    const ctx = gsap.context(() => {
      // Hero
      const heroTL = gsap.timeline({ defaults: { ease: 'power4.out' } });
      heroTL
        .fromTo('.about-hero-badge', { opacity: 0, y: 20, scale: 0.85 }, { opacity: 1, y: 0, scale: 1, duration: 0.5 })
        .fromTo('.about-hero-title', { opacity: 0, y: 50, clipPath: 'inset(0 0 100% 0)' }, { opacity: 1, y: 0, clipPath: 'inset(0 0 0% 0)', duration: 0.8 }, '-=0.2')
        .fromTo('.about-hero-sub', { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.5 }, '-=0.4');

      // Story section — image slide
      gsap.fromTo('.about-story-img-wrap',
        { opacity: 0, x: -80, rotateY: -10, transformPerspective: 1200 },
        {
          opacity: 1, x: 0, rotateY: 0, duration: 0.9, ease: 'power3.out',
          scrollTrigger: { trigger: '.about-story', start: 'top 80%', toggleActions: 'play none none reverse' },
        }
      );
      gsap.fromTo('.about-story-text > *',
        { opacity: 0, x: 50 },
        {
          opacity: 1, x: 0, duration: 0.6, stagger: 0.1, ease: 'power3.out',
          scrollTrigger: { trigger: '.about-story', start: 'top 75%', toggleActions: 'play none none reverse' },
        }
      );
      // Stat counters
      gsap.fromTo('.about-stat-box',
        { opacity: 0, y: 30, scale: 0.8 },
        {
          opacity: 1, y: 0, scale: 1, duration: 0.5, stagger: 0.1, ease: 'back.out(1.8)',
          scrollTrigger: { trigger: '.about-stats-row', start: 'top 85%', toggleActions: 'play none none reverse' },
        }
      );

      // Connecting the World — parallax image
      gsap.fromTo('.about-world-img',
        { scale: 1.15 },
        {
          scale: 1, ease: 'none',
          scrollTrigger: { trigger: '.about-world-section', start: 'top bottom', end: 'bottom top', scrub: 1.5 },
        }
      );
      gsap.fromTo('.about-world-content > *',
        { opacity: 0, y: 40 },
        {
          opacity: 1, y: 0, duration: 0.6, stagger: 0.12, ease: 'power3.out',
          scrollTrigger: { trigger: '.about-world-section', start: 'top 70%', toggleActions: 'play none none reverse' },
        }
      );

      // Vision section
      gsap.fromTo('.about-vision-img-wrap',
        { opacity: 0, x: 80, rotateY: 10, transformPerspective: 1200 },
        {
          opacity: 1, x: 0, rotateY: 0, duration: 0.9, ease: 'power3.out',
          scrollTrigger: { trigger: '.about-vision', start: 'top 80%', toggleActions: 'play none none reverse' },
        }
      );
      gsap.fromTo('.about-vision-text > *',
        { opacity: 0, x: -50 },
        {
          opacity: 1, x: 0, duration: 0.6, stagger: 0.1, ease: 'power3.out',
          scrollTrigger: { trigger: '.about-vision', start: 'top 75%', toggleActions: 'play none none reverse' },
        }
      );

      // Timeline milestones
      gsap.utils.toArray('.about-milestone').forEach((ms, i) => {
        gsap.fromTo(ms,
          { opacity: 0, x: i % 2 === 0 ? -50 : 50, scale: 0.9 },
          {
            opacity: 1, x: 0, scale: 1, duration: 0.6, ease: 'power3.out',
            scrollTrigger: { trigger: ms, start: 'top 85%', toggleActions: 'play none none reverse' },
          }
        );
      });

      // Timeline line grow
      gsap.fromTo('.about-timeline-line-fill',
        { scaleY: 0 },
        {
          scaleY: 1, ease: 'none',
          scrollTrigger: { trigger: '.about-timeline', start: 'top 80%', end: 'bottom 60%', scrub: 1 },
        }
      );

      // Team cards
      gsap.utils.toArray('.about-team-card').forEach((card, i) => {
        gsap.fromTo(card,
          { opacity: 0, y: 50, rotateX: 10, transformPerspective: 800 },
          {
            opacity: 1, y: 0, rotateX: 0, duration: 0.6, delay: i * 0.1, ease: 'power3.out',
            scrollTrigger: { trigger: '.about-team-grid', start: 'top 80%', toggleActions: 'play none none reverse' },
          }
        );
      });

      // Values cards
      gsap.utils.toArray('.about-value-card').forEach((card, i) => {
        gsap.fromTo(card,
          { opacity: 0, y: 40, scale: 0.9 },
          {
            opacity: 1, y: 0, scale: 1, duration: 0.5, delay: i * 0.12, ease: 'back.out(1.5)',
            scrollTrigger: { trigger: '.about-values-grid', start: 'top 82%', toggleActions: 'play none none reverse' },
          }
        );
      });

    }, pageRef);

    return () => {
      if (cleanupNav) cleanupNav();
      ctx.revert();
    };
  }, []);

  return (
    <div className="about-page" ref={pageRef}>

      {/* ===== HERO ===== */}
      <section className="about-hero">
        <div className="about-hero-bg">
          <img
            src="https://images.unsplash.com/photo-1488085061387-422e29b40080?w=1600&q=80"
            alt="Travel aerial view"
            className="about-hero-bg-img"
          />
          <div className="about-hero-overlay" />
        </div>
        <div className="container" style={{ position: 'relative', zIndex: 2 }}>
          <span className="about-hero-badge">✦ Our Story</span>
          <h1 className="about-hero-title">
            We Make Travel<br />
            <span className="about-hero-highlight">Effortless & Memorable</span>
          </h1>
          <p className="about-hero-sub">
            Founded in 2020, TravelFlow is on a mission to make world travel accessible, delightful, and seamless for every adventurer.
          </p>
        </div>
      </section>

      {/* ===== OUR STORY ===== */}
      <section className="section about-story">
        <div className="container">
          <div className="about-story-grid">
            <div className="about-story-img-wrap">
              <img
                src="https://images.unsplash.com/photo-1522199710521-72d69614c702?w=800&q=80"
                alt="Team planning travel routes"
                className="about-story-img"
              />
              <div className="about-story-img-badge">
                <span className="about-story-badge-value">6+</span>
                <span className="about-story-badge-label">Years of Excellence</span>
              </div>
            </div>
            <div className="about-story-text">
              <span className="about-section-tag">Who We Are</span>
              <h2 className="about-section-heading">Our Story</h2>
              <p className="about-section-para">
                Founded in 2020, TravelFlow started with a simple idea — travel should be easy. We built a platform that brings together flights, destinations, and experiences under one roof. Today we serve over 2 million happy travelers across the globe.
              </p>
              <p className="about-section-para">
                Our team of travel experts and engineers work tirelessly to ensure every booking is smooth, every price is fair, and every journey is memorable. We believe that exploring the world should be for everyone.
              </p>
              <div className="about-stats-row">
                <div className="about-stat-box">
                  <div className="about-stat-value" style={{ color: 'var(--primary-blue)' }}>2M+</div>
                  <div className="about-stat-label">Happy Travelers</div>
                </div>
                <div className="about-stat-box">
                  <div className="about-stat-value" style={{ color: 'var(--accent-orange)' }}>500+</div>
                  <div className="about-stat-label">Flight Routes</div>
                </div>
                <div className="about-stat-box">
                  <div className="about-stat-value" style={{ color: '#27AE60' }}>120+</div>
                  <div className="about-stat-label">Countries</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== CONNECTING THE WORLD — FULL-WIDTH IMAGE ===== */}
      <section className="about-world-section">
        <div className="about-world-img-wrap">
          <img
            src="https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1600&q=80"
            alt="Connected world from space at night"
            className="about-world-img"
          />
          <div className="about-world-overlay" />
        </div>
        <div className="about-world-content">
          <span className="about-world-icon">🌏</span>
          <h2 className="about-world-title">Connecting the World</h2>
          <p className="about-world-text">
            Every day, thousands of travelers trust TravelFlow to cross continents, discover new cultures, and create lifelong memories. Our global network spans 120+ countries with real-time flight data and local partnerships.
          </p>
          <div className="about-world-stats">
            <div className="about-world-stat">
              <span className="about-world-stat-val">50+</span>
              <span className="about-world-stat-lbl">Airlines</span>
            </div>
            <div className="about-world-stat">
              <span className="about-world-stat-val">130+</span>
              <span className="about-world-stat-lbl">Currencies</span>
            </div>
            <div className="about-world-stat">
              <span className="about-world-stat-val">24/7</span>
              <span className="about-world-stat-lbl">Support</span>
            </div>
          </div>
        </div>
      </section>

      {/* ===== OUR VISION ===== */}
      <section className="section about-vision">
        <div className="container">
          <div className="about-vision-grid">
            <div className="about-vision-text">
              <span className="about-section-tag">Our Vision</span>
              <h2 className="about-section-heading">Building the Future of Travel</h2>
              <p className="about-section-para">
                We envision a world where anyone can explore any destination with just a few taps — no complexity, no hidden fees, just pure adventure. Our AI-powered platform learns your preferences and crafts personalized itineraries.
              </p>
              <p className="about-section-para">
                From carbon-neutral flights to accessible travel for all abilities, we're committed to making the travel industry more inclusive, sustainable, and innovative for generations to come.
              </p>
              <div className="about-vision-features">
                <div className="about-vision-feat">
                  <span className="about-vision-feat-icon">🤖</span>
                  <div>
                    <strong>AI Trip Planning</strong>
                    <p>Smart recommendations based on your preferences</p>
                  </div>
                </div>
                <div className="about-vision-feat">
                  <span className="about-vision-feat-icon">🌿</span>
                  <div>
                    <strong>Sustainable Travel</strong>
                    <p>Carbon offset options on every booking</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="about-vision-img-wrap">
              <img
                src="https://img.freepik.com/premium-photo/aircraft-wing-clouds-sunset_39665-198.jpg"
                alt="Airplane wing above clouds at sunset"
                className="about-vision-img"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ===== TIMELINE ===== */}
      <section className="section about-timeline-section" style={{ background: 'var(--background)' }}>
        <div className="container">
          <h2 className="section-title">Our Journey</h2>
          <p className="section-subtitle">Key milestones that shaped TravelFlow.</p>
          <div className="about-timeline">
            <div className="about-timeline-line">
              <div className="about-timeline-line-fill" />
            </div>
            {milestones.map((ms, i) => (
              <div className={`about-milestone ${i % 2 === 0 ? 'left' : 'right'}`} key={i}>
                <div className="about-milestone-dot">{ms.icon}</div>
                <div className="about-milestone-card">
                  <span className="about-milestone-year">{ms.year}</span>
                  <h4 className="about-milestone-title">{ms.title}</h4>
                  <p className="about-milestone-desc">{ms.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== TEAM ===== */}
      <section className="section about-team-section">
        <div className="container">
          <h2 className="section-title">Meet the Team</h2>
          <p className="section-subtitle">The passionate people behind TravelFlow.</p>
          <div className="about-team-grid">
            {teamMembers.map((member, i) => (
              <div className="about-team-card" key={i}>
                <div className="about-team-img-wrap">
                  <img src={member.image} alt={member.name} className="about-team-img" loading="lazy" />
                </div>
                <h4 className="about-team-name">{member.name}</h4>
                <p className="about-team-role">{member.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== VALUES ===== */}
      <section className="section about-values-section" style={{ background: 'var(--background)' }}>
        <div className="container">
          <h2 className="section-title">Our Values</h2>
          <p className="section-subtitle">The principles that guide everything we do.</p>
          <div className="about-values-grid">
            {[
              { icon: '🎯', title: 'Customer First', text: 'Every decision starts and ends with our travelers in mind.', color: 'var(--primary-blue)' },
              { icon: '🤝', title: 'Integrity', text: 'Transparent pricing with no hidden fees, ever.', color: 'var(--accent-orange)' },
              { icon: '🚀', title: 'Innovation', text: 'Continuously pushing boundaries for better experiences.', color: '#27AE60' },
              { icon: '🌍', title: 'Inclusivity', text: 'Making travel accessible to everyone, everywhere.', color: '#9B51E0' },
            ].map((v, i) => (
              <div className="about-value-card" key={i}>
                <div className="about-value-icon" style={{ background: `${v.color}15`, color: v.color }}>{v.icon}</div>
                <h4 className="about-value-title">{v.title}</h4>
                <p className="about-value-text">{v.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
