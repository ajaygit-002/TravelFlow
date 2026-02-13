import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { useWishlist } from '../context/WishlistContext';
import '../styles/navbar.css';

const navLinks = [
  { name: 'Home', path: '/' },
  { name: 'About', path: '/about' },
  { name: 'Flights', path: '/flights' },
  { name: 'Destinations', path: '/destinations' },
  { name: 'Currencies', path: '/currencies' },
  { name: 'My Bookings', path: '/my-bookings' },
  { name: 'Contact', path: '/contact' },
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const { dark, toggleTheme } = useTheme();
  const { items: wishlistItems } = useWishlist();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', onScroll);
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [location]);

  const handleNavClick = () => {
    setMobileOpen(false);
  };

  return (
    <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
      <div className="container">
        <Link to="/" className="nav-logo">
          <div className="nav-logo-icon">✈</div>
          TravelFlow
        </Link>

        <div className="nav-links">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              className={`nav-link ${location.pathname === link.path ? 'active' : ''}`}
              onClick={handleNavClick}
            >
              {link.name}
            </Link>
          ))}
          <Link to="/get-started" className="nav-cta">
            Get Started
          </Link>
          <Link to="/wishlist" className="nav-wishlist-btn" title="Wishlist">
            ♥{wishlistItems.length > 0 && <span className="nav-wishlist-count">{wishlistItems.length}</span>}
          </Link>
          <button className="theme-toggle" onClick={toggleTheme} aria-label="Toggle dark mode" title={dark ? 'Light mode' : 'Dark mode'}>
            {dark ? '☀️' : '🌙'}
          </button>
        </div>

        <button
          className={`hamburger ${mobileOpen ? 'open' : ''}`}
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>

      <div
        className={`mobile-overlay ${mobileOpen ? 'open' : ''}`}
        onClick={() => setMobileOpen(false)}
      />
      <div className={`mobile-menu ${mobileOpen ? 'open' : ''}`}>
        {navLinks.map((link) => (
          <Link
            key={link.name}
            to={link.path}
            className={`nav-link ${location.pathname === link.path ? 'active' : ''}`}
            onClick={handleNavClick}
          >
            {link.name}
          </Link>
        ))}
        <Link to="/get-started" className="btn btn-primary btn-sm" onClick={handleNavClick}>
          Get Started
        </Link>
        <div className="mobile-menu-actions">
          <Link to="/wishlist" className="nav-wishlist-btn" onClick={handleNavClick} title="Wishlist">
            ♥{wishlistItems.length > 0 && <span className="nav-wishlist-count">{wishlistItems.length}</span>}
          </Link>
          <button className="theme-toggle" onClick={toggleTheme} aria-label="Toggle dark mode">
            {dark ? '☀️' : '🌙'}
          </button>
        </div>
      </div>
    </nav>
  );
}
