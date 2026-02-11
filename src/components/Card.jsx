import '../styles/cards.css';

export default function Card({ icon, iconColor, title, text, number }) {
  return (
    <div className="card">
      <span className="card-number">{number}</span>
      <div className={`card-icon ${iconColor}`}>
        {icon}
      </div>
      <h3 className="card-title">{title}</h3>
      <p className="card-text">{text}</p>
    </div>
  );
}
