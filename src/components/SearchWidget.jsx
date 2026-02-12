import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import destinations from '../data/destinations';

export default function SearchWidget() {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [focused, setFocused] = useState(false);

  const suggestions = query.trim().length > 0
    ? destinations.filter(
        (d) =>
          d.name.toLowerCase().includes(query.toLowerCase()) ||
          d.country.toLowerCase().includes(query.toLowerCase())
      )
    : [];

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/destinations?search=${encodeURIComponent(query.trim())}`);
      setQuery('');
    }
  };

  const handleSelect = (dest) => {
    setQuery('');
    setFocused(false);
    navigate(`/destination/${dest.id}`);
  };

  return (
    <div className="search-widget">
      <form className="search-form" onSubmit={handleSearch}>
        <div className="search-input-wrap">
          <span className="search-icon">🔍</span>
          <input
            className="search-input"
            type="text"
            placeholder="Where do you want to go?"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setFocused(true)}
            onBlur={() => setTimeout(() => setFocused(false), 200)}
          />
        </div>
        <button type="submit" className="search-btn">Search</button>
      </form>

      {/* Autocomplete dropdown */}
      {focused && suggestions.length > 0 && (
        <div className="search-dropdown">
          {suggestions.map((d) => (
            <button key={d.id} className="search-suggestion" onMouseDown={() => handleSelect(d)}>
              <span className="search-suggestion-flag">{d.flag}</span>
              <div className="search-suggestion-info">
                <span className="search-suggestion-name">{d.name}</span>
                <span className="search-suggestion-country">{d.country}</span>
              </div>
              <span className="search-suggestion-price">{d.priceLabel}</span>
            </button>
          ))}
        </div>
      )}

      {/* Quick links */}
      <div className="search-quick-links">
        <span className="search-quick-label">Popular:</span>
        {destinations.slice(0, 4).map((d) => (
          <button key={d.id} className="search-quick-tag" onClick={() => navigate(`/destination/${d.id}`)}>
            {d.flag} {d.name}
          </button>
        ))}
      </div>
    </div>
  );
}
