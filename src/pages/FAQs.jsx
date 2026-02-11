import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { gsap } from 'gsap';
import Footer from '../components/Footer';
import { animateNavbar } from '../animations/gsapAnimations';
import '../styles/legal.css';

const faqData = [
  {
    category: 'General',
    icon: '🌍',
    questions: [
      { q: 'What is TravelFlow?', a: 'TravelFlow is a comprehensive travel planning platform that helps you discover destinations, compare prices in 130+ currencies, book trips, and manage your travel itinerary — all in one place.' },
      { q: 'Is TravelFlow free to use?', a: 'Yes! Browsing destinations, currency conversion, and trip planning tools are completely free. You only pay when you book a trip or add optional services like travel insurance.' },
      { q: 'Which countries does TravelFlow operate in?', a: 'We currently offer curated travel packages to 12+ destinations across 6 continents, with new destinations being added regularly. Our currency tools cover 130+ currencies worldwide.' },
      { q: 'Do I need an account to book?', a: 'Yes, you need a free TravelFlow account to make bookings. This allows us to send you confirmations, manage your bookings, and provide customer support.' },
    ],
  },
  {
    category: 'Booking',
    icon: '🎫',
    questions: [
      { q: 'How do I book a trip?', a: 'Browse our destinations, click on one you like, view the detailed itinerary, and click "Book Now." Fill in your traveler details, review the GST-inclusive pricing, and complete secure payment.' },
      { q: 'Can I book for multiple travelers?', a: 'Absolutely! During booking, use the traveler counter to add up to 10 travelers per booking. For groups larger than 10, contact our group travel team.' },
      { q: 'Can I modify my booking after payment?', a: 'Yes, modifications are allowed up to 72 hours before departure. You can change dates and traveler count through your dashboard, subject to availability and possible price adjustments.' },
      { q: 'What is the cancellation policy?', a: 'Free cancellation up to 7 days before departure. Cancellations 3-7 days prior incur a 15% fee. Within 3 days, up to 25% fee applies. Refunds are processed in 5-7 business days.' },
      { q: 'Will I receive a booking confirmation?', a: 'Yes, an instant confirmation email with your booking ID, itinerary, and e-ticket is sent immediately after successful payment.' },
    ],
  },
  {
    category: 'Payments & GST',
    icon: '💰',
    questions: [
      { q: 'What payment methods are accepted?', a: 'We accept Credit/Debit Cards (Visa, Mastercard, Amex, RuPay), UPI (GPay, PhonePe, Paytm, BHIM), Net Banking from all major banks, and digital wallets.' },
      { q: 'Is GST included in the displayed price?', a: 'Prices shown on destination pages are base prices. During checkout, 18% GST (9% CGST + 9% SGST) is calculated and displayed separately before payment, so you see the full breakdown.' },
      { q: 'Can I get a GST invoice?', a: 'Yes, a detailed GST invoice with GSTIN, SAC code, and tax breakdown is automatically generated and emailed after every successful transaction.' },
      { q: 'Are payments secure?', a: 'All payments are processed through 256-bit SSL encrypted gateways compliant with PCI DSS Level 1. We never store your complete card information on our servers.' },
      { q: 'How do refunds work?', a: 'Eligible refunds are processed to the original payment method within 5-7 business days. GST is refunded proportionally. You\'ll receive an email notification when the refund is initiated.' },
    ],
  },
  {
    category: 'Travel',
    icon: '✈️',
    questions: [
      { q: 'Do you arrange flights?', a: 'Our packages typically include airport transfers at the destination. International flights can be arranged as an add-on service, or you can book them separately.' },
      { q: 'Is travel insurance included?', a: 'Basic coverage is included with all bookings. Comprehensive travel insurance covering medical, cancellation, and baggage is available as an add-on starting at $15/trip.' },
      { q: 'What about visa requirements?', a: 'Visa requirements are shown on each destination page based on your nationality. We also offer visa assistance services to help with applications and documentation.' },
      { q: 'Are meals included in packages?', a: 'Most packages include breakfast daily. Specific meal inclusions vary by destination and are clearly listed in the "What\'s Included" section of each package.' },
    ],
  },
  {
    category: 'Account',
    icon: '👤',
    questions: [
      { q: 'How do I reset my password?', a: 'Click "Forgot Password" on the login page, enter your registered email, and follow the secure reset link sent to your inbox. The link is valid for 24 hours.' },
      { q: 'Can I delete my account?', a: 'Yes, go to Settings > Privacy > Delete Account. All personal data will be permanently deleted within 30 days. Active bookings must be completed or cancelled first.' },
      { q: 'How is my data protected?', a: 'We use industry-standard encryption, regular security audits, and comply with GDPR and Indian data protection regulations. See our Privacy Policy for complete details.' },
    ],
  },
];

export default function FAQs() {
  const pageRef = useRef(null);
  const [openIndex, setOpenIndex] = useState(null);
  const [activeTab, setActiveTab] = useState(0);

  useEffect(() => {
    const cleanup = animateNavbar();
    window.scrollTo(0, 0);

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
      tl.fromTo('.lp-hero', { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 0.6 })
        .fromTo('.lp-hero-content > *', { opacity: 0, y: 25 }, { opacity: 1, y: 0, duration: 0.45, stagger: 0.1 }, '-=0.3')
        .fromTo('.faq-tab', { opacity: 0, y: 15, scale: 0.9 }, { opacity: 1, y: 0, scale: 1, duration: 0.4, stagger: 0.06 }, '-=0.2')
        .fromTo('.faq-item', { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.4, stagger: 0.05 }, '-=0.2');
    }, pageRef);

    return () => { ctx.revert(); if (cleanup) cleanup(); };
  }, []);

  const switchTab = (idx) => {
    gsap.to('.faq-list', {
      opacity: 0, y: 10, duration: 0.2,
      onComplete: () => {
        setActiveTab(idx);
        setOpenIndex(null);
        gsap.fromTo('.faq-list', { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.35 });
        gsap.fromTo('.faq-item', { opacity: 0, x: -15 }, { opacity: 1, x: 0, duration: 0.3, stagger: 0.05, delay: 0.1 });
      },
    });
  };

  const toggleQuestion = (idx) => {
    if (openIndex === idx) {
      gsap.to(`.faq-answer-${idx}`, { height: 0, opacity: 0, duration: 0.3, ease: 'power2.inOut' });
      setOpenIndex(null);
    } else {
      if (openIndex !== null) {
        gsap.to(`.faq-answer-${openIndex}`, { height: 0, opacity: 0, duration: 0.2 });
      }
      setOpenIndex(idx);
      requestAnimationFrame(() => {
        gsap.fromTo(`.faq-answer-${idx}`, { height: 0, opacity: 0 }, { height: 'auto', opacity: 1, duration: 0.35, ease: 'power3.out' });
      });
    }
  };

  const currentFaq = faqData[activeTab];

  return (
    <div className="lp-page" ref={pageRef}>
      <section className="lp-hero lp-hero-faq">
        <div className="lp-hero-bg" />
        <div className="lp-hero-content">
          <span className="lp-hero-badge">📋 Support</span>
          <h1 className="lp-hero-title">Frequently Asked Questions</h1>
          <p className="lp-hero-sub">Quick answers to common questions about TravelFlow</p>
        </div>
      </section>

      <section className="lp-section">
        <div className="lp-container">
          {/* Tabs */}
          <div className="faq-tabs">
            {faqData.map((cat, i) => (
              <button
                key={cat.category}
                className={`faq-tab ${activeTab === i ? 'active' : ''}`}
                onClick={() => switchTab(i)}
              >
                <span className="faq-tab-icon">{cat.icon}</span>
                <span>{cat.category}</span>
              </button>
            ))}
          </div>

          {/* Questions */}
          <div className="faq-list">
            <div className="faq-category-header">
              <span className="faq-category-icon">{currentFaq.icon}</span>
              <h2>{currentFaq.category}</h2>
              <span className="faq-category-count">{currentFaq.questions.length} questions</span>
            </div>

            {currentFaq.questions.map((item, idx) => (
              <div className={`faq-item ${openIndex === idx ? 'open' : ''}`} key={idx}>
                <button className="faq-question" onClick={() => toggleQuestion(idx)}>
                  <span className="faq-q-text">{item.q}</span>
                  <span className={`faq-toggle ${openIndex === idx ? 'open' : ''}`}>
                    {openIndex === idx ? '−' : '+'}
                  </span>
                </button>
                <div className={`faq-answer faq-answer-${idx}`} style={{ height: openIndex === idx ? 'auto' : 0, opacity: openIndex === idx ? 1 : 0, overflow: 'hidden' }}>
                  <p>{item.a}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="lp-section">
        <div className="lp-container">
          <div className="lp-cta-card">
            <h2>Can't find what you're looking for?</h2>
            <p>Our support team is here to help you 24/7</p>
            <div className="lp-cta-actions">
              <Link to="/help" className="btn btn-primary btn-lg">Visit Help Center</Link>
              <Link to="/contact" className="btn btn-outline btn-lg">Contact Support</Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
