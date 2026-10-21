const Favorite = require('../models/Favorite');
const inMemoryStore = require('../config/inMemoryStore');

/**
 * @desc    Récupérer les favoris de l'utilisateur
 * @route   GET /api/favorites
 */
const getFavorites = async (req, res, next) => {
  try {
    const userId = req.user._id || req.user.id;

    if (global.isMongoConnected) {
      const favorites = await Favorite.find({ user: userId }).sort({ createdAt: -1 });
      return res.status(200).json({
        success: true,
        count: favorites.length,
        favorites
      });
    } else {
      const favorites = await inMemoryStore.getFavorites(userId);
      return res.status(200).json({
        success: true,
        count: favorites.length,
        favorites
      });
    }
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Ajouter un film aux favoris
 * @route   POST /api/favorites
 */
const addFavorite = async (req, res, next) => {
  try {
    const userId = req.user._id || req.user.id;
    const { imdbID, title, year, poster, plot, type, genre, imdbRating } = req.body;

    if (!imdbID || !title) {
      return res.status(400).json({
        success: false,
        message: 'L\'identifiant IMDb et le titre sont requis.'
      });
    }

    if (global.isMongoConnected) {
      const existing = await Favorite.findOne({ user: userId, imdbID });
      if (existing) {
        return res.status(400).json({
          success: false,
          message: 'Ce film figure déjà dans votre liste de favoris.'
        });
      }

      const favorite = await Favorite.create({
        user: userId,
        imdbID,
        title,
        year: year || 'N/A',
        poster: poster || '',
        plot: plot || 'Aucune description disponible.',
        type: type || 'movie',
        genre: genre || '',
        imdbRating: imdbRating || 'N/A'
      });

      return res.status(201).json({
        success: true,
        message: `"${title}" a été ajouté à vos favoris avec succès.`,
        favorite
      });
    } else {
      const existing = await inMemoryStore.findFavorite(userId, imdbID);
      if (existing) {
        return res.status(400).json({
          success: false,
          message: 'Ce film figure déjà dans votre liste de favoris.'
        });
      }

      const favorite = await inMemoryStore.addFavorite({
        user: userId,
        imdbID,
        title,
        year,
        poster,
        plot,
        type,
        genre,
        imdbRating
      });

      return res.status(201).json({
        success: true,
        message: `"${title}" a été ajouté à vos favoris avec succès.`,
        favorite
      });
    }
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Supprimer un film des favoris
 * @route   DELETE /api/favorites/:imdbID
 */
const removeFavorite = async (req, res, next) => {
  try {
    const userId = req.user._id || req.user.id;
    const { imdbID } = req.params;

    if (global.isMongoConnected) {
      const favorite = await Favorite.findOneAndDelete({ user: userId, imdbID });
      if (!favorite) {
        return res.status(404).json({
          success: false,
          message: 'Film non trouvé dans vos favoris.'
        });
      }
      return res.status(200).json({
        success: true,
        message: 'Film retiré de vos favoris avec succès.',
        removedId: imdbID
      });
    } else {
      const removed = await inMemoryStore.removeFavorite(userId, imdbID);
      if (!removed) {
        return res.status(404).json({
          success: false,
          message: 'Film non trouvé dans vos favoris.'
        });
      }
      return res.status(200).json({
        success: true,
        message: 'Film retiré de vos favoris avec succès.',
        removedId: imdbID
      });
    }
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getFavorites,
  addFavorite,
  removeFavorite
};
