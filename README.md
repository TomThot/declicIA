# DéclicIA

Site web éducatif sur l'intelligence artificielle en contexte scolaire.

Site en ligne: https://tomthot.github.io/declicIA/

## Objectif

DéclicIA propose:
- des contenus de vulgarisation sur l'IA
- un cadre institutionnel et des enjeux
- des outils concrets pour la classe
- des interactions front-end (menu, popups, quiz, thème clair/sombre)

## Stack

- HTML5
- CSS3
- JavaScript vanilla (pas de framework)
- Déploiement statique (GitHub Pages)

## Architecture du projet

```text
Mon site IA/
├─ index.html
├─ style.css
├─ script.js
├─ theme-sync.css
├─ theme-sync.js
├─ data-popups.js
├─ README.md
├─ .gitignore
├─ Images/
├─ LIA_cest_quoi/
│  ├─ indexIA.html
│  ├─ StyleIA.css
│  └─ scriptIA.js
├─ Cadre_et_défit/
│  ├─ IndexCadreDefi.html
│  ├─ StyletCadreDefi.css
│  └─ ScriptCadreDefi.js
├─ Outils_Classe/
│  ├─ IndexOutils.html
│  ├─ StyleOutils.css
│  └─ ScriptOutils.js
├─ Carousel_outilsIA/
│  ├─ Carousel_index.html
│  ├─ Carousel_style.css
│  ├─ Carousel_script.js
│  ├─ lart_du_prompt/
│  ├─ quelle_IA_choisir/
│  ├─ P2IA/
│  ├─ chatMD/
│  ├─ caramel/
│  ├─ dysfacile/
│  └─ notebookLM/
├─ Assistant_prompt/
├─ ContactFooter/
├─ doc/
├─ assets/
├─ tramePagesIndex.html
├─ tramePagesStyle.css
└─ tramePagesScript.js
```

## Pages principales

- Accueil: `index.html`
- L'IA c'est quoi: `LIA_cest_quoi/indexIA.html`
- Cadre et défis: `Cadre_et_défit/IndexCadreDefi.html`
- Outils pour la classe: `Outils_Classe/IndexOutils.html`
- Carousel outils: `Carousel_outilsIA/Carousel_index.html`

## Fonctionnement du thème

- Le thème est piloté par `data-theme` sur `<html>`.
- Persistance utilisateur via `localStorage` (`declicia-theme`).
- Scripts concernés:
  - `theme-sync.js` (pages secondaires)
  - `script.js` (page d'accueil)
- Styles globaux de thème: `theme-sync.css`.

## Développement local

1. Cloner le dépôt:

```bash
git clone https://github.com/TomThot/declicIA.git
cd declicIA
```

2. Ouvrir `index.html` dans le navigateur, ou lancer un serveur local (Live Server par exemple).

## Fichier .gitignore (état actuel)

Entrées présentes:

```gitignore
tramePagesIndex.html
tramePagesScript.js
tramePagesStyle.css
/ContactFooter
/assets
neurone.py
/Outils_classe
```

Notes importantes:
- Le dossier réel est `Outils_Classe` (majuscule `C`), pas `Outils_classe`.
- `neurone.py` est actuellement dans `doc/neurone.py` (pas à la racine).

## Contribution

1. Créer une branche:

```bash
git checkout -b feature/ma-modif
```

2. Committer:

```bash
git commit -m "Description claire"
```

3. Ouvrir une Pull Request.

## Contact

- Email: `tom.thot@gmail.com`
- GitHub: https://github.com/TomThot

## Licence

© 2026 DéclicIA - Tous droits réservés.
