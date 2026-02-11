import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import Hero from '../components/Hero';
import Services from '../components/Services';
import FeaturesSection from '../components/FeaturesSection';
import Footer from '../components/Footer';
import DestinationCard from '../components/DestinationCard';
import { initAllAnimations } from '../animations/gsapAnimations';
import destinations from '../data/destinations';
import currencies, { regionColors } from '../data/currencies';
import '../styles/currencies.css';

export default function Home() {
  useEffect(() => {
    const cleanup = initAllAnimations();
    return cleanup;
  }, []);

  return (
    <>
      <Hero />
      <Services />

      {/* Why Choose Us — Features Timeline */}
      <FeaturesSection />

      {/* Featured Destinations Preview */}
      <section className="section featured-dest-section">
        <div className="container">
          <div className="featured-dest-header">
            <span className="featured-dest-tag">✈ Top Picks</span>
            <h2 className="section-title">Popular Destinations</h2>
            <p className="section-subtitle">
              Handpicked destinations loved by thousands of travelers worldwide.
            </p>
          </div>
          <div className="dest-grid-wrapper">
            <div className="dest-grid">
              {destinations.map((dest, i) => (
                <DestinationCard key={dest.id} dest={dest} index={i} />
              ))}
            </div>
          </div>
          <div className="featured-dest-cta">
            <Link to="/destinations" className="btn btn-primary btn-lg">
              Explore All Destinations →
            </Link>
          </div>
        </div>
      </section>

      {/* World Currencies Preview */}
      <section className="section" style={{ background: 'var(--background)' }}>
        <div className="container">
          <h2 className="section-title">World Currencies</h2>
          <p className="section-subtitle">
            Know your exchange rates before you fly — we cover every currency on the planet.
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '16px', marginBottom: '32px' }}>
            {currencies.slice(0, 8).map((c) => {
              const color = regionColors[c.region]?.primary || '#2F80ED';
              return (
                <div
                  key={c.code}
                  className="card"
                  style={{ padding: '20px', textAlign: 'center', cursor: 'pointer' }}
                >
                  <div style={{ fontSize: '2.2rem', marginBottom: '8px' }}>{c.flag}</div>
                  <div style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--dark)' }}>{c.code}</div>
                  <div style={{ fontSize: '0.82rem', color: 'var(--gray)' }}>{c.name}</div>
                  <div style={{ marginTop: '8px', fontWeight: 700, color, fontSize: '1.1rem' }}>
                    {c.symbol} {c.rate < 1 ? c.rate.toFixed(4) : c.rate.toLocaleString()}
                  </div>
                </div>
              );
            })}
          </div>
          <div style={{ textAlign: 'center' }}>
            <Link to="/currencies" className="btn btn-primary">
              View All Currencies →
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
