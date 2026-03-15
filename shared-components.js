/**
 * Shared Components
 * Injecte les blocs communs via placeholders HTML:
 * - sidebar (menu + liens + toggle thème)
 * - footer standard
 * - shared-components.css (styles communs sidebar + footer)
 *
 * Utilisation côté HTML:
 * <div data-shared-sidebar data-base="../" data-current="lia"></div>
 * <div data-shared-footer data-base="../" data-current="lia"></div>
 *
 * Le CSS partagé est injecté automatiquement — inutile de le charger manuellement.
 */
(function () {

  // Injecte shared-components.css dans le <head> si ce n'est pas déjà fait.
  // La base est déduite depuis le premier placeholder trouvé sur la page.
  function injectSharedCSS() {
    if (document.getElementById('shared-components-css')) return;
    var base = './';
    var firstPlaceholder = document.querySelector('[data-shared-sidebar],[data-shared-footer]');
    if (firstPlaceholder && firstPlaceholder.dataset.base) {
      base = firstPlaceholder.dataset.base;
    }
    var link = document.createElement('link');
    link.id = 'shared-components-css';
    link.rel = 'stylesheet';
    link.href = base + 'shared-components.css';
    document.head.appendChild(link);
  }
  // Crée un lien de navigation et marque la page courante.
  function createNavLink(base, current, key, label, path) {
    if (current === key) {
      return '<a href="' + base + path + '" aria-current="page" class="is-current">' + label + "</a>";
    }
    return '<a href="' + base + path + '">' + label + "</a>";
  }

  // Remplace le placeholder sidebar par le HTML final.
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
      createNavLink(base, current, "outils", "Outils pour la classe", "Carousel_outilsIA/Carousel_index.html") +
      '  <button id="themeToggle" class="theme-toggle sidebar-theme-toggle" type="button" role="switch" aria-checked="false" aria-label="Basculer le thème" title="Basculer le thème">' +
      '    <span class="theme-toggle__track" aria-hidden="true"><span class="theme-toggle__thumb"></span></span>' +
      '    <span class="theme-toggle__label">Thème</span>' +
      "  </button>" +
      "</div>";

    placeholder.outerHTML = sidebarHtml;
    ensureLocalSearch(base);
  }

  // Remplace le placeholder footer par le HTML final.
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
      '          <li><a href="' + base + 'Carousel_outilsIA/Carousel_index.html">Outils pour la classe</a></li>' +
      "        </ul>" +
      "      </div>" +
      '      <div class="footer-section">' +
      "        <h3>Ressources</h3>" +
      '        <ul class="footer-links">' +
      '          <li><a href="' + base + 'index.html#profil">Profil face à l\'IA</a></li>' +
      '          <li><a href="' + base + 'LIA_cest_quoi/indexIA.html#Definition">Définitions IA</a></li>' +
      '          <li><a href="' + base + 'Cadre_et_défit/IndexCadreDefi.html#cadre2">Cadre institutionnel</a></li>' +
      '          <li><a href="' + base + 'Carousel_outilsIA/Carousel_index.html">Outils recommandés</a></li>' +
      "          <li><a href=\"#\">Formations</a></li>" +
      "        </ul>" +
      "      </div>" +
      '      <div class="footer-section">' +
      "        <h3>Contact & Communauté</h3>" +
      "        <p>Envie d'échanger, de contribuer ou de partager vos expériences ?</p>" +
      '        <div class="social-links">' +
      '          <a href="' + base + 'Contact/contactIndex.html" class="social-link" title="Contact">✉</a>' +
      '          <a href="https://github.com/" class="social-link" title="GitHub" aria-label="GitHub">' +
      '            <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor" aria-hidden="true">' +
      '              <path d="M12 .5a12 12 0 0 0-3.79 23.39c.6.11.82-.26.82-.58v-2.02c-3.34.73-4.04-1.42-4.04-1.42-.55-1.38-1.33-1.75-1.33-1.75-1.09-.74.08-.72.08-.72 1.2.08 1.83 1.22 1.83 1.22 1.08 1.82 2.83 1.3 3.52.99.11-.77.42-1.3.77-1.6-2.67-.3-5.47-1.32-5.47-5.89 0-1.3.47-2.36 1.23-3.2-.12-.3-.53-1.53.12-3.19 0 0 1.01-.32 3.3 1.22a11.6 11.6 0 0 1 6 0c2.29-1.54 3.29-1.22 3.29-1.22.66 1.66.25 2.89.13 3.19.77.84 1.23 1.9 1.23 3.2 0 4.58-2.8 5.59-5.48 5.89.43.37.82 1.1.82 2.23v3.3c0 .32.22.7.83.58A12 12 0 0 0 12 .5Z"/>' +
      "            </svg>" +
      "          </a>" +
      '          <a href="https://www.linkedin.com/in/thomas-brouillet-5371a63a0" class="social-link" title="LinkedIn" aria-label="LinkedIn">' +
      '            <svg viewBox="0 0 16 16" width="22" height="22" fill="currentColor" aria-hidden="true">' +
      '              <path d="M0 1.146C0 .513.526 0 1.175 0h13.65C15.474 0 16 .513 16 1.146v13.708c0 .633-.526 1.146-1.175 1.146H1.175C.526 16 0 15.487 0 14.854V1.146zM4.943 13.5V6.169H2.542V13.5h2.401zM3.742 5.17c.837 0 1.358-.554 1.358-1.248-.015-.71-.521-1.248-1.342-1.248-.822 0-1.358.538-1.358 1.248 0 .694.521 1.248 1.327 1.248h.015zM13.458 13.5V9.522c0-2.13-1.136-3.122-2.65-3.122-1.22 0-1.767.67-2.072 1.14v-1.37H6.336c.03.908 0 7.33 0 7.33h2.401V9.406c0-.22.016-.44.081-.597.178-.44.584-.895 1.266-.895.893 0 1.251.675 1.251 1.665V13.5h2.123z"/>' +
      "            </svg>" +
      "          </a>" +
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

  // Charge dynamiquement le moteur de recherche local si nécessaire.
  function ensureLocalSearch(base) {
    if (window.__decliciaLocalSearchMounted || window.__decliciaSearchLocalLoading) return;
    if (document.querySelector('script[data-declicia-search-local]')) return;

    window.__decliciaSearchLocalLoading = true;
    const script = document.createElement("script");
    script.dataset.decliciaSearchLocal = "true";
    script.src = new URL(base + "search-local.js", window.location.href).href;
    script.onload = function () {
      window.__decliciaSearchLocalLoading = false;
    };
    script.onerror = function () {
      window.__decliciaSearchLocalLoading = false;
    };
    document.head.appendChild(script);
  }

  // Monte tous les composants partagés présents sur la page.
  function mountSharedComponents() {
    injectSharedCSS();
    document.querySelectorAll("[data-shared-sidebar]").forEach(renderSidebar);
    document.querySelectorAll("[data-shared-footer]").forEach(renderFooter);
    document.dispatchEvent(new Event("declicia:components-mounted"));
  }

  // Évite les doubles montages en cas de chargements multiples.
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
