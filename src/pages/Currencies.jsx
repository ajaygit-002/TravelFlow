import { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import currencies, { regionColors, regions } from '../data/currencies';
import CurrencyCard from '../components/CurrencyCard';
import Footer from '../components/Footer';
import { animateNavbar } from '../animations/gsapAnimations';
import '../styles/currencies.css';

gsap.registerPlugin(ScrollTrigger);

export default function Currencies() {
  const [search, setSearch] = useState('');
  const [activeRegion, setActiveRegion] = useState('All');
  const [selectedCurrency, setSelectedCurrency] = useState(null);
  const [convertAmount, setConvertAmount] = useState('1');
  const [convertFrom, setConvertFrom] = useState('USD');
  const [convertTo, setConvertTo] = useState('EUR');
  const gridRef = useRef(null);
  const pageRef = useRef(null);
  const heroAnimated = useRef(false);

  // Nav scroll effect
  useEffect(() => {
    const cleanup = animateNavbar();
    return () => { if (cleanup) cleanup(); };
  }, []);

  // ===== SMOOTH PAGE ENTRANCE =====
  useEffect(() => {
    if (heroAnimated.current) return;
    heroAnimated.current = true;

    const tl = gsap.timeline({ defaults: { ease: 'power4.out' } });

    // Hero entrance
    tl.fromTo('.currency-hero',
      { opacity: 0 },
      { opacity: 1, duration: 0.6 }
    )
    .fromTo('.currency-hero .section-title',
      { opacity: 0, y: 40, clipPath: 'inset(0 0 100% 0)' },
      { opacity: 1, y: 0, clipPath: 'inset(0 0 0% 0)', duration: 0.8 },
      '-=0.3'
    )
    .fromTo('.currency-hero .section-subtitle',
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.6 },
      '-=0.4'
    );

    // Controls entrance
    tl.fromTo('.currency-search',
      { opacity: 0, y: 20, scale: 0.97 },
      { opacity: 1, y: 0, scale: 1, duration: 0.5 },
      '-=0.2'
    )
    .fromTo('.filter-btn',
      { opacity: 0, y: 12, scale: 0.9 },
      { opacity: 1, y: 0, scale: 1, duration: 0.4, stagger: 0.05 },
      '-=0.3'
    )
    .fromTo('.currency-count',
      { opacity: 0 },
      { opacity: 1, duration: 0.4 },
      '-=0.2'
    );

    // Sidebar entrance
    gsap.fromTo('.sidebar-card',
      { opacity: 0, x: -30 },
      {
        opacity: 1, x: 0, duration: 0.7, ease: 'power3.out',
        scrollTrigger: { trigger: '.sidebar-card', start: 'top 90%' }
      }
    );
    gsap.fromTo('.sidebar-converter',
      { opacity: 0, x: -30 },
      {
        opacity: 1, x: 0, duration: 0.7, delay: 0.15, ease: 'power3.out',
        scrollTrigger: { trigger: '.sidebar-converter', start: 'top 90%' }
      }
    );
  }, []);

  // Filtered currencies
  const filtered = useMemo(() => {
    return currencies.filter((c) => {
      const matchRegion = activeRegion === 'All' || c.region === activeRegion;
      const q = search.toLowerCase();
      const matchSearch =
        !q ||
        c.code.toLowerCase().includes(q) ||
        c.name.toLowerCase().includes(q) ||
        c.country.toLowerCase().includes(q) ||
        c.symbol.includes(q);
      return matchRegion && matchSearch;
    });
  }, [search, activeRegion]);

  // Region stats
  const regionStats = useMemo(() => {
    const stats = {};
    regions.forEach((r) => {
      if (r === 'All') {
        stats[r] = currencies.length;
      } else {
        stats[r] = currencies.filter((c) => c.region === r).length;
      }
    });
    return stats;
  }, []);

  // ===== SMOOTH 3D SCROLL ANIMATION FOR CARDS =====
  useEffect(() => {
    if (!gridRef.current) return;

    // Kill old triggers
    ScrollTrigger.getAll()
      .filter((t) => t.vars?.id?.startsWith?.('curr-'))
      .forEach((t) => t.kill());

    const cards = gridRef.current.querySelectorAll('.currency-card');
    if (!cards.length) return;

    // Initial state: cards hidden with gentle 3D offset
    gsap.set(cards, {
      opacity: 0,
      y: 50,
      scale: 0.92,
      rotateX: 8,
      transformPerspective: 1000,
      transformOrigin: 'center bottom',
      willChange: 'transform, opacity',
    });

    // Smooth staggered reveal on scroll
    ScrollTrigger.batch(cards, {
      id: 'curr-batch',
      start: 'top 88%',
      batchMax: 6,
      onEnter: (batch) => {
        gsap.to(batch, {
          opacity: 1,
          y: 0,
          scale: 1,
          rotateX: 0,
          duration: 0.75,
          ease: 'power2.out',
          stagger: {
            each: 0.08,
            from: 'start',
          },
          overwrite: 'auto',
        });
      },
      onLeaveBack: (batch) => {
        gsap.to(batch, {
          opacity: 0,
          y: 30,
          scale: 0.95,
          rotateX: 5,
          duration: 0.4,
          ease: 'power2.in',
          stagger: 0.02,
          overwrite: 'auto',
        });
      },
    });

    // ===== SMOOTH HOVER 3D TILT (not conflicting with flip) =====
    const handlers = [];

    cards.forEach((card) => {
      let isHovered = false;
      let rafId = null;
      let targetRX = 0, targetRY = 0;

      const handleMove = (e) => {
        isHovered = true;
        const rect = card.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;
        targetRY = x * 8;
        targetRX = -y * 6;

        if (!rafId) {
          rafId = requestAnimationFrame(() => {
            gsap.to(card, {
              rotateY: targetRY,
              rotateX: targetRX,
              scale: 1.03,
              boxShadow: `${-targetRY * 1.5}px ${targetRX * 1.5}px 25px rgba(0,0,0,0.1)`,
              duration: 0.6,
              ease: 'power3.out',
              transformPerspective: 1000,
              overwrite: 'auto',
            });
            rafId = null;
          });
        }
      };

      const handleLeave = () => {
        isHovered = false;
        if (rafId) { cancelAnimationFrame(rafId); rafId = null; }
        gsap.to(card, {
          rotateY: 0,
          rotateX: 0,
          scale: 1,
          boxShadow: '0 4px 20px rgba(0,0,0,0.06)',
          duration: 0.7,
          ease: 'power3.out',
          overwrite: 'auto',
        });
      };

      card.addEventListener('mousemove', handleMove);
      card.addEventListener('mouseleave', handleLeave);
      handlers.push({ card, handleMove, handleLeave });
    });

    return () => {
      handlers.forEach(({ card, handleMove, handleLeave }) => {
        card.removeEventListener('mousemove', handleMove);
        card.removeEventListener('mouseleave', handleLeave);
      });
    };
  }, [filtered]);

  // Converter
  const convertedValue = useMemo(() => {
    const fromRate = currencies.find((c) => c.code === convertFrom)?.rate || 1;
    const toRate = currencies.find((c) => c.code === convertTo)?.rate || 1;
    const amt = parseFloat(convertAmount) || 0;
    return ((amt / fromRate) * toRate).toFixed(4);
  }, [convertAmount, convertFrom, convertTo]);

  // ===== DETAIL PANEL — SMOOTH OPEN =====
  const handleSelect = useCallback((currency) => {
    setSelectedCurrency(currency);

    // Stagger in from right with depth
    requestAnimationFrame(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power4.out' } });

      tl.fromTo('.currency-detail-panel',
        { xPercent: 100, opacity: 0 },
        { xPercent: 0, opacity: 1, duration: 0.55 }
      )
      .fromTo('.detail-header',
        { opacity: 0, y: -20 },
        { opacity: 1, y: 0, duration: 0.4 },
        '-=0.25'
      )
      .fromTo('.detail-flag',
        { opacity: 0, scale: 0.5, rotation: -15 },
        { opacity: 1, scale: 1, rotation: 0, duration: 0.5, ease: 'back.out(1.8)' },
        '-=0.2'
      )
      .fromTo('.detail-name, .detail-code-badge',
        { opacity: 0, y: 10 },
        { opacity: 1, y: 0, duration: 0.35, stagger: 0.08 },
        '-=0.2'
      )
      .fromTo('.detail-info-item',
        { opacity: 0, y: 18, scale: 0.92 },
        {
          opacity: 1, y: 0, scale: 1,
          duration: 0.4, stagger: 0.06,
          ease: 'power3.out',
        },
        '-=0.15'
      )
      .fromTo('.detail-section-title',
        { opacity: 0, x: -15 },
        { opacity: 1, x: 0, duration: 0.35, stagger: 0.1 },
        '-=0.2'
      )
      .fromTo('.detail-rate-bar .detail-rate-fill',
        { width: '0%' },
        { width: 'auto', duration: 0.6, ease: 'power2.out' },
        '-=0.2'
      );
    });
  }, []);

  // ===== DETAIL PANEL — SMOOTH CLOSE =====
  const closeDetail = useCallback(() => {
    const tl = gsap.timeline({
      defaults: { ease: 'power3.in' },
      onComplete: () => setSelectedCurrency(null),
    });

    tl.to('.detail-info-item', {
      opacity: 0, y: 10, scale: 0.95,
      duration: 0.2, stagger: 0.02, overwrite: true,
    })
    .to('.currency-detail-panel', {
      xPercent: 100, opacity: 0,
      duration: 0.4,
    }, '-=0.1')
    .to('.detail-panel-overlay', {
      opacity: 0,
      duration: 0.3,
    }, '-=0.35');
  }, []);

  return (
    <div className="currency-page">
      {/* Hero */}
      <section className="currency-hero">
        <div className="container">
          <h1 className="section-title">World Currencies</h1>
          <p className="section-subtitle">
            Explore every currency on the planet — live rates, symbols, and regions in a stunning 3D interactive grid.
          </p>
        </div>
      </section>

      {/* Main */}
      <section className="section">
        <div className="container">
          {/* Search + Filters */}
          <div className="currency-controls">
            <div className="currency-search">
              <span className="currency-search-icon">🔍</span>
              <input
                type="text"
                placeholder="Search currency, country, or code..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <div className="currency-filters">
              {regions.map((r) => (
                <button
                  key={r}
                  className={`filter-btn ${activeRegion === r ? 'active' : ''}`}
                  onClick={() => setActiveRegion(r)}
                >
                  {r} ({regionStats[r]})
                </button>
              ))}
            </div>
          </div>

          <div className="currency-count">
            Showing <span>{filtered.length}</span> of <span>{currencies.length}</span> currencies
          </div>

          {/* Split layout */}
          <div className="currency-split">
            {/* Left sidebar */}
            <div className="currency-sidebar">
              <div className="sidebar-card">
                <h3>📊 By Region</h3>
                {regions
                  .filter((r) => r !== 'All')
                  .map((r) => (
                    <div className="region-stat" key={r}>
                      <div className="region-stat-label">
                        <span
                          className="region-dot"
                          style={{ background: regionColors[r]?.primary }}
                        />
                        {r}
                      </div>
                      <span className="region-stat-count">{regionStats[r]}</span>
                    </div>
                  ))}
              </div>

              <div className="sidebar-converter">
                <h3>💱 Quick Convert</h3>
                <div className="converter-row">
                  <input
                    type="number"
                    value={convertAmount}
                    onChange={(e) => setConvertAmount(e.target.value)}
                    min="0"
                    step="any"
                  />
                  <select
                    value={convertFrom}
                    onChange={(e) => setConvertFrom(e.target.value)}
                  >
                    {currencies.map((c) => (
                      <option key={c.code} value={c.code}>
                        {c.code}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="converter-swap">⇅</div>
                <div className="converter-row">
                  <input type="text" value={convertedValue} readOnly />
                  <select
                    value={convertTo}
                    onChange={(e) => setConvertTo(e.target.value)}
                  >
                    {currencies.map((c) => (
                      <option key={c.code} value={c.code}>
                        {c.code}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="converter-result">
                  {convertAmount || '0'} {convertFrom} = {convertedValue} {convertTo}
                </div>
              </div>
            </div>

            {/* Right: 3D card grid */}
            <div>
              {filtered.length > 0 ? (
                <div className="currency-grid" ref={gridRef}>
                  {filtered.map((currency, i) => (
                    <CurrencyCard
                      key={currency.code}
                      currency={currency}
                      index={i}
                      onSelect={handleSelect}
                    />
                  ))}
                </div>
              ) : (
                <div className="no-results">
                  <div className="no-results-icon">🔎</div>
                  <h3>No currencies found</h3>
                  <p>Try adjusting your search or filter.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Detail panel (slide from right) */}
      <div
        className={`detail-panel-overlay ${selectedCurrency ? 'open' : ''}`}
        onClick={closeDetail}
      />
      <div className={`currency-detail-panel ${selectedCurrency ? 'open' : ''}`}>
        {selectedCurrency && (
          <>
            <div
              className="detail-header"
              style={{
                background:
                  regionColors[selectedCurrency.region]?.gradient ||
                  'linear-gradient(135deg, #2F80ED, #56CCF2)',
              }}
            >
              <button className="detail-close" onClick={closeDetail}>
                ✕
              </button>
              <div className="detail-flag">{selectedCurrency.flag}</div>
              <div className="detail-name">{selectedCurrency.name}</div>
              <span className="detail-code-badge">
                {selectedCurrency.code}
              </span>
            </div>
            <div className="detail-body">
              <div className="detail-info-grid">
                <div className="detail-info-item">
                  <div className="detail-info-label">Symbol</div>
                  <div className="detail-info-value" style={{ fontSize: '1.6rem' }}>
                    {selectedCurrency.symbol}
                  </div>
                </div>
                <div className="detail-info-item">
                  <div className="detail-info-label">Code</div>
                  <div className="detail-info-value">{selectedCurrency.code}</div>
                </div>
                <div className="detail-info-item">
                  <div className="detail-info-label">Country</div>
                  <div className="detail-info-value" style={{ fontSize: '1rem' }}>
                    {selectedCurrency.country}
                  </div>
                </div>
                <div className="detail-info-item">
                  <div className="detail-info-label">Region</div>
                  <div className="detail-info-value" style={{ fontSize: '1rem' }}>
                    {selectedCurrency.region}
                  </div>
                </div>
                <div className="detail-info-item" style={{ gridColumn: '1 / -1' }}>
                  <div className="detail-info-label">Exchange Rate (1 USD)</div>
                  <div className="detail-info-value" style={{ fontSize: '1.5rem', color: 'var(--primary-blue)' }}>
                    {selectedCurrency.symbol}{' '}
                    {selectedCurrency.rate < 1
                      ? selectedCurrency.rate.toFixed(4)
                      : selectedCurrency.rate.toLocaleString()}
                  </div>
                </div>
              </div>

              <div className="detail-section-title">Rate Comparison</div>
              <div className="detail-rate-bar">
                <div
                  className="detail-rate-fill"
                  style={{
                    width: `${Math.min(
                      (selectedCurrency.rate / Math.max(...currencies.map((c) => c.rate))) * 100,
                      100
                    )}%`,
                    background:
                      regionColors[selectedCurrency.region]?.gradient ||
                      'var(--primary-blue)',
                  }}
                />
              </div>

              <div className="detail-section-title">Quick Convert</div>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: '10px',
                }}
              >
                {[1, 10, 100, 1000].map((amt) => (
                  <div
                    key={amt}
                    className="detail-info-item"
                    style={{ padding: '14px' }}
                  >
                    <div className="detail-info-label">
                      {amt} USD
                    </div>
                    <div className="detail-info-value" style={{ fontSize: '1rem' }}>
                      {selectedCurrency.symbol}{' '}
                      {(amt * selectedCurrency.rate).toLocaleString(undefined, {
                        maximumFractionDigits: 2,
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>

      <Footer />
    </div>
  );
}
