// ============================================================
// AUTH.JS — Gestion connexion / inscription des joueurs
// Stockage: Firebase Realtime Database (pas Firebase Auth)
// Les mots de passe sont hachés côté client (SHA-256)
// ============================================================

// Hash SHA-256 simple côté client
async function hashPassword(password) {
  const msgBuffer = new TextEncoder().encode(password);
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

// Sanitize pseudo (alphanumeric + underscore, tiret)
function sanitizePseudo(pseudo) {
  return pseudo.trim().toLowerCase().replace(/[^a-z0-9_\-]/g, '');
}

function showLogin() {
  document.getElementById('loginPanel').classList.remove('hidden');
  document.getElementById('registerPanel').classList.add('hidden');
}

function showRegister() {
  document.getElementById('loginPanel').classList.add('hidden');
  document.getElementById('registerPanel').classList.remove('hidden');
}

function showError(elementId, message) {
  const el = document.getElementById(elementId);
  el.textContent = '! ' + message;
  el.classList.remove('hidden');
  setTimeout(() => el.classList.add('hidden'), 5000);
}

// Vérifier si jeu actif
async function checkGameActive() {
  const snap = await db.ref('config/gameActive').get();
  return snap.exists() ? snap.val() : true;
}

// CONNEXION
async function loginPlayer() {
  const pseudo = sanitizePseudo(document.getElementById('pseudoInput').value);
  const password = document.getElementById('passwordInput').value;

  if (!pseudo || !password) {
    showError('loginError', 'Remplissez tous les champs.');
    return;
  }

  try {
    const snap = await db.ref(`players/${pseudo}`).get();
    if (!snap.exists()) {
      showError('loginError', 'Identifiant inconnu. Créez un compte.');
      return;
    }

    const playerData = snap.val();
    const hashedPwd = await hashPassword(password);

    if (playerData.passwordHash !== hashedPwd) {
      showError('loginError', 'Mot de passe incorrect.');
      return;
    }

    // Stocker session locale
    localStorage.setItem('hackEscape_pseudo', pseudo);
    localStorage.setItem('hackEscape_session', Date.now());

    // Marquer en ligne
    await db.ref(`players/${pseudo}/online`).set(true);
    await db.ref(`players/${pseudo}/lastSeen`).set(Date.now());

    window.location.href = '/pages/game.html';
  } catch (err) {
    console.error(err);
    showError('loginError', 'Erreur de connexion. Réessayez.');
  }
}

// INSCRIPTION
async function registerPlayer() {
  const pseudo = sanitizePseudo(document.getElementById('regPseudo').value);
  const password = document.getElementById('regPassword').value;
  const confirm = document.getElementById('regPasswordConfirm').value;

  if (!pseudo || pseudo.length < 2) {
    showError('registerError', 'Pseudo invalide (min. 2 caractères, lettres/chiffres/tiret/_).');
    return;
  }
  if (password.length < 4) {
    showError('registerError', 'Mot de passe trop court (min. 4 caractères).');
    return;
  }
  if (password !== confirm) {
    showError('registerError', 'Les mots de passe ne correspondent pas.');
    return;
  }
  if (pseudo === 'admin') {
    showError('registerError', 'Ce pseudo est réservé.');
    return;
  }

  try {
    // Vérifier unicité
    const snap = await db.ref(`players/${pseudo}`).get();
    if (snap.exists()) {
      showError('registerError', 'Ce pseudo est déjà pris. Choisissez-en un autre.');
      return;
    }

    const hashedPwd = await hashPassword(password);

    // Créer le joueur
    await db.ref(`players/${pseudo}`).set({
      pseudo,
      passwordHash: hashedPwd,
      createdAt: Date.now(),
      online: false,
      gameStarted: false,
      gameFinished: false,
      codeEntered: false,
      chronoStart: null,
      chronoElapsed: 0,
      penalties: 0,
      hintsUsed: 0,
      solvedEnigmas: {},
      lastSeen: Date.now()
    });

    localStorage.setItem('hackEscape_pseudo', pseudo);
    localStorage.setItem('hackEscape_session', Date.now());
    await db.ref(`players/${pseudo}/online`).set(true);

    window.location.href = '/pages/game.html';
  } catch (err) {
    console.error(err);
    showError('registerError', 'Erreur lors de la création du compte. Réessayez.');
  }
}

// Écoute Enter sur les inputs
document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('passwordInput')?.addEventListener('keydown', e => {
    if (e.key === 'Enter') loginPlayer();
  });
  document.getElementById('regPasswordConfirm')?.addEventListener('keydown', e => {
    if (e.key === 'Enter') registerPlayer();
  });

  // Si déjà connecté, redirect
  const pseudo = localStorage.getItem('hackEscape_pseudo');
  if (pseudo) {
    window.location.href = '/pages/game.html';
  }
});
