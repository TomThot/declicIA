(function () {
  const THEME_KEY = "declicia-theme";
  const root = document.documentElement;

  function getPreferredTheme() {
    const savedTheme = localStorage.getItem(THEME_KEY);
    if (savedTheme === "light" || savedTheme === "dark") {
      return savedTheme;
    }
    return window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
  }

  function swapHeaderLogo(isDark) {
    const headerLogoImg = document.querySelector(".logo img");
    if (!headerLogoImg) return;

    const currentSrc = headerLogoImg.getAttribute("src") || "";
    if (currentSrc.includes("logo_noir_50px.png")) {
      headerLogoImg.setAttribute(
        "src",
        currentSrc.replace("logo_noir_50px.png", "logo_blanc_50.png")
      );
      return;
    }

    if (currentSrc.includes("logo_blanc_50.png")) {
      headerLogoImg.setAttribute(
        "src",
        currentSrc.replace("logo_blanc_50.png", "logo_noir_50px.png")
      );
      return;
    }

    if (headerLogoImg.dataset.themeLogoDark && headerLogoImg.dataset.themeLogoLight) {
      headerLogoImg.setAttribute(
        "src",
        isDark ? headerLogoImg.dataset.themeLogoDark : headerLogoImg.dataset.themeLogoLight
      );
    }
  }

  function applyTheme(theme) {
    const isDark = theme === "dark";
    root.dataset.theme = isDark ? "dark" : "light";
    swapHeaderLogo(isDark);

    const themeToggle = document.getElementById("themeToggle");
    if (!themeToggle) return;

    const label = themeToggle.querySelector(".theme-toggle__label");
    themeToggle.setAttribute("aria-checked", String(isDark));
    themeToggle.setAttribute(
      "aria-label",
      isDark
        ? "Basculer vers le thème clair"
        : "Basculer vers le thème sombre"
    );

    if (label) {
      label.textContent = isDark ? "Clair" : "Sombre";
    }
  }

  function setTheme(theme) {
    localStorage.setItem(THEME_KEY, theme);
    applyTheme(theme);
  }

  // Appliquer tôt pour limiter le flash clair/sombre
  applyTheme(getPreferredTheme());

  window.addEventListener("DOMContentLoaded", function () {
    const themeToggle = document.getElementById("themeToggle");
    if (!themeToggle) return;

    themeToggle.addEventListener("click", function () {
      const nextTheme = root.dataset.theme === "dark" ? "light" : "dark";
      setTheme(nextTheme);
    });
  });

  window.addEventListener("storage", function (event) {
    if (event.key === THEME_KEY && (event.newValue === "light" || event.newValue === "dark")) {
      applyTheme(event.newValue);
    }
  });
})();
