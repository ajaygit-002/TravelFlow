import { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { Grid } from 'react-window';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import currencies, { regionColors, regions } from '../data/currencies';
import CurrencyCard from '../components/CurrencyCard';
import Footer from '../components/Footer';
import { animateNavbar } from '../animations/gsapAnimations';
import '../styles/currencies.css';
import ErrorBoundary from '../components/ErrorBoundary';

gsap.registerPlugin(ScrollTrigger);

export default function Currencies() {
  // Responsive grid state
  const [gridDims, setGridDims] = useState(() => {
    const width = typeof window !== 'undefined' ? window.innerWidth : 1200;
    let columns = 4;
    if (width < 600) columns = 1;
    else if (width < 900) columns = 2;
    else if (width < 1200) columns = 3;
    return { width: Math.min(width - 40, 1200), columns };
  });

  // Defensive: ensure currencies is always an array
  const safeCurrencies = Array.isArray(currencies) ? currencies : [];

  // Update grid on resize
  useEffect(() => {
    function handleResize() {
      const width = window.innerWidth;
      let columns = 4;
      if (width < 600) columns = 1;
      else if (width < 900) columns = 2;
      else if (width < 1200) columns = 3;
      setGridDims({ width: Math.min(width - 40, 1200), columns });
    }
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  const [search, setSearch] = useState('');
  const [activeRegion, setActiveRegion] = useState('All');
  const [selectedCurrency, setSelectedCurrency] = useState(null);
  const [convertAmount, setConvertAmount] = useState('1');
  const [convertFrom, setConvertFrom] = useState('USD');
  const [convertTo, setConvertTo] = useState('EUR');
  const gridRef = useRef(null);
  const pageRef = useRef(null);
  const heroAnimated = useRef(false);
  const prevFilteredLength = useRef(0);

  // Nav scroll effect
  useEffect(() => {
    const cleanup = animateNavbar();
    return () => { if (cleanup) cleanup(); };
  }, []);

  // ===== CINEMATIC PAGE ENTRANCE =====
  useEffect(() => {
    if (heroAnimated.current) return;
    heroAnimated.current = true;

    const tl = gsap.timeline({ defaults: { ease: 'power4.out' } });

    // Hero background fade
    tl.fromTo('.currency-hero',
      { opacity: 0 },
      { opacity: 1, duration: 0.8 }
    );

    // Particles fade in
    tl.fromTo('.hero-particle',
      { opacity: 0, scale: 0 },
      { opacity: 1, scale: 1, duration: 0.6, stagger: 0.06 },
      '-=0.5'
    );

    // Title reveal with clip path
    tl.fromTo('.currency-hero .section-title',
      { opacity: 0, y: 50, clipPath: 'inset(0 0 100% 0)' },
      { opacity: 1, y: 0, clipPath: 'inset(0 0 0% 0)', duration: 1, ease: 'power4.out' },
      '-=0.4'
    );

    // Subtitle slide up
    tl.fromTo('.currency-hero .section-subtitle',
      { opacity: 0, y: 25 },
      { opacity: 1, y: 0, duration: 0.7 },
      '-=0.5'
    );

    // Stats bar count up
    tl.fromTo('.hero-stat',
      { opacity: 0, y: 20, scale: 0.8 },
      { opacity: 1, y: 0, scale: 1, duration: 0.6, stagger: 0.1, ease: 'back.out(1.5)' },
      '-=0.3'
    );

    // Search bar + filters cascade
    tl.fromTo('.currency-search',
      { opacity: 0, y: 20, scale: 0.97 },
      { opacity: 1, y: 0, scale: 1, duration: 0.5 },
      '-=0.2'
    )
    .fromTo('.filter-btn',
      { opacity: 0, y: 14, scale: 0.85 },
      { opacity: 1, y: 0, scale: 1, duration: 0.45, stagger: 0.04, ease: 'back.out(1.4)' },
      '-=0.3'
    )
    .fromTo('.currency-count',
      { opacity: 0 },
      { opacity: 1, duration: 0.4 },
      '-=0.2'
    );

    // Sidebar entrance with depth
    gsap.fromTo('.sidebar-card',
      { opacity: 0, x: -40, rotateY: 5 },
      {
        opacity: 1, x: 0, rotateY: 0, duration: 0.8, ease: 'power3.out',
        scrollTrigger: { trigger: '.sidebar-card', start: 'top 90%' }
      }
    );
    gsap.fromTo('.sidebar-converter',
      { opacity: 0, x: -40, rotateY: 5 },
      {
        opacity: 1, x: 0, rotateY: 0, duration: 0.8, delay: 0.15, ease: 'power3.out',
        scrollTrigger: { trigger: '.sidebar-converter', start: 'top 90%' }
      }
    );
  }, []);

  // Filtered currencies
  const filtered = useMemo(() => {
    return safeCurrencies.filter((c) => {
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
  }, [search, activeRegion, safeCurrencies]);

  // Smooth count badge pulse on filter change
  useEffect(() => {
    gsap.fromTo('.currency-count span',
      { scale: 1.3, color: '#2F80ED' },
      { scale: 1, color: '#2F80ED', duration: 0.4, ease: 'back.out(2)' }
    );
  }, [filtered.length]);

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

  // ===== PROFESSIONAL 3D CARD ANIMATIONS =====
  useEffect(() => {
    if (!gridRef.current) return;

    // Kill old triggers
    ScrollTrigger.getAll()
      .filter((t) => t.vars?.id?.startsWith?.('curr-'))
      .forEach((t) => t.kill());

    const cards = gridRef.current.querySelectorAll('.currency-card');
    if (!cards.length) return;

    // Determine if this is a filter change (animate differently)
    const isFilterChange = prevFilteredLength.current > 0 && prevFilteredLength.current !== cards.length;
    prevFilteredLength.current = cards.length;

    if (isFilterChange) {
      // FILTER TRANSITION: Quick scale-in with shuffle feel
      gsap.set(cards, {
        opacity: 0,
        scale: 0.85,
        y: 20,
        rotateX: 0,
        transformPerspective: 1000,
      });
      gsap.to(cards, {
        opacity: 1,
        scale: 1,
        y: 0,
        duration: 0.5,
        ease: 'back.out(1.4)',
        stagger: {
          each: 0.025,
          grid: 'auto',
          from: 'center',
        },
        overwrite: 'auto',
      });
    } else {
      // INITIAL LOAD: Cinematic 3D wave entrance
      gsap.set(cards, {
        opacity: 0,
        y: 60,
        scale: 0.88,
        rotateX: 10,
        rotateY: -3,
        transformPerspective: 1200,
        transformOrigin: 'center bottom',
        willChange: 'transform, opacity',
      });

      // Cards in viewport — immediate stagger
      const visibleCards = Array.from(cards).filter(card => {
        const rect = card.getBoundingClientRect();
        return rect.top < window.innerHeight + 100;
      });
      const offscreenCards = Array.from(cards).filter(card => {
        const rect = card.getBoundingClientRect();
        return rect.top >= window.innerHeight + 100;
      });

      if (visibleCards.length) {
        gsap.to(visibleCards, {
          opacity: 1,
          y: 0,
          scale: 1,
          rotateX: 0,
          rotateY: 0,
          duration: 0.7,
          ease: 'power3.out',
          stagger: {
            each: 0.035,
            grid: 'auto',
            from: 'start',
          },
          overwrite: 'auto',
        });
      }

      // Off-screen cards — scroll-triggered batch
      if (offscreenCards.length) {
        ScrollTrigger.batch(offscreenCards, {
          id: 'curr-batch',
          start: 'top 92%',
          batchMax: 10,
          onEnter: (batch) => {
            gsap.to(batch, {
              opacity: 1,
              y: 0,
              scale: 1,
              rotateX: 0,
              rotateY: 0,
              duration: 0.6,
              ease: 'power2.out',
              stagger: {
                each: 0.04,
                from: 'start',
              },
              overwrite: 'auto',
            });
          },
          onLeaveBack: (batch) => {
            gsap.to(batch, {
              opacity: 0,
              y: 30,
              scale: 0.93,
              rotateX: 5,
              duration: 0.3,
              ease: 'power2.in',
              stagger: 0.015,
              overwrite: 'auto',
            });
          },
        });
      }
    }

    // ===== SMOOTH HOVER 3D TILT (desktop only, skip touch) =====
    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    const handlers = [];

    if (!isTouchDevice) {
      cards.forEach((card) => {
        let rafId = null;
        let targetRX = 0, targetRY = 0;

        const handleMove = (e) => {
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
                scale: 1.04,
                boxShadow: `${-targetRY * 1.5}px ${targetRX * 1.5}px 30px rgba(0,0,0,0.12)`,
                duration: 0.5,
                ease: 'power3.out',
                transformPerspective: 1000,
                overwrite: 'auto',
              });
              rafId = null;
            });
          }
        };

        const handleLeave = () => {
          if (rafId) { cancelAnimationFrame(rafId); rafId = null; }
          gsap.to(card, {
            rotateY: 0,
            rotateX: 0,
            scale: 1,
            boxShadow: '0 4px 20px rgba(0,0,0,0.06)',
            duration: 0.6,
            ease: 'power3.out',
            overwrite: 'auto',
          });
        };

        card.addEventListener('mousemove', handleMove);
        card.addEventListener('mouseleave', handleLeave);
        handlers.push({ card, handleMove, handleLeave });
      });
    }

    return () => {
      handlers.forEach(({ card, handleMove, handleLeave }) => {
        card.removeEventListener('mousemove', handleMove);
        card.removeEventListener('mouseleave', handleLeave);
      });
    };
  }, [filtered]);

  // Popular currencies for quick multi-convert
  const popularCodes = ['USD', 'EUR', 'GBP', 'JPY', 'INR', 'AUD', 'CAD', 'CHF'];

  // Converter
  const convertedValue = useMemo(() => {
    const fromRate = safeCurrencies.find((c) => c.code === convertFrom)?.rate || 1;
    const toRate = safeCurrencies.find((c) => c.code === convertTo)?.rate || 1;
    const amt = parseFloat(convertAmount) || 0;
    return ((amt / fromRate) * toRate).toFixed(4);
  }, [convertAmount, convertFrom, convertTo, safeCurrencies]);

  // Multi-currency quick convert results
  const quickConvertResults = useMemo(() => {
    const amt = parseFloat(convertAmount) || 0;
    if (amt <= 0) return [];
    const fromRate = safeCurrencies.find((c) => c.code === convertFrom)?.rate || 1;
    return popularCodes
      .filter((code) => code !== convertFrom)
      .map((code) => {
        const target = safeCurrencies.find((c) => c.code === code);
        if (!target) return null;
        const converted = (amt / fromRate) * target.rate;
        return {
          code: target.code,
          flag: target.flag,
          symbol: target.symbol,
          name: target.name,
          value: converted,
        };
      })
      .filter(Boolean);
  }, [convertAmount, convertFrom, safeCurrencies]);

  // ===== DETAIL PANEL — CINEMATIC OPEN =====
  const handleSelect = useCallback((currency) => {
    setSelectedCurrency(currency);

    requestAnimationFrame(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power4.out' } });

      // Overlay fade
      tl.fromTo('.detail-panel-overlay',
        { opacity: 0 },
        { opacity: 1, duration: 0.35 }
      );

      // Panel slide with bounce
      tl.fromTo('.currency-detail-panel',
        { xPercent: 100, opacity: 0 },
        { xPercent: 0, opacity: 1, duration: 0.6, ease: 'power3.out' },
        '-=0.2'
      );

      // Header with parallax depth
      tl.fromTo('.detail-header',
        { opacity: 0, y: -30, scale: 1.02 },
        { opacity: 1, y: 0, scale: 1, duration: 0.5 },
        '-=0.3'
      );

      // Flag bounces in
      tl.fromTo('.detail-flag',
        { opacity: 0, scale: 0, rotation: -20 },
        { opacity: 1, scale: 1, rotation: 0, duration: 0.6, ease: 'elastic.out(1, 0.5)' },
        '-=0.2'
      );

      // Name + badge stagger
      tl.fromTo('.detail-name, .detail-code-badge',
        { opacity: 0, y: 14 },
        { opacity: 1, y: 0, duration: 0.4, stagger: 0.08 },
        '-=0.25'
      );

      // Info items cascade
      tl.fromTo('.detail-info-item',
        { opacity: 0, y: 24, scale: 0.88 },
        {
          opacity: 1, y: 0, scale: 1,
          duration: 0.45, stagger: 0.05,
          ease: 'back.out(1.3)',
        },
        '-=0.15'
      );

      // Section titles slide
      tl.fromTo('.detail-section-title',
        { opacity: 0, x: -20 },
        { opacity: 1, x: 0, duration: 0.35, stagger: 0.08 },
        '-=0.2'
      );

      // Rate bar fill
      tl.fromTo('.detail-rate-bar .detail-rate-fill',
        { width: '0%' },
        { width: 'auto', duration: 0.7, ease: 'power2.out' },
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

    // Items shrink away
    tl.to('.detail-info-item', {
      opacity: 0, y: 12, scale: 0.92,
      duration: 0.2, stagger: 0.02, overwrite: true,
    });

    // Flag spins out
    tl.to('.detail-flag', {
      opacity: 0, scale: 0.5, rotation: 15,
      duration: 0.25,
    }, '-=0.15');

    // Panel slides out
    tl.to('.currency-detail-panel', {
      xPercent: 100, opacity: 0,
      duration: 0.4, ease: 'power4.in',
    }, '-=0.1');

    // Overlay fades
    tl.to('.detail-panel-overlay', {
      opacity: 0,
      duration: 0.3,
    }, '-=0.3');
  }, []);

  return (
    <div className="currency-page" ref={pageRef}>
      {/* Hero */}
      <section className="currency-hero">
        {/* Floating particles */}
        <div className="hero-particles">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="hero-particle" />
          ))}
        </div>
        <div className="container">
          <h1 className="section-title">World Currencies</h1>
          <p className="section-subtitle">
            Explore {currencies.length} currencies across the globe — live rates, symbols, and regions in a stunning interactive grid.
          </p>
          <div className="hero-stats-bar">
            <div className="hero-stat">
              <div className="hero-stat-value">{currencies.length}</div>
              <div className="hero-stat-label">Currencies</div>
            </div>
            <div className="hero-stat">
              <div className="hero-stat-value">{regions.length - 1}</div>
              <div className="hero-stat-label">Regions</div>
            </div>
            <div className="hero-stat">
              <div className="hero-stat-value">Live</div>
              <div className="hero-stat-label">Rates</div>
            </div>
          </div>
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
                    placeholder="Enter amount"
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

                {/* Quick Convert to multiple currencies */}
                {quickConvertResults.length > 0 && (
                  <div className="quick-convert-multi">
                    <div className="quick-convert-heading">Converted to popular currencies</div>
                    <div className="quick-convert-list">
                      {quickConvertResults.map((r) => (
                        <div className="quick-convert-item" key={r.code}>
                          <div className="quick-convert-left">
                            <span className="quick-convert-flag">{r.flag}</span>
                            <span className="quick-convert-code">{r.code}</span>
                          </div>
                          <div className="quick-convert-value">
                            {r.symbol}{' '}
                            {r.value < 1
                              ? r.value.toFixed(4)
                              : r.value.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Right: 3D card grid */}
            <div>
              {Array.isArray(filtered) && gridDims && typeof gridDims.columns === 'number' && filtered.length > 0 && gridDims.columns > 0 ? (
                <div className="currency-grid" style={{ height: '70vh', minHeight: 350 }}>
                  {/* Error boundary for Grid rendering */}
                  <ErrorBoundary>
                    <Grid
                      columnCount={gridDims.columns}
                      columnWidth={270}
                      height={Math.max(350, typeof window !== 'undefined' ? Math.floor(window.innerHeight * 0.7) : 500)}
                      rowCount={Math.ceil(filtered.length / gridDims.columns)}
                      rowHeight={260}
                      width={gridDims.width}
                    >
                      {({ columnIndex, rowIndex, style }) => {
                        if (!Array.isArray(filtered) || !gridDims || typeof gridDims.columns !== 'number') return null;
                        const idx = rowIndex * gridDims.columns + columnIndex;
                        if (!filtered || idx >= filtered.length) return null;
                        const currency = filtered[idx];
                        if (!currency) return null;
                        return (
                          <div style={style} key={currency.code}>
                            <CurrencyCard
                              currency={currency}
                              index={idx}
                              onSelect={handleSelect}
                            />
                          </div>
                        );
                      }}
                    </Grid>
                  </ErrorBoundary>
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
              <div className="detail-quick-grid"
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
