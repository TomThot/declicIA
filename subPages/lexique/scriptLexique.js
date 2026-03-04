/**
 * scriptLexique.js
 *
 * Petit moteur de lexique pour la page /subPages/lexique/
 * - affiche des cartes de termes avec définitions HTML
 * - filtres par catégorie et champ de recherche
 * - animation d'apparition et accordéon pour ouvrir/fermer les cartes
 * - gère également le menu responsive (hamburger / sidebar)
 */

// Donnees statiques du lexique : tableau d'objets { name, cat, def }.
// - name : libelle du terme affiche dans la carte
// - cat  : categorie utilisee pour les filtres (classe CSS et logique JS)
// - def  : definition HTML (peut contenir des balises <strong>)
const terms = [
  { name: "Intelligence Artificielle", cat: "fondamental", def: "Domaine de l'informatique visant à créer des systèmes capables de simuler des fonctions cognitives humaines telles que l'apprentissage, le raisonnement, la résolution de problèmes et la compréhension du langage." },
  { name: "Machine Learning", cat: "fondamental", def: "Sous-domaine de l'IA où des <strong>algorithmes apprennent automatiquement</strong> à partir de données sans être explicitement programmés. Plus le modèle voit de données, plus ses performances s'améliorent." },
  { name: "Deep Learning", cat: "fondamental", def: "Technique de Machine Learning utilisant des <strong>réseaux de neurones artificiels</strong> à plusieurs couches (couches profondes) pour extraire des représentations hiérarchiques de données complexes." },
  { name: "Réseau de Neurones", cat: "fondamental", def: "Architecture informatique inspirée du cerveau humain, constituée de nœuds (neurones artificiels) interconnectés organisés en couches. Chaque connexion possède un <strong>poids ajusté lors de l'entraînement</strong>." },
  { name: "LLM (Large Language Model)", cat: "modele", def: "Modèle de langage entraîné sur d'immenses corpus de textes contenant des milliards de paramètres. Il est capable de <strong>générer, comprendre et transformer du texte</strong> de façon cohérente. Exemples : GPT-4, Claude, Gemini." },
  { name: "Transformer", cat: "modele", def: "Architecture de réseau de neurones introduite en 2017, base des LLMs modernes. Elle repose sur un mécanisme d'<strong>attention</strong> qui permet au modèle de pondérer l'importance de chaque mot dans une séquence par rapport aux autres." },
  { name: "Attention (mécanisme)", cat: "modele", def: "Composant clé des Transformers permettant au modèle de <strong>focaliser dynamiquement</strong> sur les parties les plus pertinentes d'une entrée lors de la génération d'une sortie, quelle que soit leur distance dans la séquence." },
  { name: "Paramètre", cat: "modele", def: "Variable interne d'un modèle (poids, biais) <strong>ajustée durant l'entraînement</strong> pour minimiser l'erreur. Le nombre de paramètres détermine en grande partie la capacité du modèle. GPT-4 en posséderait environ 1 800 milliards." },
  { name: "Token", cat: "modele", def: "Unité de base du traitement textuel. Un token représente généralement <strong>un mot ou une partie de mot</strong>. Les LLMs raisonnent et génèrent du texte token par token. \"intelligence\" peut être découpé en [\"intel\", \"lig\", \"ence\"]." },
  { name: "Contexte (fenêtre de)", cat: "modele", def: "Nombre maximal de tokens qu'un modèle peut traiter en une seule fois — son <strong>\"mémoire de travail\"</strong>. Une fenêtre de 128 000 tokens correspond à environ 100 000 mots, soit un roman entier." },
  { name: "Entraînement", cat: "entrainement", def: "Phase d'apprentissage où un modèle ajuste ses paramètres en traitant de grandes quantités de données. Il minimise une <strong>fonction de perte</strong> grâce à la rétropropagation et à des algorithmes d'optimisation comme Adam." },
  { name: "Fine-tuning", cat: "entrainement", def: "Technique consistant à réentraîner un modèle pré-entraîné sur un <strong>jeu de données spécialisé</strong> pour l'adapter à une tâche précise, tout en préservant les connaissances générales acquises lors du pré-entraînement." },
  { name: "RLHF", cat: "entrainement", def: "<strong>Reinforcement Learning from Human Feedback</strong> : méthode d'entraînement où des humains évaluent les sorties du modèle afin d'entraîner un modèle de récompense, utilisé ensuite pour guider le comportement du LLM." },
  { name: "Dataset", cat: "entrainement", def: "Ensemble de données structuré utilisé pour entraîner, valider ou tester un modèle. Sa <strong>qualité, diversité et taille</strong> influencent directement les performances et les biais potentiels du modèle résultant." },
  { name: "Overfitting", cat: "entrainement", def: "Phénomène où un modèle apprend <strong>trop fidèlement les détails du jeu d'entraînement</strong>, perdant sa capacité à généraliser sur de nouvelles données. Il mémorise au lieu d'apprendre des patterns généraux." },
  { name: "Embedding", cat: "entrainement", def: "Représentation vectorielle dense d'un concept (mot, phrase, image) dans un espace mathématique de haute dimension. Des concepts <strong>sémantiquement proches sont placés près l'un de l'autre</strong> dans cet espace." },
  { name: "Prompt", cat: "application", def: "Instruction ou texte d'entrée fourni à un modèle d'IA pour orienter sa réponse. La <strong>qualité et la formulation du prompt</strong> influencent fortement la pertinence et la qualité de la sortie générée." },
  { name: "Prompt Engineering", cat: "application", def: "Discipline consistant à concevoir et optimiser des prompts pour maximiser la qualité des réponses d'un LLM. Inclut des techniques comme <strong>chain-of-thought</strong>, few-shot learning, et la définition de rôles." },
  { name: "RAG (Retrieval-Augmented Generation)", cat: "application", def: "Architecture combinant un LLM avec un système de <strong>recherche de documents</strong>. Avant de répondre, le système récupère des passages pertinents depuis une base de connaissances, réduisant les hallucinations." },
  { name: "Agent IA", cat: "application", def: "Système d'IA capable de percevoir son environnement, de <strong>planifier des actions</strong> et d'utiliser des outils (recherche web, code, API) de façon autonome pour accomplir des objectifs complexes." },
  { name: "Hallucination", cat: "application", def: "Tendance d'un LLM à <strong>générer des informations fausses mais formulées avec assurance</strong>. Le modèle \"invente\" des faits, dates, citations ou références qui semblent plausibles mais sont incorrects." },
  { name: "Température", cat: "application", def: "Paramètre contrôlant le <strong>degré de créativité</strong> des sorties d'un LLM. Une température élevée (≈1) produit des réponses variées et créatives ; une valeur basse (≈0) donne des réponses plus déterministes et prévisibles." },
  { name: "Multimodal", cat: "application", def: "Qualifie un modèle capable de traiter et générer plusieurs types de données simultanément : <strong>texte, images, audio, vidéo</strong>. GPT-4o et Gemini Ultra sont des exemples de modèles multimodaux." },
  { name: "Biais algorithmique", cat: "ethique", def: "Tendance d'un système d'IA à produire des résultats <strong>systématiquement défavorables</strong> pour certains groupes. Généralement héritée de données d'entraînement qui reflètent des inégalités existantes dans la société." },
  { name: "IA Générative", cat: "application", def: "Famille de modèles capables de <strong>créer du contenu original</strong> : texte, images, musique, code, vidéo. Contrairement aux systèmes prédictifs, elle synthétise de nouvelles productions à partir de patterns appris." },
  { name: "Alignment", cat: "ethique", def: "Problème central de l'IA consistant à s'assurer que les systèmes d'IA <strong>poursuivent réellement les objectifs souhaités</strong> par leurs concepteurs et restent bénéfiques pour l'humanité à mesure qu'ils deviennent plus puissants." },
  { name: "IA Générale (AGI)", cat: "ethique", def: "<strong>Artificial General Intelligence</strong> : IA hypothétique possédant des capacités cognitives comparables ou supérieures à celles d'un humain dans tous les domaines. Aucun système actuel n'a atteint ce niveau." },
  { name: "Guardrails", cat: "ethique", def: "Mécanismes techniques et procéduraux intégrés dans un système d'IA pour <strong>prévenir les comportements indésirables</strong> : refus de contenus nuisibles, modération, respect de règles éthiques définies." },
  { name: "Données synthétiques", cat: "entrainement", def: "Données artificiellement générées par un modèle ou un algorithme pour <strong>compléter ou remplacer des données réelles</strong>. Utiles pour augmenter les datasets rares, protéger la vie privée ou couvrir des cas limites." },
  { name: "Inférence", cat: "fondamental", def: "Phase d'<strong>utilisation</strong> d'un modèle déjà entraîné pour générer des prédictions ou des réponses à partir de nouvelles données. Par opposition à l'entraînement, l'inférence ne modifie pas les paramètres du modèle." }
];

// Etat courant du filtre par categorie.
// "all" signifie "aucun filtre de categorie" (tout afficher).
let activeFilter = 'all';

// Etat courant de la recherche texte (toujours stocke en minuscules pour
// comparer facilement avec includes()).
let searchVal = '';

// Elements du menu lateral injecte par shared-components.js.
// On les selectionne une seule fois pour eviter de refaire des query
// a chaque interaction.
const menuToggle = document.querySelector('.menu-toggle');
const menuBar = document.querySelector('.menu');
const sidebar = document.querySelector('.sidebar');

/**
 * Rend l'ensemble de la liste des termes dans le DOM.
 *
 * Etapes :
 * 1) recupere les elements cibles (compteur + conteneur de cartes)
 * 2) applique le double filtrage (categorie + recherche texte)
 * 3) met a jour le compteur "X terme(s)"
 * 4) regenere tout le HTML des cartes (innerHTML)
 *
 * Note perf:
 * Cette page a 30 termes, donc un rerender complet est simple et suffisant.
 */
function renderTerms() {
  // Conteneur principal qui recoit les cartes du lexique.
  const list = document.getElementById('termsList');
  // Petit texte "X terme(s)" au-dessus des cartes.
  const countEl = document.getElementById('count');
  
  // Filtrage principal.
  // matchCat   : valide la categorie active
  // matchSearch: valide le texte saisi (dans le nom ou dans la definition)
  // def.replace(...) : supprime les balises HTML de la definition
  // pour effectuer une recherche sur le texte brut.
  let filtered = terms.filter(t => {
    const matchCat = activeFilter === 'all' || t.cat === activeFilter;
    const matchSearch = t.name.toLowerCase().includes(searchVal) || t.def.replace(/<[^>]+>/g,'').toLowerCase().includes(searchVal);
    return matchCat && matchSearch;
  });

  // Gestion pluriel/singulier dans le compteur.
  countEl.textContent = `${filtered.length} terme${filtered.length > 1 ? 's' : ''}`;
  
  // Regeneration complete des cartes a chaque changement de filtre/recherche.
  // - animation-delay : decalage progressif de l'animation d'apparition
  // - onclick="toggle(this)" : ouvre/ferme la carte courante
  list.innerHTML = filtered.map((t, i) => `
    <div class="term-card" style="animation-delay:${i*30}ms" data-index="${i}">
      <div class="term-header" onclick="toggle(this)">
        <div class="term-left">
          <span class="term-num">${String(i+1).padStart(2,'0')}</span>
          <span class="term-name">${t.name}</span>
        </div>
        <span class="term-cat cat-${t.cat}">${t.cat}</span>
        <span class="term-toggle">+</span>
      </div>
      <div class="term-body">
        <div class="term-body-inner">
          <p class="term-def">${t.def}</p>
        </div>
      </div>
    </div>
  `).join('');
}

/**
 * Ouvre/ferme une carte de terme (comportement accordéon).
 *
 * @param {HTMLElement} header - Element .term-header clique.
 *
 * Regle UX:
 * Une seule carte peut rester ouverte a la fois.
 */
function toggle(header) {
  // Remonte de l'entete vers la carte complete.
  const card = header.closest('.term-card');
  // Memorise si la carte etait deja ouverte.
  const wasOpen = card.classList.contains('open');

  // Ferme toutes les cartes actuellement ouvertes.
  document.querySelectorAll('.term-card.open').forEach(c => c.classList.remove('open'));

  // Si la carte etait fermee, on l'ouvre. Sinon, elle reste fermee.
  if (!wasOpen) card.classList.add('open');
}

// Ecouteurs sur les boutons de filtre (pills).
// A chaque clic :
// - retire la classe active partout
// - active le bouton clique
// - met a jour l'etat activeFilter
// - relance un rendu complet
document.querySelectorAll('.pill').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.pill').forEach(p => p.classList.remove('active'));
    btn.classList.add('active');
    activeFilter = btn.dataset.cat;
    renderTerms();
  });
});

// Ecouteur du champ de recherche.
// La valeur est normalisee en minuscules puis appliquee au filtrage.
document.getElementById('searchInput').addEventListener('input', e => {
  searchVal = e.target.value.toLowerCase();
  renderTerms();
});

// Premier rendu au chargement de la page.
renderTerms();

// Logique du menu lateral responsive.
// Ce bloc est protege pour eviter les erreurs si la sidebar n'est pas presente.
if (menuToggle && menuBar && sidebar) {
  // Clic sur le burger : ouvre/ferme menu + sidebar.
  // stopPropagation evite que le listener document referme immediatement.
  menuToggle.addEventListener('click', (e) => {
    e.stopPropagation();
    menuBar.classList.toggle('active');
    sidebar.classList.toggle('active');
  });

  // Clic en dehors du menu/sidebar : ferme le panneau.
  document.addEventListener('click', (e) => {
    if (!sidebar.contains(e.target) && !menuToggle.contains(e.target)) {
      menuBar.classList.remove('active');
      sidebar.classList.remove('active');
    }
  });

  // Clic dans la sidebar : ne pas fermer le panneau.
  sidebar.addEventListener('click', (e) => {
    e.stopPropagation();
  });
}
