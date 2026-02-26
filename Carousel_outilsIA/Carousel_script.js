// Gestion du menu burger + fermeture en cliquant hors de la sidebar.
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

// Sections repliables (meme comportement que la page Outils)
document.querySelectorAll(".collapsible-section > h2").forEach((title) => {
  title.addEventListener("click", () => {
    title.parentElement.classList.toggle("open");
  });
});

// Recuperation du carrousel principal.
const carousel = document.getElementById("carousel");
if (!carousel) {
  throw new Error("Element #carousel introuvable.");
}

const cards = Array.from(carousel.querySelectorAll(".carousel-card"));
const N = cards.length;
const CARD_W = 240;
const ORBIT_OFFSET = 200;

// Rayon du carrousel 3D : derive de la largeur carte + un decalage visuel.
const radius = Math.round(CARD_W / 2 / Math.tan(Math.PI / N)) + ORBIT_OFFSET;

// Positionne chaque carte autour de l'axe Y.
cards.forEach((card, i) => {
  const angle = 360 / N * i;
  card.style.transform = `rotateY(${angle}deg) translateZ(${radius}px)`;
});

// Cree les points de navigation (dots) et lie chaque point a goTo(i).
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

// Reglages visuels des cartes selon leur angle.
const HIDE_DEG = 70;
const BLUR_START = 20;

function updateCards(globalRot) {
  cards.forEach((card, i) => {
    const cardAngle = 360 / N * i;
    let a = ((cardAngle + globalRot) % 360 + 360) % 360;
    if (a > 180) a -= 360;

    const absA = Math.abs(a);

    // Masque complet au-dela d'un angle limite pour eviter le "dos" des cartes.
    if (absA >= HIDE_DEG) {
      card.style.opacity = "0";
      card.style.visibility = "hidden";
      card.style.pointerEvents = "none";
      return;
    }

    card.style.visibility = "visible";

    // Blur progressif + leger scale down quand la carte s'eloigne du centre.
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

// Boucle d'animation principale (requestAnimationFrame).
function tick(ts) {
  if (!lastTime) lastTime = ts;
  const dt = Math.min((ts - lastTime) / 1000, 0.05);
  lastTime = ts;

  // Rotation auto + interpolation douce vers la cible.
  if (!isDragging) {
    if (!paused) {
      autoAngle += 10 * dt;
      targetAngle = autoAngle;
    }
    currentAngle += (targetAngle - currentAngle) * 0.07;
  }

  carousel.style.transform = `rotateY(${currentAngle}deg)`;
  updateCards(currentAngle);

  // Synchronise le dot actif avec la carte la plus proche de la face avant.
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

// Va a une carte donnee en prenant le plus court chemin angulaire.
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

// Pause/reprise de l'autoplay.
if (pauseBtn) {
  pauseBtn.addEventListener("click", () => {
    paused = !paused;
    pauseBtn.textContent = paused ? "▶" : "⏸";
    if (!paused) autoAngle = targetAngle;
  });
}

// Navigation precedente/suivante par pas d'une carte.
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

// Drag souris : suit le deplacement horizontal et recale la cible.
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

// Equivalent tactile (mobile/tablette).
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
