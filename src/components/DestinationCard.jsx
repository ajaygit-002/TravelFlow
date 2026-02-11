import { useNavigate } from 'react-router-dom';

export default function DestinationCard({ dest, index }) {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/destination/${dest.id}`);
  };

  return (
    <div className="dest-card" onClick={handleClick} data-index={index}>
      <img
        className="dest-card-img"
        src={dest.thumb}
        alt={dest.name}
        loading="lazy"
      />
      <div className="dest-card-badge-row">
        <span className="dest-card-duration">🕐 {dest.duration}</span>
        <span className="dest-card-rating">⭐ {dest.rating}</span>
      </div>
      <span className="dest-card-price">{dest.priceLabel}</span>
      <div className="dest-card-overlay">
        <span className="dest-card-tagline">{dest.tagline}</span>
        <h3 className="dest-card-name">{dest.flag} {dest.name}</h3>
        <p className="dest-card-country">{dest.country}</p>
        <p className="dest-card-desc">{dest.desc}</p>
      </div>
    </div>
  );
}
