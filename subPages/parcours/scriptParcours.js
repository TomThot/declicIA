/**
 * scriptParcours.js
 * DéclicIA — Parcours de formation progressif
 */

/*
 * ================================================================
 * MENU LATÉRAL (injection shared-components.js)
 * Ouvre/ferme la sidebar via le bouton burger et ferme au clic externe.
 * ================================================================
 */
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




(function () {
  'use strict';

  // ── Persistance de la progression (localStorage) ──────────────────────────
  const STORAGE_KEY = 'declicia-parcours-progress';

  function loadProgress() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY)) || {};
    } catch { return {}; }
  }

  function saveProgress(data) {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(data)); } catch {}
  }

  // ── Mise à jour de la barre de navigation ─────────────────────────────────
  function updateNavProgress(progress) {
    const total = 5;
    const done = Object.values(progress).filter(Boolean).length;
    const fill = document.getElementById('progressFill');
    if (fill) fill.style.width = `${(done / total) * 100}%`;

    for (let s = 1; s <= total; s++) {
      const navItem = document.querySelector(`.step-nav-item[data-step="${s}"]`);
      if (!navItem) continue;
      navItem.classList.toggle('done', !!progress[s]);
    }

    // Afficher les félicitations si tout est coché
    const congrats = document.getElementById('congratsSection');
    if (congrats) congrats.classList.toggle('show', done === total);
  }

  // ── Initialisation des checkboxes ─────────────────────────────────────────
  function initCheckboxes() {
    const progress = loadProgress();
    const checkboxes = document.querySelectorAll('.step-check');

    checkboxes.forEach(cb => {
      const step = parseInt(cb.dataset.step, 10);
      cb.checked = !!progress[step];

      cb.addEventListener('change', () => {
        progress[step] = cb.checked;
        saveProgress(progress);
        updateNavProgress(progress);
      });
    });

    updateNavProgress(progress);
  }

  // ── Scroll vers une étape ─────────────────────────────────────────────────
  window.scrollToStep = function (stepNum) {
    const target = document.getElementById(`step-${stepNum}`);
    if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  // ── Intersection Observer — apparition au scroll + nav active ─────────────
  function initScrollAnimations() {
    const sections = document.querySelectorAll('.step-section');

    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');

            // Marquer l'étape courante dans la nav
            const step = entry.target.dataset.step;
            document.querySelectorAll('.step-nav-item').forEach(item => {
              item.classList.remove('active');
            });
            const navItem = document.querySelector(`.step-nav-item[data-step="${step}"]`);
            if (navItem) navItem.classList.add('active');
          }
        });
      },
      { threshold: 0.15, rootMargin: '-80px 0px 0px 0px' }
    );

    sections.forEach(s => observer.observe(s));
  }

  // ── Init ──────────────────────────────────────────────────────────────────
  document.addEventListener('DOMContentLoaded', () => {
    initCheckboxes();
    initScrollAnimations();
  });

})();
