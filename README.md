# CinemApp — Plateforme Full-Stack de Découverte & Gestion Cinématographique

Application web full-stack développée avec **React 18**, **Express.js**, **Node.js** et **MongoDB**. La solution intègre une gestion sécurisée des utilisateurs (authentification stateless JWT, hachage bcrypt), une intégration résiliente de l'API externe OMDB avec enrichissement des données, ainsi qu'un système de gestion de favoris en temps réel.

---

## Architecture & Décisions Techniques

L'application est structurée selon les principes de séparation des responsabilités (*Separation of Concerns*) et une organisation modulaire découplée.

```
Fatma-Adel-Test-Technique/
├── backend/
│   ├── src/
│   │   ├── config/          # Connexion DB & stratégie de résilience
│   │   ├── controllers/     # Logique métier (Auth, Movies, Favorites)
│   │   ├── middleware/      # Gardes JWT, gestionnaire centralisé des erreurs
│   │   ├── models/          # Schémas Mongoose (User, Favorite)
│   │   ├── routes/          # Définition des endpoints REST
│   │   └── services/        # Client API OMDB, batching & enrichissement
│   ├── server.js            # Point d'entrée du serveur HTTP Express
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── components/      # Composants UI réutilisables (Navbar, Cards, Modals)
│   │   ├── context/         # Stores globaux React (AuthContext, FavoritesContext)
│   │   ├── pages/           # Vues applicatives (Dashboard, AuthPage)
│   │   ├── services/        # Client HTTP abstrait avec intercepteur de token
│   │   └── styles/          # Système de tokens CSS & variables globales
│   ├── index.html
│   ├── vite.config.js       # Configuration Vite & proxy de développement
│   └── package.json
│
└── package.json             # Orchestration monorepo (concurrently)
```

### 1. Sécurité & Authentification Stateless
- **Hachage cryptographique :** Les mots de passe sont salés et hachés via `bcryptjs` avec un facteur de coût de 10 tours avant toute persistance en base.
- **Jeton JWT (JSON Web Token) :** À la connexion, un token signé (HMAC-SHA256) d'une durée de validité de 7 jours est émis. Il transite via l'en-tête standard `Authorization: Bearer <token>`.
- **Sanitisation :** La méthode `toJSON` du modèle utilisateur retire systématiquement le hash du mot de passe des objets renvoyés par l'API.
- **Cycle de vie du token côté client :** Interception automatique des réponses HTTP 401 pour déconnecter immédiatement la session expirée et purger le cache local.

### 2. Intégration API Externe & Résilience
- **Enrichissement des données en parallèle :** L'API OMDB standard ne fournissant pas les synopsis dans la recherche de base (`s=...`), le service backend exécute un batching asynchrone (`Promise.all`) sur les 10 premiers résultats pour récupérer les descriptions (*plot*) et métadonnées sans dégrader le temps de réponse.
- **Masquage de clé & Proxy :** Les requêtes externes sont isolées côté serveur, empêchant l'exposition des clés d'API et prévenant les problèmes de CORS.
- **Tolérance aux pannes :** En cas d'indisponibilité du service tiers ou de dépassement de quota, un jeu de données de secours structuré prend le relais afin de garantir la continuité de service.

### 3. Persistance Hybride (Zero-Config Review)
- Le backend tente en priorité une connexion à l'instance MongoDB locale ou distante spécifiée dans `MONGODB_URI`.
- Si aucune base n'est active (environnement de test rapide ou CI), un adaptateur de persistance en mémoire prend le relais instantanément, permettant d'exécuter et d'évaluer l'application sans configuration préalable.

### 4. Interface Utilisateur & Expérience Développeur
- **React 18 + Vite :** Compilation ultra-rapide (HMR < 50ms) et bundle de production optimisé.
- **Gestion réactive de l'état :** Utilisation des Contexts React avec mise à jour optimiste de l'UI lors de l'ajout/suppression de favoris.
- **Design System Vanilla CSS :** Variables CSS modulaires (thème sombre cinématographique, glassmorphism, micro-interactions, responsive design mobile/desktop sans surcharge de framework tiers).

---

## Spécification de l'API REST

### Endpoints d'Authentification

| Méthode | Endpoint | Authentification | Description |
|---|---|---|---|
| `POST` | `/api/auth/register` | Public | Inscription (`nom`, `prenom`, `email`, `password`) |
| `POST` | `/api/auth/login` | Public | Authentification utilisateur & génération du token JWT |
| `GET` | `/api/auth/me` | Bearer JWT | Récupération du profil utilisateur actif |

### Endpoints Films

| Méthode | Endpoint | Authentification | Paramètres | Description |
|---|---|---|---|---|
| `GET` | `/api/movies/search` | Bearer JWT | `q` (query), `type` (movie/series), `page` | Recherche paginée avec enrichissement du plot |
| `GET` | `/api/movies/:id` | Bearer JWT | `id` (IMDb ID) | Fiche technique détaillée (casting, réalisateur, box-office) |

### Endpoints Favoris

| Méthode | Endpoint | Authentification | Description |
|---|---|---|---|
| `GET` | `/api/favorites` | Bearer JWT | Liste ordonnée des favoris de l'utilisateur connecté |
| `POST` | `/api/favorites` | Bearer JWT | Sauvegarde d'un film en favori (index unique composé `user` + `imdbID`) |
| `DELETE` | `/api/favorites/:imdbID` | Bearer JWT | Suppression d'un favori par son identifiant IMDb |

### Monitoring
| Méthode | Endpoint | Description |
|---|---|---|
| `GET` | `/api/health` | Vérification de la santé du serveur et timestamp |

---

## Configuration & Variables d'Environnement

Un fichier `.env` est configuré à la racine du backend (`backend/.env`) :

```env
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/fatma_adel_movieapp
JWT_SECRET=fatma_adel_super_secure_jwt_secret_key_2026
OMDB_API_KEY=trilogy
CLIENT_URL=http://localhost:5173
NODE_ENV=development
```

---

## Démarrage Rapide

### Prérequis
- **Node.js** >= 18.0.0
- **npm** >= 9.0.0

### 1. Installation des dépendances
```bash
# Installation simultanée à la racine
npm run install:all
```

### 2. Lancement en environnement de développement
```bash
npm run dev
```
Cette commande démarre simultanément :
- Le serveur backend Express sur `http://localhost:5000`
- Le serveur de développement frontend Vite sur `http://localhost:5173`

---

## Profil de Test Pré-configuré

Pour faciliter l'audit immédiat de l'application sans étape d'inscription préalable :

- **Email :** `fatma.adel@example.com`
- **Mot de passe :** `password123`

*(L'inscription de nouveaux comptes est opérationnelle et fonctionnelle directement depuis l'interface).*
