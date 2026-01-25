const burger = document.getElementById("burger");
const nav = document.getElementById("nav");
const overlay = document.getElementById("overlay");
const navLinks = document.querySelectorAll(".nav-list a");
const menuItems = document.querySelectorAll(".menu-item");

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
overlay.addEventListener("click", () => {
  closeMenu();
});

// Gestion des sous-menus
menuItems.forEach((item) => {
  const menuLink = item.querySelector(".menu-link");

  menuLink.addEventListener("click", (e) => {
    e.preventDefault();
    e.stopPropagation(); // Empêche la propagation pour éviter la fermeture immédiate

    // En mode desktop, fermer les autres sous-menus
    if (window.innerWidth > 768) {
      menuItems.forEach((otherItem) => {
        if (otherItem !== item) {
          otherItem.classList.remove("active");
        }
      });
    }

    // Toggle le sous-menu
    item.classList.toggle("active");
  });
});

// Fermer les sous-menus en cliquant ailleurs
document.addEventListener("click", (e) => {
  // Si on clique en dehors du menu et du burger
  if (!e.target.closest(".nav") && !e.target.closest(".burger")) {
    // En mode desktop, fermer uniquement les sous-menus
    if (window.innerWidth > 768) {
      menuItems.forEach((item) => {
        item.classList.remove("active");
      });
    }
    // En mode mobile, fermer tout le menu burger
    else if (nav.classList.contains("active")) {
      closeMenu();
    }
  }
});

// Fermer le menu en cliquant sur un lien de sous-menu
document.querySelectorAll(".submenu a").forEach((link) => {
  link.addEventListener("click", () => {
    closeMenu();
  });
});

// Fonction pour fermer le menu
function closeMenu() {
  burger.classList.remove("active");
  nav.classList.remove("active");
  overlay.classList.remove("active");
  document.body.style.overflow = "auto";

  // Fermer tous les sous-menus
  menuItems.forEach((item) => {
    item.classList.remove("active");
  });
}



/*popup*/
// Récupérer tous les messages
const messages = document.querySelectorAll('.message');

// Ajouter un écouteur d'événement à chaque message
messages.forEach(function(message) {
    message.addEventListener('click', function() {
        const popupId = this.getAttribute('data-popup');
        const popup = document.getElementById(popupId);
        popup.style.display = 'block';
    });
});

// Récupérer tous les boutons de fermeture
const boutonsFermer = document.querySelectorAll('.fermer');

boutonsFermer.forEach(function(bouton) {
    bouton.addEventListener('click', function() {
        this.closest('.popup').style.display = 'none';
    });
});

// Fermer le popup au clic en dehors du contenu
window.addEventListener('click', function(event) {
    if (event.target.classList.contains('popup')) {
        event.target.style.display = 'none';
    }
});

// Fermer avec la touche Échap
document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
        document.querySelectorAll('.popup').forEach(popup => {
            popup.style.display = 'none';
        });
    }
});


//---------------------------------------------------------------------------------------------//
//-----------------------Afficher/masquer le bandeau-----------------------------------------------------------------//
//---------------------------------------------------------------------------------------------//

const lien = document.getElementById('toggleLink');
const div = document.getElementById('maDiv');
        
        lien.addEventListener('click', function(e) {
            e.preventDefault();
            div.classList.toggle('cache');
        });



//---------------------------------------------------------------------------------------------//
//-----------------------Quizz-----------------------------------------------------------------//
//---------------------------------------------------------------------------------------------//
// Profils avec leurs descriptions
const profiles = {
  confort: {
    title: "Le Spectateur",
    description:
      "Vous observez de loin. Vos méthodes fonctionnent, l'IA vous semble floue ou pas indispensable. C'est une posture légitime qui préserve votre énergie et vos acquis pédagogiques.",
    color: "#3498db",
  },
  resistance: {
    title: "La Résistance",
    description:
      "Vous avez des doutes, voire des réticences. C'est souvent la porte d'entrée vers l'exploration, si elle est reconnue et accompagnée. Identifiez UNE peur précise et cherchez UNE réponse factuelle.",
    color: "#e74c3c",
  },
  exploration: {
    title: "L'Explorateur",
    description:
      "Vous osez. Vous vous autorisez à ne pas tout comprendre, à tâtonner. C'est là que les premiers apports deviennent visibles et que naît le sentiment de fierté qui nourrit la motivation.",
    color: "#f39c12",
  },
  action: {
    title: "L'Acteur",
    description:
      "L'IA devient un levier pédagogique, intégré avec, probablement sens et recul. Vous ne la subissez plus, vous l'utilisez à bon escient. Vous pouvez inspirer vos pairs et participer à la réflexion collective.",
    color: "#27ae60",
  },
};

// Récupérer les éléments du DOM
const form = document.getElementById("quizForm");
const resultDiv = document.getElementById("result");
const resultContent = document.getElementById("resultContent");
const resetBtn = document.getElementById("resetBtn");
const emptyMessage = document.getElementById("emptyMessage");

// Fonction pour calculer les scores
function calculateScores() {
  const scores = {
    confort: 0,
    resistance: 0,
    exploration: 0,
    action: 0,
  };

  // Parcourir toutes les cases cochées
  const checkboxes = form.querySelectorAll('input[type="checkbox"]');
  checkboxes.forEach((checkbox) => {
    if (checkbox.checked) {
      const zoneName = checkbox.name;
      scores[zoneName]++;
    }
  });

  return scores;
}

// Fonction pour trouver le profil dominant
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

// Fonction pour afficher le résultat
function displayResult() {
  const scores = calculateScores();
  const { profile, total } = getDominantProfile(scores);

  // Si aucune case n'est cochée
  if (total === 0) {
    emptyMessage.classList.remove("hidden");
    resultDiv.classList.add("hidden");
    return;
  }

  emptyMessage.classList.add("hidden");

  // Afficher le résultat
  const profileData = profiles[profile];
  resultContent.innerHTML = `
        <strong>${profileData.title}</strong>
        <p>${profileData.description}</p>
    `;

  resultDiv.style.background = `linear-gradient(135deg, ${profileData.color} 0%, ${adjustColor(profileData.color, -30)} 100%)`;
  resultDiv.classList.remove("hidden");

  // Scroll vers le résultat
  resultDiv.scrollIntoView({ behavior: "smooth", block: "nearest" });
}

// Fonction pour ajuster la couleur (rendre plus sombre)
function adjustColor(color, amount) {
  const num = parseInt(color.replace("#", ""), 16);
  const r = Math.max(0, (num >> 16) + amount);
  const g = Math.max(0, ((num >> 8) & 0x00ff) + amount);
  const b = Math.max(0, (num & 0x0000ff) + amount);
  return "#" + ((r << 16) | (g << 8) | b).toString(16).padStart(6, "0");
}

// Fonction pour réinitialiser le quiz
function resetQuiz() {
  const checkboxes = form.querySelectorAll('input[type="checkbox"]');
  checkboxes.forEach((checkbox) => {
    checkbox.checked = false;
  });
  resultDiv.classList.add("hidden");
  emptyMessage.classList.add("hidden");
}

// Écouter les changements sur les checkboxes
form.addEventListener("change", displayResult);

// Écouter le clic sur le bouton reset
resetBtn.addEventListener("click", resetQuiz);
