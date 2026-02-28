// ------------------------------------------------------------
// Navigation principale (menu burger)
// ------------------------------------------------------------
// Ce bloc gère l'ouverture/fermeture du menu latéral.
// - clic sur le bouton burger: toggle des classes "active"
// - clic en dehors de la sidebar: fermeture automatique
// - clic dans la sidebar: empêche la fermeture (stopPropagation)
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

// ------------------------------------------------------------
// Sections repliables
// ------------------------------------------------------------
// Chaque <h2> d'une section repliable bascule la classe "open"
// sur son parent ".collapsible-section".
// Le CSS se charge ensuite de l'animation d'ouverture/fermeture.
document.querySelectorAll(".collapsible-section > h2").forEach((title) => {
  title.addEventListener("click", () => {
    title.parentElement.classList.toggle("open");
  });
});

// ------------------------------------------------------------
// Carousel 3D: point d'entree
// ------------------------------------------------------------
// On récupère l'élément principal. S'il est absent, on ne bloque
// pas la page: on avertit juste dans la console.
const carousel = document.getElementById("carousel");
if (!carousel) {
  console.warn("Element #carousel introuvable.");
} else {
  // Sur petits écrans, le carousel 3D est désactivé pour éviter
  // les sauts de rendu/jank. Les contrôles associés sont cachés.
  const disableCarouselMq = window.matchMedia("(max-width: 768px)");
  if (disableCarouselMq.matches) {
    const controls = document.querySelector("#galerie .controls");
    const dots = document.getElementById("dots");

    if (controls) controls.style.display = "none";
    if (dots) dots.style.display = "none";
  } else {

// Position initiale de chaque carte autour de l'axe Y.
// Exemple: N=8 => 0deg, 45deg, 90deg, ...
const cards = Array.from(carousel.querySelectorAll(".carousel-card"));
const N = cards.length;

// Dimensions de référence utilisées pour calculer le rayon de l'orbite.
// CARD_W doit rester cohérent avec la largeur CSS des cartes.
const CARD_W = 240;
const ORBIT_OFFSET = 200;

// Rayon de l'orbite 3D:
// formule géométrique d'un polygone régulier + offset visuel.
// Plus N est grand, plus le rayon augmente pour éviter le chevauchement.
const radius = Math.round(CARD_W / 2 / Math.tan(Math.PI / N)) + ORBIT_OFFSET;
cards.forEach((card, i) => {
  const angle = 360 / N * i;
  card.style.transform = `rotateY(${angle}deg) translateZ(${radius}px)`;
});

// Dots de navigation:
// - 1 dot par carte
// - clic sur un dot => rotation vers la carte ciblée
const dotsEl = document.getElementById("dots");
const dotEls = [];
for (let i = 0; i < N; i++) {
  const dot = document.createElement("div");
  dot.className = "dot" + (i === 0 ? " active" : "");
  dot.addEventListener("click", () => goTo(i));
  dotsEl.appendChild(dot);
  dotEls.push(dot);
}

let currentAngle = 0;
let targetAngle = 0;
let autoAngle = 0;
let paused = false;
let isDragging = false;
let dragStartX = 0;
let dragStartAngle = 0;
let currentIndex = 0;
let lastTime = null;

// Réglages d'affichage selon l'angle relatif à la face avant.
// Au-delà de HIDE_DEG, la carte est masquée pour éviter de voir son "dos".
const HIDE_DEG = 70;
const BLUR_START = 20;

// Met à jour chaque carte en fonction de la rotation globale du carousel:
// - visibilité
// - opacité
// - blur progressif
// - scale léger
// - z-index pour une superposition propre
function updateCards(globalRot) {
  cards.forEach((card, i) => {
    const cardAngle = 360 / N * i;
    let a = ((cardAngle + globalRot) % 360 + 360) % 360;
    if (a > 180) a -= 360;

    const absA = Math.abs(a);

    // Carte trop latérale/arrière: on masque complètement.
    if (absA >= HIDE_DEG) {
      card.style.opacity = "0";
      card.style.visibility = "hidden";
      card.style.pointerEvents = "none";
      return;
    }

    card.style.visibility = "visible";

    // Plus la carte s'éloigne de l'avant:
    // - blur croissant (non linéaire)
    // - légère réduction d'échelle
    const blurT = Math.max(0, (absA - BLUR_START) / (HIDE_DEG - BLUR_START));
    const blur = blurT * blurT * 12;

    const fadeStart = HIDE_DEG - 15;
    const opacity = absA > fadeStart ? 1 - (absA - fadeStart) / (HIDE_DEG - fadeStart) : 1;

    const scale = 1 - blurT * 0.035;

    card.style.filter = `blur(${blur.toFixed(1)}px)`;
    card.style.opacity = Math.max(0, opacity).toFixed(3);
    card.style.pointerEvents = opacity > 0.4 ? "auto" : "none";
    card.style.transform = `rotateY(${cardAngle}deg) translateZ(${radius}px) scale(${scale.toFixed(3)})`;
    card.style.zIndex = Math.round((1 - absA / 180) * 10);
  });
}

// Boucle d'animation principale (RAF):
// - calcule dt pour une vitesse stable
// - applique l'autoplay si non pausé
// - interpole currentAngle vers targetAngle pour lisser la rotation
// - met à jour les cartes et le dot actif
function tick(ts) {
  if (!lastTime) lastTime = ts;
  // Cap du delta time pour limiter les écarts après un onglet inactif.
  const dt = Math.min((ts - lastTime) / 1000, 0.05);
  lastTime = ts;

  // Rotation auto + interpolation douce vers la cible.
  if (!isDragging) {
    if (!paused) {
      // Vitesse de l'autoplay: 10 deg/s.
      autoAngle += 10 * dt;
      targetAngle = autoAngle;
    }
    currentAngle += (targetAngle - currentAngle) * 0.07;
  }

  carousel.style.transform = `rotateY(${currentAngle}deg)`;
  updateCards(currentAngle);

  // Synchronise le dot actif avec la carte la plus proche de la face avant.
  // On convertit l'angle courant en index de carte via un pas angulaire.
  const step = 360 / N;
  const idx = ((Math.round(-currentAngle / step) % N) + N) % N;
  if (idx !== currentIndex) {
    dotEls[currentIndex].classList.remove("active");
    currentIndex = idx;
    dotEls[currentIndex].classList.add("active");
  }

  requestAnimationFrame(tick);
}
requestAnimationFrame(tick);

// Rotation vers une carte donnée en prenant le plus court chemin angulaire.
// Cela évite de faire presque un tour complet quand un petit déplacement suffit.
function goTo(index) {
  const step = 360 / N;
  const target = -index * step;
  const diff = ((target - targetAngle) % 360 + 540) % 360 - 180;
  targetAngle += diff;
  autoAngle = targetAngle;
}

const pauseBtn = document.getElementById("pauseBtn");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");

// Bouton pause/reprise de l'autoplay.
if (pauseBtn) {
  pauseBtn.addEventListener("click", () => {
    paused = !paused;
    pauseBtn.textContent = paused ? "▶" : "⏸";
    if (!paused) autoAngle = targetAngle;
  });
}

// Navigation précédente/suivante par pas d'une carte.
if (prevBtn) {
  prevBtn.addEventListener("click", () => {
    targetAngle += 360 / N;
    autoAngle = targetAngle;
  });
}

if (nextBtn) {
  nextBtn.addEventListener("click", () => {
    targetAngle -= 360 / N;
    autoAngle = targetAngle;
  });
}

// Drag souris:
// - mousedown: début du drag
// - mousemove: l'angle suit le déplacement horizontal
// - mouseup: fin du drag
// Le coefficient 0.3 contrôle la sensibilité.
carousel.addEventListener("mousedown", (e) => {
  isDragging = true;
  dragStartX = e.clientX;
  dragStartAngle = currentAngle;
  e.preventDefault();
});

window.addEventListener("mousemove", (e) => {
  if (!isDragging) return;
  currentAngle = dragStartAngle + (e.clientX - dragStartX) * 0.3;
  targetAngle = currentAngle;
  autoAngle = currentAngle;
});

window.addEventListener("mouseup", () => {
  isDragging = false;
});

// Équivalent tactile (mobile/tablette).
// Remarque: touchmove est passif ici pour les performances de scroll.
// Comme le carousel est désactivé sous 768px, ce code ne s'exécute
// que sur écrans plus larges.
carousel.addEventListener("touchstart", (e) => {
  isDragging = true;
  dragStartX = e.touches[0].clientX;
  dragStartAngle = currentAngle;
}, { passive: true });

window.addEventListener("touchmove", (e) => {
  if (!isDragging) return;
  currentAngle = dragStartAngle + (e.touches[0].clientX - dragStartX) * 0.3;
  targetAngle = currentAngle;
  autoAngle = currentAngle;
}, { passive: true });

window.addEventListener("touchend", () => {
  isDragging = false;
});
  }
}
