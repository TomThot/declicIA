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



// fermeture de section par clic sur flèche
document.addEventListener('DOMContentLoaded', function() {
  const sections = document.querySelectorAll('.collapsible-section');
  
  sections.forEach(section => {
    const h2 = section.querySelector('h2');
    
    h2.addEventListener('click', function() {
      section.classList.toggle('open');
    });
  });
});