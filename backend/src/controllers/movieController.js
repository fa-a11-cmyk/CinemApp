const movieService = require('../services/movieService');

/**
 * @desc    Rechercher des films via l'API OMDB
 * @route   GET /api/movies/search
 * @access  Public (ou protégé)
 */
const getMovies = async (req, res, next) => {
  try {
    const { q, type, page } = req.query;
    const query = q && q.trim().length > 0 ? q : 'batman';

    const result = await movieService.searchMovies(query, type, page);
    return res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Obtenir les détails complets d'un film
 * @route   GET /api/movies/:id
 * @access  Public (ou protégé)
 */
const getMovieById = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({
        success: false,
        message: 'Identifiant du film manquant'
      });
    }

    const result = await movieService.getMovieDetails(id);
    if (!result.success) {
      return res.status(404).json(result);
    }
    return res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getMovies,
  getMovieById
};
