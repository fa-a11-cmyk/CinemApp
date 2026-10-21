const express = require('express');
const router = express.Router();
const { getMovies, getMovieById } = require('../controllers/movieController');
const { protect } = require('../middleware/authMiddleware');

// The dashboard is protected: require JWT token
router.get('/search', protect, getMovies);
router.get('/:id', protect, getMovieById);

module.exports = router;
