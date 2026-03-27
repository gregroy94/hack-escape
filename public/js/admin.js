// ============================================================
// ADMIN.JS — Panneau d'administration
// ============================================================

let adminAuthenticated = false;
let playersListener = null;
let currentEditEnigma = null;
let allPlayers = {};
let enigmasData = {};
let configData = {};

const ENIGMA_IDS = [
  { id: 'e1', label: 'Phase 1 — Module 1', phase: 1 },
  { id: 'e2', label: 'Phase 1 — Module 2', phase: 1 },
  { id: 'e3', label: 'Phase 1 — Module 3', phase: 1 },
  { id: 'e4', label: 'Phase 1 — Module 4', phase: 1 },
  { id: 'e5', label: 'Phase 1 — Module 5', phase: 1 },
  { id: 'e6', label: 'Phase 2 — Vecteur (seule)', phase: 2 },
  { id: 'e7', label: 'Phase 3 — Backdoor 1', phase: 3 },
  { id: 'e8', label: 'Phase 3 — Backdoor 2', phase: 3 },
  { id: 'e9', label: 'Phase 3 — Backdoor 3', phase: 3 },
  { id: 'e10', label: 'Phase 4 — Clé de chiffrement (seule)', phase: 4 },
  { id: 'e11', label: 'Phase finale — Séquence 1', phase: 5 },
  { id: 'e12', label: 'Phase finale — Séquence 2 (VICTOIRE)', phase: 5 },
];

// ============================================================
// LOGIN ADMIN
// ============================================================
async function adminLogin() {
  const pwd = document.getElementById('adminPwdInput').value;
  if (!pwd) return;

  try {
    const snap = await db.ref('config/adminPassword').get();
    const stored = snap.exists() ? snap.val() : 'admin1234';
    if (pwd !== stored) {
      document.getElementById('adminLoginError').textContent = '! Mot de passe incorrect.';
      document.getElementById('adminLoginError').classList.remove('hidden');
      return;
    }
    adminAuthenticated = true;
    document.getElementById('adminLoginScreen').classList.add('hidden');
    document.getElementById('adminPanel').classList.remove('hidden');
    initAdmin();
  } catch (err) {
    console.error(err);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('adminPwdInput')?.addEventListener('keydown', e => {
    if (e.key === 'Enter') adminLogin();
  });
});

function adminLogout() {
  adminAuthenticated = false;
  if (playersListener) db.ref('players').off('value', playersListener);
  document.getElementById('adminPanel').classList.add('hidden');
  document.getElementById('adminLoginScreen').classList.remove('hidden');
}

// ============================================================
// INIT
// ============================================================
async function initAdmin() {
  // Charger config + énigmes
  const [configSnap, enigmasSnap] = await Promise.all([
    db.ref('config').get(),
    db.ref('enigmas').get()
  ]);
  configData = configSnap.val() || {};
  enigmasData = enigmasSnap.val() || {};

  loadSettings();
  buildEnigmaList();
  startPlayersListener();
}

function startPlayersListener() {
  playersListener = db.ref('players').on('value', snap => {
    allPlayers = snap.exists() ? snap.val() : {};
    renderPlayersTable();
    renderLeaderboard();
  });
}

// ============================================================
// TABS
// ============================================================
function switchTab(tab) {
  document.querySelectorAll('.admin-section').forEach(el => el.classList.remove('active'));
  document.querySelectorAll('.tab-btn').forEach(el => el.classList.remove('active'));
  document.getElementById(`tab-${tab}`).classList.add('active');
  event.target.classList.add('active');
  if (tab === 'leaderboard') renderLeaderboard();
}

// ============================================================
// TABLE JOUEURS
// ============================================================
function formatTime(ms) {
  if (!ms) return '--:--:--';
  const totalSec = Math.floor(ms / 1000);
  const h = Math.floor(totalSec / 3600);
  const m = Math.floor((totalSec % 3600) / 60);
  const s = totalSec % 60;
  return [h, m, s].map(v => String(v).padStart(2, '0')).join(':');
}

function getLiveTime(p) {
  if (!p.gameStarted) return 0;
  const base = p.chronoElapsed || 0;
  const penalties = p.penalties || 0;
  if (p.chronoStart && !p.gameFinished) {
    return base + (Date.now() - p.chronoStart) + penalties;
  }
  return (p.finalTime || base + penalties);
}

function getPhaseLabel(p) {
  const s = p.solvedEnigmas || {};
  if (p.gameFinished) return '✓ TERMINÉ';
  if (!p.gameStarted) return 'En attente';
  if (!p.codeEntered) return 'Code requis';
  const phase1Done = ['e1','e2','e3','e4','e5'].every(id => s[id]);
  if (!phase1Done) return `Phase 1 (${['e1','e2','e3','e4','e5'].filter(id=>s[id]).length}/5)`;
  if (!s['e6']) return 'Phase 2';
  const phase3Done = ['e7','e8','e9'].every(id => s[id]);
  if (!phase3Done) return `Phase 3 (${['e7','e8','e9'].filter(id=>s[id]).length}/3)`;
  if (!s['e10']) return 'Phase 4';
  if (!s['e11']) return 'Finale seq.1';
  return 'Finale seq.2';
}

function countSolved(p) {
  return Object.keys(p.solvedEnigmas || {}).length;
}

function renderPlayersTable() {
  const tbody = document.getElementById('playerTableBody');
  const players = Object.values(allPlayers);
  const online = players.filter(p => p.online).length;
  const total = players.length;
  const finished = players.filter(p => p.gameFinished).length;

  document.getElementById('playerCountInfo').textContent =
    `${total} joueurs | ${online} en ligne | ${finished} terminés`;

  if (players.length === 0) {
    tbody.innerHTML = `<tr><td colspan="7" style="text-align:center;color:var(--text-dim);padding:20px">Aucun joueur inscrit.</td></tr>`;
    return;
  }

  tbody.innerHTML = players.map(p => {
    const isOnline = p.online;
    const isFinished = p.gameFinished;
    const badgeClass = isFinished ? 'finished' : isOnline ? 'online' : 'offline';
    const badgeLabel = isFinished ? 'FINI' : isOnline ? 'EN LIGNE' : 'OFFLINE';
    const time = getLiveTime(p);
    const penMin = Math.floor((p.penalties || 0) / 60000);

    return `<tr>
      <td><strong>${p.pseudo}</strong></td>
      <td><span class="badge ${badgeClass}">${badgeLabel}</span></td>
      <td style="font-size:11px">${getPhaseLabel(p)}</td>
      <td style="text-align:center">${countSolved(p)}/12</td>
      <td style="font-family:var(--font-display);color:var(--green)">${p.gameStarted ? formatTime(time) : '—'}</td>
      <td style="color:var(--amber)">${penMin > 0 ? `+${penMin}min` : '0'}</td>
      <td>
        <button class="btn-terminal btn-danger" style="padding:4px 8px;font-size:10px;width:auto" onclick="resetPlayer('${p.pseudo}')">RESET</button>
      </td>
    </tr>`;
  }).join('');
}

// ============================================================
// RESET JOUEURS
// ============================================================
async function resetPlayer(pseudo) {
  if (!confirm(`Réinitialiser le joueur "${pseudo}" ? Sa progression sera effacée.`)) return;

  await db.ref(`players/${pseudo}`).update({
    gameStarted: false,
    gameFinished: false,
    codeEntered: false,
    chronoStart: null,
    chronoElapsed: 0,
    penalties: 0,
    hintsUsed: 0,
    solvedEnigmas: {},
    finalTime: null,
    finishedAt: null,
    online: false
  });
  // Supprimer tous les hint_eX
  for (let e of ENIGMA_IDS) {
    await db.ref(`players/${pseudo}/hint_${e.id}`).remove();
  }
  showToast(`Joueur ${pseudo} réinitialisé.`);
}

async function resetAllPlayers() {
  if (!confirm('⚠ ATTENTION — Réinitialiser TOUS les joueurs ? Cette action est irréversible.')) return;
  if (!confirm('Vraiment tout effacer ? (Confirmation 2/2)')) return;

  const updates = {};
  Object.keys(allPlayers).forEach(pseudo => {
    updates[`players/${pseudo}/gameStarted`] = false;
    updates[`players/${pseudo}/gameFinished`] = false;
    updates[`players/${pseudo}/codeEntered`] = false;
    updates[`players/${pseudo}/chronoStart`] = null;
    updates[`players/${pseudo}/chronoElapsed`] = 0;
    updates[`players/${pseudo}/penalties`] = 0;
    updates[`players/${pseudo}/hintsUsed`] = 0;
    updates[`players/${pseudo}/solvedEnigmas`] = {};
    updates[`players/${pseudo}/finalTime`] = null;
    updates[`players/${pseudo}/finishedAt`] = null;
    updates[`players/${pseudo}/online`] = false;
    ENIGMA_IDS.forEach(e => {
      updates[`players/${pseudo}/hint_${e.id}`] = null;
    });
  });

  await db.ref().update(updates);
  showToast('Tous les joueurs ont été réinitialisés.', 'warning');
}

// ============================================================
// ÉDITION DES ÉNIGMES
// ============================================================
function buildEnigmaList() {
  const list = document.getElementById('enigmaListAdmin');
  list.innerHTML = ENIGMA_IDS.map(e => `
    <div class="enigma-list-item" id="eitem-${e.id}" onclick="selectEnigma('${e.id}')">
      <span class="item-num">${e.id.toUpperCase()}</span>
      <span>${e.label}</span>
    </div>
  `).join('');
}

function selectEnigma(id) {
  currentEditEnigma = id;
  document.querySelectorAll('.enigma-list-item').forEach(el => el.classList.remove('selected'));
  document.getElementById(`eitem-${id}`)?.classList.add('selected');

  const enigma = enigmasData[id] || {};
  const meta = ENIGMA_IDS.find(e => e.id === id);

  document.getElementById('editPanel').innerHTML = `
    <div style="font-size:11px;color:var(--amber);letter-spacing:2px;margin-bottom:14px;padding-bottom:8px;border-bottom:1px solid var(--border)">
      ÉDITION: ${id.toUpperCase()} — ${meta?.label || ''}
    </div>

    <div class="edit-field">
      <label class="edit-label">// TITRE DE L'ÉNIGME</label>
      <input type="text" class="edit-input" id="editTitle" value="${escHtml(enigma.title || '')}" placeholder="Ex: Firewall Principal" />
    </div>

    <div class="edit-field">
      <label class="edit-label">// DESCRIPTION / TEXTE DE L'ÉNIGME</label>
      <textarea class="edit-textarea" id="editDesc" rows="5" placeholder="Texte de l'énigme affiché au joueur...">${escHtml(enigma.description || '')}</textarea>
    </div>

    <div class="edit-field">
      <label class="edit-label">// RÉPONSE CORRECTE (insensible à la casse)</label>
      <input type="text" class="edit-input" id="editAnswer" value="${escHtml(enigma.answer || '')}" placeholder="Ex: matrix" />
    </div>

    <div class="edit-field">
      <label class="edit-label">// INDICE (optionnel — coûte +3 min au joueur)</label>
      <input type="text" class="edit-input" id="editHint" value="${escHtml(enigma.hint || '')}" placeholder="Ex: Cherchez dans les logs du serveur..." />
    </div>

    <div style="display:flex;gap:8px;margin-top:18px">
      <button class="btn-terminal" style="flex:1" onclick="saveEnigma('${id}')">[ SAUVEGARDER ]</button>
      <button class="btn-terminal btn-secondary" style="flex:0;padding:10px 16px" onclick="previewEnigma('${id}')">APERÇU</button>
    </div>
    <div id="enigmaSaved" class="success-msg hidden" style="margin-top:10px">✓ Énigme sauvegardée.</div>
  `;
}

function escHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

async function saveEnigma(id) {
  const title = document.getElementById('editTitle').value.trim();
  const description = document.getElementById('editDesc').value.trim();
  const answer = document.getElementById('editAnswer').value.trim();
  const hint = document.getElementById('editHint').value.trim();

  if (!title || !answer) {
    showToast('Titre et réponse obligatoires.', 'error');
    return;
  }

  await db.ref(`enigmas/${id}`).set({ title, description, answer, hint });
  enigmasData[id] = { title, description, answer, hint };

  const savedEl = document.getElementById('enigmaSaved');
  savedEl.classList.remove('hidden');
  setTimeout(() => savedEl.classList.add('hidden'), 3000);
  showToast(`Énigme ${id.toUpperCase()} sauvegardée.`);
}

function previewEnigma(id) {
  const title = document.getElementById('editTitle').value;
  const description = document.getElementById('editDesc').value;
  const hint = document.getElementById('editHint').value;
  alert(`APERÇU — ${title}\n\n${description}\n\n💡 Indice: ${hint || '(aucun)'}`);
}

// ============================================================
// CLASSEMENT
// ============================================================
function renderLeaderboard() {
  const container = document.getElementById('leaderboardAdmin');
  const finished = Object.values(allPlayers)
    .filter(p => p.gameFinished && p.finalTime)
    .sort((a, b) => a.finalTime - b.finalTime);

  if (finished.length === 0) {
    container.innerHTML = '<div style="color:var(--text-dim);padding:30px;text-align:center;font-size:13px">Aucun joueur n\'a terminé le jeu pour l\'instant.</div>';
    return;
  }

  container.innerHTML = finished.map((p, i) => {
    const medal = i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : `#${i+1}`;
    const rankClass = i === 0 ? 'gold' : i === 1 ? 'silver' : i === 2 ? 'bronze' : '';
    const penMin = Math.floor((p.penalties || 0) / 60000);
    return `<div class="leaderboard-item">
      <div class="rank-num ${rankClass}">${medal}</div>
      <div class="rank-pseudo">
        <div>${p.pseudo.toUpperCase()}</div>
        <div style="font-size:10px;color:var(--text-dim)">${penMin > 0 ? `+${penMin}min pénalité` : ''}</div>
      </div>
      <div class="rank-time">${formatTime(p.finalTime)}</div>
    </div>`;
  }).join('');
}

// ============================================================
// PARAMÈTRES
// ============================================================
function loadSettings() {
  document.getElementById('accessCodeInput').value = configData.accessCode || 'HACK2024';
  document.getElementById('accessMsgInput').value = configData.accessCodeMessage || 'Entrez le code fourni par votre animateur.';
}

async function saveSettings() {
  const accessCode = document.getElementById('accessCodeInput').value.trim().toUpperCase();
  const accessCodeMessage = document.getElementById('accessMsgInput').value.trim();
  const newPwd = document.getElementById('newAdminPwd').value;

  const updates = {
    'config/accessCode': accessCode || 'HACK2024',
    'config/accessCodeMessage': accessCodeMessage,
  };
  if (newPwd && newPwd.length >= 4) {
    updates['config/adminPassword'] = newPwd;
    document.getElementById('newAdminPwd').value = '';
  }

  await db.ref().update(updates);
  configData.accessCode = accessCode;
  configData.accessCodeMessage = accessCodeMessage;

  const saved = document.getElementById('settingsSaved');
  saved.classList.remove('hidden');
  setTimeout(() => saved.classList.add('hidden'), 3000);
  showToast('Paramètres sauvegardés.');
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

// Rafraîchir les temps en live toutes les secondes
setInterval(() => {
  if (adminAuthenticated) renderPlayersTable();
}, 1000);
