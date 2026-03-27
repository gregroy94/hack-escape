# 🎮 HACK//ESCAPE — Escape Game Numérique
### Guide d'installation complet — Firebase + GitHub

---

## 📋 VUE D'ENSEMBLE

```
hack-escape/
├── public/
│   ├── index.html          ← Page de connexion joueur
│   ├── manifest.json       ← PWA (installable sur smartphone)
│   ├── css/
│   │   └── terminal.css    ← Thème visuel "terminal hacker"
│   ├── js/
│   │   ├── firebase-config.js  ← Configuration Firebase (À MODIFIER)
│   │   ├── auth.js             ← Connexion / inscription
│   │   ├── game.js             ← Logique du jeu joueur
│   │   └── admin.js            ← Panneau admin
│   ├── pages/
│   │   ├── game.html       ← Interface jeu smartphone
│   │   └── admin.html      ← Interface admin PC
│   └── icons/              ← Icônes PWA (à créer, voir étape 4)
├── firebase.json           ← Configuration Firebase Hosting
├── database.rules.json     ← Règles de sécurité DB
└── seed_data.js            ← Données initiales (énigmes exemples)
```

---

## 🚀 ÉTAPE 1 — CRÉER LE PROJET FIREBASE

### 1.1 Aller sur Firebase Console
1. Ouvrez https://console.firebase.google.com
2. Cliquez **"Créer un projet"**
3. Nom : `hack-escape` (ou ce que vous voulez)
4. Désactivez Google Analytics (inutile ici)
5. Cliquez **"Créer le projet"**

### 1.2 Activer Realtime Database
1. Dans le menu gauche → **"Build"** → **"Realtime Database"**
2. Cliquez **"Créer une base de données"**
3. Choisissez l'emplacement : **europe-west1** (Europe)
4. Mode de démarrage : **"Mode test"** (on modifiera les règles après)
5. Cliquez **"Activer"**

### 1.3 Configurer Firebase Hosting
1. Dans le menu gauche → **"Build"** → **"Hosting"**
2. Cliquez **"Commencer"**
3. Suivez l'assistant (ne vous inquiétez pas du code, on le fait après)

### 1.4 Récupérer les clés de configuration
1. Cliquez l'icône ⚙️ (roue dentée) → **"Paramètres du projet"**
2. Faites défiler vers **"Vos applications"**
3. Cliquez **"</>  Web"** (ajouter une app web)
4. Nom : `hack-escape-web`, **décochez** Firebase Hosting pour l'instant
5. Cliquez **"Enregistrer l'application"**
6. Copiez le bloc `firebaseConfig` qui apparaît :

```javascript
const firebaseConfig = {
  apiKey: "AIzaSy...",
  authDomain: "hack-escape-xxxxx.firebaseapp.com",
  databaseURL: "https://hack-escape-xxxxx-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "hack-escape-xxxxx",
  storageBucket: "hack-escape-xxxxx.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef"
};
```

---

## 🔧 ÉTAPE 2 — CONFIGURER LE CODE

### 2.1 Modifier firebase-config.js
Ouvrez `/public/js/firebase-config.js` et **remplacez** les valeurs par les vôtres :

```javascript
const firebaseConfig = {
  apiKey: "VOTRE_VRAIE_API_KEY",
  authDomain: "votre-projet.firebaseapp.com",
  databaseURL: "https://votre-projet-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "votre-projet",
  storageBucket: "votre-projet.appspot.com",
  messagingSenderId: "votre-sender-id",
  appId: "votre-app-id"
};
```

### 2.2 Initialiser les données Firebase
1. Allez dans Firebase Console → **Realtime Database**
2. Cliquez les **3 points ⋮** en haut à droite → **"Import JSON"**
3. Ouvrez le fichier `seed_data.js` et copiez le contenu JSON entre les accolades `{}` après `const initialData = `
4. Collez dans Firebase et cliquez **Importer**

⚠️ Cela crée :
- `config/accessCode: "HACK2024"` (code d'accès au jeu)
- `config/adminPassword: "admin1234"` (mot de passe admin)
- `enigmas/` avec 12 énigmes exemples

---

## 📁 ÉTAPE 3 — GITHUB

### 3.1 Créer le dépôt GitHub
1. Allez sur https://github.com → **"New repository"**
2. Nom : `hack-escape`
3. **Public** ou **Private** (au choix)
4. **Ne pas** initialiser avec README (on a déjà les fichiers)
5. Cliquez **"Create repository"**

### 3.2 Pousser le code
Ouvrez un terminal dans le dossier du projet :

```bash
# Initialiser git
git init
git add .
git commit -m "Initial commit - HACK//ESCAPE"

# Connecter à GitHub (remplacez VOTRE_USERNAME)
git remote add origin https://github.com/VOTRE_USERNAME/hack-escape.git
git branch -M main
git push -u origin main
```

---

## ☁️ ÉTAPE 4 — DÉPLOYER SUR FIREBASE HOSTING

### 4.1 Installer les outils Firebase
Assurez-vous d'avoir **Node.js** installé (https://nodejs.org).

```bash
# Installer Firebase CLI globalement
npm install -g firebase-tools

# Vérifier l'installation
firebase --version
```

### 4.2 Se connecter à Firebase
```bash
firebase login
# Une fenêtre de navigateur s'ouvre → connectez-vous avec votre compte Google
```

### 4.3 Initialiser Firebase dans le projet
```bash
# Aller dans votre dossier projet
cd hack-escape

# Initialiser Firebase
firebase init

# Répondez aux questions :
# ✓ Which Firebase features? → sélectionnez "Hosting" et "Database" (avec espace, puis Entrée)
# ✓ Use an existing project? → Sélectionnez "hack-escape" (votre projet)
# ✓ What do you want to use as your public directory? → tapez: public
# ✓ Configure as single-page app? → N (non)
# ✓ Set up automatic builds with GitHub? → N (non pour l'instant)
# ✓ File public/index.html already exists, Overwrite? → N (non !)
```

### 4.4 Déployer
```bash
firebase deploy
```

Firebase vous donnera une URL du type :
**https://hack-escape-xxxxx.web.app**

C'est l'URL à partager aux joueurs ! 🎉

### 4.5 Redéployer après modifications
À chaque fois que vous modifiez le code :
```bash
firebase deploy
# ou seulement le hosting (plus rapide) :
firebase deploy --only hosting
```

---

## 🎮 ÉTAPE 5 — ICÔNES PWA (Pour installation smartphone)

Créez un dossier `/public/icons/` et ajoutez deux images PNG :
- `icon-192.png` (192×192 pixels)
- `icon-512.png` (512×512 pixels)

**Option simple** : Utilisez https://favicon.io pour générer des icônes depuis du texte. Tapez "HE" (pour Hack Escape), fond noir (#060b06), texte vert (#00ff41).

---

## 📱 ÉTAPE 6 — INSTALLATION SUR SMARTPHONE

### Sur Android (Chrome)
1. Ouvrir Chrome → aller sur **votre-app.web.app**
2. Menu Chrome (3 points) → **"Ajouter à l'écran d'accueil"**
3. Confirmer → l'icône apparaît comme une vraie app !

### Sur iPhone (Safari)
1. Ouvrir Safari → aller sur **votre-app.web.app**
2. Bouton partage (rectangle avec flèche) 
3. **"Sur l'écran d'accueil"** → **"Ajouter"**
4. L'icône apparaît sur l'écran d'accueil

### QR Code pour distribuer l'URL
Utilisez https://qr-code-generator.com pour créer un QR code vers votre URL.
Affichez-le au début de la séance.

---

## 🔒 ÉTAPE 7 — SÉCURITÉ (Recommandée)

### Protéger la page admin
L'URL admin est `/pages/admin.html` ou `/admin`.
Elle est protégée par mot de passe (défaut: `admin1234`).
**Changez ce mot de passe** depuis le panneau admin → onglet Paramètres.

### Règles Firebase Database
Les règles actuelles (`database.rules.json`) permettent tout lire/écrire.
C'est suffisant pour un jeu en présentiel contrôlé.
Pour plus de sécurité, vous pouvez restreindre les règles après.

---

## ⚙️ UTILISATION — GUIDE ANIMATEUR

### Avant la séance
1. Connectez-vous sur **/pages/admin.html** avec votre mot de passe
2. Onglet **ÉNIGMES** → configurez toutes les énigmes, réponses, indices
3. Onglet **PARAMÈTRES** → définissez le code d'accès à donner aux joueurs
4. Distribuez l'URL (ou QR code) aux joueurs

### Pendant la séance
1. Onglet **JOUEURS** → suivi en temps réel des progressions et chronos
2. Bouton **RESET** individuel si un joueur a un problème
3. Le classement se met à jour automatiquement

### Après la séance
1. Onglet **CLASSEMENT** → affichez les résultats
2. Bouton **⚠ RÉINITIALISER TOUT** pour effacer tous les joueurs pour la prochaine session

---

## 🎯 STRUCTURE DES ÉNIGMES

```
CODE D'ACCÈS (chrono démarre ici)
│
├── PHASE 1 — 5 énigmes (e1 à e5) — dans n'importe quel ordre
│
├── PHASE 2 — 1 énigme seule (e6) — débloquée quand phase 1 finie
│
├── PHASE 3 — 3 énigmes (e7, e8, e9) — dans n'importe quel ordre
│             débloquées quand phase 2 finie
│
├── PHASE 4 — 1 énigme seule (e10) — débloquée quand phase 3 finie
│
└── PHASE FINALE — 2 énigmes séquentielles (e11 puis e12)
                   e12 débloquée quand e11 résolue
                   e12 résolue = VICTOIRE + CHRONO STOP
```

---

## 🔄 RÉUTILISER POUR UNE AUTRE SÉANCE

1. Admin → **Paramètres** → changer le code d'accès
2. Admin → **Énigmes** → modifier le contenu
3. Admin → **⚠ RÉINITIALISER TOUT** pour effacer les joueurs
4. Redéployez si vous avez modifié des fichiers : `firebase deploy`

---

## ❓ PROBLÈMES FRÉQUENTS

**"La page ne se charge pas"**
→ Vérifiez que firebase-config.js contient vos vraies clés

**"Impossible de se connecter à la base de données"**
→ Vérifiez que Realtime Database est activé et que databaseURL est correct

**"Le joueur ne retrouve pas sa session"**
→ Il doit utiliser le même navigateur (cookies/localStorage)

**"L'admin ne voit pas les joueurs"**
→ Vérifiez les règles database.rules.json et redéployez

---

## 📞 COMMANDES UTILES

```bash
# Voir le projet en local (test sans déployer)
firebase serve

# Déployer tout
firebase deploy

# Déployer uniquement le hosting
firebase deploy --only hosting

# Déployer uniquement les règles DB
firebase deploy --only database

# Voir les logs
firebase functions:log
```

---

*HACK//ESCAPE — Développé pour animations jeunesse*
*Thème : Piratage informatique | Style : Terminal sombre*
