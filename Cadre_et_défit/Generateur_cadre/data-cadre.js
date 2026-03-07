/**
 * data-cadre.js
 * Données du générateur de cadre d'usage — DéclicIA
 *
 * Ce fichier est SÉPARÉ du code (scriptGenerateur.js) intentionnellement :
 * → Tu peux modifier les listes (disciplines, niveaux, usages, outils)
 *   sans jamais toucher à la logique du générateur.
 * → Même principe que data-popups.js sur le site principal.
 *
 * POUR REVENIR EN ARRIÈRE :
 * Il suffit de supprimer ce fichier et le dossier Generateur_cadre/
 * Aucun autre fichier du projet n'est modifié par ce fichier.
 */

// ─────────────────────────────────────────────────────────────────────────────
// DISCIPLINES
// Chaque entrée = { value: "clé interne", label: "Texte affiché" }
// Pour ajouter une discipline : copier une ligne et adapter value + label.
// ─────────────────────────────────────────────────────────────────────────────
const DISCIPLINES = [
  { value: "francais",       label: "Français" },
  { value: "maths",          label: "Mathématiques" },
  { value: "histoire-geo",   label: "Histoire-Géographie" },
  { value: "svt",            label: "SVT" },
  { value: "physique",       label: "Physique-Chimie" },
  { value: "langues",        label: "Langues vivantes" },
  { value: "techno",         label: "Technologie" },
  { value: "arts",           label: "Arts plastiques" },
  { value: "eps",            label: "EPS" },
  { value: "snt",            label: "SNT" },
  { value: "nsi",            label: "NSI" },
  { value: "autre",          label: "Autre" },
];

// ─────────────────────────────────────────────────────────────────────────────
// NIVEAUX
// ─────────────────────────────────────────────────────────────────────────────
const NIVEAUX = [
  { value: "cp",    label: "CP" },
  { value: "ce1",   label: "CE1" },
  { value: "ce2",   label: "CE2" },
  { value: "cm1",   label: "CM1" },
  { value: "cm2",   label: "CM2" },
  { value: "6e",    label: "6ème" },
  { value: "5e",    label: "5ème" },
  { value: "4e",    label: "4ème" },
  { value: "3e",    label: "3ème" },
  { value: "2nde",  label: "2nde" },
  { value: "1ere",  label: "1ère" },
  { value: "tle",   label: "Terminale" },
  { value: "bts",   label: "BTS / Post-bac" },
];

// ─────────────────────────────────────────────────────────────────────────────
// USAGES AUTORISÉS
// Chaque entrée = { id: "identifiant unique", label: "Texte affiché" }
// checked: true → coché par défaut dans le formulaire
// ─────────────────────────────────────────────────────────────────────────────
const USAGES_AUTORISES = [
  { id: "reformuler",    label: "Reformuler un texte pour mieux le comprendre", checked: true  },
  { id: "exemples",      label: "Chercher des exemples ou des illustrations",    checked: true  },
  { id: "orthographe",   label: "Vérifier l'orthographe d'un mot",               checked: true  },
  { id: "definition",    label: "Chercher la définition d'un terme inconnu",      checked: true  },
  { id: "plan",          label: "Générer un plan ou une structure de travail",    checked: false },
  { id: "traduction",    label: "Traduire un mot ou une phrase courte",           checked: false },
  { id: "brainstorming", label: "Générer des idées (brainstorming)",              checked: false },
  { id: "feedback",      label: "Obtenir un retour sur un brouillon personnel",  checked: false },
  { id: "simplifier",    label: "Simplifier un texte complexe",                  checked: false },
];

// ─────────────────────────────────────────────────────────────────────────────
// USAGES INTERDITS
// ─────────────────────────────────────────────────────────────────────────────
const USAGES_INTERDITS = [
  { id: "copier",       label: "Copier-coller une réponse générée comme sienne",   checked: true  },
  { id: "devoir",       label: "Faire générer un devoir ou une rédaction entière", checked: true  },
  { id: "evaluation",   label: "Utiliser l'IA pendant une évaluation",             checked: true  },
  { id: "sans-verif",   label: "Utiliser une réponse sans la vérifier",            checked: true  },
  { id: "sources",      label: "Citer l'IA comme source officielle",               checked: false },
  { id: "anonymat",     label: "Partager des données personnelles à l'IA",         checked: false },
];

// ─────────────────────────────────────────────────────────────────────────────
// OUTILS IA AUTORISÉS
// logo: emoji ou texte court affiché dans la fiche générée
// ─────────────────────────────────────────────────────────────────────────────
const OUTILS = [
  { id: "chatgpt",    label: "ChatGPT",     logo: "🤖", checked: false },
  { id: "mistral",    label: "Mistral AI",  logo: "🌬️", checked: true  },
  { id: "copilot",    label: "Copilot",     logo: "🪟", checked: false },
  { id: "gemini",     label: "Gemini",      logo: "✨", checked: false },
  { id: "claude",     label: "Claude AI",   logo: "✴️", checked: false },
  { id: "p2ia",       label: "P2IA",        logo: "🏫", checked: true  },
  { id: "caramel",    label: "Caramel",     logo: "🍬", checked: false },
  { id: "notebooklm", label: "NotebookLM",  logo: "📓", checked: false },
  { id : "chatMD",    label: "ChatMD",      logo: "👾", checked: false },
  { id: "aucun",      label: "Aucun outil", logo: "🚫", checked: false },
];
