import { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { gsap } from 'gsap';
import { QRCodeSVG } from 'qrcode.react';
import flights, { cabinClasses } from '../data/flights';
import currencies from '../data/currencies';
import PaymentGateway from '../components/PaymentGateway';
import Footer from '../components/Footer';
import { animateNavbar } from '../animations/gsapAnimations';
import '../styles/flight-details.css';

const GST_RATE = 0.18;

// ===== SEAT MAP GENERATOR =====
function generateSeatMap(flight, cabinClass) {
  const seed = flight.id.split('-').pop();
  let s = parseInt(seed, 10) || 42;
  const rand = () => { s = (s * 9301 + 49297) % 233280; return s / 233280; };

  const configs = {
    economy: { rows: 30, cols: ['A', 'B', 'C', '', 'D', 'E', 'F'], price: flight.basePriceUSD, label: 'Economy' },
    'premium-economy': { rows: 10, cols: ['A', 'B', '', 'C', 'D'], price: flight.basePriceUSD * 1.6, label: 'Premium Economy' },
    business: { rows: 8, cols: ['A', '', 'B', '', 'C'], price: flight.basePriceUSD * 3, label: 'Business' },
    first: { rows: 4, cols: ['A', '', 'B'], price: flight.basePriceUSD * 5.5, label: 'First Class' },
  };

  const config = configs[cabinClass] || configs.economy;
  const sections = [];

  // Generate main cabin
  const rows = [];
  for (let r = 1; r <= config.rows; r++) {
    const seats = config.cols.map((col) => {
      if (col === '') return { type: 'aisle' };
      const seatId = `${r}${col}`;
      const isOccupied = rand() < 0.45; // ~45% occupied
      const isWindow = col === config.cols[0] || col === config.cols[config.cols.length - 1];
      const isExit = r === 1 || r === Math.ceil(config.rows / 2);
      let seatPrice = config.price;
      if (isWindow) seatPrice *= 1.05;
      if (isExit) seatPrice *= 1.12;
      if (r <= 3) seatPrice *= 1.08; // front rows premium

      return {
        type: 'seat',
        id: seatId,
        row: r,
        col,
        status: isOccupied ? 'occupied' : 'available',
        isWindow,
        isExit,
        price: Math.round(seatPrice),
        category: isExit ? 'exit' : (r <= 3 ? 'premium' : 'standard'),
      };
    });
    rows.push({ row: r, seats, isExit: r === 1 || r === Math.ceil(config.rows / 2) });
  }

  sections.push({ name: config.label, rows });
  return { sections, config };
}

export default function FlightDetails() {
  const { flightId } = useParams();
  const navigate = useNavigate();

  // Find the flight
  const flight = useMemo(() => flights.find((f) => f.id === flightId), [flightId]);

  // State
  const [cabinClass, setCabinClass] = useState('economy');
  const [passengers, setPassengers] = useState(1);
  const [currency, setCurrency] = useState('USD');
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [hoveredSeat, setHoveredSeat] = useState(null);
  const [activeStep, setActiveStep] = useState('seats'); // 'seats' | 'details' | 'payment' | 'ticket'
  const [bookingForm, setBookingForm] = useState({ name: '', email: '', phone: '', date: '' });
  const [bookingId, setBookingId] = useState('');
  const [boardingInfo, setBoardingInfo] = useState(null);

  const pageRef = useRef(null);

  // Currency
  const currObj = useMemo(() => currencies.find((c) => c.code === currency) || currencies[0], [currency]);
  const cabinMultiplier = useMemo(() => cabinClasses.find((c) => c.id === cabinClass)?.multiplier || 1, [cabinClass]);

  const toLocal = useCallback((usd) => {
    const amt = usd * currObj.rate;
    if (amt >= 10000) return Math.round(amt).toLocaleString();
    if (amt >= 100) return amt.toFixed(0);
    return amt.toFixed(2);
  }, [currObj]);

  // Seat map
  const seatMap = useMemo(() => {
    if (!flight) return null;
    return generateSeatMap(flight, cabinClass);
  }, [flight, cabinClass]);

  // Nav
  useEffect(() => {
    const cleanup = animateNavbar();
    return () => { if (cleanup) cleanup(); };
  }, []);

  // Entrance animations
  useEffect(() => {
    if (!flight) return;
    const tl = gsap.timeline({ defaults: { ease: 'power4.out' } });
    tl.fromTo('.fd-hero', { opacity: 0 }, { opacity: 1, duration: 0.5 })
      .fromTo('.fd-hero-content', { y: 40, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6 }, '-=0.2')
      .fromTo('.fd-info-card', { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5, stagger: 0.08 }, '-=0.3')
      .fromTo('.fd-step-item', { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.4, stagger: 0.06 }, '-=0.3');
  }, [flight]);

  // Reset seats on class change
  useEffect(() => { setSelectedSeats([]); }, [cabinClass]);

  // Handle seat click
  const toggleSeat = useCallback((seat) => {
    if (seat.status === 'occupied') return;
    setSelectedSeats((prev) => {
      const exists = prev.find((s) => s.id === seat.id);
      if (exists) return prev.filter((s) => s.id !== seat.id);
      if (prev.length >= passengers) {
        // Replace oldest
        return [...prev.slice(1), seat];
      }
      return [...prev, seat];
    });
  }, [passengers]);

  // Pricing
  const seatTotal = useMemo(() => selectedSeats.reduce((sum, s) => sum + s.price, 0), [selectedSeats]);
  const gstAmount = seatTotal * GST_RATE;
  const grandTotal = seatTotal + gstAmount;

  // Step transitions
  const goToDetails = () => {
    if (selectedSeats.length === 0) return;
    gsap.to('.fd-main', { opacity: 0, y: -20, duration: 0.3, onComplete: () => {
      setActiveStep('details');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      gsap.fromTo('.fd-main', { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.4 });
    }});
  };

  const goToPayment = (e) => {
    e.preventDefault();
    if (!bookingForm.name || !bookingForm.email || !bookingForm.phone || !bookingForm.date) return;
    gsap.to('.fd-main', { opacity: 0, y: -20, duration: 0.3, onComplete: () => {
      setActiveStep('payment');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      gsap.fromTo('.fd-main', { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.4 });
    }});
  };

  const goBackToSeats = () => {
    gsap.to('.fd-main', { opacity: 0, y: 20, duration: 0.3, onComplete: () => {
      setActiveStep('seats');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      gsap.fromTo('.fd-main', { opacity: 0, y: -20 }, { opacity: 1, y: 0, duration: 0.4 });
    }});
  };

  const goBackToDetails = () => {
    gsap.to('.fd-main', { opacity: 0, y: 20, duration: 0.3, onComplete: () => {
      setActiveStep('details');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      gsap.fromTo('.fd-main', { opacity: 0, y: -20 }, { opacity: 1, y: 0, duration: 0.4 });
    }});
  };

  const handlePaymentSuccess = useCallback(() => {
    const id = `TF-${flight?.id}-${Date.now().toString(36).toUpperCase()}`;
    setBookingId(id);

    const gates = ['A1','A2','A3','A5','A7','B1','B2','B4','B6','C1','C3','C5','D2','D4','D8'];
    const terminals = ['T1','T2','T3','T4','T5'];

    setBoardingInfo({
      gate: gates[Math.floor(Math.random() * gates.length)],
      terminal: terminals[Math.floor(Math.random() * terminals.length)],
      seat: selectedSeats.map((s) => s.id).join(', '),
      boardingTime: (() => {
        const depHour = parseInt(flight?.departure?.split(':')[0] || '10', 10);
        const bh = depHour > 0 ? depHour - 1 : 23;
        return `${String(bh).padStart(2, '0')}:${String(Math.floor(Math.random() * 4) * 15).padStart(2, '0')}`;
      })(),
      zone: Math.floor(Math.random() * 5) + 1,
      sequence: String(Math.floor(Math.random() * 200) + 1).padStart(3, '0'),
    });

    gsap.to('.fd-main', { opacity: 0, scale: 0.95, duration: 0.3, onComplete: () => {
      setActiveStep('ticket');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      gsap.fromTo('.fd-main', { opacity: 0, scale: 0.9 }, { opacity: 1, scale: 1, duration: 0.5 });
    }});
  }, [flight, selectedSeats]);

  // QR data
  const qrData = useMemo(() => {
    if (!flight || !bookingId) return '';
    const ticketInfo = {
      bookingId,
      passenger: bookingForm.name,
      email: bookingForm.email,
      phone: bookingForm.phone,
      flight: flight.flightNumber,
      airline: flight.airline.name,
      from: `${flight.origin.code} - ${flight.origin.city}`,
      to: `${flight.destination.code} - ${flight.destination.city}`,
      departure: flight.departure,
      arrival: flight.arrival,
      duration: flight.duration,
      date: bookingForm.date,
      class: cabinClasses.find((c) => c.id === cabinClass)?.name,
      seats: selectedSeats.map((s) => s.id).join(', '),
      passengers,
      totalPaid: `${currObj.symbol}${toLocal(grandTotal)} ${currency}`,
      gate: boardingInfo?.gate,
      terminal: boardingInfo?.terminal,
    };
    const encoded = btoa(encodeURIComponent(JSON.stringify(ticketInfo)));
    return `${window.location.origin}/ticket?d=${encoded}`;
  }, [flight, bookingId, bookingForm, cabinClass, passengers, currObj, toLocal, grandTotal, currency, boardingInfo, selectedSeats]);

  // 404
  if (!flight) {
    return (
      <div className="fd-page" ref={pageRef}>
        <div className="fd-not-found">
          <div className="fd-not-found-icon">✈️</div>
          <h2>Flight Not Found</h2>
          <p>The flight you're looking for doesn't exist or has been removed.</p>
          <button className="fd-back-btn" onClick={() => navigate('/flights')}>← Back to Flights</button>
        </div>
        <Footer />
      </div>
    );
  }

  const stepsList = [
    { key: 'seats', num: 1, label: 'Select Seats' },
    { key: 'details', num: 2, label: 'Passenger Info' },
    { key: 'payment', num: 3, label: 'Payment' },
    { key: 'ticket', num: 4, label: 'Ticket' },
  ];

  const currentStepIdx = stepsList.findIndex((s) => s.key === activeStep);

  return (
    <div className="fd-page" ref={pageRef}>
      {/* ===== HERO ===== */}
      <section className="fd-hero">
        <div className="fd-hero-bg">
          <div className="fd-shape fd-shape-1" />
          <div className="fd-shape fd-shape-2" />
          <div className="fd-shape fd-shape-3" />
        </div>
        <div className="container">
          <button className="fd-nav-back" onClick={() => navigate('/flights')}>← Back to Flights</button>
          <div className="fd-hero-content">
            <div className="fd-hero-airline">
              <span className="fd-hero-airline-logo">{flight.airline.logo}</span>
              <div>
                <h1 className="fd-hero-title">{flight.airline.name}</h1>
                <p className="fd-hero-flight-num">{flight.flightNumber} · {flight.aircraft}</p>
              </div>
              <span className="fd-hero-rating">⭐ {flight.airline.rating}</span>
            </div>

            {/* Route display */}
            <div className="fd-hero-route">
              <div className="fd-hero-pt">
                <span className="fd-hero-code">{flight.origin.code}</span>
                <span className="fd-hero-city">{flight.origin.city}</span>
                <span className="fd-hero-time">{flight.departure}</span>
              </div>
              <div className="fd-hero-mid">
                <span className="fd-hero-duration">{flight.duration}</span>
                <div className="fd-hero-line">
                  <span className="fd-hero-dot" />
                  <span className="fd-hero-track" />
                  {flight.stops > 0 && <span className="fd-hero-stop-dot" />}
                  {flight.stops > 1 && <span className="fd-hero-stop-dot" />}
                  <span className="fd-hero-track" />
                  <span className="fd-hero-plane-icon">✈️</span>
                  <span className="fd-hero-track" />
                  <span className="fd-hero-dot" />
                </div>
                <span className="fd-hero-stops">
                  {flight.stops === 0 ? 'Nonstop' : `${flight.stops} stop${flight.stops > 1 ? 's' : ''}`}
                </span>
              </div>
              <div className="fd-hero-pt">
                <span className="fd-hero-code">{flight.destination.code}</span>
                <span className="fd-hero-city">{flight.destination.flag} {flight.destination.city}</span>
                <span className="fd-hero-time">{flight.arrival}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== INFO CARDS ===== */}
      <section className="fd-info section">
        <div className="container">
          <div className="fd-info-grid">
            <div className="fd-info-card">
              <span className="fd-info-icon">💺</span>
              <div>
                <span className="fd-info-label">Available Seats</span>
                <strong>{flight.capacity.available} / {flight.capacity.total}</strong>
              </div>
            </div>
            <div className="fd-info-card">
              <span className="fd-info-icon">🛫</span>
              <div>
                <span className="fd-info-label">Stops</span>
                <strong>{flight.stops === 0 ? 'Nonstop' : `${flight.stops} Stop${flight.stops > 1 ? 's' : ''}`}</strong>
              </div>
            </div>
            <div className="fd-info-card">
              <span className="fd-info-icon">🏢</span>
              <div>
                <span className="fd-info-label">Alliance</span>
                <strong>{flight.airline.alliance}</strong>
              </div>
            </div>
            <div className="fd-info-card">
              <span className="fd-info-icon">🌐</span>
              <div>
                <span className="fd-info-label">From</span>
                <strong>{currObj.symbol}{toLocal(flight.basePriceUSD)}</strong>
              </div>
            </div>
            {flight.amenities.length > 0 && (
              <div className="fd-info-card fd-info-card-wide">
                <span className="fd-info-icon">✨</span>
                <div>
                  <span className="fd-info-label">Amenities</span>
                  <div className="fd-amenity-tags">
                    {flight.amenities.map((a, i) => <span key={i} className="fd-amenity-tag">{a}</span>)}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ===== STEPS INDICATOR ===== */}
      <section className="fd-steps-bar">
        <div className="container">
          <div className="fd-steps">
            {stepsList.map((step, idx) => (
              <div className="fd-step-item" key={step.key}>
                <div className={`fd-step-circle ${idx < currentStepIdx ? 'done' : idx === currentStepIdx ? 'active' : ''}`}>
                  {idx < currentStepIdx ? '✓' : step.num}
                </div>
                <span className={`fd-step-label ${idx === currentStepIdx ? 'active' : idx < currentStepIdx ? 'done' : ''}`}>
                  {step.label}
                </span>
                {idx < stepsList.length - 1 && <div className={`fd-step-line ${idx < currentStepIdx ? 'done' : ''}`} />}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== MAIN CONTENT ===== */}
      <section className="fd-main-section section">
        <div className="container">
          <div className="fd-main">

            {/* ===== STEP 1: SEAT SELECTION ===== */}
            {activeStep === 'seats' && (
              <div className="fd-seats-layout">
                {/* Left: Seat Map */}
                <div className="fd-seatmap-area">
                  <div className="fd-seatmap-header">
                    <h2>Choose Your Seat</h2>
                    <p>Select up to {passengers} seat{passengers > 1 ? 's' : ''} for your journey</p>
                  </div>

                  {/* Controls */}
                  <div className="fd-seatmap-controls">
                    <div className="fd-control-group">
                      <label>Cabin Class</label>
                      <select value={cabinClass} onChange={(e) => setCabinClass(e.target.value)}>
                        {cabinClasses.map((c) => (
                          <option key={c.id} value={c.id}>{c.icon} {c.name}</option>
                        ))}
                      </select>
                    </div>
                    <div className="fd-control-group">
                      <label>Passengers</label>
                      <select value={passengers} onChange={(e) => { setPassengers(Number(e.target.value)); setSelectedSeats([]); }}>
                        {[1, 2, 3, 4, 5, 6].map((n) => (
                          <option key={n} value={n}>{n} Pax</option>
                        ))}
                      </select>
                    </div>
                    <div className="fd-control-group">
                      <label>Currency</label>
                      <select value={currency} onChange={(e) => setCurrency(e.target.value)}>
                        {currencies.map((c) => (
                          <option key={c.code} value={c.code}>{c.flag} {c.code}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Legend */}
                  <div className="fd-seat-legend">
                    <div className="fd-legend-item">
                      <span className="fd-legend-box fd-legend-available" />
                      <span>Available</span>
                    </div>
                    <div className="fd-legend-item">
                      <span className="fd-legend-box fd-legend-selected" />
                      <span>Selected</span>
                    </div>
                    <div className="fd-legend-item">
                      <span className="fd-legend-box fd-legend-occupied" />
                      <span>Occupied</span>
                    </div>
                    <div className="fd-legend-item">
                      <span className="fd-legend-box fd-legend-exit" />
                      <span>Exit Row</span>
                    </div>
                    <div className="fd-legend-item">
                      <span className="fd-legend-box fd-legend-premium" />
                      <span>Premium</span>
                    </div>
                  </div>

                  {/* Airplane shape */}
                  <div className="fd-airplane">
                    <div className="fd-airplane-nose">
                      <div className="fd-airplane-nose-shape" />
                      <span className="fd-airplane-cockpit">🛩️ COCKPIT</span>
                    </div>

                    <div className="fd-airplane-body">
                      {seatMap && seatMap.sections.map((section, si) => (
                        <div className="fd-cabin-section" key={si}>
                          <div className="fd-cabin-label">{section.name}</div>
                          
                          {/* Column headers */}
                          <div className="fd-seat-row fd-seat-header-row">
                            <span className="fd-row-num" />
                            {seatMap.config.cols.map((col, ci) => (
                              col === '' 
                                ? <span className="fd-aisle-gap" key={ci} />
                                : <span className="fd-col-label" key={ci}>{col}</span>
                            ))}
                          </div>

                          {section.rows.map((row) => (
                            <div className={`fd-seat-row ${row.isExit ? 'fd-exit-row' : ''}`} key={row.row}>
                              <span className="fd-row-num">{row.row}</span>
                              {row.seats.map((seat, si2) => {
                                if (seat.type === 'aisle') {
                                  return <span className="fd-aisle-gap" key={si2} />;
                                }
                                const isSelected = selectedSeats.some((s) => s.id === seat.id);
                                const isHovered = hoveredSeat === seat.id;
                                return (
                                  <button
                                    key={seat.id}
                                    className={`fd-seat 
                                      ${seat.status === 'occupied' ? 'fd-seat-occupied' : ''} 
                                      ${isSelected ? 'fd-seat-selected' : ''} 
                                      ${seat.category === 'exit' ? 'fd-seat-exit' : ''} 
                                      ${seat.category === 'premium' ? 'fd-seat-premium' : ''}
                                      ${isHovered ? 'fd-seat-hovered' : ''}
                                      ${seat.isWindow ? 'fd-seat-window' : ''}
                                    `}
                                    disabled={seat.status === 'occupied'}
                                    onClick={() => toggleSeat(seat)}
                                    onMouseEnter={() => setHoveredSeat(seat.id)}
                                    onMouseLeave={() => setHoveredSeat(null)}
                                    title={seat.status === 'occupied' ? 'Occupied' : `${seat.id} — ${currObj.symbol}${toLocal(seat.price)}`}
                                  >
                                    {isSelected ? '✓' : seat.status === 'occupied' ? '×' : ''}
                                  </button>
                                );
                              })}
                            </div>
                          ))}
                        </div>
                      ))}
                    </div>

                    <div className="fd-airplane-tail">
                      <div className="fd-airplane-tail-shape" />
                    </div>
                  </div>
                </div>

                {/* Right: Selected Seats Summary */}
                <div className="fd-seats-summary">
                  <div className="fd-summary-card">
                    <h3>🎫 Your Selection</h3>
                    
                    {/* Flight mini info */}
                    <div className="fd-summary-flight">
                      <span>{flight.origin.code}</span>
                      <span className="fd-summary-arrow">→</span>
                      <span>{flight.destination.code}</span>
                    </div>
                    <p className="fd-summary-meta">{flight.airline.name} · {flight.flightNumber}</p>
                    <p className="fd-summary-meta">{cabinClasses.find((c) => c.id === cabinClass)?.icon} {cabinClasses.find((c) => c.id === cabinClass)?.name}</p>

                    <div className="fd-summary-divider" />

                    {/* Selected seats list */}
                    <div className="fd-selected-list">
                      {selectedSeats.length === 0 ? (
                        <p className="fd-no-seats">No seats selected yet. Click on available seats to choose.</p>
                      ) : (
                        selectedSeats.map((seat) => (
                          <div className="fd-selected-item" key={seat.id}>
                            <div className="fd-selected-info">
                              <span className="fd-selected-seat-id">Seat {seat.id}</span>
                              <span className="fd-selected-tags">
                                {seat.isWindow && <span className="fd-stag">Window</span>}
                                {seat.isExit && <span className="fd-stag fd-stag-exit">Exit</span>}
                                {seat.category === 'premium' && <span className="fd-stag fd-stag-premium">Premium</span>}
                              </span>
                            </div>
                            <span className="fd-selected-price">{currObj.symbol}{toLocal(seat.price)}</span>
                            <button className="fd-remove-seat" onClick={() => toggleSeat(seat)}>×</button>
                          </div>
                        ))
                      )}
                    </div>

                    <div className="fd-summary-divider" />

                    {/* Hovered seat info */}
                    {hoveredSeat && (() => {
                      const hSeat = seatMap.sections[0].rows.flatMap((r) => r.seats).find((s) => s.id === hoveredSeat);
                      if (!hSeat || hSeat.type === 'aisle') return null;
                      return (
                        <div className="fd-hover-info">
                          <span className="fd-hover-label">Hovering:</span>
                          <strong>Seat {hSeat.id}</strong>
                          <span>{hSeat.status === 'occupied' ? '🚫 Occupied' : `${currObj.symbol}${toLocal(hSeat.price)}`}</span>
                          {hSeat.isWindow && <span className="fd-stag">Window</span>}
                          {hSeat.isExit && <span className="fd-stag fd-stag-exit">Exit Row</span>}
                        </div>
                      );
                    })()}

                    {/* Price breakdown */}
                    <div className="fd-price-breakdown">
                      <div className="fd-price-row">
                        <span>Seats ({selectedSeats.length})</span>
                        <span>{currObj.symbol}{toLocal(seatTotal)}</span>
                      </div>
                      <div className="fd-price-row">
                        <span>GST (18%)</span>
                        <span>{currObj.symbol}{toLocal(gstAmount)}</span>
                      </div>
                      <div className="fd-price-row fd-price-total">
                        <span>Total</span>
                        <span>{currObj.symbol}{toLocal(grandTotal)} {currency}</span>
                      </div>
                    </div>

                    <button
                      className="fd-proceed-btn"
                      disabled={selectedSeats.length === 0}
                      onClick={goToDetails}
                    >
                      Continue to Details →
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* ===== STEP 2: PASSENGER DETAILS ===== */}
            {activeStep === 'details' && (
              <div className="fd-details-layout">
                <div className="fd-details-left">
                  {/* Flight & seat recap */}
                  <div className="fd-recap-card">
                    <div className="fd-recap-header">
                      <span>{flight.airline.logo}</span>
                      <div>
                        <h3>{flight.airline.name} — {flight.flightNumber}</h3>
                        <p>{flight.origin.code} → {flight.destination.code} · {flight.duration}</p>
                      </div>
                    </div>
                    <div className="fd-recap-seats">
                      <span className="fd-recap-label">Selected Seats</span>
                      <div className="fd-recap-seat-tags">
                        {selectedSeats.map((s) => (
                          <span key={s.id} className="fd-recap-stag">{s.id}</span>
                        ))}
                      </div>
                    </div>
                    <div className="fd-recap-class">
                      {cabinClasses.find((c) => c.id === cabinClass)?.icon} {cabinClasses.find((c) => c.id === cabinClass)?.name} · {passengers} Pax
                    </div>
                  </div>

                  {/* Price summary */}
                  <div className="fd-recap-card">
                    <h4>💰 Price Summary</h4>
                    {selectedSeats.map((s) => (
                      <div className="fd-price-row" key={s.id}>
                        <span>Seat {s.id}</span>
                        <span>{currObj.symbol}{toLocal(s.price)}</span>
                      </div>
                    ))}
                    <div className="fd-summary-divider" />
                    <div className="fd-price-row">
                      <span>Subtotal</span>
                      <span>{currObj.symbol}{toLocal(seatTotal)}</span>
                    </div>
                    <div className="fd-price-row">
                      <span>GST (18%)</span>
                      <span>{currObj.symbol}{toLocal(gstAmount)}</span>
                    </div>
                    <div className="fd-price-row fd-price-total">
                      <span>Grand Total</span>
                      <span>{currObj.symbol}{toLocal(grandTotal)} {currency}</span>
                    </div>
                  </div>
                </div>

                <div className="fd-details-right">
                  <div className="fd-form-card">
                    <h3>📋 Passenger Details</h3>
                    <form onSubmit={goToPayment} className="fd-form">
                      <div className="fd-form-row">
                        <div className="fd-form-group">
                          <label>Full Name</label>
                          <input type="text" placeholder="John Doe" value={bookingForm.name}
                            onChange={(e) => setBookingForm({ ...bookingForm, name: e.target.value })} required />
                        </div>
                        <div className="fd-form-group">
                          <label>Email Address</label>
                          <input type="email" placeholder="john@example.com" value={bookingForm.email}
                            onChange={(e) => setBookingForm({ ...bookingForm, email: e.target.value })} required />
                        </div>
                      </div>
                      <div className="fd-form-row">
                        <div className="fd-form-group">
                          <label>Phone Number</label>
                          <input type="tel" placeholder="+1 234 567 8901" value={bookingForm.phone}
                            onChange={(e) => setBookingForm({ ...bookingForm, phone: e.target.value })} required />
                        </div>
                        <div className="fd-form-group">
                          <label>Travel Date</label>
                          <input type="date" value={bookingForm.date}
                            onChange={(e) => setBookingForm({ ...bookingForm, date: e.target.value })}
                            min={new Date().toISOString().split('T')[0]} required />
                        </div>
                      </div>
                      <div className="fd-form-actions">
                        <button type="button" className="fd-back-btn" onClick={goBackToSeats}>← Back to Seats</button>
                        <button type="submit" className="fd-proceed-btn">Proceed to Payment →</button>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            )}

            {/* ===== STEP 3: PAYMENT ===== */}
            {activeStep === 'payment' && (
              <div className="fd-payment-layout">
                <PaymentGateway
                  amount={grandTotal}
                  gstAmount={gstAmount}
                  basePrice={seatTotal}
                  destination={{
                    name: flight.destination.city,
                    flag: flight.destination.flag,
                    thumb: `https://images.unsplash.com/photo-1436491865332-7a61a109db05?w=400&q=80`,
                    duration: flight.duration,
                    price: seatTotal / passengers,
                  }}
                  travelers={passengers}
                  travelDate={bookingForm.date}
                  customerName={bookingForm.name}
                  customerEmail={bookingForm.email}
                  onSuccess={handlePaymentSuccess}
                  onBack={goBackToDetails}
                />
              </div>
            )}

            {/* ===== STEP 4: E-TICKET ===== */}
            {activeStep === 'ticket' && (
              <div className="fd-ticket-layout">
                <div className="fd-ticket-icon">🎉</div>
                <h2 className="fd-ticket-title">Booking Confirmed!</h2>
                <p className="fd-ticket-sub">Your boarding pass is ready. Scan the QR to view online.</p>

                <div className="fd-boarding-pass">
                  {/* Header */}
                  <div className="fd-bp-header">
                    <div className="fd-bp-airline">
                      <span className="fd-bp-logo">{flight.airline.logo}</span>
                      <div>
                        <div className="fd-bp-airline-name">{flight.airline.name}</div>
                        <div className="fd-bp-flight-num">{flight.flightNumber}</div>
                      </div>
                    </div>
                    <div className="fd-bp-badge">BOARDING PASS</div>
                  </div>

                  {/* Route */}
                  <div className="fd-bp-route">
                    <div className="fd-bp-pt">
                      <div className="fd-bp-code">{flight.origin.code}</div>
                      <div className="fd-bp-city">{flight.origin.city}</div>
                      <div className="fd-bp-time">{flight.departure}</div>
                    </div>
                    <div className="fd-bp-mid">
                      <span className="fd-bp-duration">{flight.duration}</span>
                      <div className="fd-bp-line">
                        <span className="fd-bp-dot" />
                        <span className="fd-bp-track" />
                        <span className="fd-bp-plane">✈️</span>
                        <span className="fd-bp-track" />
                        <span className="fd-bp-dot" />
                      </div>
                    </div>
                    <div className="fd-bp-pt">
                      <div className="fd-bp-code">{flight.destination.code}</div>
                      <div className="fd-bp-city">{flight.destination.flag} {flight.destination.city}</div>
                      <div className="fd-bp-time">{flight.arrival}</div>
                    </div>
                  </div>

                  {/* Boarding strip */}
                  {boardingInfo && (
                    <div className="fd-bp-strip">
                      <div className="fd-bp-strip-item">
                        <span>GATE</span><strong>{boardingInfo.gate}</strong>
                      </div>
                      <div className="fd-bp-strip-item fd-bp-strip-hl">
                        <span>SEAT(S)</span><strong>{boardingInfo.seat}</strong>
                      </div>
                      <div className="fd-bp-strip-item">
                        <span>ZONE</span><strong>{boardingInfo.zone}</strong>
                      </div>
                      <div className="fd-bp-strip-item">
                        <span>TERMINAL</span><strong>{boardingInfo.terminal}</strong>
                      </div>
                      <div className="fd-bp-strip-item">
                        <span>BOARDING</span><strong>{boardingInfo.boardingTime}</strong>
                      </div>
                    </div>
                  )}

                  {/* Tear */}
                  <div className="fd-bp-tear">
                    <div className="fd-bp-tear-circle fd-bp-tear-l" />
                    <div className="fd-bp-tear-line" />
                    <div className="fd-bp-tear-circle fd-bp-tear-r" />
                  </div>

                  {/* Details */}
                  <div className="fd-bp-details">
                    <div className="fd-bp-detail"><span>Passenger</span><strong>{bookingForm.name}</strong></div>
                    <div className="fd-bp-detail"><span>Date</span><strong>{bookingForm.date}</strong></div>
                    <div className="fd-bp-detail"><span>Class</span><strong>{cabinClasses.find((c) => c.id === cabinClass)?.name}</strong></div>
                    <div className="fd-bp-detail"><span>Passengers</span><strong>{passengers}</strong></div>
                    <div className="fd-bp-detail"><span>Aircraft</span><strong>{flight.aircraft}</strong></div>
                    <div className="fd-bp-detail"><span>Sequence</span><strong>{boardingInfo?.sequence || '—'}</strong></div>
                    <div className="fd-bp-detail fd-bp-detail-total">
                      <span>Total Paid</span><strong>{currObj.symbol}{toLocal(grandTotal)} {currency}</strong>
                    </div>
                    <div className="fd-bp-detail"><span>Booking ID</span><strong>{bookingId}</strong></div>
                  </div>

                  {/* QR */}
                  <div className="fd-bp-qr-section">
                    <div className="fd-bp-qr">
                      <QRCodeSVG value={qrData || 'https://travelflow.app'} size={170} bgColor="#fff" fgColor="#0d1b2a" level="M" includeMargin />
                    </div>
                    <p className="fd-bp-qr-label">Scan to view e-ticket</p>
                  </div>

                  <div className="fd-bp-barcode">{'▮'.repeat(45)}</div>
                  <div className="fd-bp-id">{bookingId}</div>
                </div>

                <div className="fd-ticket-actions">
                  {qrData && (
                    <a href={qrData} target="_blank" rel="noopener noreferrer" className="fd-action-btn fd-action-green">
                      🎫 View Full E-Ticket
                    </a>
                  )}
                  <button className="fd-action-btn fd-action-primary" onClick={() => window.print()}>🖨️ Print Boarding Pass</button>
                  <button className="fd-action-btn fd-action-outline" onClick={() => navigate('/flights')}>✈️ Search More Flights</button>
                </div>
              </div>
            )}

          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
