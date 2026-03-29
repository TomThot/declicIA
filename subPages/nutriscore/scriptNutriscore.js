// ============================================================
// WORKER PROXY Cloudflare — clé Mistral stockée côté serveur
// ============================================================
const NUTRISCORE_API_URL = 'https://nutriscore-proxy.tom-thot.workers.dev';

// ============================================================
// CHIPS CONTEXTE
// ============================================================
document.querySelectorAll('.chip').forEach(chip => {
  chip.addEventListener('click', function () {
    const wasActive = this.classList.contains('active');
    document.querySelectorAll('.chip').forEach(c => c.classList.remove('active'));
    if (!wasActive) this.classList.add('active');
  });
});

// ============================================================
// SCORE COLORS
// ============================================================
const SCORE_COLORS = {
  A: '#1a7a3c',
  B: '#5aaa2e',
  C: '#f4aa00',
  D: '#e07000',
  E: '#c0392b'
};

const SCORE_LABELS = {
  A: 'Excellent usage cognitif 🌟',
  B: 'Bon usage cognitif ✅',
  C: 'Usage cognitif moyen ⚠️',
  D: 'Usage cognitif faible 🔶',
  E: 'Quasi nul – ultra-transformé ❌'
};

// ============================================================
// ANALYSE IA VIA MISTRAL API
// ============================================================
async function analyserAvecIA(activite, contexte) {
const prompt = `
Tu es un assistant qui analyse une activité pédagogique et attribue un score "Nutriscore cognitif" (A à E).

Retour attendu :
- Un JSON STRICT uniquement
- Sans texte autour
- Sans explication
- Sans markdown
- Sans bloc de code

Format exact :

{
  "score": "A|B|C|D|E",
  "analyse": "texte court",
  "points_forts": ["..."],
  "points_faibles": ["..."],
  "ameliorations": ["..."]
}

Activité :
"${activite}"

Contexte :
"${contexte}"

Règles :
- Réponds uniquement avec un JSON valide
- Aucun texte hors JSON
`;

  try {
    const response = await fetch(NUTRISCORE_API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt })
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const raw = await response.text();

    if (!raw) {
      throw new Error("Réponse vide");
    }

    const data = JSON.parse(raw);

    const text = data.choices?.[0]?.message?.content;

    if (!text) {
      throw new Error("Format API invalide");
    }

let clean = text
  .replace(/```json\s*/g, '')
  .replace(/```/g, '')
  .trim();

// Vérification simple
if (!clean.startsWith('{')) {
  throw new Error("La réponse IA n'est pas du JSON");
}

try {
  return JSON.parse(clean);
} catch (e) {
  throw new Error("JSON invalide après nettoyage");
}

  } catch (err) {
    console.warn("Erreur IA:", err.message);
    throw err;
  }
}

// ============================================================
// FALLBACK LOCAL (si API indisponible ou textarea vide)
// ============================================================
function analyserEnLocal(activite) {
  const lower = activite.toLowerCase();

  // Mots-clés positifs (score A/B)
  const motsA = ['mémoire', 'avant', 'feynman', 'enseign', 'débat', 'questionne', 'critique', 'sans aide', 'relit', 'corrige', 'explique'];
  const motsB = ['notes', 'reformul', 'annot', 'résume dans mes mots', 'prend notes', 'synthèse perso'];
  const motsC = ['vidéo', 'résumé', 'lecture', 'regarde', 'lis', 'explications'];
  const motsD = ['bullet', 'copier-coller', 'adapte', 'sélectionne', 'copie'];
  const motsE = ['copie-colle', 'copier coller', 'sans reformuler', 'directement', 'sans vérifier', 'accepte'];

  let scoreA = motsA.filter(m => lower.includes(m)).length;
  let scoreB = motsB.filter(m => lower.includes(m)).length;
  let scoreC = motsC.filter(m => lower.includes(m)).length;
  let scoreD = motsD.filter(m => lower.includes(m)).length;
  let scoreE = motsE.filter(m => lower.includes(m)).length;

  let score;
  const max = Math.max(scoreA, scoreB, scoreC, scoreD, scoreE);

  if (max === 0 || (scoreC >= scoreA && scoreC >= scoreB && scoreC >= scoreD && scoreC >= scoreE)) score = 'C';
  else if (scoreA === max) score = 'A';
  else if (scoreB === max) score = 'B';
  else if (scoreD === max) score = 'D';
  else if (scoreE === max) score = 'E';
  else score = 'C';

  return {
    score,
    analyse: `Analyse locale (mode hors-ligne) basée sur les mots-clés de votre description. Pour une analyse plus précise, vérifiez votre connexion internet.`,
    points_forts: score === 'A' || score === 'B'
      ? ['Engagement actif détecté dans la description', 'Présence d\'indices de construction cognitive']
      : ['Activité identifiée comme utilisant l\'IA de manière explicite'],
    points_faibles: score === 'D' || score === 'E'
      ? ['Peu d\'engagement cognitif apparent', 'Forte délégation à l\'IA détectée']
      : ['Description manquant de précision sur l\'engagement cognitif'],
    ameliorations: [
      'Ajoutez une étape d\'écriture libre avant toute consultation IA',
      'Demandez aux élèves de reformuler avec leurs propres mots',
      'Organisez un débat critique sur la réponse obtenue'
    ]
  };
}

// ============================================================
// AFFICHAGE DU RÉSULTAT
// ============================================================
function afficherResultat(data) {
  const { score, analyse, points_forts, points_faibles, ameliorations } = data;

  // Score lettre + couleur
  const lettre = document.getElementById('scoreLettre');
  lettre.textContent = score;
  lettre.style.background = SCORE_COLORS[score] || '#614ae7';

  document.getElementById('scoreDesc').textContent = SCORE_LABELS[score] || '';

  // Analyse
  document.getElementById('detailAnalyse').innerHTML = `
    <h4>🔍 Analyse</h4>
    <p>${analyse}</p>
  `;

  // Points forts / faibles
  const fortsHTML = (points_forts || []).map(p => `<li>✅ ${p}</li>`).join('');
  const faiblesHTML = (points_faibles || []).map(p => `<li>⚠️ ${p}</li>`).join('');
  document.getElementById('detailPoints').innerHTML = `
    <h4>📊 Bilan</h4>
    ${fortsHTML || faiblesHTML ? `
      <ul>${fortsHTML}</ul>
      ${faiblesHTML ? `<ul style="margin-top:10px">${faiblesHTML}</ul>` : ''}
    ` : '<p>Aucun point identifié.</p>'}
  `;

  // Améliorations
  const amelioHTML = (ameliorations || []).map(a => `<li>${a}</li>`).join('');
  document.getElementById('detailAmelio').innerHTML = `
    <h4>💡 Suggestions pour améliorer le score</h4>
    <ul>${amelioHTML || '<li>Continuez comme ça !</li>'}</ul>
  `;

  // Couleur de la bordure gauche selon le score
  document.querySelectorAll('.detail-section').forEach(el => {
    el.style.borderLeftColor = SCORE_COLORS[score] || '#614ae7';
  });

  // Affichage
  document.getElementById('loaderContainer').style.display = 'none';
  document.getElementById('resultatContainer').style.display = 'block';
}

// ============================================================
// BOUTON ANALYSER
// ============================================================
document.getElementById('btnEvaluer').addEventListener('click', async () => {
  const activite = document.getElementById('activiteInput').value.trim();

  if (!activite) {
    document.getElementById('activiteInput').focus();
    document.getElementById('activiteInput').style.borderColor = '#c0392b';
    setTimeout(() => {
      document.getElementById('activiteInput').style.borderColor = '';
    }, 2000);
    return;
  }

  const chipActive = document.querySelector('.chip.active');
  const contexte = chipActive ? chipActive.dataset.val : '';

  // Afficher loader, cacher formulaire et résultat précédent
  document.querySelector('.evaluateur-form').style.display = 'none';
  document.getElementById('resultatContainer').style.display = 'none';
  document.getElementById('loaderContainer').style.display = 'block';

  try {
    const result = await analyserAvecIA(activite, contexte);
    afficherResultat(result);
  } catch (err) {
    console.warn('API indisponible, fallback local :', err.message);
    const result = analyserEnLocal(activite);
    afficherResultat(result);
  }
});

// ============================================================
// BOUTON RESET
// ============================================================
document.getElementById('btnReset').addEventListener('click', () => {
  document.getElementById('activiteInput').value = '';
  document.querySelectorAll('.chip').forEach(c => c.classList.remove('active'));
  document.getElementById('resultatContainer').style.display = 'none';
  document.getElementById('loaderContainer').style.display = 'none';
  document.querySelector('.evaluateur-form').style.display = 'block';
  document.getElementById('activiteInput').focus();
});
