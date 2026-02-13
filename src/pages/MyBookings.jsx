import { useState, useEffect, useRef, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { gsap } from 'gsap';
import { useBookingAuth } from '../context/BookingAuthContext';
import Footer from '../components/Footer';
import { animateNavbar } from '../animations/gsapAnimations';
import '../styles/my-bookings.css';

export default function MyBookings() {
  const {
    authUser, isAuthenticated, authenticateByEmail, authenticate,
    logout, getMyBookings, modifyBooking, cancelBooking,
  } = useBookingAuth();
  const navigate = useNavigate();

  // Auth form state
  const [authMode, setAuthMode] = useState('email'); // 'email' | 'booking'
  const [authEmail, setAuthEmail] = useState('');
  const [authBookingId, setAuthBookingId] = useState('');
  const [authPin, setAuthPin] = useState('');
  const [authError, setAuthError] = useState('');
  const [authLoading, setAuthLoading] = useState(false);

  // Bookings state
  const [filter, setFilter] = useState('all'); // all | confirmed | modified | cancelled
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [showModify, setShowModify] = useState(false);
  const [modifyForm, setModifyForm] = useState({ date: '', phone: '' });
  const [showCancel, setShowCancel] = useState(false);
  const [actionDone, setActionDone] = useState('');

  const pageRef = useRef(null);

  useEffect(() => {
    const cleanup = animateNavbar();
    return () => { if (cleanup) cleanup(); };
  }, []);

  // Entrance animation
  useEffect(() => {
    gsap.fromTo('.mb-hero', { opacity: 0 }, { opacity: 1, duration: 0.5 });
    gsap.fromTo('.mb-hero-content', { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6, delay: 0.2 });
  }, []);

  const myBookings = useMemo(() => {
    if (!isAuthenticated) return [];
    const all = getMyBookings();
    if (filter === 'all') return all;
    return all.filter((b) => b.status === filter);
  }, [isAuthenticated, getMyBookings, filter]);

  // Auth handlers
  const handleEmailAuth = (e) => {
    e.preventDefault();
    setAuthError('');
    setAuthLoading(true);
    setTimeout(() => {
      const result = authenticateByEmail(authEmail);
      setAuthLoading(false);
      if (!result.success) {
        setAuthError('No bookings found for this email address.');
      }
    }, 800);
  };

  const handleBookingAuth = (e) => {
    e.preventDefault();
    setAuthError('');
    setAuthLoading(true);
    setTimeout(() => {
      const result = authenticate(authEmail, authBookingId, authPin);
      setAuthLoading(false);
      if (!result.success) {
        setAuthError('Invalid credentials. Check your Booking ID, email, and PIN.');
      }
    }, 800);
  };

  // Modify booking
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

  // Cancel booking
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
    confirmed: { bg: '#dcfce7', color: '#16a34a', label: 'Confirmed' },
    modified: { bg: '#fef3c7', color: '#d97706', label: 'Modified' },
    cancelled: { bg: '#fee2e2', color: '#dc2626', label: 'Cancelled' },
  };

  return (
    <div className="mb-page" ref={pageRef}>
      {/* ===== HERO ===== */}
      <section className="mb-hero">
        <div className="mb-hero-bg">
          <div className="mb-shape mb-shape-1" />
          <div className="mb-shape mb-shape-2" />
          <div className="mb-shape mb-shape-3" />
        </div>
        <div className="container">
          <div className="mb-hero-content">
            <h1 className="mb-hero-title">
              {isAuthenticated ? `Welcome back, ${authUser.name?.split(' ')[0] || 'Traveler'}` : 'My Bookings'}
            </h1>
            <p className="mb-hero-sub">
              {isAuthenticated
                ? 'View, modify, or manage all your flight bookings in one place.'
                : 'Sign in to access your bookings, modify tickets, or check flight details.'}
            </p>
            {isAuthenticated && (
              <div className="mb-hero-user">
                <span className="mb-user-avatar">👤</span>
                <div>
                  <strong>{authUser.name}</strong>
                  <span>{authUser.email}</span>
                </div>
                <button className="mb-logout-btn" onClick={logout}>Sign Out</button>
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="mb-main section">
        <div className="container">

          {/* ===== NOT AUTHENTICATED — AUTH GATE ===== */}
          {!isAuthenticated && (
            <div className="mb-auth-gate">
              <div className="mb-auth-card">
                <div className="mb-auth-icon">🔐</div>
                <h2 className="mb-auth-title">Access Your Bookings</h2>
                <p className="mb-auth-sub">Enter your email or booking details to view and manage your tickets.</p>

                {/* Auth mode tabs */}
                <div className="mb-auth-tabs">
                  <button
                    className={`mb-auth-tab ${authMode === 'email' ? 'active' : ''}`}
                    onClick={() => { setAuthMode('email'); setAuthError(''); }}
                  >
                    📧 Email Lookup
                  </button>
                  <button
                    className={`mb-auth-tab ${authMode === 'booking' ? 'active' : ''}`}
                    onClick={() => { setAuthMode('booking'); setAuthError(''); }}
                  >
                    🔑 Booking ID + PIN
                  </button>
                </div>

                {/* Email auth */}
                {authMode === 'email' && (
                  <form onSubmit={handleEmailAuth} className="mb-auth-form">
                    <div className="mb-auth-field">
                      <label>Email Address</label>
                      <input
                        type="email"
                        placeholder="john@example.com"
                        value={authEmail}
                        onChange={(e) => setAuthEmail(e.target.value)}
                        required
                      />
                    </div>
                    <button type="submit" className="mb-auth-submit" disabled={authLoading}>
                      {authLoading ? '⏳ Checking...' : '🔍 Find My Bookings'}
                    </button>
                  </form>
                )}

                {/* Booking ID auth */}
                {authMode === 'booking' && (
                  <form onSubmit={handleBookingAuth} className="mb-auth-form">
                    <div className="mb-auth-field">
                      <label>Email Address</label>
                      <input
                        type="email"
                        placeholder="john@example.com"
                        value={authEmail}
                        onChange={(e) => setAuthEmail(e.target.value)}
                        required
                      />
                    </div>
                    <div className="mb-auth-row">
                      <div className="mb-auth-field">
                        <label>Booking ID</label>
                        <input
                          type="text"
                          placeholder="TF-FL-0001-..."
                          value={authBookingId}
                          onChange={(e) => setAuthBookingId(e.target.value)}
                          required
                        />
                      </div>
                      <div className="mb-auth-field">
                        <label>6-Digit PIN</label>
                        <input
                          type="text"
                          placeholder="123456"
                          maxLength={6}
                          value={authPin}
                          onChange={(e) => setAuthPin(e.target.value.replace(/\D/g, '').slice(0, 6))}
                          required
                        />
                      </div>
                    </div>
                    <button type="submit" className="mb-auth-submit" disabled={authLoading}>
                      {authLoading ? '⏳ Verifying...' : '🔓 Access Booking'}
                    </button>
                  </form>
                )}

                {authError && <div className="mb-auth-error">⚠️ {authError}</div>}

                <div className="mb-auth-help">
                  <p>Your PIN was emailed when you completed your booking. Can't find it?</p>
                  <Link to="/help">Visit Help Center →</Link>
                </div>
              </div>

              {/* Info section */}
              <div className="mb-auth-info">
                <div className="mb-info-card">
                  <span className="mb-info-icon">🛡️</span>
                  <h4>Secure Access</h4>
                  <p>Your booking details are protected. Only the ticket owner can view or modify bookings.</p>
                </div>
                <div className="mb-info-card">
                  <span className="mb-info-icon">✏️</span>
                  <h4>Easy Modifications</h4>
                  <p>Change your travel date, update contact info, or cancel with a few clicks.</p>
                </div>
                <div className="mb-info-card">
                  <span className="mb-info-icon">🎫</span>
                  <h4>Instant Tickets</h4>
                  <p>Access and reprint your boarding passes anytime, anywhere.</p>
                </div>
              </div>
            </div>
          )}

          {/* ===== AUTHENTICATED — BOOKINGS DASHBOARD ===== */}
          {isAuthenticated && (
            <div className="mb-dashboard">

              {/* Action toast */}
              {actionDone && (
                <div className="mb-toast">
                  <span>✅</span> {actionDone}
                </div>
              )}

              {/* Filter tabs */}
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
                    {filter === 'all'
                      ? 'Start your journey by booking a flight!'
                      : 'Try a different filter to find your bookings.'}
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
                      {/* Card header */}
                      <div className="mb-bcard-header">
                        <div className="mb-bcard-airline">
                          <span className="mb-bcard-logo">{booking.airlineLogo || '✈️'}</span>
                          <div>
                            <strong>{booking.airline}</strong>
                            <span className="mb-bcard-fnum">{booking.flightNumber}</span>
                          </div>
                        </div>
                        <div className="mb-bcard-status" style={{ background: st.bg, color: st.color }}>
                          {st.label}
                        </div>
                      </div>

                      {/* Route */}
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
                            <span>✈</span>
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

                      {/* Info strip */}
                      <div className="mb-bcard-strip">
                        <div className="mb-bcard-info">
                          <span>📅 Date</span>
                          <strong>{formatDate(booking.date)}</strong>
                        </div>
                        <div className="mb-bcard-info">
                          <span>💺 Seats</span>
                          <strong>{booking.seats}</strong>
                        </div>
                        <div className="mb-bcard-info">
                          <span>🎫 Class</span>
                          <strong>{booking.cabinClass}</strong>
                        </div>
                        <div className="mb-bcard-info">
                          <span>👥 Pax</span>
                          <strong>{booking.passengers}</strong>
                        </div>
                        <div className="mb-bcard-info mb-bcard-price">
                          <span>💰 Total</span>
                          <strong>{booking.totalPaid}</strong>
                        </div>
                      </div>

                      {/* ID + PIN */}
                      <div className="mb-bcard-id-row">
                        <span>Booking: <strong>{booking.bookingId}</strong></span>
                        <span>PIN: <strong>{booking.pin}</strong></span>
                      </div>

                      {/* Actions */}
                      {booking.status !== 'cancelled' && (
                        <div className="mb-bcard-actions">
                          {booking.ticketUrl && (
                            <a href={booking.ticketUrl} target="_blank" rel="noopener noreferrer" className="mb-action-btn mb-action-view">
                              🎫 View Ticket
                            </a>
                          )}
                          <button className="mb-action-btn mb-action-modify" onClick={() => handleModify(booking)}>
                            ✏️ Modify
                          </button>
                          <button className="mb-action-btn mb-action-cancel" onClick={() => handleCancel(booking)}>
                            ❌ Cancel
                          </button>
                        </div>
                      )}

                      {booking.status === 'cancelled' && (
                        <div className="mb-bcard-cancelled-note">
                          This booking was cancelled on {new Date(booking.cancelledAt).toLocaleDateString()}.
                        </div>
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
                        <input
                          type="date"
                          value={modifyForm.date}
                          onChange={(e) => setModifyForm({ ...modifyForm, date: e.target.value })}
                          min={new Date().toISOString().split('T')[0]}
                          required
                        />
                      </div>
                      <div className="mb-modal-field">
                        <label>Phone Number</label>
                        <input
                          type="tel"
                          placeholder="+1 234 567 8901"
                          value={modifyForm.phone}
                          onChange={(e) => setModifyForm({ ...modifyForm, phone: e.target.value })}
                          required
                        />
                      </div>
                      <div className="mb-modal-actions">
                        <button type="button" className="mb-modal-cancel" onClick={() => setShowModify(false)}>Cancel</button>
                        <button type="submit" className="mb-modal-submit">Save Changes</button>
                      </div>
                    </form>
                  </div>
                </div>
              )}

              {/* ===== CANCEL CONFIRMATION MODAL ===== */}
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
                      <button className="mb-modal-submit mb-modal-submit-danger" onClick={confirmCancel}>Yes, Cancel Booking</button>
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
