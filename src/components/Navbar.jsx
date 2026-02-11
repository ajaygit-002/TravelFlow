import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import '../styles/navbar.css';

const navLinks = [
  { name: 'Home', path: '/' },
  { name: 'About', path: '/about' },
  { name: 'Services', path: '/#services' },
  { name: 'Destinations', path: '/destinations' },
  { name: 'Currencies', path: '/currencies' },
  { name: 'Contact', path: '/contact' },
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', onScroll);
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [location]);

  const handleNavClick = (path) => {
    if (path.includes('#')) {
      const id = path.split('#')[1];
      const el = document.getElementById(id);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
        setMobileOpen(false);
        return;
      }
    }
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
              onClick={() => handleNavClick(link.path)}
            >
              {link.name}
            </Link>
          ))}
          <Link to="/contact" className="nav-cta">
            Get Started
          </Link>
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
            onClick={() => handleNavClick(link.path)}
          >
            {link.name}
          </Link>
        ))}
        <Link to="/contact" className="btn btn-primary btn-sm" onClick={() => setMobileOpen(false)}>
          Get Started
        </Link>
      </div>
    </nav>
  );
}
