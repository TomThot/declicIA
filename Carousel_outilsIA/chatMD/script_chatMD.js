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

    h2.addEventListener("click", () => {
      section.classList.toggle("open");
    });
  });

  document.querySelectorAll(".clickable-row").forEach((row) => {
    row.addEventListener("click", () => {
      window.open(row.dataset.href, "_blank", "noopener,noreferrer");
    });
  });

  const chatmdUrlInput = document.querySelector("#chatmd-url-input");
  const chatmdOpenBtn = document.querySelector("#chatmd-open-btn");

  if (chatmdUrlInput && chatmdOpenBtn) {
    const openChatMdFromInput = () => {
      const rawUrl = chatmdUrlInput.value.trim();
      if (!rawUrl) return;

      const cleanedUrl = rawUrl.replace(/^#/, "");
      const targetUrl = `https://chatmd.forge.apps.education.fr/#${cleanedUrl}`;
      window.open(targetUrl, "_blank", "noopener,noreferrer");
    };

    chatmdOpenBtn.addEventListener("click", openChatMdFromInput);
    chatmdUrlInput.addEventListener("keydown", (event) => {
      if (event.key === "Enter") {
        event.preventDefault();
        openChatMdFromInput();
      }
    });
  }
});

let chatbotVisible = false;
let chatbotCharge = false;

function toggleChatbot() {
  const btn = document.getElementById("btnChatbot");

  if (!chatbotCharge) {
    const script = document.createElement("script");
    script.id = "chatmdWidgetScript";
    script.src = "https://chatmd.forge.apps.education.fr/widget.min.js";
    script.setAttribute("data-chatbot", "https://codimd.apps.education.fr/s/imCNpLNcc");

    script.onload = function () {
      chatbotCharge = true;
      chatbotVisible = true;
      btn.textContent = "❌ Fermer le widget";
    };

    document.body.appendChild(script);
    return;
  }

  const widget = document.getElementById("chatmdWidget");

  if (widget) {
    if (chatbotVisible) {
      widget.style.display = "none";
      chatbotVisible = false;
      btn.textContent = "💬 Ouvrir le widget";
    } else {
      widget.style.display = "";
      chatbotVisible = true;
      btn.textContent = "❌ Fermer le widget";
    }
  }
}
