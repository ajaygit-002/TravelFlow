import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Footer from '../components/Footer';
import { animateNavbar } from '../animations/gsapAnimations';
import '../styles/legal.css';

gsap.registerPlugin(ScrollTrigger);

const sections = [
  {
    id: 'info-collect',
    icon: '📋',
    title: '1. Information We Collect',
    content: [
      { subtitle: 'Personal Information', text: 'When you create an account or make a booking, we collect your name, email address, phone number, date of birth, and passport/ID details (when required for visa processing).' },
      { subtitle: 'Payment Information', text: 'We collect payment card details, UPI IDs, and billing addresses for transaction processing. Card information is processed through PCI DSS-compliant payment gateways and is never stored on our servers.' },
      { subtitle: 'Usage Data', text: 'We automatically collect information about how you interact with our platform, including pages visited, search queries, booking preferences, device information, IP address, and browser type.' },
      { subtitle: 'Location Data', text: 'With your consent, we collect approximate location data to provide personalized destination recommendations and currency conversion. You can disable this in your device settings.' },
    ],
  },
  {
    id: 'info-use',
    icon: '🔧',
    title: '2. How We Use Your Information',
    content: [
      { subtitle: 'Service Delivery', text: 'To process bookings, send confirmations, manage your account, provide customer support, and deliver the travel services you\'ve requested.' },
      { subtitle: 'Personalization', text: 'To customize your experience with relevant destination recommendations, pricing in your preferred currency, and tailored travel suggestions based on your history.' },
      { subtitle: 'Communication', text: 'To send booking confirmations, travel updates, security alerts, and — with your consent — promotional offers and newsletters. You can opt out of marketing emails at any time.' },
      { subtitle: 'Legal Compliance', text: 'To comply with applicable laws including GST regulations (generating tax invoices with proper GSTIN), anti-money laundering requirements, and lawful government requests.' },
    ],
  },
  {
    id: 'info-share',
    icon: '🤝',
    title: '3. Information Sharing',
    content: [
      { subtitle: 'Service Providers', text: 'We share necessary information with hotels, airlines, tour operators, and local guides to fulfill your bookings. These partners are contractually required to protect your data.' },
      { subtitle: 'Payment Processors', text: 'Payment data is shared with our PCI-compliant payment gateway partners (Razorpay, Stripe) solely for transaction processing and fraud prevention.' },
      { subtitle: 'Legal Requirements', text: 'We may disclose information when required by law, to respond to legal processes, or to protect the rights, property, and safety of TravelFlow, our users, or the public.' },
      { subtitle: 'No Selling of Data', text: 'We do NOT sell, trade, or rent your personal information to third parties for their marketing purposes. Ever.' },
    ],
  },
  {
    id: 'data-security',
    icon: '🔒',
    title: '4. Data Security',
    content: [
      { subtitle: 'Encryption', text: 'All data transmitted between your device and our servers is encrypted using 256-bit TLS/SSL. Sensitive data at rest is encrypted using AES-256 encryption.' },
      { subtitle: 'Access Controls', text: 'Access to personal data is restricted to authorized personnel only, with role-based access controls, multi-factor authentication, and comprehensive audit logging.' },
      { subtitle: 'Regular Audits', text: 'We conduct quarterly security audits, annual penetration testing, and continuous vulnerability monitoring to ensure the highest level of data protection.' },
      { subtitle: 'Incident Response', text: 'In the event of a data breach, we will notify affected users within 72 hours as required by law, along with details of the incident and steps taken to mitigate impact.' },
    ],
  },
  {
    id: 'cookies',
    icon: '🍪',
    title: '5. Cookies & Tracking',
    content: [
      { subtitle: 'Essential Cookies', text: 'Required for the platform to function — managing sessions, remembering login state, and maintaining security. These cannot be disabled.' },
      { subtitle: 'Analytics Cookies', text: 'Help us understand how visitors use TravelFlow so we can improve the experience. We use privacy-focused analytics that anonymize IP addresses.' },
      { subtitle: 'Preference Cookies', text: 'Remember your settings like preferred currency, language, and display preferences to provide a customized experience across sessions.' },
      { subtitle: 'Managing Cookies', text: 'You can manage cookie preferences through your browser settings. Disabling certain cookies may affect platform functionality.' },
    ],
  },
  {
    id: 'rights',
    icon: '⚖️',
    title: '6. Your Rights',
    content: [
      { subtitle: 'Access & Portability', text: 'You can request a copy of all personal data we hold about you in a machine-readable format. Submit requests through Settings > Privacy > Data Export.' },
      { subtitle: 'Correction', text: 'You can update your personal information at any time through your account settings, or contact support for assistance with data correction.' },
      { subtitle: 'Deletion', text: 'You can request permanent deletion of your account and associated data. Deletion is completed within 30 days, except where retention is legally required.' },
      { subtitle: 'Opt-Out', text: 'You can opt out of marketing communications, personalized recommendations, and non-essential data collection at any time through your account privacy settings.' },
    ],
  },
  {
    id: 'children',
    icon: '👶',
    title: '7. Children\'s Privacy',
    content: [
      { subtitle: '', text: 'TravelFlow is not intended for children under 16. We do not knowingly collect personal information from children under 16. If you believe we have collected data from a minor, please contact us immediately at privacy@travelflow.com and we will delete it promptly.' },
    ],
  },
  {
    id: 'changes',
    icon: '📝',
    title: '8. Changes to This Policy',
    content: [
      { subtitle: '', text: 'We may update this Privacy Policy periodically. Significant changes will be communicated via email and a prominent notice on our platform. Continued use of TravelFlow after changes constitutes acceptance of the revised policy. Last updated: February 2026.' },
    ],
  },
];

export default function PrivacyPolicy() {
  const pageRef = useRef(null);

  useEffect(() => {
    const cleanup = animateNavbar();
    window.scrollTo(0, 0);

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
      tl.fromTo('.lp-hero', { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 0.6 })
        .fromTo('.lp-hero-content > *', { opacity: 0, y: 25 }, { opacity: 1, y: 0, duration: 0.45, stagger: 0.1 }, '-=0.3');

      // Scroll-triggered sections
      gsap.utils.toArray('.pp-section').forEach((sec) => {
        gsap.fromTo(sec,
          { opacity: 0, y: 40 },
          {
            opacity: 1, y: 0, duration: 0.6, ease: 'power3.out',
            scrollTrigger: { trigger: sec, start: 'top 85%', toggleActions: 'play none none reverse' },
          }
        );
      });
    }, pageRef);

    return () => { ctx.revert(); if (cleanup) cleanup(); };
  }, []);

  return (
    <div className="lp-page" ref={pageRef}>
      <section className="lp-hero lp-hero-privacy">
        <div className="lp-hero-bg" />
        <div className="lp-hero-content">
          <span className="lp-hero-badge">🔒 Legal</span>
          <h1 className="lp-hero-title">Privacy Policy</h1>
          <p className="lp-hero-sub">How we collect, use, and protect your personal information</p>
          <p className="lp-hero-date">Last updated: February 11, 2026</p>
        </div>
      </section>

      <section className="lp-section">
        <div className="lp-container lp-doc-layout">
          {/* Sidebar TOC */}
          <nav className="pp-toc">
            <h4 className="pp-toc-title">Contents</h4>
            {sections.map((s) => (
              <a key={s.id} href={`#${s.id}`} className="pp-toc-link">
                <span>{s.icon}</span> {s.title}
              </a>
            ))}
          </nav>

          {/* Content */}
          <div className="pp-content">
            <div className="pp-intro">
              <p>
                At TravelFlow, we take your privacy seriously. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our platform. Please read this policy carefully. By using TravelFlow, you consent to the practices described herein.
              </p>
            </div>

            {sections.map((section) => (
              <div className="pp-section" key={section.id} id={section.id}>
                <h2 className="pp-section-title">
                  <span className="pp-section-icon">{section.icon}</span>
                  {section.title}
                </h2>
                {section.content.map((item, i) => (
                  <div className="pp-block" key={i}>
                    {item.subtitle && <h4 className="pp-block-title">{item.subtitle}</h4>}
                    <p className="pp-block-text">{item.text}</p>
                  </div>
                ))}
              </div>
            ))}

            <div className="pp-contact-box">
              <h3>📧 Contact Us About Privacy</h3>
              <p>If you have questions about this Privacy Policy or wish to exercise your data rights, contact our Data Protection Officer:</p>
              <p><strong>Email:</strong> privacy@travelflow.com</p>
              <p><strong>Address:</strong> TravelFlow Inc., 123 Travel Lane, San Francisco, CA 94105</p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
