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
  const sections = document.querySelectorAll('.collapsible-section');
  
  sections.forEach(section => {
    const h2 = section.querySelector('h2');
    
    h2.addEventListener('click', function() {
      section.classList.toggle('open');
    });
  });
});

//----------------------------------------------------------
// gestion du champ où on colle l'URL du markdown ChatMD
//----------------------------------------------------------
document.querySelectorAll(".clickable-row").forEach(row => {
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
    //Attention à encoder l'url correctement
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

//---------------------------------------------------------
// fonction appelée au click sur le bouton pour le widget
//---------------------------------------------------------
 let chatbotVisible = false;
        let chatbotCharge = false;

        function toggleChatbot() {
            const btn = document.getElementById('btnChatbot');

            // Premier clic : on charge le script
            if (!chatbotCharge) {
                const script = document.createElement('script');
                script.id = 'chatmdWidgetScript';
                script.src = 'https://chatmd.forge.apps.education.fr/widget.min.js';
                script.setAttribute('data-chatbot', 'https://codimd.apps.education.fr/s/imCNpLNcc');

                script.onload = function () {
                    chatbotCharge = true;
                    chatbotVisible = true;
                    btn.textContent = '❌ Fermer le widget';
                };

                document.body.appendChild(script);
                return;
            }

            // Clics suivants : on cache ou montre le widget
            const widget = document.getElementById('chatmdWidget');

            if (widget) {
                if (chatbotVisible) {
                    widget.style.display = 'none';
                    chatbotVisible = false;
                    btn.textContent = '💬 Ouvrir le widget';
                } else {
                    widget.style.display = '';
                    chatbotVisible = true;
                    btn.textContent = '❌ Fermer le widget';
                }
            }
        }