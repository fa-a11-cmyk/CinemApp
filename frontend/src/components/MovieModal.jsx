import React, { useEffect, useState } from 'react';
import { X, Star, Heart, Film, Calendar, Clock, Award, Users, Video } from 'lucide-react';
import { movieService } from '../services/api';
import { useFavorites } from '../context/FavoritesContext';

export function MovieModal({ movie, onClose }) {
  const [details, setDetails] = useState(movie);
  const [loading, setLoading] = useState(true);
  const { isFavorite, toggleFavorite } = useFavorites();
  const favorite = isFavorite(movie.imdbID);

  useEffect(() => {
    let isMounted = true;
    async function fetchFullDetails() {
      try {
        const res = await movieService.getById(movie.imdbID);
        if (isMounted && res.success && res.movie) {
          setDetails(res.movie);
        }
      } catch (err) {
        console.warn('Impossible de charger les détails complets :', err.message);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    fetchFullDetails();
    return () => {
      isMounted = false;
    };
  }, [movie.imdbID]);

  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close-btn" onClick={onClose} aria-label="Fermer">
          <X size={20} />
        </button>

        <div className="modal-body">
          {/* Left Column: Poster */}
          <div>
            <img
              src={details.poster || movie.poster}
              alt={details.title}
              className="modal-poster"
              onError={(e) => {
                e.target.style.display = 'none';
              }}
            />

            <button
              style={{
                marginTop: '1rem',
                width: '100%',
                padding: '0.75rem',
                borderRadius: 'var(--radius-md)',
                border: 'none',
                background: favorite ? 'rgba(239, 68, 68, 0.2)' : 'var(--accent-gold)',
                color: favorite ? '#fca5a5' : '#0b0f19',
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
                cursor: 'pointer',
              }}
              onClick={() => toggleFavorite(details)}
            >
              <Heart size={18} fill={favorite ? 'currentColor' : 'none'} />
              <span>{favorite ? 'Retirer des favoris' : 'Ajouter aux favoris'}</span>
            </button>
          </div>

          {/* Right Column: Detailed Info */}
          <div className="modal-info">
            <h2 className="modal-title">{details.title}</h2>

            <div className="modal-meta-row">
              {details.imdbRating && details.imdbRating !== 'N/A' && (
                <span className="chip chip-rating">
                  <Star size={13} fill="#0b0f19" />
                  <span>{details.imdbRating} / 10</span>
                </span>
              )}
              {details.year && (
                <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                  <Calendar size={14} />
                  {details.year}
                </span>
              )}
              {details.runtime && details.runtime !== 'N/A' && (
                <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                  <Clock size={14} />
                  {details.runtime}
                </span>
              )}
              {details.rated && details.rated !== 'N/A' && (
                <span className="chip">{details.rated}</span>
              )}
            </div>

            {/* Genre tags */}
            {details.genre && (
              <div className="genre-tags">
                {details.genre.split(',').map((g) => (
                  <span key={g.trim()} className="genre-pill">
                    {g.trim()}
                  </span>
                ))}
              </div>
            )}

            {/* Synopsis */}
            <h4 className="modal-plot-title">Synopsis</h4>
            <p className="modal-plot">
              {details.plot || 'Aucun résumé disponible pour ce titre.'}
            </p>

            {/* Grid of Directors & Cast */}
            <div className="modal-details-grid">
              {details.director && details.director !== 'N/A' && (
                <div>
                  <div className="detail-label">Réalisateur</div>
                  <div className="detail-value">{details.director}</div>
                </div>
              )}
              {details.actors && details.actors !== 'N/A' && (
                <div>
                  <div className="detail-label">Acteurs principaux</div>
                  <div className="detail-value">{details.actors}</div>
                </div>
              )}
              {details.awards && details.awards !== 'N/A' && (
                <div>
                  <div className="detail-label">Récompenses</div>
                  <div className="detail-value">{details.awards}</div>
                </div>
              )}
              {details.boxOffice && details.boxOffice !== 'N/A' && (
                <div>
                  <div className="detail-label">Box Office</div>
                  <div className="detail-value">{details.boxOffice}</div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
