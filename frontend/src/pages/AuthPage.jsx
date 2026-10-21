import React, { useState } from 'react';
import { Film, Mail, Lock, User as UserIcon, ArrowRight, Loader2, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export function AuthPage({ onNotify }) {
  const { login, register } = useAuth();
  const [isRegister, setIsRegister] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Form State
  const [formData, setFormData] = useState({
    nom: '',
    prenom: '',
    email: '',
    password: '',
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isRegister) {
        if (!formData.nom || !formData.prenom) {
          throw new Error('Veuillez renseigner votre nom et prénom.');
        }
        if (formData.password.length < 6) {
          throw new Error('Le mot de passe doit comporter au moins 6 caractères.');
        }
        await register(formData);
        if (onNotify) onNotify('Compte créé avec succès ! Bienvenue sur CinemApp.', 'success');
      } else {
        await login(formData.email, formData.password);
        if (onNotify) onNotify('Connexion réussie. Bienvenue !', 'success');
      }
    } catch (err) {
      setError(err.message || "Une erreur s'est produite.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-card">
        {/* Brand Header */}
        <div className="auth-header">
          <div className="auth-logo">
            <div className="brand-icon">
              <Film size={24} />
            </div>
            <span>CinemApp</span>
          </div>
          <h2 className="auth-title">
            {isRegister ? 'Créer un compte' : 'Bon retour parmi nous'}
          </h2>
          <p className="auth-subtitle">
            {isRegister
              ? 'Renseignez vos coordonnées pour accéder au catalogue de films'
              : 'Connectez-vous pour consulter les films et gérer vos favoris'}
          </p>
        </div>

        {/* Tab switch between Login and Register */}
        <div className="auth-mode-tabs">
          <button
            type="button"
            className={`auth-tab-btn ${!isRegister ? 'active' : ''}`}
            onClick={() => {
              setIsRegister(false);
              setError('');
            }}
          >
            Connexion
          </button>
          <button
            type="button"
            className={`auth-tab-btn ${isRegister ? 'active' : ''}`}
            onClick={() => {
              setIsRegister(true);
              setError('');
            }}
          >
            Inscription
          </button>
        </div>

        {/* Error message */}
        {error && (
          <div className="auth-error-banner" style={{ marginBottom: '1.25rem' }}>
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="auth-form">
          {isRegister && (
            <div className="form-row">
              <div className="form-group">
                <label className="form-label" htmlFor="prenom">
                  Prénom
                </label>
                <div className="form-input-wrapper">
                  <UserIcon size={16} className="form-input-icon" />
                  <input
                    type="text"
                    id="prenom"
                    name="prenom"
                    required
                    className="form-input"
                    placeholder="Fatma"
                    value={formData.prenom}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="nom">
                  Nom
                </label>
                <div className="form-input-wrapper">
                  <UserIcon size={16} className="form-input-icon" />
                  <input
                    type="text"
                    id="nom"
                    name="nom"
                    required
                    className="form-input"
                    placeholder="Adel"
                    value={formData.nom}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>
          )}

          <div className="form-group">
            <label className="form-label" htmlFor="email">
              Adresse email
            </label>
            <div className="form-input-wrapper">
              <Mail size={16} className="form-input-icon" />
              <input
                type="email"
                id="email"
                name="email"
                required
                className="form-input"
                placeholder="fatma.adel@example.com"
                value={formData.email}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="password">
              Mot de passe
            </label>
            <div className="form-input-wrapper">
              <Lock size={16} className="form-input-icon" />
              <input
                type="password"
                id="password"
                name="password"
                required
                minLength={6}
                className="form-input"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
              />
            </div>
          </div>

          <button
            type="submit"
            className="auth-btn-submit"
            disabled={loading}
            id="auth-submit-btn"
          >
            {loading ? (
              <>
                <Loader2 size={18} className="spinner" />
                <span>Chargement...</span>
              </>
            ) : (
              <>
                <span>{isRegister ? "S'inscrire" : 'Se connecter'}</span>
                <ArrowRight size={18} />
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
