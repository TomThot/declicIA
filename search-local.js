/**
 * Moteur de recherche local (front-only)
 * - index statique de pages/sections/outils
 * - recherche instantanée avec scoring simple
 * - insertion contextuelle:
 *   - header desktop
 *   - menu burger mobile (home)
 *   - sidebar (pages article)
 */
(function () {
  // Garde-fou: empêche le montage multiple du même composant.
  if (window.__decliciaLocalSearchMounted) {
    return;
  }
  window.__decliciaLocalSearchMounted = true;

  const scriptTag = document.currentScript;
  const scriptUrl = scriptTag ? new URL(scriptTag.src, window.location.href) : null;
  const appBase = scriptUrl ? new URL("./", scriptUrl).href : window.location.origin + "/";

  const SEARCH_DATA = [
    { title: "Accueil", path: "index.html", keywords: "home accueil declicia" },
    { title: "Profil face a l'IA", path: "index.html#profil", keywords: "profil quiz diagnostic" },
    { title: "L'IA c'est quoi ?", path: "LIA_cest_quoi/indexIA.html", keywords: "ia definition fonctionnement neurone ethique" },
    { title: "Definition IA", path: "LIA_cest_quoi/indexIA.html#Definition", keywords: "definition ia" },
    { title: "Fonctionnement IA", path: "LIA_cest_quoi/indexIA.html#Fonctionnement", keywords: "fonctionnement llm token" },
    { title: "Types d'IA", path: "LIA_cest_quoi/indexIA.html#Type", keywords: "types ia" },
    { title: "Neurone artificiel", path: "LIA_cest_quoi/indexIA.html#neurone", keywords: "neurone perceptron" },
    { title: "Cadre et defis", path: "Cadre_et_défit/IndexCadreDefi.html", keywords: "cadre defis dette cognitive charte" },
    { title: "Vers une dette cognitive", path: "Cadre_et_défit/IndexCadreDefi.html#dette", keywords: "dette cognitive mit" },
    { title: "Pourquoi l'IA en classe", path: "Cadre_et_défit/IndexCadreDefi.html#pourquoi", keywords: "pourquoi classe" },
    { title: "Cadre d'usage de l'IA", path: "Cadre_et_défit/IndexCadreDefi.html#cadre", keywords: "cadre usage institutionnel" },
    { title: "Les defis a relever", path: "Cadre_et_défit/IndexCadreDefi.html#defi", keywords: "defis risques" },
    { title: "Charte d'utilisation", path: "Cadre_et_défit/IndexCadreDefi.html#charte", keywords: "charte utilisation ia" },
    { title: "Outils pour la classe", path: "Outils_Classe/IndexOutils.html", keywords: "outils classe ressources" },
    { title: "Galerie des outils", path: "Carousel_outilsIA/Carousel_index.html", keywords: "carousel galerie outils ia" },
    { title: "L'art du prompt", path: "Carousel_outilsIA/lart_du_prompt/index_art_du_prompt.html", keywords: "prompt actif rispo" },
    { title: "Quelle IA choisir", path: "Carousel_outilsIA/quelle_IA_choisir/index_quelle_IA_choisir.html", keywords: "comparatif choisir ia" },
    { title: "P2IA", path: "Carousel_outilsIA/P2IA/index_P2IA.html", keywords: "p2ia cycle 3" },
    { title: "ChatMD", path: "Carousel_outilsIA/chatMD/index_chatMD.html", keywords: "chatbot chatmd" },
    { title: "Caramel", path: "Carousel_outilsIA/caramel/index_caramel.html", keywords: "h5p caramel moodle elea" },
    { title: "DysFacile", path: "Carousel_outilsIA/dysfacile/index_dysfacile.html", keywords: "dys dysfacile accessibilite" },
    { title: "NotebookLM", path: "Carousel_outilsIA/notebookLM/index_notebookLM.html", keywords: "notebooklm podcast quiz" },
    { title: "Assistant Prompt", path: "Assistant_prompt/IndexPrompt.html", keywords: "assistant prompt actif" }
  ];

  // Normalise les chaînes (accents, casse, espaces) pour une recherche robuste.
  function normalize(value) {
    return String(value || "")
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .trim();
  }

  // Convertit un chemin projet en URL absolue.
  function absoluteHref(path) {
    return new URL(path, appBase).href;
  }

  // Scoring simple par pertinence (titre > mots-clés > chemin).
  function scoreEntry(entry, query) {
    const text = normalize(entry.title + " " + entry.keywords + " " + entry.path);
    if (!text.includes(query)) return -1;
    let score = 0;
    if (normalize(entry.title).startsWith(query)) score += 4;
    if (normalize(entry.title).includes(query)) score += 3;
    if (normalize(entry.keywords).includes(query)) score += 2;
    if (normalize(entry.path).includes(query)) score += 1;
    return score;
  }

  // Fabrique le DOM du composant de recherche.
  function createSearchUi() {
    const container = document.createElement("div");
    container.className = "local-search";
    container.innerHTML =
      '<label class="local-search__label" for="localSearchInput">Rechercher</label>' +
      '<input id="localSearchInput" class="local-search__input" type="search" placeholder="Rechercher une page ou un outil..." autocomplete="off" />' +
      '<div class="local-search__results" hidden></div>';
    return container;
  }

  // Attache tous les comportements d'interaction (input, escape, clic externe).
  function bindSearch(container) {
    const input = container.querySelector(".local-search__input");
    const results = container.querySelector(".local-search__results");

    // Masque et vide la liste de résultats.
    function closeResults() {
      results.hidden = true;
      results.innerHTML = "";
    }

    // Affiche les résultats classés (ou message vide).
    function openResults(items) {
      if (!items.length) {
        results.innerHTML = '<p class="local-search__empty">Aucun resultat.</p>';
        results.hidden = false;
        return;
      }

      results.innerHTML = items
        .map(
          (item) =>
            '<a class="local-search__item" href="' +
            absoluteHref(item.path) +
            '">' +
            item.title +
            '<span class="local-search__path">' +
            item.path +
            "</span></a>"
        )
        .join("");
      results.hidden = false;
    }

    input.addEventListener("input", function () {
      const query = normalize(input.value);
      if (query.length < 2) {
        closeResults();
        return;
      }

      const ranked = SEARCH_DATA
        .map(function (entry) {
          return { entry: entry, score: scoreEntry(entry, query) };
        })
        .filter(function (row) {
          return row.score >= 0;
        })
        .sort(function (a, b) {
          return b.score - a.score;
        })
        .slice(0, 8)
        .map(function (row) {
          return row.entry;
        });

      openResults(ranked);
    });

    input.addEventListener("keydown", function (event) {
      if (event.key === "Escape") {
        closeResults();
      }
    });

    document.addEventListener("click", function (event) {
      if (!container.contains(event.target)) {
        closeResults();
      }
    });
  }

  // Détermine où monter la recherche selon le contexte de page.
  function mountSearch() {
    const targetHeader = document.querySelector(".containerHeader");
    const targetSidebar = document.querySelector(".sidebar");
    const targetNav = document.querySelector(".nav");
    const targetBurger = document.getElementById("burger");

    if (targetHeader && targetNav) {
      const search = createSearchUi();
      const mobileMq = window.matchMedia("(max-width: 768px)");

      // Home: bascule dynamique entre header (desktop) et menu burger (mobile).
      function placeSearch() {
        const isMobile = mobileMq.matches;

        // Ne conserve qu'une seule instance visible du composant.
        document.querySelectorAll(".local-search").forEach(function (node) {
          if (node !== search) node.remove();
        });
        search.classList.remove("local-search--header", "local-search--navdrawer");

        // Mobile: la recherche reste dans le panneau de navigation.
        if (isMobile) {
          document.body.classList.add("search-mobile-nav");
          search.classList.add("local-search--navdrawer");
          const navList = targetNav.querySelector(".nav-list");
          if (navList) {
            targetNav.insertBefore(search, navList);
          } else {
            targetNav.appendChild(search);
          }
          return;
        }

        // Desktop: la recherche reste dans le header.
        document.body.classList.remove("search-mobile-nav");
        search.classList.add("local-search--header");
        targetHeader.appendChild(search);
      }

      bindSearch(search);
      placeSearch();

      if (targetBurger) {
        targetBurger.addEventListener("click", function () {
          window.requestAnimationFrame(placeSearch);
        });
      }

      const navObserver = new MutationObserver(placeSearch);
      navObserver.observe(targetNav, { attributes: true, attributeFilter: ["class"] });

      window.addEventListener("resize", placeSearch);
      return;
    }

    if (targetHeader) {
      const search = createSearchUi();
      search.classList.add("local-search--header");
      targetHeader.appendChild(search);
      bindSearch(search);
      return;
    }

    if (targetSidebar) {
      const search = createSearchUi();
      search.classList.add("local-search--sidebar");
      targetSidebar.appendChild(search);
      bindSearch(search);
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", mountSearch);
  } else {
    mountSearch();
  }
})();
