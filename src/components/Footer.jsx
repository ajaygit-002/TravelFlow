import { useState } from 'react';
import { Link } from 'react-router-dom';
import '../styles/footer.css';

export default function Footer() {
  const [subscribed, setSubscribed] = useState(false);
  const [email, setEmail] = useState('');

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setEmail('');
      setTimeout(() => setSubscribed(false), 4000);
    }
  };

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          {/* Brand */}
          <div className="footer-brand">
            <div className="footer-logo">
              <div className="footer-logo-icon">✈</div>
              TravelFlow
            </div>
            <p className="footer-desc">
              Your trusted partner for global travel. We connect you to the world with
              ease, comfort, and unforgettable experiences.
            </p>
            <div className="footer-socials">
              <a href="https://x.com" target="_blank" rel="noopener noreferrer" className="footer-social" aria-label="X / Twitter">𝕏</a>
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="footer-social" aria-label="Facebook">📘</a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="footer-social" aria-label="Instagram">📸</a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="footer-social" aria-label="LinkedIn">💼</a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="footer-col-title">Quick Links</h4>
            <div className="footer-links">
              <Link to="/" className="footer-link">Home</Link>
              <Link to="/about" className="footer-link">About Us</Link>
              <Link to="/destinations" className="footer-link">Destinations</Link>
              <Link to="/contact" className="footer-link">Contact</Link>
            </div>
          </div>

          {/* Support */}
          <div>
            <h4 className="footer-col-title">Support</h4>
            <div className="footer-links">
              <Link to="/help" className="footer-link">Help Center</Link>
              <Link to="/faqs" className="footer-link">FAQs</Link>
              <Link to="/privacy" className="footer-link">Privacy Policy</Link>
              <Link to="/terms" className="footer-link">Terms of Service</Link>
            </div>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="footer-col-title">Newsletter</h4>
            <p className="footer-newsletter-text">
              Subscribe to receive the latest travel deals and destination updates.
            </p>
            <form className="footer-newsletter-form" onSubmit={handleSubscribe}>
              <input
                className="footer-newsletter-input"
                type="email"
                placeholder={subscribed ? 'Subscribed!' : 'Enter your email'}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={subscribed}
              />
              <button className="footer-newsletter-btn" type="submit" disabled={subscribed}>
                {subscribed ? '✓ Done' : 'Subscribe'}
              </button>
            </form>
          </div>
        </div>

        <div className="footer-bottom">
          <p className="footer-copyright">
            © {new Date().getFullYear()} TravelFlow. All rights reserved.
          </p>
          <div className="footer-bottom-links">
            <Link to="/privacy" className="footer-bottom-link">Privacy</Link>
            <Link to="/terms" className="footer-bottom-link">Terms</Link>
            <span className="footer-bottom-link">Cookies</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
