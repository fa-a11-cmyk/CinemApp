import React, { useState, useEffect } from 'react';
import { SearchBar } from '../components/SearchBar';
import { MovieCard } from '../components/MovieCard';
import { MovieModal } from '../components/MovieModal';
import { movieService } from '../services/api';
import { useFavorites } from '../context/FavoritesContext';
import { Film, Heart, Loader2, Sparkles, Inbox } from 'lucide-react';

export function Dashboard({ activeTab, setActiveTab }) {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [currentQuery, setCurrentQuery] = useState('Batman');
  const [totalResults, setTotalResults] = useState(0);
  const [searchMessage, setSearchMessage] = useState('');
  const { favorites } = useFavorites();

  // Initial search on mount
  useEffect(() => {
    handleSearch('Batman', 'all');
  }, []);

  const handleSearch = async (query, type = 'all') => {
    setLoading(true);
    setCurrentQuery(query);
    setSearchMessage('');

    try {
      const res = await movieService.search(query, type);
      if (res.success) {
        setMovies(res.movies || []);
        setTotalResults(res.total || 0);
        if (res.movies.length === 0) {
          setSearchMessage(res.message || 'Aucun film trouvé pour cette recherche.');
        }
      } else {
        setMovies([]);
        setSearchMessage(res.message || 'Erreur lors de la recherche.');
      }
    } catch (err) {
      setMovies([]);
      setSearchMessage(err.message || 'Impossible de contacter l\'API de films.');
    } finally {
      setLoading(false);
    }
  };

  const displayedMovies = activeTab === 'favorites' ? favorites : movies;

  return (
    <div>
      {/* Hero Header with Search (shown primarily on Explore tab) */}
      {activeTab === 'explore' ? (
        <section className="hero-section">
          <h1 className="hero-title">
            Explorez les plus grands films du <span className="hero-highlight">Septième Art</span>
          </h1>
          <p className="hero-subtitle">
            Recherchez parmi des milliers de chefs-d'œuvre cinématographiques, consultez les synopsis détaillés et sauvegardez vos coups de cœur.
          </p>

          <SearchBar onSearch={handleSearch} loading={loading} />
        </section>
      ) : (
        <section className="hero-section" style={{ paddingBottom: '1rem' }}>
          <h1 className="hero-title">
            Vos films <span className="hero-highlight">Favoris</span>
          </h1>
          <p className="hero-subtitle">
            Retrouvez tous les films et séries que vous avez ajoutés à votre cinémathèque personnelle.
          </p>
        </section>
      )}

      {/* Main Content Area */}
      <main className="main-container">
        <div className="section-header">
          <h2 className="section-title">
            {activeTab === 'favorites' ? (
              <>
                <Heart size={20} color="#ef4444" fill="#ef4444" />
                <span>Ma Liste Personnelle</span>
              </>
            ) : (
              <>
                <Sparkles size={20} color="var(--accent-gold)" />
                <span>Résultats pour "{currentQuery}"</span>
              </>
            )}
          </h2>

          <span className="results-count">
            {activeTab === 'favorites'
              ? `${favorites.length} film${favorites.length > 1 ? 's' : ''} en favoris`
              : `${totalResults} résultat${totalResults > 1 ? 's' : ''}`}
          </span>
        </div>

        {/* Loading state */}
        {loading && (
          <div className="state-container">
            <Loader2 size={40} className="spinner state-icon" />
            <p>Chargement des films depuis l'API...</p>
          </div>
        )}

        {/* Empty state for Explore */}
        {!loading && activeTab === 'explore' && displayedMovies.length === 0 && (
          <div className="state-container">
            <Inbox size={48} className="state-icon" />
            <h3>{searchMessage || 'Aucun résultat trouvé'}</h3>
            <p style={{ marginTop: '0.5rem' }}>
              Essayez une autre recherche comme "Inception", "Interstellar", "Matrix" ou "Avatar".
            </p>
          </div>
        )}

        {/* Empty state for Favorites */}
        {!loading && activeTab === 'favorites' && displayedMovies.length === 0 && (
          <div className="state-container">
            <Heart size={48} className="state-icon" style={{ color: '#ef4444' }} />
            <h3>Aucun favori pour le moment</h3>
            <p style={{ marginTop: '0.5rem', marginBottom: '1.5rem' }}>
              Parcourez le catalogue et cliquez sur l'icône de cœur pour ajouter des films à votre liste personnelle.
            </p>
            <button
              className="btn-primary"
              style={{ margin: '0 auto' }}
              onClick={() => setActiveTab('explore')}
            >
              Explorer les films
            </button>
          </div>
        )}

        {/* Movie Grid */}
        {!loading && displayedMovies.length > 0 && (
          <div className="movies-grid">
            {displayedMovies.map((movie) => (
              <MovieCard
                key={movie.imdbID}
                movie={movie}
                onOpenModal={(m) => setSelectedMovie(m)}
              />
            ))}
          </div>
        )}
      </main>

      {/* Movie Details Modal */}
      {selectedMovie && (
        <MovieModal
          movie={selectedMovie}
          onClose={() => setSelectedMovie(null)}
        />
      )}
    </div>
  );
}
