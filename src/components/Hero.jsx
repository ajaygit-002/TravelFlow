import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import heroBg from '../assets/ref.png';
import worldMapBg from '../assets/world-map-bg.svg';
import '../styles/hero.css';
import '../styles/buttons.css';

export default function Hero() {
  const heroRef = useRef(null);

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
