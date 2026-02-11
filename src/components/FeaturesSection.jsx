import FeatureCard from './FeatureCard';
import '../styles/features.css';

const features = [
  {
    icon: '💰',
    step: '01',
    title: 'Best Prices',
    description:
      'We compare thousands of flights and routes to find you the most affordable options every time.',
    stat: '500K+ Routes Compared Daily',
  },
  {
    icon: '⚡',
    step: '02',
    title: 'Instant Booking',
    description:
      'Book your entire trip in minutes with our streamlined platform. No hidden fees, no hassle.',
    stat: '2 Min Avg Booking Time',
  },
  {
    icon: '🌟',
    step: '03',
    title: 'Premium Experience',
    description:
      'Enjoy curated travel packages with premium amenities that make every journey unforgettable.',
    stat: '99.8% Satisfaction Rate',
  },
];

export default function FeaturesSection() {
  return (
    <section className="ft-section">
      {/* Header */}
      <div className="ft-header">
        <span className="ft-tag">✨ Why Us</span>
        <h2 className="ft-title">Why Choose Us</h2>
        <p className="ft-subtitle">
          We go beyond booking — we craft personalized travel experiences powered by technology.
        </p>
      </div>

      {/* Steps row + connecting line */}
      <div className="ft-steps-container">
        <div className="ft-connect-line" />
        {features.map((f, i) => (
          <FeatureCard key={i} {...f} />
        ))}
      </div>
    </section>
  );
}
