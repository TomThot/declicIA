/**
 * DéclicIA - Script principal 
 * Gestion du menu, des popups dynamiques et du quiz
 */

// ========================================================================
// MENU BURGER & NAVIGATION
// ========================================================================

const burger = document.getElementById("burger");
const nav = document.getElementById("nav");
const overlay = document.getElementById("overlay");
const menuItems = document.querySelectorAll(".menu-item");

// BEGIN DARK THEME
const themeToggle = document.getElementById("themeToggle");
const rootElement = document.documentElement;
const headerLogoImg = document.querySelector(".logo img");
const THEME_KEY = "declicia-theme";
const LIGHT_LOGO_SRC = "Images/logo_noir_50px.png";
const DARK_LOGO_SRC = "Images/logo_blanc_50.png";

function getPreferredTheme() {
  const savedTheme = localStorage.getItem(THEME_KEY);
  if (savedTheme === "light" || savedTheme === "dark") {
    return savedTheme;
  }
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

function applyTheme(theme) {
  const isDark = theme === "dark";
  rootElement.dataset.theme = theme;

  if (headerLogoImg) {
    headerLogoImg.src = isDark ? DARK_LOGO_SRC : LIGHT_LOGO_SRC;
  }

  if (themeToggle) {
    themeToggle.setAttribute("aria-checked", String(isDark));
    themeToggle.setAttribute(
      "aria-label",
      isDark
        ? "Basculer vers le thème clair"
        : "Basculer vers le thème sombre"
    );
  }
}

if (themeToggle) {
  applyTheme(getPreferredTheme());
  themeToggle.addEventListener("click", () => {
    const nextTheme =
      rootElement.dataset.theme === "dark" ? "light" : "dark";
    applyTheme(nextTheme);
    localStorage.setItem(THEME_KEY, nextTheme);
  });
}
// END DARK THEME

// Toggle menu burger
burger.addEventListener("click", () => {
  burger.classList.toggle("active");
  nav.classList.toggle("active");
  overlay.classList.toggle("active");
  document.body.style.overflow = nav.classList.contains("active")
    ? "hidden"
    : "auto";
});

// Fermer le menu en cliquant sur l'overlay
overlay.addEventListener("click", closeMenu);

// Gestion des sous-menus
menuItems.forEach((item) => {
  const menuLink = item.querySelector(".menu-link");

  menuLink.addEventListener("click", (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (window.innerWidth > 768) {
      menuItems.forEach((otherItem) => {
        if (otherItem !== item) {
          otherItem.classList.remove("active");
        }
      });
    }

    item.classList.toggle("active");
  });
});

// Fermer les sous-menus en cliquant ailleurs
document.addEventListener("click", (e) => {
  if (!e.target.closest(".nav") && !e.target.closest(".burger")) {
    if (window.innerWidth > 768) {
      menuItems.forEach((item) => item.classList.remove("active"));
    } else if (nav.classList.contains("active")) {
      closeMenu();
    }
  }
});

// Fermer le menu en cliquant sur un lien de sous-menu
document.querySelectorAll(".submenu a").forEach((link) => {
  link.addEventListener("click", closeMenu);
});

function closeMenu() {
  burger.classList.remove("active");
  nav.classList.remove("active");
  overlay.classList.remove("active");
  document.body.style.overflow = "auto";
  menuItems.forEach((item) => item.classList.remove("active"));
}

// ========================================================================
// GÉNÉRATION DYNAMIQUE DES POPUPS
// ========================================================================

// Données des popups qui vient depuis data-popups.js. Ce fichier est chargé avant script.js pour pouvoir manipuler popupsData ici.

// Créer un conteneur pour toutes les popups
const popupsContainer = document.createElement("div");
popupsContainer.id = "popups-container";

// Générer les popups dynamiquement
popupsData.forEach((popup) => {
  const popupElement = document.createElement("div");
  popupElement.id = `popup${popup.id}`;
  popupElement.className = "popup";
  popupElement.setAttribute("role", "dialog");
  popupElement.setAttribute("aria-modal", "true");
  popupElement.setAttribute("aria-labelledby", `popup${popup.id}-title`);

  popupElement.innerHTML = `
    <div class="popup-contenu">
      <button class="fermer" aria-label="Fermer la modal">&times;</button>
      <h2 id="popup${popup.id}-title">${popup.title}</h2>
      <p>${popup.content}</p>
    </div>
  `;

  popupsContainer.appendChild(popupElement);
});

// Ajouter toutes les popups au body
document.body.appendChild(popupsContainer);

// ========================================================================
// GESTION DES POPUPS - Délégation d'événements
// ========================================================================

let currentPopup = null;

// Ouvrir popup au clic sur un message
document.addEventListener("click", (e) => {
  const message = e.target.closest(".message");
  if (message) {
    const popupId = message.getAttribute("data-popup");
    const popup = document.getElementById(popupId);
    if (popup) {
      openPopup(popup);
    }
  }

  // Fermer popup au clic sur le bouton fermer
  const fermer = e.target.closest(".fermer");
  if (fermer) {
    const popup = fermer.closest(".popup");
    if (popup) {
      closePopup(popup);
    }
  }

  // Fermer popup au clic en dehors du contenu
  if (e.target.classList.contains("popup")) {
    closePopup(e.target);
  }
});

// Fermer avec la touche Échap
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && currentPopup) {
    closePopup(currentPopup);
  }
});

function openPopup(popup) {
  popup.style.display = "block";
  currentPopup = popup;
  // Focus sur le bouton fermer pour l'accessibilité
  const closeBtn = popup.querySelector(".fermer");
  if (closeBtn) {
    setTimeout(() => closeBtn.focus(), 100);
  }
}

function closePopup(popup) {
  popup.style.display = "none";
  currentPopup = null;
}

// ========================================================================
// AFFICHER/MASQUER LE BANDEAU
// ========================================================================

const lien = document.getElementById("toggleLink");
const div = document.getElementById("maDiv");
const reveal = document.getElementById("myDivToAnimate");

if (lien && div) {
  lien.addEventListener("click", (e) => {
    e.preventDefault();
    div.classList.toggle("cache");
    if (reveal) {
      reveal.classList.toggle("cache");
    }
  });
}

// ========================================================================
// apparition au scroll
// ========================================================================
const target = document.getElementById("myDivToAnimate");
let revealed = false;

window.addEventListener("scroll", () => {
  if (!revealed && window.scrollY > 10) {
    // seuil de scroll pour déclencher
    target.classList.add("is-visible");
    revealed = true; // une seule fois
  }
});

// ========================================================================
// QUIZ
// ========================================================================

const profiles = {
  confort: {
    title: "Le Spectateur 👀",
    icon: "🛋️",
    description:
      "Vous observez de loin. Vos méthodes fonctionnent, l'IA vous semble floue ou pas indispensable. C'est une posture légitime qui préserve votre énergie et vos acquis pédagogiques.",
    color: "#3498db",
  },
  resistance: {
    title: "La Résistance 🛡️",
    icon: "🛑",
    description:
      "Vous avez des doutes, voire des réticences. C'est souvent la porte d'entrée vers l'exploration, si elle est reconnue et accompagnée. Identifiez UNE peur précise et cherchez UNE réponse factuelle.",
    color: "#e74c3c",
  },
  exploration: {
    title: "L'Explorateur 🧭",
    icon: "🔍",
    description:
      "Vous osez. Vous vous autorisez à ne pas tout comprendre, à tâtonner. C'est là que les premiers apports deviennent visibles et que naît le sentiment de fierté qui nourrit la motivation.",
    color: "#f39c12",
  },
  action: {
    title: "L'Acteur 🎬",
    icon: "⚡",
    description:
      "L'IA devient un levier pédagogique, intégré avec sens et recul. Vous ne la subissez plus, vous l'utilisez à bon escient. Vous pouvez inspirer vos pairs et participer à la réflexion collective.",
    color: "#27ae60",
  },
};

const form = document.getElementById("quizForm");
const resultDiv = document.getElementById("result");
const resultContent = document.getElementById("resultContent");
const resetBtn = document.getElementById("resetBtn");
const emptyMessage = document.getElementById("emptyMessage");

// NOUVEAU : Éléments pour les barres de progression
const resultContainer = document.getElementById("result");

function calculateScores() {
  const scores = { confort: 0, resistance: 0, exploration: 0, action: 0 };
  const checkboxes = form.querySelectorAll('input[type="checkbox"]');

  checkboxes.forEach((checkbox) => {
    if (checkbox.checked) {
      scores[checkbox.name]++;
    }
  });

  return scores;
}

function getDominantProfile(scores) {
  let maxScore = 0;
  let dominantProfile = null;
  let totalChecked = 0;

  for (const [profile, score] of Object.entries(scores)) {
    totalChecked += score;
    if (score > maxScore) {
      maxScore = score;
      dominantProfile = profile;
    }
  }

  return { profile: dominantProfile, total: totalChecked };
}

function displayResult() {
  const scores = calculateScores();
  const { profile, total } = getDominantProfile(scores);

  // Si aucune case n'est cochée
  // Récupérer l'élément des barres
  const scoreBars = document.getElementById("scoreBars");

  if (total === 0) {
    emptyMessage.classList.remove("hidden");
    if (resultDiv) {
      resultDiv.classList.remove("visible");
    }
    if (resetBtn) {
      resetBtn.style.display = "none";
    }
    if (scoreBars) {
      scoreBars.classList.remove("visible");
    }
    return;
  }

  emptyMessage.classList.add("hidden");

  if (scoreBars) {
    scoreBars.classList.add("visible");
  }

  if (resetBtn) {
    resetBtn.style.display = "block";
  }

  // NOUVEAU : Mettre à jour les barres de progression
  updateScoreBars(scores, profile);

  // Afficher le profil dominant dans la carte
  const profileData = profiles[profile];

  // Créer l'icône si elle n'existe pas
  let iconElement = resultContent.querySelector(".profile-icon");
  if (!iconElement) {
    iconElement = document.createElement("div");
    iconElement.className = "profile-icon";
    resultContent.insertBefore(iconElement, resultContent.firstChild);
  }
  iconElement.textContent = profileData.icon;

  resultContent.innerHTML = `
    <div class="profile-icon">${profileData.icon}</div>
    <strong>${profileData.title}</strong>
    <p>${profileData.description}</p>
  `;

  resultDiv.style.background = `linear-gradient(135deg, ${profileData.color} 0%, ${adjustColor(profileData.color, -30)} 100%)`;

  // Ajouter la classe visible pour l'animation
  if (resultDiv) {
    resultDiv.classList.add("visible");
    resultDiv.classList.remove("hidden");
  }

  // Scroll vers le résultat
  resultDiv.scrollIntoView({ behavior: "smooth", block: "nearest" });
}

// NOUVEAU : Fonction pour mettre à jour les barres
function updateScoreBars(scores, dominantProfile) {
  Object.keys(scores).forEach((zone) => {
    const percentage = (scores[zone] / 3) * 100;
    const capitalizedZone = zone.charAt(0).toUpperCase() + zone.slice(1);

    // Mettre à jour le label du score
    const scoreLabel = document.getElementById(`score${capitalizedZone}`);
    if (scoreLabel) {
      scoreLabel.textContent = `${scores[zone]}/3`;
    }

    // Mettre à jour la barre
    const bar = document.getElementById(`bar${capitalizedZone}`);
    if (bar) {
      // Retirer la classe winner de toutes les barres
      bar.classList.remove("winner");

      // Animer la barre
      setTimeout(() => {
        bar.style.width = percentage + "%";
      }, 100);

      // Ajouter la classe winner à la barre dominante
      if (zone === dominantProfile) {
        setTimeout(() => {
          bar.classList.add("winner");
        }, 1100); // Après l'animation de la barre
      }
    }
  });
}

function adjustColor(color, amount) {
  const num = parseInt(color.replace("#", ""), 16);
  const r = Math.max(0, (num >> 16) + amount);
  const g = Math.max(0, ((num >> 8) & 0x00ff) + amount);
  const b = Math.max(0, (num & 0x0000ff) + amount);
  return "#" + ((r << 16) | (g << 8) | b).toString(16).padStart(6, "0");
}

function resetQuiz() {
  const checkboxes = form.querySelectorAll('input[type="checkbox"]');
  checkboxes.forEach((checkbox) => {
    checkbox.checked = false;
  });

  if (resultDiv) {
    resultDiv.classList.add("hidden");
    resultDiv.classList.remove("visible");
  }
  emptyMessage.classList.add("hidden");

  if (resetBtn) {
    resetBtn.style.display = "none";
  }

  const scoreBars = document.getElementById("scoreBars");
  if (scoreBars) {
    scoreBars.classList.remove("visible");
  }

  // Réinitialiser les barres
  Object.keys(profiles).forEach((zone) => {
    const capitalizedZone = zone.charAt(0).toUpperCase() + zone.slice(1);
    const bar = document.getElementById(`bar${capitalizedZone}`);
    if (bar) {
      bar.style.width = "0%";
      bar.classList.remove("winner");
    }
  });
}

// Event listeners pour le quiz
if (form) {
  form.addEventListener("change", displayResult);
}

if (resetBtn) {
  resetBtn.addEventListener("click", resetQuiz);
}
