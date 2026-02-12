import { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { QRCodeSVG } from 'qrcode.react';
import flights, { airlines, cabinClasses } from '../data/flights';
import currencies from '../data/currencies';
import destinations from '../data/destinations';
import PaymentGateway from '../components/PaymentGateway';
import Footer from '../components/Footer';
import { animateNavbar } from '../animations/gsapAnimations';
import '../styles/flight-booking.css';

gsap.registerPlugin(ScrollTrigger);

const GST_RATE = 0.18;

export default function FlightBooking() {
  // Search state
  const [origin, setOrigin] = useState('');
  const [destFilter, setDestFilter] = useState('');
  const [airlineFilter, setAirlineFilter] = useState('');
  const [cabinClass, setCabinClass] = useState('economy');
  const [passengers, setPassengers] = useState(1);
  const [stopsFilter, setStopsFilter] = useState('any');
  const [sortBy, setSortBy] = useState('price');
  const [currency, setCurrency] = useState('USD');

  // Booking state
  const [selectedFlight, setSelectedFlight] = useState(null);
  const [showBooking, setShowBooking] = useState(false);
  const [bookingForm, setBookingForm] = useState({ name: '', email: '', phone: '', date: '' });
  const [bookingStep, setBookingStep] = useState('form'); // 'form' | 'payment' | 'ticket'
  const [bookingId, setBookingId] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('');

  const pageRef = useRef(null);
  const gridRef = useRef(null);
  const heroAnimated = useRef(false);

  // Origins list
  const originCities = useMemo(() => {
    const set = new Set();
    flights.forEach((f) => set.add(f.origin.city));
    return ['', ...Array.from(set).sort()];
  }, []);

  // Destination list
  const destCities = useMemo(() => {
    const set = new Set();
    flights.forEach((f) => set.add(f.destination.city));
    return ['', ...Array.from(set).sort()];
  }, []);

  // Airline list
  const airlineList = useMemo(() => ['', ...airlines.map((a) => a.name).sort()], []);

  // Currency object
  const currObj = useMemo(() => currencies.find((c) => c.code === currency) || currencies[0], [currency]);

  // Cabin multiplier
  const cabinMultiplier = useMemo(() => cabinClasses.find((c) => c.id === cabinClass)?.multiplier || 1, [cabinClass]);

  // Convert USD to selected currency
  const toLocal = useCallback(
    (usd) => {
      const amt = usd * currObj.rate;
      if (amt >= 10000) return Math.round(amt).toLocaleString();
      if (amt >= 100) return amt.toFixed(0);
      return amt.toFixed(2);
    },
    [currObj]
  );

  // Filtered flights
  const filtered = useMemo(() => {
    let result = flights.filter((f) => {
      if (origin && f.origin.city !== origin) return false;
      if (destFilter && f.destination.city !== destFilter) return false;
      if (airlineFilter && f.airline.name !== airlineFilter) return false;
      if (stopsFilter !== 'any' && f.stops !== Number(stopsFilter)) return false;
      if (f.capacity.available < passengers) return false;
      return true;
    });

    result.sort((a, b) => {
      const pa = a.basePriceUSD * cabinMultiplier;
      const pb = b.basePriceUSD * cabinMultiplier;
      switch (sortBy) {
        case 'price': return pa - pb;
        case 'price-desc': return pb - pa;
        case 'duration': return parseInt(a.duration) - parseInt(b.duration);
        case 'rating': return b.airline.rating - a.airline.rating;
        case 'seats': return b.capacity.available - a.capacity.available;
        default: return 0;
      }
    });

    return result;
  }, [origin, destFilter, airlineFilter, stopsFilter, passengers, sortBy, cabinMultiplier]);

  // Nav
  useEffect(() => {
    const cleanup = animateNavbar();
    return () => { if (cleanup) cleanup(); };
  }, []);

  // Hero animation
  useEffect(() => {
    if (heroAnimated.current) return;
    heroAnimated.current = true;

    const tl = gsap.timeline({ defaults: { ease: 'power4.out' } });
    tl.fromTo('.fb-hero', { opacity: 0 }, { opacity: 1, duration: 0.6 })
      .fromTo('.fb-hero .section-title', { opacity: 0, y: 40, clipPath: 'inset(0 0 100% 0)' }, { opacity: 1, y: 0, clipPath: 'inset(0 0 0% 0)', duration: 0.8 }, '-=0.3')
      .fromTo('.fb-hero .section-subtitle', { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.6 }, '-=0.4')
      .fromTo('.fb-search-panel', { opacity: 0, y: 30, scale: 0.97 }, { opacity: 1, y: 0, scale: 1, duration: 0.6 }, '-=0.2')
      .fromTo('.fb-search-field', { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 0.4, stagger: 0.05 }, '-=0.3');
  }, []);

  // Card scroll animations
  useEffect(() => {
    if (!gridRef.current) return;

    ScrollTrigger.getAll()
      .filter((t) => t.vars?.id?.startsWith?.('fb-'))
      .forEach((t) => t.kill());

    const cards = gridRef.current.querySelectorAll('.fb-flight-card');
    if (!cards.length) return;

    gsap.set(cards, {
      opacity: 0, y: 50, scale: 0.93, rotateX: 6,
      transformPerspective: 1000, transformOrigin: 'center bottom',
    });

    ScrollTrigger.batch(cards, {
      id: 'fb-batch',
      start: 'top 90%',
      batchMax: 6,
      onEnter: (batch) => {
        gsap.to(batch, {
          opacity: 1, y: 0, scale: 1, rotateX: 0,
          duration: 0.7, ease: 'power2.out',
          stagger: { each: 0.07, from: 'start' },
          overwrite: 'auto',
        });
      },
    });
  }, [filtered]);

  // Price for a flight
  const getPrice = useCallback((flight) => {
    return flight.basePriceUSD * cabinMultiplier * passengers;
  }, [cabinMultiplier, passengers]);

  // Capacity bar color
  const capacityColor = (flight) => {
    const pct = flight.capacity.available / flight.capacity.total;
    if (pct > 0.4) return '#27AE60';
    if (pct > 0.15) return '#F2994A';
    return '#EB5757';
  };

  // Select flight
  const handleSelectFlight = useCallback((flight) => {
    setSelectedFlight(flight);
    setShowBooking(true);
    setBookingStep('form');
    setBookingId('');
    setPaymentMethod('');
    setBookingForm({ name: '', email: '', phone: '', date: '' });

    requestAnimationFrame(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      const tl = gsap.timeline({ defaults: { ease: 'power4.out' } });
      tl.fromTo('.fb-fullpage', { opacity: 0 }, { opacity: 1, duration: 0.4 })
        .fromTo('.fb-fullpage-header', { y: -60, opacity: 0 }, { y: 0, opacity: 1, duration: 0.4 }, '-=0.2')
        .fromTo('.fb-fullpage-steps-bar', { y: -20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.35 }, '-=0.15')
        .fromTo('.fb-modal-section, .fb-fullpage-form-card', { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.4, stagger: 0.08 }, '-=0.1');
    });
  }, []);

  // Close booking
  const closeBooking = useCallback(() => {
    const tl = gsap.timeline({
      defaults: { ease: 'power3.in' },
      onComplete: () => { setShowBooking(false); setSelectedFlight(null); setBookingStep('form'); },
    });
    tl.to('.fb-fullpage', { opacity: 0, duration: 0.35 });
  }, []);

  // Proceed to payment (form → payment)
  const handleProceedToPayment = (e) => {
    e.preventDefault();
    if (!bookingForm.name || !bookingForm.email || !bookingForm.phone || !bookingForm.date) return;

    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
    tl.to('.fb-fullpage-grid', { opacity: 0, y: -20, duration: 0.3 })
      .call(() => { setBookingStep('payment'); window.scrollTo({ top: 0, behavior: 'smooth' }); })
      .fromTo('.fb-payment-wrap', { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.5 }, '+=0.1');
  };

  // Back from payment to form
  const handleBackToForm = useCallback(() => {
    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
    tl.to('.fb-payment-wrap', { opacity: 0, y: 20, duration: 0.3 })
      .call(() => { setBookingStep('form'); window.scrollTo({ top: 0, behavior: 'smooth' }); })
      .fromTo('.fb-fullpage-grid', { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.4 }, '+=0.1');
  }, []);

  // Payment success → show ticket with QR
  const handlePaymentSuccess = useCallback(() => {
    const id = `TF-${selectedFlight?.id}-${Date.now().toString(36).toUpperCase()}`;
    setBookingId(id);
    setPaymentMethod('Card / UPI');

    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
    tl.to('.fb-payment-wrap', { opacity: 0, scale: 0.95, duration: 0.3 })
      .call(() => setBookingStep('ticket'))
      .fromTo('.fb-eticket-wrap', { opacity: 0, scale: 0.85 }, { opacity: 1, scale: 1, duration: 0.6 }, '+=0.1')
      .fromTo('.fb-eticket-icon', { scale: 0, rotate: -180 }, { scale: 1, rotate: 0, duration: 0.6, ease: 'back.out(1.7)' }, '-=0.3')
      .fromTo('.fb-eticket-qr', { opacity: 0, scale: 0.5 }, { opacity: 1, scale: 1, duration: 0.5, ease: 'back.out(1.5)' }, '-=0.2')
      .fromTo('.fb-confirm-detail', { opacity: 0, x: -15 }, { opacity: 1, x: 0, duration: 0.3, stagger: 0.05 }, '-=0.15');
  }, [selectedFlight]);

  // Price breakdown for selected
  const selectedPrice = selectedFlight ? getPrice(selectedFlight) : 0;
  const selectedGST = selectedPrice * GST_RATE;
  const selectedTotal = selectedPrice + selectedGST;

  // QR code data — encodes a URL that opens a readable ticket page when scanned
  const qrData = useMemo(() => {
    if (!selectedFlight || !bookingId) return '';
    const ticketInfo = {
      bookingId,
      passenger: bookingForm.name,
      email: bookingForm.email,
      phone: bookingForm.phone,
      flight: selectedFlight.flightNumber,
      airline: selectedFlight.airline.name,
      from: `${selectedFlight.origin.code} - ${selectedFlight.origin.city}`,
      to: `${selectedFlight.destination.code} - ${selectedFlight.destination.city}`,
      departure: selectedFlight.departure,
      arrival: selectedFlight.arrival,
      date: bookingForm.date,
      class: cabinClasses.find((c) => c.id === cabinClass)?.name,
      passengers,
      aircraft: selectedFlight.aircraft,
      totalPaid: `${currObj.symbol}${toLocal(selectedTotal)} ${currency}`,
    };
    const encoded = btoa(encodeURIComponent(JSON.stringify(ticketInfo)));
    return `${window.location.origin}/ticket?d=${encoded}`;
  }, [selectedFlight, bookingId, bookingForm, cabinClass, passengers, currObj, toLocal, selectedTotal, currency]);

  return (
    <div className="fb-page" ref={pageRef}>
      {/* ===== HERO ===== */}
      <section className="fb-hero">
        <div className="fb-hero-bg-shapes">
          <div className="fb-shape fb-shape-1" />
          <div className="fb-shape fb-shape-2" />
          <div className="fb-shape fb-shape-3" />
        </div>
        <div className="container">
          <h1 className="section-title" style={{ color: '#fff' }}>✈️ Book Your Flight</h1>
          <p className="section-subtitle" style={{ color: 'rgba(255,255,255,0.75)' }}>
            Search {flights.length}+ flights across {airlines.length} top airlines to {destinations.length} stunning destinations
          </p>
        </div>
      </section>

      {/* ===== SEARCH PANEL ===== */}
      <section className="fb-search section" style={{ paddingTop: '30px' }}>
        <div className="container">
          <div className="fb-search-panel">
            <div className="fb-search-row">
              <div className="fb-search-field">
                <label>From</label>
                <select value={origin} onChange={(e) => setOrigin(e.target.value)}>
                  <option value="">Any Origin</option>
                  {originCities.filter(Boolean).map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
              <div className="fb-search-swap">⇄</div>
              <div className="fb-search-field">
                <label>To</label>
                <select value={destFilter} onChange={(e) => setDestFilter(e.target.value)}>
                  <option value="">Any Destination</option>
                  {destCities.filter(Boolean).map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
              <div className="fb-search-field">
                <label>Airline</label>
                <select value={airlineFilter} onChange={(e) => setAirlineFilter(e.target.value)}>
                  <option value="">All Airlines</option>
                  {airlineList.filter(Boolean).map((a) => (
                    <option key={a} value={a}>{a}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="fb-search-row fb-search-row-2">
              <div className="fb-search-field">
                <label>Class</label>
                <select value={cabinClass} onChange={(e) => setCabinClass(e.target.value)}>
                  {cabinClasses.map((c) => (
                    <option key={c.id} value={c.id}>{c.icon} {c.name}</option>
                  ))}
                </select>
              </div>
              <div className="fb-search-field">
                <label>Passengers</label>
                <select value={passengers} onChange={(e) => setPassengers(Number(e.target.value))}>
                  {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
                    <option key={n} value={n}>{n} {n === 1 ? 'Passenger' : 'Passengers'}</option>
                  ))}
                </select>
              </div>
              <div className="fb-search-field">
                <label>Stops</label>
                <select value={stopsFilter} onChange={(e) => setStopsFilter(e.target.value)}>
                  <option value="any">Any Stops</option>
                  <option value="0">Nonstop</option>
                  <option value="1">1 Stop</option>
                  <option value="2">2 Stops</option>
                </select>
              </div>
              <div className="fb-search-field">
                <label>Currency</label>
                <select value={currency} onChange={(e) => setCurrency(e.target.value)}>
                  {currencies.map((c) => (
                    <option key={c.code} value={c.code}>{c.flag} {c.code} — {c.name}</option>
                  ))}
                </select>
              </div>
              <div className="fb-search-field">
                <label>Sort By</label>
                <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                  <option value="price">Price: Low → High</option>
                  <option value="price-desc">Price: High → Low</option>
                  <option value="duration">Shortest Flight</option>
                  <option value="rating">Airline Rating</option>
                  <option value="seats">Most Seats</option>
                </select>
              </div>
            </div>
          </div>

          {/* Results count */}
          <div className="fb-results-bar">
            <span className="fb-results-count">
              Showing <strong>{filtered.length}</strong> of <strong>{flights.length}</strong> flights
            </span>
            <span className="fb-results-class">
              {cabinClasses.find((c) => c.id === cabinClass)?.icon}{' '}
              {cabinClasses.find((c) => c.id === cabinClass)?.name} · {passengers} pax · {currObj.flag} {currency}
            </span>
          </div>

          {/* ===== FLIGHTS GRID ===== */}
          {filtered.length > 0 ? (
            <div className="fb-flights-grid" ref={gridRef}>
              {filtered.map((flight) => {
                const price = getPrice(flight);
                const pct = ((flight.capacity.available / flight.capacity.total) * 100).toFixed(0);
                return (
                  <div className="fb-flight-card" key={flight.id}>
                    {/* Accent top */}
                    <div className="fb-card-accent" style={{ background: flight.capacity.available < 20 ? 'linear-gradient(135deg, #EB5757, #F2994A)' : 'linear-gradient(135deg, #2F80ED, #56CCF2)' }} />

                    {/* Header */}
                    <div className="fb-card-header">
                      <div className="fb-card-airline">
                        <span className="fb-airline-logo">{flight.airline.logo}</span>
                        <div>
                          <div className="fb-airline-name">{flight.airline.name}</div>
                          <div className="fb-flight-num">{flight.flightNumber} · {flight.aircraft}</div>
                        </div>
                      </div>
                      <div className="fb-airline-rating">⭐ {flight.airline.rating}</div>
                    </div>

                    {/* Route */}
                    <div className="fb-card-route">
                      <div className="fb-route-point">
                        <div className="fb-route-time">{flight.departure}</div>
                        <div className="fb-route-code">{flight.origin.code}</div>
                        <div className="fb-route-city">{flight.origin.city}</div>
                      </div>
                      <div className="fb-route-line">
                        <div className="fb-route-duration">{flight.duration}</div>
                        <div className="fb-route-track">
                          <span className="fb-dot" />
                          <span className="fb-track" />
                          {flight.stops > 0 && <span className="fb-stop-dot" />}
                          {flight.stops > 1 && <span className="fb-stop-dot fb-stop-dot-2" />}
                          <span className="fb-track" />
                          <span className="fb-dot" />
                        </div>
                        <div className="fb-route-stops">
                          {flight.stops === 0 ? 'Nonstop' : `${flight.stops} stop${flight.stops > 1 ? 's' : ''}`}
                        </div>
                      </div>
                      <div className="fb-route-point">
                        <div className="fb-route-time">{flight.arrival}</div>
                        <div className="fb-route-code">{flight.destination.code}</div>
                        <div className="fb-route-city">{flight.destination.flag} {flight.destination.city}</div>
                      </div>
                    </div>

                    {/* Capacity */}
                    <div className="fb-card-capacity">
                      <div className="fb-capacity-info">
                        <span className="fb-capacity-label">
                          {flight.capacity.available < 20
                            ? `🔥 Only ${flight.capacity.available} left!`
                            : `${flight.capacity.available} seats available`}
                        </span>
                        <span className="fb-capacity-pct">{pct}%</span>
                      </div>
                      <div className="fb-capacity-bar">
                        <div
                          className="fb-capacity-fill"
                          style={{
                            width: `${100 - Number(pct)}%`,
                            background: capacityColor(flight),
                          }}
                        />
                      </div>
                    </div>

                    {/* Amenities */}
                    {flight.amenities.length > 0 && (
                      <div className="fb-card-amenities">
                        {flight.amenities.map((a, i) => (
                          <span className="fb-amenity-tag" key={i}>{a}</span>
                        ))}
                      </div>
                    )}

                    {/* Footer: price + book */}
                    <div className="fb-card-footer">
                      <div className="fb-card-price">
                        <div className="fb-price-amount">{currObj.symbol}{toLocal(price)}</div>
                        <div className="fb-price-info">
                          {passengers > 1 ? `${passengers} pax · ` : ''}{cabinClasses.find((c) => c.id === cabinClass)?.name}
                        </div>
                      </div>
                      <button className="fb-book-btn" onClick={() => handleSelectFlight(flight)}>
                        Book Now
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="fb-no-results">
              <div className="fb-no-icon">✈️</div>
              <h3>No flights found</h3>
              <p>Try adjusting your search filters or select a different route.</p>
            </div>
          )}
        </div>
      </section>

      {/* ===== FULL-PAGE BOOKING ===== */}
      {showBooking && selectedFlight && (
        <div className="fb-fullpage">
          <div className="fb-fullpage-header">
            <div className="container fb-fullpage-header-inner">
              <button className="fb-fullpage-back" onClick={closeBooking}>
                ← Back to Flights
              </button>
              <div className="fb-fullpage-title-row">
                <span className="fb-fullpage-airline-logo">{selectedFlight.airline.logo}</span>
                <div>
                  <h2 className="fb-fullpage-title">{selectedFlight.airline.name}</h2>
                  <span className="fb-fullpage-flight-code">{selectedFlight.flightNumber} · {selectedFlight.origin.code} → {selectedFlight.destination.code}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Step indicator */}
          <div className="fb-fullpage-steps-bar">
            <div className="container">
              <div className="fb-steps-indicator">
                <div className={`fb-step-dot ${bookingStep === 'form' ? 'active' : bookingStep !== 'form' ? 'done' : ''}`}>
                  <span>1</span>
                  <label>Details</label>
                </div>
                <div className="fb-step-connector" />
                <div className={`fb-step-dot ${bookingStep === 'payment' ? 'active' : bookingStep === 'ticket' ? 'done' : ''}`}>
                  <span>2</span>
                  <label>Payment</label>
                </div>
                <div className="fb-step-connector" />
                <div className={`fb-step-dot ${bookingStep === 'ticket' ? 'active' : ''}`}>
                  <span>3</span>
                  <label>Ticket</label>
                </div>
              </div>
            </div>
          </div>

          <div className="fb-fullpage-body">
            <div className="container">

              {/* STEP 1: Form */}
              {bookingStep === 'form' && (
                <div className="fb-fullpage-grid">
                  {/* Left side — Flight Info */}
                  <div className="fb-fullpage-left">
                    {/* Flight summary card */}
                    <div className="fb-modal-section fb-modal-flight-summary">
                      <div className="fb-modal-airline-row">
                        <span className="fb-modal-airline-logo">{selectedFlight.airline.logo}</span>
                        <div>
                          <div className="fb-modal-airline-name">{selectedFlight.airline.name}</div>
                          <div className="fb-modal-flight-num">{selectedFlight.flightNumber} · {selectedFlight.aircraft}</div>
                        </div>
                      </div>
                      <div className="fb-modal-route">
                        <div className="fb-modal-route-pt">
                          <strong>{selectedFlight.departure}</strong>
                          <span>{selectedFlight.origin.code} — {selectedFlight.origin.city}</span>
                        </div>
                        <div className="fb-modal-route-arrow">→ {selectedFlight.duration} →</div>
                        <div className="fb-modal-route-pt">
                          <strong>{selectedFlight.arrival}</strong>
                          <span>{selectedFlight.destination.code} — {selectedFlight.destination.flag} {selectedFlight.destination.city}</span>
                        </div>
                      </div>
                      <div className="fb-modal-capacity-info">
                        💺 {selectedFlight.capacity.available} of {selectedFlight.capacity.total} seats available
                      </div>
                    </div>

                    {/* Flight amenities */}
                    <div className="fb-fullpage-amenities-card">
                      <h4>✨ Amenities</h4>
                      <div className="fb-fullpage-amenities-list">
                        {selectedFlight.amenities.map((a, i) => (
                          <span key={i} className="fb-fullpage-amenity">{a}</span>
                        ))}
                      </div>
                    </div>

                    {/* Price breakdown */}
                    <div className="fb-modal-section fb-modal-pricing">
                      <h3>💰 Price Breakdown ({currObj.flag} {currency})</h3>
                      <div className="fb-price-row">
                        <span>Base fare ({cabinClasses.find((c) => c.id === cabinClass)?.name})</span>
                        <span>{currObj.symbol}{toLocal(selectedFlight.basePriceUSD * cabinMultiplier)}</span>
                      </div>
                      <div className="fb-price-row">
                        <span>Passengers</span>
                        <span>× {passengers}</span>
                      </div>
                      <div className="fb-price-row">
                        <span>Subtotal</span>
                        <span>{currObj.symbol}{toLocal(selectedPrice)}</span>
                      </div>
                      <div className="fb-price-row">
                        <span>GST (18%)</span>
                        <span>{currObj.symbol}{toLocal(selectedGST)}</span>
                      </div>
                      <div className="fb-price-row fb-price-total">
                        <span>Total</span>
                        <span>{currObj.symbol}{toLocal(selectedTotal)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Right side — Passenger Form */}
                  <div className="fb-fullpage-right">
                    <div className="fb-fullpage-form-card">
                      <h3>📋 Passenger Details</h3>
                      <form onSubmit={handleProceedToPayment} className="fb-form">
                        <div className="fb-form-row">
                          <div className="fb-form-group">
                            <label>Full Name</label>
                            <input
                              type="text"
                              placeholder="John Doe"
                              value={bookingForm.name}
                              onChange={(e) => setBookingForm({ ...bookingForm, name: e.target.value })}
                              required
                            />
                          </div>
                          <div className="fb-form-group">
                            <label>Email Address</label>
                            <input
                              type="email"
                              placeholder="john@example.com"
                              value={bookingForm.email}
                              onChange={(e) => setBookingForm({ ...bookingForm, email: e.target.value })}
                              required
                            />
                          </div>
                        </div>
                        <div className="fb-form-row">
                          <div className="fb-form-group">
                            <label>Phone Number</label>
                            <input
                              type="tel"
                              placeholder="+1 234 567 8901"
                              value={bookingForm.phone}
                              onChange={(e) => setBookingForm({ ...bookingForm, phone: e.target.value })}
                              required
                            />
                          </div>
                          <div className="fb-form-group">
                            <label>Travel Date</label>
                            <input
                              type="date"
                              value={bookingForm.date}
                              onChange={(e) => setBookingForm({ ...bookingForm, date: e.target.value })}
                              min={new Date().toISOString().split('T')[0]}
                              required
                            />
                          </div>
                        </div>
                        <div className="fb-form-summary-inline">
                          <div><span>Class</span><strong>{cabinClasses.find((c) => c.id === cabinClass)?.name}</strong></div>
                          <div><span>Passengers</span><strong>{passengers}</strong></div>
                          <div><span>Total</span><strong className="fb-total-highlight">{currObj.symbol}{toLocal(selectedTotal)} {currency}</strong></div>
                        </div>
                        <button type="submit" className="fb-confirm-btn">
                          Proceed to Payment →
                        </button>
                      </form>
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 2: Payment */}
              {bookingStep === 'payment' && (
                <div className="fb-fullpage-center">
                  <div className="fb-payment-wrap">
                    <PaymentGateway
                      amount={selectedTotal}
                      gstAmount={selectedGST}
                      basePrice={selectedPrice}
                      destination={{
                        name: selectedFlight.destination.city,
                        flag: selectedFlight.destination.flag,
                        thumb: `https://images.unsplash.com/photo-1436491865332-7a61a109db05?w=400&q=80`,
                        duration: selectedFlight.duration,
                        price: selectedFlight.basePriceUSD * cabinMultiplier,
                      }}
                      travelers={passengers}
                      travelDate={bookingForm.date}
                      customerName={bookingForm.name}
                      customerEmail={bookingForm.email}
                      onSuccess={handlePaymentSuccess}
                      onBack={handleBackToForm}
                    />
                  </div>
                </div>
              )}

              {/* STEP 3: E-Ticket with QR Code */}
              {bookingStep === 'ticket' && (
                <div className="fb-fullpage-center">
                  <div className="fb-eticket-wrap">
                    <div className="fb-eticket-icon">🎉</div>
                    <h2 className="fb-eticket-title">Booking Confirmed!</h2>
                    <p className="fb-eticket-sub">Your e-ticket & QR code are ready. Scan the QR to view your details.</p>

                    {/* E-Ticket Card */}
                    <div className="fb-eticket-card">
                      {/* Ticket header */}
                      <div className="fb-eticket-header">
                        <div className="fb-eticket-airline">
                          <span className="fb-eticket-airline-logo">{selectedFlight.airline.logo}</span>
                          <div>
                            <div className="fb-eticket-airline-name">{selectedFlight.airline.name}</div>
                            <div className="fb-eticket-flight-num">{selectedFlight.flightNumber}</div>
                          </div>
                        </div>
                        <div className="fb-eticket-badge">E-TICKET</div>
                      </div>

                      {/* Route */}
                      <div className="fb-eticket-route">
                        <div className="fb-eticket-pt">
                          <div className="fb-eticket-code">{selectedFlight.origin.code}</div>
                          <div className="fb-eticket-city">{selectedFlight.origin.city}</div>
                          <div className="fb-eticket-time">{selectedFlight.departure}</div>
                        </div>
                        <div className="fb-eticket-plane">
                          <div className="fb-eticket-duration">{selectedFlight.duration}</div>
                          <div className="fb-eticket-plane-line">
                            <span className="fb-eticket-dot" />
                            <span className="fb-eticket-track" />
                            <span className="fb-eticket-plane-icon">✈️</span>
                            <span className="fb-eticket-track" />
                            <span className="fb-eticket-dot" />
                          </div>
                          <div className="fb-eticket-stops-label">
                            {selectedFlight.stops === 0 ? 'Nonstop' : `${selectedFlight.stops} stop${selectedFlight.stops > 1 ? 's' : ''}`}
                          </div>
                        </div>
                        <div className="fb-eticket-pt">
                          <div className="fb-eticket-code">{selectedFlight.destination.code}</div>
                          <div className="fb-eticket-city">{selectedFlight.destination.flag} {selectedFlight.destination.city}</div>
                          <div className="fb-eticket-time">{selectedFlight.arrival}</div>
                        </div>
                      </div>

                      {/* Tear line */}
                      <div className="fb-eticket-tear">
                        <div className="fb-eticket-tear-circle fb-eticket-tear-left" />
                        <div className="fb-eticket-tear-line" />
                        <div className="fb-eticket-tear-circle fb-eticket-tear-right" />
                      </div>

                      {/* Passenger details grid */}
                      <div className="fb-eticket-details">
                        <div className="fb-confirm-detail">
                          <span>Passenger</span>
                          <strong>{bookingForm.name}</strong>
                        </div>
                        <div className="fb-confirm-detail">
                          <span>Email</span>
                          <strong>{bookingForm.email}</strong>
                        </div>
                        <div className="fb-confirm-detail">
                          <span>Phone</span>
                          <strong>{bookingForm.phone}</strong>
                        </div>
                        <div className="fb-confirm-detail">
                          <span>Travel Date</span>
                          <strong>{bookingForm.date}</strong>
                        </div>
                        <div className="fb-confirm-detail">
                          <span>Class</span>
                          <strong>{cabinClasses.find((c) => c.id === cabinClass)?.name}</strong>
                        </div>
                        <div className="fb-confirm-detail">
                          <span>Passengers</span>
                          <strong>{passengers}</strong>
                        </div>
                        <div className="fb-confirm-detail">
                          <span>Aircraft</span>
                          <strong>{selectedFlight.aircraft}</strong>
                        </div>
                        <div className="fb-confirm-detail">
                          <span>Payment</span>
                          <strong>Paid ✓</strong>
                        </div>
                        <div className="fb-confirm-detail fb-confirm-detail-total">
                          <span>Total Paid</span>
                          <strong>{currObj.symbol}{toLocal(selectedTotal)} {currency}</strong>
                        </div>
                        <div className="fb-confirm-detail">
                          <span>Booking ID</span>
                          <strong>{bookingId}</strong>
                        </div>
                      </div>

                      {/* QR Code Section */}
                      <div className="fb-eticket-qr-section">
                        <div className="fb-eticket-qr">
                          <QRCodeSVG
                            value={qrData}
                            size={200}
                            bgColor="#ffffff"
                            fgColor="#0d1b2a"
                            level="M"
                            includeMargin={true}
                          />
                        </div>
                        <p className="fb-eticket-qr-label">Scan QR to view passenger & flight details</p>
                      </div>

                      {/* Barcode */}
                      <div className="fb-eticket-barcode">
                        {'▮'.repeat(45)}
                      </div>
                      <div className="fb-eticket-id">{bookingId}</div>
                    </div>

                    <div className="fb-eticket-actions">
                      <button className="fb-confirm-btn" onClick={closeBooking}>
                        ✈️ Search More Flights
                      </button>
                    </div>
                  </div>
                </div>
              )}

            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
