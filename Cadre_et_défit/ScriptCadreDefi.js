const menuToggle = document.querySelector(".menu-toggle");
const menuBar = document.querySelector(".menu");
const sidebar = document.querySelector(".sidebar");

menuToggle.addEventListener("click", (e) => {
  e.stopPropagation(); // Empêche la propagation du clic
  menuBar.classList.toggle("active");
  sidebar.classList.toggle("active");
});

// Fermer la sidebar en cliquant ailleurs
document.addEventListener("click", (e) => {
  // Vérifier si le clic n'est pas sur la sidebar ou le bouton menu
  if (!sidebar.contains(e.target) && !menuToggle.contains(e.target)) {
    menuBar.classList.remove("active");
    sidebar.classList.remove("active");
  }
});

// Empêcher la fermeture si on clique dans la sidebar
sidebar.addEventListener("click", (e) => {
  e.stopPropagation();
});


// fermeture de section par clic sur flèche
document.addEventListener('DOMContentLoaded', function() {
  // Sélectionne toutes les sections avec la classe collapsible-section
  const sections = document.querySelectorAll('.collapsible-section');
  
  sections.forEach(section => {
    const h2 = section.querySelector('h2');
    const content = section.querySelector('.section-content');
    const arrow = section.querySelector('.toggle-arrow');
    
    h2.addEventListener('click', function() {
      content.classList.toggle('hidden');
      arrow.classList.toggle('collapsed');
    });
  });
});