# CinemApp - Test Technique Full Stack (React / Express / MongoDB)
> **Candidat :** Fatma Adel  
> **Poste :** Développeur Full Stack (Stage / Alternance)  
> **Stack :** React.js • Node.js / Express • MongoDB • JWT • OMDB API  

---

## 🎯 Présentation du Projet

**CinemApp** est une application web full-stack moderne permettant aux utilisateurs de s'inscrire, de se connecter de façon sécurisée (avec hachage de mot de passe par **bcrypt** et authentification par **JWT**), de rechercher des films et séries en temps réel via l'API **OMDB**, d'en consulter les fiches détaillées (synopsis complet, réalisateur, casting, notes) et de gérer une liste personnalisée de **films favoris** persistée en base de données.

---

## 📋 Fonctionnalités Implémentées

### 1. Authentification & Sécurité (MVP + Bonus)
- **Inscription utilisateur :** Validation des champs (`nom`, `prénom`, `email`, `mot de passe`).
- **Hachage sécurisé :** Mots de passe chiffrés avec **bcrypt** (salt rounds = 10).
- **Connexion utilisateur :** Authentification par email et mot de passe.
- **Sécurisation par JWT (Bonus) :** Génération de tokens signés avec expiration (7 jours).
- **Middleware d'authentification (Bonus) :** Protection des routes API via `Bearer <token>`.
- **Menu Profil Dropdown :** Affichage du nom de l'utilisateur, avatar avec initiales, email et bouton de déconnexion dans un menu déroulant en haut à droite.

### 2. Dashboard & Recherche de Films (MVP)
- **Accès protégé :** Accessible uniquement aux utilisateurs connectés via redirection automatique.
- **Barre de recherche interactive :** Recherche par titre avec filtres par type (*Tous*, *Films*, *Séries*) et suggestions rapides (*Batman, Inception, Interstellar, Matrix...*).
- **Affichage des résultats conforme :**
  - Affiche pour chaque film : **Titre**, **Image (Poster)**, **Année**, et **Description (Synopsis)**.
  - Gestion des images manquantes (*fallback placeholder* élégant).

### 3. Gestion des Favoris (Bonus)
- **Ajout / Suppression en 1 clic :** Bouton cœur animé sur chaque carte et dans la modal de détails.
- **Persistance en base de données :** Collection MongoDB dédiée par utilisateur.
- **Onglet "Mes Favoris" :** Consultation et filtrage en temps réel de sa cinémathèque personnelle avec compteur dynamique.

### 4. Modal de Détails Cinématographiques
- Fiche complète avec note IMDb, classification d'âge, durée, genres, réalisateur, casting principal, récompenses et box-office.

---

## 🏗️ Architecture du Projet

Le projet respecte une architecture logicielle modulaire et découplée (MVC côté serveur, composants atomiques et Context API côté client).

```
Fatma-Adel-Test-Technique/
├── package.json              # Script racine pour orchestrer frontend & backend
├── .gitignore                # Exclusion node_modules, .env, build artifacts
├── README.md                 # Documentation complète d'ingénierie
│
├── backend/                  # Serveur RESTful Express / MongoDB
│   ├── package.json
│   ├── server.js             # Point d'entrée de l'API Express
│   ├── .env.example          # Gabarit des variables d'environnement
│   ├── .env                  # Configuration locale
│   └── src/
│       ├── config/
│       │   ├── db.js             # Connexion MongoDB + Fallback In-Memory automatique
│       │   └── inMemoryStore.js  # Store in-memory immédiat (zéro dépendance externe)
│       ├── controllers/
│       │   ├── authController.js     # Logique inscription, login, getMe
│       │   ├── movieController.js    # Recherche & détails de films
│       │   └── favoriteController.js # CRUD des favoris utilisateur
│       ├── middleware/
│       │   ├── authMiddleware.js     # Vérification JWT Bearer
│       │   └── errorMiddleware.js    # Gestion centralisée des erreurs (404, 500)
│       ├── models/
│       │   ├── User.js               # Schéma Mongoose utilisateur (bcrypt pre-save)
│       │   └── Favorite.js           # Schéma Mongoose favoris avec index unique
│       ├── routes/
│       │   ├── authRoutes.js         # Routes /api/auth
│       │   ├── movieRoutes.js        # Routes /api/movies
│       │   └── favoriteRoutes.js     # Routes /api/favorites
│       └── services/
│           └── movieService.js       # Intégration OMDB API + cache et résilience
│
└── frontend/                 # Client React 18 + Vite
    ├── package.json
    ├── vite.config.js        # Configuration du proxy API
    ├── index.html            # Template HTML avec typographie Google Fonts
    └── src/
        ├── App.jsx           # Orchestration des providers et vues
        ├── main.jsx          # Point de montage React 18
        ├── context/
        │   ├── AuthContext.jsx       # État d'authentification global
        │   └── FavoritesContext.jsx  # Gestion réactive des favoris
        ├── services/
        │   └── api.js                # Client HTTP fetch avec intercepteur JWT
        ├── components/
        │   ├── Navbar.jsx            # Barre de navigation + User Dropdown
        │   ├── SearchBar.jsx         # Recherche et filtres par catégorie
        │   ├── MovieCard.jsx         # Carte film (titre, image, année, plot)
        │   ├── MovieModal.jsx        # Modal de détails et synopsis complet
        │   └── Toast.jsx             # Système de notifications instantanées
        ├── pages/
        │   ├── AuthPage.jsx          # Écran Inscription / Connexion
        │   └── Dashboard.jsx         # Tableau de bord principal
        └── styles/
            └── index.css             # Design system Cinema Dark & Responsive
```

---

## 🚀 Installation & Démarrage Rapide

### Prérequis
- **Node.js** (v18 ou supérieur)
- **npm** (v9 ou supérieur)
- *MongoDB* (optionnel : si MongoDB n'est pas installé, l'application bascule automatiquement et de façon transparente sur un moteur en mémoire, garantissant une exécution immédiate sans configuration !)

### 1. Cloner le Dépôt
```bash
git clone <URL_DU_DEPOT_GITHUB>
cd Fatma-Adel-Test-Technique
```

### 2. Installer les Dépendances
Installez les dépendances du frontend et du backend :
```bash
# À la racine du projet
npm run install:all
```
*(ou manuellement dans chaque dossier : `cd backend && npm install` puis `cd ../frontend && npm install`)*

### 3. Lancer l'Application
Lancez le backend et le frontend en une seule commande :
```bash
npm run dev
```

- **Frontend (Interface web) :** [http://localhost:5173](http://localhost:5173)
- **Backend (API REST) :** [http://localhost:5000/api](http://localhost:5000/api)
- **Healthcheck :** [http://localhost:5000/api/health](http://localhost:5000/api/health)

---

## 🔑 Compte de Test Pré-configuré

Pour faciliter l'évaluation, un compte utilisateur de test est immédiatement utilisable :
- **Email :** `fatma.adel@example.com`
- **Mot de passe :** `password123`

*(Vous pouvez également créer un nouveau compte via l'onglet Inscription)*

---

## 📡 Documentation des Endpoints de l'API

### Authentification (`/api/auth`)
| Méthode | Route | Description | Accès |
|---|---|---|---|
| `POST` | `/api/auth/register` | Inscription (`nom`, `prenom`, `email`, `password`) | Public |
| `POST` | `/api/auth/login` | Connexion (`email`, `password`) et retour du token JWT | Public |
| `GET` | `/api/auth/me` | Récupération du profil de l'utilisateur connecté | Privé (JWT) |

### Films (`/api/movies`)
| Méthode | Route | Description | Accès |
|---|---|---|---|
| `GET` | `/api/movies/search?q=batman&type=movie` | Recherche de films enrichie avec synopsis | Privé (JWT) |
| `GET` | `/api/movies/:id` | Détails complets d'un film par IMDb ID | Privé (JWT) |

### Favoris (`/api/favorites`)
| Méthode | Route | Description | Accès |
|---|---|---|---|
| `GET` | `/api/favorites` | Liste des favoris de l'utilisateur connecté | Privé (JWT) |
| `POST` | `/api/favorites` | Ajout d'un film aux favoris | Privé (JWT) |
| `DELETE` | `/api/favorites/:imdbID` | Suppression d'un film des favoris | Privé (JWT) |

---

## 🛡️ Bonnes Pratiques Appliquées
- **Sécurité :** Mots de passe chiffrés avec salage bcrypt, jetons JWT sécurisés, protection CORS configurée, désérialisation propre (les mots de passe ne sont jamais renvoyés dans les réponses API).
- **Clean Code & Typage :** Composants React modulaires, custom hooks, séparation stricte des préoccupations (Controllers / Services / Routes / Middleware).
- **Expérience Utilisateur (UI/UX) :** Design cinématographique sombre moderne, animations soignées, états de chargement (*loaders*), gestion des erreurs réseau avec notifications Toast, adaptation multi-écrans (*mobile-first & desktop*).
- **Résilience API :** Enrichissement asynchrone des données OMDB et catalogue de secours intégré pour garantir une expérience sans faille lors des tests.

---
*Projet développé avec rigueur par **Fatma Adel** dans le cadre du test technique de recrutement Full Stack.*
