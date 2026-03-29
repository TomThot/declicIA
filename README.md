# DéclicIA

Site web éducatif sur l’intelligence artificielle en contexte scolaire, destiné aux enseignants.

🌐 **Site en ligne :** [https://declicia.pages.dev/](https://declicia.pages.dev/)

---

## Objectif

DéclicIA propose :

- des contenus de vulgarisation sur l’IA (définitions, histoire, fonctionnement)
- le cadre institutionnel, les enjeux et les défis pour l’éducation
- des outils concrets pour la classe (chatbots, génération de contenu, aide aux dys, etc.)
- des ressources interactives : lexique, flipcards mythes/réalité, générateur de cadre d’usage, FAQ
- des interactions front‑end : menu responsive, thème clair/sombre, quiz de profil, barre de lecture

---

## Stack technique

| Technologie | Usage |
|---|---|
| HTML5 | Structure sémantique de toutes les pages |
| CSS3 | Mise en page, variables, thème, responsive, `@media print` |
| JavaScript vanilla | Interactions, composants partagés, quiz, carousel 3D |
| Cloudflare Pages | Déploiement statique, CDN mondial, HTTPS |
| Cloudflare Functions | API Nutriscore (proxy Mistral) |
| Python | Scripts d’automatisation (veille, sitemap) |
| GitHub Actions | Automatisation veille IA + génération sitemap |

Aucun framework, aucune dépendance NPM. Tout fonctionne en ouvrant `index.html` dans un navigateur.

---

## Architecture du projet

```text
Mon site IA/
├─ index.html                        ← Page d’accueil
├─ style.css                         ← Styles globaux
├─ script.js                         ← Script page d’accueil
├─ theme-sync.css                    ← Styles du thème clair/sombre (partagé)
├─ theme-sync.js                     ← Logique du thème (partagé)
├─ reading-progress.css              ← Barre de progression de lecture (partagé)
├─ reading-progress.js               ← Logique de la barre de lecture (partagé)
├─ shared-components.js              ← Injection sidebar, footer + CSS partagé
├─ shared-components.css             ← Styles sidebar et footer (injectés)
├─ search-local.js                   ← Moteur de recherche interne (partagé)
├─ data-popups.js                    ← Données des popups de la page d’accueil
├─ robots.txt                        ← Directives pour les robots de recherche
├─ sitemap.xml                       ← Plan du site (généré automatiquement)
├─ google2451f49a31f7902f.html       ← Vérification Google Search Console
├─ 404.html                          ← Page d’erreur personnalisée
├─ README.md
├─ .gitignore
│
├─ Images/                           ← Illustrations, logos, bannières, icônes
├─ assets/                           ← Sources de travail (non publiées)
│
├─ LIA_cest_quoi/                    ← "L’IA c’est quoi ?"
│  ├─ indexIA.html
│  ├─ StyleIA.css
│  └─ scriptIA.js
│
├─ Cadre_et_défit/                   ← "Cadre et défis"
│  ├─ IndexCadreDefi.html
│  ├─ StyletCadreDefi.css
│  ├─ ScriptCadreDefi.js
│  └─ Generateur_cadre/             ← Générateur de fiche cadre d’usage
│     ├─ indexGenerateur.html
│     ├─ styleGenerateur.css
│     ├─ scriptGenerateur.js
│     └─ data-cadre.js              ← Données (disciplines, niveaux, usages, outils)
│
├─ Carousel_outilsIA/                ← Galerie des outils IA
│  ├─ Carousel_index.html
│  ├─ Carousel_style.css
│  ├─ Carousel_script.js
│  ├─ lart_du_prompt/
│  ├─ quelle_IA_choisir/
│  ├─ P2IA/
│  ├─ chatMD/
│  ├─ caramel/
│  ├─ dysfacile/
│  ├─ notebookLM/
│  └─ napkin/
│
├─ subPages/                         ← Sous‑pages thématiques
│  ├─ faq/
│  ├─ lexique/
│  ├─ mythes_réalité/
│  ├─ tokenisation/
│  ├─ nutriscore/
│  └─ veille-ia.html
│
├─ css/                              ← Feuilles de style globales supplémentaires
│  └─ veille.css
│
├─ js/                               ← Scripts globaux supplémentaires
│  └─ veille.js
│
├─ data/                             ← Données JSON
│  └─ veille.json                   ← Articles de veille IA (généré automatiquement)
│
├─ functions/                        ← Cloudflare Functions
│  └─ nutriscore.js                 ← Proxy API Mistral pour Nutriscore
│
├─ scripts/                          ← Scripts d’automatisation
│  ├─ generate_veille.py            ← Génère la veille IA via Groq + RSS
│  └─ generate_sitemap.py           ← Génère sitemap.xml automatiquement
│
├─ .github/workflows/               ← GitHub Actions
│  ├─ veille-ia-education.yml       ← Veille IA hebdomadaire
│  └─ generate-sitemap.yml          ← Sitemap auto (à chaque modif HTML)
│
├─ Assistant_prompt/                 ← Assistant prompt (non publié)
├─ Contact/                          ← Page de contact
└─ doc/                              ← Ressources téléchargeables (PDF, documents)
```

---

## Pages principales

| Page | Fichier |
|---|---|
| Accueil | `index.html` |
| L’IA c’est quoi ? | `LIA_cest_quoi/indexIA.html` |
| Cadre et défis | `Cadre_et_défit/IndexCadreDefi.html` |
| Générateur de cadre d’usage | `Cadre_et_défit/Generateur_cadre/indexGenerateur.html` |
| Galerie des outils | `Carousel_outilsIA/Carousel_index.html` |
| Tokenisation | `subPages/tokenisation/indexTokensition.html` |
| Nutriscore cognitif | `subPages/nutriscore/indexNutriscore.html` |
| FAQ — IA en classe | `subPages/faq/indexFAQ.html` |
| Lexique | `subPages/lexique/indexLexique.html` |
| Mythes vs Réalité | `subPages/mythes_réalité/indexMythes.html` |
| Veille IA & Éducation | `subPages/veille-ia.html` |
| Contact | `Contact/contactIndex.html` |

---

## Composants partagés

Tous les composants réutilisables sont à la racine du projet et chargés via `<script>` ou `<link>` dans chaque page.

### Thème clair / sombre
- Piloté par l’attribut `data-theme` sur `<html>` (`"light"` ou `"dark"`)
- Persistance via `localStorage` (clé : `declicia-theme`)
- Détection automatique de la préférence système (`prefers-color-scheme`)
- Fichiers : `theme-sync.js` + `theme-sync.css`

> `theme-sync.js` est chargé sans `defer` en tout début de `<head>` pour éviter le flash clair → sombre au chargement.

### Barre de progression de lecture
- Apparaît uniquement si la page dépasse 1,5× la hauteur de la fenêtre
- Créée dynamiquement par JS (dégradation gracieuse si JS désactivé)
- Accessible : `role="progressbar"` + attributs ARIA
- Fichiers : `reading-progress.js` + `reading-progress.css`

### Sidebar / Footer / CSS partagé
- Injectés dynamiquement via des placeholders HTML :
```html
<div data-shared-sidebar data-base="../" data-current="lia"></div>
<div data-shared-footer data-base="../" data-current="lia"></div>
```
- `data-base` : chemin relatif vers la racine depuis la page courante
- `data-current` : clé de la page active (`home`, `lia`, `cadre`, `outils`, `faq`)
- `shared-components.js` injecte automatiquement `shared-components.css` dans le `<head>`
- Fichiers : `shared-components.js` + `shared-components.css`

### Recherche interne
- Recherche locale sur les titres et contenus des pages
- Chargée automatiquement par `shared-components.js`
- Fichier : `search-local.js`

---

## Automatisation GitHub Actions

### Veille IA hebdomadaire
- Déclenchée chaque dimanche à 7h UTC
- Collecte des flux RSS
- Synthèse via API Groq (LLaMA 3.3 70B)
- Résultat inséré en tête de `data/veille.json`
- Clé API stockée dans GitHub Actions Secrets (`GROQ_API_KEY`)
- Fichier : `.github/workflows/veille-ia-education.yml`

### Génération automatique du sitemap
- Déclenchée à chaque push modifiant un `.html` ou `.pdf`
- Parcourt tous les fichiers HTML publics du dépôt
- Récupère la date du dernier commit git pour chaque fichier (`lastmod`)
- Génère et commit `sitemap.xml` à la racine
- Fichier : `.github/workflows/generate-sitemap.yml`

---

## Développement local

```bash
# 1. Cloner le dépôt
git clone https://github.com/TomThot/declicIA.git
cd declicIA

# 2. Ouvrir dans le navigateur
# Option A : double-clic sur index.html
# Option B : Live Server (VS Code) pour éviter les problèmes CORS
```

Aucune installation, aucun `npm install` requis.

---

## Contribution

```bash
# Créer une branche de travail
git checkout -b feature/ma-modif

# Committer avec un message clair
git commit -m "feat: description de la modification"

# Pousser et ouvrir une Pull Request
git push origin feature/ma-modif
```

Convention de messages de commit recommandée :
- `feat:` nouvelle fonctionnalité
- `fix:` correction de bug
- `style:` modification CSS / mise en forme
- `content:` ajout ou modification de contenu
- `refactor:` restructuration sans changement fonctionnel

---

## Contact

- Email : `tom.thot@gmail.com`
- GitHub : [https://github.com/TomThot](https://github.com/TomThot)

---

## Licence

© 2026 DéclicIA — Thomas BROUILLET. Tous droits réservés.
