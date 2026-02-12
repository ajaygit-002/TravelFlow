import { regionColors } from '../data/currencies';

export default function CurrencyCard({ currency, index, onSelect }) {
  const colors = regionColors[currency.region] || regionColors.Americas;

  return (
    <div
      className="currency-card"
      data-index={index}
      data-region={currency.region}
      onClick={() => onSelect(currency)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && onSelect(currency)}
      style={{ '--accent': colors.primary, '--accent-gradient': colors.gradient }}
    >
      {/* Animated border glow */}
      <div className="card-glow" />

      <div className="currency-card-inner">
        {/* ===== FRONT ===== */}
        <div className="currency-card-front">
          {/* Top accent strip */}
          <div className="card-accent-strip" />

          {/* Decorative circle */}
          <div className="card-deco-circle" />

          {/* Shimmer overlay */}
          <div className="card-shimmer" />

          <div className="card-front-top">
            <span className="card-flag">{currency.flag}</span>
            <span className="card-code">{currency.code}</span>
          </div>

          <div className="card-front-mid">
            <div className="card-currency-name">{currency.name}</div>
            <div className="card-country">{currency.country}</div>
          </div>

          <div className="card-front-bottom">
            <span className="card-symbol">{currency.symbol}</span>
            <div className="card-rate">
              <div className="card-rate-value">
                {currency.rate < 1
                  ? currency.rate.toFixed(4)
                  : currency.rate.toLocaleString()}
              </div>
              <span className="card-rate-label">per USD</span>
            </div>
          </div>

          {/* Region pill */}
          <div className="card-region-pill">{currency.region}</div>
        </div>

        {/* ===== BACK ===== */}
        <div className="currency-card-back">
          <div className="card-back-pattern" />
          <div className="card-back-flag">{currency.flag}</div>
          <div className="card-back-name">{currency.name}</div>
          <div className="card-back-code">{currency.code} — {currency.country}</div>
          <div className="card-back-details">
            <div className="card-back-row">
              <span className="card-back-label">Symbol</span>
              <span className="card-back-value">{currency.symbol}</span>
            </div>
            <div className="card-back-row">
              <span className="card-back-label">Rate (USD)</span>
              <span className="card-back-value">
                {currency.rate < 1
                  ? currency.rate.toFixed(4)
                  : currency.rate.toLocaleString()}
              </span>
            </div>
            <div className="card-back-row">
              <span className="card-back-label">Region</span>
              <span className="card-back-value">{currency.region}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
