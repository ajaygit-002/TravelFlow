import { useState } from 'react';

function StarRating({ rating, size = 16 }) {
  return (
    <span className="rv-stars" style={{ fontSize: size }}>
      {[1, 2, 3, 4, 5].map((star) => (
        <span key={star} className={star <= rating ? 'rv-star-filled' : 'rv-star-empty'}>
          ★
        </span>
      ))}
    </span>
  );
}

export default function ReviewSection({ reviews = [], rating }) {
  const [showAll, setShowAll] = useState(false);
  if (!reviews.length) return null;

  const avgRating = (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1);
  const displayedReviews = showAll ? reviews : reviews.slice(0, 3);

  /* Rating distribution */
  const distribution = [5, 4, 3, 2, 1].map((star) => {
    const count = reviews.filter((r) => r.rating === star).length;
    return { star, count, pct: Math.round((count / reviews.length) * 100) };
  });

  return (
    <section className="dd-reviews-section">
      <h2 className="dd-section-title">Traveler Reviews</h2>

      {/* Summary bar */}
      <div className="rv-summary">
        <div className="rv-summary-left">
          <div className="rv-big-score">{avgRating}</div>
          <StarRating rating={Math.round(avgRating)} size={22} />
          <span className="rv-total">{reviews.length} review{reviews.length > 1 ? 's' : ''}</span>
        </div>
        <div className="rv-distribution">
          {distribution.map((d) => (
            <div className="rv-dist-row" key={d.star}>
              <span className="rv-dist-label">{d.star}★</span>
              <div className="rv-dist-bar">
                <div className="rv-dist-fill" style={{ width: `${d.pct}%` }} />
              </div>
              <span className="rv-dist-count">{d.count}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Review cards */}
      <div className="rv-list">
        {displayedReviews.map((review, i) => (
          <div className="rv-card" key={i}>
            <div className="rv-card-header">
              <span className="rv-avatar">{review.avatar}</span>
              <div className="rv-meta">
                <span className="rv-name">{review.name}</span>
                <span className="rv-date">{review.date}</span>
              </div>
              <StarRating rating={review.rating} />
            </div>
            <p className="rv-text">{review.text}</p>
          </div>
        ))}
      </div>

      {reviews.length > 3 && (
        <button className="rv-toggle" onClick={() => setShowAll(!showAll)}>
          {showAll ? 'Show Less' : `Show All ${reviews.length} Reviews`}
        </button>
      )}
    </section>
  );
}
