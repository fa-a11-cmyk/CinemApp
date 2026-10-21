import React, { useState } from 'react';
import { Search, X, Clapperboard, Tv, Film } from 'lucide-react';

const PRESET_QUERIES = [
  'Batman',
  'Inception',
  'Avengers',
  'Interstellar',
  'Matrix',
  'Star Wars',
  'Gladiator',
  'Dune',
];

export function SearchBar({ onSearch, loading }) {
  const [query, setQuery] = useState('Batman');
  const [type, setType] = useState('all');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query.trim(), type);
    }
  };

  const handleTypeChange = (newType) => {
    setType(newType);
    if (query.trim()) {
      onSearch(query.trim(), newType);
    }
  };

  const handlePresetClick = (preset) => {
    setQuery(preset);
    onSearch(preset, type);
  };

  return (
    <div className="search-box-card">
      <form onSubmit={handleSubmit} className="search-input-group">
        <div className="search-input-wrapper">
          <Search size={20} className="search-icon-left" />
          <input
            type="text"
            className="search-input"
            placeholder="Rechercher un film, une série par titre (ex: Inception, Batman, Dune)..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            id="movie-search-input"
          />
          {query && (
            <button
              type="button"
              className="clear-btn"
              onClick={() => setQuery('')}
              aria-label="Effacer"
            >
              <X size={16} />
            </button>
          )}
        </div>

        <button
          type="submit"
          className="btn-primary"
          disabled={loading || !query.trim()}
          id="search-submit-btn"
        >
          <Search size={18} />
          <span>{loading ? 'Recherche...' : 'Rechercher'}</span>
        </button>
      </form>

      {/* Type Filters & Quick Suggestions */}
      <div className="search-filters-row">
        <div className="type-filter-group">
          <button
            type="button"
            className={`type-filter-btn ${type === 'all' ? 'active' : ''}`}
            onClick={() => handleTypeChange('all')}
          >
            Tous
          </button>
          <button
            type="button"
            className={`type-filter-btn ${type === 'movie' ? 'active' : ''}`}
            onClick={() => handleTypeChange('movie')}
          >
            <Film size={12} style={{ display: 'inline', marginRight: 4 }} />
            Films
          </button>
          <button
            type="button"
            className={`type-filter-btn ${type === 'series' ? 'active' : ''}`}
            onClick={() => handleTypeChange('series')}
          >
            <Tv size={12} style={{ display: 'inline', marginRight: 4 }} />
            Séries
          </button>
        </div>

        <div className="quick-pills">
          <span className="quick-pills-label">Suggestions :</span>
          {PRESET_QUERIES.map((preset) => (
            <button
              key={preset}
              type="button"
              className="pill-btn"
              onClick={() => handlePresetClick(preset)}
            >
              {preset}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
