import { useEffect, useState } from 'react';
import Footer from '../components/Footer';
import { animateSections, animateTitles, animateContactForm, animateNavbar } from '../animations/gsapAnimations';

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [sent, setSent] = useState(false);

  useEffect(() => {
    const cleanupNav = animateNavbar();
    animateSections();
    animateTitles();
    animateContactForm();
    return () => { if (cleanupNav) cleanupNav(); };
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSent(true);
    setForm({ name: '', email: '', subject: '', message: '' });
    setTimeout(() => setSent(false), 4000);
  };

  return (
    <>
      {/* Hero */}
      <section
        className="section"
        style={{
          paddingTop: '140px',
          background: 'linear-gradient(135deg, #1F2937, #56CCF2)',
          color: '#fff',
          textAlign: 'center',
        }}
      >
        <div className="container">
          <h1 className="section-title" style={{ color: '#fff' }}>Contact Us</h1>
          <p className="section-subtitle" style={{ color: 'rgba(255,255,255,0.8)' }}>
            Have questions? We'd love to hear from you. Send us a message and we'll respond as quickly as we can.
          </p>
        </div>
      </section>

      {/* Contact Form */}
      <section className="section">
        <div className="container" style={{ maxWidth: '900px' }}>
          <div className="contact-form-wrapper" style={formWrapperStyle}>
            <div style={contactInfoStyle}>
              <h3 style={{ fontSize: '1.4rem', marginBottom: '16px', color: '#fff' }}>Get in Touch</h3>
              <p style={{ color: 'rgba(255,255,255,0.8)', marginBottom: '30px', lineHeight: 1.7 }}>
                Reach out to us through any of these channels or fill the form.
              </p>
              <div style={contactItemStyle}>
                <span style={contactIconStyle}>📧</span>
                <div>
                  <div style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.6)' }}>Email</div>
                  <div style={{ color: '#fff' }}>World@travelflow.com</div>
                </div>
              </div>
              <div style={contactItemStyle}>
                <span style={contactIconStyle}>📞</span>
                <div>
                  <div style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.6)' }}>Phone</div>
                  <div style={{ color: '#fff' }}>+1-888-906-3987</div>
                </div>
              </div>
              <div style={contactItemStyle}>
                <span style={contactIconStyle}>📍</span>
                <div>
                  <div style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.6)' }}>Address</div>
                  <div style={{ color: '#fff' }}>Travel Street in New York City</div>
                </div>
              </div>
            </div>

            <form onSubmit={handleSubmit} style={formStyle}>
              <div style={formRow}>
                <div style={formGroup}>
                  <label style={labelStyle}>Full Name</label>
                  <input
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="please enter your full name"
                    style={inputStyle}
                    required
                  />
                </div>
                <div style={formGroup}>
                  <label style={labelStyle}>Email</label>
                  <input
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="please enter a valid email"
                    style={inputStyle}
                    required
                  />
                </div>
              </div>
              <div style={formGroup}>
                <label style={labelStyle}>Subject</label>
                <input
                  name="subject"
                  value={form.subject}
                  onChange={handleChange}
                  placeholder="How can we help?"
                  style={inputStyle}
                  required
                />
              </div>
              <div style={formGroup}>
                <label style={labelStyle}>Message</label>
                <textarea
                  name="message"
                  value={form.message}
                  onChange={handleChange}
                  placeholder="Tell us more..."
                  rows={5}
                  style={{ ...inputStyle, resize: 'vertical' }}
                  required
                />
              </div>
              <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
                {sent ? '✓ Message Sent!' : 'Send Message →'}
              </button>
            </form>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}

const formWrapperStyle = {
  display: 'grid',
  gridTemplateColumns: '1fr 1.5fr',
  borderRadius: '20px',
  overflow: 'hidden',
  boxShadow: '0 8px 40px rgba(0,0,0,0.12)',
};

const contactInfoStyle = {
  background: 'linear-gradient(135deg, #2F80ED, #1F2937)',
  padding: '40px 30px',
  display: 'flex',
  flexDirection: 'column',
};

const contactItemStyle = {
  display: 'flex',
  gap: '14px',
  alignItems: 'flex-start',
  marginBottom: '20px',
};

const contactIconStyle = {
  fontSize: '1.3rem',
  width: '40px',
  height: '40px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  background: 'rgba(255,255,255,0.1)',
  borderRadius: '10px',
  flexShrink: 0,
};

const formStyle = {
  padding: '40px 30px',
  background: '#fff',
  display: 'flex',
  flexDirection: 'column',
  gap: '18px',
};

const formRow = {
  display: 'grid',
  gridTemplateColumns: '1fr 1fr',
  gap: '16px',
};

const formGroup = {
  display: 'flex',
  flexDirection: 'column',
  gap: '6px',
};

const labelStyle = {
  fontSize: '0.85rem',
  fontWeight: 600,
  color: '#1F2937',
};

const inputStyle = {
  padding: '12px 16px',
  borderRadius: '10px',
  border: '1.5px solid #E5E7EB',
  fontSize: '0.95rem',
  transition: 'border-color 0.3s ease',
  fontFamily: 'Inter, sans-serif',
  background: '#F9FAFB',
};
