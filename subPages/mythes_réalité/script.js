/*
 * ================================================================
 * mythes-realites.js
 * Gère deux comportements :
 *   1. Le retournement 3D des cartes au clic + effet de survol
 *   2. Le filtrage des cartes par catégorie
 * ================================================================
 */

/*
 * ================================================================
 * SÉLECTION DES ÉLÉMENTS DU DOM
 * On récupère une fois pour toutes les éléments nécessaires
 * plutôt que de les chercher à chaque événement (perf + lisibilité).
 * ================================================================
 */
const cards          = document.querySelectorAll('.card-wrapper');
const flippedCountEl = document.getElementById('flipped-count');
const totalCountEl   = document.getElementById('total-count');

/*
 * flippedSet : un Set (ensemble unique) d'index de cartes retournées.
 * Avantage du Set sur un tableau : add/delete/has sont en O(1),
 * et les doublons sont impossibles par construction.
 */
let flippedSet = new Set();

/*
 * ================================================================
 * GESTION DU FLIP + EFFET DE SURVOL
 * Pour chaque carte, on attache 3 listeners :
 *   - click      : bascule la classe .flipped sur .card-wrapper
 *   - mouseenter : soulève légèrement la carte (si non retournée)
 *   - mouseleave : remet la carte en place
 * ================================================================
 */
cards.forEach((card, i) => {

  /* Référence au .card-inner pour les transforms inline de survol.
     On la stocke ici pour éviter un querySelector à chaque événement. */
  const inner = card.querySelector('.card-inner');

  /* ── CLIC : retourne ou remet la carte ── */
  card.addEventListener('click', () => {

    /* classList.toggle ajoute .flipped si absente, la retire sinon */
    card.classList.toggle('flipped');

    /* Met à jour le Set selon l'état après le toggle */
    if (card.classList.contains('flipped')) {
      flippedSet.add(i);
    } else {
      flippedSet.delete(i);
    }

    /* Met à jour l'affichage du compteur "Retournées" */
    flippedCountEl.textContent = flippedSet.size;

    /*
     * Annule l'éventuel transform inline posé par mouseenter.
     * Si on ne le fait pas, le transform de survol (translateY + scale)
     * reste composé avec le rotateY(180deg) du flip et peut créer
     * un décalage visuel ou un comportement inattendu.
     */
    inner.style.transform = '';
  });

  /* ── SURVOL — entrée : soulève la carte si elle n'est pas retournée ── */
  card.addEventListener('mouseenter', () => {
    if (!card.classList.contains('flipped')) {
      /*
       * translateY(-6px) : monte légèrement la carte.
       * scale(1.01)      : très légère mise à l'échelle.
       * Ces valeurs sont intentionnellement subtiles pour ne pas
       * gêner la lisibilité ou désorienter l'utilisateur.
       * La transition CSS sur .card-inner (définie dans style.css)
       * assure un mouvement fluide.
       */
      inner.style.transform = 'translateY(-6px) scale(1.01)';
    }
  });

  /* ── SURVOL — sortie : remet la carte à sa position normale ── */
  card.addEventListener('mouseleave', () => {
    if (!card.classList.contains('flipped')) {
      inner.style.transform = '';
    }
  });

});

/*
 * ================================================================
 * FILTRAGE PAR CATÉGORIE
 * Au clic sur un bouton .filter-btn :
 *   1. On désactive tous les boutons et on active le bouton cliqué.
 *   2. On parcourt toutes les cartes et on masque celles dont
 *      data-category ne correspond pas au filtre actif.
 *   3. On remet à zéro les cartes retournées (cohérence visuelle).
 *   4. On met à jour le compteur "Idées reçues" (total visible).
 * ================================================================
 */
document.querySelectorAll('.filter-btn').forEach(btn => {
  btn.addEventListener('click', () => {

    /* Désactive tous les boutons, puis active uniquement le bouton cliqué */
    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    /* data-filter contient "all", "apprentissage", "ethique", etc. */
    const filter = btn.dataset.filter;
    let visible = 0;

    cards.forEach(card => {
      /*
       * La carte est visible si le filtre est "all"
       * ou si sa data-category correspond exactement au filtre.
       * classList.toggle(class, condition) : ajoute si false, retire si true.
       */
      const match = filter === 'all' || card.dataset.category === filter;
      card.classList.toggle('hidden', !match);
      if (match) visible++;
    });

    /* Met à jour le compteur "Idées reçues" avec le nombre de cartes visibles */
    totalCountEl.textContent = visible;

    /*
     * Remet toutes les cartes sur leur recto et vide le Set.
     * On nettoie aussi les éventuels transforms inline de survol
     * pour éviter un état visuel incohérent après le changement de filtre.
     */
    flippedSet.clear();
    flippedCountEl.textContent = 0;
    cards.forEach(c => {
      c.classList.remove('flipped');
      c.querySelector('.card-inner').style.transform = '';
    });

  });
});
