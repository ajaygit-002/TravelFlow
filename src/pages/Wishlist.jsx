import { useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { gsap } from 'gsap';
import { useWishlist } from '../context/WishlistContext';
import Footer from '../components/Footer';
import '../styles/wishlist.css';

export default function Wishlist() {
  const { items, removeItem, clearWishlist } = useWishlist();
  const navigate = useNavigate();
  const pageRef = useRef(null);

  useEffect(() => {
    if (!pageRef.current) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(pageRef.current, { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' });
      gsap.fromTo('.wl-card', { opacity: 0, y: 40, scale: 0.95 }, {
        opacity: 1, y: 0, scale: 1, duration: 0.5, stagger: 0.08, ease: 'power3.out', delay: 0.2,
      });
    }, pageRef);
    return () => ctx.revert();
  }, [items.length]);

  const destinations = items.filter((i) => i.type === 'destination');
  const flights = items.filter((i) => i.type === 'flight');

  return (
    <div className="wl-page" ref={pageRef}>
      {/* Hero */}
      <section className="wl-hero">
        <div className="container">
          <span className="wl-hero-badge">♥ Your Collection</span>
          <h1 className="wl-hero-title">Wishlist</h1>
          <p className="wl-hero-subtitle">
            {items.length === 0
              ? 'Start exploring and save your favorites here!'
              : `You have ${items.length} saved item${items.length > 1 ? 's' : ''}`}
          </p>
        </div>
      </section>

      <div className="container wl-container">
        {items.length === 0 ? (
          <div className="wl-empty">
            <div className="wl-empty-icon">💝</div>
            <h2>Your wishlist is empty</h2>
            <p>Explore destinations and flights to add your favorites here</p>
            <div className="wl-empty-actions">
              <Link to="/destinations" className="btn btn-primary">Browse Destinations</Link>
              <Link to="/flights" className="btn btn-outline">Search Flights</Link>
            </div>
          </div>
        ) : (
          <>
            {/* Clear all */}
            <div className="wl-toolbar">
              <span className="wl-count">{items.length} item{items.length > 1 ? 's' : ''}</span>
              <button className="wl-clear-btn" onClick={clearWishlist}>Clear All</button>
            </div>

            {/* Destinations */}
            {destinations.length > 0 && (
              <section className="wl-section">
                <h2 className="wl-section-title">🌍 Saved Destinations</h2>
                <div className="wl-grid">
                  {destinations.map((item) => (
                    <div className="wl-card" key={`${item.type}-${item.id}`}>
                      <div className="wl-card-img-wrap">
                        <img src={item.image} alt={item.name} className="wl-card-img" loading="lazy" />
                        <button className="wl-remove-btn" onClick={() => removeItem(item.id, item.type)} title="Remove">✕</button>
                      </div>
                      <div className="wl-card-body">
                        <div className="wl-card-row">
                          <h3 className="wl-card-title">{item.flag} {item.name}</h3>
                          <span className="wl-card-price">{item.price}</span>
                        </div>
                        <p className="wl-card-desc">{item.desc}</p>
                        <div className="wl-card-meta">
                          {item.duration && <span className="wl-tag">🕐 {item.duration}</span>}
                          {item.rating && <span className="wl-tag">⭐ {item.rating}</span>}
                        </div>
                        <button className="wl-view-btn" onClick={() => navigate(`/destination/${item.id}`)}>
                          View Details →
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Flights */}
            {flights.length > 0 && (
              <section className="wl-section">
                <h2 className="wl-section-title">✈️ Saved Flights</h2>
                <div className="wl-flights-grid">
                  {flights.map((item) => (
                    <div className="wl-card wl-flight-card" key={`${item.type}-${item.id}`}>
                      <button className="wl-remove-btn wl-remove-btn-flight" onClick={() => removeItem(item.id, item.type)} title="Remove">✕</button>
                      <div className="wl-flight-header">
                        <span className="wl-flight-airline">{item.airline}</span>
                        <span className="wl-flight-class">{item.cabinClass}</span>
                      </div>
                      <div className="wl-flight-route">
                        <span className="wl-flight-city">{item.from}</span>
                        <span className="wl-flight-arrow">→</span>
                        <span className="wl-flight-city">{item.to}</span>
                      </div>
                      <div className="wl-flight-details">
                        <span className="wl-tag">⏱ {item.duration}</span>
                        <span className="wl-flight-price">{item.price}</span>
                      </div>
                      <button className="wl-view-btn" onClick={() => navigate('/flights')}>
                        Book Now →
                      </button>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </>
        )}
      </div>

      <Footer />
    </div>
  );
}
