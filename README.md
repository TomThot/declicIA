# DeclicIA

Site web educatif sur l'intelligence artificielle en contexte scolaire, pense pour les enseignants.

Site en ligne : [https://declicia.pages.dev/](https://declicia.pages.dev/)

## Objectif

DeclicIA propose :

- des contenus de vulgarisation sur l'IA (definitions, histoire, fonctionnement)
- un cadrage institutionnel et pedagogique pour l'usage en classe
- des fiches et outils concrets (prompting, choix d'outil, adaptation, etc.)
- des ressources interactives (lexique, FAQ, mythes vs realite, generateur de cadre d'usage)

## Stack technique

| Technologie | Usage |
|---|---|
| HTML5 | Structure semantique des pages |
| CSS3 | Mise en page, responsive, theming |
| JavaScript vanilla | Interactions, composants partages, carousel, recherche locale |
| Python | Scripts d'automatisation (veille, sitemap) |
| Cloudflare Pages | Hebergement statique |
| Cloudflare Functions | Endpoint Nutriscore / proxy Mistral |
| GitHub Actions | Publication automatique (veille + sitemap) |

Le projet ne depend d'aucun framework front ni de Node/NPM.

## Demarrage local

### Option 1 (rapide)

Ouvrir `index.html` directement dans un navigateur.

### Option 2 (recommandee)

Lancer un serveur local pour eviter les soucis de chemins/CORS :

```bash
python -m http.server 8000
```

Puis ouvrir `http://localhost:8000`.

## Scripts utiles

Installer les dependances Python :

```bash
pip install -r requirements.txt
```

Generer une veille IA (necessite `GROQ_API_KEY`) :

```bash
python scripts/generate_veille.py
```

Generer le sitemap :

```bash
python scripts/generate_sitemap.py
```

## Variables d'environnement

- `GROQ_API_KEY` : utilisee par `scripts/generate_veille.py`
- `MISTRAL_API_KEY` : utilisee cote Cloudflare Functions (`functions/nutriscore.js`)

## Automatisations GitHub Actions

- `.github/workflows/veille-ia-education.yml`
  - execution planifiee le dimanche a `07:00 UTC`
  - collecte RSS + synthese via Groq
  - mise a jour de `data/veille.json`

- `.github/workflows/generate-sitemap.yml`
  - declenchement sur push de fichiers `.html` et `doc/**/*.pdf`
  - regeneration de `sitemap.xml`
  - commit automatique du fichier genere

## Arborescence (principale)

```text
Mon site IA/
|- index.html
|- style.css
|- script.js
|- theme-sync.css / theme-sync.js
|- shared-components.css / shared-components.js
|- reading-progress.css / reading-progress.js
|- search-local.js
|- data-popups.js
|- functions/
|  |- nutriscore.js
|- scripts/
|  |- generate_veille.py
|  |- generate_sitemap.py
|- data/
|  |- veille.json
|- Carousel_outilsIA/
|- LIA_cest_quoi/
|- Cadre_et_défit/
|- subPages/
|- Contact/
|- Images/
|- doc/
`- .github/workflows/
```

## Pages principales

| Page | Fichier |
|---|---|
| Accueil | `index.html` |
| L'IA c'est quoi ? | `LIA_cest_quoi/indexIA.html` |
| Cadre et defis | `Cadre_et_défit/IndexCadreDefi.html` |
| Generateur de cadre d'usage | `Cadre_et_défit/Generateur_cadre/indexGenerateur.html` |
| Outils IA (carousel) | `Carousel_outilsIA/Carousel_index.html` |
| FAQ | `subPages/faq/indexFAQ.html` |
| Lexique | `subPages/lexique/indexLexique.html` |
| Veille IA | `subPages/veille-ia.html` |
| Contact | `Contact/contactIndex.html` |

## Contribution

```bash
git checkout -b feature/ma-modif
git commit -m "feat: description"
git push origin feature/ma-modif
```

Types de commits recommandes :

- `feat:` nouvelle fonctionnalite
- `fix:` correction de bug
- `content:` ajout/modification de contenu
- `style:` CSS ou mise en forme
- `refactor:` restructuration sans changement fonctionnel

## Contact

- Email : `tom.thot@gmail.com`
- GitHub : [https://github.com/TomThot](https://github.com/TomThot)

## Licence

© 2026 DeclicIA - Thomas BROUILLET. Tous droits reserves.
