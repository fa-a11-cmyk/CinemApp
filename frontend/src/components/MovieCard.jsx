import React from 'react';
import { Heart, Star, Film, Eye, ImageOff } from 'lucide-react';
import { useFavorites } from '../context/FavoritesContext';

export function MovieCard({ movie, onOpenModal }) {
  const { isFavorite, toggleFavorite } = useFavorites();
  const favorite = isFavorite(movie.imdbID);

  const handleFavoriteClick = (e) => {
    e.stopPropagation();
    toggleFavorite(movie);
  };

  return (
    <div className="movie-card" id={`movie-${movie.imdbID}`}>
      {/* Poster with Badges */}
      <div className="card-poster-wrapper">
        {movie.poster ? (
          <img
            src={movie.poster}
            alt={movie.title}
            className="card-poster"
            loading="lazy"
            onError={(e) => {
              e.target.style.display = 'none';
              e.target.nextElementSibling.style.display = 'flex';
            }}
          />
        ) : null}

        <div
          className="card-poster-placeholder"
          style={{ display: movie.poster ? 'none' : 'flex' }}
        >
          <ImageOff size={36} />
          <span style={{ fontSize: '0.8rem' }}>Image indisponible</span>
        </div>

        <div className="poster-overlay" />

        {/* Badges: Type & Rating */}
        <div className="card-badges">
          <span className="chip">
            {movie.type === 'series' ? 'Série' : 'Film'}
          </span>
          {movie.imdbRating && movie.imdbRating !== 'N/A' && (
            <span className="chip chip-rating">
              <Star size={11} fill="#0b0f19" />
              <span>{movie.imdbRating}</span>
            </span>
          )}
        </div>

        {/* Favorite Heart Button (Bonus) */}
        <button
          className={`favorite-toggle-btn ${favorite ? 'is-favorite' : ''}`}
          onClick={handleFavoriteClick}
          title={favorite ? 'Retirer des favoris' : 'Ajouter aux favoris'}
          aria-label={favorite ? 'Retirer des favoris' : 'Ajouter aux favoris'}
        >
          <Heart size={18} fill={favorite ? 'currentColor' : 'none'} />
        </button>
      </div>

      {/* Card Content */}
      <div className="card-content">
        <h3 className="card-title" title={movie.title}>
          {movie.title}
        </h3>

        <div className="card-meta">
          <span>{movie.year || 'Année inconnue'}</span>
          {movie.genre && (
            <>
              <span className="card-meta-dot" />
              <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {movie.genre}
              </span>
            </>
          )}
        </div>

        {/* Description (MVP obligatoire) */}
        <p className="card-description">
          {movie.plot || 'Synopsis non renseigné.'}
        </p>

        {/* Action Button */}
        <div className="card-actions">
          <button
            className="btn-detail"
            onClick={() => onOpenModal(movie)}
          >
            <Eye size={15} />
            <span>Voir détails</span>
          </button>
        </div>
      </div>
    </div>
  );
}
