import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Footer from '../components/Footer';
import { animateNavbar } from '../animations/gsapAnimations';
import '../styles/get-started.css';

gsap.registerPlugin(ScrollTrigger);

const steps = [
  {
    number: '01',
    icon: '🌍',
    title: 'Choose Your Destination',
    desc: 'Browse through our curated collection of 120+ countries and 500+ iconic destinations. Use filters to find your dream trip by budget, climate, or adventure style.',
    tip: 'Pro Tip: Check our seasonal highlights for the best deals!',
    link: '/destinations',
    linkText: 'Explore Destinations',
    color: '#2F80ED',
    gradient: 'linear-gradient(135deg, #2F80ED, #56CCF2)',
  },
  {
    number: '02',
    icon: '📅',
    title: 'Plan Your Trip',
    desc: 'Select your travel dates, number of travelers, and preferred experiences. Our AI-powered planner creates a custom itinerary tailored to your preferences.',
    tip: 'Pro Tip: Flexible dates can save you up to 30% on flights!',
    link: '/destinations',
    linkText: 'Start Planning',
    color: '#F2994A',
    gradient: 'linear-gradient(135deg, #F2994A, #F2C94C)',
  },
  {
    number: '03',
    icon: '💱',
    title: 'Check Currency Rates',
    desc: 'Compare live exchange rates for 90+ currencies. Use our Quick Convert tool to budget in your local currency so there are no surprises on the road.',
    tip: 'Pro Tip: Set rate alerts to convert at the best time!',
    link: '/currencies',
    linkText: 'View Currencies',
    color: '#27AE60',
    gradient: 'linear-gradient(135deg, #27AE60, #6FCF97)',
  },
  {
    number: '04',
    icon: '🎫',
    title: 'Book & Confirm',
    desc: 'Securely book flights, hotels, and experiences in one seamless checkout. Enjoy instant confirmation with our trusted payment partners worldwide.',
    tip: 'Pro Tip: Bundle flights + hotels to get exclusive package discounts!',
    link: '/destinations',
    linkText: 'Book Now',
    color: '#9B51E0',
    gradient: 'linear-gradient(135deg, #9B51E0, #BB6BD9)',
  },
  {
    number: '05',
    icon: '📱',
    title: 'Get Your Travel Kit',
    desc: 'Receive your digital travel kit with boarding passes, itinerary, local guides, offline maps, and emergency contacts — all in one place.',
    tip: 'Pro Tip: Download maps before your trip for offline access!',
    link: null,
    linkText: null,
    color: '#EB5757',
    gradient: 'linear-gradient(135deg, #EB5757, #F2994A)',
  },
  {
    number: '06',
    icon: '✈️',
    title: 'Travel & Enjoy!',
    desc: 'You\'re all set! Enjoy your journey with 24/7 support, real-time updates, and local recommendations powered by our worldwide traveler community.',
    tip: 'Pro Tip: Share your experience to earn reward points!',
    link: null,
    linkText: null,
    color: '#2D9CDB',
    gradient: 'linear-gradient(135deg, #2D9CDB, #56CCF2)',
  },
];

const features = [
  { icon: '🔒', title: 'Secure Payments', desc: 'Bank-level encryption protecting every transaction.' },
  { icon: '🌐', title: '120+ Countries', desc: 'Global coverage across all major destinations.' },
  { icon: '🤖', title: 'AI Trip Planner', desc: 'Smart recommendations tailored to your style.' },
  { icon: '📞', title: '24/7 Support', desc: 'Real humans available around the clock.' },
  { icon: '💰', title: 'Best Price Guarantee', desc: 'Find it cheaper? We\'ll match it, guaranteed.' },
  { icon: '⭐', title: '2M+ Travelers', desc: 'Trusted by a community of happy travelers.' },
];

const faqs = [
  { q: 'How do I create an account?', a: 'Click "Get Started" and fill in your name, email, and password. You\'ll receive a verification email to activate your account instantly.' },
  { q: 'Is it free to use TravelFlow?', a: 'Absolutely! Browsing, planning, and generating itineraries are completely free. You only pay when you book.' },
  { q: 'Can I modify my booking?', a: 'Yes, most bookings can be modified up to 48 hours before departure. Check your booking details for the specific cancellation policy.' },
  { q: 'What payment methods are accepted?', a: 'We accept all major credit/debit cards, PayPal, Apple Pay, Google Pay, and bank transfers in select regions.' },
];

export default function GetStarted() {
  const pageRef = useRef(null);

  useEffect(() => {
    const cleanupNav = animateNavbar();

    const ctx = gsap.context(() => {
      // ===== HERO ENTRANCE =====
      const heroTL = gsap.timeline({ defaults: { ease: 'power4.out' } });
      heroTL
        .fromTo('.gs-hero-badge',
          { opacity: 0, y: 20, scale: 0.85 },
          { opacity: 1, y: 0, scale: 1, duration: 0.5 }
        )
        .fromTo('.gs-hero-title',
          { opacity: 0, y: 50, clipPath: 'inset(0 0 100% 0)' },
          { opacity: 1, y: 0, clipPath: 'inset(0 0 0% 0)', duration: 0.8 },
          '-=0.2'
        )
        .fromTo('.gs-hero-sub',
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.5 },
          '-=0.4'
        )
        .fromTo('.gs-hero-cta',
          { opacity: 0, y: 20, scale: 0.9 },
          { opacity: 1, y: 0, scale: 1, duration: 0.5 },
          '-=0.2'
        );

      // ===== TIMELINE CONNECTOR LINE DRAW =====
      gsap.fromTo('.gs-timeline-line',
        { scaleY: 0 },
        {
          scaleY: 1,
          ease: 'none',
          scrollTrigger: {
            trigger: '.gs-steps',
            start: 'top 70%',
            end: 'bottom 60%',
            scrub: 1.2,
          },
        }
      );

      // ===== STEP CARDS — ALTERNATING SLIDE =====
      gsap.utils.toArray('.gs-step').forEach((step, i) => {
        const isLeft = i % 2 === 0;
        gsap.fromTo(step,
          {
            opacity: 0,
            x: isLeft ? -80 : 80,
            rotateY: isLeft ? -8 : 8,
            transformPerspective: 1200,
          },
          {
            opacity: 1,
            x: 0,
            rotateY: 0,
            duration: 0.8,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: step,
              start: 'top 85%',
              toggleActions: 'play none none reverse',
            },
          }
        );

        // number badge pulse
        const badge = step.querySelector('.gs-step-number');
        if (badge) {
          gsap.fromTo(badge,
            { scale: 0, rotation: -20 },
            {
              scale: 1,
              rotation: 0,
              duration: 0.6,
              ease: 'back.out(2)',
              scrollTrigger: {
                trigger: step,
                start: 'top 82%',
                toggleActions: 'play none none reverse',
              },
            }
          );
        }
      });

      // ===== FEATURES SECTION =====
      gsap.fromTo('.gs-features-title',
        { opacity: 0, y: 40 },
        {
          opacity: 1, y: 0, duration: 0.7, ease: 'power3.out',
          scrollTrigger: { trigger: '.gs-features', start: 'top 80%', toggleActions: 'play none none reverse' },
        }
      );

      gsap.utils.toArray('.gs-feature-card').forEach((card, i) => {
        gsap.fromTo(card,
          { opacity: 0, y: 50, scale: 0.88, rotateX: 10, transformPerspective: 1000 },
          {
            opacity: 1, y: 0, scale: 1, rotateX: 0,
            duration: 0.65,
            delay: i * 0.08,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: card,
              start: 'top 90%',
              toggleActions: 'play none none reverse',
            },
          }
        );
      });

      // ===== FAQ SECTION =====
      gsap.fromTo('.gs-faq-title',
        { opacity: 0, y: 30 },
        {
          opacity: 1, y: 0, duration: 0.6,
          scrollTrigger: { trigger: '.gs-faq', start: 'top 80%', toggleActions: 'play none none reverse' },
        }
      );

      gsap.utils.toArray('.gs-faq-item').forEach((item, i) => {
        gsap.fromTo(item,
          { opacity: 0, x: i % 2 === 0 ? -40 : 40 },
          {
            opacity: 1, x: 0, duration: 0.6,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: item,
              start: 'top 88%',
              toggleActions: 'play none none reverse',
            },
          }
        );
      });

      // ===== CTA SECTION =====
      gsap.fromTo('.gs-cta-box',
        { opacity: 0, y: 60, scale: 0.92 },
        {
          opacity: 1, y: 0, scale: 1, duration: 0.8,
          ease: 'power3.out',
          scrollTrigger: { trigger: '.gs-cta', start: 'top 85%', toggleActions: 'play none none reverse' },
        }
      );

    }, pageRef);

    return () => {
      ctx.revert();
      if (cleanupNav) cleanupNav();
    };
  }, []);

  return (
    <div className="gs-page" ref={pageRef}>
      {/* ===== HERO ===== */}
      <section className="gs-hero">
        <div className="gs-hero-bg-shapes">
          <div className="gs-shape gs-shape-1" />
          <div className="gs-shape gs-shape-2" />
          <div className="gs-shape gs-shape-3" />
        </div>
        <div className="container">
          <span className="gs-hero-badge">🚀 Start Your Journey</span>
          <h1 className="gs-hero-title">
            Your Adventure Begins<br />
            <span className="gs-gradient-text">In Just 6 Steps</span>
          </h1>
          <p className="gs-hero-sub">
            From dreaming to departing — we've made every step simple, fast, and secure.
            Follow our guided process to plan the perfect trip.
          </p>
          <a href="#steps" className="gs-hero-cta">
            See the Steps ↓
          </a>
        </div>
      </section>

      {/* ===== STEPS TIMELINE ===== */}
      <section className="gs-steps section" id="steps">
        <div className="container">
          <h2 className="section-title">Step-by-Step Guide</h2>
          <p className="section-subtitle" style={{ marginBottom: '60px' }}>
            Follow these steps to plan, book, and enjoy your dream trip
          </p>

          <div className="gs-timeline">
            <div className="gs-timeline-line" />

            {steps.map((step, i) => (
              <div className={`gs-step ${i % 2 === 0 ? 'gs-step-left' : 'gs-step-right'}`} key={step.number}>
                <div className="gs-step-number" style={{ background: step.gradient }}>
                  {step.number}
                </div>
                <div className="gs-step-card">
                  <div className="gs-step-icon">{step.icon}</div>
                  <h3 className="gs-step-title">{step.title}</h3>
                  <p className="gs-step-desc">{step.desc}</p>
                  <div className="gs-step-tip">
                    <span className="gs-tip-icon">💡</span>
                    {step.tip}
                  </div>
                  {step.link && (
                    <Link to={step.link} className="gs-step-link" style={{ color: step.color }}>
                      {step.linkText} →
                    </Link>
                  )}
                  <div className="gs-step-accent" style={{ background: step.gradient }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== WHY TRAVELFLOW ===== */}
      <section className="gs-features section">
        <div className="container">
          <h2 className="section-title gs-features-title">Why TravelFlow?</h2>
          <p className="section-subtitle" style={{ marginBottom: '50px' }}>
            Everything you need for a flawless trip, all in one platform
          </p>

          <div className="gs-features-grid">
            {features.map((f, i) => (
              <div className="gs-feature-card" key={i}>
                <div className="gs-feature-icon">{f.icon}</div>
                <h4 className="gs-feature-title">{f.title}</h4>
                <p className="gs-feature-desc">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== FAQ ===== */}
      <section className="gs-faq section">
        <div className="container">
          <h2 className="section-title gs-faq-title">Common Questions</h2>
          <p className="section-subtitle" style={{ marginBottom: '40px' }}>
            Quick answers to help you get started
          </p>

          <div className="gs-faq-grid">
            {faqs.map((item, i) => (
              <div className="gs-faq-item" key={i}>
                <div className="gs-faq-q">
                  <span className="gs-faq-q-icon">❓</span>
                  {item.q}
                </div>
                <div className="gs-faq-a">{item.a}</div>
              </div>
            ))}
          </div>

          <div className="gs-faq-more">
            <Link to="/faqs" className="gs-faq-more-link">View All FAQs →</Link>
          </div>
        </div>
      </section>

      {/* ===== CTA ===== */}
      <section className="gs-cta section">
        <div className="container">
          <div className="gs-cta-box">
            <div className="gs-cta-shapes">
              <div className="gs-cta-shape gs-cta-shape-1" />
              <div className="gs-cta-shape gs-cta-shape-2" />
            </div>
            <h2 className="gs-cta-title">Ready to Explore the World?</h2>
            <p className="gs-cta-sub">
              Join 2 million+ travelers who trust TravelFlow. Start planning your next adventure today!
            </p>
            <div className="gs-cta-buttons">
              <Link to="/destinations" className="btn btn-primary">Browse Destinations</Link>
              <Link to="/contact" className="btn btn-outline">Contact Us</Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
