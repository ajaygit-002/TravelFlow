import { useEffect, useRef, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import destinations from '../data/destinations';
import Footer from '../components/Footer';
import ReviewSection from '../components/ReviewSection';
import { useWishlist } from '../context/WishlistContext';
import '../styles/destination-detail.css';

gsap.registerPlugin(ScrollTrigger);

export default function DestinationDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const pageRef = useRef(null);
  const dest = destinations.find((d) => d.id === id);
  const [lightboxIdx, setLightboxIdx] = useState(null);
  const { toggleItem, isInWishlist } = useWishlist();

  useEffect(() => {
    if (!dest || !pageRef.current) return;

    window.scrollTo(0, 0);

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

      /* Page entrance */
      tl.fromTo(pageRef.current, { opacity: 0, y: 60 }, { opacity: 1, y: 0, duration: 0.7 });

      /* Hero image */
      tl.fromTo('.dd-hero-img', { scale: 1.2, opacity: 0 }, { scale: 1, opacity: 1, duration: 1 }, '-=0.5');

      /* Hero overlay content stagger */
      tl.fromTo(
        '.dd-hero-content > *',
        { opacity: 0, y: 40 },
        { opacity: 1, y: 0, duration: 0.6, stagger: 0.15 },
        '-=0.4'
      );

      /* Info bar */
      tl.fromTo('.dd-info-bar', { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.5 }, '-=0.2');

      /* Scroll-triggered sections */
      const scrollSections = [
        '.dd-about-section',
        '.dd-highlights-section',
        '.dd-itinerary-section',
        '.dd-gallery-section',
        '.dd-included-section',
        '.dd-reviews-section',
        '.dd-cta-section',
      ];

      scrollSections.forEach((sel) => {
        const el = document.querySelector(sel);
        if (!el) return;
        gsap.fromTo(el,
          { opacity: 0, y: 50 },
          {
            opacity: 1, y: 0, duration: 0.7, ease: 'power3.out',
            scrollTrigger: { trigger: el, start: 'top 85%', toggleActions: 'play none none reverse' },
          }
        );
      });

      /* Highlight cards stagger */
      gsap.fromTo('.dd-highlight-card',
        { opacity: 0, y: 40, scale: 0.92 },
        {
          opacity: 1, y: 0, scale: 1, duration: 0.55, stagger: 0.12, ease: 'power3.out',
          scrollTrigger: { trigger: '.dd-highlights-grid', start: 'top 85%', toggleActions: 'play none none reverse' },
        }
      );

      /* Itinerary days stagger */
      gsap.fromTo('.dd-day-card',
        { opacity: 0, x: -40 },
        {
          opacity: 1, x: 0, duration: 0.5, stagger: 0.12, ease: 'power3.out',
          scrollTrigger: { trigger: '.dd-itinerary-list', start: 'top 85%', toggleActions: 'play none none reverse' },
        }
      );

      /* Gallery images */
      gsap.fromTo('.dd-gallery-img',
        { opacity: 0, scale: 0.9 },
        {
          opacity: 1, scale: 1, duration: 0.5, stagger: 0.1, ease: 'power3.out',
          scrollTrigger: { trigger: '.dd-gallery-grid', start: 'top 85%', toggleActions: 'play none none reverse' },
        }
      );
    }, pageRef);

    return () => ctx.revert();
  }, [dest]);

  const handleBack = () => {
    const tl = gsap.timeline({
      onComplete: () => navigate(-1),
    });
    tl.to(pageRef.current, { opacity: 0, y: -40, duration: 0.4, ease: 'power2.in' });
  };

  if (!dest) {
    return (
      <div className="dd-not-found">
        <h2>Destination not found</h2>
        <button className="btn btn-primary" onClick={() => navigate('/')}>Back to Home</button>
      </div>
    );
  }

  return (
    <div className="dd-page" ref={pageRef}>
      {/* Hero */}
      <section className="dd-hero">
        <img className="dd-hero-img" src={dest.heroImage} alt={dest.name} />
        <div className="dd-hero-overlay" />
        <div className="dd-hero-content">
          <div className="dd-hero-top-row">
            <button className="dd-back-btn" onClick={handleBack}>
              ← Back
            </button>
            <button
              className={`dd-wishlist-btn ${isInWishlist(dest.id, 'destination') ? 'dd-wishlisted' : ''}`}
              onClick={() => toggleItem({
                id: dest.id, type: 'destination', name: dest.name, flag: dest.flag,
                image: dest.thumb || dest.image, desc: dest.desc, price: dest.priceLabel,
                duration: dest.duration, rating: dest.rating,
              })}
              title={isInWishlist(dest.id, 'destination') ? 'Remove from wishlist' : 'Add to wishlist'}
            >
              {isInWishlist(dest.id, 'destination') ? '♥' : '♡'}
            </button>
          </div>
          <span className="dd-hero-tagline">{dest.tagline}</span>
          <h1 className="dd-hero-title">{dest.flag} {dest.name}</h1>
          <p className="dd-hero-country">{dest.country}</p>
        </div>
      </section>

      {/* Info bar */}
      <div className="dd-info-bar">
        <div className="dd-info-item">
          <span className="dd-info-icon">🕐</span>
          <div>
            <span className="dd-info-label">Duration</span>
            <span className="dd-info-value">{dest.duration}</span>
          </div>
        </div>
        <div className="dd-info-item">
          <span className="dd-info-icon">⭐</span>
          <div>
            <span className="dd-info-label">Rating</span>
            <span className="dd-info-value">{dest.rating} / 5</span>
          </div>
        </div>
        <div className="dd-info-item">
          <span className="dd-info-icon">💰</span>
          <div>
            <span className="dd-info-label">Starting From</span>
            <span className="dd-info-value dd-info-price">${dest.price}</span>
          </div>
        </div>
        <div className="dd-info-item">
          <span className="dd-info-icon">👥</span>
          <div>
            <span className="dd-info-label">Group Size</span>
            <span className="dd-info-value">2 – 12</span>
          </div>
        </div>
      </div>

      <div className="dd-container">
        {/* About */}
        <section className="dd-about-section">
          <h2 className="dd-section-title">About This Trip</h2>
          <p className="dd-about-text">{dest.longDesc}</p>
        </section>

        {/* Highlights */}
        <section className="dd-highlights-section">
          <h2 className="dd-section-title">Trip Highlights</h2>
          <div className="dd-highlights-grid">
            {dest.highlights.map((h, i) => (
              <div className="dd-highlight-card" key={i}>
                <span className="dd-highlight-icon">{h.icon}</span>
                <h4 className="dd-highlight-title">{h.title}</h4>
                <p className="dd-highlight-text">{h.text}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Itinerary */}
        <section className="dd-itinerary-section">
          <h2 className="dd-section-title">Day-by-Day Itinerary</h2>
          <div className="dd-itinerary-list">
            {dest.itinerary.map((day) => (
              <div className="dd-day-card" key={day.day}>
                <div className="dd-day-badge">Day {day.day}</div>
                <div className="dd-day-body">
                  <h4 className="dd-day-title">{day.title}</h4>
                  <ul className="dd-day-tasks">
                    {day.tasks.map((t, j) => (
                      <li key={j}>{t}</li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Gallery */}
        <section className="dd-gallery-section">
          <h2 className="dd-section-title">Gallery</h2>
          <div className="dd-gallery-grid">
            {dest.gallery.map((img, i) => (
              <img
                className="dd-gallery-img"
                src={img}
                alt={`${dest.name} ${i + 1}`}
                key={i}
                loading="lazy"
                onClick={() => setLightboxIdx(i)}
              />
            ))}
          </div>
        </section>

        {/* What's Included */}
        <section className="dd-included-section">
          <h2 className="dd-section-title">What's Included</h2>
          <div className="dd-included-grid">
            {dest.included.map((item, i) => (
              <div className="dd-included-item" key={i}>
                <span className="dd-included-check">✓</span>
                <span>{item}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Reviews */}
        <ReviewSection reviews={dest.reviews} rating={dest.rating} />

        {/* CTA */}
        <section className="dd-cta-section">
          <div className="dd-cta-card">
            <div className="dd-cta-left">
              <h3 className="dd-cta-title">Ready for {dest.name}?</h3>
              <p className="dd-cta-subtitle">Book now and secure your spot — limited availability.</p>
            </div>
            <div className="dd-cta-right">
              <div className="dd-cta-price">
                <span className="dd-cta-from">From</span>
                <span className="dd-cta-amount">${dest.price}</span>
                <span className="dd-cta-per">per person</span>
              </div>
              <button className="btn btn-primary btn-lg dd-book-btn" onClick={() => navigate(`/booking/${dest.id}`)}>
                Book Now →
              </button>
            </div>
          </div>
        </section>
      </div>

      {/* Lightbox */}
      {lightboxIdx !== null && (
        <div
          className="dd-lightbox-overlay"
          onClick={() => setLightboxIdx(null)}
          onKeyDown={(e) => {
            if (e.key === 'Escape') setLightboxIdx(null);
            if (e.key === 'ArrowRight') setLightboxIdx((prev) => (prev + 1) % dest.gallery.length);
            if (e.key === 'ArrowLeft') setLightboxIdx((prev) => (prev - 1 + dest.gallery.length) % dest.gallery.length);
          }}
          tabIndex={0}
          ref={(el) => el?.focus()}
        >
          <div className="dd-lightbox-content" onClick={(e) => e.stopPropagation()}>
            <button className="dd-lightbox-close" onClick={() => setLightboxIdx(null)}>✕</button>
            <button
              className="dd-lightbox-nav dd-lightbox-prev"
              onClick={() => setLightboxIdx((prev) => (prev - 1 + dest.gallery.length) % dest.gallery.length)}
            >
              ‹
            </button>
            <img className="dd-lightbox-img" src={dest.gallery[lightboxIdx]} alt={`${dest.name} ${lightboxIdx + 1}`} />
            <button
              className="dd-lightbox-nav dd-lightbox-next"
              onClick={() => setLightboxIdx((prev) => (prev + 1) % dest.gallery.length)}
            >
              ›
            </button>
            <div className="dd-lightbox-counter">{lightboxIdx + 1} / {dest.gallery.length}</div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
