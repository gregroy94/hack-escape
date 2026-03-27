// ============================================================
// GAME.JS — Logique principale du jeu côté joueur
// ============================================================

let playerPseudo = null;
let playerData = null;
let enigmasConfig = null;
let gameConfig = null;
let currentEnigmaId = null;
let chronoInterval = null;

// ============================================================
// INIT
// ============================================================
document.addEventListener('DOMContentLoaded', async () => {
  playerPseudo = localStorage.getItem('hackEscape_pseudo');
  if (!playerPseudo) {
    window.location.href = '/';
    return;
  }

  try {
    // Charger données joueur
    const playerSnap = await db.ref(`players/${playerPseudo}`).get();
    if (!playerSnap.exists()) {
      localStorage.clear();
      window.location.href = '/';
      return;
    }
    playerData = playerSnap.val();

    // Charger config jeu + énigmes
    const [configSnap, enigmasSnap] = await Promise.all([
      db.ref('config').get(),
      db.ref('enigmas').get()
    ]);
    gameConfig = configSnap.val() || {};
    enigmasConfig = enigmasSnap.val() || {};

    // Marquer en ligne
    await db.ref(`players/${playerPseudo}/online`).set(true);
    await db.ref(`players/${playerPseudo}/lastSeen`).set(Date.now());

    // Détecter état du joueur
    if (playerData.gameFinished) {
      showVictoryScreen();
    } else if (!playerData.codeEntered) {
      showAccessCodeScreen();
    } else {
      startGameScreen();
    }

    // Écouter déconnexion
    window.addEventListener('beforeunload', () => {
      db.ref(`players/${playerPseudo}/online`).set(false);
      if (playerData && playerData.gameStarted && !playerData.gameFinished) {
        // Sauvegarder temps écoulé
        const elapsed = getElapsed();
        db.ref(`players/${playerPseudo}/chronoElapsed`).set(elapsed);
      }
    });

  } catch (err) {
    console.error('Init error:', err);
    showToast('Erreur de connexion au serveur.', 'error');
  }
});

// ============================================================
// CHRONO
// ============================================================
function getElapsed() {
  if (!playerData.gameStarted) return 0;
  const base = playerData.chronoElapsed || 0;
  const penalties = (playerData.penalties || 0);
  if (playerData.chronoStart) {
    const running = Date.now() - playerData.chronoStart;
    return base + running + penalties;
  }
  return base + penalties;
}

function formatTime(ms) {
  const totalSec = Math.floor(ms / 1000);
  const h = Math.floor(totalSec / 3600);
  const m = Math.floor((totalSec % 3600) / 60);
  const s = totalSec % 60;
  return [h, m, s].map(v => String(v).padStart(2, '0')).join(':');
}

function startChrono() {
  if (chronoInterval) clearInterval(chronoInterval);
  chronoInterval = setInterval(() => {
    const elapsed = getElapsed();
    const el = document.getElementById('chronoDisplay');
    if (!el) return;
    el.textContent = formatTime(elapsed);
    const sec = elapsed / 1000;
    if (sec > 3600) { el.className = 'chrono-time danger'; }
    else if (sec > 1800) { el.className = 'chrono-time warning'; }
    else { el.className = 'chrono-time'; }
  }, 1000);
}

// ============================================================
// CODE D'ACCÈS
// ============================================================
function showAccessCodeScreen() {
  document.getElementById('accessCodeScreen').classList.remove('hidden');
  document.getElementById('accessCodeWelcome').textContent = `Bienvenue, ${playerPseudo.toUpperCase()}`;
  const msg = gameConfig.accessCodeMessage || 'Entrez le code fourni par votre animateur.';
  document.getElementById('accessCodeMsg').textContent = msg;
  document.getElementById('codeInput').addEventListener('keydown', e => {
    if (e.key === 'Enter') submitAccessCode();
  });
}

async function submitAccessCode() {
  const code = document.getElementById('codeInput').value.trim().toUpperCase();
  const expected = (gameConfig.accessCode || 'HACK2024').toUpperCase();
  if (code !== expected) {
    document.getElementById('codeError').textContent = '! Code incorrect. Réessayez.';
    document.getElementById('codeError').classList.remove('hidden');
    return;
  }
  document.getElementById('codeError').classList.add('hidden');

  // Démarrer le chrono
  const now = Date.now();
  await db.ref(`players/${playerPseudo}`).update({
    codeEntered: true,
    gameStarted: true,
    chronoStart: now,
    chronoElapsed: 0,
    penalties: 0
  });
  playerData.codeEntered = true;
  playerData.gameStarted = true;
  playerData.chronoStart = now;
  playerData.chronoElapsed = 0;
  playerData.penalties = 0;

  document.getElementById('accessCodeScreen').classList.add('hidden');
  startGameScreen();
}

// ============================================================
// ÉCRAN DE JEU
// ============================================================
function startGameScreen() {
  document.getElementById('gameScreen').classList.remove('hidden');
  document.getElementById('playerNameDisplay').textContent = playerPseudo.toUpperCase();
  startChrono();
  renderEnigmas();

  // Écouter changements en temps réel (si indice ou pénalité depuis admin)
  db.ref(`players/${playerPseudo}`).on('value', snap => {
    if (snap.exists()) {
      const prev = playerData;
      playerData = snap.val();
      // Si le jeu a été réinitialisé
      if (!playerData.gameStarted && prev.gameStarted) {
        showToast('La session a été réinitialisée par l\'animateur.', 'warning');
        setTimeout(() => { window.location.href = '/'; }, 2000);
      }
    }
  });
}

function updatePenaltiesDisplay() {
  const penalties = playerData.penalties || 0;
  const penMin = Math.floor(penalties / 60000);
  const hintCount = playerData.hintsUsed || 0;
  const el = document.getElementById('penaltiesDisplay');
  if (el) {
    if (penMin > 0 || hintCount > 0) {
      el.textContent = `+${penMin}min pénalité | ${hintCount} indice(s)`;
    } else {
      el.textContent = '';
    }
  }
}

// ============================================================
// RENDU DES ÉNIGMES
// ============================================================
function renderEnigmas() {
  const solved = playerData.solvedEnigmas || {};
  const container = document.getElementById('enigmasContainer');
  container.innerHTML = '';
  updatePenaltiesDisplay();

  // Structure du jeu:
  // PHASE 1: énigmes 1-5 (dans n'importe quel ordre)
  // PHASE 2: énigme 6 (seule, débloquée quand 1-5 résolues)
  // PHASE 3: énigmes 7-9 (groupe de 3, débloquées quand 6 résolue)
  // PHASE 4: énigme 10 (seule, débloquée quand 7-9 résolues)
  // PHASE 5: énigmes 11-12 (séquentielles: 12 débloquée si 11 résolue)

  const phase1Done = ['e1','e2','e3','e4','e5'].every(id => solved[id]);
  const phase2Done = solved['e6'];
  const phase3Done = ['e7','e8','e9'].every(id => solved[id]);
  const phase4Done = solved['e10'];

  const statusMsgs = [];
  if (!phase1Done) statusMsgs.push(`Phase 1: ${['e1','e2','e3','e4','e5'].filter(id=>solved[id]).length}/5 modules piratés`);
  else if (!phase2Done) statusMsgs.push('Phase 2: Vecteur d\'attaque à identifier');
  else if (!phase3Done) statusMsgs.push(`Phase 3: ${['e7','e8','e9'].filter(id=>solved[id]).length}/3 backdoors installées`);
  else if (!phase4Done) statusMsgs.push('Phase 4: Clé de chiffrement à décrypter');
  else statusMsgs.push('Phase finale: Accès root en cours...');
  document.getElementById('statusBar').textContent = '$ ' + statusMsgs[0];

  // --- PHASE 1 ---
  addSection(container, '// PHASE 1 — INFILTRATION RÉSEAU');
  const phase1Grid = addGrid(container);
  ['e1','e2','e3','e4','e5'].forEach(id => {
    const enigma = enigmasConfig[id] || defaultEnigma(id);
    const isSolved = !!solved[id];
    addCard(phase1Grid, id, enigma, isSolved, false, false);
  });

  // --- PHASE 2 ---
  addSection(container, '// PHASE 2 — VECTEUR D\'ATTAQUE', !phase1Done ? 'Résolvez les 5 modules précédents.' : null);
  const phase2Grid = addGrid(container);
  const e6 = enigmasConfig['e6'] || defaultEnigma('e6');
  addCard(phase2Grid, 'e6', e6, !!solved['e6'], !phase1Done, true);

  // --- PHASE 3 ---
  addSection(container, '// PHASE 3 — INSTALLATION BACKDOORS', !phase2Done ? 'Résolvez la phase 2 d\'abord.' : null);
  const phase3Grid = addGrid(container);
  ['e7','e8','e9'].forEach(id => {
    const enigma = enigmasConfig[id] || defaultEnigma(id);
    addCard(phase3Grid, id, enigma, !!solved[id], !phase2Done, false);
  });

  // --- PHASE 4 ---
  addSection(container, '// PHASE 4 — CLÉ DE CHIFFREMENT', !phase3Done ? 'Résolvez les 3 backdoors d\'abord.' : null);
  const phase4Grid = addGrid(container);
  const e10 = enigmasConfig['e10'] || defaultEnigma('e10');
  addCard(phase4Grid, 'e10', e10, !!solved['e10'], !phase3Done, true);

  // --- PHASE FINALE ---
  addSection(container, '// PHASE FINALE — ACCÈS ROOT', !phase4Done ? 'Résolvez la phase 4 d\'abord.' : null);
  const phase5Grid = addGrid(container);
  const e11 = enigmasConfig['e11'] || defaultEnigma('e11');
  const e12 = enigmasConfig['e12'] || defaultEnigma('e12');
  addCard(phase5Grid, 'e11', e11, !!solved['e11'], !phase4Done, false);
  addCard(phase5Grid, 'e12', e12, !!solved['e12'], !phase4Done || !solved['e11'], false);
}

function addSection(container, title, lockedMsg = null) {
  const div = document.createElement('div');
  div.className = 'section-header';
  div.innerHTML = title;
  if (lockedMsg) {
    div.innerHTML += `<span style="font-size:10px;color:var(--text-dim);margin-left:10px;letter-spacing:0">🔒 ${lockedMsg}</span>`;
  }
  container.appendChild(div);
}

function addGrid(container) {
  const grid = document.createElement('div');
  grid.className = 'enigmas-grid';
  container.appendChild(grid);
  return grid;
}

function addCard(grid, id, enigma, isSolved, isLocked, isSingle) {
  const card = document.createElement('div');
  const classNames = ['enigma-card'];
  if (isSolved) classNames.push('solved');
  if (isLocked) classNames.push('locked');
  if (isSingle) classNames.push('single');
  card.className = classNames.join(' ');

  card.innerHTML = `
    <div class="enigma-id">${id.toUpperCase()} — ${isSingle ? '◆ CIBLE PRINCIPALE' : '○ MODULE'}</div>
    <div class="enigma-title">${enigma.title || 'ÉNIGME INCONNUE'}</div>
    <div class="scan-line"></div>
  `;

  if (!isLocked && !isSolved) {
    card.addEventListener('click', () => openEnigma(id));
  } else if (isSolved) {
    card.style.cursor = 'default';
  }

  grid.appendChild(card);
}

function defaultEnigma(id) {
  return {
    title: `Module ${id.toUpperCase()}`,
    description: 'Cette énigme n\'a pas encore été configurée par l\'animateur.',
    answer: 'admin',
    hint: 'Contactez l\'animateur.',
  };
}

// ============================================================
// MODAL ÉNIGME
// ============================================================
function openEnigma(id) {
  currentEnigmaId = id;
  const enigma = enigmasConfig[id] || defaultEnigma(id);
  const solved = playerData.solvedEnigmas || {};

  document.getElementById('modalTitle').textContent = `[${id.toUpperCase()}] ${enigma.title || 'ÉNIGME'}`;
  document.getElementById('modalDesc').textContent = enigma.description || '';
  document.getElementById('answerInput').value = '';
  document.getElementById('answerFeedback').classList.add('hidden');
  document.getElementById('hintText').classList.add('hidden');

  // Indice
  const hintBtn = document.getElementById('hintBtn');
  const hintUsed = (playerData[`hint_${id}`]) || false;
  if (hintUsed && enigma.hint) {
    hintBtn.style.display = 'none';
    document.getElementById('hintText').textContent = '💡 ' + enigma.hint;
    document.getElementById('hintText').classList.remove('hidden');
  } else if (!enigma.hint) {
    hintBtn.style.display = 'none';
  } else {
    hintBtn.style.display = '';
    hintBtn.textContent = '⚠ DEMANDER UN INDICE (+3 min)';
  }

  // Si déjà résolue
  if (solved[id]) {
    document.getElementById('answerInput').disabled = true;
    document.getElementById('answerInput').placeholder = '✓ RÉSOLU';
    document.getElementById('answerFeedback').textContent = '✓ Énigme déjà résolue.';
    document.getElementById('answerFeedback').className = 'answer-feedback correct';
    document.getElementById('answerFeedback').classList.remove('hidden');
  } else {
    document.getElementById('answerInput').disabled = false;
    document.getElementById('answerInput').placeholder = 'Votre réponse...';
  }

  document.getElementById('enigmaModal').classList.remove('hidden');
  setTimeout(() => document.getElementById('answerInput').focus(), 100);

  // Enter pour valider
  document.getElementById('answerInput').onkeydown = (e) => {
    if (e.key === 'Enter') submitAnswer();
  };
}

function closeModal() {
  document.getElementById('enigmaModal').classList.add('hidden');
  currentEnigmaId = null;
}

// ============================================================
// INDICE
// ============================================================
async function requestHint() {
  if (!currentEnigmaId) return;
  const enigma = enigmasConfig[currentEnigmaId] || {};
  if (!enigma.hint) return;

  const confirmed = confirm('Demander un indice coûte +3 minutes. Confirmer ?');
  if (!confirmed) return;

  const hintPenalty = 3 * 60 * 1000;
  const newPenalties = (playerData.penalties || 0) + hintPenalty;
  const newHintsUsed = (playerData.hintsUsed || 0) + 1;

  await db.ref(`players/${playerPseudo}`).update({
    penalties: newPenalties,
    hintsUsed: newHintsUsed,
    [`hint_${currentEnigmaId}`]: true
  });

  playerData.penalties = newPenalties;
  playerData.hintsUsed = newHintsUsed;
  playerData[`hint_${currentEnigmaId}`] = true;

  document.getElementById('hintBtn').style.display = 'none';
  document.getElementById('hintText').textContent = '💡 ' + enigma.hint;
  document.getElementById('hintText').classList.remove('hidden');

  showToast('+3 minutes ajoutées au chrono.', 'warning');
  updatePenaltiesDisplay();
}

// ============================================================
// SOUMETTRE UNE RÉPONSE
// ============================================================
async function submitAnswer() {
  if (!currentEnigmaId) return;
  const enigma = enigmasConfig[currentEnigmaId] || defaultEnigma(currentEnigmaId);
  const userAnswer = document.getElementById('answerInput').value.trim().toLowerCase();
  const correctAnswer = (enigma.answer || '').trim().toLowerCase();

  if (!userAnswer) return;

  const feedback = document.getElementById('answerFeedback');

  if (userAnswer === correctAnswer) {
    // BONNE RÉPONSE
    feedback.textContent = '✓ ACCÈS ACCORDÉ — Module déverrouillé.';
    feedback.className = 'answer-feedback correct';
    feedback.classList.remove('hidden');
    document.getElementById('answerInput').disabled = true;

    // Mettre à jour Firebase
    await db.ref(`players/${playerPseudo}/solvedEnigmas/${currentEnigmaId}`).set(true);
    playerData.solvedEnigmas = playerData.solvedEnigmas || {};
    playerData.solvedEnigmas[currentEnigmaId] = true;

    showToast('✓ MODULE PIRATÉ !', 'success');

    // Vérifier victoire (e12 = dernière énigme)
    if (currentEnigmaId === 'e12') {
      setTimeout(() => finishGame(), 1500);
      return;
    }

    // Fermer modal et rafraîchir
    setTimeout(() => {
      closeModal();
      renderEnigmas();
    }, 1200);

  } else {
    // MAUVAISE RÉPONSE
    const wrongPenalty = 5 * 60 * 1000;
    const newPenalties = (playerData.penalties || 0) + wrongPenalty;
    await db.ref(`players/${playerPseudo}/penalties`).set(newPenalties);
    playerData.penalties = newPenalties;

    feedback.textContent = '✗ ACCÈS REFUSÉ — +5 min de pénalité.';
    feedback.className = 'answer-feedback wrong';
    feedback.classList.remove('hidden');
    document.getElementById('answerInput').value = '';

    showToast('+5 minutes de pénalité !', 'error');
    updatePenaltiesDisplay();

    // Cacher feedback après 2s
    setTimeout(() => feedback.classList.add('hidden'), 2500);
  }
}

// ============================================================
// VICTOIRE
// ============================================================
async function finishGame() {
  const finalTime = getElapsed();
  clearInterval(chronoInterval);

  await db.ref(`players/${playerPseudo}`).update({
    gameFinished: true,
    finalTime: finalTime,
    finishedAt: Date.now(),
    online: true
  });

  playerData.gameFinished = true;
  playerData.finalTime = finalTime;

  closeModal();
  showVictoryScreen();
}

async function showVictoryScreen() {
  document.getElementById('gameScreen').classList.add('hidden');
  document.getElementById('accessCodeScreen').classList.add('hidden');
  document.getElementById('victoryScreen').classList.remove('hidden');

  const finalTime = playerData.finalTime || 0;
  document.getElementById('victoryPseudo').textContent = playerPseudo.toUpperCase();
  document.getElementById('victoryTime').textContent = formatTime(finalTime);

  // Charger classement
  const snap = await db.ref('players').get();
  if (snap.exists()) {
    const players = snap.val();
    const finished = Object.values(players)
      .filter(p => p.gameFinished && p.finalTime)
      .sort((a, b) => a.finalTime - b.finalTime);

    const myRank = finished.findIndex(p => p.pseudo === playerPseudo) + 1;
    document.getElementById('victoryRank').textContent = `🏆 VOUS ÊTES ${myRank}${myRank === 1 ? 'ER' : 'ÈME'} AU CLASSEMENT`;

    const lb = document.getElementById('leaderboardDisplay');
    lb.innerHTML = finished.slice(0, 10).map((p, i) => {
      const rankClass = i === 0 ? 'gold' : i === 1 ? 'silver' : i === 2 ? 'bronze' : '';
      const medal = i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : `#${i+1}`;
      const isMe = p.pseudo === playerPseudo;
      return `<div class="leaderboard-item" style="${isMe ? 'border-color:var(--cyan)' : ''}">
        <div class="rank-num ${rankClass}">${medal}</div>
        <div class="rank-pseudo" style="${isMe ? 'color:var(--cyan)' : ''}">${p.pseudo.toUpperCase()}</div>
        <div class="rank-time">${formatTime(p.finalTime)}</div>
      </div>`;
    }).join('');
  }
}

// ============================================================
// DÉCONNEXION
// ============================================================
async function logout() {
  if (playerData && playerData.gameStarted && !playerData.gameFinished) {
    const elapsed = getElapsed();
    await db.ref(`players/${playerPseudo}`).update({
      online: false,
      chronoElapsed: elapsed,
      chronoStart: null,
      lastSeen: Date.now()
    });
  } else {
    await db.ref(`players/${playerPseudo}/online`).set(false);
  }
  clearInterval(chronoInterval);
  localStorage.removeItem('hackEscape_pseudo');
  localStorage.removeItem('hackEscape_session');
  window.location.href = '/';
}

// ============================================================
// TOAST
// ============================================================
function showToast(msg, type = 'success') {
  const toast = document.getElementById('toast');
  toast.textContent = msg;
  toast.className = 'toast ' + (type === 'error' ? 'error' : type === 'warning' ? 'warning' : '');
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 3000);
}
