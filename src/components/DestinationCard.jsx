
import { useNavigate } from 'react-router-dom';
import '../styles/cards.css';
import { memo, useCallback } from 'react';



const DestinationCard = memo(function DestinationCard({ dest, index }) {
  const navigate = useNavigate();
  const handleClick = useCallback(() => {
    navigate(`/destination/${dest.id}`);
  }, [navigate, dest.id]);

  const handleKeyDown = useCallback((e) => {
    if (e.key === 'Enter' || e.key === ' ') handleClick();
  }, [handleClick]);

  return (
    <article
      className="dest-card"
      onClick={handleClick}
      data-index={index}
      tabIndex={0}
      aria-label={`View details for ${dest.name}`}
      onKeyDown={handleKeyDown}
    >
      {/* Image section */}
      <div className="dest-card-img-wrap">
        <img
          className="dest-card-img"
          src={dest.thumb}
          alt={`Scenic view of ${dest.name}`}
          loading="lazy"
        />
        <div className="dest-card-badge-row">
          <span className="dest-card-duration" title="Recommended duration">🕐 {dest.duration}</span>
          <span className="dest-card-rating" title="Average rating">⭐ {dest.rating}</span>
        </div>
        <span className="dest-card-price" title="Starting price">{dest.priceLabel}</span>
        <div className="dest-card-img-overlay" />
      </div>

      {/* Content section */}
      <div className="dest-card-body">
        <span className="dest-card-tagline">{dest.tagline}</span>
        <h3 className="dest-card-name">{dest.flag} {dest.name}</h3>
        <p className="dest-card-country">{dest.country}</p>
        <p className="dest-card-desc">{dest.desc}</p>

        {/* Unique content: Quick facts and highlights */}
        {dest.highlights && dest.highlights.length > 0 && (
          <ul className="dest-card-highlights" aria-label="Highlights">
            {dest.highlights.slice(0, 3).map((h, i) => (
              <li key={h.title + i} className="dest-card-highlight-item">
                <span className="dest-card-highlight-icon" aria-hidden="true">{h.icon}</span>
                <span className="dest-card-highlight-title">{h.title}</span>: <span className="dest-card-highlight-text">{h.text}</span>
              </li>
            ))}
          </ul>
        )}
        {dest.quickFact && (
          <div className="dest-card-quickfact" aria-label="Quick fact">
            <strong>Did you know?</strong> {dest.quickFact}
          </div>
        )}

        <div className="dest-card-footer">
          <span className="dest-card-cta" aria-label={`View more about ${dest.name}`}>View Details →</span>
        </div>
      </div>
    </article>
  );
});

export default DestinationCard;
