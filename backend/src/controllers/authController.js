const jwt = require('jsonwebtoken');
const User = require('../models/User');
const inMemoryStore = require('../config/inMemoryStore');

const generateToken = (id) => {
  return jwt.sign(
    { id },
    process.env.JWT_SECRET || 'fatma_adel_super_secure_jwt_secret_key_2026',
    { expiresIn: '7d' }
  );
};

/**
 * @desc    Inscription d'un utilisateur
 * @route   POST /api/auth/register
 */
const register = async (req, res, next) => {
  try {
    const { nom, prenom, email, password } = req.body;

    if (!nom || !prenom || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Veuillez renseigner tous les champs obligatoires (nom, prénom, email, mot de passe).'
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Le mot de passe doit contenir au moins 6 caractères.'
      });
    }

    let user;
    if (global.isMongoConnected) {
      const existingUser = await User.findOne({ email: email.toLowerCase() });
      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: 'Un compte existe déjà avec cette adresse email.'
        });
      }
      user = await User.create({
        nom: nom.trim(),
        prenom: prenom.trim(),
        email: email.toLowerCase().trim(),
        password
      });
    } else {
      const existing = await inMemoryStore.findUserByEmail(email);
      if (existing) {
        return res.status(400).json({
          success: false,
          message: 'Un compte existe déjà avec cette adresse email.'
        });
      }
      user = await inMemoryStore.createUser({
        nom: nom.trim(),
        prenom: prenom.trim(),
        email: email.toLowerCase().trim(),
        password
      });
    }

    const token = generateToken(user._id || user.id);

    return res.status(201).json({
      success: true,
      message: 'Compte créé avec succès ! Bienvenue sur CinemApp.',
      token,
      user: {
        id: user._id || user.id,
        nom: user.nom,
        prenom: user.prenom,
        email: user.email,
        createdAt: user.createdAt
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Connexion d'un utilisateur
 * @route   POST /api/auth/login
 */
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Veuillez renseigner votre email et mot de passe.'
      });
    }

    let user;
    if (global.isMongoConnected) {
      user = await User.findOne({ email: email.toLowerCase().trim() });
    } else {
      user = await inMemoryStore.findUserByEmail(email);
    }

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Identifiants invalides (email ou mot de passe incorrect).'
      });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Identifiants invalides (email ou mot de passe incorrect).'
      });
    }

    const token = generateToken(user._id || user.id);

    return res.status(200).json({
      success: true,
      message: 'Connexion réussie.',
      token,
      user: {
        id: user._id || user.id,
        nom: user.nom,
        prenom: user.prenom,
        email: user.email,
        createdAt: user.createdAt
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Profil utilisateur connecté
 * @route   GET /api/auth/me
 */
const getMe = async (req, res, next) => {
  try {
    const user = req.user;
    return res.status(200).json({
      success: true,
      user: {
        id: user._id || user.id,
        nom: user.nom,
        prenom: user.prenom,
        email: user.email,
        createdAt: user.createdAt
      }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  register,
  login,
  getMe
};
