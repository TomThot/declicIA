(function () {
  function createNavLink(base, current, key, label, path) {
    if (current === key) {
      return '<a href="#" aria-current="page">' + label + "</a>";
    }
    return '<a href="' + base + path + '">' + label + "</a>";
  }

  function renderSidebar(placeholder) {
    const base = placeholder.dataset.base || "./";
    const current = placeholder.dataset.current || "";

    const sidebarHtml =
      '<nav class="menu">' +
      '  <div class="menu-toggle">☰</div>' +
      "</nav>" +
      '<div class="sidebar">' +
      '  <div class="icone">' +
      '    <img src="' + base + 'Images/logo_blanc_150px.png" alt="logo" />' +
      "  </div>" +
      createNavLink(base, current, "home", "Accueil", "index.html") +
      createNavLink(base, current, "lia", "L'IA c'est quoi ?", "LIA_cest_quoi/indexIA.html") +
      createNavLink(base, current, "cadre", "Cadre et défis", "Cadre_et_défit/IndexCadreDefi.html") +
      createNavLink(base, current, "outils", "Outils pour la classe", "Outils_Classe/IndexOutils.html") +
      '  <button id="themeToggle" class="theme-toggle sidebar-theme-toggle" type="button" role="switch" aria-checked="false" aria-label="Basculer le thème" title="Basculer le thème">' +
      '    <span class="theme-toggle__track" aria-hidden="true"><span class="theme-toggle__thumb"></span></span>' +
      '    <span class="theme-toggle__label">Thème</span>' +
      "  </button>" +
      "</div>";

    placeholder.outerHTML = sidebarHtml;
  }

  function renderFooter(placeholder) {
    const base = placeholder.dataset.base || "./";
    const year = new Date().getFullYear();

    const footerHtml =
      "<footer>" +
      '  <div class="footer-container">' +
      '    <div class="footer-content">' +
      '      <div class="footer-section">' +
      '        <div class="footer-logo"><span class="footer-logo-text">DéclicIA</span></div>' +
      "        <p>Des notions et des outils sur l'intelligence artificielle dans l'éducation. Un site dédié aux enseignants pour comprendre et intégrer l'IA de manière réfléchie et responsable.</p>" +
      "      </div>" +
      '      <div class="footer-section">' +
      "        <h3>Navigation</h3>" +
      '        <ul class="footer-links">' +
      '          <li><a href="' + base + 'index.html">Accueil</a></li>' +
      '          <li><a href="' + base + 'LIA_cest_quoi/indexIA.html">L\'IA c\'est quoi ?</a></li>' +
      '          <li><a href="' + base + 'Cadre_et_défit/IndexCadreDefi.html">Cadre et défis</a></li>' +
      '          <li><a href="' + base + 'Outils_Classe/IndexOutils.html">Outils pour la classe</a></li>' +
      "        </ul>" +
      "      </div>" +
      '      <div class="footer-section">' +
      "        <h3>Ressources</h3>" +
      '        <ul class="footer-links">' +
      '          <li><a href="' + base + 'index.html#profil">Profil face à l\'IA</a></li>' +
      '          <li><a href="' + base + 'LIA_cest_quoi/indexIA.html#Definition">Définitions IA</a></li>' +
      '          <li><a href="' + base + 'Cadre_et_défit/IndexCadreDefi.html#cadre2">Cadre institutionnel</a></li>' +
      "          <li><a href=\"#\">Outils recommandés</a></li>" +
      "          <li><a href=\"#\">Formations</a></li>" +
      "        </ul>" +
      "      </div>" +
      '      <div class="footer-section">' +
      "        <h3>Contact & Communauté</h3>" +
      "        <p>Envie d'échanger, de contribuer ou de partager vos expériences ?</p>" +
      '        <div class="social-links">' +
      '          <a href="mailto:tom.thot@gmail.com" class="social-link" title="Email">✉</a>' +
      '          <a href="https://github.com/" class="social-link" title="GitHub"><i style="font-size: 24px" class="fa fa-github"></i></a>' +
      '          <a href="#" class="social-link" title="Twitter">🐦</a>' +
      "        </div>" +
      "      </div>" +
      "    </div>" +
      '    <div class="footer-bottom">' +
      "      <p>&copy; " + year + " DéclicIA - Tous droits réservés</p>" +
      '      <p class="footer-credits">Conçu avec passion pour l\'éducation et l\'innovation pédagogique</p>' +
      "      <p>@Thomas BROUILLET</p>" +
      "    </div>" +
      "  </div>" +
      "</footer>";

    placeholder.outerHTML = footerHtml;
  }

  function mountSharedComponents() {
    document.querySelectorAll("[data-shared-sidebar]").forEach(renderSidebar);
    document.querySelectorAll("[data-shared-footer]").forEach(renderFooter);
  }

  let mounted = false;
  function safeMount() {
    if (mounted) return;
    mounted = true;
    mountSharedComponents();
  }

  safeMount();
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", safeMount);
  }
})();
