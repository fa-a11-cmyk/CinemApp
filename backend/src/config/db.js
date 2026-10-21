const mongoose = require('mongoose');

global.isMongoConnected = false;

/**
 * Connect to MongoDB with instant fallback to In-Memory store
 */
const connectDB = async () => {
  const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/fatma_adel_movieapp';

  try {
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 2000,
    });
    global.isMongoConnected = true;
    console.log(`[Database] MongoDB connecté avec succès : ${conn.connection.host}`);
    return conn;
  } catch (err) {
    global.isMongoConnected = false;
    console.warn(`[Database] MongoDB local inaccessible (${err.message}).`);
    console.log('[Database] ✅ Mode In-Memory activé automatiquement : Aucune installation MongoDB requise.');
    console.log('[Database] Compte de test pré-configuré : fatma.adel@example.com / password123');
    return null;
  }
};

module.exports = connectDB;
