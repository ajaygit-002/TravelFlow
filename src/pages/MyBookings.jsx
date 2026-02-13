import { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useBookingAuth } from '../context/BookingAuthContext';
import Footer from '../components/Footer';
import { animateNavbar } from '../animations/gsapAnimations';
import '../styles/my-bookings.css';

gsap.registerPlugin(ScrollTrigger);

// AI typing simulation
function useTypewriter(text, speed = 40, startDelay = 600) {
  const [display, setDisplay] = useState('');
  const [done, setDone] = useState(false);
  useEffect(() => {
    setDisplay('');
    setDone(false);
    let i = 0;
    const timeout = setTimeout(() => {
      const interval = setInterval(() => {
        i++;
        setDisplay(text.slice(0, i));
        if (i >= text.length) { clearInterval(interval); setDone(true); }
      }, speed);
      return () => clearInterval(interval);
    }, startDelay);
    return () => clearTimeout(timeout);
  }, [text, speed, startDelay]);
  return { display, done };
}

export default function MyBookings() {
  const {
    authUser, isAuthenticated, authenticateByEmail, authenticate,
    logout, getMyBookings, modifyBooking, cancelBooking,
  } = useBookingAuth();
  const navigate = useNavigate();

  // Auth form state
  const [authMode, setAuthMode] = useState('email');
  const [authEmail, setAuthEmail] = useState('');
  const [authBookingId, setAuthBookingId] = useState('');
  const [authPin, setAuthPin] = useState('');
  const [authError, setAuthError] = useState('');
  const [authLoading, setAuthLoading] = useState(false);

  // Bookings state
  const [filter, setFilter] = useState('all');
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [showModify, setShowModify] = useState(false);
  const [modifyForm, setModifyForm] = useState({ date: '', phone: '' });
  const [showCancel, setShowCancel] = useState(false);
  const [actionDone, setActionDone] = useState('');

  const pageRef = useRef(null);
  const heroTl = useRef(null);
  const authTl = useRef(null);
  const dashTl = useRef(null);

  // AI typewriter
  const heroText = isAuthenticated
    ? `Welcome back, ${authUser?.name?.split(' ')[0] || 'Traveler'}. Your journeys await.`
    : 'Secure portal to your flight bookings.';
  const { display: typedHero, done: typingDone } = useTypewriter(heroText, 35, 800);

  useEffect(() => {
    const cleanup = animateNavbar();
    return () => { if (cleanup) cleanup(); };
  }, []);

  // ===== HERO ENTRANCE — efficient GSAP timeline =====
  useEffect(() => {
    const ctx = gsap.context(() => {
      heroTl.current = gsap.timeline({ defaults: { ease: 'power4.out', duration: 0.7 } });

      heroTl.current
        // Background orbs float in
        .fromTo('.mb-orb', { scale: 0, opacity: 0 }, { scale: 1, opacity: 1, stagger: { each: 0.15, from: 'random' }, duration: 1 })
        // Grid lines draw
        .fromTo('.mb-grid-line', { scaleX: 0, transformOrigin: 'left center' }, { scaleX: 1, stagger: 0.08, duration: 0.5 }, '-=0.6')
        // AI badge pops
        .fromTo('.mb-ai-badge', { scale: 0, rotation: -15 }, { scale: 1, rotation: 0, ease: 'back.out(2)' }, '-=0.3')
        // Title reveals word by word
        .fromTo('.mb-hero-word', { y: 60, opacity: 0, rotationX: -40 }, { y: 0, opacity: 1, rotationX: 0, stagger: 0.06 }, '-=0.4')
        // Subtitle fades in
        .fromTo('.mb-hero-sub', { y: 20, opacity: 0, filter: 'blur(8px)' }, { y: 0, opacity: 1, filter: 'blur(0px)' }, '-=0.2')
        // Pulse ring
        .fromTo('.mb-pulse-ring', { scale: 0.5, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.5, ease: 'elastic.out(1, 0.4)' }, '-=0.3');

      // Floating orbs continuous animation
      gsap.utils.toArray('.mb-orb').forEach((orb, i) => {
        gsap.to(orb, {
          y: `random(-20, 20)`, x: `random(-15, 15)`,
          duration: 3 + i * 0.5, repeat: -1, yoyo: true, ease: 'sine.inOut',
        });
      });

      // Particle drift
      gsap.utils.toArray('.mb-particle').forEach((p, i) => {
        gsap.fromTo(p,
          { y: 100, opacity: 0 },
          { y: -100, opacity: 0.6, duration: 4 + i * 1.2, repeat: -1, delay: i * 0.8, ease: 'none' }
        );
      });
    }, pageRef);

    return () => ctx.revert();
  }, []);

  // ===== AUTH GATE ANIMATIONS =====
  useEffect(() => {
    if (isAuthenticated) return;
    const ctx = gsap.context(() => {
      authTl.current = gsap.timeline({ defaults: { ease: 'power3.out' }, delay: 0.8 });

      authTl.current
        .fromTo('.mb-auth-card', { y: 50, opacity: 0, scale: 0.95 }, { y: 0, opacity: 1, scale: 1, duration: 0.6 })
        .fromTo('.mb-auth-icon', { scale: 0, rotation: -180 }, { scale: 1, rotation: 0, ease: 'back.out(2)', duration: 0.5 }, '-=0.2')
        .fromTo('.mb-auth-title', { y: 20, opacity: 0 }, { y: 0, opacity: 1 }, '-=0.2')
        .fromTo('.mb-auth-sub', { y: 15, opacity: 0 }, { y: 0, opacity: 1, duration: 0.4 }, '-=0.15')
        .fromTo('.mb-auth-tab', { y: 15, opacity: 0, scale: 0.9 }, { y: 0, opacity: 1, scale: 1, stagger: 0.1, duration: 0.4 }, '-=0.15')
        .fromTo('.mb-auth-form', { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5 }, '-=0.1')
        .fromTo('.mb-auth-help', { y: 10, opacity: 0 }, { y: 0, opacity: 1, duration: 0.4 }, '-=0.1');

      // Info cards stagger with scroll trigger
      gsap.fromTo('.mb-info-card', { y: 40, opacity: 0, scale: 0.9 }, {
        y: 0, opacity: 1, scale: 1, stagger: 0.15, duration: 0.6, ease: 'back.out(1.4)',
        scrollTrigger: { trigger: '.mb-auth-info', start: 'top 85%', toggleActions: 'play none none none' },
      });

      // Demo credentials section
      gsap.fromTo('.mb-demo-section', { y: 30, opacity: 0 }, {
        y: 0, opacity: 1, duration: 0.6,
        scrollTrigger: { trigger: '.mb-demo-section', start: 'top 85%', toggleActions: 'play none none none' },
      });
    }, pageRef);

    return () => ctx.revert();
  }, [isAuthenticated]);

  // ===== DASHBOARD ANIMATIONS =====
  useEffect(() => {
    if (!isAuthenticated) return;
    const ctx = gsap.context(() => {
      dashTl.current = gsap.timeline({ defaults: { ease: 'power3.out' }, delay: 0.4 });

      dashTl.current
        .fromTo('.mb-welcome-strip', { y: -20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5 })
        .fromTo('.mb-stat-card', { y: 30, opacity: 0, scale: 0.92 }, { y: 0, opacity: 1, scale: 1, stagger: 0.1, duration: 0.5 }, '-=0.2')
        .fromTo('.mb-filter-btn', { y: 15, opacity: 0 }, { y: 0, opacity: 1, stagger: 0.08, duration: 0.4 }, '-=0.2');

      // Booking cards stagger on scroll
      ScrollTrigger.batch('.mb-booking-card', {
        start: 'top 88%',
        onEnter: (batch) => gsap.fromTo(batch, { y: 40, opacity: 0, scale: 0.96 }, { y: 0, opacity: 1, scale: 1, stagger: 0.12, duration: 0.5, ease: 'back.out(1.2)' }),
        once: true,
      });
    }, pageRef);

    return () => ctx.revert();
  }, [isAuthenticated]);

  const myBookings = useMemo(() => {
    if (!isAuthenticated) return [];
    const all = getMyBookings();
    if (filter === 'all') return all;
    return all.filter((b) => b.status === filter);
  }, [isAuthenticated, getMyBookings, filter]);

  // Stats
  const stats = useMemo(() => {
    if (!isAuthenticated) return {};
    const all = getMyBookings();
    return {
      total: all.length,
      confirmed: all.filter(b => b.status === 'confirmed').length,
      modified: all.filter(b => b.status === 'modified').length,
      cancelled: all.filter(b => b.status === 'cancelled').length,
    };
  }, [isAuthenticated, getMyBookings]);

  // Auth handlers
  const handleEmailAuth = (e) => {
    e.preventDefault();
    setAuthError('');
    setAuthLoading(true);
    setTimeout(() => {
      const result = authenticateByEmail(authEmail);
      setAuthLoading(false);
      if (!result.success) setAuthError('No bookings found for this email address.');
    }, 800);
  };

  const handleBookingAuth = (e) => {
    e.preventDefault();
    setAuthError('');
    setAuthLoading(true);
    setTimeout(() => {
      const result = authenticate(authEmail, authBookingId, authPin);
      setAuthLoading(false);
      if (!result.success) setAuthError('Invalid credentials. Check your Booking ID, email, and PIN.');
    }, 800);
  };

  const handleModify = (booking) => {
    setSelectedBooking(booking);
    setModifyForm({ date: booking.date || '', phone: booking.phone || '' });
    setShowModify(true);
    setShowCancel(false);
  };

  const submitModify = (e) => {
    e.preventDefault();
    if (!selectedBooking) return;
    const success = modifyBooking(selectedBooking.bookingId, {
      date: modifyForm.date,
      phone: modifyForm.phone,
    });
    if (success) {
      setActionDone(`Booking ${selectedBooking.bookingId} modified successfully!`);
      setShowModify(false);
      setSelectedBooking(null);
      setTimeout(() => setActionDone(''), 4000);
    }
  };

  const handleCancel = (booking) => {
    setSelectedBooking(booking);
    setShowCancel(true);
    setShowModify(false);
  };

  const confirmCancel = () => {
    if (!selectedBooking) return;
    const success = cancelBooking(selectedBooking.bookingId);
    if (success) {
      setActionDone(`Booking ${selectedBooking.bookingId} has been cancelled.`);
      setShowCancel(false);
      setSelectedBooking(null);
      setTimeout(() => setActionDone(''), 4000);
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '—';
    try {
      return new Date(dateStr + 'T00:00:00').toLocaleDateString('en-US', {
        weekday: 'short', day: 'numeric', month: 'short', year: 'numeric',
      });
    } catch { return dateStr; }
  };

  const statusColors = {
    confirmed: { bg: '#dcfce7', color: '#16a34a', label: 'Confirmed', icon: '✅' },
    modified: { bg: '#fef3c7', color: '#d97706', label: 'Modified', icon: '✏️' },
    cancelled: { bg: '#fee2e2', color: '#dc2626', label: 'Cancelled', icon: '❌' },
  };

  const heroWords = (isAuthenticated
    ? `Welcome back, ${authUser?.name?.split(' ')[0] || 'Traveler'}`
    : 'My Bookings'
  ).split(' ');

  return (
    <div className="mb-page" ref={pageRef}>

      {/* ===== IMMERSIVE HERO ===== */}
      <section className="mb-hero">
        <div className="mb-hero-bg">
          {/* Animated orbs */}
          <div className="mb-orb mb-orb-1" />
          <div className="mb-orb mb-orb-2" />
          <div className="mb-orb mb-orb-3" />
          <div className="mb-orb mb-orb-4" />
          {/* Grid lines */}
          <div className="mb-grid-line mb-gl-1" />
          <div className="mb-grid-line mb-gl-2" />
          <div className="mb-grid-line mb-gl-3" />
          {/* Particles */}
          {[...Array(6)].map((_, i) => (
            <div key={i} className="mb-particle" style={{ left: `${12 + i * 15}%` }} />
          ))}
        </div>

        <div className="container">
          <div className="mb-hero-content">
            {/* AI Badge */}
            <div className="mb-ai-badge">
              <span className="mb-ai-dot" />
              <span>AI-Powered Booking Portal</span>
            </div>

            {/* Title — word by word */}
            <h1 className="mb-hero-title">
              {heroWords.map((word, i) => (
                <span key={i} className="mb-hero-word">{word} </span>
              ))}
            </h1>

            {/* AI typing subtitle */}
            <p className="mb-hero-sub mb-typewriter">
              {typedHero}<span className={`mb-cursor ${typingDone ? 'mb-cursor-blink' : ''}`}>|</span>
            </p>

            {/* Pulse ring */}
            <div className="mb-pulse-ring" />

            {/* User card (authenticated) */}
            {isAuthenticated && (
              <div className="mb-hero-user">
                <div className="mb-user-avatar-wrap">
                  <div className="mb-user-avatar">{authUser?.name?.charAt(0)?.toUpperCase() || '?'}</div>
                  <span className="mb-user-status" />
                </div>
                <div className="mb-user-info">
                  <strong>{authUser.name}</strong>
                  <span>{authUser.email}</span>
                </div>
                <button className="mb-logout-btn" onClick={logout}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
                  Sign Out
                </button>
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="mb-main section">
        <div className="container">

          {/* ========================================
              NOT AUTHENTICATED — AI AUTH GATE
              ======================================== */}
          {!isAuthenticated && (
            <div className="mb-auth-gate">
              <div className="mb-auth-card">
                <div className="mb-auth-icon">
                  <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
                    <circle cx="24" cy="24" r="22" stroke="url(#g1)" strokeWidth="2.5" strokeDasharray="4 2"/>
                    <circle cx="24" cy="24" r="14" fill="url(#g2)" opacity="0.15"/>
                    <path d="M24 16v4m0 8v0m-6-6h12" stroke="url(#g1)" strokeWidth="2.5" strokeLinecap="round"/>
                    <circle cx="24" cy="28" r="1.5" fill="#56CCF2"/>
                    <defs>
                      <linearGradient id="g1" x1="0" y1="0" x2="48" y2="48"><stop stopColor="#2F80ED"/><stop offset="1" stopColor="#56CCF2"/></linearGradient>
                      <linearGradient id="g2" x1="10" y1="10" x2="38" y2="38"><stop stopColor="#2F80ED"/><stop offset="1" stopColor="#56CCF2"/></linearGradient>
                    </defs>
                  </svg>
                </div>
                <h2 className="mb-auth-title">Access Your Bookings</h2>
                <p className="mb-auth-sub">Verify your identity to view, modify, or manage your flight tickets securely.</p>

                {/* Auth mode tabs */}
                <div className="mb-auth-tabs">
                  <button
                    className={`mb-auth-tab ${authMode === 'email' ? 'active' : ''}`}
                    onClick={() => { setAuthMode('email'); setAuthError(''); }}
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><rect x="2" y="4" width="20" height="16" rx="2"/><polyline points="22,6 12,13 2,6"/></svg>
                    Email Lookup
                  </button>
                  <button
                    className={`mb-auth-tab ${authMode === 'booking' ? 'active' : ''}`}
                    onClick={() => { setAuthMode('booking'); setAuthError(''); }}
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>
                    Booking + PIN
                  </button>
                </div>

                {/* Email auth */}
                {authMode === 'email' && (
                  <form onSubmit={handleEmailAuth} className="mb-auth-form">
                    <div className="mb-auth-field">
                      <label>Email Address</label>
                      <div className="mb-input-wrap">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><rect x="2" y="4" width="20" height="16" rx="2"/><polyline points="22,6 12,13 2,6"/></svg>
                        <input type="email" placeholder="john@example.com" value={authEmail} onChange={(e) => setAuthEmail(e.target.value)} required />
                      </div>
                    </div>
                    <button type="submit" className="mb-auth-submit" disabled={authLoading}>
                      {authLoading ? (
                        <><span className="mb-spinner" /> Searching...</>
                      ) : (
                        <><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg> Find My Bookings</>
                      )}
                    </button>
                  </form>
                )}

                {/* Booking ID auth */}
                {authMode === 'booking' && (
                  <form onSubmit={handleBookingAuth} className="mb-auth-form">
                    <div className="mb-auth-field">
                      <label>Email Address</label>
                      <div className="mb-input-wrap">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><rect x="2" y="4" width="20" height="16" rx="2"/><polyline points="22,6 12,13 2,6"/></svg>
                        <input type="email" placeholder="john@example.com" value={authEmail} onChange={(e) => setAuthEmail(e.target.value)} required />
                      </div>
                    </div>
                    <div className="mb-auth-row">
                      <div className="mb-auth-field">
                        <label>Booking ID</label>
                        <div className="mb-input-wrap">
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M4 4h16v16H4z"/><path d="M9 9h6M9 13h6M9 17h4"/></svg>
                          <input type="text" placeholder="TF-FL-0001-..." value={authBookingId} onChange={(e) => setAuthBookingId(e.target.value)} required />
                        </div>
                      </div>
                      <div className="mb-auth-field">
                        <label>6-Digit PIN</label>
                        <div className="mb-input-wrap">
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>
                          <input type="text" placeholder="123456" maxLength={6} value={authPin} onChange={(e) => setAuthPin(e.target.value.replace(/\D/g, '').slice(0, 6))} required />
                        </div>
                      </div>
                    </div>
                    <button type="submit" className="mb-auth-submit" disabled={authLoading}>
                      {authLoading ? (
                        <><span className="mb-spinner" /> Verifying...</>
                      ) : (
                        <><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg> Access Booking</>
                      )}
                    </button>
                  </form>
                )}

                {authError && (
                  <div className="mb-auth-error">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                    {authError}
                  </div>
                )}

                <div className="mb-auth-help">
                  <p>Your PIN was provided when you completed your booking.</p>
                  <Link to="/help">Visit Help Center →</Link>
                </div>
              </div>

              {/* Demo credentials */}
              <div className="mb-demo-section">
                <div className="mb-demo-header">
                  <span className="mb-demo-badge">DEMO</span>
                  <h3>Try with demo accounts</h3>
                </div>
                <div className="mb-demo-grid">
                  <button className="mb-demo-card" onClick={() => { setAuthMode('email'); setAuthEmail('demo@travelflow.com'); }}>
                    <div className="mb-demo-avatar">JT</div>
                    <div>
                      <strong>John Traveler</strong>
                      <span>demo@travelflow.com</span>
                      <span className="mb-demo-tag">2 bookings</span>
                    </div>
                  </button>
                  <button className="mb-demo-card" onClick={() => { setAuthMode('email'); setAuthEmail('test@travelflow.com'); }}>
                    <div className="mb-demo-avatar">JE</div>
                    <div>
                      <strong>Jane Explorer</strong>
                      <span>test@travelflow.com</span>
                      <span className="mb-demo-tag">1 booking</span>
                    </div>
                  </button>
                </div>
              </div>

              {/* Info cards */}
              <div className="mb-auth-info">
                {[
                  { icon: '🛡️', title: 'Secure Access', desc: 'End-to-end encrypted. Only the ticket owner can view or modify bookings.' },
                  { icon: '✏️', title: 'Easy Modifications', desc: 'Change your travel date, update contact info, or cancel with a few clicks.' },
                  { icon: '🎫', title: 'Instant Tickets', desc: 'Access and reprint your boarding passes anytime, anywhere.' },
                  { icon: '🤖', title: 'AI-Powered', desc: 'Smart booking management with intelligent suggestions and quick actions.' },
                ].map((item, i) => (
                  <div className="mb-info-card" key={i}>
                    <span className="mb-info-icon">{item.icon}</span>
                    <h4>{item.title}</h4>
                    <p>{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ========================================
              AUTHENTICATED — DASHBOARD
              ======================================== */}
          {isAuthenticated && (
            <div className="mb-dashboard">

              {/* Toast */}
              {actionDone && (
                <div className="mb-toast">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2.5" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><path d="M8 12l3 3 5-6"/></svg>
                  {actionDone}
                </div>
              )}

              {/* Welcome strip */}
              <div className="mb-welcome-strip">
                <div className="mb-ws-left">
                  <h2>Your Travel Dashboard</h2>
                  <p>Manage all your flight bookings in one place</p>
                </div>
                <Link to="/flights" className="mb-ws-cta">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                  Book New Flight
                </Link>
              </div>

              {/* Stats cards */}
              <div className="mb-stats-row">
                {[
                  { label: 'Total', value: stats.total, color: '#2F80ED', icon: '📋' },
                  { label: 'Confirmed', value: stats.confirmed, color: '#16a34a', icon: '✅' },
                  { label: 'Modified', value: stats.modified, color: '#d97706', icon: '✏️' },
                  { label: 'Cancelled', value: stats.cancelled, color: '#dc2626', icon: '❌' },
                ].map((s, i) => (
                  <div className="mb-stat-card" key={i} style={{ '--stat-color': s.color }}>
                    <span className="mb-stat-icon">{s.icon}</span>
                    <div className="mb-stat-num">{s.value}</div>
                    <div className="mb-stat-label">{s.label}</div>
                  </div>
                ))}
              </div>

              {/* Filters */}
              <div className="mb-filters">
                {[
                  { key: 'all', label: 'All Bookings', icon: '📋' },
                  { key: 'confirmed', label: 'Confirmed', icon: '✅' },
                  { key: 'modified', label: 'Modified', icon: '✏️' },
                  { key: 'cancelled', label: 'Cancelled', icon: '❌' },
                ].map((f) => (
                  <button
                    key={f.key}
                    className={`mb-filter-btn ${filter === f.key ? 'active' : ''}`}
                    onClick={() => setFilter(f.key)}
                  >
                    <span>{f.icon}</span> {f.label}
                    {f.key === 'all' && <span className="mb-filter-count">{getMyBookings().length}</span>}
                  </button>
                ))}
              </div>

              {/* Empty state */}
              {myBookings.length === 0 && (
                <div className="mb-empty">
                  <div className="mb-empty-icon">✈️</div>
                  <h3>{filter === 'all' ? 'No Bookings Yet' : `No ${filter} bookings`}</h3>
                  <p>
                    {filter === 'all' ? 'Start your journey by booking a flight!' : 'Try a different filter to find your bookings.'}
                  </p>
                  <Link to="/flights" className="mb-empty-btn">Browse Flights →</Link>
                </div>
              )}

              {/* Bookings list */}
              <div className="mb-booking-list">
                {myBookings.map((booking) => {
                  const st = statusColors[booking.status] || statusColors.confirmed;
                  return (
                    <div className={`mb-booking-card ${booking.status === 'cancelled' ? 'mb-booking-cancelled' : ''}`} key={booking.bookingId}>
                      <div className="mb-bcard-header">
                        <div className="mb-bcard-airline">
                          <span className="mb-bcard-logo">{booking.airlineLogo || '✈️'}</span>
                          <div>
                            <strong>{booking.airline}</strong>
                            <span className="mb-bcard-fnum">{booking.flightNumber}</span>
                          </div>
                        </div>
                        <div className="mb-bcard-status" style={{ background: st.bg, color: st.color }}>
                          {st.icon} {st.label}
                        </div>
                      </div>

                      <div className="mb-bcard-route">
                        <div className="mb-bcard-pt">
                          <span className="mb-bcard-code">{booking.originCode}</span>
                          <span className="mb-bcard-city">{booking.originCity}</span>
                          <span className="mb-bcard-time">{booking.departure}</span>
                        </div>
                        <div className="mb-bcard-mid">
                          <span className="mb-bcard-duration">{booking.duration}</span>
                          <div className="mb-bcard-line">
                            <span className="mb-bcard-dot" />
                            <span className="mb-bcard-track" />
                            <span className="mb-bcard-plane">✈</span>
                            <span className="mb-bcard-track" />
                            <span className="mb-bcard-dot" />
                          </div>
                        </div>
                        <div className="mb-bcard-pt">
                          <span className="mb-bcard-code">{booking.destCode}</span>
                          <span className="mb-bcard-city">{booking.destCity}</span>
                          <span className="mb-bcard-time">{booking.arrival}</span>
                        </div>
                      </div>

                      <div className="mb-bcard-strip">
                        <div className="mb-bcard-info"><span>📅 Date</span><strong>{formatDate(booking.date)}</strong></div>
                        <div className="mb-bcard-info"><span>💺 Seats</span><strong>{booking.seats}</strong></div>
                        <div className="mb-bcard-info"><span>🎫 Class</span><strong>{booking.cabinClass}</strong></div>
                        <div className="mb-bcard-info"><span>👥 Pax</span><strong>{booking.passengers}</strong></div>
                        <div className="mb-bcard-info mb-bcard-price"><span>💰 Total</span><strong>{booking.totalPaid}</strong></div>
                      </div>

                      <div className="mb-bcard-id-row">
                        <span>Booking: <strong>{booking.bookingId}</strong></span>
                        <span>PIN: <strong>{booking.pin}</strong></span>
                      </div>

                      {booking.status !== 'cancelled' && (
                        <div className="mb-bcard-actions">
                          {booking.ticketUrl && (
                            <a href={booking.ticketUrl} target="_blank" rel="noopener noreferrer" className="mb-action-btn mb-action-view">🎫 View Ticket</a>
                          )}
                          <button className="mb-action-btn mb-action-modify" onClick={() => handleModify(booking)}>✏️ Modify</button>
                          <button className="mb-action-btn mb-action-cancel" onClick={() => handleCancel(booking)}>❌ Cancel</button>
                        </div>
                      )}

                      {booking.status === 'cancelled' && (
                        <div className="mb-bcard-cancelled-note">This booking was cancelled on {new Date(booking.cancelledAt).toLocaleDateString()}.</div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* ===== MODIFY MODAL ===== */}
              {showModify && selectedBooking && (
                <div className="mb-modal-overlay" onClick={() => setShowModify(false)}>
                  <div className="mb-modal" onClick={(e) => e.stopPropagation()}>
                    <button className="mb-modal-close" onClick={() => setShowModify(false)}>×</button>
                    <div className="mb-modal-icon">✏️</div>
                    <h3>Modify Booking</h3>
                    <p className="mb-modal-sub">Update details for <strong>{selectedBooking.bookingId}</strong></p>
                    <form onSubmit={submitModify} className="mb-modal-form">
                      <div className="mb-modal-field">
                        <label>Travel Date</label>
                        <input type="date" value={modifyForm.date} onChange={(e) => setModifyForm({ ...modifyForm, date: e.target.value })} min={new Date().toISOString().split('T')[0]} required />
                      </div>
                      <div className="mb-modal-field">
                        <label>Phone Number</label>
                        <input type="tel" placeholder="+1 234 567 8901" value={modifyForm.phone} onChange={(e) => setModifyForm({ ...modifyForm, phone: e.target.value })} required />
                      </div>
                      <div className="mb-modal-actions">
                        <button type="button" className="mb-modal-cancel" onClick={() => setShowModify(false)}>Cancel</button>
                        <button type="submit" className="mb-modal-submit">Save Changes</button>
                      </div>
                    </form>
                  </div>
                </div>
              )}

              {/* ===== CANCEL MODAL ===== */}
              {showCancel && selectedBooking && (
                <div className="mb-modal-overlay" onClick={() => setShowCancel(false)}>
                  <div className="mb-modal mb-modal-danger" onClick={(e) => e.stopPropagation()}>
                    <button className="mb-modal-close" onClick={() => setShowCancel(false)}>×</button>
                    <div className="mb-modal-icon">⚠️</div>
                    <h3>Cancel Booking?</h3>
                    <p className="mb-modal-sub">
                      Are you sure you want to cancel <strong>{selectedBooking.bookingId}</strong>?<br />
                      {selectedBooking.airline} — {selectedBooking.originCode} → {selectedBooking.destCode}
                    </p>
                    <p className="mb-modal-warn">This action cannot be undone. Refund will be processed per our policy.</p>
                    <div className="mb-modal-actions">
                      <button className="mb-modal-cancel" onClick={() => setShowCancel(false)}>Keep Booking</button>
                      <button className="mb-modal-submit mb-modal-submit-danger" onClick={confirmCancel}>Yes, Cancel</button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}
