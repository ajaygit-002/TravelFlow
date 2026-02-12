import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { gsap } from 'gsap';
import heroBg from '../assets/ref.png';
import worldMapBg from '../assets/world-map-bg.svg';
import SearchWidget from './SearchWidget';
import '../styles/hero.css';
import '../styles/buttons.css';

export default function Hero() {
  const heroRef = useRef(null);

  useEffect(() => {
    if (!heroRef.current) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

      /* Background zoom-in */
      tl.fromTo('.hero-bg', { scale: 1.2, opacity: 0 }, { scale: 1, opacity: 1, duration: 1.4 });

      /* Glow orbs fade in */
      tl.fromTo('.glow-orb', { opacity: 0, scale: 0.5 }, {
        opacity: 0.3, scale: 1, duration: 1, stagger: 0.2,
      }, '-=1');

      /* Badge slide down */
      tl.fromTo('.hero-badge', { opacity: 0, y: -30 }, { opacity: 1, y: 0, duration: 0.6 }, '-=0.6');

      /* Title */
      tl.fromTo('.hero-title', { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 0.7 }, '-=0.3');

      /* Subtitle */
      tl.fromTo('.hero-subtitle', { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.6 }, '-=0.3');

      /* Buttons */
      tl.fromTo('.hero-buttons', { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.5 }, '-=0.2');

      /* Stats counter animation */
      tl.fromTo('.hero-stat', { opacity: 0, y: 30 }, {
        opacity: 1, y: 0, duration: 0.5, stagger: 0.15,
      }, '-=0.2');

      /* Floating elements drift in */
      tl.fromTo('.float-airplane', { opacity: 0, scale: 0, rotation: -30 }, {
        opacity: 1, scale: 1, rotation: 0, duration: 0.8, stagger: 0.2, ease: 'back.out(1.7)',
      }, '-=0.6');

      tl.fromTo('.float-pin', { opacity: 0, y: -40 }, {
        opacity: 1, y: 0, duration: 0.6, stagger: 0.15, ease: 'bounce.out',
      }, '-=0.8');

      /* Continuous float animation for planes and pins */
      gsap.to('.float-airplane', {
        y: '+=20', duration: 2, yoyo: true, repeat: -1, ease: 'sine.inOut',
        stagger: { each: 0.4, from: 'random' },
      });

      gsap.to('.float-pin', {
        y: '+=12', duration: 1.8, yoyo: true, repeat: -1, ease: 'sine.inOut',
        stagger: { each: 0.3, from: 'random' },
      });

      /* Parallax on mouse move */
      const handleMouseMove = (e) => {
        const { clientX, clientY } = e;
        const xPercent = (clientX / window.innerWidth - 0.5) * 2;
        const yPercent = (clientY / window.innerHeight - 0.5) * 2;

        gsap.to('.hero-bg', { x: xPercent * 15, y: yPercent * 10, duration: 0.8, ease: 'power2.out' });
        gsap.to('.float-airplane', { x: xPercent * 25, duration: 0.6, ease: 'power2.out' });
        gsap.to('.float-pin', { x: xPercent * -15, duration: 0.6, ease: 'power2.out' });
        gsap.to('.glow-orb', { x: xPercent * 20, y: yPercent * 20, duration: 1, ease: 'power2.out' });
      };

      window.addEventListener('mousemove', handleMouseMove);

      /* Cleanup listeners on revert */
      return () => window.removeEventListener('mousemove', handleMouseMove);
    }, heroRef);

    return () => ctx.revert();
  }, []);

  return (
    <section className="hero" ref={heroRef}>
      <div
        className="hero-bg"
        style={{ backgroundImage: `url(${heroBg}), url(${worldMapBg})` }}
      />

      {/* Glow orbs */}
      <div className="glow-orb glow-orb-1" />
      <div className="glow-orb glow-orb-2" />
      <div className="glow-orb glow-orb-3" />

      {/* SVG Route lines */}
      <div className="hero-routes">
        <svg viewBox="0 0 1440 800" preserveAspectRatio="none">
          <path
            className="route-line"
            d="M200,600 Q500,200 800,400 T1400,300"
          />
          <path
            className="route-line"
            d="M100,500 Q400,100 700,350 T1300,200"
            style={{ animationDelay: '1s' }}
          />
          <path
            className="route-line"
            d="M300,700 Q600,300 900,450 T1440,350"
            style={{ animationDelay: '2s' }}
          />
        </svg>
      </div>

      {/* Floating 3D elements */}
      <div className="hero-float-elements">
        <div className="float-airplane">✈️</div>
        <div className="float-airplane">🛩️</div>
        <div className="float-airplane">✈️</div>
        <div className="float-pin">📍</div>
        <div className="float-pin">📍</div>
        <div className="float-pin">📍</div>
      </div>

      {/* Content */}
      <div className="container">
        <div className="hero-content">
          <div className="hero-badge">
            <span className="hero-badge-dot" />
            Explore the World with TravelFlow
          </div>

          <h1 className="hero-title">
            Welcome to <span>TravelFlow</span>
          </h1>

          <p className="hero-subtitle">
            Travel the world with seamless connections. Discover breathtaking
            destinations, book effortless flights, and create memories that last
            a lifetime.
          </p>

          <div className="hero-buttons">
            <Link to="/destinations" className="btn btn-primary">
              Get Started →
            </Link>
            <Link to="/contact" className="btn btn-outline">
              Contact Us
            </Link>
          </div>

          {/* Search Widget */}
          <SearchWidget />

          <div className="hero-stats">
            <div className="hero-stat">
              <div className="hero-stat-value">500+</div>
              <div className="hero-stat-label">Destinations</div>
            </div>
            <div className="hero-stat">
              <div className="hero-stat-value">10K+</div>
              <div className="hero-stat-label">Happy Travelers</div>
            </div>
            <div className="hero-stat">
              <div className="hero-stat-value">24/7</div>
              <div className="hero-stat-label">Support</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
