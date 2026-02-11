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
    id: 'acceptance',
    icon: '✅',
    title: '1. Acceptance of Terms',
    paragraphs: [
      'By accessing or using TravelFlow ("the Platform"), you agree to be bound by these Terms of Service ("Terms"). If you do not agree to all of these Terms, you must not use the Platform.',
      'We reserve the right to modify these Terms at any time. Changes become effective upon posting. Your continued use of TravelFlow after changes are posted constitutes acceptance of the revised Terms.',
      'You must be at least 18 years of age or have parental/guardian consent to use TravelFlow and make bookings.',
    ],
  },
  {
    id: 'services',
    icon: '🌍',
    title: '2. Our Services',
    paragraphs: [
      'TravelFlow provides a travel planning and booking platform that enables users to: browse curated travel destinations; compare prices across 130+ currencies; book travel packages; manage itineraries; and access travel-related information and tools.',
      'We act as an intermediary between you and third-party travel service providers (hotels, airlines, tour operators). The actual travel services are provided by these third parties under their own terms and conditions.',
      'While we strive for accuracy, destination information, availability, and pricing may change without notice. All prices are subject to confirmation at the time of booking.',
    ],
  },
  {
    id: 'bookings',
    icon: '🎫',
    title: '3. Bookings & Payments',
    paragraphs: [
      'All bookings are subject to availability and confirmation. A booking is confirmed only after successful payment and receipt of a confirmation email with a booking ID.',
      'Prices include the base package cost. Applicable taxes, including 18% GST (9% CGST + 9% SGST) as per Indian tax law, are calculated and displayed transparently during checkout before payment.',
      'We accept payments via Credit/Debit Cards (Visa, Mastercard, Amex, RuPay), UPI, Net Banking, and digital wallets. All transactions are processed through secure, PCI DSS-compliant payment gateways.',
      'A detailed GST invoice is generated for every successful transaction and sent to your registered email address.',
    ],
  },
  {
    id: 'cancellation',
    icon: '❌',
    title: '4. Cancellation & Refunds',
    paragraphs: [
      'Free cancellation is available for bookings cancelled more than 7 days before the scheduled departure date.',
      'Cancellations made 3-7 days before departure are subject to a 15% cancellation fee. Cancellations within 3 days of departure may incur up to 25% of the total booking amount.',
      'Refunds are processed to the original payment method within 5-7 business days. GST refunds are calculated proportionally based on the applicable cancellation terms.',
      'No-shows (failure to arrive without prior cancellation) are non-refundable unless covered by travel insurance purchased through TravelFlow.',
    ],
  },
  {
    id: 'user-conduct',
    icon: '📜',
    title: '5. User Conduct',
    paragraphs: [
      'You agree to use TravelFlow only for lawful purposes and in accordance with these Terms. You are responsible for maintaining the confidentiality of your account credentials.',
      'You must not: provide false or misleading information; use the platform for any fraudulent or illegal activity; attempt to gain unauthorized access to our systems; interfere with other users\' use of the platform; or scrape, crawl, or collect data from the platform without written permission.',
      'We reserve the right to suspend or terminate accounts that violate these Terms, without prior notice and without liability.',
    ],
  },
  {
    id: 'ip',
    icon: '©️',
    title: '6. Intellectual Property',
    paragraphs: [
      'All content on TravelFlow — including text, graphics, logos, images, software, and design elements — is the property of TravelFlow Inc. or its content suppliers and is protected by copyright, trademark, and other intellectual property laws.',
      'You are granted a limited, non-exclusive, non-transferable license to access and use the Platform for personal, non-commercial travel planning purposes.',
      'You may not reproduce, distribute, modify, create derivative works, publicly display, or exploit any content from TravelFlow without our prior written consent.',
    ],
  },
  {
    id: 'liability',
    icon: '⚖️',
    title: '7. Limitation of Liability',
    paragraphs: [
      'TravelFlow acts as an intermediary and is not directly responsible for the services provided by third-party travel suppliers. We are not liable for delays, cancellations, or quality issues caused by airlines, hotels, or tour operators.',
      'To the maximum extent permitted by law, TravelFlow\'s total liability for any claim arising from your use of the Platform shall not exceed the amount you paid for the specific booking giving rise to the claim.',
      'We are not liable for indirect, incidental, special, consequential, or punitive damages, including loss of profits, data, or goodwill, regardless of the cause of action.',
      'Nothing in these Terms excludes or limits liability for death, personal injury, or fraud caused by our negligence.',
    ],
  },
  {
    id: 'indemnity',
    icon: '🛡️',
    title: '8. Indemnification',
    paragraphs: [
      'You agree to indemnify, defend, and hold harmless TravelFlow Inc., its officers, directors, employees, and agents from any claims, damages, losses, or expenses (including legal fees) arising from: your use of the Platform; your violation of these Terms; your violation of any third-party rights; or any content you submit to the Platform.',
    ],
  },
  {
    id: 'governing-law',
    icon: '🏛️',
    title: '9. Governing Law & Disputes',
    paragraphs: [
      'These Terms are governed by and construed in accordance with the laws of India. Any disputes arising from these Terms or your use of TravelFlow shall be subject to the exclusive jurisdiction of the courts in Mumbai, India.',
      'Before filing any formal claim, you agree to first attempt to resolve the dispute informally by contacting us at legal@travelflow.com. We will attempt to resolve the issue within 30 days.',
    ],
  },
  {
    id: 'contact',
    icon: '📧',
    title: '10. Contact Information',
    paragraphs: [
      'For questions about these Terms of Service, please contact us:',
      'Email: legal@travelflow.com | Phone: +1-800-TRAVEL-FLOW | Address: TravelFlow Inc., 123 Travel Lane, San Francisco, CA 94105',
    ],
  },
];

export default function TermsOfService() {
  const pageRef = useRef(null);

  useEffect(() => {
    const cleanup = animateNavbar();
    window.scrollTo(0, 0);

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
      tl.fromTo('.lp-hero', { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 0.6 })
        .fromTo('.lp-hero-content > *', { opacity: 0, y: 25 }, { opacity: 1, y: 0, duration: 0.45, stagger: 0.1 }, '-=0.3');

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
      <section className="lp-hero lp-hero-terms">
        <div className="lp-hero-bg" />
        <div className="lp-hero-content">
          <span className="lp-hero-badge">📜 Legal</span>
          <h1 className="lp-hero-title">Terms of Service</h1>
          <p className="lp-hero-sub">Please read these terms carefully before using TravelFlow</p>
          <p className="lp-hero-date">Effective: February 11, 2026</p>
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
                Welcome to TravelFlow. These Terms of Service govern your access to and use of our travel planning and booking platform. By using TravelFlow, you acknowledge that you have read, understood, and agree to be bound by these Terms.
              </p>
            </div>

            {sections.map((section) => (
              <div className="pp-section" key={section.id} id={section.id}>
                <h2 className="pp-section-title">
                  <span className="pp-section-icon">{section.icon}</span>
                  {section.title}
                </h2>
                {section.paragraphs.map((p, i) => (
                  <p className="pp-block-text" key={i}>{p}</p>
                ))}
              </div>
            ))}

            <div className="pp-contact-box">
              <h3>Need Clarification?</h3>
              <p>If you have questions about these Terms, reach out:</p>
              <p><strong>Email:</strong> legal@travelflow.com</p>
              <p><strong>Phone:</strong> +1-800-TRAVEL-FLOW</p>
              <div style={{ marginTop: 16 }}>
                <Link to="/contact" className="btn btn-primary">Contact Us</Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
