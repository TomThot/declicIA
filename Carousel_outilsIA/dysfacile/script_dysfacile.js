const menuToggle = document.querySelector(".menu-toggle");
const menuBar = document.querySelector(".menu");
const sidebar = document.querySelector(".sidebar");

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

document.addEventListener("DOMContentLoaded", () => {
  const sections = document.querySelectorAll(".collapsible-section");
  sections.forEach((section) => {
    const h2 = section.querySelector("h2");
    if (!h2) return;
    h2.addEventListener("click", () => section.classList.toggle("open"));
  });
});
