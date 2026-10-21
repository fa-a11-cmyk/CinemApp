import React, { createContext, useContext, useState, useEffect } from 'react';
import { favoriteService } from '../services/api';
import { useAuth } from './AuthContext';

const FavoritesContext = createContext(null);

export function FavoritesProvider({ children, onNotify }) {
  const { isAuthenticated } = useAuth();
  const [favorites, setFavorites] = useState([]);
  const [favoriteIds, setFavoriteIds] = useState(new Set());
  const [loading, setLoading] = useState(false);

  // Fetch favorites whenever user logs in
  useEffect(() => {
    if (isAuthenticated) {
      fetchFavorites();
    } else {
      setFavorites([]);
      setFavoriteIds(new Set());
    }
  }, [isAuthenticated]);

  const fetchFavorites = async () => {
    setLoading(true);
    try {
      const res = await favoriteService.getAll();
      if (res.success && Array.isArray(res.favorites)) {
        setFavorites(res.favorites);
        setFavoriteIds(new Set(res.favorites.map((f) => f.imdbID)));
      }
    } catch (err) {
      console.warn('Erreur lors du chargement des favoris :', err.message);
    } finally {
      setLoading(false);
    }
  };

  const isFavorite = (imdbID) => {
    return favoriteIds.has(imdbID);
  };

  const toggleFavorite = async (movie) => {
    const exists = favoriteIds.has(movie.imdbID);

    if (exists) {
      // Remove
      try {
        await favoriteService.remove(movie.imdbID);
        setFavorites((prev) => prev.filter((f) => f.imdbID !== movie.imdbID));
        setFavoriteIds((prev) => {
          const next = new Set(prev);
          next.delete(movie.imdbID);
          return next;
        });
        if (onNotify) onNotify(`"${movie.title}" a été retiré de vos favoris.`, 'info');
      } catch (err) {
        if (onNotify) onNotify(err.message || 'Erreur lors du retrait du favori', 'error');
      }
    } else {
      // Add
      try {
        const payload = {
          imdbID: movie.imdbID,
          title: movie.title,
          year: movie.year,
          poster: movie.poster,
          plot: movie.plot,
          type: movie.type,
          genre: movie.genre,
          imdbRating: movie.imdbRating,
        };
        const res = await favoriteService.add(payload);
        if (res.success && res.favorite) {
          setFavorites((prev) => [res.favorite, ...prev]);
          setFavoriteIds((prev) => new Set([...prev, movie.imdbID]));
          if (onNotify) onNotify(`"${movie.title}" a été ajouté à vos favoris !`, 'success');
        }
      } catch (err) {
        if (onNotify) onNotify(err.message || "Erreur lors de l'ajout aux favoris", 'error');
      }
    }
  };

  return (
    <FavoritesContext.Provider
      value={{
        favorites,
        favoriteIds,
        loading,
        isFavorite,
        toggleFavorite,
        refreshFavorites: fetchFavorites,
        count: favorites.length,
      }}
    >
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error('useFavorites must be used within a FavoritesProvider');
  }
  return context;
}
