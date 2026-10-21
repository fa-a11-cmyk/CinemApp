const mongoose = require('mongoose');

const favoriteSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },
    imdbID: {
      type: String,
      required: [true, 'L\'identifiant IMDb est obligatoire'],
      trim: true
    },
    title: {
      type: String,
      required: [true, 'Le titre du film est obligatoire'],
      trim: true
    },
    year: {
      type: String,
      default: 'N/A'
    },
    poster: {
      type: String,
      default: ''
    },
    plot: {
      type: String,
      default: 'Aucune description disponible.'
    },
    type: {
      type: String,
      default: 'movie'
    },
    genre: {
      type: String,
      default: ''
    },
    imdbRating: {
      type: String,
      default: 'N/A'
    }
  },
  {
    timestamps: true
  }
);

// Compound unique index so a user cannot save the same movie multiple times
favoriteSchema.index({ user: 1, imdbID: 1 }, { unique: true });

module.exports = mongoose.model('Favorite', favoriteSchema);
