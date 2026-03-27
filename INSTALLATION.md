# 🔐 INFILTRATION : PROTOCOLE OMEGA
## Guide d'installation complet — Firebase + GitHub

---

## 📁 STRUCTURE DU PROJET

```
escape-game/
├── public/
│   ├── index.html          ← Application joueur (smartphone)
│   ├── admin.html          ← Panneau administrateur (PC)
│   ├── firebase-config.js  ← ⚠️ À CONFIGURER avec tes clés Firebase
│   ├── game-data.js        ← Énigmes par défaut + structure
│   └── manifest.json       ← Configuration PWA (app smartphone)
├── firebase.json           ← Config Firebase Hosting
└── database.rules.json     ← Règles Realtime Database
```

---

## ÉTAPE 1 — CRÉER UN PROJET FIREBASE

1. Va sur https://console.firebase.google.com
2. Clique **"Ajouter un projet"**
3. Donne un nom : ex. `infiltration-escape`
4. Désactive Google Analytics (pas nécessaire)
5. Clique **"Créer le projet"**

---

## ÉTAPE 2 — ACTIVER REALTIME DATABASE

1. Dans le menu gauche : **Build → Realtime Database**
2. Clique **"Créer une base de données"**
3. Choisis la région : **europe-west1 (Belgique)** (recommandé pour la France)
4. Mode de démarrage : **"Commencer en mode test"** (on changera les règles après)
5. Clique **"Activer"**

---

## ÉTAPE 3 — CONFIGURER LES RÈGLES DE SÉCURITÉ

1. Dans Realtime Database, onglet **"Règles"**
2. Remplace tout le contenu par :

```json
{
  "rules": {
    "players": {
      "$pseudo": {
        ".read": true,
        ".write": true
      }
    },
    "enigmas": {".read": true, ".write": true},
    "settings": {".read": true, ".write": true},
    "admin": {".read": true, ".write": true}
  }
}
```

3. Clique **"Publier"**

---

## ÉTAPE 4 — RÉCUPÉRER LES CLÉS FIREBASE

1. Dans Firebase Console : **⚙ Paramètres du projet** (icône engrenage en haut à gauche)
2. Onglet **"Général"** → scroll jusqu'à **"Vos applications"**
3. Clique **"</>  Web"** pour ajouter une appli web
4. Donne un nom : `infiltration-web`
5. ✅ Coche **"Configurer également Firebase Hosting"**
6. Clique **"Enregistrer l'application"**
7. Tu vois apparaître un bloc de code comme :

```javascript
const firebaseConfig = {
  apiKey: "AIzaSy...",
  authDomain: "ton-projet.firebaseapp.com",
  databaseURL: "https://ton-projet-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "ton-projet",
  storageBucket: "ton-projet.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123:web:abc123"
};
```

8. **Copie ces valeurs**

---

## ÉTAPE 5 — CONFIGURER firebase-config.js

Ouvre le fichier `public/firebase-config.js` et remplace les valeurs :

```javascript
const firebaseConfig = {
  apiKey: "COLLE_TON_API_KEY_ICI",
  authDomain: "TON_PROJET.firebaseapp.com",
  databaseURL: "https://TON_PROJET-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "TON_PROJET",
  storageBucket: "TON_PROJET.appspot.com",
  messagingSenderId: "TON_SENDER_ID",
  appId: "TON_APP_ID"
};
firebase.initializeApp(firebaseConfig);
const db = firebase.database();
```

⚠️ La ligne `databaseURL` est **cruciale** — vérifie qu'elle pointe vers ta région.

---

## ÉTAPE 6 — CRÉER UN DÉPÔT GITHUB

1. Va sur https://github.com → **"New repository"**
2. Nom du repo : `infiltration-escape-game`
3. Visibilité : **Private** (recommandé)
4. Clique **"Create repository"**

---

## ÉTAPE 7 — INSTALLER LES OUTILS (une seule fois)

### Installer Node.js
- Va sur https://nodejs.org
- Télécharge la version **LTS** (ex. 20.x)
- Installe-la normalement

### Installer Firebase CLI
Ouvre un terminal (PowerShell sur Windows ou Terminal sur Mac) :

```bash
npm install -g firebase-tools
```

### Installer Git (si pas déjà installé)
- https://git-scm.com/downloads

---

## ÉTAPE 8 — INITIALISER FIREBASE DANS LE DOSSIER

Dans ton terminal, navigue vers le dossier du projet :

```bash
cd chemin/vers/escape-game
```

Connecte-toi à Firebase :
```bash
firebase login
```
→ Une fenêtre de navigateur s'ouvre, connecte-toi avec ton compte Google.

Initialise le projet :
```bash
firebase init
```

Quand demandé :
- **Which Firebase features?** → Sélectionne `Hosting` et `Database` avec la barre espace, puis Entrée
- **Which project?** → Sélectionne ton projet `infiltration-escape`
- **Database Rules file?** → tape `database.rules.json`
- **Public directory?** → tape `public`
- **Configure as single-page app?** → `N` (non)
- **Set up automatic builds with GitHub?** → `Y` (oui)
  - Connecte ton GitHub
  - Nom du repo : `TON_PSEUDO/infiltration-escape-game`
  - **Set up automatic deploys on PR?** → `N`
  - **Set up automatic deploys on main branch?** → `Y`

---

## ÉTAPE 9 — POUSSER SUR GITHUB

```bash
git init
git add .
git commit -m "Initial commit — Infiltration Escape Game"
git branch -M main
git remote add origin https://github.com/TON_PSEUDO/infiltration-escape-game.git
git push -u origin main
```

---

## ÉTAPE 10 — DÉPLOYER SUR FIREBASE HOSTING

```bash
firebase deploy
```

Tu verras s'afficher à la fin :
```
✔ Deploy complete!
Hosting URL: https://ton-projet.web.app
```

**C'est cette URL que tu donnes aux joueurs !**

---

## POUR LES PROCHAINES MODIFICATIONS

Quand tu modifies des fichiers (énigmes, design...) :

```bash
git add .
git commit -m "Modification des énigmes"
git push
firebase deploy
```

Ou uniquement le hosting (plus rapide) :
```bash
firebase deploy --only hosting
```

---

## ACCÈS À L'APPLICATION

| Qui | URL | Description |
|-----|-----|-------------|
| **Joueurs** | `https://ton-projet.web.app` | App smartphone |
| **Admin** | `https://ton-projet.web.app/admin.html` | Panneau admin (PC) |

---

## INSTALLATION SUR SMARTPHONE (PWA)

### Sur iPhone (Safari) :
1. Ouvre l'URL dans **Safari** (obligatoire, pas Chrome)
2. Appuie sur l'icône **Partager** (carré avec flèche)
3. Sélectionne **"Sur l'écran d'accueil"**
4. L'icône de l'app apparaît sur l'écran d'accueil

### Sur Android (Chrome) :
1. Ouvre l'URL dans **Chrome**
2. Appuie sur les **3 points** en haut à droite
3. Sélectionne **"Ajouter à l'écran d'accueil"**
4. L'app s'installe comme une vraie application

---

## CONFIGURATION DU JEU (panneau admin)

### Connexion admin
- URL : `https://ton-projet.web.app/admin.html`
- Mot de passe par défaut : **`admin2025`**
- ⚠️ **Change-le** dans l'onglet Paramètres lors de la première connexion

### Paramétrer le jeu
1. Onglet **PARAMÈTRES** :
   - Changer le nom du jeu
   - Définir le **code d'accès** (ex. `MATRIX2025`) que tu donnes aux joueurs au démarrage
   - Changer le mot de passe admin

2. Onglet **ÉNIGMES** :
   - Clique sur une énigme dans la liste à gauche
   - Modifie titre, description, réponse, indice
   - Clique **SAUVEGARDER**
   - Les modifications sont immédiates pour tous les joueurs

3. Onglet **JOUEURS** :
   - Vue en temps réel de tous les joueurs
   - Chronomètre live pour chaque joueur en jeu
   - Bouton RESET pour réinitialiser un joueur individuel

4. Onglet **CLASSEMENT** :
   - Classement automatique des joueurs ayant terminé

### Réinitialiser une session de jeu
Dans l'onglet **PARAMÈTRES → Zone Dangereuse** :
- "Réinitialiser tous les joueurs" : efface tous les joueurs et leur progression

---

## STRUCTURE DES ÉNIGMES

| Phase | Nb | Mode | Débloquée quand |
|-------|----|------|-----------------|
| 1 | 5 | Libre (n'importe quel ordre) | Toujours disponible |
| 2 | 1 | Solo | Phase 1 complète |
| 3 | 3 | Libre | Phase 2 résolue |
| 4 | 1 | Solo | Phase 3 complète |
| 5 | 1 | Séquentielle | Phase 4 résolue |
| 6 | 1 | **FINALE** (stoppe chrono) | Phase 5 résolue |

---

## DÉPANNAGE

**Le jeu ne se connecte pas à Firebase :**
→ Vérifie la `databaseURL` dans `firebase-config.js`. Elle doit finir par `.firebasedatabase.app`

**Les joueurs ne peuvent pas créer de compte :**
→ Vérifie les règles de la Realtime Database (Étape 3)

**L'URL admin ne fonctionne pas :**
→ Assure-toi d'accéder à `https://ton-projet.web.app/admin.html` (pas juste `/admin`)

**Redéployer après modification :**
→ `firebase deploy --only hosting`

---

## COMMANDES UTILES

```bash
# Voir l'état du déploiement
firebase hosting:channel:list

# Prévisualiser localement avant de déployer
firebase serve

# Déployer seulement les règles de la DB
firebase deploy --only database

# Voir les logs
firebase functions:log
```
