import { Component } from 'react';
import { Link } from 'react-router-dom';

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          padding: '40px 20px',
          background: '#F5F7FA',
        }}>
          <div style={{ fontSize: '5rem', marginBottom: '16px' }}>⚠️</div>
          <h1 style={{
            fontFamily: 'Poppins, sans-serif',
            fontSize: '2rem',
            fontWeight: 800,
            color: '#1F2937',
            marginBottom: '12px',
          }}>
            Something Went Wrong
          </h1>
          <p style={{
            fontSize: '1rem',
            color: '#6B7280',
            maxWidth: '480px',
            lineHeight: 1.6,
            marginBottom: '24px',
          }}>
            An unexpected error occurred. Please try refreshing the page or navigating back home.
          </p>
          <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', justifyContent: 'center' }}>
            <button
              onClick={() => {
                this.setState({ hasError: false, error: null });
                window.location.href = '/';
              }}
              className="btn btn-primary"
              style={{ padding: '12px 32px', cursor: 'pointer' }}
            >
              Go to Home
            </button>
            <button
              onClick={() => window.location.reload()}
              className="btn btn-outline"
              style={{ padding: '12px 32px', cursor: 'pointer' }}
            >
              Refresh Page
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
