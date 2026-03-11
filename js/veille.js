/**
 * veille.js — DéclicIA
 * Gère deux contextes :
 *  - Encart résumé dans index.html  (#veille-encart)
 *  - Page complète subpages/veille-ia.html (#veille-latest-container + #veille-archives-list)
 */

// Chemin vers le JSON selon la page courante
const isSubpage = window.location.pathname.includes('/subpages/');
const VEILLE_JSON = isSubpage ? '../data/veille.json' : './data/veille.json';

// Nombre de brèves à afficher dans l'encart
const ENCART_MAX_BREVES = 4;

/* ─────────────────────────────────────────────
   Utilitaires
───────────────────────────────────────────── */
function esc(str) {
  if (!str) return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

/* ─────────────────────────────────────────────
   Chargement du JSON
───────────────────────────────────────────── */
async function loadVeilleData() {
  const res = await fetch(VEILLE_JSON);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

/* ─────────────────────────────────────────────
   ENCART — index.html
───────────────────────────────────────────── */
async function initEncart() {
  const container = document.getElementById('veille-encart');
  if (!container) return;

  try {
    const articles = await loadVeilleData();
    if (!articles || articles.length === 0) {
      container.innerHTML = '<p class="veille-encart-empty">Aucune actualité disponible pour le moment.</p>';
      return;
    }

    const latest = articles[0];
    const breves = latest.breves.slice(0, ENCART_MAX_BREVES);

    container.innerHTML = breves.map((b, i) => `
      <div class="veille-encart-card">
        <span class="veille-encart-card-number">Actu ${String(i + 1).padStart(2, '0')}</span>
        <h3 class="veille-encart-card-title">${esc(b.titre)}</h3>
        <p class="veille-encart-card-text">${esc(b.contenu)}</p>
        <a href="${esc(b.url)}" target="_blank" rel="noopener noreferrer" class="veille-encart-card-source">
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
            <path d="M2 10L10 2M10 2H5M10 2v5" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          ${esc(b.source)}
        </a>
      </div>
    `).join('');

  } catch (err) {
    container.innerHTML = '<p class="veille-encart-error">Impossible de charger les actualités.</p>';
    console.error('[Veille] Erreur encart :', err);
  }
}

/* ─────────────────────────────────────────────
   PAGE COMPLÈTE — subpages/veille-ia.html
───────────────────────────────────────────── */

function renderFullArticle(article) {
  const brevesHTML = article.breves.map(b => `
    <div class="veille-full-breve">
      <h3 class="veille-full-breve-title">${esc(b.titre)}</h3>
      <p class="veille-full-breve-text">${esc(b.contenu)}</p>
      <a href="${esc(b.url)}" target="_blank" rel="noopener noreferrer" class="veille-full-breve-link">
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
          <path d="M2 10L10 2M10 2H5M10 2v5" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
        ${esc(b.source)}
      </a>
    </div>
  `).join('');

  return `
    <article class="veille-full-article">
      <header class="veille-full-article-header">
        <div class="veille-full-article-meta">
          <span class="veille-full-article-week">Édition hebdomadaire</span>
          <time class="veille-full-article-date">${esc(article.date_affichage)}</time>
        </div>
        <h2 class="veille-full-article-title">${esc(article.titre)}</h2>
        <p class="veille-full-article-intro">${esc(article.introduction)}</p>
      </header>
      <div class="veille-full-breves">${brevesHTML}</div>
      <footer class="veille-full-article-footer">
        <p class="veille-full-conclusion">${esc(article.conclusion)}</p>
      </footer>
    </article>
  `;
}

async function initPageComplete() {
  const latestContainer = document.getElementById('veille-latest-container');
  const archivesSection = document.getElementById('veille-archives-section');
  const archivesList = document.getElementById('veille-archives-list');
  if (!latestContainer) return;

  try {
    const articles = await loadVeilleData();
    if (!articles || articles.length === 0) {
      latestContainer.innerHTML = '<p class="veille-encart-empty">Aucune édition disponible pour le moment.</p>';
      return;
    }

    const [latest, ...archives] = articles;

    // Article principal
    latestContainer.innerHTML = renderFullArticle(latest);

    // Archives en accordéon
    if (archives.length > 0 && archivesSection && archivesList) {
      archivesSection.style.display = '';
      archivesList.innerHTML = archives.map(a => `
        <details class="veille-archive-item">
          <summary class="veille-archive-summary">
            <time>${esc(a.date_affichage)}</time>
            <span>${esc(a.titre)}</span>
          </summary>
          <div class="veille-archive-content">
            ${renderFullArticle(a)}
          </div>
        </details>
      `).join('');
    }

  } catch (err) {
    latestContainer.innerHTML = '<p class="veille-encart-error">Impossible de charger les articles. Réessayez plus tard.</p>';
    console.error('[Veille] Erreur page complète :', err);
  }
}

/* ─────────────────────────────────────────────
   Init au chargement
───────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  if (document.getElementById('veille-encart')) initEncart();
  if (document.getElementById('veille-latest-container')) initPageComplete();
});