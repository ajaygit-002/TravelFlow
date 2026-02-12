import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div style={{
      minHeight: '80vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      textAlign: 'center',
      padding: '40px 20px',
    }}>
      <div style={{ fontSize: '6rem', marginBottom: '16px' }}>🌍</div>
      <h1 style={{
        fontFamily: 'Poppins, sans-serif',
        fontSize: 'clamp(2rem, 5vw, 3.5rem)',
        fontWeight: 800,
        color: '#1F2937',
        marginBottom: '12px',
      }}>
        404 — Page Not Found
      </h1>
      <p style={{
        fontSize: '1.1rem',
        color: '#6B7280',
        maxWidth: '480px',
        lineHeight: 1.6,
        marginBottom: '32px',
      }}>
        Looks like this destination doesn't exist on our map. Let's get you back on track.
      </p>
      <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', justifyContent: 'center' }}>
        <Link to="/" className="btn btn-primary" style={{ padding: '12px 32px' }}>
          Back to Home
        </Link>
        <Link to="/destinations" className="btn btn-outline" style={{ padding: '12px 32px' }}>
          Explore Destinations
        </Link>
      </div>
    </div>
  );
}
