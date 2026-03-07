/**
 * reading-progress.js
 * Barre de progression de lecture — DéclicIA
 *
 * - S'active uniquement si la page est suffisamment longue (> 1.5× la fenêtre)
 * - Compatible thème clair / sombre (géré par CSS via reading-progress.css)
 * - Accessible (role progressbar + attributs ARIA)
 * - Aucune dépendance externe, JS vanilla pur
 */

// ─────────────────────────────────────────────────────────────────────────────
// IIFE — Immediately Invoked Function Expression
//
// Tout le code est enveloppé dans une fonction anonyme appelée immédiatement :
//   (function() { ... })();
//
// Pourquoi ?
//   - Évite de polluer l'espace global (window) avec nos variables locales.
//     Sans ça, `bar`, `minScrollable`, etc. deviendraient des variables
//     globales accessibles et modifiables par n'importe quel autre script.
//   - Crée un "scope" (portée) privé : tout ce qui est déclaré ici
//     reste invisible depuis l'extérieur.
// ─────────────────────────────────────────────────────────────────────────────
(function () {

  // ───────────────────────────────────────────────────────────────────────────
  // ATTENTE DU DOM
  //
  // On écoute l'événement "DOMContentLoaded" sur window.
  // Cet événement se déclenche quand le navigateur a fini de parser
  // le HTML et de construire le DOM — mais AVANT que les images,
  // les feuilles de style externes ou les iframes soient chargées.
  //
  // Pourquoi pas window.onload ?
  //   - window.onload attend que TOUT soit chargé (images comprises),
  //     ce qui retarderait inutilement l'initialisation de la barre.
  //
  // Pourquoi pas exécuter le code directement sans événement ?
  //   - Ce script est chargé avec `defer` dans le HTML, ce qui garantit
  //     déjà l'exécution après le DOM. Mais le DOMContentLoaded est une
  //     sécurité supplémentaire, au cas où le script serait un jour
  //     déplacé dans le <head> sans defer.
  // ───────────────────────────────────────────────────────────────────────────
  window.addEventListener("DOMContentLoaded", function () {

    // ─────────────────────────────────────────────────────────────────────────
    // GARDE-FOU : PAGES TROP COURTES
    //
    // On calcule la hauteur minimale en dessous de laquelle la barre
    // n'a pas de sens (page trop courte, pas vraiment de "lecture").
    //
    // window.innerHeight    → hauteur visible de la fenêtre (le "viewport")
    // document.body.scrollHeight → hauteur totale du contenu de la page
    //
    // Si le contenu total est inférieur à 1.5× la fenêtre,
    // on sort immédiatement (return) sans créer la barre.
    //
    // Exemple concret :
    //   Fenêtre = 900px → seuil = 1350px
    //   Page de 1200px → barre absente (trop courte)
    //   Page de 3000px → barre présente
    // ─────────────────────────────────────────────────────────────────────────
    const minScrollable = window.innerHeight * 1.5;
    if (document.body.scrollHeight <= minScrollable) return;

    // ─────────────────────────────────────────────────────────────────────────
    // CRÉATION DE L'ÉLÉMENT BARRE
    //
    // On crée un <div> dynamiquement via JavaScript plutôt que de le
    // mettre en dur dans chaque HTML. Avantages :
    //   - Un seul endroit à modifier si on change le markup
    //   - Pas de barre visible si JS est désactivé (dégradation gracieuse)
    //   - On peut conditionner sa création (cf. garde-fou ci-dessus)
    // ─────────────────────────────────────────────────────────────────────────
    const bar = document.createElement("div");

    // Donne un id au div pour que le CSS de reading-progress.css puisse
    // le cibler avec le sélecteur #reading-progress
    bar.id = "reading-progress";

    // ─────────────────────────────────────────────────────────────────────────
    // ACCESSIBILITÉ — ATTRIBUTS ARIA
    //
    // On ajoute des attributs ARIA pour que les lecteurs d'écran
    // (utilisés par les personnes malvoyantes) comprennent l'élément.
    //
    // role="progressbar"    → indique que c'est une barre de progression
    // aria-valuemin="0"     → valeur minimale possible : 0%
    // aria-valuemax="100"   → valeur maximale possible : 100%
    // aria-valuenow="0"     → valeur actuelle au départ : 0%
    //                          (mise à jour dynamiquement au scroll)
    // aria-label="..."      → description vocale de l'élément pour
    //                          les lecteurs d'écran
    // ─────────────────────────────────────────────────────────────────────────
    bar.setAttribute("role", "progressbar");
    bar.setAttribute("aria-valuemin", "0");
    bar.setAttribute("aria-valuemax", "100");
    bar.setAttribute("aria-valuenow", "0");
    bar.setAttribute("aria-label", "Progression de lecture");

    // ─────────────────────────────────────────────────────────────────────────
    // INSERTION DANS LE DOM
    //
    // document.body.prepend(bar) insère la barre comme PREMIER enfant
    // de <body>, avant tout autre élément.
    //
    // Pourquoi en premier ?
    //   - La barre est positionnée en `fixed` dans le CSS (elle flotte
    //     au-dessus de la page), donc son ordre dans le DOM n'affecte
    //     pas visuellement sa position.
    //   - La placer en premier est une convention lisible : "cet élément
    //     est global à toute la page".
    //   - Cela évite d'interférer avec d'éventuels scripts qui
    //     manipulent le dernier enfant de body.
    // ─────────────────────────────────────────────────────────────────────────
    document.body.prepend(bar);

    // ─────────────────────────────────────────────────────────────────────────
    // ÉCOUTE DU SCROLL
    //
    // On branche une fonction sur l'événement "scroll" de window.
    // Cette fonction sera appelée à chaque mouvement de scroll.
    //
    // Option { passive: true } :
    //   - Indique au navigateur que ce listener n'appellera jamais
    //     preventDefault() (ce qui bloquerait le scroll natif).
    //   - Le navigateur peut alors optimiser le scroll en le traitant
    //     sur un thread séparé → meilleures performances, surtout mobile.
    //   - Sans cette option, certains navigateurs attendent la fin de
    //     l'exécution du listener avant de scroller, causant des lags.
    // ─────────────────────────────────────────────────────────────────────────
    window.addEventListener("scroll", function () {

      // ───────────────────────────────────────────────────────────────────────
      // CALCUL DE LA POSITION DE SCROLL
      //
      // window.scrollY → pixels scrollés depuis le haut (moderne)
      // document.documentElement.scrollTop → équivalent, pour les vieux
      //   navigateurs qui ne supportent pas scrollY (IE, Edge legacy)
      // L'opérateur || prend la première valeur non nulle/non falsy.
      // ───────────────────────────────────────────────────────────────────────
      const scrollTop = window.scrollY || document.documentElement.scrollTop;

      // ───────────────────────────────────────────────────────────────────────
      // CALCUL DE LA HAUTEUR SCROLLABLE
      //
      // La hauteur "scrollable" n'est PAS la hauteur totale de la page.
      // C'est : hauteur totale  MOINS  hauteur de la fenêtre.
      //
      // Pourquoi ? Parce que quand on est tout en bas de la page,
      // scrollTop = docHeight (pas = scrollHeight).
      //
      // Exemple :
      //   scrollHeight = 3000px (hauteur totale du contenu)
      //   innerHeight  =  900px (hauteur de la fenêtre)
      //   → docHeight  = 2100px (ce qu'on peut réellement scroller)
      //   → Quand scrollTop = 2100, on est à 100%
      // ───────────────────────────────────────────────────────────────────────
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;

      // ───────────────────────────────────────────────────────────────────────
      // CALCUL DU POURCENTAGE
      //
      // Règle de trois : (position actuelle / hauteur totale scrollable) × 100
      //
      // Le test `docHeight > 0` évite une division par zéro sur les
      // rares pages où scrollHeight === innerHeight (page exactement
      // à la hauteur de la fenêtre).
      // ───────────────────────────────────────────────────────────────────────
      const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;

      // ───────────────────────────────────────────────────────────────────────
      // CLAMPING — SÉCURITÉ SUR LA VALEUR
      //
      // Math.min(100, Math.max(0, progress)) garantit que la valeur
      // reste TOUJOURS entre 0 et 100, quoi qu'il arrive.
      //
      // Sans ça, des cas limites pourraient produire des valeurs
      // légèrement négatives ou > 100 (ex: scroll inertiel sur iOS,
      // overscroll sur certains navigateurs mobiles).
      //
      // Math.max(0, progress)    → plancher à 0 (pas de valeur négative)
      // Math.min(100, ...)       → plafond à 100 (pas de valeur > 100%)
      // ───────────────────────────────────────────────────────────────────────
      const clamped = Math.min(100, Math.max(0, progress));

      // ───────────────────────────────────────────────────────────────────────
      // APPLICATION VISUELLE ET ARIA
      //
      // bar.style.width = clamped + "%"
      //   → Modifie directement la largeur de la barre via le style inline.
      //   → Le CSS (reading-progress.css) gère la couleur et la transition.
      //   → La transition CSS `width 0.1s linear` lisse les petits sauts.
      //
      // bar.setAttribute("aria-valuenow", Math.round(clamped))
      //   → Met à jour la valeur ARIA pour les lecteurs d'écran.
      //   → Math.round() arrondit à l'entier le plus proche : pas besoin
      //     de précision décimale pour l'accessibilité (ex: 42, pas 42.37).
      // ───────────────────────────────────────────────────────────────────────
      bar.style.width = clamped + "%";
      bar.setAttribute("aria-valuenow", Math.round(clamped));

    }, { passive: true }); // ← option de performance mentionnée plus haut

  }); // fin DOMContentLoaded

})(); // fin IIFE — exécution immédiate
