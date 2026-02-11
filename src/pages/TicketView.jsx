import { useMemo } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import '../styles/ticket-view.css';

export default function TicketView() {
  const [searchParams] = useSearchParams();

  const ticket = useMemo(() => {
    try {
      const raw = searchParams.get('d');
      if (!raw) return null;
      return JSON.parse(decodeURIComponent(atob(raw)));
    } catch {
      return null;
    }
  }, [searchParams]);

  if (!ticket) {
    return (
      <div className="tv-page">
        <div className="tv-error">
          <div className="tv-error-icon">⚠️</div>
          <h2>Invalid Ticket</h2>
          <p>This QR code doesn't contain valid booking information.</p>
          <Link to="/flights" className="tv-btn">Search Flights</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="tv-page">
      <div className="tv-container">
        {/* Logo / branding */}
        <div className="tv-brand">
          <span className="tv-brand-logo">✈️</span>
          <span className="tv-brand-name">TravelFlow</span>
        </div>

        {/* Status badge */}
        <div className="tv-status">
          <span className="tv-status-icon">✅</span>
          <h1 className="tv-status-title">Booking Confirmed</h1>
          <p className="tv-status-sub">Your e-ticket details are below</p>
        </div>

        {/* Ticket card */}
        <div className="tv-card">
          {/* Header */}
          <div className="tv-card-header">
            <div className="tv-airline-info">
              <div className="tv-airline-name">{ticket.airline}</div>
              <div className="tv-flight-num">{ticket.flight}</div>
            </div>
            <div className="tv-badge">CONFIRMED</div>
          </div>

          {/* Route */}
          <div className="tv-route">
            <div className="tv-route-pt">
              <div className="tv-route-code">{ticket.from?.split(' - ')[0]}</div>
              <div className="tv-route-city">{ticket.from?.split(' - ')[1]}</div>
              <div className="tv-route-time">{ticket.departure}</div>
            </div>
            <div className="tv-route-mid">
              <div className="tv-route-line">
                <span className="tv-dot" />
                <span className="tv-track" />
                <span className="tv-plane">✈️</span>
                <span className="tv-track" />
                <span className="tv-dot" />
              </div>
            </div>
            <div className="tv-route-pt">
              <div className="tv-route-code">{ticket.to?.split(' - ')[0]}</div>
              <div className="tv-route-city">{ticket.to?.split(' - ')[1]}</div>
              <div className="tv-route-time">{ticket.arrival}</div>
            </div>
          </div>

          {/* Tear line */}
          <div className="tv-tear">
            <div className="tv-tear-circle tv-tear-left" />
            <div className="tv-tear-dashed" />
            <div className="tv-tear-circle tv-tear-right" />
          </div>

          {/* Passenger details */}
          <div className="tv-details">
            <div className="tv-detail">
              <span className="tv-detail-label">👤 Passenger</span>
              <strong>{ticket.passenger}</strong>
            </div>
            <div className="tv-detail">
              <span className="tv-detail-label">📧 Email</span>
              <strong>{ticket.email}</strong>
            </div>
            <div className="tv-detail">
              <span className="tv-detail-label">📱 Phone</span>
              <strong>{ticket.phone}</strong>
            </div>
            <div className="tv-detail">
              <span className="tv-detail-label">📅 Travel Date</span>
              <strong>{ticket.date}</strong>
            </div>
            <div className="tv-detail">
              <span className="tv-detail-label">💺 Class</span>
              <strong>{ticket.class}</strong>
            </div>
            <div className="tv-detail">
              <span className="tv-detail-label">👥 Passengers</span>
              <strong>{ticket.passengers}</strong>
            </div>
            <div className="tv-detail">
              <span className="tv-detail-label">🛩️ Aircraft</span>
              <strong>{ticket.aircraft}</strong>
            </div>
            <div className="tv-detail tv-detail-highlight">
              <span className="tv-detail-label">💰 Total Paid</span>
              <strong>{ticket.totalPaid}</strong>
            </div>
          </div>

          {/* Booking ID */}
          <div className="tv-booking-id">
            <span>Booking ID</span>
            <strong>{ticket.bookingId}</strong>
          </div>

          {/* Barcode */}
          <div className="tv-barcode">{'▮'.repeat(40)}</div>
          <div className="tv-barcode-id">{ticket.bookingId}</div>
        </div>

        {/* Footer */}
        <div className="tv-footer">
          <p>This is an electronic ticket. Please present this at check-in.</p>
          <Link to="/flights" className="tv-btn">Book Another Flight</Link>
        </div>
      </div>
    </div>
  );
}
