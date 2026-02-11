import { regionColors } from '../data/currencies';

export default function CurrencyCard({ currency, index, onSelect }) {
  const colors = regionColors[currency.region] || regionColors.Americas;

  return (
    <div
      className="currency-card gsap-3d-enter"
      data-index={index}
      onClick={() => onSelect(currency)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && onSelect(currency)}
    >
      <div className="currency-card-inner">
        {/* Front */}
        <div
          className="currency-card-front"
          style={{ '--card-color': colors.primary }}
        >
          <div
            style={{
              position: 'absolute',
              top: '-40%',
              right: '-20%',
              width: '180px',
              height: '180px',
              borderRadius: '50%',
              background: colors.primary,
              opacity: 0.06,
              pointerEvents: 'none',
            }}
          />
          <div className="card-front-top">
            <span className="card-flag">{currency.flag}</span>
            <span
              className="card-code"
              style={{ background: colors.gradient }}
            >
              {currency.code}
            </span>
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
              <span>per USD</span>
            </div>
          </div>
        </div>

        {/* Back */}
        <div
          className="currency-card-back"
          style={{ background: colors.gradient }}
        >
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
