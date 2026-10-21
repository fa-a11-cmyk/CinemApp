const jwt = require('jsonwebtoken');
const User = require('../models/User');
const inMemoryStore = require('../config/inMemoryStore');

const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1];

      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET || 'fatma_adel_super_secure_jwt_secret_key_2026'
      );

      let user;
      if (global.isMongoConnected) {
        user = await User.findById(decoded.id).select('-password');
      } else {
        user = await inMemoryStore.findUserById(decoded.id);
      }

      if (!user) {
        return res.status(401).json({
          success: false,
          message: 'Utilisateur introuvable ou session expirée.'
        });
      }

      req.user = user;
      next();
    } catch (error) {
      return res.status(401).json({
        success: false,
        message: 'Jeton invalide ou session expirée. Veuillez vous reconnecter.'
      });
    }
  } else {
    return res.status(401).json({
      success: false,
      message: 'Accès refusé : Jeton d\'authentification manquant.'
    });
  }
};

module.exports = { protect };
