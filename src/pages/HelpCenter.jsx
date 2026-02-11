import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Footer from '../components/Footer';
import { animateNavbar } from '../animations/gsapAnimations';
import '../styles/legal.css';

gsap.registerPlugin(ScrollTrigger);

const categories = [
  {
    id: 'booking',
    icon: '🎫',
    title: 'Booking & Reservations',
    desc: 'How to book, modify, or cancel your trips',
    articles: [
      { title: 'How to book a trip', content: 'Browse destinations, select your preferred package, fill in traveler details, and proceed to secure payment. You\'ll receive instant confirmation via email.' },
      { title: 'Modifying a booking', content: 'You can modify your booking up to 72 hours before departure through your account dashboard. Changes to dates and traveler count are subject to availability.' },
      { title: 'Cancellation policy', content: 'Free cancellation is available up to 7 days before departure. Cancellations within 7 days may incur a fee of up to 25% of the booking amount.' },
      { title: 'Group bookings', content: 'For groups of 10+, contact our dedicated group travel team for custom packages and discounted rates. Email groups@travelflow.com.' },
    ],
  },
  {
    id: 'payment',
    icon: '💳',
    title: 'Payments & Billing',
    desc: 'Payment methods, invoices, refunds & GST',
    articles: [
      { title: 'Accepted payment methods', content: 'We accept Visa, Mastercard, American Express, RuPay, UPI (GPay, PhonePe, Paytm, BHIM), Net Banking from all major Indian banks, and digital wallets.' },
      { title: 'GST & Tax information', content: 'All bookings include 18% GST (9% CGST + 9% SGST) as per Indian tax regulations. A detailed GST invoice is generated and emailed upon successful payment.' },
      { title: 'Refund process', content: 'Refunds are processed within 5-7 business days to the original payment method. GST refunds are adjusted proportionally based on the cancellation terms.' },
      { title: 'Payment security', content: 'All transactions are secured with 256-bit SSL encryption and comply with PCI DSS standards. We never store your full card details on our servers.' },
    ],
  },
  {
    id: 'account',
    icon: '👤',
    title: 'Account & Profile',
    desc: 'Managing your account settings',
    articles: [
      { title: 'Creating an account', content: 'Sign up with your email or social accounts (Google, Facebook). Verify your email to unlock all features including wishlists and trip history.' },
      { title: 'Updating profile info', content: 'Navigate to Settings > Profile to update your name, email, phone number, and travel preferences. Changes are saved instantly.' },
      { title: 'Password reset', content: 'Click "Forgot Password" on the login page. A secure reset link will be sent to your registered email, valid for 24 hours.' },
      { title: 'Deleting your account', content: 'Account deletion can be requested through Settings > Privacy > Delete Account. All personal data will be permanently removed within 30 days.' },
    ],
  },
  {
    id: 'travel',
    icon: '✈️',
    title: 'Travel Information',
    desc: 'Visa, insurance, and travel tips',
    articles: [
      { title: 'Visa requirements', content: 'Visa requirements vary by destination and nationality. Our system provides real-time visa information during booking. We also offer assisted visa application services.' },
      { title: 'Travel insurance', content: 'We recommend purchasing comprehensive travel insurance. Our partner plans start from $15/trip and cover medical emergencies, trip cancellation, and lost baggage.' },
      { title: 'COVID-19 guidelines', content: 'Travel requirements are regularly updated. Check the destination page for current COVID-19 entry requirements including vaccination and testing policies.' },
      { title: 'Packing & preparation tips', content: 'Each destination page includes weather forecasts, packing suggestions, and local etiquette guidelines to help you prepare for your trip.' },
    ],
  },
  {
    id: 'support',
    icon: '🛟',
    title: 'Customer Support',
    desc: 'How to reach us for help',
    articles: [
      { title: 'Contact methods', content: 'Reach us via live chat (24/7), email at support@travelflow.com, or phone at +1-800-TRAVEL-FLOW. Response times: Chat < 2 min, Email < 4 hours.' },
      { title: 'Emergency assistance', content: 'For emergencies during travel, call our 24/7 emergency hotline at +1-800-555-0199. We provide real-time support for medical, safety, and logistical emergencies.' },
      { title: 'Feedback & complaints', content: 'We value your feedback. Submit through the Contact page or email feedback@travelflow.com. All complaints are acknowledged within 24 hours and resolved within 5 business days.' },
      { title: 'Accessibility support', content: 'We are committed to accessible travel. Contact our accessibility team for wheelchair-accessible accommodations, sign language guides, and other special requirements.' },
    ],
  },
];

export default function HelpCenter() {
  const pageRef = useRef(null);
  const [activeCategory, setActiveCategory] = useState(null);
  const [activeArticle, setActiveArticle] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const cleanup = animateNavbar();
    window.scrollTo(0, 0);

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
      tl.fromTo('.lp-hero', { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 0.6 })
        .fromTo('.lp-hero-content > *', { opacity: 0, y: 25 }, { opacity: 1, y: 0, duration: 0.45, stagger: 0.1 }, '-=0.3')
        .fromTo('.hc-category-card', { opacity: 0, y: 30, scale: 0.95 }, {
          opacity: 1, y: 0, scale: 1, duration: 0.5, stagger: 0.08, ease: 'back.out(1.4)',
        }, '-=0.2');
    }, pageRef);

    return () => { ctx.revert(); if (cleanup) cleanup(); };
  }, []);

  const toggleCategory = (id) => {
    if (activeCategory === id) {
      gsap.to(`.hc-articles-${id}`, { height: 0, opacity: 0, duration: 0.35, ease: 'power2.inOut' });
      setActiveCategory(null);
    } else {
      if (activeCategory) {
        gsap.to(`.hc-articles-${activeCategory}`, { height: 0, opacity: 0, duration: 0.25 });
      }
      setActiveCategory(id);
      requestAnimationFrame(() => {
        const el = document.querySelector(`.hc-articles-${id}`);
        if (el) {
          gsap.fromTo(el, { height: 0, opacity: 0 }, { height: 'auto', opacity: 1, duration: 0.4, ease: 'power3.out' });
          gsap.fromTo(`.hc-articles-${id} .hc-article`, { opacity: 0, x: -15 }, { opacity: 1, x: 0, duration: 0.3, stagger: 0.06, delay: 0.1 });
        }
      });
    }
    setActiveArticle(null);
  };

  const filteredCategories = searchQuery
    ? categories.map(cat => ({
        ...cat,
        articles: cat.articles.filter(a =>
          a.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          a.content.toLowerCase().includes(searchQuery.toLowerCase())
        ),
      })).filter(cat => cat.articles.length > 0)
    : categories;

  return (
    <div className="lp-page" ref={pageRef}>
      {/* Hero */}
      <section className="lp-hero lp-hero-help">
        <div className="lp-hero-bg" />
        <div className="lp-hero-content">
          <span className="lp-hero-badge">🛟 Support</span>
          <h1 className="lp-hero-title">Help Center</h1>
          <p className="lp-hero-sub">Find answers, guides, and support for your TravelFlow experience</p>
          <div className="hc-search-wrap">
            <span className="hc-search-icon">🔍</span>
            <input
              className="hc-search-input"
              type="text"
              placeholder="Search for help articles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </section>

      {/* Quick Links */}
      <section className="lp-section">
        <div className="lp-container">
          <div className="hc-quick-links">
            <Link to="/faqs" className="hc-quick-link">📋 FAQs</Link>
            <Link to="/contact" className="hc-quick-link">💬 Contact Us</Link>
            <Link to="/privacy" className="hc-quick-link">🔒 Privacy Policy</Link>
            <Link to="/terms" className="hc-quick-link">📜 Terms of Service</Link>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="lp-section" style={{ paddingTop: 0 }}>
        <div className="lp-container">
          <div className="hc-categories">
            {filteredCategories.map((cat) => (
              <div className="hc-category-card" key={cat.id}>
                <button className={`hc-category-header ${activeCategory === cat.id ? 'active' : ''}`} onClick={() => toggleCategory(cat.id)}>
                  <div className="hc-category-left">
                    <span className="hc-category-icon">{cat.icon}</span>
                    <div>
                      <h3 className="hc-category-title">{cat.title}</h3>
                      <p className="hc-category-desc">{cat.desc}</p>
                    </div>
                  </div>
                  <span className="hc-category-count">{cat.articles.length} articles</span>
                  <span className={`hc-category-arrow ${activeCategory === cat.id ? 'open' : ''}`}>▾</span>
                </button>

                <div className={`hc-articles hc-articles-${cat.id}`} style={{ height: activeCategory === cat.id ? 'auto' : 0, opacity: activeCategory === cat.id ? 1 : 0, overflow: 'hidden' }}>
                  {cat.articles.map((article, j) => (
                    <div className="hc-article" key={j}>
                      <button
                        className={`hc-article-header ${activeArticle === `${cat.id}-${j}` ? 'active' : ''}`}
                        onClick={() => setActiveArticle(activeArticle === `${cat.id}-${j}` ? null : `${cat.id}-${j}`)}
                      >
                        <span>{article.title}</span>
                        <span className={`hc-article-toggle ${activeArticle === `${cat.id}-${j}` ? 'open' : ''}`}>+</span>
                      </button>
                      {activeArticle === `${cat.id}-${j}` && (
                        <div className="hc-article-content">
                          <p>{article.content}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {filteredCategories.length === 0 && (
            <div className="hc-no-results">
              <span>🔍</span>
              <h3>No results found</h3>
              <p>Try different keywords or <Link to="/contact">contact support</Link></p>
            </div>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="lp-section">
        <div className="lp-container">
          <div className="lp-cta-card">
            <h2>Still need help?</h2>
            <p>Our support team is available 24/7 to assist you</p>
            <div className="lp-cta-actions">
              <Link to="/contact" className="btn btn-primary btn-lg">Contact Support</Link>
              <a href="mailto:support@travelflow.com" className="btn btn-outline btn-lg">Email Us</a>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
