/*
 * ================================================================
 * MENU LATÉRAL (injection shared-components.js)
 * Ouvre/ferme la sidebar via le bouton burger et ferme au clic externe.
 * ================================================================
 */
const menuToggle = document.querySelector(".menu-toggle");
const menuBar = document.querySelector(".menu");
const sidebar = document.querySelector(".sidebar");

if (menuToggle && menuBar && sidebar) {
  menuToggle.addEventListener("click", (e) => {
    e.stopPropagation();
    menuBar.classList.toggle("active");
    sidebar.classList.toggle("active");
  });

  document.addEventListener("click", (e) => {
    if (!sidebar.contains(e.target) && !menuToggle.contains(e.target)) {
      menuBar.classList.remove("active");
      sidebar.classList.remove("active");
    }
  });

  sidebar.addEventListener("click", (e) => {
    e.stopPropagation();
  });
}

// ============================================================
// WORKER PROXY Cloudflare — clé xAI stockée côté serveur
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
// ANALYSE IA VIA ANTHROPIC API
// ============================================================
async function analyserAvecIA(activite, contexte) {
  const prompt = `Tu es un expert en sciences cognitives et en pédagogie de l'IA. Tu dois évaluer le "Nutri-Score Cognitif IA" d'une activité scolaire ou professionnelle impliquant l'intelligence artificielle.

Le Nutri-Score Cognitif IA fonctionne comme suit :
- Score A : L'apprenant construit activement sa pensée AVANT ou MALGRÉ l'IA (écrire de mémoire, débattre, enseigner, se tester, méthode Feynman). Aucune délégation cognitive.
- Score B : L'apprenant s'engage activement avec la production IA (reformuler, annoter, prendre des notes, questionner). Légère délégation mais l'essentiel cognitif reste.
- Score C : L'apprenant consomme du contenu déjà structuré par l'IA mais avec un minimum d'arrêt réflexif (regarder une vidéo en s'arrêtant, lire un résumé avec pauses). L'effort de structuration est délégué.
- Score D : L'apprenant consomme passivement avec peu d'engagement (lire des bullets pré-digérés, copier-coller en adaptant à peine). Recherche, structure et reformulation sont déléguées.
- Score E : Aucun engagement cognitif (scroller passivement, accepter sans questionner, copier-coller sans reformuler). Zéro encodage, zéro trace mémorielle.

Contexte de l'utilisateur : ${contexte || 'non précisé'}

Activité à évaluer : "${activite}"

Réponds UNIQUEMENT avec un objet JSON valide, sans texte avant ni après, sans balises markdown. Le JSON doit avoir exactement cette structure :
{
  "score": "A" ou "B" ou "C" ou "D" ou "E",
  "analyse": "2-3 phrases expliquant pourquoi ce score, en citant des éléments précis de l'activité décrite",
  "points_forts": ["point fort 1", "point fort 2"],
  "points_faibles": ["point faible 1", "point faible 2"],
  "ameliorations": ["suggestion concrète 1", "suggestion concrète 2", "suggestion concrète 3"]
}`;

  const response = await fetch(NUTRISCORE_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ prompt })
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err.error?.message || `Erreur API ${response.status}`);
  }

  const data = await response.json();
  const text = data.choices?.[0]?.message?.content || '';

  // Nettoyage JSON
  const clean = text.replace(/```json\s*/g, '').replace(/```\s*/g, '').trim();
  return JSON.parse(clean);
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
