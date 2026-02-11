export default function FeatureCard({ icon, step, title, description, stat }) {
  return (
    <div className="ft-step">
      {/* Circle icon */}
      <div className="ft-step-circle">
        <span className="ft-step-emoji">{icon}</span>
      </div>

      {/* Card body */}
      <div className="ft-step-body">
        <span className="ft-step-number">{step}</span>
        <h3 className="ft-step-title">{title}</h3>
        <p className="ft-step-desc">{description}</p>
        <div className="ft-step-stat">
          <span className="ft-step-stat-text">{stat}</span>
        </div>
      </div>
    </div>
  );
}
