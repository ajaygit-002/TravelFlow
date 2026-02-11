import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { gsap } from 'gsap';
import destinations from '../data/destinations';
import PaymentGateway from '../components/PaymentGateway';
import Footer from '../components/Footer';
import '../styles/booking.css';

const GST_RATE = 0.18; // 18% GST

export default function Booking() {
  const { id } = useParams();
  const navigate = useNavigate();
  const pageRef = useRef(null);
  const dest = destinations.find((d) => d.id === id);

  const [travelers, setTravelers] = useState(1);
  const [travelDate, setTravelDate] = useState('');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [showPayment, setShowPayment] = useState(false);
  const [bookingComplete, setBookingComplete] = useState(false);

  // Price calculations
  const basePrice = dest ? dest.price * travelers : 0;
  const gstAmount = basePrice * GST_RATE;
  const totalPrice = basePrice + gstAmount;

  useEffect(() => {
    if (!dest || !pageRef.current) return;
    window.scrollTo(0, 0);

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

      tl.fromTo(pageRef.current, { opacity: 0, y: 50 }, { opacity: 1, y: 0, duration: 0.6 })
        .fromTo('.bk-hero', { opacity: 0, scale: 1.05 }, { opacity: 1, scale: 1, duration: 0.7 }, '-=0.4')
        .fromTo('.bk-hero-content > *', { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.5, stagger: 0.1 }, '-=0.3')
        .fromTo('.bk-form-section', { opacity: 0, x: -40 }, { opacity: 1, x: 0, duration: 0.6 }, '-=0.3')
        .fromTo('.bk-summary-section', { opacity: 0, x: 40 }, { opacity: 1, x: 0, duration: 0.6 }, '-=0.5')
        .fromTo('.bk-form-group', { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.4, stagger: 0.08 }, '-=0.3')
        .fromTo('.bk-price-row', { opacity: 0, x: -20 }, { opacity: 1, x: 0, duration: 0.35, stagger: 0.08 }, '-=0.2');
    }, pageRef);

    return () => ctx.revert();
  }, [dest]);

  const handleProceedToPayment = (e) => {
    e.preventDefault();
    if (!fullName || !email || !phone || !travelDate) return;

    // Animate form out, payment in
    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
    tl.to('.bk-main-content', { opacity: 0, y: -30, duration: 0.4 })
      .call(() => setShowPayment(true))
      .fromTo('.payment-gateway', { opacity: 0, y: 60, scale: 0.95 }, { opacity: 1, y: 0, scale: 1, duration: 0.6 }, '+=0.1')
      .fromTo('.pg-card', { rotateY: -15, transformPerspective: 1200 }, { rotateY: 0, duration: 0.7 }, '-=0.4')
      .fromTo('.pg-section', { opacity: 0, y: 25 }, { opacity: 1, y: 0, duration: 0.4, stagger: 0.1 }, '-=0.3');
  };

  const handlePaymentSuccess = () => {
    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
    tl.to('.payment-gateway', { opacity: 0, scale: 0.9, duration: 0.4 })
      .call(() => setBookingComplete(true))
      .fromTo('.bk-success', { opacity: 0, scale: 0.8 }, { opacity: 1, scale: 1, duration: 0.6 }, '+=0.1')
      .fromTo('.bk-success-icon', { scale: 0, rotate: -180 }, { scale: 1, rotate: 0, duration: 0.7, ease: 'back.out(1.7)' }, '-=0.3')
      .fromTo('.bk-success-content > *', { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.4, stagger: 0.1 }, '-=0.2')
      .fromTo('.bk-confetti-piece', { opacity: 0, y: -100, scale: 0 }, {
        opacity: 1, y: 0, scale: 1, duration: 0.6, stagger: 0.03,
        ease: 'bounce.out',
      }, '-=0.5');
  };

  const handleBackToForm = () => {
    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
    tl.to('.payment-gateway', { opacity: 0, y: 30, duration: 0.3 })
      .call(() => setShowPayment(false))
      .to('.bk-main-content', { opacity: 1, y: 0, duration: 0.5 }, '+=0.1');
  };

  if (!dest) {
    return (
      <div className="bk-not-found">
        <h2>Destination not found</h2>
        <button className="btn btn-primary" onClick={() => navigate('/')}>Go Home</button>
      </div>
    );
  }

  return (
    <div className="bk-page" ref={pageRef}>
      {/* Hero Banner */}
      <div className="bk-hero">
        <img className="bk-hero-img" src={dest.heroImage} alt={dest.name} />
        <div className="bk-hero-overlay" />
        <div className="bk-hero-content">
          <button className="bk-back-btn" onClick={() => navigate(-1)}>← Back</button>
          <span className="bk-hero-tag">Booking</span>
          <h1 className="bk-hero-title">{dest.flag} {dest.name}, {dest.country}</h1>
          <p className="bk-hero-sub">{dest.tagline} · {dest.duration}</p>
        </div>
      </div>

      {/* Booking Complete */}
      {bookingComplete && (
        <div className="bk-success">
          <div className="bk-confetti">
            {Array.from({ length: 20 }).map((_, i) => (
              <span
                className="bk-confetti-piece"
                key={i}
                style={{
                  left: `${Math.random() * 100}%`,
                  background: ['#2F80ED', '#56CCF2', '#F2994A', '#27AE60', '#F2C94C', '#EB5757'][i % 6],
                  animationDelay: `${Math.random() * 2}s`,
                  animationDuration: `${2 + Math.random() * 2}s`,
                }}
              />
            ))}
          </div>
          <div className="bk-success-icon">✓</div>
          <div className="bk-success-content">
            <h2>Booking Confirmed! 🎉</h2>
            <p className="bk-success-msg">
              Your trip to <strong>{dest.name}</strong> has been booked successfully.
              A confirmation email has been sent to <strong>{email}</strong>.
            </p>
            <div className="bk-success-details">
              <div className="bk-success-detail">
                <span className="bk-success-label">Booking ID</span>
                <span className="bk-success-value">TF-{Date.now().toString(36).toUpperCase()}</span>
              </div>
              <div className="bk-success-detail">
                <span className="bk-success-label">Travel Date</span>
                <span className="bk-success-value">{travelDate}</span>
              </div>
              <div className="bk-success-detail">
                <span className="bk-success-label">Travelers</span>
                <span className="bk-success-value">{travelers}</span>
              </div>
              <div className="bk-success-detail">
                <span className="bk-success-label">Total Paid</span>
                <span className="bk-success-value bk-success-total">${totalPrice.toFixed(2)}</span>
              </div>
            </div>
            <div className="bk-success-actions">
              <button className="btn btn-primary btn-lg" onClick={() => navigate('/')}>Back to Home</button>
              <button className="btn btn-outline btn-lg" onClick={() => navigate('/destinations')}>Explore More</button>
            </div>
          </div>
        </div>
      )}

      {/* Main Booking Content */}
      {!bookingComplete && (
        <div className="bk-container">
          {!showPayment && (
            <div className="bk-main-content">
              <div className="bk-grid">
                {/* Left: Booking Form */}
                <div className="bk-form-section">
                  <div className="bk-section-header">
                    <span className="bk-section-step">1</span>
                    <div>
                      <h2 className="bk-section-title">Traveler Details</h2>
                      <p className="bk-section-sub">Fill in your information to proceed</p>
                    </div>
                  </div>

                  <form onSubmit={handleProceedToPayment} className="bk-form">
                    <div className="bk-form-group">
                      <label className="bk-label">Full Name</label>
                      <div className="bk-input-wrap">
                        <span className="bk-input-icon">👤</span>
                        <input
                          type="text"
                          className="bk-input"
                          placeholder="John Doe"
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                          required
                        />
                      </div>
                    </div>

                    <div className="bk-form-group">
                      <label className="bk-label">Email Address</label>
                      <div className="bk-input-wrap">
                        <span className="bk-input-icon">📧</span>
                        <input
                          type="email"
                          className="bk-input"
                          placeholder="john@example.com"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          required
                        />
                      </div>
                    </div>

                    <div className="bk-form-group">
                      <label className="bk-label">Phone Number</label>
                      <div className="bk-input-wrap">
                        <span className="bk-input-icon">📱</span>
                        <input
                          type="tel"
                          className="bk-input"
                          placeholder="+1 234 567 8900"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          required
                        />
                      </div>
                    </div>

                    <div className="bk-form-row">
                      <div className="bk-form-group">
                        <label className="bk-label">Travel Date</label>
                        <div className="bk-input-wrap">
                          <span className="bk-input-icon">📅</span>
                          <input
                            type="date"
                            className="bk-input"
                            value={travelDate}
                            onChange={(e) => setTravelDate(e.target.value)}
                            min={new Date().toISOString().split('T')[0]}
                            required
                          />
                        </div>
                      </div>
                      <div className="bk-form-group">
                        <label className="bk-label">Number of Travelers</label>
                        <div className="bk-traveler-control">
                          <button
                            type="button"
                            className="bk-traveler-btn"
                            onClick={() => setTravelers(Math.max(1, travelers - 1))}
                          >−</button>
                          <span className="bk-traveler-count">{travelers}</span>
                          <button
                            type="button"
                            className="bk-traveler-btn"
                            onClick={() => setTravelers(Math.min(10, travelers + 1))}
                          >+</button>
                        </div>
                      </div>
                    </div>

                    <button type="submit" className="btn btn-primary btn-lg bk-submit-btn">
                      Proceed to Payment →
                    </button>
                  </form>
                </div>

                {/* Right: Price Summary */}
                <div className="bk-summary-section">
                  <div className="bk-summary-card">
                    <div className="bk-summary-img-wrap">
                      <img className="bk-summary-img" src={dest.thumb} alt={dest.name} />
                      <div className="bk-summary-img-overlay" />
                      <div className="bk-summary-img-info">
                        <span className="bk-summary-dest-name">{dest.flag} {dest.name}</span>
                        <span className="bk-summary-dest-duration">{dest.duration}</span>
                      </div>
                    </div>

                    <div className="bk-summary-body">
                      <h3 className="bk-summary-title">Price Summary</h3>

                      <div className="bk-price-row">
                        <span>Base Price (per person)</span>
                        <span>${dest.price.toFixed(2)}</span>
                      </div>
                      <div className="bk-price-row">
                        <span>Travelers</span>
                        <span>× {travelers}</span>
                      </div>
                      <div className="bk-price-row bk-price-subtotal">
                        <span>Subtotal</span>
                        <span>${basePrice.toFixed(2)}</span>
                      </div>

                      <div className="bk-gst-box">
                        <div className="bk-gst-header">
                          <span className="bk-gst-badge">GST</span>
                          <span className="bk-gst-rate">@ 18%</span>
                        </div>
                        <div className="bk-gst-breakdown">
                          <div className="bk-gst-row">
                            <span>CGST (9%)</span>
                            <span>${(gstAmount / 2).toFixed(2)}</span>
                          </div>
                          <div className="bk-gst-row">
                            <span>SGST (9%)</span>
                            <span>${(gstAmount / 2).toFixed(2)}</span>
                          </div>
                        </div>
                        <div className="bk-price-row bk-gst-total-row">
                          <span>Total GST</span>
                          <span>${gstAmount.toFixed(2)}</span>
                        </div>
                      </div>

                      <div className="bk-price-total">
                        <span>Total Amount</span>
                        <span className="bk-price-total-value">${totalPrice.toFixed(2)}</span>
                      </div>

                      <div className="bk-included-mini">
                        <h4>What's Included:</h4>
                        <ul>
                          {dest.included.slice(0, 4).map((item, i) => (
                            <li key={i}>✓ {item}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Payment Gateway */}
          {showPayment && (
            <PaymentGateway
              amount={totalPrice}
              gstAmount={gstAmount}
              basePrice={basePrice}
              destination={dest}
              travelers={travelers}
              travelDate={travelDate}
              customerName={fullName}
              customerEmail={email}
              onSuccess={handlePaymentSuccess}
              onBack={handleBackToForm}
            />
          )}
        </div>
      )}

      <Footer />
    </div>
  );
}
