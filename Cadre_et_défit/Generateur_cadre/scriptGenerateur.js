/**
 * scriptGenerateur.js
 * Logique du générateur de cadre d'usage — DéclicIA
 *
 * Dépendances (à charger AVANT ce script dans le HTML) :
 *   - data-cadre.js  → fournit DISCIPLINES, NIVEAUX, USAGES_AUTORISES,
 *                       USAGES_INTERDITS, OUTILS
 *
 * Fonctionnement général :
 *   1. Au chargement, on remplit dynamiquement le formulaire
 *      à partir des données de data-cadre.js
 *   2. L'enseignant remplit le formulaire et clique sur "Générer"
 *   3. Une fiche HTML est construite et affichée sous le formulaire
 *   4. Deux boutons permettent d'imprimer ou de copier la fiche
 *
 * POUR REVENIR EN ARRIÈRE :
 *   - Supprimer le dossier Generateur_cadre/ en entier
 *   - Retirer le lien ajouté dans IndexCadreDefi.html (voir commentaire là-bas)
 *   - Aucun autre fichier du projet n'est modifié par ce générateur
 */

// ─────────────────────────────────────────────────────────────────────────────
// IIFE — Immediately Invoked Function Expression
// Même principe que reading-progress.js : évite de polluer window.
// ─────────────────────────────────────────────────────────────────────────────
(function () {

  // ───────────────────────────────────────────────────────────────────────────
  // ATTENTE DU DOM
  // On attend que le HTML soit entièrement parsé avant d'agir.
  // ───────────────────────────────────────────────────────────────────────────
  window.addEventListener("DOMContentLoaded", function () {

    // ─────────────────────────────────────────────────────────────────────────
    // RÉCUPÉRATION DES ÉLÉMENTS DU DOM
    // On stocke les références une seule fois pour éviter de les
    // re-chercher à chaque interaction.
    // ─────────────────────────────────────────────────────────────────────────
    const form            = document.getElementById("generateur-form");
    const ficheContainer  = document.getElementById("fiche-container");
    const ficheContent    = document.getElementById("fiche-content");
    const btnImprimer     = document.getElementById("btn-imprimer");
    const btnCopier       = document.getElementById("btn-copier");
    const btnReset        = document.getElementById("btn-reset");
    const selectDiscipline = document.getElementById("select-discipline");
    const selectNiveau     = document.getElementById("select-niveau");
    const inputNom         = document.getElementById("input-nom");
    const inputMention     = document.getElementById("input-mention");

    // Garde-fou : si un élément est manquant, on sort silencieusement.
    // Cela évite des erreurs JS si la page est mal construite.
    if (!form || !ficheContainer) return;

    // ─────────────────────────────────────────────────────────────────────────
    // CONSTRUCTION DU FORMULAIRE DEPUIS LES DONNÉES (data-cadre.js)
    //
    // On remplit dynamiquement les <select> et les listes de cases à cocher
    // à partir des tableaux définis dans data-cadre.js.
    // Avantage : modifier les données ne nécessite pas de toucher au HTML.
    // ─────────────────────────────────────────────────────────────────────────

    // --- Remplissage du select "Discipline" ---
    // Pour chaque discipline du tableau, on crée un <option>
    DISCIPLINES.forEach(function (d) {
      const opt = document.createElement("option");
      opt.value = d.value;        // valeur interne (clé)
      opt.textContent = d.label;  // texte affiché à l'utilisateur
      selectDiscipline.appendChild(opt);
    });

    // --- Remplissage du select "Niveau" ---
    NIVEAUX.forEach(function (n) {
      const opt = document.createElement("option");
      opt.value = n.value;
      opt.textContent = n.label;
      selectNiveau.appendChild(opt);
    });

    // --- Fonction utilitaire : créer une liste de cases à cocher ---
    // Paramètres :
    //   containerId  → id du <div> conteneur dans le HTML
    //   items        → tableau d'objets { id, label, checked }
    //   namePrefix   → préfixe pour les attributs name des inputs
    function buildCheckboxList(containerId, items, namePrefix) {
      const container = document.getElementById(containerId);
      if (!container) return;

      items.forEach(function (item) {
        // Crée le wrapper <label> cliquable sur tout le texte
        const label = document.createElement("label");
        label.className = "gen-checkbox-label";
        label.htmlFor = namePrefix + "-" + item.id;

        // Crée la case à cocher
        const input = document.createElement("input");
        input.type    = "checkbox";
        input.id      = namePrefix + "-" + item.id;
        input.name    = namePrefix;        // groupe les checkboxes ensemble
        input.value   = item.label;        // valeur récupérée à la soumission
        input.checked = item.checked;      // état par défaut depuis data-cadre.js

        // Crée le texte de la case
        const span = document.createElement("span");
        span.textContent = item.label;

        // Assemble : <label><input><span></label>
        label.appendChild(input);
        label.appendChild(span);
        container.appendChild(label);
      });
    }

    // --- Remplissage des trois listes de cases à cocher ---
    buildCheckboxList("liste-autorises",  USAGES_AUTORISES,  "autorise");
    buildCheckboxList("liste-interdits",  USAGES_INTERDITS,  "interdit");
    buildCheckboxList("liste-outils",     OUTILS,            "outil");

    // ─────────────────────────────────────────────────────────────────────────
    // GÉNÉRATION DE LA FICHE
    //
    // Appelée au clic sur "Générer ma fiche".
    // Lit les valeurs du formulaire et construit le HTML de la fiche.
    // ─────────────────────────────────────────────────────────────────────────
    form.addEventListener("submit", function (e) {
      // Empêche le rechargement de la page (comportement natif d'un <form>)
      e.preventDefault();

      // --- Lecture des valeurs saisies ---

      // Texte affiché du <select> sélectionné (pas la value interne)
      const discipline = selectDiscipline.options[selectDiscipline.selectedIndex].text;
      const niveau     = selectNiveau.options[selectNiveau.selectedIndex].text;

      // Champs texte libres (trim() supprime les espaces en début/fin)
      const nomEnseignant = inputNom.value.trim();
      const mention       = inputMention.value.trim();

      // Date du jour formatée en français
      // toLocaleDateString("fr-FR") → "07/03/2026"
      // { dateStyle: "long" }       → "7 mars 2026"
      const dateAujourdhui = new Date().toLocaleDateString("fr-FR", { dateStyle: "long" });

      // --- Récupération des cases cochées ---
      // querySelectorAll retourne tous les inputs cochés pour chaque groupe.
      // Array.from + map extrait la valeur (= le texte de l'usage).
      function getChecked(name) {
        return Array.from(
          document.querySelectorAll('input[name="' + name + '"]:checked')
        ).map(function (input) { return input.value; });
      }

      const autorises = getChecked("autorise");
      const interdits = getChecked("interdit");
      const outils    = getChecked("outil");

      // --- Construction du HTML de la fiche ---
      // On assemble des blocs HTML en chaînes de caractères.
      // Chaque bloc est conditionnel : s'il n'y a rien à afficher, on n'affiche pas.

      // Bloc "Usages autorisés" : liste avec icône ✅
      const blocAutorises = autorises.length > 0
        ? '<div class="fiche-bloc fiche-autorises">' +
          '<h3>✅ Usages autorisés</h3><ul>' +
          autorises.map(function (u) { return "<li>" + u + "</li>"; }).join("") +
          "</ul></div>"
        : '<div class="fiche-bloc fiche-autorises"><h3>✅ Usages autorisés</h3>' +
          '<p class="fiche-vide">Aucun usage autorisé sélectionné.</p></div>';

      // Bloc "Usages interdits" : liste avec icône ❌
      const blocInterdits = interdits.length > 0
        ? '<div class="fiche-bloc fiche-interdits">' +
          '<h3>❌ Usages interdits</h3><ul>' +
          interdits.map(function (u) { return "<li>" + u + "</li>"; }).join("") +
          "</ul></div>"
        : '<div class="fiche-bloc fiche-interdits"><h3>❌ Usages interdits</h3>' +
          '<p class="fiche-vide">Aucun usage interdit sélectionné.</p></div>';

      // Bloc "Outils" : badges pill pour chaque outil coché
      const blocOutils = outils.length > 0
        ? '<div class="fiche-bloc fiche-outils">' +
          '<h3>🛠️ Outils autorisés</h3>' +
          '<div class="fiche-outils-liste">' +
          outils.map(function (o) {
            // Retrouve l'objet outil dans OUTILS pour avoir le logo
            const obj = OUTILS.find(function (tool) { return tool.label === o; });
            const logo = obj ? obj.logo + " " : "";
            return '<span class="fiche-outil-badge">' + logo + o + "</span>";
          }).join("") +
          "</div></div>"
        : "";

      // Bloc "Mention personnalisée" : affiché seulement si non vide
      const blocMention = mention
        ? '<div class="fiche-bloc fiche-mention"><p>📝 ' + mention + "</p></div>"
        : "";

      // Bloc "Signature" : zone à remplir à la main après impression
      const blocSignature =
        '<div class="fiche-signature">' +
        '<div class="fiche-signature-zone"><span>Signature de l\'enseignant·e</span></div>' +
        '<div class="fiche-signature-zone"><span>Signature de l\'élève / parents</span></div>' +
        "</div>";

      // Assemblage final de la fiche complète
      ficheContent.innerHTML =
        // En-tête de la fiche
        '<div class="fiche-header">' +
        '<div class="fiche-logo">DéclicIA</div>' +
        '<h2 class="fiche-titre">Cadre d\'usage de l\'IA</h2>' +
        '<div class="fiche-meta">' +
        '<span>📚 ' + discipline + '</span>' +
        '<span>🎓 ' + niveau + '</span>' +
        (nomEnseignant ? '<span>👤 ' + nomEnseignant + '</span>' : '') +
        '<span>📅 ' + dateAujourdhui + '</span>' +
        "</div>" +
        "</div>" +
        // Corps de la fiche : deux colonnes autorisés / interdits
        '<div class="fiche-corps">' +
        blocAutorises +
        blocInterdits +
        "</div>" +
        // Outils + mention + signature
        blocOutils +
        blocMention +
        blocSignature;

      // ───────────────────────────────────────────────────────────────────────
      // AFFICHAGE DE LA FICHE
      //
      // On retire la classe "hidden" pour rendre la section visible,
      // puis on scrolle doucement jusqu'à elle pour guider l'œil.
      // ───────────────────────────────────────────────────────────────────────
      ficheContainer.classList.remove("hidden");
      ficheContainer.scrollIntoView({ behavior: "smooth", block: "start" });
    });

    // ─────────────────────────────────────────────────────────────────────────
    // BOUTON "IMPRIMER"
    //
    // window.print() ouvre la boîte de dialogue d'impression du navigateur.
    // Le CSS (@media print dans styleGenerateur.css) masque le formulaire
    // et n'affiche que la fiche, pour un rendu propre sur papier ou en PDF.
    // ─────────────────────────────────────────────────────────────────────────
    if (btnImprimer) {
      btnImprimer.addEventListener("click", function () {
        window.print();
      });
    }

    // ─────────────────────────────────────────────────────────────────────────
    // BOUTON "COPIER LE TEXTE"
    //
    // navigator.clipboard.writeText() écrit dans le presse-papier.
    // C'est une API asynchrone (Promise) : on utilise .then() pour
    // confirmer la copie et .catch() pour gérer l'erreur (ex: HTTPS requis).
    //
    // innerText (pas innerHTML) : récupère le texte brut visible,
    // sans les balises HTML → propre à coller dans un email ou un doc.
    // ─────────────────────────────────────────────────────────────────────────
    if (btnCopier) {
      btnCopier.addEventListener("click", function () {
        const texte = ficheContent.innerText;

        navigator.clipboard.writeText(texte)
          .then(function () {
            // Feedback visuel temporaire : change le texte du bouton 2 secondes
            const originalText = btnCopier.textContent;
            btnCopier.textContent = "✅ Copié !";
            btnCopier.disabled = true;  // évite les double-clics
            setTimeout(function () {
              btnCopier.textContent = originalText;
              btnCopier.disabled = false;
            }, 2000);
          })
          .catch(function () {
            // Fallback si clipboard API non disponible (HTTP, vieux navigateur)
            alert("Impossible de copier automatiquement. Sélectionnez le texte manuellement (Ctrl+A puis Ctrl+C).");
          });
      });
    }

    // ─────────────────────────────────────────────────────────────────────────
    // BOUTON "NOUVELLE FICHE" (reset)
    //
    // form.reset() remet tous les champs du formulaire à leur état initial.
    // On cache ensuite la fiche et on scrolle vers le haut du formulaire.
    // ─────────────────────────────────────────────────────────────────────────
    if (btnReset) {
      btnReset.addEventListener("click", function () {
        form.reset();
        ficheContainer.classList.add("hidden");
        form.scrollIntoView({ behavior: "smooth", block: "start" });
      });
    }

  }); // fin DOMContentLoaded

})(); // fin IIFE
