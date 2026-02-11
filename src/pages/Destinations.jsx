import { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import currencies from '../data/currencies';
import tourSports from '../data/tourSports';
import Footer from '../components/Footer';
import { animateNavbar } from '../animations/gsapAnimations';
import '../styles/destinations.css';

gsap.registerPlugin(ScrollTrigger);

/* ===== DESTINATION DATA WITH REAL UNSPLASH IMAGES ===== */
const destinations = [
  {
    id: 'paris',
    name: 'Paris',
    country: 'France',
    flag: '🇫🇷',
    priceUSD: 499,
    emoji: '🗼',
    continent: 'Europe',
    rating: 4.8,
    reviews: 12480,
    duration: '5-7 days',
    bestFor: 'Romance & Culture',
    highlights: ['Eiffel Tower', 'Louvre Museum', 'Montmartre', 'Seine Cruise'],
    description: 'The City of Light enchants with iconic landmarks, world-class cuisine, and timeless romance along the Seine.',
    image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800&q=80',
    color: '#2F80ED',
  },
  {
    id: 'tokyo',
    name: 'Tokyo',
    country: 'Japan',
    flag: '🇯🇵',
    priceUSD: 699,
    emoji: '⛩️',
    continent: 'Asia',
    rating: 4.9,
    reviews: 9820,
    duration: '7-10 days',
    bestFor: 'Tech & Tradition',
    highlights: ['Shibuya Crossing', 'Senso-ji Temple', 'Akihabara', 'Mt. Fuji Day Trip'],
    description: 'Where ancient temples stand beside neon-lit skyscrapers — Tokyo is a mesmerizing blend of old and new.',
    image: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=800&q=80',
    color: '#F2994A',
  },
  {
    id: 'bali',
    name: 'Bali',
    country: 'Indonesia',
    flag: '🇮🇩',
    priceUSD: 449,
    emoji: '🏝️',
    continent: 'Asia',
    rating: 4.7,
    reviews: 15320,
    duration: '7-14 days',
    bestFor: 'Relaxation & Nature',
    highlights: ['Ubud Rice Terraces', 'Uluwatu Temple', 'Seminyak Beach', 'Volcano Trekking'],
    description: 'Lush rice terraces, sacred temples, and turquoise waters make Bali the ultimate tropical escape.',
    image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800&q=80',
    color: '#27AE60',
  },
  {
    id: 'newyork',
    name: 'New York',
    country: 'United States',
    flag: '🇺🇸',
    priceUSD: 399,
    emoji: '🗽',
    continent: 'Americas',
    rating: 4.8,
    reviews: 18650,
    duration: '4-7 days',
    bestFor: 'Urban Adventure',
    highlights: ['Times Square', 'Central Park', 'Statue of Liberty', 'Broadway Shows'],
    description: 'The city that never sleeps — iconic skylines, diverse neighborhoods, and endless energy await.',
    image: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=800&q=80',
    color: '#56CCF2',
  },
  {
    id: 'london',
    name: 'London',
    country: 'United Kingdom',
    flag: '🇬🇧',
    priceUSD: 549,
    emoji: '🎡',
    continent: 'Europe',
    rating: 4.7,
    reviews: 14200,
    duration: '5-7 days',
    bestFor: 'History & Theatre',
    highlights: ['Big Ben', 'Tower of London', 'West End', 'Buckingham Palace'],
    description: 'Royal heritage meets cutting-edge culture in this global metropolis on the Thames.',
    image: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=800&q=80',
    color: '#9B51E0',
  },
  {
    id: 'dubai',
    name: 'Dubai',
    country: 'UAE',
    flag: '🇦🇪',
    priceUSD: 599,
    emoji: '🏙️',
    continent: 'Asia',
    rating: 4.6,
    reviews: 10540,
    duration: '4-6 days',
    bestFor: 'Luxury & Shopping',
    highlights: ['Burj Khalifa', 'Dubai Mall', 'Desert Safari', 'Palm Jumeirah'],
    description: 'A futuristic oasis where desert meets luxury — towering skyscrapers, gold souks, and endless opulence.',
    image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=800&q=80',
    color: '#F2C94C',
  },
  {
    id: 'sydney',
    name: 'Sydney',
    country: 'Australia',
    flag: '🇦🇺',
    priceUSD: 749,
    emoji: '🏄',
    continent: 'Oceania',
    rating: 4.8,
    reviews: 8730,
    duration: '7-10 days',
    bestFor: 'Beaches & Wildlife',
    highlights: ['Opera House', 'Bondi Beach', 'Harbour Bridge', 'Blue Mountains'],
    description: "Sun-kissed harbours, iconic architecture, and pristine beaches — Sydney is Australia's crown jewel.",
    image: 'https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?w=800&q=80',
    color: '#EB5757',
  },
  {
    id: 'rome',
    name: 'Rome',
    country: 'Italy',
    flag: '🇮🇹',
    priceUSD: 479,
    emoji: '🏛️',
    continent: 'Europe',
    rating: 4.9,
    reviews: 16400,
    duration: '5-7 days',
    bestFor: 'History & Food',
    highlights: ['Colosseum', 'Vatican City', 'Trevi Fountain', 'Roman Forum'],
    description: 'Walk through millennia of history, savor authentic pasta, and toss a coin in the Trevi Fountain.',
    image: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=800&q=80',
    color: '#219653',
  },
  {
    id: 'maldives',
    name: 'Maldives',
    country: 'Maldives',
    flag: '🇲🇻',
    priceUSD: 899,
    emoji: '🏖️',
    continent: 'Asia',
    rating: 4.9,
    reviews: 6520,
    duration: '5-10 days',
    bestFor: 'Honeymoon & Diving',
    highlights: ['Overwater Villas', 'Coral Reefs', 'Whale Shark Diving', 'Sunset Cruises'],
    description: 'Crystal-clear waters, private overwater bungalows, and marine life that takes your breath away.',
    image: 'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?w=800&q=80',
    color: '#2D9CDB',
  },
  {
    id: 'capetown',
    name: 'Cape Town',
    country: 'South Africa',
    flag: '🇿🇦',
    priceUSD: 649,
    emoji: '🦁',
    continent: 'Africa',
    rating: 4.7,
    reviews: 7840,
    duration: '6-9 days',
    bestFor: 'Adventure & Nature',
    highlights: ['Table Mountain', 'Cape of Good Hope', 'Wine Tasting', 'Safari Trips'],
    description: 'Where dramatic mountains meet the ocean — safaris, vineyards, and vibrant culture converge.',
    image: 'https://images.unsplash.com/photo-1580060839134-75a5edca2e99?w=800&q=80',
    color: '#F2994A',
  },
  {
    id: 'singapore',
    name: 'Singapore',
    country: 'Singapore',
    flag: '🇸🇬',
    priceUSD: 529,
    emoji: '🌇',
    continent: 'Asia',
    rating: 4.8,
    reviews: 11200,
    duration: '3-5 days',
    bestFor: 'Food & Modern City',
    highlights: ['Marina Bay Sands', 'Gardens by the Bay', 'Hawker Centers', 'Sentosa Island'],
    description: 'A garden city of futuristic supertrees, world-class street food, and impeccable urban planning.',
    image: 'https://images.unsplash.com/photo-1525625293386-3f8f99389edd?w=800&q=80',
    color: '#BB6BD9',
  },
  {
    id: 'iceland',
    name: 'Iceland',
    country: 'Iceland',
    flag: '🇮🇸',
    priceUSD: 799,
    emoji: '🌋',
    continent: 'Europe',
    rating: 4.9,
    reviews: 5680,
    duration: '7-10 days',
    bestFor: 'Nature & Adventure',
    highlights: ['Northern Lights', 'Blue Lagoon', 'Golden Circle', 'Glacier Hiking'],
    description: 'A land of fire and ice — witness geysers, glaciers, volcanoes, and the magical aurora borealis.',
    image: 'https://images.unsplash.com/photo-1504829857797-ddff29c27927?w=800&q=80',
    color: '#56CCF2',
  },
];

const continents = ['All', 'Europe', 'Asia', 'Americas', 'Africa', 'Oceania'];
const sortOptions = [
  { value: 'popular', label: 'Most Popular' },
  { value: 'price-low', label: 'Price: Low → High' },
  { value: 'price-high', label: 'Price: High → Low' },
  { value: 'rating', label: 'Top Rated' },
];

/* ===== Popular currencies for quick selection ===== */
const popularCurrencies = ['USD', 'EUR', 'GBP', 'JPY', 'INR', 'AUD', 'CAD', 'AED', 'SGD', 'CHF', 'CNY', 'BRL'];

export default function Destinations() {
  const [selectedCurrency, setSelectedCurrency] = useState('USD');
  const [activeContinent, setActiveContinent] = useState('All');
  const [sortBy, setSortBy] = useState('popular');
  const [search, setSearch] = useState('');
  const [selectedDest, setSelectedDest] = useState(null);
  const [showAllCurrencies, setShowAllCurrencies] = useState(false);
  const gridRef = useRef(null);
  const heroAnimated = useRef(false);
  const pageRef = useRef(null);

  useEffect(() => {
    const cleanup = animateNavbar();
    return () => { if (cleanup) cleanup(); };
  }, []);

  // Get currency info
  const currencyInfo = useMemo(() => {
    return currencies.find(c => c.code === selectedCurrency) || currencies[0];
  }, [selectedCurrency]);

  // Convert USD price to selected currency
  const convertPrice = useCallback((usd) => {
    const rate = currencyInfo.rate;
    const converted = usd * rate;
    if (converted >= 100000) return Math.round(converted).toLocaleString();
    if (converted >= 1000) return Math.round(converted).toLocaleString();
    if (converted >= 1) return converted.toFixed(2);
    return converted.toFixed(4);
  }, [currencyInfo]);

  // Filtered & sorted destinations
  const filtered = useMemo(() => {
    let result = destinations.filter(d => {
      const matchContinent = activeContinent === 'All' || d.continent === activeContinent;
      const q = search.toLowerCase();
      const matchSearch = !q || d.name.toLowerCase().includes(q) || d.country.toLowerCase().includes(q);
      return matchContinent && matchSearch;
    });

    switch (sortBy) {
      case 'price-low': result.sort((a, b) => a.priceUSD - b.priceUSD); break;
      case 'price-high': result.sort((a, b) => b.priceUSD - a.priceUSD); break;
      case 'rating': result.sort((a, b) => b.rating - a.rating); break;
      default: result.sort((a, b) => b.reviews - a.reviews); break;
    }
    return result;
  }, [activeContinent, search, sortBy]);

  // ===== HERO ENTRANCE ANIMATION =====
  useEffect(() => {
    if (heroAnimated.current) return;
    heroAnimated.current = true;

    const tl = gsap.timeline({ defaults: { ease: 'power4.out' } });
    tl.fromTo('.dest-hero', { opacity: 0 }, { opacity: 1, duration: 0.5 })
      .fromTo('.dest-hero-badge', { opacity: 0, y: 20, scale: 0.85 }, { opacity: 1, y: 0, scale: 1, duration: 0.5 }, '-=0.2')
      .fromTo('.dest-hero-title', { opacity: 0, y: 50, clipPath: 'inset(0 0 100% 0)' }, { opacity: 1, y: 0, clipPath: 'inset(0 0 0% 0)', duration: 0.8 }, '-=0.2')
      .fromTo('.dest-hero-sub', { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.5 }, '-=0.4')
      .fromTo('.dest-hero-stats .dest-hero-stat', { opacity: 0, y: 20, scale: 0.8 }, { opacity: 1, y: 0, scale: 1, duration: 0.4, stagger: 0.1 }, '-=0.3')
      .fromTo('.sports-marquee-wrapper', { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.6 }, '-=0.2')
      .fromTo('.sports-marquee-row', { opacity: 0 }, { opacity: 1, duration: 0.4, stagger: 0.1 }, '-=0.3');
  }, []);

  // ===== CARD SCROLL ANIMATIONS =====
  useEffect(() => {
    if (!gridRef.current) return;

    ScrollTrigger.getAll().filter(t => t.vars?.id?.startsWith?.('dest-')).forEach(t => t.kill());

    const cards = gridRef.current.querySelectorAll('.dest-card-new');
    if (!cards.length) return;

    gsap.set(cards, {
      opacity: 0, y: 60, scale: 0.92, rotateX: 8,
      transformPerspective: 1000, transformOrigin: 'center bottom',
    });

    ScrollTrigger.batch(cards, {
      id: 'dest-batch',
      start: 'top 88%',
      batchMax: 4,
      onEnter: (batch) => {
        gsap.to(batch, {
          opacity: 1, y: 0, scale: 1, rotateX: 0,
          duration: 0.75, ease: 'power3.out',
          stagger: 0.1, overwrite: 'auto',
        });
      },
      onLeaveBack: (batch) => {
        gsap.to(batch, {
          opacity: 0, y: 30, scale: 0.95, rotateX: 4,
          duration: 0.35, ease: 'power2.in',
          stagger: 0.03, overwrite: 'auto',
        });
      },
    });

    // Hover tilt
    const handlers = [];
    cards.forEach(card => {
      let raf = null;
      const handleMove = (e) => {
        if (raf) return;
        raf = requestAnimationFrame(() => {
          const rect = card.getBoundingClientRect();
          const x = (e.clientX - rect.left) / rect.width - 0.5;
          const y = (e.clientY - rect.top) / rect.height - 0.5;
          gsap.to(card, {
            rotateY: x * 8, rotateX: -y * 6, scale: 1.02,
            duration: 0.5, ease: 'power3.out', transformPerspective: 1000,
          });
          raf = null;
        });
      };
      const handleLeave = () => {
        if (raf) { cancelAnimationFrame(raf); raf = null; }
        gsap.to(card, { rotateY: 0, rotateX: 0, scale: 1, duration: 0.6, ease: 'power3.out' });
      };
      card.addEventListener('mousemove', handleMove);
      card.addEventListener('mouseleave', handleLeave);
      handlers.push({ card, handleMove, handleLeave });
    });

    return () => handlers.forEach(({ card, handleMove, handleLeave }) => {
      card.removeEventListener('mousemove', handleMove);
      card.removeEventListener('mouseleave', handleLeave);
    });
  }, [filtered]);

  // ===== DETAIL PANEL OPEN =====
  const openDetail = useCallback((dest) => {
    setSelectedDest(dest);
    requestAnimationFrame(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power4.out' } });
      tl.fromTo('.dest-detail-panel', { xPercent: 100, opacity: 0 }, { xPercent: 0, opacity: 1, duration: 0.55 })
        .fromTo('.dest-detail-img-wrap', { opacity: 0, scale: 1.1 }, { opacity: 1, scale: 1, duration: 0.5 }, '-=0.3')
        .fromTo('.dest-detail-info > *', { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.4, stagger: 0.06 }, '-=0.3')
        .fromTo('.dest-highlight-tag', { opacity: 0, scale: 0.8, y: 10 }, { opacity: 1, scale: 1, y: 0, duration: 0.35, stagger: 0.05, ease: 'back.out(1.5)' }, '-=0.2');
    });
  }, []);

  const closeDetail = useCallback(() => {
    const tl = gsap.timeline({
      defaults: { ease: 'power3.in' },
      onComplete: () => setSelectedDest(null),
    });
    tl.to('.dest-detail-info > *', { opacity: 0, y: 10, duration: 0.2, stagger: 0.02 })
      .to('.dest-detail-panel', { xPercent: 100, opacity: 0, duration: 0.4 }, '-=0.1')
      .to('.dest-detail-overlay', { opacity: 0, duration: 0.3 }, '-=0.3');
  }, []);

  const displayCurrencies = showAllCurrencies ? currencies : currencies.filter(c => popularCurrencies.includes(c.code));

  return (
    <div className="dest-page" ref={pageRef}>

      {/* ===== HERO ===== */}
      <section className="dest-hero">
        <div className="dest-hero-bg">
          <div className="dest-hero-orb dest-hero-orb-1" />
          <div className="dest-hero-orb dest-hero-orb-2" />
        </div>
        <div className="dest-hero-overlay" />
        <div className="container" style={{ position: 'relative', zIndex: 2 }}>
          <span className="dest-hero-badge">🌍 Explore the World</span>
          <h1 className="dest-hero-title">
            Discover Your Next<br />
            <span className="dest-hero-highlight">Dream Destination</span>
          </h1>
          <p className="dest-hero-sub">
            Handpicked destinations with real-time pricing in your preferred currency — plan smarter, travel better.
          </p>
          <div className="dest-hero-stats">
            <div className="dest-hero-stat">
              <span className="dest-hero-stat-value">12</span>
              <span className="dest-hero-stat-label">Destinations</span>
            </div>
            <div className="dest-hero-stat">
              <span className="dest-hero-stat-value">6</span>
              <span className="dest-hero-stat-label">Continents</span>
            </div>
            <div className="dest-hero-stat">
              <span className="dest-hero-stat-value">130+</span>
              <span className="dest-hero-stat-label">Currencies</span>
            </div>
            <div className="dest-hero-stat">
              <span className="dest-hero-stat-value">{tourSports.length}</span>
              <span className="dest-hero-stat-label">Tour Sports</span>
            </div>
          </div>
        </div>

        {/* ===== SPORTS MARQUEE ===== */}
        <div className="sports-marquee-wrapper">
          {(() => {
            const totalRows = 4;
            const perRow = Math.ceil(tourSports.length / totalRows);
            return Array.from({ length: totalRows }, (_, rowIdx) => {
              const items = tourSports.slice(rowIdx * perRow, (rowIdx + 1) * perRow);
              const doubled = [...items, ...items];
              return (
                <div
                  className={`sports-marquee-row sports-marquee-row-${rowIdx}`}
                  key={rowIdx}
                >
                  <div className={`sports-marquee-track ${rowIdx % 2 === 0 ? 'scroll-left' : 'scroll-right'}`}>
                    {doubled.map((sport, i) => (
                      <span className="sports-tag" key={`${rowIdx}-${i}`}>
                        <span className="sports-tag-emoji">{sport.emoji}</span>
                        {sport.name}
                      </span>
                    ))}
                  </div>
                </div>
              );
            });
          })()}
        </div>
      </section>

      {/* ===== CONTROLS ===== */}
      <section className="section dest-controls-section">
        <div className="container">

          {/* Currency Selector */}
          <div className="dest-currency-bar">
            <div className="dest-currency-label">
              <span className="dest-currency-flag">{currencyInfo.flag}</span>
              <span>Showing prices in <strong>{currencyInfo.code}</strong> ({currencyInfo.symbol})</span>
            </div>
            <div className="dest-currency-picker">
              {displayCurrencies.map(c => (
                <button
                  key={c.code}
                  className={`dest-curr-btn ${selectedCurrency === c.code ? 'active' : ''}`}
                  onClick={() => setSelectedCurrency(c.code)}
                  title={`${c.name} (${c.symbol})`}
                >
                  <span className="dest-curr-flag">{c.flag}</span>
                  <span className="dest-curr-code">{c.code}</span>
                </button>
              ))}
              <button
                className="dest-curr-toggle"
                onClick={() => setShowAllCurrencies(!showAllCurrencies)}
              >
                {showAllCurrencies ? 'Show Less ▲' : `All ${currencies.length} ▼`}
              </button>
            </div>
          </div>

          {/* Search + Filters */}
          <div className="dest-filter-bar">
            <div className="dest-search">
              <span className="dest-search-icon">🔍</span>
              <input
                type="text"
                placeholder="Search destination or country..."
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>
            <div className="dest-filters">
              {continents.map(c => (
                <button
                  key={c}
                  className={`dest-filter-btn ${activeContinent === c ? 'active' : ''}`}
                  onClick={() => setActiveContinent(c)}
                >
                  {c}
                </button>
              ))}
            </div>
            <select className="dest-sort" value={sortBy} onChange={e => setSortBy(e.target.value)}>
              {sortOptions.map(o => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
          </div>

          <div className="dest-count">
            Showing <strong>{filtered.length}</strong> of <strong>{destinations.length}</strong> destinations
          </div>
        </div>
      </section>

      {/* ===== DESTINATION GRID ===== */}
      <section className="section" style={{ paddingTop: 0 }}>
        <div className="container">
          {filtered.length > 0 ? (
            <div className="dest-grid-new" ref={gridRef}>
              {filtered.map((dest, i) => (
                <div className="dest-card-new" key={dest.id} onClick={() => openDetail(dest)}>
                  <div className="dest-card-img-wrap">
                    <img
                      src={dest.image}
                      alt={dest.name}
                      className="dest-card-img-new"
                      loading="lazy"
                    />
                    <div className="dest-card-img-overlay" />
                    <span className="dest-card-continent">{dest.continent}</span>
                    <div className="dest-card-price-badge">
                      <span className="dest-card-price-symbol">{currencyInfo.symbol}</span>
                      <span className="dest-card-price-amount">{convertPrice(dest.priceUSD)}</span>
                    </div>
                  </div>
                  <div className="dest-card-body">
                    <div className="dest-card-top-row">
                      <div>
                        <h3 className="dest-card-name-new">
                          {dest.flag} {dest.name}
                        </h3>
                        <p className="dest-card-country-new">{dest.country}</p>
                      </div>
                      <div className="dest-card-rating">
                        <span className="dest-card-star">★</span>
                        <span>{dest.rating}</span>
                      </div>
                    </div>
                    <p className="dest-card-desc">{dest.description}</p>
                    <div className="dest-card-meta">
                      <span className="dest-card-meta-item">🕐 {dest.duration}</span>
                      <span className="dest-card-meta-item">💬 {dest.reviews.toLocaleString()} reviews</span>
                    </div>
                    <div className="dest-card-tags">
                      {dest.highlights.slice(0, 3).map((h, j) => (
                        <span key={j} className="dest-card-tag">{h}</span>
                      ))}
                    </div>
                    <div className="dest-card-footer">
                      <span className="dest-card-best">{dest.bestFor}</span>
                      <span className="dest-card-view">View Details →</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="dest-no-results">
              <div className="dest-no-results-icon">🌎</div>
              <h3>No destinations found</h3>
              <p>Try adjusting your search or changing the continent filter.</p>
            </div>
          )}
        </div>
      </section>

      {/* ===== DETAIL PANEL ===== */}
      <div
        className={`dest-detail-overlay ${selectedDest ? 'open' : ''}`}
        onClick={closeDetail}
      />
      <div className={`dest-detail-panel ${selectedDest ? 'open' : ''}`}>
        {selectedDest && (
          <>
            <div className="dest-detail-img-wrap">
              <img src={selectedDest.image} alt={selectedDest.name} className="dest-detail-img" />
              <div className="dest-detail-img-gradient" />
              <button className="dest-detail-close" onClick={closeDetail}>✕</button>
              <div className="dest-detail-img-info">
                <span className="dest-detail-continent-badge">{selectedDest.continent}</span>
                <h2 className="dest-detail-name">{selectedDest.flag} {selectedDest.name}</h2>
                <p className="dest-detail-country">{selectedDest.country}</p>
              </div>
            </div>
            <div className="dest-detail-info">
              {/* Price in selected currency */}
              <div className="dest-detail-price-box">
                <div className="dest-detail-price-label">Starting from</div>
                <div className="dest-detail-price-value">
                  {currencyInfo.symbol} {convertPrice(selectedDest.priceUSD)}
                </div>
                <div className="dest-detail-price-currency">
                  {currencyInfo.flag} {currencyInfo.name} ({currencyInfo.code})
                </div>
                {/* Quick price in other currencies */}
                <div className="dest-detail-price-others">
                  {['USD', 'EUR', 'GBP', 'JPY', 'INR'].filter(c => c !== selectedCurrency).slice(0, 3).map(code => {
                    const c = currencies.find(cur => cur.code === code);
                    if (!c) return null;
                    const val = selectedDest.priceUSD * c.rate;
                    return (
                      <span key={code} className="dest-detail-alt-price" onClick={() => setSelectedCurrency(code)}>
                        {c.flag} {c.symbol}{val >= 1000 ? Math.round(val).toLocaleString() : val.toFixed(2)}
                      </span>
                    );
                  })}
                </div>
              </div>

              {/* Stats row */}
              <div className="dest-detail-stats">
                <div className="dest-detail-stat-item">
                  <span className="dest-detail-stat-icon">★</span>
                  <span className="dest-detail-stat-val">{selectedDest.rating}</span>
                  <span className="dest-detail-stat-lbl">Rating</span>
                </div>
                <div className="dest-detail-stat-item">
                  <span className="dest-detail-stat-icon">💬</span>
                  <span className="dest-detail-stat-val">{selectedDest.reviews.toLocaleString()}</span>
                  <span className="dest-detail-stat-lbl">Reviews</span>
                </div>
                <div className="dest-detail-stat-item">
                  <span className="dest-detail-stat-icon">🕐</span>
                  <span className="dest-detail-stat-val">{selectedDest.duration}</span>
                  <span className="dest-detail-stat-lbl">Duration</span>
                </div>
              </div>

              {/* Description */}
              <div className="dest-detail-section">
                <h4 className="dest-detail-section-title">About</h4>
                <p className="dest-detail-section-text">{selectedDest.description}</p>
              </div>

              {/* Best for */}
              <div className="dest-detail-section">
                <h4 className="dest-detail-section-title">Best For</h4>
                <span className="dest-detail-best-badge">{selectedDest.bestFor}</span>
              </div>

              {/* Highlights */}
              <div className="dest-detail-section">
                <h4 className="dest-detail-section-title">Highlights</h4>
                <div className="dest-detail-highlights">
                  {selectedDest.highlights.map((h, j) => (
                    <span key={j} className="dest-highlight-tag">📍 {h}</span>
                  ))}
                </div>
              </div>

              {/* Price breakdown in multiple currencies */}
              <div className="dest-detail-section">
                <h4 className="dest-detail-section-title">Price in Popular Currencies</h4>
                <div className="dest-detail-price-grid">
                  {popularCurrencies.slice(0, 8).map(code => {
                    const c = currencies.find(cur => cur.code === code);
                    if (!c) return null;
                    const val = selectedDest.priceUSD * c.rate;
                    const isActive = code === selectedCurrency;
                    return (
                      <div
                        key={code}
                        className={`dest-detail-price-cell ${isActive ? 'active' : ''}`}
                        onClick={() => setSelectedCurrency(code)}
                      >
                        <span className="dest-price-cell-flag">{c.flag}</span>
                        <span className="dest-price-cell-code">{c.code}</span>
                        <span className="dest-price-cell-val">
                          {c.symbol}{val >= 1000 ? Math.round(val).toLocaleString() : val.toFixed(2)}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      <Footer />
    </div>
  );
}

