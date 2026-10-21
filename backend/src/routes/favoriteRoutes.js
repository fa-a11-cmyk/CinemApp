const express = require('express');
const router = express.Router();
const {
  getFavorites,
  addFavorite,
  removeFavorite
} = require('../controllers/favoriteController');
const { protect } = require('../middleware/authMiddleware');

// All favorite routes require authentication
router.use(protect);

router.get('/', getFavorites);
router.post('/', addFavorite);
router.delete('/:imdbID', removeFavorite);

module.exports = router;
