// IIFE (Immediately Invoked Function Expression):
// - évite de polluer l'espace global (window)
// - permet d'exécuter immédiatement la logique de thème
(function () {
  // Clé unique utilisée pour mémoriser le thème utilisateur dans le navigateur.
  const THEME_KEY = "declicia-theme";
  // Référence racine <html> pour piloter le thème via data-theme.
  const root = document.documentElement;

  // Détermine le thème initial à appliquer.
  // Ordre de priorité:
  // 1) préférence explicitement enregistrée en localStorage
  // 2) préférence système (prefers-color-scheme)
  // 3) fallback implicite: "light"
  function getPreferredTheme() {
    const savedTheme = localStorage.getItem(THEME_KEY);
    if (savedTheme === "light" || savedTheme === "dark") {
      return savedTheme;
    }
    return window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
  }

  // Met à jour le logo du header selon le thème.
  // Cas gérés:
  // - remplacement direct si l'URL contient l'un des fichiers attendus
  // - fallback via attributs data-theme-logo-dark / data-theme-logo-light
  // Si aucun logo n'est trouvé, on sort sans erreur.
  function swapHeaderLogo(isDark) {
    const headerLogoImg = document.querySelector(".logo img");
    if (!headerLogoImg) return;

    // Récupère la source actuelle du logo.
    const currentSrc = headerLogoImg.getAttribute("src") || "";

    // Si le logo clair est détecté dans l'URL, bascule vers le logo sombre.
    if (currentSrc.includes("logo_noir_50px.png")) {
      headerLogoImg.setAttribute(
        "src",
        currentSrc.replace("logo_noir_50px.png", "logo_blanc_50.png")
      );
      return;
    }

    // Si le logo sombre est détecté dans l'URL, bascule vers le logo clair.
    if (currentSrc.includes("logo_blanc_50.png")) {
      headerLogoImg.setAttribute(
        "src",
        currentSrc.replace("logo_blanc_50.png", "logo_noir_50px.png")
      );
      return;
    }

    // Fallback générique: utilise des URLs explicitement fournies via data-attributes.
    // Utile si les noms de fichiers changent ou si plusieurs variantes existent.
    if (headerLogoImg.dataset.themeLogoDark && headerLogoImg.dataset.themeLogoLight) {
      headerLogoImg.setAttribute(
        "src",
        isDark ? headerLogoImg.dataset.themeLogoDark : headerLogoImg.dataset.themeLogoLight
      );
    }
  }

  // Applique un thème sur la page courante:
  // - met data-theme sur <html> (consommé par le CSS)
  // - adapte le logo du header
  // - met à jour l'accessibilité et le libellé du bouton de bascule
  function applyTheme(theme) {
    const isDark = theme === "dark";
    root.dataset.theme = isDark ? "dark" : "light";
    swapHeaderLogo(isDark);

    // Le toggle n'existe pas forcément sur toutes les pages.
    const themeToggle = document.getElementById("themeToggle");
    if (!themeToggle) return;

    // ARIA: indique l'état actuel du switch (true = sombre actif).
    themeToggle.setAttribute("aria-checked", String(isDark));
    // ARIA: annonce l'action de la bascule (vers quel thème on va).
    themeToggle.setAttribute(
      "aria-label",
      isDark
        ? "Basculer vers le thème clair"
        : "Basculer vers le thème sombre"
    );

    // Le texte visible du bouton reste fixe (défini dans le HTML/CSS).
    // On ne le modifie pas ici pour éviter une logique de libellé ambiguë.
  }

  // Enregistre la préférence utilisateur puis applique immédiatement le thème.
  function setTheme(theme) {
    localStorage.setItem(THEME_KEY, theme);
    applyTheme(theme);
  }

  // Applique le thème le plus tôt possible pour réduire le "flash" visuel
  // (FOUC entre clair et sombre au chargement initial).
  applyTheme(getPreferredTheme());

  // Une fois le DOM prêt, branche les interactions utilisateur.
  window.addEventListener("DOMContentLoaded", function () {
    const themeToggle = document.getElementById("themeToggle");
    if (!themeToggle) return;

    // Alterne dark <-> light à chaque clic sur le toggle.
    themeToggle.addEventListener("click", function () {
      const nextTheme = root.dataset.theme === "dark" ? "light" : "dark";
      setTheme(nextTheme);
    });
  });

  // Synchronisation inter-onglets:
  // si l'utilisateur change le thème dans un autre onglet, celui-ci se met à jour.
  window.addEventListener("storage", function (event) {
    if (event.key === THEME_KEY && (event.newValue === "light" || event.newValue === "dark")) {
      applyTheme(event.newValue);
    }
  });
})();
