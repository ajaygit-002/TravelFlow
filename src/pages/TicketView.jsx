import { useMemo, useEffect, useRef } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { QRCodeSVG } from 'qrcode.react';
import '../styles/ticket-view.css';

export default function TicketView() {
  const [searchParams] = useSearchParams();
  const cardRef = useRef(null);

  const ticket = useMemo(() => {
    try {
      const raw = searchParams.get('d');
      if (!raw) return null;
      return JSON.parse(decodeURIComponent(atob(raw)));
    } catch {
      return null;
    }
  }, [searchParams]);

  // Animate card on mount
  useEffect(() => {
    if (!cardRef.current) return;
    cardRef.current.style.opacity = '0';
    cardRef.current.style.transform = 'translateY(30px) scale(0.96)';
    requestAnimationFrame(() => {
      cardRef.current.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
      cardRef.current.style.opacity = '1';
      cardRef.current.style.transform = 'translateY(0) scale(1)';
    });
  }, [ticket]);

  const formatDate = (dateStr) => {
    if (!dateStr) return '—';
    try {
      const d = new Date(dateStr + 'T00:00:00');
      return d.toLocaleDateString('en-US', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' });
    } catch {
      return dateStr;
    }
  };

  const ticketUrl = window.location.href;
  const isTrip = ticket?.type === 'trip';

  if (!ticket) {
    return (
      <div className="tv-page">
        <div className="tv-error">
          <div className="tv-error-icon">⚠️</div>
          <h2>Invalid Ticket</h2>
          <p>This QR code doesn't contain valid booking information.</p>
          <Link to="/flights" className="tv-btn tv-btn-outline">Search Flights</Link>
        </div>
      </div>
    );
  }

  /* ===== TRIP VOUCHER TEMPLATE ===== */
  if (isTrip) {
    return (
      <div className="tv-page tv-page-trip">
        <div className="tv-container" ref={cardRef}>
          {/* Brand */}
          <div className="tv-brand-bar">
            <div className="tv-brand">
              <span className="tv-brand-logo">🌍</span>
              <span className="tv-brand-name">TravelFlow</span>
            </div>
            <div className="tv-brand-label">TRAVEL VOUCHER</div>
          </div>

          {/* Status */}
          <div className="tv-status-banner tv-status-trip">
            <div className="tv-status-check">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="12" fill="#22c55e"/>
                <path d="M7 12.5l3 3 7-7" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <div>
              <h1 className="tv-status-title">Trip Confirmed</h1>
              <p className="tv-status-sub">Present this voucher at your destination</p>
            </div>
          </div>

          {/* Voucher Card */}
          <div className="tv-card">
            {/* Header with destination hero */}
            <div className="tv-trip-header">
              {ticket.thumb && <img className="tv-trip-header-img" src={ticket.thumb} alt={ticket.destination} />}
              <div className="tv-trip-header-overlay" />
              <div className="tv-trip-header-content">
                <div className="tv-trip-dest-row">
                  <div>
                    <div className="tv-trip-dest-name">{ticket.flag} {ticket.destination}</div>
                    <div className="tv-trip-dest-sub">{ticket.country} · {ticket.tagline}</div>
                  </div>
                  <div className="tv-header-badge">CONFIRMED</div>
                </div>
              </div>
            </div>

            {/* Trip Info Strip */}
            <div className="tv-boarding-strip">
              <div className="tv-boarding-item">
                <span className="tv-boarding-label">DURATION</span>
                <strong>{ticket.duration}</strong>
              </div>
              <div className="tv-boarding-item tv-boarding-highlight">
                <span className="tv-boarding-label">TRAVEL DATE</span>
                <strong>{formatDate(ticket.date)}</strong>
              </div>
              <div className="tv-boarding-item tv-boarding-highlight">
                <span className="tv-boarding-label">TRAVELERS</span>
                <strong>{ticket.travelers}</strong>
              </div>
            </div>

            {/* Tear Line */}
            <div className="tv-tear">
              <div className="tv-tear-circle tv-tear-left" />
              <div className="tv-tear-dashed" />
              <div className="tv-tear-circle tv-tear-right" />
            </div>

            {/* Lower: Details + QR */}
            <div className="tv-lower-section">
              <div className="tv-details">
                <div className="tv-detail">
                  <span className="tv-detail-label">GUEST NAME</span>
                  <strong>{ticket.passenger}</strong>
                </div>
                <div className="tv-detail">
                  <span className="tv-detail-label">EMAIL</span>
                  <strong>{ticket.email}</strong>
                </div>
                <div className="tv-detail">
                  <span className="tv-detail-label">PHONE</span>
                  <strong>{ticket.phone}</strong>
                </div>
                <div className="tv-detail">
                  <span className="tv-detail-label">PACKAGE</span>
                  <strong>{ticket.duration} · {ticket.destination}</strong>
                </div>

                {/* Includes */}
                {ticket.included?.length > 0 && (
                  <div className="tv-detail tv-detail-full">
                    <span className="tv-detail-label">WHAT'S INCLUDED</span>
                    <div className="tv-included-tags">
                      {ticket.included.map((item, i) => (
                        <span key={i} className="tv-include-tag">✓ {item}</span>
                      ))}
                    </div>
                  </div>
                )}

                <div className="tv-detail tv-detail-highlight">
                  <span className="tv-detail-label">TOTAL PAID</span>
                  <strong>{ticket.totalPaid}</strong>
                </div>
              </div>

              {/* QR */}
              <div className="tv-qr-section">
                <div className="tv-qr-frame">
                  <QRCodeSVG
                    value={ticketUrl}
                    size={150}
                    bgColor="#ffffff"
                    fgColor="#0d1b2a"
                    level="M"
                    includeMargin
                  />
                </div>
                <p className="tv-qr-label">Scan to verify voucher</p>
              </div>
            </div>

            {/* Booking ID */}
            <div className="tv-booking-bar">
              <div className="tv-booking-id-row">
                <span>BOOKING REFERENCE</span>
                <strong>{ticket.bookingId}</strong>
              </div>
            </div>

            <div className="tv-barcode-section">
              <div className="tv-barcode">{'▮'.repeat(48)}</div>
              <div className="tv-barcode-id">{ticket.bookingId}</div>
            </div>
          </div>

          {/* Footer */}
          <div className="tv-footer">
            <p className="tv-footer-notice">
              This is an electronic travel voucher issued by TravelFlow. Present on arrival.
            </p>
            <div className="tv-footer-actions">
              <button className="tv-btn tv-btn-print" onClick={() => window.print()}>
                🖨️ Print Voucher
              </button>
              <Link to="/destinations" className="tv-btn tv-btn-outline">
                🌍 Explore More
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  /* ===== FLIGHT BOARDING PASS TEMPLATE ===== */
  return (
    <div className="tv-page">
      <div className="tv-container" ref={cardRef}>
        {/* Brand Bar */}
        <div className="tv-brand-bar">
          <div className="tv-brand">
            <span className="tv-brand-logo">✈️</span>
            <span className="tv-brand-name">TravelFlow</span>
          </div>
          <div className="tv-brand-label">ELECTRONIC BOARDING PASS</div>
        </div>

        {/* Status */}
        <div className="tv-status-banner">
          <div className="tv-status-check">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="12" fill="#22c55e"/>
              <path d="M7 12.5l3 3 7-7" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <div>
            <h1 className="tv-status-title">Booking Confirmed</h1>
            <p className="tv-status-sub">Present this boarding pass at the gate</p>
          </div>
        </div>

        {/* Boarding Pass Card */}
        <div className="tv-card">
          {/* Header */}
          <div className="tv-card-header">
            <div className="tv-airline-row">
              {ticket.airlineLogo && <span className="tv-airline-logo">{ticket.airlineLogo}</span>}
              <div>
                <div className="tv-airline-name">{ticket.airline}</div>
                <div className="tv-flight-num">{ticket.flight} · {ticket.aircraft || 'Aircraft'}</div>
              </div>
            </div>
            <div className="tv-header-badge">BOARDING PASS</div>
          </div>

          {/* Route */}
          <div className="tv-route">
            <div className="tv-route-pt">
              <div className="tv-route-code">{ticket.from?.split(' - ')[0]}</div>
              <div className="tv-route-city">{ticket.from?.split(' - ')[1]}</div>
              <div className="tv-route-time">{ticket.departure}</div>
            </div>
            <div className="tv-route-mid">
              <div className="tv-route-duration">{ticket.duration || '—'}</div>
              <div className="tv-route-line">
                <span className="tv-dot" />
                <span className="tv-track" />
                <span className="tv-plane">✈</span>
                <span className="tv-track" />
                <span className="tv-dot" />
              </div>
              <div className="tv-route-stops">
                {ticket.stops === 0 ? 'Nonstop' : ticket.stops ? `${ticket.stops} stop${ticket.stops > 1 ? 's' : ''}` : ''}
              </div>
            </div>
            <div className="tv-route-pt">
              <div className="tv-route-code">{ticket.to?.split(' - ')[0]}</div>
              <div className="tv-route-city">{ticket.to?.split(' - ')[1]}</div>
              <div className="tv-route-time">{ticket.arrival}</div>
            </div>
          </div>

          {/* Boarding Info Strip */}
          <div className="tv-boarding-strip">
            <div className="tv-boarding-item">
              <span className="tv-boarding-label">DATE</span>
              <strong>{formatDate(ticket.date)}</strong>
            </div>
            {ticket.gate && (
              <div className="tv-boarding-item tv-boarding-highlight">
                <span className="tv-boarding-label">GATE</span>
                <strong>{ticket.gate}</strong>
              </div>
            )}
            {ticket.seat && (
              <div className="tv-boarding-item tv-boarding-highlight">
                <span className="tv-boarding-label">SEAT</span>
                <strong>{ticket.seat}</strong>
              </div>
            )}
            {ticket.zone && (
              <div className="tv-boarding-item">
                <span className="tv-boarding-label">ZONE</span>
                <strong>{ticket.zone}</strong>
              </div>
            )}
            {ticket.terminal && (
              <div className="tv-boarding-item">
                <span className="tv-boarding-label">TERMINAL</span>
                <strong>{ticket.terminal}</strong>
              </div>
            )}
            {ticket.boardingTime && (
              <div className="tv-boarding-item">
                <span className="tv-boarding-label">BOARDING</span>
                <strong>{ticket.boardingTime}</strong>
              </div>
            )}
          </div>

          {/* Tear Line */}
          <div className="tv-tear">
            <div className="tv-tear-circle tv-tear-left" />
            <div className="tv-tear-dashed" />
            <div className="tv-tear-circle tv-tear-right" />
          </div>

          {/* Lower: Details + QR */}
          <div className="tv-lower-section">
            <div className="tv-details">
              <div className="tv-detail">
                <span className="tv-detail-label">PASSENGER</span>
                <strong>{ticket.passenger}</strong>
              </div>
              <div className="tv-detail">
                <span className="tv-detail-label">EMAIL</span>
                <strong>{ticket.email}</strong>
              </div>
              <div className="tv-detail">
                <span className="tv-detail-label">PHONE</span>
                <strong>{ticket.phone}</strong>
              </div>
              <div className="tv-detail">
                <span className="tv-detail-label">CLASS</span>
                <strong>{ticket.class}</strong>
              </div>
              <div className="tv-detail">
                <span className="tv-detail-label">PASSENGERS</span>
                <strong>{ticket.passengers}</strong>
              </div>
              <div className="tv-detail">
                <span className="tv-detail-label">SEQUENCE</span>
                <strong>{ticket.sequence || '—'}</strong>
              </div>
              <div className="tv-detail tv-detail-highlight">
                <span className="tv-detail-label">TOTAL PAID</span>
                <strong>{ticket.totalPaid}</strong>
              </div>
            </div>

            {/* QR Code */}
            <div className="tv-qr-section">
              <div className="tv-qr-frame">
                <QRCodeSVG
                  value={ticketUrl}
                  size={150}
                  bgColor="#ffffff"
                  fgColor="#0d1b2a"
                  level="M"
                  includeMargin
                />
              </div>
              <p className="tv-qr-label">Scan to verify ticket</p>
            </div>
          </div>

          {/* Booking ID */}
          <div className="tv-booking-bar">
            <div className="tv-booking-id-row">
              <span>BOOKING REFERENCE</span>
              <strong>{ticket.bookingId}</strong>
            </div>
          </div>

          <div className="tv-barcode-section">
            <div className="tv-barcode">{'▮'.repeat(52)}</div>
            <div className="tv-barcode-id">{ticket.bookingId}</div>
          </div>
        </div>

        {/* Footer */}
        <div className="tv-footer">
          <p className="tv-footer-notice">
            This is an electronic boarding pass issued by TravelFlow. Present at check-in counter or gate.
          </p>
          <div className="tv-footer-actions">
            <button className="tv-btn tv-btn-print" onClick={() => window.print()}>
              🖨️ Print Boarding Pass
            </button>
            <Link to="/flights" className="tv-btn tv-btn-outline">
              ✈️ Book Another Flight
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
