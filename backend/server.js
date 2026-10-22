const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./src/config/db');
const { notFound, errorHandler } = require('./src/middleware/errorMiddleware');

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

// Middlewares
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Root API Welcome & Documentation endpoint
app.get(['/', '/api'], (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Bienvenue sur l\'API CinemApp — Développée par Fatma Adel',
    documentation: 'Consultez le README.md pour les détails complets de l\'architecture',
    frontendUrl: process.env.CLIENT_URL || 'http://localhost:5173',
    endpoints: {
      health: 'GET /api/health',
      auth: {
        register: 'POST /api/auth/register',
        login: 'POST /api/auth/login',
        me: 'GET /api/auth/me'
      },
      movies: {
        search: 'GET /api/movies/search?q=batman',
        details: 'GET /api/movies/:id'
      },
      favorites: {
        list: 'GET /api/favorites',
        add: 'POST /api/favorites',
        remove: 'DELETE /api/favorites/:imdbID'
      }
    }
  });
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    message: 'API CinemApp opérationnelle - Fatma Adel Test Technique',
    timestamp: new Date().toISOString()
  });
});

// Mount Routes
app.use('/api/auth', require('./src/routes/authRoutes'));
app.use('/api/movies', require('./src/routes/movieRoutes'));
app.use('/api/favorites', require('./src/routes/favoriteRoutes'));

// Error handling middlewares
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(`=======================================================`);
  console.log(`🚀 Serveur Backend démarré sur le port ${PORT}`);
  console.log(`📡 URL API : http://localhost:${PORT}/api`);
  console.log(`🩺 Healthcheck : http://localhost:${PORT}/api/health`);
  console.log(`=======================================================`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error(`[UnhandledRejection] Erreur non gérée : ${err.message}`);
  // Keep server alive in dev
});

module.exports = app;
