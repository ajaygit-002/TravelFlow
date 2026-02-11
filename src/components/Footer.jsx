import { Link } from 'react-router-dom';
import '../styles/footer.css';

export default function Footer() {
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
              <span className="footer-social">𝕏</span>
              <span className="footer-social">📘</span>
              <span className="footer-social">📸</span>
              <span className="footer-social">💼</span>
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
            <form className="footer-newsletter-form" onSubmit={(e) => e.preventDefault()}>
              <input
                className="footer-newsletter-input"
                type="email"
                placeholder="Enter your email"
              />
              <button className="footer-newsletter-btn" type="submit">
                Subscribe
              </button>
            </form>
          </div>
        </div>

        <div className="footer-bottom">
          <p className="footer-copyright">
            © 2026 TravelFlow. All rights reserved.
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
