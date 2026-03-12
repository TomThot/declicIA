/**
 * C'est le chef d'orchestre côté navigateur. 
 * Il récupère veille.json et injecte le contenu HTML dans la page, dans deux contextes différents.
 
 * Gère deux contextes :
 *  - Encart résumé dans index.html  (#veille-encart)
 *  - Page complète subpages/veille-ia.html (#veille-latest-container + #veille-archives-list)
 */

// Chemin vers le JSON selon la page courante
/**----------------------------------------------------------------------------
 * À l'ouverture de n'importe quelle page du site, le script regarde l'URL courante. 
 * Si elle contient /subpages/, c'est qu'on est sur veille-ia.html → le JSON est un niveau au-dessus (../).
 * Sinon on est sur index.html → le JSON est au même niveau (./).
 * Le .toLowerCase() est crucial : sur Windows le dossier s'appelle subPages (P majuscule), 
 * mais sur Linux/Cloudflare c'est subpages. Sans cette conversion, le chemin ne serait jamais détecté correctement sur le serveur.
 ---------------------------------------------------------------------------------------------------------*/
const isSubpage = window.location.pathname.toLowerCase().includes('/subpages/');
const VEILLE_JSON = isSubpage ? '../data/veille.json' : './data/veille.json';

// Nombre de brèves à afficher dans l'encart
const ENCART_MAX_BREVES = 4;

/* ─────────────────────────────────────────────
   Utilitaires
───────────────────────────────────────────── */
/**
 * Fonction de sécurité. 
 * Avant d'injecter du texte venant du JSON dans le HTML, on échappe les caractères spéciaux. 
 * Sans ça, un titre contenant <script> dans le JSON pourrait exécuter du code malveillant dans la page. 
 * C'est une protection basique contre les attaques XSS.}
 */
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
/**
 * Le async/await permet d'attendre la réponse réseau sans bloquer le reste de la page. 
 * Si le serveur répond autre chose qu'un code 200 (ex: 404 fichier introuvable), une erreur est levée 
 * et attrapée plus bas par le try/catch.
 */

async function loadVeilleData() {
  const res = await fetch(VEILLE_JSON);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

/* ─────────────────────────────────────────────
   ENCART — index.html
───────────────────────────────────────────── */
/**
 * Pour chaque brève, il construit une carte HTML avec : un numéro (Actu 01), un titre, 
 * un extrait de texte tronqué à 3 lignes via CSS (-webkit-line-clamp), et un lien vers la source.
 * Le try/catch autour de tout ça garantit que si le JSON est introuvable ou corrompu, 
 * la page n'affiche pas d'erreur JS brute mais un message propre à la place.
 */
async function initEncart() {
  const container = document.getElementById('veille-encart');
  if (!container) return;

  try {
    const articles = await loadVeilleData();
    if (!articles || articles.length === 0) {
      container.innerHTML = '<p class="veille-encart-empty">Aucune actualité disponible pour le moment.</p>';
      return;
    }

    const latest = articles[0]; // prend le 1er article (le plus récent)
    const breves = latest.breves.slice(0, ENCART_MAX_BREVES); // garde les 4 premières brèves max

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
/**
 * Prend un objet article du JSON et retourne une chaîne HTML complète avec l'en-tête (titre, date, introduction), 
 * toutes les brèves avec leurs liens, et la conclusion. Cette fonction est utilisée deux fois : 
 * pour l'article principal et pour chaque archive.
 */

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
    /**Cette ligne déstructure le tableau : latest reçoit le premier article, archives reçoit tous les suivants. 
     * L'article principal est rendu directement, les archives sont transformées en éléments <details>/<summary> — 
     * c'est la balise HTML native qui crée un accordéon sans JavaScript supplémentaire. */

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
/**On attend que le DOM soit prêt, puis on détecte quelle fonction lancer selon les éléments présents dans la page. 
 * Un seul fichier JS, deux comportements différents. */
document.addEventListener('DOMContentLoaded', () => {
  if (document.getElementById('veille-encart')) initEncart();
  if (document.getElementById('veille-latest-container')) initPageComplete();
});